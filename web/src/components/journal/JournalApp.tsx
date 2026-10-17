"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { addDays } from "@/lib/journal/date";
import { blankEntry, entryTitle, fmtPct, pct, practiceTotals } from "@/lib/journal/model";
import { EQUIP_CATEGORY_OPTS, LOG_TYPES, optLabel, TYPE_META } from "@/lib/journal/options";
import { isSample } from "@/lib/journal/sample";
import type { Entry, EntryType, GoalEntry, LessonEntry, PracticeEntry } from "@/lib/journal/types";
import Dashboard, { EmptyGuide } from "./Dashboard";
import DataPanel, { lastExportDays } from "./DataPanel";
import EntryEditor from "./EntryEditor";
import type { EditorContext } from "./EntryFields";
import GearView from "./GearView";
import GoalsView from "./GoalsView";
import { SYNC_SECTION_ID, SyncChip } from "./SyncPanel";
import Timeline from "./Timeline";
import { btn, cardCls } from "./ui";
import { useJournal, useRoute, type Tab } from "./useJournal";
import { useSync } from "./useSync";

const TAB_LABEL: Record<Tab, string> = { overview: "總覽", timeline: "紀錄", gear: "裝備", goals: "目標", data: "資料" };
const TAB_ORDER: Tab[] = ["overview", "timeline", "gear", "goals", "data"];

interface Toast {
  id: number;
  msg: string;
  action?: { label: string; run: () => void };
}

const uniqRecent = (vals: string[], max = 20) => [...new Set(vals.map((v) => v.trim()).filter(Boolean))].slice(0, max);

