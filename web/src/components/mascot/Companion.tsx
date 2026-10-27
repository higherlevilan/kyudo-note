"use client";
// Corner 小弓 (like TechEDU's companion 雲寶): bottom-left, above the safe-area inset, clear of the
// ReadingTools buttons on the right. Tap for a route-aware tip (src/content/course/tips.ts);
// 「收起小弓」 folds it into a tiny pill (remembered on this device). First visit: one greeting,
// after the reader's first scroll or tap (so it never sits on the page before they start reading).
// On phones it steps aside while a Stepper / 3D figure is in the middle of the screen (./avoid.ts).
// No live region: quiz and badge results are announced once by the course engine (CourseToasts /
// ChapterQuiz); a tip is ordinary text in the bubble next to the button (aria-controls).
//
// Reactions (window CustomEvents dispatched by the course engine):
//   course:seen  {chapter, section}       → a small happy hop (no bubble)
//   course:quiz  {chapter, correct, total} → mood + a short line
//   course:badge {chapter}                 → mood + a short line
//   mascot:say   {html, mood?, ms?}        → say an arbitrary line (html: <b>/<i>/<br> only)
// One bubble at a time; reaction lines auto-dismiss, are throttled, never replace an open tip,
// and on phones only change the mood (automatic chatter would cover the text there).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Mood } from "@/lib/course/types";
import { loadTips } from "@/content/course/tips-routes";
import Mascot from "./Mascot";
import { sanitizeSayHtml } from "./sanitize";
import { AVOID_EVENT, type AvoidDetail } from "./avoid";

// ---- remembered state (hidden / greeted), with an in-memory fallback when storage is blocked ----

const KEY = "kyudo-note:mascot";
type Saved = { min?: 1; greeted?: 1 };

let memory = "{}";
const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

function parse(raw: string | null): Saved | null {
  if (raw === null) return null;
  try {
    const o = JSON.parse(raw);
    return o && typeof o === "object" ? (o as Saved) : {};
  } catch {
    return {};
  }
}

function save(patch: { min?: 1 | null; greeted?: 1 }) {
  const next: Record<string, unknown> = { ...parse(readRaw()), ...patch };
  for (const k of Object.keys(next)) if (next[k] === null || next[k] === undefined) delete next[k];
  memory = JSON.stringify(next);
  try {
    localStorage.setItem(KEY, memory);
  } catch {
    /* private mode: keep it for this page view */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    removeEventListener("storage", onStorage);
  };
}

// ---- lines ----

const GREETING = "嗨！我是<b>小弓</b>，會一直待在這個角落。想看這一頁的小提醒就點我；嫌我擋路，也可以把我收起來。";
const QUIZ_FULL = ["全對！這一關的重點你都抓到了。", "滿分！不過真正的考場在射場上，下次稽古見。"];
const QUIZ_GOOD = ["過關！錯的那幾題看一下解說，最記得住。", "不錯喔！再看一次錯的題目就更穩了。"];
const QUIZ_RETRY = ["沒關係，錯的題目最好記。看完解說再挑戰一次？", "差一點！先看解說，等一下再來一次。"];
const BADGE = ["過關！新徽章收進修煉路線圖了。", "拿到徽章了！休息一下，喝口水再進下一關。"];

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

type BubbleKind = "tip" | "react" | "greet";
interface Bubble {
  kind: BubbleKind;
  html: string;
  mood: Mood;
  href?: string;
  id: number;
}

const FIELD =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, select, [contenteditable=""], [contenteditable="true"]';
const isField = (el: EventTarget | null) => el instanceof Element && el.matches(FIELD);
const isPhone = () => matchMedia("(max-width: 639px)").matches;

