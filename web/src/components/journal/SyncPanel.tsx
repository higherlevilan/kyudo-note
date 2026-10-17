"use client";

import { useId, useState } from "react";
import { btn, cardCls, inputCls } from "./ui";
import type { SyncState } from "./useSync";

export const SYNC_SECTION_ID = "data-sync";

function fmtTime(iso: string | null): string {
  if (!iso) return "尚未同步";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "尚未同步";
  return d.toLocaleString("zh-TW", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
}

/** Small header chip; renders nothing unless signed in (or something needs attention). */
export function SyncChip({ sync, onClick, className = "" }: { sync: SyncState; onClick: () => void; className?: string }) {
  if (!sync.enabled || !sync.email) return null;
  let text: string;
  let dot: string;
  switch (sync.phase) {
    case "syncing":
      text = "同步中…";
      dot = "bg-wood animate-pulse";
      break;
    case "offline":
      text = sync.pending ? `離線・${sync.pending} 筆待同步` : "離線";
      dot = "bg-muted";
      break;
    case "error":
    case "conflict":
      text = "同步需要處理";
      dot = "bg-vermilion";
      break;
    default:
      text = sync.pending ? `${sync.pending} 筆待同步` : "已同步";
      dot = sync.pending ? "bg-wood-soft" : "bg-wood";
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`雲端同步：${text}。前往帳號與同步設定`}
      className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm text-ink hover:bg-surface-2 ${className}`}
    >
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot}`} />
      {text}
    </button>
  );
}

function PrivacyNote() {
  return (
    <details className="mt-4 rounded-xl border border-line bg-paper/60 p-3 text-sm leading-relaxed">
      <summary className="min-h-8 cursor-pointer font-semibold">資料存在哪裡？誰看得到？</summary>
      <ul className="mt-2 list-disc space-y-1.5 pl-5">
        <li>紀錄一律先存在這個瀏覽器（離線也能記錄），登入後才同步到本站使用的 Supabase 雲端資料庫。</li>
        <li>
          資料庫以<strong>列層級安全性（Row Level Security）</strong>保護：每筆紀錄都綁定你的帳號，只有登入的你能讀取、修改或刪除，其他使用者看不到。網站維護者具有資料庫的管理權限。
        </li>
        <li>雲端只保存登入用的電子郵件與你的稽古帳紀錄，用途僅限在你的裝置之間同步。範例資料不會上傳。</li>
        <li>兩台裝置修改同一筆紀錄時，以最後儲存的版本為準。刪除紀錄也會同步：雲端只留下「已刪除」標記，不再保存內容。</li>
        <li>隨時可以用下方「匯出」取得完整副本；「清除全部紀錄」會一併刪除雲端上的紀錄。若要刪除帳號本身，請聯絡網站維護者。</li>
      </ul>
    </details>
  );
}

