"use client";

// Result cards: the learner's chosen frame (with skeleton + illustration arms) beside the canonical
// ArcherFigure, and the rounded comparison statements.

import ArcherFigure from "@/components/illustrations/archer/ArcherFigure";
import { stepStatements, type Analysis, type Picks } from "@/lib/form-check/analysis";
import { verdictLabel, type Verdict } from "@/lib/form-check/feedback";
import { STEPS, STEP_IDS, type StepId } from "@/lib/form-check/steps";
import { cardCls } from "./ui";

const BADGE: Record<Verdict, string> = {
  close: "border-wood/40 bg-wood-soft text-ink",
  some: "border-indigo/40 bg-indigo/10 text-indigo",
  far: "border-vermilion/50 bg-vermilion/10 text-vermilion",
  info: "border-line bg-surface-2 text-muted",
};

export default function StepResults({
  analysis,
  picks,
  manual,
  enabled,
  snapshots,
  onToggle,
  onShow,
}: {
  analysis: Analysis;
  picks: Picks;
  manual: Record<StepId, boolean>;
  enabled: Record<StepId, boolean>;
  snapshots: Partial<Record<StepId, string>>;
  onToggle: (s: StepId, on: boolean) => void;
  onShow: (s: StepId) => void;
}) {
  return (
    <ol className="space-y-4">
      {STEP_IDS.map((id) => {
        const def = STEPS[id];
        const t = analysis.track.frames[picks[id]]?.t ?? 0;
        const on = enabled[id];
        const sts = on ? stepStatements(analysis, id, picks) : [];
        const found = analysis.seg.moments[id].found;
        const snap = snapshots[id];
        const anyLow = sts.some((s) => s.lowConf);
        return (
          <li key={id} className={cardCls} aria-labelledby={`fc-res-${id}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 id={`fc-res-${id}`} className="text-lg font-bold">
                <span lang="ja">{def.term}</span>
                <span className="ml-2 text-sm font-normal text-muted">{def.zh}</span>
              </h3>
              <label className="inline-flex min-h-10 items-center gap-2 text-sm text-muted">
                <input type="checkbox" className="h-4 w-4 accent-[var(--wood)]" checked={on} onChange={(e) => onToggle(id, e.target.checked)} />
                納入比較
              </label>
            </div>
            {!on ? (
              <p className="mt-2 text-sm text-muted">已略過（例如影片沒有拍到這一節）。</p>
            ) : (
              <>
                <p className="mt-1 text-sm text-muted">
                  第 <span className="tabular-nums">{t.toFixed(1)}</span> 秒・{manual[id] ? "手動選擇" : found ? "自動判斷" : "自動粗估（建議手動確認）"}
                  <button type="button" onClick={() => onShow(id)} className="ml-2 text-wood underline">
                    在時間軸上調整
                  </button>
                </p>
                <div className="mt-3 grid grid-cols-2 items-end gap-3">
                  <figure className="flex min-w-0 flex-col items-center">
                    {snap ? (
                      // eslint-disable-next-line @next/next/no-img-element -- in-memory data: URL, never uploaded
                      <img
                        src={snap}
                        alt={`你的畫面：${def.term}，第 ${t.toFixed(1)} 秒，疊上偵測到的骨架與示意圖手臂`}
                        className="max-h-60 w-auto max-w-full rounded-lg"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-lg bg-surface-2 text-xs text-muted">產生畫面中…</div>
                    )}
                    <figcaption className="mt-1 text-xs text-muted">你的畫面</figcaption>
                  </figure>
                  <figure className="flex min-w-0 flex-col items-center">
                    <div className="ill-plate flex w-full justify-center rounded-lg p-1">
                      <ArcherFigure pose={def.pose} frame="fit" className="h-auto max-h-60 w-auto max-w-full" />
                    </div>
                    <figcaption className="mt-1 text-xs text-muted">示意圖（本站插圖）</figcaption>
                  </figure>
                </div>
                {sts.length ? (
                  <ul className="mt-3 space-y-2">
                    {sts.map((s) => (
                      <li key={s.metric} className="text-[15px] leading-relaxed">
                        <span className={`mr-1.5 inline-block rounded border px-1.5 py-px align-[1px] text-[11px] leading-4 ${BADGE[s.verdict]}`}>
                          {verdictLabel(s.verdict)}
                        </span>
                        {s.text}
                        {s.lowConf && <span className="ml-1 text-xs text-muted">（偵測信心低，僅供參考）</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">這一節沒有可比較的數值。</p>
                )}
                {anyLow && (
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    信心低通常是關節被袖子、<span lang="ja">袴</span>或弓擋住，或頭部轉成側面。
                  </p>
                )}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
