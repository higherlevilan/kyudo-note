// 矢所分析表（全部五列）。Server-rendered so it is readable without JavaScript.

import { PointList, TagBadge } from "@/components/content/Blocks";
import { YADOKORO_ROWS } from "@/content/shaguse/yadokoro";

export default function YadokoroTable() {
  return (
    <figure>
      <figcaption className="mb-1.5 text-sm font-bold text-muted">矢所與常見原因（右射者）</figcaption>
      <div role="region" aria-label="矢所與常見原因對照表" tabIndex={0} className="overflow-x-auto rounded-xl border border-line bg-paper/40">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead className="bg-surface-2">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">
                矢所
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                <TagBadge tag="folk" />
                常見原因
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                有官方、指導書或研究支持的部分
              </th>
            </tr>
          </thead>
          <tbody>
            {YADOKORO_ROWS.map((r) => (
              <tr key={r.dir} className="border-t border-line align-top">
                <th scope="row" className="px-3 py-2 font-semibold whitespace-nowrap">
                  {r.label}
                  <span className="block text-xs font-normal text-muted">{r.where}</span>
                </th>
                <td className="px-3 py-2 leading-relaxed">{r.causes.map((c) => c.text).join("；")}</td>
                <td className="px-3 py-2">
                  <PointList points={r.support} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
