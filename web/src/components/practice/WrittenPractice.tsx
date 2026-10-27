"use client";

// 初段學科練習: write an answer, then reveal 「可以提到的重點」 built from the 射法八節 content.
// Drafts stay in this browser only (localStorage, with an in-memory fallback).

import Link from "next/link";
import { useId, useRef, useState } from "react";
import {
  checkOrder,
  EXPLAIN_POINTS,
  MOTIVE_SRC,
  MOTIVE_TIPS,
  ORDER_TERMS,
  WRITTEN_FACTS,
  WRITTEN_PROMPTS,
  type WrittenPrompt,
} from "@/content/practice/written";
import { SHAHO_SOURCES } from "@/content/practice/shaho";
import { recordSession } from "@/lib/practice/stats";
import { readJSON, writeJSON } from "@/lib/practice/storage";
import { Btn, Panel, SourceLinks, TagChip, Verdict } from "./ui";

type Drafts = Partial<Record<WrittenPrompt["id"] | "section", string>>;
const KEY = "written";
const parseDrafts = (v: unknown): Drafts => {
  if (!v || typeof v !== "object") return {};
  const out: Drafts = {};
  for (const k of ["order", "explain", "motive", "section"] as const) {
    const s = (v as Record<string, unknown>)[k];
    if (typeof s === "string") out[k] = s.slice(0, 5000);
  }
  return out;
};

