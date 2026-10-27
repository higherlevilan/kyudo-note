"use client";

// 過關測驗 for a 關卡 (TechEDU HC.quiz), from its extras.quiz. Looks like the practice QuickCheck:
// immediate feedback with the explanation and sources. Once every question is answered the score
// is saved (saveQuiz), which counts towards the chapter ring and the badge. 小弓 reacts to each
// answer; 「重做」 starts a fresh attempt. Renders nothing while the chapter has no questions.

import { useId, useRef, useState } from "react";
import Mascot from "@/components/mascot/Mascot";
import { More, SourceLinks, TagChip, Verdict } from "@/components/practice/ui";
import { CHAPTER_BY_ID } from "@/content/course/chapters";
import { saveQuiz, useCourseProgress } from "@/lib/course/progress";
import type { ChapterId, Mood } from "@/lib/course/types";
import { confettiFrom } from "./confetti";

const CHEER = ["答對了！", "漂亮，正中。", "穩！", "這題很多人會錯，你沒有。"];
const OOPS = ["沒關係，錯的題目最好記。", "差一點！看一下解釋。", "這題有陷阱，小弓以前也錯過。"];

function verdictLine(correct: number, total: number): { mood: Mood; line: string } {
  if (correct === total) return { mood: "wow", line: "全對！小弓幫你蓋上朱印了。" };
  if (correct >= total * 0.6) return { mood: "happy", line: "過關！錯的題目回去讀一次那一節就懂了。" };
  return { mood: "oops", line: "這一輪偏了一點。調整呼吸，按「重做」再射一次。" };
}

export default function ChapterQuiz({ chapter, title = "過關測驗" }: { chapter: ChapterId; title?: string }) {
  const ch = CHAPTER_BY_ID[chapter];
  const qs = ch.quiz;
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [last, setLast] = useState<{ qi: number; ok: boolean } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const saved = useRef(false);
  const uid = useId();
  const prev = useCourseProgress().quiz[chapter];
  if (!qs.length) return null;

  const answered = qs.filter((q) => picked[q.id] !== undefined).length;
  const correct = qs.filter((q) => picked[q.id] === q.answer).length;
  const finished = answered === qs.length;

  const pick = (qi: number, i: number, el: HTMLElement) => {
    const q = qs[qi];
    if (picked[q.id] !== undefined) return;
    const next = { ...picked, [q.id]: i };
    const ok = i === q.answer;
    setPicked(next);
    setLast({ qi, ok });
    if (ok) confettiFrom(el, 18);
    const done = qs.every((x) => next[x.id] !== undefined);
    if (done && !saved.current) {
      saved.current = true;
      saveQuiz(
        chapter,
        qs.filter((x) => next[x.id] === x.answer).length,
        qs.length,
      );
    }
  };

  const retry = () => {
    setPicked({});
    setLast(null);
    setAttempt((a) => a + 1);
    saved.current = false;
    document.getElementById("quiz")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  const reaction = finished
    ? verdictLine(correct, qs.length)
    : last
      ? { mood: (last.ok ? "wow" : "oops") as Mood, line: last.ok ? CHEER[last.qi % CHEER.length] : OOPS[last.qi % OOPS.length] }
      : { mood: "think" as Mood, line: "一題一題來，點選項就會看到解釋與出處。" };

  return (
    <section id="quiz" aria-labelledby={`${uid}-title`} className="mt-16 scroll-mt-20 rounded-2xl border border-wood/40 bg-wood-soft/40 p-4 sm:p-6">
      <header>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-[0.14em] text-wood tabular-nums">{ch.tag} · 過關測驗</span>
          <span aria-hidden="true" className="h-px flex-1 bg-wood/30" />
          {prev && !finished && (
            <span className="shrink-0 text-xs text-muted tabular-nums">
              上次 {prev.correct} / {prev.total}
              {prev.best !== undefined && prev.best !== prev.correct && `・最佳 ${prev.best}`}
            </span>
          )}
        </div>
        <h2 id={`${uid}-title`} className="mt-2 text-2xl font-bold">
          {title}
        </h2>
        <p className="mt-1 text-muted">{qs.length} 題，答錯不扣分，放心按。全部作答後成績會記在這台瀏覽器。</p>
      </header>

      <ol key={attempt} className="mt-5 space-y-4">
        {qs.map((q, qi) => {
          const p = picked[q.id];
          const done = p !== undefined;
          const ok = p === q.answer;
          return (
            <li key={q.id} className="rounded-xl border border-line bg-surface p-4">
              {q.topic && <p className="mb-1 text-xs text-muted">{q.topic}</p>}
              <p id={`${uid}-${q.id}`} className="font-semibold leading-relaxed">
                <span className="mr-1.5 text-wood tabular-nums">Q{qi + 1}.</span>
                {q.prompt}
              </p>
              {q.quote && <blockquote className="mt-2 border-l-2 border-wood/50 pl-3 text-[15px] leading-relaxed text-muted">{q.quote}</blockquote>}
              <div role="group" aria-labelledby={`${uid}-${q.id}`} className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.options.map((o, i) => {
                  const isAnswer = i === q.answer;
                  const isPicked = i === p;
                  let look = "border-field-border bg-paper hover:border-wood hover:bg-surface-2";
                  if (done) {
                    if (isAnswer) look = "border-indigo bg-indigo/10";
                    else if (isPicked) look = "border-vermilion bg-vermilion/10";
                    else look = "border-line bg-paper opacity-60";
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-disabled={done}
                      aria-pressed={isPicked}
                      onClick={(e) => pick(qi, i, e.currentTarget)}
                      className={`flex min-h-11 w-full items-center gap-2 rounded-xl border-2 px-3.5 py-2 text-left text-[15px] transition-colors ${look}`}
                    >
                      <span className="flex-1">
                        <span lang={o.ja ? "ja" : undefined}>{o.text}</span>
                        {o.sub && <span className="block text-xs text-muted">{o.sub}</span>}
                      </span>
                      {done && isAnswer && (
                        <span className="shrink-0 text-sm font-bold text-indigo">
                          <span aria-hidden="true">✓ </span>正解
                        </span>
                      )}
                      {done && isPicked && !isAnswer && (
                        <span className="shrink-0 text-sm font-bold text-vermilion">
                          <span aria-hidden="true">✗ </span>你選的
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite">
                {done && (
                  <div className="mt-3 border-t border-line pt-3">
                    <Verdict ok={ok} />
                    <p className="mt-1.5 text-[15px] leading-relaxed">
                      {q.tag && (
                        <span className="mr-1.5 align-[1px]">
                          <TagChip tag={q.tag} />
                        </span>
                      )}
                      {q.explain}
                    </p>
                    <SourceLinks src={q.src} />
                    <More link={q.more} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-3 sm:p-4">
        <Mascot mood={reaction.mood} size={52} key={`${reaction.mood}-${answered}`} className="course-pop shrink-0" />
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="flex items-baseline gap-2">
            <b className="text-2xl tabular-nums">
              {correct} / {qs.length}
            </b>
            <span className="text-sm text-muted">{finished ? "成績已記錄" : `已作答 ${answered} 題`}</span>
          </p>
          <p className="text-[15px] leading-relaxed">{reaction.line}</p>
        </div>
        {finished && (
          <button
            type="button"
            onClick={retry}
            className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-field-border bg-surface px-4 text-[15px] font-semibold text-ink hover:bg-surface-2"
          >
            <span aria-hidden="true">↻</span> 重做
          </button>
        )}
      </div>
    </section>
  );
}
