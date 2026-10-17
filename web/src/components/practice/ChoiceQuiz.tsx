"use client";

// Generic one-question-at-a-time multiple-choice runner, used by 「這是哪一節？」,
// 迷思是非題 (two options: 對／錯) and 情境題. Immediate feedback with explanation,
// tag and sources; summary at the end. Number keys 1–4 pick an option.

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { recordSession, type SessionResult } from "@/lib/practice/stats";
import type { ChoiceQuestion, PracticeMode } from "@/lib/practice/types";
import Summary from "./Summary";
import { Btn, More, Panel, ProgressBar, SourceLinks, TagChip, Verdict } from "./ui";

export default function ChoiceQuiz({
  mode,
  build,
  onExit,
  layout = "list",
}: {
  mode: PracticeMode;
  /** builds a fresh, shuffled session */
  build: () => ChoiceQuestion[];
  onExit: () => void;
  /** "pair" puts two options side by side (對／錯) */
  layout?: "list" | "pair";
}) {
  const [questions, setQuestions] = useState(build);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState<{ result: SessionResult | null } | null>(null);
  const [focusTick, setFocusTick] = useState(0);
  const promptRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const q = questions[idx];
  const n = questions.length;

  useEffect(() => {
    if (focusTick > 0) promptRef.current?.focus();
  }, [focusTick]);
  useEffect(() => {
    if (picked !== null) nextRef.current?.focus();
  }, [picked]);

  const choose = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    setResults((r) => [...r, i === q.answer]);
  };

  const next = () => {
    if (idx + 1 < n) {
      setIdx(idx + 1);
      setPicked(null);
      setFocusTick((t) => t + 1);
    } else {
      const correct = results.filter(Boolean).length;
      let result: SessionResult | null = null;
      try {
        result = recordSession(mode, correct, n);
      } catch {
        result = null;
      }
      setFinished({ result });
    }
  };

  const restart = () => {
    setQuestions(build());
    setIdx(0);
    setPicked(null);
    setResults([]);
    setFinished(null);
    setFocusTick((t) => t + 1);
  };

  const onKey = (e: KeyboardEvent) => {
    if (picked !== null || !q || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = Number(e.key);
    if (k >= 1 && k <= q.options.length) {
      e.preventDefault();
      choose(k - 1);
    }
  };

  if (!q) return <Panel>題目載入失敗，請重新整理。</Panel>;

  if (finished) {
    return (
      <Summary
        correct={results.filter(Boolean).length}
        total={n}
        result={finished.result}
        review={questions.map((qq, i) => ({
          id: qq.id,
          prompt: qq.quote ? `${qq.prompt}「${qq.quote}」` : qq.prompt,
          ok: !!results[i],
          answer: qq.options[qq.answer]?.text ?? "",
        }))}
        onRestart={restart}
        onExit={onExit}
      />
    );
  }

  const answered = picked !== null;
  const ok = answered && picked === q.answer;
  const correctOpt = q.options[q.answer];

  return (
    <Panel>
      <div onKeyDown={onKey}>
        <ProgressBar value={idx + (answered ? 1 : 0)} max={n} label="這一輪的進度" />
        {q.topic && <p className="mt-4 text-xs font-semibold tracking-widest text-wood">{q.topic}</p>}
        <h3 ref={promptRef} tabIndex={-1} className="mt-1 text-lg leading-relaxed font-bold outline-none">
          <span className="sr-only">
            第 {idx + 1} 題，共 {n} 題：
          </span>
          {q.prompt}
        </h3>
        {q.quote && (
          <blockquote className="mt-3 rounded-xl border-l-4 border-wood bg-surface-2 px-4 py-3 text-[17px] leading-relaxed">
            「{q.quote}」
          </blockquote>
        )}

        <ul className={`mt-4 grid gap-2 ${layout === "pair" ? "grid-cols-2" : ""}`}>
          {q.options.map((o, i) => {
            const isAnswer = i === q.answer;
            const isPicked = i === picked;
            let look = "border-field-border bg-paper hover:border-wood hover:bg-surface-2";
            if (answered) {
              if (isAnswer) look = "border-indigo bg-indigo/10";
              else if (isPicked) look = "border-vermilion bg-vermilion/10";
              else look = "border-line bg-paper opacity-60";
            }
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  aria-disabled={answered}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left transition-colors ${look} ${layout === "pair" ? "justify-center text-center text-lg font-bold" : ""}`}
                >
                  {layout !== "pair" && (
                    <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-sm text-muted tabular-nums">
                      {i + 1}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span lang={o.ja ? "ja" : undefined} className="block text-[16px] leading-snug font-semibold">
                      {o.text}
                    </span>
                    {o.sub && <span className="mt-0.5 block text-sm text-muted">{o.sub}</span>}
                  </span>
                  {answered && isAnswer && (
                    <span className="shrink-0 text-sm font-bold text-indigo">
                      <span aria-hidden="true">✓ </span>正解
                    </span>
                  )}
                  {answered && isPicked && !isAnswer && (
                    <span className="shrink-0 text-sm font-bold text-vermilion">
                      <span aria-hidden="true">✗ </span>你選的
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div aria-live="polite" className="mt-4">
          {answered && (
            <div className={`rounded-xl border p-4 ${ok ? "border-indigo/30 bg-indigo/5" : "border-vermilion/30 bg-vermilion/5"}`}>
              <Verdict ok={ok}>{ok ? "答對了" : `答錯了，正解是「${correctOpt?.text ?? ""}」`}</Verdict>
              <p className="mt-2 text-[15px] leading-relaxed">
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

        {answered && (
          <div className="mt-4 flex justify-end">
            <Btn ref={nextRef} variant="primary" onClick={next} className="w-full sm:w-auto">
              {idx + 1 < n ? "下一題" : "看結果"} <span aria-hidden="true">→</span>
            </Btn>
          </div>
        )}
        {!answered && <p className="mt-3 hidden text-xs text-muted sm:block">也可以按數字鍵 1–{q.options.length} 作答。</p>}
      </div>
    </Panel>
  );
}
