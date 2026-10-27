"use client";

// 練習場 hub, the client half of PracticeApp (which counts the banks on the server). The open
// mode lives in the URL hash (#order, #cards …) so QuickCheck and other pages can link
// straight to a mode and the back button returns to the hub.
// Modes mount only on the client (the server snapshot of the hash is ""), so their
// shuffled sessions never cause a hydration mismatch.

import dynamic from "next/dynamic";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { liveStreak, usePracticeStats, type ModeBest } from "@/lib/practice/stats";
import { useToday } from "@/lib/practice/storage";
import type { ChoiceQuestion, PracticeMode, TrueFalseItem } from "@/lib/practice/types";
import { Panel } from "./ui";

/** Bank sizes for the hub cards, counted on the server by PracticeApp so the banks stay out of the hub bundle. */
export interface PracticeCounts {
  cues: number;
  myths: number;
  scenarios: number;
}

type ModeProps = { onExit: () => void };

const Loading = () => (
  <Panel>
    <p role="status" className="text-muted">
      載入練習中…
    </p>
  </Panel>
);

// Each mode, with its question bank, is only downloaded when it opens (the hub needs none of them).
const OrderGame = dynamic(() => import("./OrderGame"), { ssr: false, loading: Loading });
const WrittenPractice = dynamic(() => import("./WrittenPractice"), { ssr: false, loading: Loading });
const Flashcards = dynamic(() => import("./Flashcards"), {
  ssr: false,
  loading: () => (
    <Panel>
      <p role="status" className="text-muted">
        載入詞彙中…
      </p>
    </Panel>
  ),
});

const tfToChoice = (t: TrueFalseItem): ChoiceQuestion => ({
  id: t.id,
  topic: t.kindLabel,
  prompt: "這句話對嗎？",
  quote: t.statement,
  options: [{ text: "對" }, { text: "錯" }],
  answer: t.isTrue ? 0 : 1,
  explain: t.explain,
  tag: t.tag,
  src: t.src,
  more: t.more,
});

const WhichQuiz = dynamic(
  () =>
    Promise.all([import("./ChoiceQuiz"), import("@/content/practice/shaho")]).then(([{ default: ChoiceQuiz }, { buildWhichSession }]) => {
      const build = () => buildWhichSession(8);
      return function WhichQuiz({ onExit }: ModeProps) {
        return <ChoiceQuiz mode="which" build={build} onExit={onExit} />;
      };
    }),
  { ssr: false, loading: Loading },
);
const MythQuiz = dynamic(
  () =>
    Promise.all([import("./ChoiceQuiz"), import("@/content/practice/myths")]).then(([{ default: ChoiceQuiz }, { buildMythSession }]) => {
      const build = () => buildMythSession(10).map(tfToChoice);
      return function MythQuiz({ onExit }: ModeProps) {
        return <ChoiceQuiz mode="myths" build={build} onExit={onExit} layout="pair" />;
      };
    }),
  { ssr: false, loading: Loading },
);
const ScenarioQuiz = dynamic(
  () =>
    Promise.all([import("./ChoiceQuiz"), import("@/content/practice/scenarios")]).then(([{ default: ChoiceQuiz }, { buildScenarioSession }]) => {
      const build = () => buildScenarioSession(8);
      return function ScenarioQuiz({ onExit }: ModeProps) {
        return <ChoiceQuiz mode="scenario" build={build} onExit={onExit} />;
      };
    }),
  { ssr: false, loading: Loading },
);

interface ModeInfo {
  id: PracticeMode;
  title: string;
  ja?: string;
  blurb: string;
  meta: string;
}

const modeList = (c: PracticeCounts): ModeInfo[] => [
  { id: "order", title: "射法八節排序", ja: "射法八節", blurb: "8 張卡片打亂了，依序點回正確的順序。", meta: "約 1 分鐘" },
  { id: "which", title: "這是哪一節？", blurb: "看一句動作提醒，選出它說的是哪一節。", meta: `8 題・題庫 ${c.cues} 句` },
  { id: "cards", title: "詞彙閃卡", ja: "用語", blurb: "日文 ↔ 中文翻卡，按「記得／不熟」安排下次複習。", meta: "每輪 10 張" },
  { id: "myths", title: "迷思是非題", blurb: "常聽到的說法，是對還是錯？每題附出處。", meta: `10 題・題庫 ${c.myths} 則` },
  { id: "scenario", title: "情境題：體配・審查", blurb: "「你是 3 番，甲矢什麼時候起身？」從規程與指導書出題。", meta: `8 題・題庫 ${c.scenarios} 題` },
  { id: "written", title: "初段學科練習", blurb: "先自己寫，再對照「可以提到的重點」。", meta: "3 種題型" },
];

