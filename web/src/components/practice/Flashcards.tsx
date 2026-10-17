"use client";

// 詞彙閃卡: glossary.json flashcards with a Leitner-box schedule kept in localStorage.
// This module is loaded lazily (next/dynamic) so the glossary only ships when the mode opens.

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import glossary from "@/content/glossary.json";
import { SOURCE_LABEL, type GlossaryEntry } from "@/lib/glossary";
import { buildDeck, grade, resetCards, statusOf, useCards, type CardMap } from "@/lib/practice/leitner";
import { shuffle } from "@/lib/practice/random";
import { recordSession, type SessionResult } from "@/lib/practice/stats";
import { dayNumber } from "@/lib/practice/storage";
import Summary from "./Summary";
import { Btn, Panel, ProgressBar } from "./ui";

const ENTRIES = glossary as GlossaryEntry[];
const BY_ID = new Map(ENTRIES.map((e) => [e.id, e]));
const CATEGORIES = [...new Set(ENTRIES.map((e) => e.category))];
const DECK_SIZE = 10;

type Direction = "ja-zh" | "zh-ja";

function counts(ids: readonly string[], cards: CardMap) {
  const c = { new: 0, learning: 0, mastered: 0, due: 0 };
  const today = dayNumber();
  for (const id of ids) {
    const s = cards[id];
    c[statusOf(s)]++;
    if (s && s.d <= today) c.due++;
  }
  return c;
}

const chip = (on: boolean) =>
  `min-h-11 rounded-full border px-3.5 text-sm transition-colors ${on ? "border-ink bg-ink text-paper" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`;

