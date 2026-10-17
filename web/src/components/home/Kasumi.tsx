// 霞的 (36 cm) drawn to the ANKF 競技規則 第26条 proportions (radii in cm, outer → inner):
// 三の黒 18–14.7, 三の白 14.7–11.7, 二の黒 11.7–10.2, 二の白 10.2–7.2, 一の黒 7.2–3.6, 中白 3.6.

const RINGS: [number, "black" | "white"][] = [
  [18, "black"],
  [14.7, "white"],
  [11.7, "black"],
  [10.2, "white"],
  [7.2, "black"],
  [3.6, "white"],
];

export default function Kasumi({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-19 -19 38 38" role="img" aria-label="霞的（直徑 36 公分）" className={className}>
      <circle r={18.6} className="fill-wood/70" />
      {RINGS.map(([r, c]) => (
        <circle key={r} r={r} className={c === "black" ? "fill-[#1f1b17]" : "fill-[#fbf8f2]"} />
      ))}
    </svg>
  );
}
