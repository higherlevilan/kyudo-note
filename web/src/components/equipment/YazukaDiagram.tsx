// How to measure 矢束: throat centre → fingertip of the left middle finger, arm level with the shoulder.

export default function YazukaDiagram() {
  return (
    <svg viewBox="0 0 340 210" role="img" aria-labelledby="yazuka-fig-title yazuka-fig-desc" className="h-auto w-full max-w-md">
      <title id="yazuka-fig-title">矢束的量法示意圖</title>
      <desc id="yazuka-fig-desc">
        射手面向前方站直，左臂抬到與肩同高、水平伸直。從喉嚨中心量到左手中指指尖，這段長度就是矢束。
      </desc>
      {/* floor */}
      <line x1="20" y1="200" x2="320" y2="200" className="stroke-line" strokeWidth="2" />
      {/* body */}
      <g className="stroke-ink" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8">
        <circle cx="80" cy="38" r="17" strokeWidth="4" />
        <line x1="80" y1="56" x2="80" y2="66" />
        {/* torso */}
        <path d="M62 72 L98 72 L94 140 L66 140 Z" strokeWidth="4" />
        {/* right arm, hanging */}
        <path d="M62 76 L52 108 L50 138" />
        {/* left arm, level with the shoulder */}
        <line x1="98" y1="76" x2="288" y2="76" />
        {/* hand */}
        <path d="M288 76 L304 76" strokeWidth="3.5" />
        {/* legs */}
        <path d="M72 140 L70 198" />
        <path d="M88 140 L90 198" />
      </g>
      {/* measurement points */}
      <circle cx="80" cy="66" r="4.5" className="fill-vermilion" />
      <circle cx="304" cy="76" r="4.5" className="fill-vermilion" />
      {/* extension lines */}
      <g className="stroke-wood" strokeWidth="1.2" strokeDasharray="3 3">
        <line x1="80" y1="70" x2="80" y2="118" />
        <line x1="304" y1="80" x2="304" y2="118" />
      </g>
      {/* dimension line */}
      <g className="stroke-wood" strokeWidth="1.8" fill="none">
        <line x1="84" y1="112" x2="300" y2="112" />
        <path d="M92 107 L84 112 L92 117" />
        <path d="M292 107 L300 112 L292 117" />
      </g>
      <text x="192" y="104" textAnchor="middle" className="fill-wood text-[15px] font-bold">
        矢束
      </text>
      <text x="192" y="134" textAnchor="middle" className="fill-muted text-[11px]">
        喉嚨中心 → 左手中指指尖
      </text>
      <text x="108" y="62" className="fill-muted text-[11px]">
        <tspan lang="ja">喉の中心</tspan>
      </text>
      <text x="304" y="62" textAnchor="end" className="fill-muted text-[11px]">
        中指指尖
      </text>
      <text x="200" y="168" textAnchor="middle" className="fill-muted text-[11px]">
        左臂與肩同高、水平伸直
      </text>
    </svg>
  );
}
