// 矢的部位（側面，上：全長；下：筈端放大）與甲矢・乙矢的斷面（從筈端看）。
// 全長以 100 cm 示意；羽丈 14 cm（競技規則近的 13〜15 cm）。

import { ANKF, SHOP } from "@/content/equipment/sources";
import FigureFrame from "./FigureFrame";
import { r1 } from "./geom";

/* ── overview: 1 cm = 2.9 units, head on the left, nock on the right ── */
const OV_L = 100;
const OV_S = 2.9;
const OV_R = 306; // nock end x
const ox = (cmFromNock: number) => r1(OV_R - cmFromNock * OV_S);
const OV_Y = 44;

/* ── detail of the nock end: 0–26 cm, 1 cm = 11 units ── */
const D_S = 11;
const D_R = 300;
const dx = (cmFromNock: number) => r1(D_R - cmFromNock * D_S);
const D_Y = 176; // shaft centre line
const D_SHAFT = 4.2; // half thickness (exaggerated)
const ZOOM = 26;

// positions in cm from the nock end
const HAZU = [0, 2] as const;
const HAZUMAKI = [2, 3.6] as const;
const URAHAGI = [5.6, 7] as const;
const HANE = [6.4, 20.4] as const; // 羽丈 14 cm
const MOTOHAGI = [20, 23] as const;

/** feather outline (side view) above the shaft; height in units */
function feather(h: number, up: boolean): string {
  const s = up ? -1 : 1;
  const y0 = D_Y + s * D_SHAFT;
  const front = dx(HANE[1]);
  const rear = dx(HANE[0]);
  const len = rear - front;
  return `M${front},${y0} C${front + len * 0.25},${y0 + s * h * 0.55} ${front + len * 0.55},${y0 + s * h} ${front + len * 0.8},${y0 + s * h} L${rear - 4},${y0 + s * h} Q${rear},${y0 + s * h} ${rear},${y0 + s * (h - 4)} L${rear},${y0} Z`;
}

function Lead({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g className="stroke-muted" strokeWidth={0.9}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <circle cx={x2} cy={y2} r={1.8} className="fill-muted" stroke="none" />
    </g>
  );
}

