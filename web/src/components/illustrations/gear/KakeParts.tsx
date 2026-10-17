// 弽（三つがけ）的部位：右手、掌心這一面的示意。形狀依店家、流派不同，這裡只標部位名稱。

import { ANKF, SHOP } from "@/content/equipment/sources";
import FigureFrame from "./FigureFrame";
import { r1 } from "./geom";

// thumb: base centre B, pointing up-right
const B: [number, number] = [202, 182];
const ANG = (-55 * Math.PI) / 180;
const DIR: [number, number] = [Math.cos(ANG), Math.sin(ANG)];
const NRM: [number, number] = [-DIR[1], DIR[0]]; // points to the lower right (outer side of the thumb)
const LEN = 105;
const HALF = 20;
const at = (along: number, across: number): [number, number] => [r1(B[0] + DIR[0] * along + NRM[0] * across), r1(B[1] + DIR[1] * along + NRM[1] * across)];
const pt = (p: [number, number]) => `${p[0]},${p[1]}`;

function thumb(from: number): string {
  return `M${pt(at(from, -HALF))} L${pt(at(LEN, -HALF))} A${HALF} ${HALF} 0 0 1 ${pt(at(LEN, HALF))} L${pt(at(from, HALF))} Z`;
}

const TSURUMAKURA_A = at(30, -HALF);
const TSURUMAKURA_B = at(30, -HALF + 15);

function Lead({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g className="stroke-muted" strokeWidth={1}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <circle cx={x2} cy={y2} r={2} className="fill-muted" stroke="none" />
    </g>
  );
}

export default function KakeParts() {
  return (
    <FigureFrame
      id="kake-parts"
      title="弽（三つがけ）的部位"
      caption={
        <>
          右手、掌心朝向讀者的示意圖：三つがけ包住拇指、食指、中指。規則要求行射時右手一定要戴弽，而且要有控、帽子與弦枕；材質為鹿皮。實際形狀、硬度依店家與流派不同。
        </>
      }
      sources={[ANKF.playRules, ANKF.terminology, SHOP.koyamaKakeInfo]}
    >
      <svg viewBox="0 0 320 326" role="img" aria-label="三つがけ（右手用）的部位示意圖：帽子、弦枕、捻皮、控え" className="mx-auto block h-auto w-full max-w-sm">
        <title>三つがけ（右手用）的部位示意圖</title>
        <desc>
          右手用的三つがけ，掌心這一面。拇指的部分是帽子；拇指根部內側扣弦的溝是弦枕；食指根部貼著捻皮；手腕的部分是控え，用紐綁住。
        </desc>
        <text x={6} y={18} fontSize={14} fontWeight={700} className="fill-ink">
          右手用・掌心這一面
        </text>

        {/* 控え and 紐 */}
        <path d="M96 226 H218 V290 Q218 306 202 306 H112 Q96 306 96 290 Z" className="fill-wood-soft stroke-ink" strokeWidth={1.2} />
        <rect x={104} y={240} width={106} height={56} rx={6} className="fill-wood/25" />
        <g className="stroke-ink" strokeWidth={2} fill="none" strokeLinecap="round">
          <path d="M94 262 Q157 270 220 262" />
          <path d="M94 276 Q157 284 220 276" />
          <path d="M220 269 Q252 276 262 300 Q268 314 292 316" className="stroke-ink/80" strokeWidth={1.6} />
        </g>

        {/* fingers */}
        <rect x={94} y={24} width={36} height={112} rx={17} className="fill-wood-soft stroke-ink" strokeWidth={1.2} />
        <rect x={132} y={40} width={36} height={96} rx={17} className="fill-wood-soft stroke-ink" strokeWidth={1.2} />
        {/* palm */}
        <path d="M92 126 L170 128 L186 168 L222 194 L222 236 L92 236 Z" className="fill-wood-soft stroke-ink" strokeWidth={1.2} strokeLinejoin="round" />
        {/* thumb = 帽子; hard cap shaded */}
        <path d={thumb(0)} className="fill-wood-soft stroke-ink" strokeWidth={1.2} strokeLinejoin="round" />
        <path d={thumb(48)} className="fill-wood/55 stroke-ink" strokeWidth={1} strokeLinejoin="round" />
        {/* 弦枕 */}
        <line x1={TSURUMAKURA_A[0]} y1={TSURUMAKURA_A[1]} x2={TSURUMAKURA_B[0]} y2={TSURUMAKURA_B[1]} className="stroke-vermilion" strokeWidth={3.4} strokeLinecap="round" />
        {/* 捻皮 */}
        <rect x={144} y={118} width={24} height={26} rx={5} className="fill-surface stroke-ink" strokeWidth={1} />

        <g fontSize={13} className="fill-muted" textAnchor="middle">
          <text x={112} y={84}>
            中指
          </text>
          <text x={150} y={96}>
            食指
          </text>
          <text x={at(72, 0)[0]} y={at(72, 0)[1] + 5}>
            拇指
          </text>
        </g>

        <g fontSize={14} fontWeight={700} className="fill-ink">
          <text lang="ja" x={306} y={58} textAnchor="end">
            帽子
          </text>
          <Lead x1={290} y1={62} x2={at(LEN - 4, 6)[0]} y2={at(LEN - 4, 6)[1]} />

          <text lang="ja" x={306} y={196} textAnchor="end">
            弦枕
          </text>
          <Lead x1={276} y1={192} x2={r1((TSURUMAKURA_A[0] + TSURUMAKURA_B[0]) / 2)} y2={r1((TSURUMAKURA_A[1] + TSURUMAKURA_B[1]) / 2)} />

          <text lang="ja" x={84} y={150} textAnchor="end">
            捻皮
          </text>
          <Lead x1={88} y1={146} x2={150} y2={131} />

          <text lang="ja" x={84} y={252} textAnchor="end">
            控え
          </text>
          <Lead x1={88} y1={248} x2={116} y2={250} />

          <text x={306} y={292} textAnchor="end">
            紐
          </text>
          <Lead x1={300} y1={296} x2={266} y2={306} />
        </g>
        <g fontSize={13} className="fill-muted">
          <text x={306} y={76} textAnchor="end">
            拇指的包覆
          </text>
          <text x={6} y={168}>
            食指根部
          </text>
          <text x={6} y={270}>
            手腕部分
          </text>
          <text x={306} y={212} textAnchor="end">
            扣弦的溝
          </text>
        </g>
      </svg>
    </FigureFrame>
  );
}
