// Comparison table for 裝備百科. Scrolls inside its own container so the page never scrolls sideways.

import { Cites, PointList, TagBadge } from "@/components/content/Blocks";
import type { EqTable } from "@/content/equipment/types";

export default function DataTable({ t }: { t: EqTable }) {
  const hasSrc = t.rows.some((r) => r.tag || r.src?.length);
  // Narrow tables (≤2 columns) put the source inline in the last cell instead of an extra column.
  const inlineSrc = t.head.length <= 2;
  const cols = t.head.length + (hasSrc && !inlineSrc ? 1 : 0);
  const minWidth = cols >= 4 ? `${cols * 8.5}rem` : undefined;

  return (
    <figure className="my-3">
      <figcaption className="mb-1.5 text-sm font-bold text-muted">{t.caption}</figcaption>
      <div role="region" aria-label={t.caption} tabIndex={0} className="relative overflow-x-auto rounded-xl border border-line bg-paper/40">
        <table className="w-full border-collapse text-left text-sm" style={minWidth ? { minWidth } : undefined}>
          <thead className="bg-surface-2">
            <tr>
              {t.head.map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
              {hasSrc && !inlineSrc && (
                <th scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">
                  來源
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r, i) => (
              <tr key={i} className="border-t border-line align-top">
                {r.cells.map((c, j) => {
                  const last = j === r.cells.length - 1;
                  const extra =
                    inlineSrc && last && hasSrc ? (
                      <>
                        {" "}
                        {r.tag && <TagBadge tag={r.tag} />}
                        <Cites src={r.src} />
                      </>
                    ) : null;
                  return j === 0 ? (
                    <th key={j} scope="row" className="px-3 py-2 font-medium">
                      {c}
                      {extra}
                    </th>
                  ) : (
                    <td key={j} className="px-3 py-2 leading-relaxed">
                      {c}
                      {extra}
                    </td>
                  );
                })}
                {hasSrc && !inlineSrc && (
                  <td className="px-3 py-2 text-xs">
                    {r.tag && <TagBadge tag={r.tag} />}
                    <Cites src={r.src} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {t.notes && t.notes.length > 0 && (
        <div className="mt-2 text-sm text-muted">
          <PointList points={t.notes} />
        </div>
      )}
    </figure>
  );
}