export function YaParts() {
  return (
    <FigureFrame
      id="ya-parts"
      title="矢的部位"
      caption={
        <>
          上圖是整支箭（以 100 cm 示意），下圖放大筈這一端的 26 cm。羽丈畫成 14 cm（近的規定 13〜15 cm）；箭桿粗細放大。三片羽從側面只看得到走り羽和下方重疊的兩片。
        </>
      }
      sources={[ANKF.playRules, ANKF.terminology]}
    >
      <svg viewBox="0 0 320 262" role="img" aria-label="矢的部位示意圖" className="mx-auto block h-auto w-full max-w-xl">
        <title>矢的部位示意圖</title>
        <desc>
          整支箭從左到右：板付（矢尻）、箆（箭桿）、本矧、羽、末矧、筈巻、筈。放大圖顯示筈端：走り羽在上，另外兩片羽在下方重疊；羽的前後兩端用線纏住，前端是本矧、後端是末矧；筈旁邊是筈巻。
        </desc>

        {/* ── overview ── */}
        <g>
          <rect x={ox(OV_L)} y={OV_Y - 1.6} width={r1(OV_L * OV_S)} height={3.2} rx={1.6} className="fill-wood" />
          {/* 板付 */}
          <path d={`M${ox(OV_L) - 6},${OV_Y} L${ox(OV_L - 3)},${OV_Y - 3} L${ox(OV_L - 3)},${OV_Y + 3} Z`} className="fill-ink" />
          {/* feathers */}
          <path d={`M${ox(HANE[1])},${OV_Y - 1.6} Q${ox(13)},${OV_Y - 9} ${ox(HANE[0])},${OV_Y - 8} L${ox(HANE[0])},${OV_Y - 1.6} Z`} className="fill-surface stroke-ink" strokeWidth={0.8} />
          <path d={`M${ox(HANE[1])},${OV_Y + 1.6} Q${ox(13)},${OV_Y + 6} ${ox(HANE[0])},${OV_Y + 5} L${ox(HANE[0])},${OV_Y + 1.6} Z`} className="fill-surface-2 stroke-ink" strokeWidth={0.6} />
          <rect x={ox(HAZU[1])} y={OV_Y - 2.2} width={r1(2 * OV_S)} height={4.4} rx={1} className="fill-ink" />
          {/* zoom frame */}
          <rect x={ox(ZOOM)} y={OV_Y - 11} width={r1(ZOOM * OV_S) + 4} height={22} rx={3} className="stroke-indigo" fill="none" strokeWidth={1} strokeDasharray="3 3" />
          <g className="stroke-indigo/60" strokeWidth={0.8} strokeDasharray="3 3">
            <line x1={ox(ZOOM)} y1={OV_Y + 11} x2={dx(ZOOM)} y2={D_Y - 54} />
            <line x1={OV_R + 4} y1={OV_Y + 11} x2={D_R + 8} y2={D_Y - 54} />
          </g>
          <g fontSize={13}>
            <text lang="ja" x={ox(OV_L) - 6} y={OV_Y - 15} className="fill-ink">
              板付（矢尻）
            </text>
            <Lead x1={ox(OV_L) + 4} y1={OV_Y - 12} x2={ox(OV_L - 1.5)} y2={OV_Y} />
            <text x={ox(47)} y={OV_Y - 15} textAnchor="middle" className="fill-ink">
              <tspan lang="ja">箆</tspan>：箭桿，直徑 6 mm 以上
            </text>
            <Lead x1={ox(60)} y1={OV_Y - 12} x2={ox(60)} y2={OV_Y - 1.6} />
          </g>
        </g>

        {/* ── detail ── */}
        <g>
          <rect x={dx(ZOOM)} y={D_Y - D_SHAFT} width={r1(ZOOM * D_S)} height={D_SHAFT * 2} className="fill-wood" />
          {/* lower two feathers (overlapping in side view) */}
          <path d={feather(15, false)} className="fill-surface-2 stroke-ink" strokeWidth={0.9} />
          {/* 走り羽 */}
          <path d={feather(26, true)} className="fill-surface stroke-ink" strokeWidth={1} />
          {/* bindings */}
          <rect x={dx(MOTOHAGI[1])} y={D_Y - D_SHAFT - 1} width={r1((MOTOHAGI[1] - MOTOHAGI[0]) * D_S)} height={D_SHAFT * 2 + 2} rx={1.5} className="fill-ink/70" />
          <rect x={dx(URAHAGI[1])} y={D_Y - D_SHAFT - 1} width={r1((URAHAGI[1] - URAHAGI[0]) * D_S)} height={D_SHAFT * 2 + 2} rx={1.5} className="fill-ink/70" />
          <rect x={dx(HAZUMAKI[1])} y={D_Y - D_SHAFT - 0.8} width={r1((HAZUMAKI[1] - HAZUMAKI[0]) * D_S)} height={D_SHAFT * 2 + 1.6} rx={1.5} className="fill-ink/55" />
          {/* 筈 with its slot */}
          <path
            d={`M${dx(HAZU[1])},${D_Y - D_SHAFT - 1.2} H${D_R} V${D_Y - 2} L${D_R - 7},${D_Y - 1} V${D_Y + 1} L${D_R},${D_Y + 2} V${D_Y + D_SHAFT + 1.2} H${dx(HAZU[1])} Z`}
            className="fill-ink"
          />
          {/* labels */}
          <g fontSize={13}>
            <text lang="ja" x={dx(13.4)} y={D_Y - 44} textAnchor="middle" className="fill-ink" fontWeight={700}>
              羽・走り羽
            </text>
            <Lead x1={dx(13.4)} y1={D_Y - 40} x2={dx(11)} y2={D_Y - 22} />
            <text lang="ja" x={dx(13.4)} y={D_Y + 40} textAnchor="middle" className="fill-ink">
              外掛羽・弓摺羽（重疊）
            </text>
            <Lead x1={dx(13.4)} y1={D_Y + 28} x2={dx(12)} y2={D_Y + 14} />

            <text lang="ja" x={dx(MOTOHAGI[1]) - 2} y={D_Y - 24} textAnchor="middle" className="fill-ink" fontWeight={700}>
              本矧
            </text>
            <Lead x1={dx(MOTOHAGI[1]) - 2} y1={D_Y - 20} x2={dx(21.5)} y2={D_Y - D_SHAFT - 1} />

            <text lang="ja" x={dx(6.3)} y={D_Y - 44} textAnchor="middle" className="fill-ink" fontWeight={700}>
              末矧
            </text>
            <Lead x1={dx(6.3)} y1={D_Y - 40} x2={dx(6.3)} y2={D_Y - D_SHAFT - 1} />

            <text lang="ja" x={dx(2.8)} y={D_Y + 40} textAnchor="middle" className="fill-ink" fontWeight={700}>
              筈巻
            </text>
            <Lead x1={dx(2.8)} y1={D_Y + 28} x2={dx(2.8)} y2={D_Y + D_SHAFT + 1} />

            <text lang="ja" x={D_R + 2} y={D_Y - 24} textAnchor="end" className="fill-ink" fontWeight={700}>
              筈
            </text>
            <Lead x1={D_R - 4} y1={D_Y - 20} x2={dx(1)} y2={D_Y - D_SHAFT - 1} />

            <text x={dx(ZOOM)} y={D_Y + 70} className="fill-muted">
              ← 箭頭方向
            </text>
            <text x={D_R} y={D_Y + 70} textAnchor="end" className="fill-muted">
              羽丈 13〜15 cm（近的）
            </text>
          </g>
        </g>
      </svg>
    </FigureFrame>
  );
}