export default function Flashcards({ onExit }: { onExit: () => void }) {
  const cards = useCards();
  const [category, setCategory] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction>("ja-zh");
  const [withDisputed, setWithDisputed] = useState(false);
  const [run, setRun] = useState<{ queue: string[]; pos: number; requeued: string[]; first: Record<string, boolean> } | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState<{ remembered: number; total: number; result: SessionResult | null } | null>(null);
  const [emptyNote, setEmptyNote] = useState(false);
  const backRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLButtonElement>(null);

  const pool = useMemo(
    () => ENTRIES.filter((e) => (withDisputed || !e.disputed) && (!category || e.category === category)).map((e) => e.id),
    [category, withDisputed],
  );
  const catCount = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of ENTRIES) if (withDisputed || !e.disputed) m[e.category] = (m[e.category] ?? 0) + 1;
    return m;
  }, [withDisputed]);
  const stat = counts(pool, cards);

  useEffect(() => {
    if (flipped) backRef.current?.focus();
    else if (run) flipRef.current?.focus();
  }, [flipped, run]);

  const start = (ahead = false) => {
    const deck = buildDeck(pool, cards, DECK_SIZE, dayNumber(), ahead);
    if (!deck.length) {
      setEmptyNote(true);
      setDone(null);
      return;
    }
    setEmptyNote(false);
    setRun({ queue: shuffle(deck), pos: 0, requeued: [], first: {} });
    setFlipped(false);
    setDone(null);
  };

  const answer = (remembered: boolean) => {
    if (!run) return;
    const id = run.queue[run.pos];
    try {
      grade(id, remembered);
    } catch {
      /* storage failure: keep going in memory */
    }
    const first = id in run.first ? run.first : { ...run.first, [id]: remembered };
    const requeue = !remembered && !run.requeued.includes(id);
    const queue = requeue ? [...run.queue, id] : run.queue;
    const requeued = requeue ? [...run.requeued, id] : run.requeued;
    if (run.pos + 1 >= queue.length) {
      const total = Object.keys(first).length;
      const ok = Object.values(first).filter(Boolean).length;
      let result: SessionResult | null = null;
      try {
        result = recordSession("cards", ok, total);
      } catch {
        result = null;
      }
      setRun(null);
      setDone({ remembered: ok, total, result });
    } else {
      setRun({ queue, pos: run.pos + 1, requeued, first });
    }
    setFlipped(false);
  };

  const onKey = (e: KeyboardEvent) => {
    if (!run || !flipped || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "1") {
      e.preventDefault();
      answer(false);
    } else if (e.key === "2") {
      e.preventDefault();
      answer(true);
    }
  };

  /* ───────── end of session ───────── */
  if (done) {
    return (
      <div className="space-y-4">
        <Summary
          correct={done.remembered}
          total={done.total}
          unit="張記得"
          result={done.result}
          onRestart={() => start(false)}
          onExit={onExit}
        />
        <Overview stat={stat} total={pool.length} />
      </div>
    );
  }

  /* ───────── running ───────── */
  if (run) {
    const e = BY_ID.get(run.queue[run.pos]);
    if (!e) return null;
    const jaFront = direction === "ja-zh";
    const face = `motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:starting:opacity-0 motion-safe:starting:[transform:perspective(800px)_rotateY(70deg)]`;
    return (
      <Panel>
        <div onKeyDown={onKey}>
          <ProgressBar value={run.pos} max={run.queue.length} label="這一輪的進度" />
          <p className="mt-3 text-xs text-muted">
            {e.category}
            {e.disputed && <span className="ml-2 text-vermilion">說法不一</span>}
          </p>

          <div key={`${e.id}-${flipped ? "b" : "f"}`} className={`mt-2 min-h-56 rounded-2xl border-2 border-wood/40 bg-paper p-5 ${face}`}>
            {!flipped ? (
              <div className="flex min-h-46 flex-col items-center justify-center text-center">
                {jaFront ? (
                  <>
                    <p lang="ja" className="text-4xl leading-tight font-semibold">
                      {e.kanji}
                    </p>
                    <p lang="ja" className="mt-2 text-lg text-muted">
                      {e.kana}
                    </p>
                  </>
                ) : (
                  <p className="text-xl leading-relaxed font-semibold">{e.zh}</p>
                )}
                <p className="mt-4 text-sm text-muted">{jaFront ? "中文是什麼意思？" : "日文怎麼說？"}</p>
              </div>
            ) : (
              <div ref={backRef} tabIndex={-1} aria-live="polite" className="outline-none">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span lang="ja" className="text-2xl font-semibold">
                    {e.kanji}
                  </span>
                  <span lang="ja" className="text-base text-muted">
                    {e.kana}
                  </span>
                  <span className="text-sm text-muted">{e.romaji}</span>
                </p>
                <p className="mt-3 text-[17px] leading-relaxed">{e.zh}</p>
                {e.note && <p className="mt-2 text-sm leading-relaxed text-muted">{e.note}</p>}
                <p className="mt-3 text-xs text-muted">出處：{e.source.map((s) => SOURCE_LABEL[s] ?? s).join("、")}</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            {!flipped ? (
              <Btn ref={flipRef} variant="primary" onClick={() => setFlipped(true)} className="min-h-12 w-full text-base">
                <span aria-hidden="true">↻</span> 翻面看答案
              </Btn>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Btn onClick={() => answer(false)} className="min-h-14 border-vermilion/60 text-base text-vermilion">
                  <span aria-hidden="true">✗</span> 不熟
                </Btn>
                <Btn onClick={() => answer(true)} className="min-h-14 border-indigo/60 text-base text-indigo">
                  <span aria-hidden="true">✓</span> 記得
                </Btn>
              </div>
            )}
          </div>
          <p className="mt-3 hidden text-xs text-muted sm:block">鍵盤：Enter 翻面；翻面後按 1 不熟、2 記得。</p>
          <div className="mt-3 flex justify-end">
            <Btn variant="ghost" onClick={() => setRun(null)}>
              結束這一輪
            </Btn>
          </div>
        </div>
      </Panel>
    );
  }

  /* ───────── setup ───────── */
  const toStart = buildDeck(pool, cards, DECK_SIZE, dayNumber()).length;
  return (
    <div className="space-y-4">
      <Panel>
        <h3 className="text-sm font-bold text-muted" id="fc-cat">
          分類
        </h3>
        <div role="group" aria-labelledby="fc-cat" className="mt-2 flex flex-wrap gap-1.5">
          <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)} className={chip(category === null)}>
            全部
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={chip(category === c)}>
              {c} <span className="tabular-nums opacity-70">{catCount[c] ?? 0}</span>
            </button>
          ))}
        </div>

        <h3 className="mt-4 text-sm font-bold text-muted" id="fc-dir">
          方向
        </h3>
        <div role="group" aria-labelledby="fc-dir" className="mt-2 grid grid-cols-2 gap-1.5 sm:inline-grid">
          <button type="button" aria-pressed={direction === "ja-zh"} onClick={() => setDirection("ja-zh")} className={chip(direction === "ja-zh")}>
            日文 → 中文
          </button>
          <button type="button" aria-pressed={direction === "zh-ja"} onClick={() => setDirection("zh-ja")} className={chip(direction === "zh-ja")}>
            中文 → 日文
          </button>
        </div>

        <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={withDisputed} onChange={(ev) => setWithDisputed(ev.target.checked)} className="h-5 w-5 accent-[var(--wood)]" />
          也練「說法不一」的詞（預設不含）
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Btn variant="primary" onClick={() => start(false)} className="min-h-12 flex-1 text-base sm:flex-none">
            開始{toStart ? `（${toStart} 張）` : ""}
          </Btn>
        </div>
        <div aria-live="polite">
          {emptyNote && (
            <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm leading-relaxed">
              <p>這個分類今天沒有到期的卡片了，每一張都看過了。</p>
              <Btn onClick={() => start(true)} className="mt-2">
                提前複習 {Math.min(DECK_SIZE, pool.length)} 張
              </Btn>
            </div>
          )}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          每輪最多 {DECK_SIZE} 張：先複習到期的，再加新卡。按「記得」的卡會隔 1、3、7、14 天再出現；「不熟」的會在這一輪最後再出現一次，明天再複習。進度只存在這台裝置。
        </p>
      </Panel>
      <Overview stat={stat} total={pool.length} />
      {stat.learning + stat.mastered > 0 && (
        <p className="text-right">
          <Btn
            variant="ghost"
            onClick={() => {
              if (window.confirm(`把「${category ?? "全部"}」的 ${stat.learning + stat.mastered} 張卡片進度歸零？`)) resetCards(pool);
            }}
          >
            重設這個分類的進度
          </Btn>
        </p>
      )}
    </div>
  );
}

