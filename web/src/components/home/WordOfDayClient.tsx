"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

export interface DailyWord {
  kanji: string;
  kana: string;
  romaji: string;
  zh: string;
}

/** Day number in Taiwan time, so the word changes at local midnight. */
function taipeiDay(): number {
  const now = new Date();
  return Math.floor((now.getTime() + 8 * 3600 * 1000) / 86_400_000);
}

const subscribe = () => () => {};

export default function WordOfDayClient({ words }: { words: DailyWord[] }) {
  // Server render shows a fixed entry; the client swaps in today's (no hydration mismatch).
  const day = useSyncExternalStore(subscribe, taipeiDay, () => 0);
  const e = words[day % words.length];
  if (!e) return null;
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-xs tracking-[0.2em] text-wood">今日の一語</p>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
        <span lang="ja" className="text-2xl font-semibold">
          {e.kanji}
        </span>
        <span lang="ja" className="text-sm text-muted">
          {e.kana}
        </span>
        <span className="text-sm text-muted">{e.romaji}</span>
      </p>
      <p className="mt-2 leading-relaxed">{e.zh}</p>
      <Link href="/glossary/" className="mt-3 inline-block text-sm text-wood underline">
        查看全部詞彙 →
      </Link>
    </div>
  );
}