function SignInForm({ sync, announce }: { sync: SyncState; announce: (msg: string) => void }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const send = async () => {
    const addr = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
      setMsg("請輸入有效的電子郵件。");
      return;
    }
    setBusy(true);
    setMsg(null);
    const err = await sync.sendLink(addr);
    setBusy(false);
    if (err) setMsg(err);
    else {
      setSentTo(addr);
      announce(`已寄出登入連結到 ${addr}`);
    }
  };

  const verify = async () => {
    if (!sentTo || !/^\d{6,10}$/.test(code.replace(/\s+/g, ""))) {
      setMsg("請輸入信中的數字驗證碼。");
      return;
    }
    setBusy(true);
    setMsg(null);
    const err = await sync.verifyCode(sentTo, code);
    setBusy(false);
    if (err) setMsg(err);
  };

  if (sentTo) {
    return (
      <div className="mt-3 space-y-3">
        <p className="rounded-xl border border-wood/40 bg-wood-soft/30 p-3 text-[15px]">
          已寄出登入連結到 <strong className="break-all">{sentTo}</strong>。請打開信件中的連結——<strong>在哪個瀏覽器打開，就會在那個瀏覽器登入</strong>。沒收到的話，請看看垃圾郵件匣。
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void verify();
          }}
        >
          <label htmlFor={`${id}-code`} className="block text-sm font-semibold">
            或輸入信中的驗證碼
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            <input
              id={`${id}-code`}
              className={`${inputCls} max-w-[12rem] tracking-widest`}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-describedby={msg ? `${id}-msg` : undefined}
            />
            <button type="submit" className={btn.primary} disabled={busy}>
              登入
            </button>
          </div>
        </form>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn.ghost} disabled={busy} onClick={() => void send()}>
            重新寄送
          </button>
          <button
            type="button"
            className={btn.ghost}
            onClick={() => {
              setSentTo(null);
              setCode("");
              setMsg(null);
            }}
          >
            改用其他信箱
          </button>
        </div>
        <p id={`${id}-msg`} aria-live="polite" className="text-sm text-vermilion">
          {msg}
        </p>
      </div>
    );
  }

  return (
    <form
      className="mt-3"
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
    >
      <label htmlFor={`${id}-email`} className="block text-sm font-semibold">
        電子郵件
      </label>
      <div className="mt-1 flex flex-wrap gap-2">
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          className={`${inputCls} min-w-0 flex-1 basis-56`}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={`${id}-hint${msg ? ` ${id}-msg` : ""}`}
        />
        <button type="submit" className={btn.primary} disabled={busy}>
          {busy ? "寄送中…" : "寄送登入連結"}
        </button>
      </div>
      <p id={`${id}-hint`} className="mt-1 text-xs leading-relaxed text-muted">
        不需要密碼：我們會寄一封含登入連結的信給你。第一次登入時，這個瀏覽器裡現有的紀錄（範例資料除外）會上傳到你的帳號。
      </p>
      <p id={`${id}-msg`} aria-live="polite" className="mt-1 text-sm text-vermilion">
        {msg}
      </p>
    </form>
  );
}

function SignOutChoice({ sync, onDone }: { sync: SyncState; onDone: (msg: string | null) => void }) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const go = async (keep: boolean) => {
    if (!keep && sync.pending > 0 && !window.confirm(`還有 ${sync.pending} 筆變更尚未上傳到雲端，清除後就會遺失。確定要清除嗎？`)) return;
    setBusy(true);
    await sync.signOut(keep);
    setBusy(false);
    onDone(keep ? "已登出，紀錄保留在這個瀏覽器" : "已登出，並清除了這個瀏覽器裡的紀錄");
  };
  return (
    <div role="group" aria-labelledby={`${id}-q`} className="mt-3 rounded-xl border border-line bg-paper/60 p-3">
      <p id={`${id}-q`} className="font-semibold">
        登出後，這個瀏覽器裡的紀錄要怎麼處理？
      </p>
      {sync.pending > 0 && (
        <p className="mt-1 text-sm text-vermilion">
          還有 {sync.pending} 筆變更尚未上傳{sync.phase === "offline" ? "（目前離線）" : ""}。選「保留」的話，下次登入同一個帳號時會再上傳。
        </p>
      )}
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button type="button" className={btn.primary} disabled={busy} onClick={() => void go(true)}>
          保留在這個瀏覽器
        </button>
        <button type="button" className={btn.danger} disabled={busy} onClick={() => void go(false)}>
          從這個瀏覽器清除
        </button>
        <button type="button" className={btn.secondary} disabled={busy} onClick={() => onDone(null)}>
          取消
        </button>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        兩種做法都不會刪除雲端上的資料。共用或公用電腦建議選「清除」。保留的紀錄仍屬於目前的帳號：之後若有其他帳號在這個瀏覽器登入，會先詢問你。
      </p>
    </div>
  );
}

