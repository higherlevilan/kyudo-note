// 和弓與其他弓，同一比例尺並排，旁邊是 170 cm 的人形。
// Only the 和弓 length (七尺三寸 ≈ 221 cm, 全弓連《弓道競技規則》) comes from the research notes;
// the other lengths are rough, commonly quoted values and are labelled as such.

import { ANKF } from "@/content/common-sources";
import { CS } from "@/content/culture/sources";
import { FigureFrame } from "./FigureFrame";

const K = 1.15; // SVG units per cm
const GROUND = 286;
const y = (cm: number) => GROUND - cm * K;
const RULER_W = 30;
const COL = 62;
const cx = (i: number) => RULER_W + COL * i + COL / 2; // 61, 123, 185, 247, 309

// Lengths in cm (unit shown on the ruler). Names are pre-split so narrow columns wrap cleanly.
const COLS: { name: string[]; ja?: boolean; len: string; note: string }[] = [
  { name: ["人"], len: "170", note: "比例參考" },
  { name: ["和弓"], ja: true, len: "221", note: "約・標準" },
  { name: ["英國", "長弓"], len: "180–200", note: "約・概略" },
  { name: ["蒙古・", "中國角弓"], len: "120–160", note: "約・概略" },
  { name: ["奧運", "反曲弓"], len: "170", note: "約・概略" },
];

/** Short vermilion tick marking the middle of a bow's length. */
function MidTick({ x, cm }: { x: number; cm: number }) {
  return <path d={`M${x - 9} ${y(cm / 2)}h7`} className="stroke-vermilion" strokeWidth={2} />;
}