/* ── 甲矢・乙矢 cross-section ── */

const VANE = 40;

function Section({ cx, kind }: { cx: number; kind: "haya" | "otoya" }) {
  const cy = 92;
  const vanes = [
    { a: -90, name: "走り羽" },
    { a: 30, name: "外掛羽" },
    { a: 150, name: "弓摺羽" },
  ];
  const omote = kind === "haya" ? 1 : -1; // 表 on the side away from (+1) or toward (−1) the bow
  return (
    <g>
      {/* bow, seen end-on, to the archer's left of the arrow */}
      <rect x={cx - 66} y={cy - 26} width={12} height={52} rx={5} className="fill-wood stroke-ink" strokeWidth={0.8} />
      <text x={cx - 60} y={cy + 44} textAnchor="middle" fontSize={13} className="fill-muted">
        弓
      </text>
      {vanes.map((v) => {
        const t = (v.a * Math.PI) / 180;
        const x2 = r1(cx + Math.cos(t) * VANE);
        const y2 = r1(cy + Math.sin(t) * VANE);
        return <line key={v.a} x1={cx} y1={cy} x2={x2} y2={y2} className="stroke-ink" strokeWidth={3.2} strokeLinecap="round" />;
      })}
      {/* 表 of the 走り羽 */}
      <line x1={cx + omote * 3.4} y1={cy - 10} x2={cx + omote * 3.4} y2={cy - VANE + 1} className="stroke-vermilion" strokeWidth={2.6} strokeLinecap="round" />
      <text x={cx + omote * 9} y={cy - 26} textAnchor={omote > 0 ? "start" : "end"} fontSize={13} fontWeight={700} className="fill-vermilion">
        表
      </text>
      <circle cx={cx} cy={cy} r={6.5} className="fill-wood stroke-ink" strokeWidth={1} />
      <text lang="ja" x={cx} y={cy - VANE - 8} textAnchor="middle" fontSize={13} className="fill-ink">
        走り羽
      </text>
      <text lang="ja" x={cx + 38} y={cy + 40} textAnchor="middle" fontSize={13} className="fill-ink">
        外掛羽
      </text>
      <text lang="ja" x={cx - 22} y={cy + 56} textAnchor="middle" fontSize={13} className="fill-ink">
        弓摺羽
      </text>
      <text x={cx} y={cy + 84} textAnchor="middle" fontSize={14} fontWeight={700} className="fill-ink">
        <tspan lang="ja">{kind === "haya" ? "甲矢" : "乙矢"}</tspan>
        <tspan>：表朝{kind === "haya" ? "外" : "內"}</tspan>
      </text>
    </g>
  );
}

export function HayaOtoya() {
  return (
    <FigureFrame
      id="haya-otoya"
      title="甲矢・乙矢：搭弦時從筈端看"
      caption={
        <>
          用語辭典的定義：甲矢是「羽根の表が外向き」的箭，乙矢是搭弦時「矢羽根の表が内側にある」的箭。圖中紅線標出走り羽（朝上那片）的表；「外／內」以弓為準來畫，是本站對定義的圖解。
          有些資料改用「羽順時針／逆時針」說明，但從哪一端看各說不一，本站不採用。
        </>
      }
      sources={[ANKF.terminology, ANKF.playRules, SHOP.suizanYa]}
    >
      <svg viewBox="0 0 320 196" role="img" aria-label="甲矢與乙矢的斷面示意：甲矢走り羽的表朝外（遠離弓），乙矢朝內（靠弓）" className="mx-auto block h-auto w-full max-w-lg">
        <title>甲矢與乙矢的斷面示意</title>
        <desc>
          從筈的一端沿著箭看過去，弓在箭的左邊。三片羽：走り羽朝上，外掛羽在右下（離弓較遠），弓摺羽在左下（靠弓）。甲矢的走り羽，羽的表朝外；乙矢朝內。
        </desc>
        <text x={160} y={16} textAnchor="middle" fontSize={13} className="fill-muted">
          從筈端看（射手的視角），弓在箭的左邊
        </text>
        <line x1={160} y1={34} x2={160} y2={186} className="stroke-line" strokeWidth={1} />
        <Section cx={92} kind="haya" />
        <Section cx={252} kind="otoya" />
      </svg>
    </FigureFrame>
  );
}
