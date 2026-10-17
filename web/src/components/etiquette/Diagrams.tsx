// Inline SVG schematics. Colours come from the site tokens via currentColor / Tailwind fill-* & stroke-*.

const HEAD_R = 9;

function Figure({ hx, angle, ghost, arm }: { hx: number; angle: number; ghost?: boolean; arm?: boolean }) {
  const hy = 120;
  const t = (angle * Math.PI) / 180;
  const L = 70;
  const ex = hx + L * Math.sin(t);
  const ey = hy - L * Math.cos(t);
  const cx = hx + (L + 10) * Math.sin(t);
  const cy = hy - (L + 10) * Math.cos(t);
  const sx = hx + 60 * Math.sin(t);
  const sy = hy - 60 * Math.cos(t);
  const common = ghost ? "stroke-muted opacity-50" : "stroke-ink";
  return (
    <g className={common} strokeWidth={ghost ? 1.5 : 3} strokeLinecap="round" fill="none" strokeDasharray={ghost ? "4 4" : undefined}>
      <line x1={hx} y1={hy} x2={ex} y2={ey} />
      <circle cx={cx} cy={cy} r={HEAD_R} className={ghost ? "" : "fill-surface"} />
      {arm && <line x1={sx} y1={sy} x2={hx + 4} y2={hy + 22} />}
    </g>
  );
}

function Legs({ hx }: { hx: number }) {
  return (
    <g className="stroke-ink" strokeWidth={3} strokeLinecap="round" fill="none">
      <line x1={hx} y1={120} x2={hx} y2={182} />
      <line x1={hx} y1={182} x2={hx + 14} y2={182} />
    </g>
  );
}

/** 揖（上半身前屈約 10 cm）與立禮（約 45 度）的側面示意。 */
export function BowDiagram() {
  return (
    <figure className="rounded-xl border border-line bg-surface-2/50 p-3">
      <svg viewBox="0 0 360 228" role="img" aria-labelledby="bow-title bow-desc" className="mx-auto block h-auto w-full max-w-md">
        <title id="bow-title">揖與立禮的側面示意</title>
        <desc id="bow-desc">左圖為揖：上半身從髖關節前屈，頭部約前移 10 公分。右圖為立禮：上半身約前屈 45 度，雙手指尖到膝頭。</desc>
        <line x1={10} y1={184} x2={350} y2={184} className="stroke-line" strokeWidth={2} />
        {/* 揖 */}
        <Figure hx={80} angle={0} ghost />
        <Figure hx={80} angle={6.8} />
        <Legs hx={80} />
        <g className="stroke-vermilion fill-vermilion" strokeWidth={1.5}>
          <line x1={80} y1={20} x2={90} y2={20} />
          <path d="M80 16v8M90 16v8" fill="none" />
        </g>
        <text x={96} y={24} className="fill-vermilion" fontSize={12}>
          約 10 cm
        </text>
        <text x={80} y={204} textAnchor="middle" className="fill-ink" fontSize={14} fontWeight={700}>
          揖
        </text>
        <text x={80} y={221} textAnchor="middle" className="fill-muted" fontSize={11}>
          上半身前屈約 10 公分
        </text>
        {/* 立禮 */}
        <Figure hx={250} angle={0} ghost />
        <Figure hx={250} angle={45} arm />
        <Legs hx={250} />
        <path d="M250 92 A28 28 0 0 1 269.8 100.2" className="stroke-vermilion" strokeWidth={1.5} fill="none" />
        <text x={274} y={96} className="fill-vermilion" fontSize={12}>
          約 45°
        </text>
        <text x={250} y={204} textAnchor="middle" className="fill-ink" fontSize={14} fontWeight={700}>
          立禮
        </text>
        <text x={250} y={221} textAnchor="middle" className="fill-muted" fontSize={11}>
          指尖到膝頭
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-muted">
        示意圖，面向右側。揖的「約 10 公分」出自全弓連用語辭典，是距離不是角度；以身高約 170 公分粗估，相當於前傾 6～7 度（本站換算，不是規定）。立禮的 45 度出自指導書。
      </figcaption>
    </figure>
  );
}

