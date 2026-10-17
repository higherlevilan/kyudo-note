// 基本體的卡片格：4 種基本姿勢＋8 種基本動作。

import type { KihonItem } from "@/content/etiquette/kihontai";
import { PointList, TagBadge } from "@/components/content/Blocks";

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];

function KihonCard({ k }: { k: KihonItem }) {
  const hasDeep = (k.mistakes?.length ?? 0) > 0 || (k.deep?.length ?? 0) > 0;
  return (
    <article id={k.id} className="flex scroll-mt-20 flex-col rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <header>
        <p className="text-xs text-wood">
          基本{k.group} {CIRCLED[k.no - 1]}
        </p>
        <h4 className="mt-0.5 text-lg font-semibold">
          <span lang="ja">{k.ja}</span>
        </h4>
        <p className="text-sm text-muted">
          <span lang="ja">{k.kana}</span>
          <span className="mx-1.5" aria-hidden="true">
            ・
          </span>
          {k.zh}
        </p>
      </header>
      <p className="mt-3 text-[15px] leading-relaxed">{k.summary}</p>

      {k.figures && (
        <dl className="mt-3 flex flex-wrap gap-2">
          {k.figures.map((f) => (
            <div key={f.label} className="rounded-lg border border-line bg-surface-2/60 px-2.5 py-1.5 text-sm">
              <dt className="text-xs text-muted">{f.label}</dt>
              <dd className="font-semibold">
                {f.value}
                <span className="ml-1.5 align-[1px]">
                  <TagBadge tag={f.tag} />
                </span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-3 text-[15px]">
        <h5 className="mb-1.5 text-sm font-bold text-muted">怎麼做</h5>
        <PointList points={k.howto} />
      </div>

      {hasDeep && (
        <details data-layer="deep" className="mt-3 border-t border-line pt-3">
          <summary className="flex items-center gap-1.5 text-sm font-semibold text-wood">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3.5 w-3.5 fill-current">
              <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
            </svg>
            深入：常見錯誤與細節
          </summary>
          <div className="mt-3 space-y-3 text-[15px]">
            {k.mistakes && (
              <div>
                <h5 className="mb-1.5 text-sm font-bold text-muted">
                  常見錯誤 <span className="font-normal">（指導現場常見的提醒，不是官方扣分表）</span>
                </h5>
                <ul className="list-disc space-y-1 pl-5">
                  {k.mistakes.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {k.deep && <PointList points={k.deep} />}
          </div>
        </details>
      )}
    </article>
  );
}

export default function KihonGrid({ items }: { items: KihonItem[] }) {
  const groups = [
    { key: "姿勢" as const, title: "四種基本姿勢" },
    { key: "動作" as const, title: "八種基本動作" },
  ];
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <div key={g.key}>
          <h3 className="mb-3 text-xl font-semibold">{g.title}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {items
              .filter((k) => k.group === g.key)
              .map((k) => (
                <KihonCard key={k.id} k={k} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