function AddMenu({ onPick, onClose, trigger }: { onPick: (t: EntryType) => void; onClose: () => void; trigger: RefObject<HTMLButtonElement | null> }) {
  const firstRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Keep the latest callback without re-running the mount effect (which would steal focus).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  /** Close without picking: hand focus back to the button that opened the menu. */
  const dismiss = () => {
    onCloseRef.current();
    trigger.current?.focus();
  };

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        trigger.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // Trap Tab inside the dialog while it is open.
      const items = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? [])];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [trigger]);
  const types: EntryType[] = [...LOG_TYPES, "goal"];
  return (
    <>
      <button type="button" aria-label="關閉新增選單" tabIndex={-1} className="fixed inset-0 z-40 cursor-default bg-ink/20 sm:bg-transparent" onClick={dismiss} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="新增紀錄"
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border border-line bg-surface p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:bottom-auto sm:mt-2 sm:w-80 sm:rounded-2xl sm:pb-4"
      >
        <p className="mb-2 text-sm font-semibold text-muted">要記錄什麼？</p>
        <ul className="grid grid-cols-2 gap-2">
          {types.map((t, i) => (
            <li key={t} className={i === 0 ? "col-span-2" : ""}>
              <button
                ref={i === 0 ? firstRef : undefined}
                type="button"
                onClick={() => onPick(t)}
                className={`flex min-h-12 w-full items-center gap-2 rounded-xl border px-3 text-left text-[15px] ${
                  i === 0 ? "border-ink bg-ink font-semibold text-paper" : "border-line bg-surface hover:bg-surface-2"
                }`}
              >
                <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_META[t].dot}`} />
                {i === 0 ? "記錄今天的練習" : TYPE_META[t].label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default function JournalApp() {
  const j = useJournal();
  const [route, navigate] = useRoute();
  const [toast, setToast] = useState<Toast | null>(null);
  // Which trigger opened the add menu; only one menu instance (and one key listener) exists at a time.
  const [addFrom, setAddFrom] = useState<"desktop" | "mobile" | null>(null);
  const desktopAddRef = useRef<HTMLButtonElement>(null);
  const mobileAddRef = useRef<HTMLButtonElement>(null);
  const pushedEditor = useRef(false);
  const toastSeq = useRef(0);
  // Toast id the pointer / keyboard focus is resting on; its timer is paused meanwhile.
  const [pausedToast, setPausedToast] = useState<number | null>(null);
  const { entries, today } = j;

  const toastPaused = toast != null && pausedToast === toast.id;
  useEffect(() => {
    if (!toast || toastPaused) return;
    const t = setTimeout(() => setToast((cur) => (cur?.id === toast.id ? null : cur)), toast.action ? 8000 : 4000);
    return () => clearTimeout(t);
  }, [toast, toastPaused]);

  const announce = (msg: string, action?: Toast["action"]) => setToast({ id: ++toastSeq.current, msg, action });
  const sync = useSync(j, announce);

  const gearMap = useMemo(() => new Map(entries.filter((e) => e.type === "purchase").map((e) => [e.id, e])), [entries]);
  const gearName = (id: string) => {
    const g = gearMap.get(id);
    return g?.type === "purchase" ? g.item : undefined;
  };

  const ctx: EditorContext = useMemo(() => {
    const places: string[] = [];
    const teachers: string[] = [];
    for (const e of entries) {
      if (e.type === "practice") {
        places.push(e.place);
        teachers.push(e.instructor);
      } else if (e.type === "lesson") {
        places.push(e.place);
        teachers.push(e.teacher);
      }
    }
    const gear = entries
      .filter((e) => e.type === "purchase" && e.status !== "retired")
      .map((e) => (e.type === "purchase" ? { id: e.id, label: `${e.item}（${optLabel(EQUIP_CATEGORY_OPTS, e.category)}）` } : { id: e.id, label: "" }));
    return { places: uniqRecent(places), teachers: uniqRecent(teachers), gear, today };
  }, [entries, today]);

  const makeNew = (type: EntryType) => (): Entry => {
    const now = new Date().toISOString();
    const e = blankEntry(type, today, now);
    if (e.type === "practice") {
      const last = entries.find((x): x is PracticeEntry => x.type === "practice" && !isSample(x));
      if (last) Object.assign(e, { place: last.place, kinds: last.kinds.length ? last.kinds : e.kinds, equipmentIds: last.equipmentIds.filter((id) => gearMap.has(id)) });
    } else if (e.type === "lesson") {
      const last = entries.find((x): x is LessonEntry => x.type === "lesson" && !isSample(x));
      if (last) Object.assign(e, { teacher: last.teacher, place: last.place });
    } else if (e.type === "goal") {
      e.date = addDays(today, 30);
    }
    return e;
  };

  const goTab = (tab: Tab) => {
    setAddFrom(null);
    navigate({ tab });
    window.scrollTo({ top: 0 });
  };
  const goSync = () => {
    goTab("data");
    setTimeout(() => {
      const el = document.getElementById(SYNC_SECTION_ID);
      el?.scrollIntoView({ block: "start" });
      el?.querySelector<HTMLElement>("h3")?.focus({ preventScroll: true });
    }, 50);
  };
  const openNew = (type: EntryType) => {
    setAddFrom(null);
    pushedEditor.current = true;
    navigate({ tab: route.tab, create: type });
  };
  const openEdit = (id: string) => {
    pushedEditor.current = true;
    navigate({ tab: route.tab, edit: id });
  };
  const closeEditor = () => {
    if (pushedEditor.current) {
      pushedEditor.current = false;
      window.history.back();
    } else navigate({ tab: route.tab }, { replace: true });
  };

  const removeWithUndo = async (id: string) => {
    const removed = await j.remove(id);
    if (removed) announce(`已刪除「${entryTitle(removed)}」`, { label: "復原", run: () => void j.restore(removed).then(() => announce("已復原")) });
  };

  const toggleGoal = async (g: GoalEntry) => {
    const ok = await j.save({ ...g, done: !g.done, updatedAt: new Date().toISOString() });
    if (ok) announce(g.done ? "已標為未完成" : `恭喜達成「${g.title}」！`);
  };

  if (!j.ready) {
    return (
      <div className="min-h-[50vh] py-10 text-center text-muted" aria-busy="true">
        <p>正在開啟這個瀏覽器裡的稽古帳…</p>
        <noscript>
          <p className="mt-2 text-vermilion">稽古帳需要啟用 JavaScript 才能使用。</p>
        </noscript>
      </div>
    );
  }

  const storageNotice =
    j.storeKind === "memory" ? (
      <aside role="alert" className="mb-4 rounded-2xl border border-vermilion/50 bg-vermilion/5 p-4 text-[15px] leading-relaxed">
        <p className="font-bold text-vermilion">這個瀏覽器目前無法保存資料</p>
        <p className="mt-1">可能是無痕／私密瀏覽模式或封鎖了網站資料。你仍然可以記錄，但內容只暫存在這個分頁，重新整理或關閉後就會消失——離開前請到「資料」匯出 JSON。</p>
      </aside>
    ) : null;

  const errorNotice = j.error ? (
    <aside role="alert" className="mb-4 rounded-2xl border border-vermilion/50 bg-vermilion/5 p-4 text-[15px]">
      {j.error}
    </aside>
  ) : null;

  const toastEl = toast && (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 sm:bottom-6">
      <div
        onMouseEnter={() => setPausedToast(toast.id)}
        onMouseLeave={() => setPausedToast(null)}
        onFocus={() => setPausedToast(toast.id)}
        onBlur={(ev) => {
          if (!ev.currentTarget.contains(ev.relatedTarget as Node | null)) setPausedToast(null);
        }}
        className="pointer-events-auto flex max-w-md items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-[15px] text-paper shadow-lg">
        <span>{toast.msg}</span>
        {toast.action && (
          <button
            type="button"
            className="min-h-9 rounded-lg px-2 font-semibold text-wood-soft underline"
            onClick={() => {
              toast.action?.run();
              setToast(null);
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
    </div>
  );
  // Always-present live region so announcements are read even when the toast first mounts.
  const live = (
    <p className="sr-only" role="status" aria-live="polite">
      {toast?.msg ?? ""}
    </p>
  );

  // ---------- editor views ----------
  if (route.edit || route.create) {
    const existing = route.edit ? entries.find((e) => e.id === route.edit) : undefined;
    if (route.edit && !existing) {
      return (
        <div className={`${cardCls} my-6 text-center`}>
          <p>找不到這筆紀錄，可能已經被刪除，或是存在另一個瀏覽器裡。</p>
          <button type="button" className={`${btn.secondary} mt-3`} onClick={() => navigate({ tab: route.tab }, { replace: true })}>
            回到稽古帳
          </button>
        </div>
      );
    }
    return (
      <>
        {storageNotice}
        {errorNotice}
        <EntryEditor
          key={existing ? existing.id : `new:${route.create}`}
          initial={existing ?? makeNew(route.create!)}
          isNew={!existing}
          ctx={ctx}
          onSave={async (e) => {
            const ok = await j.save(e);
            if (ok) {
              announce(existing ? "已更新" : `已儲存${TYPE_META[e.type].label}`);
              closeEditor();
            }
            return ok;
          }}
          onCancel={(dirty) => {
            if (dirty) announce("未儲存的內容已保留為草稿");
            closeEditor();
          }}
          onDelete={(id) => {
            closeEditor();
            void removeWithUndo(id);
          }}
        />
        {live}
        {toastEl}
      </>
    );
  }

  // ---------- main views ----------
  const realCount = entries.filter((e) => !isSample(e)).length;
  const exportDays = lastExportDays(today);
  // While synced to the cloud the journal no longer lives only in this browser.
  const synced = sync.enabled && !!sync.email && sync.phase !== "conflict";
  const needsBackup = !synced && realCount >= 5 && (exportDays == null || exportDays > 30);
  const todayPractice = entries.filter((e): e is PracticeEntry => e.type === "practice" && e.date === today);

  let view;
  switch (route.tab) {
    case "overview":
      view = entries.length ? (
        <>
          <div className={`${cardCls} mb-4 flex flex-wrap items-center justify-between gap-3`}>
            {todayPractice.length ? (
              <p className="text-[15px]">
                <span className="text-wood">✓</span> 今天已記錄練習
                {(() => {
                  const t = todayPractice.reduce((a, e) => {
                    const p = practiceTotals(e);
                    return { arrows: a.arrows + p.arrows, hits: a.hits + p.hits };
                  }, { arrows: 0, hits: 0 });
                  return t.arrows ? `：${t.arrows} 射 ${t.hits} 中（${fmtPct(pct(t.hits, t.arrows))}）` : "";
                })()}
              </p>
            ) : (
              <p className="text-[15px]">今天練習了嗎？趁記憶還新鮮記下來。</p>
            )}
            <button type="button" className={todayPractice.length ? btn.secondary : btn.primary} onClick={() => openNew("practice")}>
              ＋ 記錄練習
            </button>
          </div>
          <Dashboard entries={entries} today={today} onEdit={openEdit} onToggleGoal={toggleGoal} goTab={goTab} />
        </>
      ) : (
        <EmptyGuide
          onNew={openNew}
          onLoadSample={async () => {
            const n = await j.loadSample();
            announce(`已載入 ${n} 筆範例資料`);
          }}
        />
      );
      break;
    case "timeline":
      view = <Timeline entries={entries} onEdit={openEdit} gearName={gearName} />;
      break;
    case "gear":
      view = <GearView entries={entries} today={today} onNew={() => openNew("purchase")} onEdit={openEdit} />;
      break;
    case "goals":
      view = <GoalsView entries={entries} today={today} onNew={() => openNew("goal")} onEdit={openEdit} onToggle={toggleGoal} />;
      break;
    case "data":
      view = (
        <DataPanel
          entries={entries}
          today={today}
          storeKind={j.storeKind}
          exportAll={j.exportAll}
          importEntries={j.importEntries}
          clearAll={j.clearAll}
          loadSample={j.loadSample}
          removeSample={j.removeSample}
          announce={(m) => announce(m)}
          sync={sync}
        />
      );
      break;
  }

  const tabBtn = (t: Tab, mobile: boolean) => {
    const on = route.tab === t;
    return (
      <button
        key={t}
        type="button"
        aria-current={on ? "page" : undefined}
        onClick={() => goTab(t)}
        className={
          mobile
            ? `flex min-h-14 flex-1 flex-col items-center justify-center text-xs ${on ? "font-bold text-wood" : "text-muted"}`
            : `min-h-10 rounded-full px-4 text-[15px] ${on ? "bg-ink text-paper" : "text-ink hover:bg-surface-2"}`
        }
      >
        {mobile && <span aria-hidden="true" className={`mb-1 h-1 w-6 rounded-full ${on ? "bg-wood" : "bg-transparent"}`} />}
        {TAB_LABEL[t]}
      </button>
    );
  };

  return (
    <div className="pb-24 sm:pb-0">
      {storageNotice}
      {errorNotice}
      {needsBackup && route.tab !== "data" && (
        <aside className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-wood/40 bg-wood-soft/40 px-4 py-3 text-sm">
          <span>{exportDays == null ? "你還沒有匯出過備份。" : `上次匯出備份是 ${exportDays} 天前。`}紀錄只存在這個瀏覽器，建議定期匯出。</span>
          <button type="button" className="font-semibold text-wood underline" onClick={() => goTab("data")}>
            前往匯出
          </button>
        </aside>
      )}

      {/* Desktop / tablet: tab row with add button. */}
      <div className="relative mb-5 hidden items-center justify-between gap-2 sm:flex">
        <nav aria-label="稽古帳分頁" className="flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
          {TAB_ORDER.map((t) => tabBtn(t, false))}
        </nav>
        <div className="relative flex items-center gap-2">
          <SyncChip sync={sync} onClick={goSync} />
          <button
            ref={desktopAddRef}
            type="button"
            className={btn.primary}
            aria-haspopup="dialog"
            aria-expanded={addFrom === "desktop"}
            onClick={() => setAddFrom((v) => (v ? null : "desktop"))}
          >
            ＋ 新增紀錄
          </button>
          {addFrom === "desktop" && <AddMenu onPick={openNew} onClose={() => setAddFrom(null)} trigger={desktopAddRef} />}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2 sm:mb-0">
        <h2 className="text-xl font-bold sm:sr-only">{TAB_LABEL[route.tab]}</h2>
        <SyncChip sync={sync} onClick={goSync} className="sm:hidden" />
      </div>
      {view}

      {/* Phone: bottom navigation with a central add button. */}
      <nav data-fixed-bottom="mobile" aria-label="稽古帳分頁" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-md items-stretch px-1">
          {tabBtn("overview", true)}
          {tabBtn("timeline", true)}
          <div className="flex flex-1 items-center justify-center">
            <button
              ref={mobileAddRef}
              type="button"
              aria-label="新增紀錄"
              aria-haspopup="dialog"
              aria-expanded={addFrom === "mobile"}
              onClick={() => setAddFrom((v) => (v ? null : "mobile"))}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-2xl text-paper shadow-md"
            >
              ＋
            </button>
          </div>
          {tabBtn("gear", true)}
          {tabBtn("goals", true)}
          {tabBtn("data", true)}
        </div>
      </nav>
      {addFrom === "mobile" && (
        <div className="sm:hidden">
          <AddMenu onPick={openNew} onClose={() => setAddFrom(null)} trigger={mobileAddRef} />
        </div>
      )}
      {live}
      {toastEl}
    </div>
  );
}
