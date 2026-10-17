// 三十三間堂「通し矢」：平面（西側外廊、射位在南端）＋沿外廊的立面（屋簷下約 5 m，低彈道）。
// Facts: docs/research/01 §1.6 — 外廊約 120 m、屋簷下約 5 m〔S10〕；大矢數紀錄〔S18〕。
// The elevation keeps the vertical scale (20 units = 1 m) but compresses the length, with a break mark.

import { ANKF } from "@/content/common-sources";
import { CS } from "@/content/culture/sources";
import { FigureFrame } from "./FigureFrame";

const FLOOR = 300;
const M = 20; // units per metre, vertical only
const EAVE = FLOOR - 5 * M; // 200
const BREAK_L = 160;
const BREAK_R = 180;
const T = { fontSize: 13 } as const;

const RECORDS = [
  { who: "星野勘左衛門", han: "尾張藩", when: "寛文 9 年（1669）", total: 10542, through: 8000, best: false },
  { who: "和佐大八郎", han: "紀州藩", when: "貞享 3 年（1686）", total: 13053, through: 8133, best: true },
];
const MAX = 13053;
const fmt = (n: number) => n.toLocaleString("en-US");

/** Two parallel zigzags: the standard "break" symbol. */
function BreakMark({ y1, y2 }: { y1: number; y2: number }) {
  const zig = (x: number) => `M${x} ${y1}V${(y1 + y2) / 2 - 8}l-5 5l10 6l-5 5V${y2}`;
  return <path d={`${zig(BREAK_L + 1)}${zig(BREAK_R - 1)}`} className="fill-none stroke-muted" strokeWidth={1} />;
}

