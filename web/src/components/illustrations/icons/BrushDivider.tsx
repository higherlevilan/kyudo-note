// A quiet sumi brush stroke used as a section break. Decorative only.
// The shape is a tapered filled path (thick entry, dry thinning tail) plus two splatter dots.

export default function BrushDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex justify-center ${className}`}>
      <svg viewBox="0 0 240 14" className="h-auto w-40 sm:w-52" focusable="false">
        <path
          d="M4 8.4C10 5.6 22 4.6 40 4.9c34 .5 70 1.6 104 1.8 30 .2 58-.2 86 .6 3 .1 5.6.5 6 1 .3.5-2.4.9-6 1.1-30 1.2-62 1.5-94 1.5-34 0-70-.3-100 .5-14 .4-24 1.2-30 1.6C6.3 11.3 2.6 10.6 4 8.4Z"
          className="fill-wood"
          opacity={0.35}
        />
        <path d="M60 7.6c30-.6 70-.6 110-.2" className="fill-none stroke-wood" strokeWidth={0.6} opacity={0.25} />
        <circle cx={232} cy={10.6} r={0.9} className="fill-wood" opacity={0.3} />
        <circle cx={237} cy={6} r={0.6} className="fill-wood" opacity={0.25} />
      </svg>
    </div>
  );
}
