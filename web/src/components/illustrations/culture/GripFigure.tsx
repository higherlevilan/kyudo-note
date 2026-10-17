// 握把為什麼偏下：和弓（握把約在下方 1/3）與對稱弓的對照，四種假說用編號標在圖上。
// Facts: docs/research/01 §1.1（魏志倭人傳「木弓短下長上」；日本武道館出版物的四種推測）。
// Shapes are schematic, both bows drawn at the same length; the grip height is approximate.

import { ANKF } from "@/content/common-sources";
import { CS } from "@/content/culture/sources";
import { FigureFrame, Num } from "./FigureFrame";

const TOP = 44;
const BOTTOM = 424;
const MID = (TOP + BOTTOM) / 2; // 234
// 和弓: grip centre ~1/3 up from the bottom tip (≈ 0.34 L), grip ≈ 15 cm of 221 cm.
const G_TOP = 282;
const G_BOT = 308;

const T = { fontSize: 13 } as const;

function Marker({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g aria-hidden="true">
      <circle cx={x} cy={y} r={10} className="fill-surface stroke-vermilion" strokeWidth={1.4} />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-vermilion">
        {n}
      </text>
    </g>
  );
}

/** Vertical dimension bracket with end ticks. */
function Bracket({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return <path d={`M${x - 4} ${y1}H${x}V${y2}H${x - 4}`} className="fill-none stroke-muted" strokeWidth={1} />;
}

const HYPOTHESES = [
  { n: 1, name: "材料說", text: "未充分加工的天然木材，根部（下段）較強、梢部（上段）較弱；把握把往下移，上下的力量才平衡。" },
  { n: 2, name: "姿勢／操作說", text: "跪坐或蹲姿射擊時，下段短比較方便，也容易瞄準低處；之後的騎射同樣有利。" },
  { n: 3, name: "彈力說", text: "握在下段可以增加反彈力，讓箭的射出角度略微朝上、飛得更遠。" },
  { n: 4, name: "振動節點說", text: "弓身中央是振動的「腹」，握在接近「節」的位置，射出時傳到手上的衝擊比較小。" },
];

export default function GripFigure() {
  return (
    <FigureFrame
      id="fig-grip"
      title="握把為什麼偏下"
      badge="假說，沒有定論"
      caption={
        <>
          左：和弓的握把約在弓身下方三分之一處，《魏志倭人傳》記為「木弓短下長上」；右：一般握把在正中央的弓，作為對照。兩把弓畫成同樣長度，形狀為示意。編號 ①～④ 是日本武道館出版物整理的四種推測，該資料也明說：至今沒有研究從史學上驗證過握把偏下的理由。
        </>
      }
      sources={[CS.budokanBow, CS.yamada, ANKF.history]}
    >
      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,20rem)_1fr]">
        <svg
          viewBox="0 0 340 476"
          role="img"
          aria-label="和弓與對稱弓的對照，標出握把偏下的四種假說（都只是假說，沒有定論）"
          className="mx-auto block h-auto w-full max-w-[20rem]"
        >
          <title>
            和弓與對稱弓的對照：和弓握把約在下方三分之一，上段長、下段短；圖上以編號標出材料、姿勢、彈力、振動節點四種假說，這些都只是假說，沒有定論。
          </title>

          {/* names */}
          <text x={135} y={24} textAnchor="middle" fontSize={16} fontWeight={700} lang="ja" className="fill-ink">
            和弓
          </text>
          <text x={290} y={24} textAnchor="middle" {...T} className="fill-muted">
            對稱弓（對照）
          </text>

          {/* centre line across both bows */}
          <line x1={64} y1={MID} x2={336} y2={MID} className="stroke-muted" strokeWidth={0.8} strokeDasharray="3 3" />
          <text x={6} y={MID - 6} {...T} className="fill-muted">
            弓身中點
          </text>

          {/* ---------- 和弓 ---------- */}
          <line x1={150} y1={TOP} x2={150} y2={BOTTOM} className="stroke-ink" strokeWidth={1} />
          <path
            d={`M150 ${TOP}C140 110 122 210 122 ${G_TOP}V${G_BOT}C122 350 138 400 150 ${BOTTOM}`}
            className="fill-none stroke-wood"
            strokeWidth={5}
            strokeLinecap="round"
          />
          <rect x={117} y={G_TOP} width={10} height={G_BOT - G_TOP} rx={2} className="fill-ink" />
          {/* arrow leaving slightly upward (③) */}
          <path d={`M116 ${G_TOP - 1}L30 ${G_TOP - 11}`} className="stroke-ink" strokeWidth={1.4} />
          <path d={`M30 ${G_TOP - 11}l8 -4.5l-1 9z`} className="fill-ink" />
          <Marker n={3} x={44} y={G_TOP - 32} />

          {/* ① root strong / tip weak */}
          <text x={6} y={96} {...T} className="fill-ink">
            梢・較弱
          </text>
          <Marker n={1} x={76} y={91} />
          <text x={6} y={404} {...T} className="fill-ink">
            根・較強
          </text>
          <Marker n={1} x={76} y={399} />

          {/* ④ antinode at centre, node near the grip */}
          <text x={172} y={MID + 22} {...T} className="fill-ink">
            「腹」
          </text>
          <Marker n={4} x={224} y={MID + 17} />
          <text x={6} y={G_BOT + 26} {...T} className="fill-ink">
            近「節」
          </text>
          <Marker n={4} x={70} y={G_BOT + 21} />
          <path d={`M100 ${G_BOT + 10}l8 8m0 -8l-8 8`} className="stroke-ink" strokeWidth={1.2} aria-hidden="true" />

          {/* lengths */}
          <Bracket x={166} y1={TOP} y2={G_TOP - 4} />
          <text x={172} y={150} {...T} className="fill-ink">
            上段
          </text>
          <text x={172} y={168} {...T} fontWeight={700} className="fill-ink">
            長
          </text>
          <text x={168} y={G_TOP + 18} {...T} lang="ja" className="fill-ink">
            握り
          </text>
          <Bracket x={166} y1={G_BOT + 4} y2={BOTTOM} />
          <text x={172} y={360} {...T} className="fill-ink">
            下段
          </text>
          <text x={172} y={378} {...T} fontWeight={700} className="fill-ink">
            短
          </text>
          <Marker n={2} x={212} y={404} />

          {/* ---------- 對稱弓 ---------- */}
          <line x1={300} y1={TOP} x2={300} y2={BOTTOM} className="stroke-muted" strokeWidth={1} />
          <path
            d={`M300 ${TOP}C290 110 272 170 272 ${MID - 13}V${MID + 13}C272 298 290 358 300 ${BOTTOM}`}
            className="fill-none stroke-muted"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <rect x={267} y={MID - 13} width={10} height={26} rx={2} className="fill-muted" />
          <Bracket x={314} y1={TOP} y2={MID - 16} />
          <text x={318} y={140} {...T} className="fill-muted">
            上
          </text>
          <Bracket x={314} y1={MID + 16} y2={BOTTOM} />
          <text x={318} y={334} {...T} className="fill-muted">
            下
          </text>

          {/* bottom notes */}
          <text x={130} y={450} textAnchor="middle" {...T} className="fill-ink">
            「木弓短下長上」
          </text>
          <text x={130} y={468} textAnchor="middle" {...T} className="fill-muted">
            《魏志倭人傳》
          </text>
          <text x={290} y={450} textAnchor="middle" {...T} className="fill-muted">
            上下等長
          </text>
        </svg>

        <div className="text-sm leading-relaxed">
          <p className="mb-2 font-bold">
            四種推測 <span className="font-normal text-vermilion">（都只是假說，學界沒有定論）</span>
          </p>
          <ol className="space-y-2">
            {HYPOTHESES.map((h) => (
              <li key={h.n} className="flex gap-2">
                <Num n={h.n} className="mt-0.5" />
                <span>
                  <span className="font-semibold">{h.name}</span>：{h.text}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-muted">
            附：實測上下弦長比約 1:1.616，接近黃金比例；但同一份資料說這是偶然的一致，不能當作成因。《弓道教本》「不忍捨棄長大之尊嚴」的說法，也被認為是後人追加的理由。
          </p>
        </div>
      </div>
    </FigureFrame>
  );
}
