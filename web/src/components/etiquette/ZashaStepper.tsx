"use client";

import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";
import type { FlowStep } from "@/content/etiquette/flow";
import { PointList, TagBadge, Cites } from "@/components/content/Blocks";

function StepBody({ step }: { step: FlowStep }) {
  return (
    <div className="space-y-4 text-[15px]">
      <div>
        <h4 className="mb-1.5 text-sm font-bold text-muted">要做什麼</h4>
        <PointList points={step.actions} />
      </div>
      <div className="rounded-xl border border-line bg-surface-2/60 p-3">
        <h4 className="mb-1 text-sm font-bold text-muted">呼吸與節奏</h4>
        <p className="leading-relaxed">
          {step.breath.tag && <TagBadge tag={step.breath.tag} />}
          {step.breath.text}
          <Cites src={step.breath.src} />
        </p>
      </div>
      {step.cue && (
        <div className="rounded-xl border border-indigo/30 bg-indigo/5 p-3">
          <h4 className="mb-1 text-sm font-bold text-indigo">審查・5 人立時</h4>
          <p className="leading-relaxed">
            {step.cue.tag && <TagBadge tag={step.cue.tag} />}
            {step.cue.text}
            <Cites src={step.cue.src} />
          </p>
        </div>
      )}
      {step.watch && (
        <div>
          <h4 className="mb-1.5 text-sm font-bold text-muted">
            常見問題 <span className="font-normal">（指導現場常見的提醒，不是官方扣分表）</span>
          </h4>
          <ul className="flex flex-wrap gap-1.5">
            {step.watch.map((w) => (
              <li key={w} className="rounded-full border border-line px-2.5 py-0.5 text-sm text-muted">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
      {step.link && (
        <p>
          <Link href={step.link.href} className="text-wood underline">
            {step.link.label} →
          </Link>
        </p>
      )}
    </div>
  );
}

function StepTitle({ step, n, as: As = "h3" }: { step: FlowStep; n: number; as?: "h3" | "h4" }) {
  return (
    <As className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-lg font-semibold">
      <span className="text-sm font-normal text-wood">第 {n} 步</span>
      <span>{step.title}</span>
      <span lang="ja" className="text-sm font-normal text-muted">
        {step.ja}
        {step.kana && step.kana !== step.ja ? `（${step.kana}）` : ""}
      </span>
    </As>
  );
}

export default function ZashaStepper({ steps }: { steps: FlowStep[] }) {
  const [i, setI] = useState(0);
  const [all, setAll] = useState(false);
  const baseId = useId();
  const total = steps.length;
  const step = steps[i];
  const go = (n: number) => setI(Math.max(0, Math.min(total - 1, n)));

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement;
    if (el.closest("a, input, textarea, select, summary")) return;
    if (e.key === "ArrowRight") go(i + 1);
    else if (e.key === "ArrowLeft") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(total - 1);
    else return;
    e.preventDefault();
  };

  const navBtn =
    "inline-flex min-h-11 items-center gap-1 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-40";

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          以審查的 5 人立、弓道衣、坐射為例的一手（甲矢＋乙矢）。
        </p>
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          className="rounded-full border border-line px-3 py-1 text-sm text-ink hover:bg-surface-2"
        >
          {all ? "改回逐步顯示" : "一次看全部步驟"}
        </button>
      </div>

      {all ? (
        <ol className="space-y-6">
          {steps.map((s, n) => (
            <li key={s.id} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
              <StepTitle step={s} n={n + 1} />
              <div className="mt-3">
                <StepBody step={s} />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div role="group" aria-roledescription="步驟器" aria-label="坐射一手的流程" onKeyDown={onKey}>
          {/* progress */}
          <div className="flex items-center gap-3">
            <div
              role="progressbar"
              aria-label="進度"
              aria-valuemin={1}
              aria-valuemax={total}
              aria-valuenow={i + 1}
              aria-valuetext={`第 ${i + 1} 步，共 ${total} 步`}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2"
            >
              <div
                className="h-full rounded-full bg-wood motion-safe:transition-[width] motion-safe:duration-300"
                style={{ width: `${((i + 1) / total) * 100}%` }}
              />
            </div>
            <span className="shrink-0 text-sm text-muted tabular-nums">
              {i + 1} / {total}
            </span>
          </div>

          {/* step dots */}
          <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="跳到某一步">
            {steps.map((s, n) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(n)}
                  aria-current={n === i ? "step" : undefined}
                  aria-controls={`${baseId}-panel`}
                  title={s.title}
                  className={`h-9 w-9 rounded-full border text-sm tabular-nums ${
                    n === i
                      ? "border-wood bg-wood text-paper"
                      : n < i
                        ? "border-wood/50 bg-wood-soft text-ink"
                        : "border-line bg-surface text-muted hover:bg-surface-2"
                  }`}
                >
                  <span className="sr-only">第 {n + 1} 步：{s.title}</span>
                  <span aria-hidden="true">{n + 1}</span>
                </button>
              </li>
            ))}
          </ol>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            第 {i + 1} 步，共 {total} 步：{step.title}
          </p>

          {/* Every step is in the HTML (readable without JS / by search); inactive ones are `hidden`. */}
          <div id={`${baseId}-panel`} className="mt-5 min-h-64 border-t border-line pt-4">
            {steps.map((s, n) => (
              <div key={s.id} hidden={n !== i}>
                <StepTitle step={s} n={n + 1} />
                <div className="mt-3">
                  <StepBody step={s} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-2">
            <button type="button" className={navBtn} aria-disabled={i === 0} onClick={() => go(i - 1)}>
              <span aria-hidden="true">←</span> 上一步
            </button>
            <span className="hidden text-xs text-muted sm:inline">也可以用鍵盤左右方向鍵切換</span>
            <button type="button" className={navBtn} aria-disabled={i === total - 1} onClick={() => go(i + 1)}>
              下一步 <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
