"use client";

// 「會前後出了什麼事」: a schematic of draw length over time (引分け → 会 → 離れ), first without a
// fault, then 早気, もたれ, びく, ゆすり and 緩み drawn against it. The shapes only illustrate the
// definitions already on this page (官方用語辞典, 指導書, 西尾 2021); they are not measurements.

import Stepper from "@/components/course/Stepper";
import { Cites, TagBadge } from "@/components/content/Blocks";
import { ANKF, BUDOKAN, STUDY } from "@/content/shaguse/sources";
import type { Source, Tag } from "@/content/types";
import { useProgress } from "./anim";

const W = 330;
const H = 196;
const BASE = 160; // nothing drawn
const FULL = 62; // 矢束
const X_KAI = 100; // entering 会
const X_REL = 232; // a normal 離れ

const RISE = `M28 ${BASE}C60 ${BASE} 74 ${FULL + 6} ${X_KAI} ${FULL}`;
const NORMAL = `${RISE}L${X_REL - 2} ${FULL - 5}L${X_REL + 6} ${BASE}`;

interface Step {
  id: string;
  title: string;
  text: string;
  tag: Tag;
  src: Source[];
  /** the curve for this case (drawn in vermilion over the faint normal curve) */
  d: string;
  /** dashed continuation (e.g. 放不出去) */
  dashed?: string;
  mark?: { x: number; y: number; label: string; anchor?: "start" | "middle" | "end"; dy?: number };
}

const wiggle = (() => {
  let d = "";
  for (let x = X_KAI + 6; x <= X_REL - 8; x += 4) d += `L${x} ${FULL - 1 + (((x - X_KAI) / 4) % 2 === 0 ? -3.2 : 3.2)}`;
  return d;
})();

const STEPS: Step[] = [
  {
    id: "normal",
    title: "先看沒有射癖時",
    text: "引分け拉到矢束、進入会，在会中持續伸展（伸合い），時機成熟時離れ，拉開的長度一下子歸零。",
    tag: "official",
    src: [ANKF.syaho, ANKF.terminology],
    d: NORMAL,
    mark: { x: X_REL - 2, y: FULL - 5, label: "離れ", anchor: "middle", dy: -10 },
  },
  {
    id: "hayake",
    title: "早気",
    text: "還沒進入會就放，或剛進入會就立刻放（全弓連用語辭典）。曲線還沒在会裡停留就掉下來。",
    tag: "official",
    src: [ANKF.terminology],
    d: `M28 ${BASE}C60 ${BASE} 72 ${FULL + 12} 92 ${FULL + 8}L98 ${BASE}`,
    mark: { x: 92, y: FULL + 8, label: "太早放", anchor: "end", dy: -10 },
  },
  {
    id: "motare",
    title: "もたれ",
    text: "進入會之後錯過離れ的時機，離れ無法產生（全弓連用語辭典）。曲線過了平常離れ的時間還停在原地。",
    tag: "official",
    src: [ANKF.terminology],
    d: `${RISE}L${X_REL} ${FULL}`,
    dashed: `M${X_REL} ${FULL}L${W - 12} ${FULL}`,
    mark: { x: W - 14, y: FULL, label: "放不出去", anchor: "end", dy: -10 },
  },
  {
    id: "biku",
    title: "びく",
    text: "官方辭典：在會中無意識地突然往回拉。研究（西尾 2021）的描述則是手臂像要放箭般一瞬間動了一下，但沒有放出去。兩種說法並存，圖只標出「會中突然一動」。",
    tag: "disputed",
    src: [ANKF.terminology, STUDY.nishio2021],
    d: `${RISE}L150 ${FULL - 1}L153 ${FULL - 10}L157 ${FULL + 10}L160 ${FULL - 1}L${X_REL - 2} ${FULL - 4}`,
    mark: { x: 155, y: FULL - 10, label: "突然一動", anchor: "middle", dy: -8 },
  },
  {
    id: "yusuri",
    title: "ゆすり",
    text: "拉弓或瞄準時前臂、上臂顫抖，但還能在想放的時機放箭（研究中的定義；全弓連用語辭典沒有這個詞條）。",
    tag: "research",
    src: [STUDY.nishio2021],
    d: `${RISE}${wiggle}L${X_REL - 2} ${FULL - 1}L${X_REL + 6} ${BASE}`,
    mark: { x: 165, y: FULL - 5, label: "顫抖，但放得出去", anchor: "middle", dy: -10 },
  },
  {
    id: "yurumi",
    title: "緩み",
    text: "指導書：往回放鬆之後才放（もどして離す）。研究文獻的定義是右手往靶的方向回去，拉出來的箭長違背本人意思而變短。",
    tag: "guide",
    src: [BUDOKAN.ch4, STUDY.miyakawa2026],
    d: `${RISE}L${X_REL - 22} ${FULL - 3}C${X_REL - 12} ${FULL - 2} ${X_REL - 6} ${FULL + 14} ${X_REL} ${FULL + 16}L${X_REL + 8} ${BASE}`,
    mark: { x: X_REL - 4, y: FULL + 16, label: "先鬆回才放", anchor: "end", dy: 16 },
  },
];

