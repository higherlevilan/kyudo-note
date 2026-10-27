"use client";

// The interactive part of a 過關測驗 (see ./ChapterQuiz, which passes the already-shuffled
// questions). Looks like the practice QuickCheck: immediate feedback with the explanation and
// sources. Once every question is answered the score is saved (saveQuiz); it counts towards the
// ring and the badge only at 60% or better (passScore). The result panel offers 「重做」, the
// next chapter, and a list of the wrong answers linking back to their 小節.
// The final result is announced once, by this panel's live region (the score toast is visual).

import Link from "next/link";
import { useId, useRef, useState } from "react";
import Mascot from "@/components/mascot/Mascot";
import { More, SourceLinks, TagChip, Verdict } from "@/components/practice/ui";
import { CHAPTER_BY_ID, nextChapter } from "@/content/course/registry";
import { bestScore, passScore, quizPassed, saveQuiz, useCourseProgress } from "@/lib/course/progress";
import type { ChapterId, Mood } from "@/lib/course/types";
import type { ChoiceQuestion } from "@/lib/practice/types";
import { confettiFrom } from "./confetti";

const CHEER = ["答對了！", "漂亮，正中。", "穩！", "這題很多人會錯，你沒有。"];
const OOPS = ["沒關係，錯的題目最好記。", "差一點！看一下解釋。", "這題有陷阱，小弓以前也錯過。"];

function verdictLine(correct: number, total: number, passedBefore: boolean): { mood: Mood; line: string } {
  const need = passScore(total);
  if (correct === total) return { mood: "wow", line: "全對！小弓幫你蓋上朱印了。" };
  if (correct >= need) return { mood: "happy", line: "過關！錯的題目回去讀一次那一節就懂了。" };
  if (passedBefore) return { mood: "think", line: `這一輪答對 ${correct} 題，不過你之前已經過關了。錯的題目可以回去複習。` };
  return { mood: "oops", line: `再試一次就能過關：要答對 ${need} 題（60%），這次差 ${need - correct} 題。調整呼吸，按「重做」再射一輪。` };
}