const IDS = new Set<string>(["order", "which", "cards", "myths", "scenario", "written"] satisfies PracticeMode[]);
const EVENT = "kyudo-practice-nav";

function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  // After a client-side navigation the URL can update after this first read.
  const t = window.setTimeout(cb, 0);
  return () => {
    window.removeEventListener("hashchange", cb);
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
    window.clearTimeout(t);
  };
}
const readHash = () => decodeURIComponent(window.location.hash.slice(1));

function go(mode: PracticeMode | null) {
  const url = window.location.pathname + window.location.search + (mode ? `#${mode}` : "");
  window.history.pushState(null, "", url);
  window.dispatchEvent(new Event(EVENT));
}

function bestText(b?: ModeBest) {
  return b ? `最佳 ${b.correct} / ${b.total}` : null;
}

export default function PracticeHub({ counts }: { counts: PracticeCounts }) {
  const MODES = modeList(counts);
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const mode = IDS.has(hash) ? (hash as PracticeMode) : null;
  const stats = usePracticeStats();
  const today = useToday();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevMode = useRef<PracticeMode | null>(null);

  useEffect(() => {
    if (mode && mode !== prevMode.current) {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: "start" });
    }
    prevMode.current = mode;
  }, [mode]);

  const exit = () => go(null);
  const info = MODES.find((m) => m.id === mode);

  if (mode && info) {
    return (
      <section aria-labelledby="practice-mode" className="scroll-mt-20">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button type="button" onClick={exit} className="inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-wood hover:bg-surface-2">
            <span aria-hidden="true">←</span> 所有練習
          </button>
          {stats.best[mode] && <span className="text-sm text-muted tabular-nums">{bestText(stats.best[mode])}</span>}
        </div>
        <h2 id="practice-mode" ref={headingRef} tabIndex={-1} className="mb-4 scroll-mt-20 text-2xl font-bold outline-none">
          {info.title}
        </h2>
        {mode === "order" && <OrderGame key="order" onExit={exit} />}
        {mode === "which" && <WhichQuiz key="which" onExit={exit} />}
        {mode === "cards" && <Flashcards key="cards" onExit={exit} />}
        {mode === "myths" && <MythQuiz key="myths" onExit={exit} />}
        {mode === "scenario" && <ScenarioQuiz key="scenario" onExit={exit} />}
        {mode === "written" && <WrittenPractice key="written" onExit={exit} />}
      </section>
    );
  }

  const streak = liveStreak(stats, today);
  return (
    <section aria-labelledby="practice-hub">
      <h2 id="practice-hub" className="sr-only">
        選一個練習
      </h2>
      <dl className="mb-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-line bg-surface px-2 py-2.5">
          <dt className="text-xs text-muted">連續練習</dt>
          <dd className="text-xl font-bold tabular-nums">
            {streak}
            <span className="text-sm font-normal"> 天</span>
          </dd>
        </div>
        <div className="rounded-xl border border-line bg-surface px-2 py-2.5">
          <dt className="text-xs text-muted">最長連續</dt>
          <dd className="text-xl font-bold tabular-nums">
            {stats.bestStreak}
            <span className="text-sm font-normal"> 天</span>
          </dd>
        </div>
        <div className="rounded-xl border border-line bg-surface px-2 py-2.5">
          <dt className="text-xs text-muted">完成</dt>
          <dd className="text-xl font-bold tabular-nums">
            {stats.sessions}
            <span className="text-sm font-normal"> 輪</span>
          </dd>
        </div>
      </dl>
      <ul className="grid gap-3 sm:grid-cols-2">
        {MODES.map((m) => {
          const best = bestText(stats.best[m.id]);
          return (
            <li key={m.id}>
              <a
                href={`#${m.id}`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  go(m.id);
                }}
                className="flex h-full min-h-24 flex-col rounded-2xl border border-line bg-surface p-4 text-ink no-underline shadow-sm transition-colors hover:border-wood hover:bg-surface-2"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-bold">{m.title}</span>
                  <span aria-hidden="true" className="text-wood">
                    →
                  </span>
                </span>
                <span className="mt-1 text-[15px] leading-relaxed text-muted">{m.blurb}</span>
                <span className="mt-auto flex flex-wrap gap-x-3 pt-2 text-xs text-muted">
                  <span>{m.meta}</span>
                  {best && <span className="font-semibold text-wood">{best}</span>}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-xs leading-relaxed text-muted">
        題目與解說都取自本站各頁的內容，並附上原始出處；實際做法以所屬道場與指導者為準。成績、閃卡進度與草稿只存在這台裝置的瀏覽器裡，不會傳到任何地方。
      </p>
    </section>
  );
}