export default function SyncPanel({ sync, announce, onExport }: { sync: SyncState; announce: (msg: string) => void; onExport: () => void }) {
  const [askSignOut, setAskSignOut] = useState(false);

  if (!sync.enabled) return null;

  const status =
    sync.phase === "syncing"
      ? "同步中…"
      : sync.phase === "offline" || sync.phase === "error"
        ? sync.error
        : sync.phase === "idle" && sync.pending
          ? `${sync.pending} 筆變更等待上傳…`
          : null;

  let body;
  if (sync.phase === "starting") {
    body = <p className="mt-2 text-sm text-muted">正在確認登入狀態…</p>;
  } else if (sync.phase === "conflict") {
    body = (
      <div role="alert" className="mt-3 rounded-xl border border-vermilion/50 bg-vermilion/5 p-3 text-[15px] leading-relaxed">
        <p>
          這個瀏覽器裡的紀錄目前屬於 <strong className="break-all">{sync.conflictEmail}</strong>，但你現在登入的是 <strong className="break-all">{sync.email}</strong>。同步暫停中，要怎麼處理？
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            className={btn.primary}
            onClick={async () => {
              await sync.resolveConflict("merge");
              announce("已合併並開始同步");
            }}
          >
            合併：把這些紀錄也加入目前帳號
          </button>
          <button
            type="button"
            className={btn.danger}
            onClick={async () => {
              if (!window.confirm("確定要清除這個瀏覽器裡的紀錄，改用目前帳號的雲端資料嗎？建議先匯出備份。")) return;
              await sync.resolveConflict("replace");
              announce("已改用目前帳號的資料");
            }}
          >
            清除本機紀錄，改用目前帳號的資料
          </button>
          <button type="button" className={btn.secondary} onClick={() => void sync.resolveConflict("cancel")}>
            先登出
          </button>
        </div>
        <button type="button" className={`${btn.ghost} mt-2 px-0`} onClick={onExport}>
          先匯出這個瀏覽器的紀錄（JSON）
        </button>
      </div>
    );
  } else if (sync.email) {
    body = (
      <>
        <dl className="mt-2 grid gap-1 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted">帳號：</dt>
            <dd className="break-all">{sync.email}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted">上次同步：</dt>
            <dd>{fmtTime(sync.lastSyncAt)}</dd>
          </div>
        </dl>
        <p aria-live="polite" className={`mt-2 min-h-5 text-sm ${sync.phase === "error" ? "text-vermilion" : "text-muted"}`}>
          {status}
        </p>
        {askSignOut ? (
          <SignOutChoice
            sync={sync}
            onDone={(msg) => {
              setAskSignOut(false);
              if (msg) announce(msg);
            }}
          />
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className={btn.primary}
              disabled={sync.phase === "syncing"}
              onClick={async () => {
                const ok = await sync.syncNow();
                announce(ok ? "同步完成" : "這次沒有同步成功，稍後會自動再試");
              }}
            >
              立即同步
            </button>
            <button
              type="button"
              className={btn.secondary}
              onClick={() => {
                setAskSignOut(true);
                void sync.syncNow(); // flush pending changes while the user decides
              }}
            >
              登出
            </button>
          </div>
        )}
      </>
    );
  } else {
    body = (
      <>
        <p className="mt-1 text-[15px] leading-relaxed">
          登入後，紀錄會同步到雲端，換手機或換電腦也看得到。不登入也能照常使用，紀錄只存在這個瀏覽器。
        </p>
        {sync.linkedEmail && (
          <p className="mt-2 text-sm text-muted">
            這個瀏覽器的紀錄上次同步到 <span className="break-all">{sync.linkedEmail}</span>
            {sync.pending ? `，有 ${sync.pending} 筆變更尚未上傳` : ""}。再次登入同一個帳號就會繼續同步。
          </p>
        )}
        {sync.error && <p className="mt-2 text-sm text-vermilion">{sync.error}</p>}
        <SignInForm sync={sync} announce={announce} />
      </>
    );
  }

  return (
    <section id={SYNC_SECTION_ID} aria-labelledby={`${SYNC_SECTION_ID}-h`} className={`${cardCls} scroll-mt-4`}>
      <h3 id={`${SYNC_SECTION_ID}-h`} tabIndex={-1} className="text-lg font-bold focus:outline-none">
        帳號與雲端同步
      </h3>
      {body}
      <PrivacyNote />
    </section>
  );
}