export default function ToshiyaFigure() {
  const pillars = [24, 62, 100, 138, 202, 240, 278, 316];
  return (
    <FigureFrame
      id="fig-toshiya"
      title="三十三間堂的通し矢"
      caption={
        <>
          通し矢是坐在西側外廊的南端連續射箭，比射「通」北端的箭數，不是射靶。屋簷下只有約 5 公尺高，箭必須壓低彈道、又要飛完約 120 公尺。立面圖的高度依比例，水平方向則大幅壓縮（實際長度是屋簷高度的二十多倍），中間以折斷符號省略；平面圖為示意。紀錄為「大矢數」（一晝夜）。
        </>
      }
      sources={[CS.yamada, CS.kyotoArchive, ANKF.history]}
    >
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,26rem)_1fr]">
        <svg viewBox="0 0 340 344" role="img" aria-label="三十三間堂通し矢的平面與立面示意" className="mx-auto block h-auto w-full max-w-[26rem]">
          <title>
            三十三間堂通し矢示意：上為平面，西側外廊長約 120 公尺，射位在南端，箭沿外廊射向北端；下為沿外廊的立面，屋簷下高約 5 公尺，箭以低而平的彈道從屋簷下通過，水平方向未依比例。
          </title>
          <defs>
            <clipPath id="toshiya-gap">
              <rect x={0} y={150} width={BREAK_L + 1} height={200} />
              <rect x={BREAK_R - 1} y={150} width={340 - BREAK_R} height={200} />
            </clipPath>
          </defs>

          {/* ---------------- plan ---------------- */}
          <text x={6} y={16} {...T} fontWeight={700} className="fill-ink">
            平面
          </text>
          <text x={334} y={16} {...T} textAnchor="end" className="fill-muted">
            北 →
          </text>
          <path d="M20 37v8M320 37v8M20 41H320" className="stroke-muted" strokeWidth={1} />
          <text x={170} y={34} {...T} textAnchor="middle" className="fill-ink">
            約 120 m
          </text>
          <rect x={20} y={48} width={300} height={12} className="fill-wood-soft stroke-wood" strokeWidth={0.8} />
          <rect x={20} y={60} width={300} height={44} className="fill-surface-2 stroke-line" strokeWidth={1} />
          <text x={170} y={87} {...T} textAnchor="middle" className="fill-muted">
            本堂
          </text>
          <text x={26} y={87} {...T} className="fill-muted">
            西側外廊 ↑
          </text>
          <path d="M28 54H312" className="stroke-vermilion" strokeWidth={1.6} strokeDasharray="5 3" />
          <path d="M318 54l-8 -4v8z" className="fill-vermilion" />
          <circle cx={26} cy={54} r={3.5} className="fill-ink" />
          <text x={20} y={122} {...T} className="fill-ink">
            射位（南端）
          </text>
          <text x={320} y={122} {...T} textAnchor="end" className="fill-ink">
            北端
          </text>

          {/* ---------------- elevation ---------------- */}
          <text x={6} y={152} {...T} fontWeight={700} className="fill-ink">
            沿外廊的立面
          </text>
          <text x={86} y={152} {...T} className="fill-muted">
            （高度依比例，長度壓縮）
          </text>

          <g clipPath="url(#toshiya-gap)">
            {/* roof and eave underside */}
            <rect x={10} y={182} width={320} height={EAVE - 182} className="fill-ink" opacity={0.14} />
            <line x1={10} y1={EAVE} x2={330} y2={EAVE} className="stroke-ink" strokeWidth={2} />
            {pillars.map((x) => (
              <line key={x} x1={x} y1={EAVE} x2={x} y2={FLOOR} className="stroke-line" strokeWidth={3} />
            ))}
            {/* floor */}
            <line x1={10} y1={FLOOR} x2={330} y2={FLOOR} className="stroke-ink" strokeWidth={2} />
            {/* flat trajectory: leaves at ~1.5 m, peaks ~4.3 m, still under the eave */}
            <path d={`M48 270Q170 160 314 268`} className="fill-none stroke-vermilion" strokeWidth={1.6} strokeDasharray="5 3" />
          </g>
          <path d="M318 270l-9 -1.5l4 -7z" className="fill-vermilion" />
          <BreakMark y1={176} y2={326} />

          {/* seated archer with bow */}
          <circle cx={32} cy={262} r={5} className="fill-ink" />
          <path d="M32 268l2 22l10 8" className="fill-none stroke-ink" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 274h12" className="stroke-ink" strokeWidth={2} strokeLinecap="round" />
          <path d="M46 250q-8 22 0 46" className="fill-none stroke-wood" strokeWidth={2} strokeLinecap="round" />
          <text x={14} y={232} {...T} className="fill-ink">
            射位
          </text>
          <text x={62} y={214} {...T} className="fill-vermilion">
            低而平的彈道
          </text>

          {/* eave height */}
          <path d={`M322 ${EAVE + 2}V${FLOOR - 2}`} className="stroke-ink" strokeWidth={1} />
          <path d={`M322 ${EAVE + 1}l-3 6h6zM322 ${FLOOR - 1}l-3 -6h6z`} className="fill-ink" />
          <text x={330} y={174} {...T} textAnchor="end" className="fill-ink">
            屋簷下 約 5 m
          </text>

          {/* length */}
          <text x={12} y={318} {...T} className="fill-muted">
            南端
          </text>
          <text x={312} y={318} {...T} textAnchor="end" className="fill-muted">
            北端
          </text>
          <path d={`M12 324v6M328 324v6M12 327H${BREAK_L - 4}M${BREAK_R + 4} 327H328`} className="stroke-muted" strokeWidth={1} />
          <text x={170} y={342} {...T} textAnchor="middle" className="fill-ink">
            全長約 120 m（中間省略）
          </text>
        </svg>

        <div>
          <p className="mb-2 text-sm font-bold">大矢數的著名紀錄</p>
          <ul className="space-y-4 text-sm">
            {RECORDS.map((r) => (
              <li key={r.who}>
                <p className="leading-snug">
                  <span className="font-semibold">{r.who}</span>
                  <span className="text-muted">（{r.han}）{r.when}</span>
                  {r.best && <span className="ml-1 text-xs font-semibold text-vermilion">至今最高紀錄</span>}
                </p>
                <dl className="mt-1.5 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <dt className="w-8 shrink-0 text-muted">總射</dt>
                    <dd className="flex flex-1 items-center gap-2">
                      <span aria-hidden="true" className="h-2.5 rounded-sm bg-wood-soft ring-1 ring-wood/30" style={{ width: `${(r.total / MAX) * 70}%` }} />
                      <span className="tabular-nums">{fmt(r.total)}</span>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="w-8 shrink-0 text-muted">通</dt>
                    <dd className="flex flex-1 items-center gap-2">
                      <span aria-hidden="true" className="h-2.5 rounded-sm bg-vermilion/80" style={{ width: `${(r.through / MAX) * 70}%` }} />
                      <span className="font-semibold tabular-nums">{fmt(r.through)}</span>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            「通」是飛完外廊全長、到達北端的箭。兩人的成功率約為 76% 與 62%（本站依上列數字計算）。「和佐的父親紀錄被打破後自盡」之類的情節出自後世的電影等創作，應視為虛構。
          </p>
        </div>
      </div>
    </FigureFrame>
  );
}
