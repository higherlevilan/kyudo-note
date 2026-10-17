// 矢取り對答、說法不一、通用表格等呈現元件。

import type { CompareRow, DressRow, ShitsuRow, StandardRow, YaHoldRow, YatoriVersion } from "@/content/etiquette/sections";
import type { Myth } from "@/content/etiquette/myths";
import { Cites, TagBadge } from "@/components/content/Blocks";
import { ScrollTable } from "./Topic";

const th = "px-3 py-2 text-left font-semibold";
const td = "px-3 py-2 leading-relaxed align-top";

const WHO_STYLE: Record<string, string> = {
  射場: "border-indigo/40 text-indigo",
  指導者: "border-indigo/40 text-indigo",
  看的: "border-wood/50 text-wood",
  安土區: "border-wood/50 text-wood",
  學生: "border-wood/50 text-wood",
  動作: "border-line text-muted",
};

export function YatoriVersions({ versions }: { versions: YatoriVersion[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {versions.map((v) => (
        <section key={v.id} aria-labelledby={`yatori-${v.id}`} className="rounded-xl border border-line bg-surface-2/40 p-4">
          <h4 id={`yatori-${v.id}`} className="font-semibold">
            <TagBadge tag={v.tag} />
            {v.title}
          </h4>
          <ol className="mt-3 space-y-2">
            {v.lines.map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-[15px]">
                <span className={`mt-0.5 shrink-0 rounded border px-1.5 text-xs leading-5 ${WHO_STYLE[l.who]}`}>{l.who}</span>
                {l.who === "動作" ? (
                  <span className="text-muted">{l.text}</span>
                ) : (
                  <span lang={l.ja ? "ja" : undefined} className="font-medium">
                    {l.ja ? `「${l.text}」` : l.text}
                  </span>
                )}
              </li>
            ))}
          </ol>
          {v.note && <p className="mt-3 text-sm leading-relaxed text-muted">{v.note}</p>}
          <p className="mt-1">
            <Cites src={v.src} />
          </p>
        </section>
      ))}
    </div>
  );
}

export function MythList({ myths }: { myths: Myth[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {myths.map((m) => (
        <li key={m.id} id={`myth-${m.id}`} className="rounded-xl border border-line bg-surface p-4">
          <p className="font-semibold">
            <span className="mr-1 text-muted">常聽到：</span>「{m.claim}」
          </p>
          <p className="mt-2 text-[15px] leading-relaxed">
            <TagBadge tag={m.tag} />
            {m.verdict}
            <Cites src={m.src} />
          </p>
        </li>
      ))}
    </ul>
  );
}

export function YaHoldTable({ rows }: { rows: YaHoldRow[] }) {
  return (
    <ScrollTable label="武射系與禮射系的比較">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="bg-surface-2">
            <th scope="col" className={th}>
              項目
            </th>
            <th scope="col" className={th}>
              武射系 <span lang="ja" className="font-normal text-muted">ぶしゃけい</span>
            </th>
            <th scope="col" className={th}>
              禮射系 <span lang="ja" className="font-normal text-muted">れいしゃけい</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.item} className="border-t border-line">
              <th scope="row" className={`${th} whitespace-nowrap align-top`}>
                {r.item}
              </th>
              <td className={td}>{r.bu}</td>
              <td className={td}>{r.rei}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}

export function CompareTable({ rows, a, b, label }: { rows: CompareRow[]; a: string; b: string; label: string }) {
  return (
    <ScrollTable label={label}>
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="bg-surface-2">
            <th scope="col" className={th}>
              項目
            </th>
            <th scope="col" className={th}>
              {a}
            </th>
            <th scope="col" className={th}>
              {b}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.item} className="border-t border-line">
              <th scope="row" className={`${th} whitespace-nowrap align-top`}>
                {r.item}
                {r.tag && (
                  <span className="mt-1 block">
                    <TagBadge tag={r.tag} />
                  </span>
                )}
              </th>
              <td className={td}>{r.a}</td>
              <td className={td}>
                {r.b}
                <Cites src={r.src} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}

export function StandardTable({ rows }: { rows: StandardRow[] }) {
  return (
    <ScrollTable label="審查統一基準的體配欄">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-surface-2">
            <th scope="col" className={th}>
              段級
            </th>
            <th scope="col" className={th}>
              體配欄（原文）
            </th>
            <th scope="col" className={th}>
              中文
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.grade} className="border-t border-line">
              <th scope="row" className={`${th} whitespace-nowrap align-top`}>
                {r.grade}
              </th>
              <td lang="ja" className={td}>
                {r.ja}
              </td>
              <td className={td}>
                {r.zh}
                {r.note && <span className="mt-1 block text-xs text-muted">{r.note}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}

export function ShitsuTable({ rows }: { rows: ShitsuRow[] }) {
  return (
    <ScrollTable label="各種失的處理">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="bg-surface-2">
            <th scope="col" className={th}>
              狀況
            </th>
            <th scope="col" className={th}>
              處理方式
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.case} className="border-t border-line">
              <th scope="row" className={`${th} w-44 align-top`}>
                {r.case}
              </th>
              <td className={td}>
                <TagBadge tag={r.tag} />
                {r.handle}
                <Cites src={r.src} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}

export function DressTable({ rows }: { rows: DressRow[] }) {
  return (
    <ScrollTable label="服裝規定與做法">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="bg-surface-2">
            <th scope="col" className={th}>
              場合
            </th>
            <th scope="col" className={th}>
              規定或做法
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.item} className="border-t border-line">
              <th scope="row" className={`${th} w-40 align-top`}>
                {r.item}
              </th>
              <td className={td}>
                <TagBadge tag={r.tag} />
                {r.text}
                <Cites src={r.src} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}
