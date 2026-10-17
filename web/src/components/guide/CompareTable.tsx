// 弓道 vs 現代射箭: a table on wide screens, stacked cards on phones.

import { Cites, TagBadge } from "@/components/content/Blocks";
import type { CompareRow } from "@/content/guide/content";

export default function CompareTable({ rows }: { rows: readonly CompareRow[] }) {
  return (
    <div className="rounded-2xl border border-line bg-surface">
      {/* wide screens */}
      <table className="hidden w-full text-left text-[15px] md:table">
        <caption className="sr-only">弓道與現代射箭的比較</caption>
        <thead className="border-b border-line text-sm text-muted">
          <tr>
            <th scope="col" className="w-36 px-4 py-3 font-semibold">
              項目
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              <span lang="ja">弓道</span>
            </th>
            <th scope="col" className="w-64 px-4 py-3 font-semibold">
              現代射箭（本站整理，僅供對照）
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.item} className="align-top">
              <th scope="row" className="px-4 py-3 font-semibold">
                {r.item}
              </th>
              <td className="px-4 py-3 leading-relaxed">
                <TagBadge tag={r.kyudoTag} />
                {r.kyudo}
                <Cites src={r.kyudoSrc} />
              </td>
              <td className="px-4 py-3 leading-relaxed text-muted">{r.archery}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* phones */}
      <dl className="divide-y divide-line md:hidden">
        {rows.map((r) => (
          <div key={r.item} className="p-4">
            <dt className="font-semibold">{r.item}</dt>
            <dd className="mt-1.5 text-[15px] leading-relaxed">
              <span lang="ja" className="mr-1 text-xs text-wood">
                弓道
              </span>
              <TagBadge tag={r.kyudoTag} />
              {r.kyudo}
              <Cites src={r.kyudoSrc} />
            </dd>
            <dd className="mt-1 text-[15px] leading-relaxed text-muted">
              <span className="mr-1 text-xs">現代射箭</span>
              {r.archery}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