function Archer({ x, y, facing }: { x: number; y: number; facing: "up" | "right" }) {
  const tri = facing === "up" ? `M${x - 5} ${y - 9} L${x} ${y - 17} L${x + 5} ${y - 9} Z` : `M${x + 9} ${y - 5} L${x + 17} ${y} L${x + 9} ${y + 5} Z`;
  return (
    <g>
      <circle cx={x} cy={y} r={10} className="fill-surface stroke-ink" strokeWidth={2.5} />
      <path d={tri} className="fill-ink" />
    </g>
  );
}

/** 坐射：本座 → 射位 → 開き足（俯視示意，單人）。 */
export function ShajoDiagram() {
  return (
    <figure className="rounded-xl border border-line bg-surface-2/50 p-3">
      <svg viewBox="0 0 360 270" role="img" aria-labelledby="shajo-title shajo-desc" className="mx-auto block h-auto w-full max-w-md">
        <title id="shajo-title">坐射從本座到射位的俯視示意</title>
        <desc id="shajo-desc">
          射手在本座面向靶跪坐，起身左腳先出，走三步到射位跪坐，再用開き足向右轉 90 度，面向脇正面；此時靶在射手的左側。
        </desc>
        {/* 安土・的 */}
        <rect x={20} y={10} width={320} height={30} rx={6} className="fill-wood-soft stroke-line" />
        <circle cx={180} cy={25} r={10} className="fill-surface stroke-ink" strokeWidth={2} />
        <circle cx={180} cy={25} r={4} className="fill-ink" />
        <text x={30} y={30} className="fill-ink" fontSize={12}>
          安土・的（的正面）
        </text>
        {/* shooting direction */}
        <line x1={180} y1={118} x2={180} y2={44} className="stroke-muted" strokeDasharray="3 5" strokeWidth={1.5} />
        {/* 射位 / 本座 lines */}
        <line x1={30} y1={150} x2={330} y2={150} className="stroke-indigo" strokeWidth={2} />
        <text x={30} y={144} className="fill-indigo" fontSize={12} fontWeight={700}>
          射位
        </text>
        <line x1={30} y1={232} x2={330} y2={232} className="stroke-wood" strokeWidth={2} />
        <text x={30} y={250} className="fill-wood" fontSize={12} fontWeight={700}>
          本座
        </text>
        {/* distance bracket */}
        <g className="stroke-muted" strokeWidth={1.2} fill="none">
          <path d="M60 152v78M56 152h8M56 230h8" />
        </g>
        <text x={68} y={186} className="fill-muted" fontSize={11}>
          坐射 3 步
        </text>
        <text x={68} y={201} className="fill-muted" fontSize={11}>
          （近的標準 2.0 m）
        </text>
        {/* footsteps: 左 → 右 → 左 */}
        <g className="fill-wood/70">
          <ellipse cx={173} cy={208} rx={4} ry={7} />
          <ellipse cx={188} cy={186} rx={4} ry={7} />
          <ellipse cx={173} cy={164} rx={4} ry={7} />
        </g>
        <text x={196} y={212} className="fill-muted" fontSize={10}>
          ① 左
        </text>
        <text x={210} y={190} className="fill-muted" fontSize={10}>
          ② 右
        </text>
        <text x={196} y={168} className="fill-muted" fontSize={10}>
          ③ 左
        </text>
        <Archer x={180} y={244} facing="up" />
        {/* at 射位 after 開き足 */}
        <Archer x={180} y={140} facing="right" />
        <path d="M168 120 A20 20 0 0 1 200 122" className="stroke-vermilion" strokeWidth={1.8} fill="none" />
        <path d="M200 122 l-7 -1 l4 6 z" className="fill-vermilion" />
        <text x={206} y={116} className="fill-vermilion" fontSize={11}>
          開き足 90°
        </text>
        <line x1={200} y1={140} x2={300} y2={140} className="stroke-ink" strokeWidth={1.5} />
        <path d="M300 140 l-8 -4 v8 z" className="fill-ink" />
        <text x={302} y={130} className="fill-ink" fontSize={11}>
          脇正面
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-muted">
        單人俯視示意（不按比例）。坐射在射位轉向脇正面（審判員席方向）後，靶在射手的左側。實際的入退場路線依上座位置而不同，這裡不畫。
      </figcaption>
    </figure>
  );
}
