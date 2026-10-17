"use client";

// Save the text summary (never the video or images) to the 稽古帳 as a practice entry, through the
// journal's public store API (openJournalStore → put). Nothing is uploaded by this step.

import Link from "next/link";
import { useId, useState } from "react";
import { todayISO } from "@/lib/journal/date";
import { LIMITS, blankEntry, validateEntry } from "@/lib/journal/model";
import { openJournalStore } from "@/lib/journal/store";
import type { PracticeKind, ShahoStep } from "@/lib/journal/types";
import { CHANNEL as JOURNAL_CHANNEL } from "@/components/journal/useJournal";
import { btn, inputCls } from "./ui";

const KINDS: { key: PracticeKind; ja: string }[] = [
  { key: "toshu", ja: "徒手" },
  { key: "gomuyumi", ja: "ゴム弓" },
  { key: "subiki", ja: "素引き" },
  { key: "makiwara", ja: "巻藁" },
  { key: "matomae", ja: "的前" },
];

/** Same channel name the 稽古帳 listens on, so an open journal tab refreshes. */

export default function SaveToJournal({ summary, focusSteps }: { summary: string; focusSteps: ShahoStep[] }) {
  const uid = useId();
  const [kind, setKind] = useState<PracticeKind>("subiki");
  const [date, setDate] = useState(() => todayISO());
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  async function save() {
    setStatus("saving");
    setMsg("");
    try {
      const store = await openJournalStore();
      const now = new Date().toISOString();
      const e = blankEntry("practice", date, now);
      e.kinds = [kind];
      e.notes = summary.slice(0, LIMITS.text);
      e.tags = ["射形分析"];
      e.focusSteps = focusSteps;
      const errs = validateEntry(e);
      if (errs.length) {
        setStatus("error");
        setMsg(errs.map((x) => x.message).join("、"));
        return;
      }
      await store.put(e);
      try {
        const ch = new BroadcastChannel(JOURNAL_CHANNEL);
        ch.postMessage("changed");
        ch.close();
      } catch {
        /* not supported */
      }
      setStatus("saved");
      setMsg(
        store.persistent
          ? "已存到稽古帳（只存在這個瀏覽器）。"
          : "已暫存，但這個瀏覽器目前無法永久儲存（例如無痕模式），關閉分頁後就會消失。",
      );
    } catch {
      setStatus("error");
      setMsg("儲存失敗：瀏覽器的儲存空間可能已滿或被封鎖。可以先用「複製摘要」貼到其他地方。");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <details className="rounded-xl border border-line bg-surface-2 p-3">
        <summary className="text-sm font-semibold">
          <span className="chev mr-1 inline-block" aria-hidden="true">
            ›
          </span>
          預覽要存的文字
        </summary>
        <pre className="mt-2 text-sm leading-relaxed break-words whitespace-pre-wrap">{summary}</pre>
      </details>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-kind`} className="mb-1 block text-sm font-semibold">
            這支影片是哪種練習
          </label>
          <select id={`${uid}-kind`} className={inputCls} value={kind} onChange={(e) => setKind(e.target.value as PracticeKind)}>
            {KINDS.map((k) => (
              <option key={k.key} value={k.key} lang="ja">
                {k.ja}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-date`} className="mb-1 block text-sm font-semibold">
            日期
          </label>
          <input id={`${uid}-date`} type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn.primary} onClick={save} disabled={status === "saving" || status === "saved"}>
          {status === "saving" ? "儲存中…" : status === "saved" ? "已存到稽古帳" : "存成稽古帳的練習紀錄"}
        </button>
        <button type="button" className={btn.secondary} onClick={copy}>
          {copied ? "已複製" : "複製摘要"}
        </button>
      </div>
      <p aria-live="polite" className={`mt-2 text-sm ${status === "error" ? "text-vermilion" : "text-muted"}`}>
        {msg}
        {status === "saved" && (
          <>
            {" "}
            <Link href="/journal/" className="text-wood underline">
              打開稽古帳
            </Link>
          </>
        )}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        只會存文字摘要（射數記為 0），不會存影片或畫面。之後可以在稽古帳裡編輯或刪除。
      </p>
    </div>
  );
}
