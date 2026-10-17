// 矢所的「前・後・上・下」（右射者、射手看靶的視角）。靶面重用 home/Kasumi.tsx，方向標示用疊在上面的 SVG。
// 「前＝靶的右側」是社團間的一般說法，全弓連用語辭典與指導書沒有直接定義。

import Kasumi from "@/components/home/Kasumi";
import FigureFrame from "@/components/illustrations/gear/FigureFrame";
import { ANKF } from "@/content/common-sources";

const DIRS = [
  { name: "前", sub: "靶的右側", x: 39, y: 1, ax: 1, ay: 0 },
  { name: "後", sub: "靶的左側", x: -39, y: 1, ax: -1, ay: 0 },
  { name: "上", sub: "", x: 0, y: -31, ax: 0, ay: -1 },
  { name: "下", sub: "", x: 0, y: 38, ax: 0, ay: 1 },
] as const;

export default function Yadokoro() {
  return (
    <FigureFrame
      id="yadokoro"
      title="矢所的前・後・上・下（右射者）"
      caption={
        <>
          矢所（やどころ）是箭落在哪裡；殘心時要看矢所（全弓連）。「前」「後」的方向是<strong className="font-semibold text-vermilion">一般說法</strong>，不是官方定義：
          射手面向脇正面站好時，靶在左手邊，射手身體正面那一側叫「前」，從射手看過去是靶的右側；背後那一側叫「後」，是靶的左側。左射者左右相反。矢所偏向哪裡與射癖的關係，見射法八節。
        </>
      }
      sources={[ANKF.terminology, ANKF.syaho]}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[20rem]">
        <div aria-hidden="true" className="absolute top-[31%] left-[31%] w-[38%]">
          <Kasumi className="block h-auto w-full" />
        </div>
        <svg viewBox="-50 -50 100 100" role="img" aria-label="矢所方向示意：從射手看過去，靶的右側是前，左側是後，另有上、下（一般說法）" className="absolute inset-0 h-full w-full">
          <title>矢所方向示意（一般說法）</title>
          <desc>右射者從射場看靶：靶的右側稱為前，左側稱為後，上方為上，下方為下。這是一般說法，沒有官方定義。</desc>
          {DIRS.map((d) => {
            const x1 = d.ax * 21;
            const y1 = d.ay * 21;
            const x2 = d.ax * 29;
            const y2 = d.ay * 29;
            const hx = d.ax * 31.5;
            const hy = d.ay * 31.5;
            const px = -d.ay * 2.2;
            const py = d.ax * 2.2;
            return (
              <g key={d.name}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-vermilion" strokeWidth={1.3} />
                <path d={`M${hx} ${hy} L${x2 + px} ${y2 + py} L${x2 - px} ${y2 - py} Z`} className="fill-vermilion" />
                <text lang="ja" x={d.x} y={d.y + (d.name === "上" ? -6 : d.name === "下" ? 2 : 0)} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-ink">
                  {d.name}
                </text>
                {d.sub && (
                  <text x={d.x} y={d.y + 7.5} textAnchor="middle" fontSize={4.3} className="fill-muted">
                    {d.sub}
                  </text>
                )}
              </g>
            );
          })}
          <text x={-49} y={-44} fontSize={4.3} className="fill-muted">
            射手看靶的視角
          </text>
          <text x={49} y={-44} textAnchor="end" fontSize={4.3} className="fill-muted">
            右射者
          </text>
          <text x={-49} y={48} fontSize={4.3} className="fill-vermilion">
            一般說法・非官方定義
          </text>
        </svg>
      </div>
    </FigureFrame>
  );
}