export default function BowScaleFigure() {
  const wa = { top: y(221), gc: y(221 * 0.34) }; // grip centre ≈ 1/3 up
  const lb = { top: y(190), mid: y(95) };
  const hb = { top: y(140), mid: y(70) };
  const rc = { top: y(170), mid: y(85) };
  return (
    <FigureFrame
      id="fig-bow-scale"
      title="和弓與其他弓：同一比例尺"
      caption={
        <>
          所有弓都以弓弦掛好的側面、同一比例尺繪製，旁邊是 170 公分的人形。深色方塊是握把，紅色短線是弓身長度的中點：只有和弓的握把在中點以下。和弓長度依全弓連的標準「並寸」（七尺三寸，約 221 公分）；其他三種弓的長度是一般概略值，各時代、各地的形制差異很大，只供比例參考。
        </>
      }
      sources={[ANKF.playRules, CS.yamada]}
    >
      <div className="mx-auto max-w-md">
        <svg viewBox="0 0 340 296" role="img" aria-label="和弓與其他弓的比例比較" className="block h-auto w-full">
          <title>
            同一比例尺下：170 公分的人、和弓約 221 公分（握把在下方約三分之一）、英國長弓約 180 到 200 公分、蒙古或中國角弓約 120 到 160 公分、奧運反曲弓約 170 公分；後三者為一般概略值，握把都在中央。
          </title>

          {/* ruler */}
          {[0, 50, 100, 150, 200].map((cm) => (
            <g key={cm}>
              <line x1={RULER_W} y1={y(cm)} x2={340} y2={y(cm)} className="stroke-line" strokeWidth={cm === 0 ? 1.5 : 1} strokeDasharray={cm === 0 ? undefined : "2 4"} />
              <text x={RULER_W - 4} y={y(cm) + 4.5} textAnchor="end" fontSize={13} className="fill-muted">
                {cm}
              </text>
            </g>
          ))}
          <text x={RULER_W - 4} y={22} textAnchor="end" fontSize={13} className="fill-muted">
            cm
          </text>

          {/* human, 170 cm */}
          <g className="fill-muted stroke-muted" opacity={0.45}>
            <circle cx={cx(0)} cy={y(170) + 12} r={11.5} stroke="none" />
            <rect x={cx(0) - 15} y={y(170) + 28} width={30} height={74} rx={9} stroke="none" />
            <path
              d={`M${cx(0) - 18} ${y(170) + 36}L${cx(0) - 21} ${y(170) + 104}M${cx(0) + 18} ${y(170) + 36}L${cx(0) + 21} ${y(170) + 104}`}
              strokeWidth={7}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M${cx(0) - 6} ${y(170) + 96}L${cx(0) - 7} ${GROUND - 5}M${cx(0) + 6} ${y(170) + 96}L${cx(0) + 7} ${GROUND - 5}`}
              strokeWidth={10}
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* 和弓 */}
          <line x1={131} y1={wa.top} x2={131} y2={GROUND} className="stroke-ink" strokeWidth={0.8} />
          <path
            d={`M131 ${wa.top}C125 90 114 ${wa.gc - 50} 114 ${wa.gc - 8}V${wa.gc + 8}C114 ${wa.gc + 34} 124 268 131 ${GROUND}`}
            className="fill-none stroke-wood"
            strokeWidth={3.5}
            strokeLinecap="round"
          />
          <rect x={110.5} y={wa.gc - 8} width={7} height={16} rx={1.5} className="fill-ink" />
          <MidTick x={121} cm={221} />

          {/* English longbow, ~190 cm */}
          <line x1={193} y1={lb.top} x2={193} y2={GROUND} className="stroke-muted" strokeWidth={0.8} />
          <path d={`M193 ${lb.top}Q161 ${lb.mid} 193 ${GROUND}`} className="fill-none stroke-muted" strokeWidth={3.5} strokeLinecap="round" />
          <rect x={173.5} y={lb.mid - 8} width={7} height={16} rx={1.5} className="fill-ink" />
          <MidTick x={175} cm={190} />

          {/* horn bow, ~140 cm: short, deep, with stiff recurved ears */}
          <path
            d={`M240 ${hb.top}L254 ${hb.top + 19}V${GROUND - 19}L240 ${GROUND}`}
            className="fill-none stroke-muted"
            strokeWidth={0.8}
          />
          <path
            d={`M240 ${hb.top}L252 ${hb.top + 18}C246 ${hb.top + 40} 236 ${hb.mid - 26} 236 ${hb.mid - 8}V${hb.mid + 8}C236 ${hb.mid + 26} 246 ${GROUND - 40} 252 ${GROUND - 18}L240 ${GROUND}`}
            className="fill-none stroke-muted"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x={232.5} y={hb.mid - 8} width={7} height={16} rx={1.5} className="fill-ink" />
          <MidTick x={232} cm={140} />

          {/* Olympic recurve, ~170 cm: straight riser, limbs recurving at the tips */}
          <path
            d={`M310 ${rc.top}L316 ${rc.top + 11}V${GROUND - 11}L310 ${GROUND}`}
            className="fill-none stroke-muted"
            strokeWidth={0.8}
          />
          <path
            d={`M294 ${rc.mid - 36}C300 ${rc.mid - 60} 310 ${rc.top + 24} 314 ${rc.top + 12}Q316 ${rc.top + 4} 310 ${rc.top}M294 ${rc.mid + 36}C300 ${rc.mid + 60} 310 ${GROUND - 24} 314 ${GROUND - 12}Q316 ${GROUND - 4} 310 ${GROUND}`}
            className="fill-none stroke-muted"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <rect x={290} y={rc.mid - 37} width={7} height={74} rx={2} className="fill-muted" />
          <rect x={289} y={rc.mid - 8} width={9} height={16} rx={1.5} className="fill-ink" />
          <MidTick x={287} cm={170} />
        </svg>

        <ul className="grid grid-cols-5 gap-x-1 text-center text-xs leading-snug" style={{ paddingLeft: `${(RULER_W / 340) * 100}%` }}>
          {COLS.map((c) => (
            <li key={c.len}>
              <span lang={c.ja ? "ja" : undefined} className={`block font-semibold ${c.ja ? "text-wood" : ""}`}>
                {c.name.map((n) => (
                  <span key={n} className="block whitespace-nowrap">
                    {n}
                  </span>
                ))}
              </span>
              <span className="block tabular-nums">{c.len}</span>
              <span className="block text-[11px] text-muted">{c.note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-1 text-center text-[11px] text-muted">長度單位：公分（cm）。「約・概略」＝一般概略值</p>
        <p className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-3 w-1.5 rounded-sm bg-ink" />
            握把
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-0.5 w-3 bg-vermilion" />
            弓身長度的中點
          </span>
        </p>
      </div>
    </FigureFrame>
  );
}
