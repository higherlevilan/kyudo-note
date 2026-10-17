// 段位與稱號：a ladder drawn bottom-up (DOM order stays ascending: 五級 first).

import { Cites } from "@/components/content/Blocks";
import { ANKF } from "@/content/common-sources";
import { RANKS, TITLES, type RankBand } from "@/content/culture/ranks";

const BAND: Record<RankBand, { box: string; label: string }> = {
  kyu: { box: "bg-surface-2 border-line", label: "級位" },
  dan: { box: "bg-wood-soft/60 border-wood/30", label: "段位" },
  senko: { box: "bg-indigo/10 border-indigo/30", label: "選考" },
};

function Chev() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3 w-3 shrink-0 fill-current text-wood">
      <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
    </svg>
  );
}

function DanLadder() {
  return (
    <div>
      <h3 className="mb-2 text-lg font-bold">級位與段位</h3>
      <p className="mb-3 text-sm text-muted">由下往上爬。點開各階，可看《審査規程》第 8 條的資格基準（原文節錄＋中譯）。</p>
      <div className="rounded-2xl border-x-4 border-wood/40 px-2 py-1 sm:px-3">
        <ol aria-label="級位與段位，由低到高" className="flex flex-col-reverse gap-1.5 py-1">
          {RANKS.map((r) => {
            const band = BAND[r.band];
            const head = (
              <>
                <span lang="ja" className="w-12 shrink-0 font-semibold">
                  {r.name}
                </span>
                <span lang="ja" className="hidden w-20 shrink-0 text-xs text-muted min-[400px]:inline">
                  {r.kana}
                </span>
                {r.hit && (
                  <span
                    lang="ja"
                    className={`rounded px-1.5 py-px text-[11px] leading-4 ${
                      r.id === "2dan" ? "bg-surface text-muted" : "bg-vermilion/10 text-vermilion"
                    }`}
                  >
                    {r.hit}
                  </span>
                )}
                <span className="ml-auto shrink-0 text-[11px] text-muted">{r.level}</span>
              </>
            );
            return (
              <li key={r.id} className={`rounded-lg border text-sm ${band.box}`}>
                {r.ja ? (
                  <details>
                    <summary className="flex min-h-10 items-center gap-2 px-3 py-2">
                      <Chev />
                      {head}
                    </summary>
                    <div className="border-t border-line/70 px-3 py-2 leading-relaxed">
                      <p lang="ja" className="text-ink">
                        {r.ja}
                      </p>
                      <p className="mt-1 text-muted">{r.zh}</p>
                    </div>
                  </details>
                ) : (
                  <div className="flex min-h-10 items-center gap-2 px-3 py-2 pl-[2rem]">{head}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        右側小字為主要的審查會層級。四級～二級、十段，本站未列出個別資格基準。
        <Cites src={[ANKF.probationRules, ANKF.probationStandard]} />
      </p>
    </div>
  );
}

function TitleLadder() {
  return (
    <div>
      <h3 className="mb-2 text-lg font-bold">稱號</h3>
      <p className="mb-3 text-sm text-muted">稱號與段位是兩條並行的路：要先有一定段位，才能受審稱號。</p>
      <ol aria-label="稱號，由低到高" className="flex flex-col-reverse gap-2">
        {TITLES.map((t, i) => (
          <li key={t.id} className="relative rounded-xl border border-indigo/30 bg-surface p-3 text-sm">
            {i > 0 && (
              <span aria-hidden="true" className="absolute -bottom-2 left-6 h-2 border-l-2 border-indigo/40" />
            )}
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span lang="ja" className="text-base font-bold">
                {t.name}
              </span>
              <span lang="ja" className="text-xs text-muted">
                {t.kana}
              </span>
              <span className="ml-auto text-xs text-muted">現有 {t.count}</span>
            </p>
            <dl className="mt-1.5 grid grid-cols-[4.5em_1fr] gap-x-2 gap-y-1 leading-relaxed">
              <dt className="text-muted">受審條件</dt>
              <dd>{t.needs}</dd>
              <dt className="text-muted">方式</dt>
              <dd>{t.how}</dd>
              <dt className="text-muted">資格</dt>
              <dd className="text-muted">{t.quality}</dd>
            </dl>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-muted">
        人數為 2025 年 3 月 31 日統計。
        <Cites src={[ANKF.probationRules, ANKF.overview]} />
      </p>
    </div>
  );
}

export default function RankLadder() {
  return (
    <div className="grid gap-6 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6 md:grid-cols-2">
      <DanLadder />
      <TitleLadder />
    </div>
  );
}
