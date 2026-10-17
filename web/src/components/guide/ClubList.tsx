// 台灣弓道團體一覽 as reflowing cards (no horizontal scroll on small screens).

import { CLUB_STATUS, type Club } from "@/content/guide/content";

export default function ClubList({ clubs, checkedOn }: { clubs: readonly Club[]; checkedOn: string }) {
  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        資料查詢日期 {checkedOn}。「最近活動」是能查到的最新公開貼文或活動日期；Instagram 日期由工具讀取後推論，沒有逐一人工確認。
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {clubs.map((c) => {
          const st = CLUB_STATUS[c.status];
          return (
            <li key={c.name} className="flex flex-col rounded-xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="font-semibold">{c.name}</h4>
                <span className={`rounded border px-1.5 py-px text-[11px] whitespace-nowrap ${st.cls}`}>{st.label}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted">
                {c.area}・{c.kind}
              </p>
              {c.open && <p className="mt-2 text-sm font-medium">{c.open}</p>}
              {c.note && <p className="mt-1.5 text-sm leading-relaxed">{c.note}</p>}
              <div className="mt-auto pt-3 text-xs">
                <p className="text-muted">最近活動：{c.lastSeen}</p>
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  {c.links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="break-all text-wood underline">
                      {l.label}
                    </a>
                  ))}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