function Overview({ stat, total }: { stat: ReturnType<typeof counts>; total: number }) {
  const parts = [
    { key: "mastered", label: "已熟", n: stat.mastered, cls: "bg-indigo" },
    { key: "learning", label: "學習中", n: stat.learning, cls: "bg-wood" },
    { key: "new", label: "未學", n: stat.new, cls: "bg-surface-2" },
  ];
  return (
    <Panel>
      <h3 className="text-sm font-bold text-muted">進度（{total} 張）</h3>
      <div aria-hidden="true" className="mt-3 flex h-3 overflow-hidden rounded-full border border-line">
        {parts.map((p) => (p.n ? <div key={p.key} className={p.cls} style={{ width: `${(p.n / Math.max(1, total)) * 100}%` }} /> : null))}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        {parts.map((p) => (
          <div key={p.key} className="rounded-xl bg-paper px-2 py-2">
            <dt className="flex items-center justify-center gap-1.5 text-muted">
              <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-full border border-line ${p.cls}`} />
              {p.label}
            </dt>
            <dd className="text-lg font-semibold tabular-nums">{p.n}</dd>
          </div>
        ))}
      </dl>
      {stat.due > 0 && <p className="mt-2 text-sm text-muted">今天該複習：{stat.due} 張</p>}
    </Panel>
  );
}