export default function WrittenPractice({ onExit }: { onExit: () => void }) {
  const [drafts, setDrafts] = useState<Drafts>(() => readJSON(KEY, parseDrafts));
  const [active, setActive] = useState<WrittenPrompt["id"]>("order");
  const [revealed, setRevealed] = useState<Partial<Record<WrittenPrompt["id"], boolean>>>({});
  const [ticked, setTicked] = useState<Record<string, boolean>>({});
  const recorded = useRef(false);
  const uid = useId();

  const prompt = WRITTEN_PROMPTS.find((p) => p.id === active) ?? WRITTEN_PROMPTS[0];
  const text = drafts[active] ?? "";
  const sectionId = drafts.section && EXPLAIN_POINTS.some((s) => s.id === drafts.section) ? drafts.section : "dozukuri";
  const section = EXPLAIN_POINTS.find((s) => s.id === sectionId) ?? EXPLAIN_POINTS[0];

  const update = (patch: Drafts) => {
    const next = { ...drafts, ...patch };
    setDrafts(next);
    try {
      writeJSON(KEY, next);
    } catch {
      /* keep the in-memory copy */
    }
  };

  const reveal = () => {
    setRevealed((r) => ({ ...r, [active]: true }));
    if (!recorded.current) {
      recorded.current = true;
      try {
        recordSession("written", 0, 0);
      } catch {
        /* streak is optional */
      }
    }
  };

  const tab = (on: boolean) =>
    `min-h-12 rounded-xl border-2 px-3 py-1.5 text-left text-sm leading-tight transition-colors ${on ? "border-ink bg-ink text-paper" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`;

  return (
    <div className="space-y-4">
      <Panel>
        <h3 className="font-bold">先知道：初段學科怎麼考</h3>
        <ul className="mt-2 space-y-2 text-[15px] leading-relaxed">
          {WRITTEN_FACTS.map((f) => (
            <li key={f.text}>
              <span className="mr-1.5 align-[1px]">
                <TagChip tag={f.src[0]?.kind === "local" ? "local" : "official"} />
              </span>
              {f.text}
            </li>
          ))}
        </ul>
        <SourceLinks src={WRITTEN_FACTS.flatMap((f) => f.src)} />
        <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-sm leading-relaxed">
          這裡是自我檢查，不是評分。題目是中文改寫的題型，實際題目與作答語言以考場規定為準；真正的評分由審查員進行。
        </p>
      </Panel>

      <div role="group" aria-label="選擇題目" className="grid grid-cols-3 gap-2">
        {WRITTEN_PROMPTS.map((p) => (
          <button key={p.id} type="button" aria-pressed={active === p.id} onClick={() => setActive(p.id)} className={tab(active === p.id)}>
            <span className="block text-xs opacity-80">
              {p.group}・{p.points}
            </span>
            <span className="block font-semibold">{p.id === "order" ? "八節順序" : p.id === "explain" ? "說明一節" : "動機"}</span>
          </button>
        ))}
      </div>

      <Panel>
        <p className="text-xs font-semibold tracking-widest text-wood">
          {prompt.group}・{prompt.points}
        </p>
        <h3 className="mt-1 text-lg font-bold">{prompt.prompt}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{prompt.hint}</p>

        {active === "explain" && (
          <div className="mt-3">
            <label htmlFor={`${uid}-sec`} className="text-sm font-semibold">
              我要說明的節
            </label>
            <select
              id={`${uid}-sec`}
              value={sectionId}
              onChange={(e) => {
                update({ section: e.target.value });
                setTicked({});
              }}
              className="mt-1 block min-h-11 w-full rounded-xl border border-field-border bg-surface px-3 text-base text-ink sm:w-auto"
            >
              {EXPLAIN_POINTS.map((s) => (
                <option key={s.id} value={s.id} lang="ja">
                  {s.no}. {s.term}（{s.zh}）
                </option>
              ))}
            </select>
          </div>
        )}

        <label htmlFor={`${uid}-text`} className="mt-4 block text-sm font-semibold">
          你的答案
        </label>
        <textarea
          id={`${uid}-text`}
          value={text}
          onChange={(e) => update({ [active]: e.target.value })}
          rows={active === "motive" ? 8 : 5}
          lang={active === "order" ? "ja" : undefined}
          placeholder={active === "order" ? "例：足踏み、…" : "先自己寫寫看"}
          className="mt-1 block w-full rounded-xl border border-field-border bg-paper px-3 py-2 text-base leading-relaxed text-ink placeholder:text-muted/80 focus:border-wood focus:outline-none"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span className="tabular-nums">{[...text].length} 字</span>
          <span>草稿只存在這台裝置</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Btn variant="primary" onClick={reveal} className="flex-1 sm:flex-none" aria-controls={`${uid}-points`} aria-expanded={!!revealed[active]}>
            看「可以提到的重點」
          </Btn>
          <Btn onClick={() => update({ [active]: "" })} disabled={!text}>
            清除草稿
          </Btn>
        </div>

        <div id={`${uid}-points`} aria-live="polite">
          {revealed[active] && active === "order" && <OrderPoints text={text} />}
          {revealed[active] && active === "explain" && (
            <div className="mt-5 border-t border-line pt-4">
              <h4 className="font-bold">
                第 {section.no} 節 <span lang="ja">{section.term}</span>
                <span lang="ja" className="ml-2 text-sm font-normal text-muted">
                  {section.kana}
                </span>
              </h4>
              <div className="mt-2 space-y-2 text-[15px] leading-relaxed">
                {section.intro.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {section.cues.length > 0 && (
                <>
                  <p className="mt-3 text-sm font-bold text-muted">檢查一下，你有寫到這些嗎？</p>
                  <ul className="mt-1 space-y-1">
                    {section.cues.map((c, i) => {
                      const k = `${section.id}-${i}`;
                      return (
                        <li key={k}>
                          <label className="flex min-h-11 items-start gap-2.5 py-1.5 text-[15px] leading-relaxed">
                            <input
                              type="checkbox"
                              checked={!!ticked[k]}
                              onChange={(e) => setTicked((t) => ({ ...t, [k]: e.target.checked }))}
                              className="mt-1 h-5 w-5 shrink-0 accent-[var(--wood)]"
                            />
                            {c}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="text-sm text-muted tabular-nums">
                    勾了 {section.cues.filter((_, i) => ticked[`${section.id}-${i}`]).length} / {section.cues.length} 項
                  </p>
                </>
              )}
              <SourceLinks src={section.src} />
              <Link href={`/shaho/#${section.id}`} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-wood underline">
                看「<span lang="ja">{section.term}</span>」的完整說明 →
              </Link>
            </div>
          )}
          {revealed[active] && active === "motive" && (
            <div className="mt-5 border-t border-line pt-4">
              <h4 className="font-bold">寫心得題的方向</h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
                {MOTIVE_TIPS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted">
                <TagChip tag="note" /> 這是本站的寫作建議，不是評分標準。
              </p>
              <SourceLinks src={MOTIVE_SRC} />
              <Link href="/culture/#thought" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-wood underline">
                想多了解弓道的理念，看〈文化與哲學〉 →
              </Link>
            </div>
          )}
        </div>
      </Panel>

      <p className="text-right">
        <Btn variant="ghost" onClick={onExit}>
          回到練習選單
        </Btn>
      </p>
    </div>
  );
}

function OrderPoints({ text }: { text: string }) {
  const r = checkOrder(text);
  const hasText = text.trim().length > 0;
  return (
    <div className="mt-5 border-t border-line pt-4">
      {hasText && (
        <div className="mb-3 rounded-xl bg-surface-2 p-3">
          <Verdict ok={r.inOrder}>
            {r.inOrder ? "8 節都寫到了，順序也對" : r.missing.length ? `找到 ${r.found.length} / 8 節` : "8 節都寫到了，但順序有地方不對"}
          </Verdict>
          {r.missing.length > 0 && (
            <p className="mt-1 text-sm">
              沒找到：<span lang="ja">{r.missing.join("、")}</span>
            </p>
          )}
          <p className="mt-1 text-xs text-muted">自動比對只看漢字或假名有沒有出現、出現的先後，僅供參考。</p>
        </div>
      )}
      <h4 className="font-bold">射法八節的順序</h4>
      <ol className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {ORDER_TERMS.map((t) => (
          <li key={t.id} className="flex items-center gap-2.5 rounded-xl bg-paper px-3 py-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wood-soft text-sm font-bold text-wood tabular-nums">{t.no}</span>
            <span>
              <span lang="ja" className="font-semibold">
                {t.term}
              </span>
              <span lang="ja" className="ml-1.5 text-xs text-muted">
                {t.kana}
              </span>
              <span className="block text-xs text-muted">{t.zh}</span>
            </span>
          </li>
        ))}
      </ol>
      <SourceLinks src={SHAHO_SOURCES} />
      <a href="#order" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-wood underline">
        用排序遊戲多練幾次 →
      </a>
    </div>
  );
}