const RED = "var(--vermilion)";

function Chart({ i }: { i: number }) {
  const s = STEPS[i];
  const p = useProgress(i, 1100);
  const showMark = p > 0.92;
  return (
    <figure className="ill-plate rounded-xl p-2 sm:p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`示意圖：${s.title}。${s.text}`}>
        {/* phases */}
        <g fontSize={13} fill="var(--muted)" textAnchor="middle">
          <rect x={28} y={26} width={X_KAI - 28} height={BASE - 26} fill="var(--surface-2)" opacity={0.55} />
          <rect x={X_KAI} y={26} width={X_REL - X_KAI} height={BASE - 26} fill="var(--wood-soft)" opacity={0.55} />
          <text x={(28 + X_KAI) / 2} y={20} lang="ja">
            引分け
          </text>
          <text x={(X_KAI + X_REL) / 2} y={20} lang="ja">
            会
          </text>
          <text x={(X_REL + W) / 2} y={20} lang="ja">
            離れ之後
          </text>
        </g>
        {/* axes */}
        <path d={`M28 ${BASE}H${W - 6}`} stroke="var(--ink)" strokeWidth={1} />
        <path d={`M28 ${BASE}V26`} stroke="var(--ink)" strokeWidth={1} />
        <path d={`M28 ${FULL}H${W - 6}`} stroke="var(--line)" strokeWidth={1} strokeDasharray="3 3" />
        <text x={W - 6} y={FULL + 13} fontSize={12} fill="var(--muted)" textAnchor="end">
          拉滿（矢束）
        </text>
        <text x={W - 6} y={BASE + 16} fontSize={12} fill="var(--muted)" textAnchor="end">
          時間 →
        </text>
        <text x={14} y={(BASE + 26) / 2} fontSize={12} fill="var(--muted)" textAnchor="middle" transform={`rotate(-90 14 ${(BASE + 26) / 2})`}>
          拉開的長度
        </text>

        {/* the normal curve, faint, for comparison */}
        {i > 0 && <path d={NORMAL} fill="none" stroke="var(--muted)" strokeWidth={1.4} strokeDasharray="2 3" opacity={0.7} />}
        {i > 0 && (
          <text x={30} y={BASE + 16} fontSize={12} fill="var(--muted)">
            虛線：沒有射癖時
          </text>
        )}

        <path d={s.d} fill="none" stroke={i === 0 ? "var(--ink)" : RED} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
        {s.dashed && <path d={s.dashed} fill="none" stroke={RED} strokeWidth={2.4} strokeDasharray="5 4" opacity={showMark ? 1 : 0} />}
        {i === 0 && (
          <text x={(X_KAI + X_REL) / 2} y={FULL - 12} fontSize={11} fill="var(--ink)" textAnchor="middle" opacity={showMark ? 1 : 0} lang="ja">
            伸合い
          </text>
        )}
        {s.mark && (
          <g opacity={showMark ? 1 : 0}>
            <circle cx={s.mark.x} cy={s.mark.y} r={3.6} fill={i === 0 ? "var(--ink)" : RED} />
            <text
              x={s.mark.x}
              y={s.mark.y + (s.mark.dy ?? -10)}
              fontSize={13}
              fontWeight={600}
              fill={i === 0 ? "var(--ink)" : RED}
              textAnchor={s.mark.anchor ?? "middle"}
              stroke="#fbf7ef"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {s.mark.label}
            </text>
          </g>
        )}
      </svg>
      <figcaption className="mt-1 px-1 text-xs leading-5 text-muted">
        示意圖（本站整理）：橫軸是時間，縱軸是拉開的長度，曲線的形狀依定義畫出，不是量測資料。自己屬於哪一種、該怎麼改，請以指導者為準。
      </figcaption>
    </figure>
  );
}

export default function FaultTimeline() {
  return (
    <Stepper
      label="射癖在會前後的樣子"
      autoplayMs={3600}
      steps={STEPS.map((s) => ({
        title: s.title,
        text: (
          <>
            <TagBadge tag={s.tag} />
            {s.text}
            <Cites src={s.src} />
            {s.id !== "normal" && (
              <a href={`#${s.id}`} className="ml-1.5 text-sm whitespace-nowrap text-wood underline">
                看〈{s.title}〉
              </a>
            )}
          </>
        ),
      }))}
    >
      {(i) => <Chart i={i} />}
    </Stepper>
  );
}