export default function ChapterQuizPanel({ chapter, title, questions: qs }: { chapter: ChapterId; title: string; questions: ChoiceQuestion[] }) {
  const ch = CHAPTER_BY_ID[chapter];
  const next = nextChapter(chapter);
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [last, setLast] = useState<{ qi: number; ok: boolean } | null>(null);
  const [attempt, setAttempt] = useState(0);
  // whether the stored result had already passed before this attempt was saved
  const [passedBefore, setPassedBefore] = useState(false);
  const saved = useRef(false);
  const uid = useId();
  const prev = useCourseProgress().quiz[chapter];

  const total = qs.length;
  const need = passScore(total);
  const answered = qs.filter((q) => picked[q.id] !== undefined).length;
  const correct = qs.filter((q) => picked[q.id] === q.answer).length;
  const finished = answered === total;
  const wrong = finished ? qs.filter((q) => picked[q.id] !== q.answer) : [];

  const pick = (qi: number, i: number, el: HTMLElement) => {
    const q = qs[qi];
    if (picked[q.id] !== undefined) return;
    const nextPicked = { ...picked, [q.id]: i };
    const ok = i === q.answer;
    setPicked(nextPicked);
    setLast({ qi, ok });
    if (ok) confettiFrom(el, 18);
    const done = qs.every((x) => nextPicked[x.id] !== undefined);
    if (done && !saved.current) {
      saved.current = true;
      setPassedBefore(quizPassed(prev));
      saveQuiz(chapter, qs.filter((x) => nextPicked[x.id] === x.answer).length, total);
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
    ? verdictLine(correct, total, passedBefore)
    : last
      ? { mood: (last.ok ? "wow" : "oops") as Mood, line: last.ok ? CHEER[last.qi % CHEER.length] : OOPS[last.qi % OOPS.length] }
      : { mood: "think" as Mood, line: "一題一題來，點選項就會看到解釋與出處。" };
  const passedNow = correct >= need;
  // after saving, `prev` is this attempt (with the best score over all attempts)
  const best = finished && prev ? bestScore(prev) : correct;

  const btn = "inline-flex min-h-11 items-center gap-1 rounded-xl px-4 text-[15px] font-semibold no-underline";

  return (
    <section id="quiz" aria-labelledby={`${uid}-title`} className="mt-16 scroll-mt-20 rounded-2xl border border-wood/40 bg-wood-soft/40 p-4 sm:p-6">
      <header>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-[0.14em] text-wood tabular-nums">{ch.tag} · 過關測驗</span>
          <span aria-hidden="true" className="h-px flex-1 bg-wood/30" />
          {prev && !finished && (
            <span className="shrink-0 text-xs text-muted tabular-nums">
              上次 {prev.correct} / {prev.total}
              {bestScore(prev) !== prev.correct && `・最佳 ${bestScore(prev)}`}
              {quizPassed(prev) ? "・已過關" : "・未過關"}
            </span>
          )}
        </div>
        <h2 id={`${uid}-title`} className="mt-2 text-2xl font-bold">
          {title}
        </h2>
        <p className="mt-1 text-muted">
          {total} 題，答對 {need} 題（60%）就過關。答錯不扣分，放心按；全部作答後成績會記在這台瀏覽器。
        </p>
      </header>

      <ol key={attempt} className="mt-5 space-y-4">
        {qs.map((q, qi) => {
          const p = picked[q.id];
          const done = p !== undefined;
          const ok = p === q.answer;
          return (
            <li key={q.id} id={`quiz-${q.id}`} className="scroll-mt-20 rounded-xl border border-line bg-surface p-4">
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

      <div className="mt-5 rounded-xl border border-line bg-surface p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Mascot mood={reaction.mood} size={52} key={`${reaction.mood}-${answered}`} className="course-pop shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-baseline gap-x-2">
              <b className="text-2xl tabular-nums">
                {correct} / {total}
              </b>
              {finished ? (
                <span className={`text-sm font-semibold ${passedNow ? "text-indigo" : "text-vermilion"}`}>{passedNow ? "過關" : `未過關・需答對 ${need} 題`}</span>
              ) : (
                <span className="text-sm text-muted">已作答 {answered} 題</span>
              )}
              {finished && best > correct && <span className="text-sm text-muted tabular-nums">最佳 {best} / {total}</span>}
            </p>
            {/* Visible line for every state; the live region below speaks only the final result. */}
            <p className="text-[15px] leading-relaxed">{reaction.line}</p>
          </div>
        </div>
        <p aria-live="polite" className="sr-only">
          {finished && `測驗完成：答對 ${correct} / ${total} 題，${passedNow ? "過關" : `未過關，需答對 ${need} 題`}。成績已記錄。${reaction.line}`}
        </p>

        {finished && (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={retry} className={`${btn} border border-field-border bg-surface text-ink hover:bg-surface-2`}>
                <span aria-hidden="true">↻</span> 重做
              </button>
              <Link href={next ? next.href : "/#roadmap"} className={`${btn} bg-ink text-paper hover:bg-ink/85`}>
                {next ? `下一關：${next.title}` : "回到路線圖"} <span aria-hidden="true">▶</span>
              </Link>
            </div>
            {wrong.length > 0 && (
              <details className="group mt-3 rounded-xl border border-line bg-paper">
                <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-3 text-[15px] font-semibold text-ink">
                  <span aria-hidden="true" className="text-wood transition-transform group-open:rotate-90 motion-reduce:transition-none">
                    ▸
                  </span>
                  複習答錯的題目（{wrong.length} 題）
                </summary>
                <ul className="space-y-2 border-t border-line px-3 py-3">
                  {wrong.map((q) => (
                    <li key={q.id} className="text-[15px] leading-relaxed">
                      <a href={`#quiz-${q.id}`} className="text-ink underline decoration-line underline-offset-2 hover:text-wood">
                        <span className="mr-1 text-wood tabular-nums">Q{qs.indexOf(q) + 1}.</span>
                        {q.prompt}
                      </a>
                      <span className="block text-sm text-muted">
                        正解：<span lang={q.options[q.answer].ja ? "ja" : undefined}>{q.options[q.answer].text}</span>
                      </span>
                      {q.more && (
                        <Link href={q.more.href} className="inline-flex min-h-10 items-center text-sm font-semibold text-wood underline">
                          {q.more.label} →
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </>
        )}
      </div>
    </section>
  );
}