export default function Companion() {
  const pathname = usePathname() ?? "/";
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const saved = parse(raw);
  const ready = saved !== null;
  const hidden = saved?.min === 1;
  const greeted = saved?.greeted === 1;

  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [flashMood, setFlashMood] = useState<Mood | null>(null);
  const [jump, setJump] = useState(0);
  const [typing, setTyping] = useState(false);
  const [avoid, setAvoid] = useState(false);
  const [focusIn, setFocusIn] = useState(false);

  // Close the bubble when the route changes (adjusting state during render, not in an effect).
  const [route, setRoute] = useState(pathname);
  if (route !== pathname) {
    setRoute(pathname);
    setBubble(null);
  }

  const seq = useRef(0);
  const tipIdx = useRef(new Map<string, number>());
  const flashT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const autoT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastReact = useRef(0);
  const lastHop = useRef(0);
  const bubbleRef = useRef<Bubble | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    bubbleRef.current = bubble;
  }, [bubble]);

  const flash = useCallback((mood: Mood, ms: number) => {
    setFlashMood(mood);
    setJump((j) => j + 1);
    clearTimeout(flashT.current);
    flashT.current = setTimeout(() => setFlashMood(null), ms);
  }, []);

  const show = useCallback((b: Omit<Bubble, "id">, ms?: number) => {
    const id = ++seq.current;
    setBubble({ ...b, id });
    clearTimeout(autoT.current);
    if (ms) autoT.current = setTimeout(() => setBubble((cur) => (cur?.id === id ? null : cur)), ms);
  }, []);

  const close = useCallback(() => {
    clearTimeout(autoT.current);
    setBubble(null);
  }, []);

  const nextTip = useCallback(() => {
    // Only this route's tips are downloaded, on the first tap.
    void loadTips(pathname).then((tips) => {
      if (!tips.length) return;
      const seen = tipIdx.current.get(pathname);
      const i = seen === undefined ? Math.floor(Math.random() * tips.length) : (seen + 1) % tips.length;
      tipIdx.current.set(pathname, i);
      const t = tips[i];
      const mood = t.mood ?? "happy";
      show({ kind: "tip", html: t.text, mood, href: t.href });
      flash(mood, 1200);
    });
  }, [pathname, show, flash]);

  /** A line the reader didn't ask for: throttled, never over an open tip, mood only on phones. */
  const react = useCallback(
    (html: string, mood: Mood, ms = 4200) => {
      flash(mood, 2000);
      const now = Date.now();
      if (now - lastReact.current < 4000) return;
      if (bubbleRef.current?.kind === "tip" || isPhone()) return;
      lastReact.current = now;
      show({ kind: "react", html, mood }, ms);
    },
    [flash, show],
  );

  // First visit: one greeting, shortly after the first scroll or tap (skipped if a tip is already open).
  useEffect(() => {
    if (!ready || hidden || greeted) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const off = () => {
      removeEventListener("scroll", start);
      removeEventListener("pointerdown", start);
    };
    function start() {
      off();
      t = setTimeout(() => {
        save({ greeted: 1 });
        if (bubbleRef.current) return;
        show({ kind: "greet", html: GREETING, mood: "wow" }, 6000);
        flash("wow", 1600);
      }, 700);
    }
    addEventListener("scroll", start, { passive: true });
    addEventListener("pointerdown", start, { passive: true });
    return () => {
      off();
      clearTimeout(t);
    };
  }, [ready, hidden, greeted, show, flash]);

  // Phones: step aside while a Stepper / 3D figure is in the middle of the screen.
  useEffect(() => {
    const on = new Set<Element>();
    const onAvoid = (e: Event) => {
      const d = (e as CustomEvent<AvoidDetail>).detail;
      if (!d?.el) return;
      if (d.on) on.add(d.el);
      else on.delete(d.el);
      setAvoid(on.size > 0);
    };
    addEventListener(AVOID_EVENT, onAvoid);
    return () => removeEventListener(AVOID_EVENT, onAvoid);
  }, []);

  // Reactions to the course engine.
  useEffect(() => {
    if (!ready || hidden) return;
    const onSeen = () => {
      const now = Date.now();
      if (now - lastHop.current < 1500) return;
      lastHop.current = now;
      flash("happy", 1200);
    };
    const onQuiz = (e: Event) => {
      const d = (e as CustomEvent<{ correct?: number; total?: number }>).detail ?? {};
      const total = Number(d.total) || 0;
      if (!total) return;
      const r = (Number(d.correct) || 0) / total;
      if (r >= 1) react(pick(QUIZ_FULL), "wow");
      else if (r >= 0.6) react(pick(QUIZ_GOOD), "happy");
      else react(pick(QUIZ_RETRY), "oops");
    };
    const onBadge = () => react(pick(BADGE), "wow", 5000);
    const onSay = (e: Event) => {
      const d = (e as CustomEvent<{ html?: string; mood?: Mood; ms?: number }>).detail;
      if (d?.html) react(d.html, d.mood ?? "happy", d.ms);
    };
    addEventListener("course:seen", onSeen);
    addEventListener("course:quiz", onQuiz);
    addEventListener("course:badge", onBadge);
    addEventListener("mascot:say", onSay);
    return () => {
      removeEventListener("course:seen", onSeen);
      removeEventListener("course:quiz", onQuiz);
      removeEventListener("course:badge", onBadge);
      removeEventListener("mascot:say", onSay);
    };
  }, [ready, hidden, flash, react]);

  // Step aside while a text field has focus (the phone keyboard needs the room).
  useEffect(() => {
    const onIn = (e: FocusEvent) => setTyping(isField(e.target));
    const onOut = () => setTimeout(() => setTyping(isField(document.activeElement)), 0);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  // Escape closes the bubble.
  useEffect(() => {
    if (!bubble) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [bubble, close]);

  useEffect(
    () => () => {
      clearTimeout(flashT.current);
      clearTimeout(autoT.current);
    },
    [],
  );

  if (!ready) return null; // server render and hydration: storage not read yet

  const hide = () => {
    close();
    save({ min: 1 });
  };
  const restore = () => {
    save({ min: null });
    flash("wow", 900);
    setTimeout(() => btnRef.current?.focus(), 0);
  };
  const onMascot = () => {
    if (bubble?.kind === "tip") close();
    else nextTip();
  };

  const mood: Mood = flashMood ?? bubble?.mood ?? "happy";
  const small = "inline-flex h-10 items-center rounded-full border px-3 text-[0.8rem]";
  // Fades out (and stops taking taps) on phones only; kept while it holds keyboard focus.
  const aside = avoid && !focusIn;

  return (
    <div
      data-mascot-companion=""
      onFocus={() => setFocusIn(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setFocusIn(false)}
      className={`mascot-companion pointer-events-none fixed left-[max(0.75rem,env(safe-area-inset-left))] lg:left-[calc(var(--side-w)+0.75rem)] z-30 flex flex-col items-start gap-1.5 transition-opacity duration-200 print:hidden ${
        typing ? "hidden" : ""
      } ${aside ? "max-sm:invisible max-sm:opacity-0" : ""}`}
    >
      {hidden ? (
        <button
          type="button"
          onClick={restore}
          aria-label="叫出小弓"
          className="pointer-events-auto inline-flex h-10 items-center gap-1 rounded-full border border-line bg-surface/90 pr-3 pl-1.5 text-xs text-muted shadow-sm backdrop-blur hover:border-wood hover:text-ink"
        >
          <Mascot mood="happy" size={24} />
          小弓
        </button>
      ) : (
        <>
          {bubble && (
            <div
              key={bubble.id}
              id="mascot-companion-bubble"
              data-kind={bubble.kind}
              className="mascot-companion-bubble pointer-events-auto relative w-max max-w-[min(20rem,calc(100vw-7.5rem))] rounded-2xl rounded-bl-sm border border-wood/60 bg-surface px-3.5 pt-2.5 pb-2.5 text-sm leading-relaxed text-ink shadow-lg"
            >
              <span className="block pr-8 text-xs font-semibold tracking-wide text-wood">
                {bubble.kind === "tip" ? "小弓小提醒" : "小弓"}
              </span>
              <p className="pr-2 [&_b]:font-semibold" dangerouslySetInnerHTML={{ __html: sanitizeSayHtml(bubble.html) }} />
              {bubble.href && (
                <Link href={bubble.href} onClick={close} className="mt-1 inline-block text-[0.8rem] font-medium text-wood underline-offset-2 hover:underline">
                  去看看 →
                </Link>
              )}
              {bubble.kind === "tip" && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button type="button" onClick={nextTip} className={`${small} border-field-border bg-surface text-ink hover:bg-surface-2`}>
                    再一則
                  </button>
                  <button type="button" onClick={hide} className={`${small} border-line text-muted hover:bg-surface-2 hover:text-ink`}>
                    收起小弓
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={close}
                aria-label="關閉"
                className="absolute top-0 right-0 flex h-10 w-10 items-center justify-center rounded-full text-sm text-muted hover:bg-surface-2 hover:text-ink"
              >
                ✕
              </button>
            </div>
          )}
          <button
            ref={btnRef}
            type="button"
            onClick={onMascot}
            aria-label="小弓：點我看這一頁的小提醒"
            aria-expanded={bubble?.kind === "tip"}
            aria-controls={bubble ? "mascot-companion-bubble" : undefined}
            className="mascot-companion-btn pointer-events-auto -ml-1 rounded-2xl leading-none"
          >
            <Mascot key={jump} mood={mood} size={52} bob className={jump ? "mascot-jump" : undefined} />
          </button>
        </>
      )}
    </div>
  );
}
