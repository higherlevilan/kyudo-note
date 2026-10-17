"use client";

// Optional account + cloud sync for 稽古帳. Everything is a no-op unless the site was built
// with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see lib/journal/sync/config.ts).
//
// Sync runs: when a session appears (sign-in / page load while signed in), on demand
// (「立即同步」), when the tab becomes visible again, when the browser comes back online, and
// a few seconds after each local edit. Runs never overlap (one at a time per tab, and a Web
// Lock across tabs where supported). Failures leave local data untouched and are retried.

import { useCallback, useEffect, useRef, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { clearDrafts } from "@/lib/journal/store";
import { getSupabase } from "@/lib/journal/sync/client";
import { journalRedirectUrl, SYNC_ENABLED } from "@/lib/journal/sync/config";
import { countPending, syncOnce } from "@/lib/journal/sync/engine";
import { isTombstone, needsPush } from "@/lib/journal/sync/merge";
import { SyncError, supabaseRemote, type SyncErrorKind } from "@/lib/journal/sync/remote";
import { readLink, updateLink, writeLink, type SyncLink } from "@/lib/journal/sync/state";
import type { JournalState } from "./useJournal";

export type SyncPhase =
  /** Not configured at build time: hide everything about accounts. */
  | "off"
  /** Loading the client / restoring the session. */
  | "starting"
  | "signedOut"
  /** A different account signed in while this device holds another account's journal. */
  | "conflict"
  | "idle"
  | "syncing"
  | "offline"
  | "error";

export interface SyncState {
  enabled: boolean;
  phase: SyncPhase;
  /** Signed-in account. */
  email: string | null;
  /** Account this device's journal is linked to (kept after a sign-out that keeps local data). */
  linkedEmail: string | null;
  lastSyncAt: string | null;
  /** Local changes not yet uploaded. */
  pending: number;
  error: string | null;
  /** Previous account's email while phase === "conflict". */
  conflictEmail: string | null;
  /** Returns an error message, or null when the email was sent. */
  sendLink(email: string): Promise<string | null>;
  /** Sign in with the 6-digit code from the same email. Returns an error message or null. */
  verifyCode(email: string, code: string): Promise<string | null>;
  syncNow(): Promise<boolean>;
  signOut(keepLocal: boolean): Promise<void>;
  resolveConflict(choice: "merge" | "replace" | "cancel"): Promise<void>;
}

const LOCK = "kyudo-note:journal-sync";
const EDIT_DEBOUNCE_MS = 3000;
const VISIBLE_MIN_GAP_MS = 30_000;

const ERROR_TEXT: Record<SyncErrorKind, string> = {
  network: "目前無法連線到雲端；恢復連線後會自動同步，紀錄仍安全地存在這個瀏覽器。",
  auth: "登入已過期，請登出後重新登入。",
  schema: "雲端資料表尚未設定完成（網站管理者需要先執行資料庫設定）。",
  permission: "雲端拒絕了這次同步（權限不足），請登出後重新登入。",
  other: "同步失敗，稍後會再試一次。",
};

function errorKind(err: unknown): SyncErrorKind {
  if (err instanceof SyncError) return err.kind;
  const msg = err instanceof Error ? err.message : String(err);
  return /fetch|network|load failed/i.test(msg) ? "network" : "other";
}

function authErrorText(err: { message?: string; code?: string; status?: number } | null): string {
  const code = err?.code ?? "";
  const msg = err?.message ?? "";
  if (err?.status === 429 || /rate.?limit/i.test(code + msg)) return "寄送太頻繁，請等一分鐘後再試。";
  if (code === "email_address_invalid" || /invalid.*email/i.test(msg)) return "電子郵件格式不正確。";
  if (code === "signup_disabled" || code === "otp_disabled") return "目前不開放新帳號註冊。";
  if (code === "otp_expired" || /expired|invalid.*(otp|token)/i.test(msg)) return "驗證碼錯誤或已過期，請重新寄送。";
  if (/fetch|network|load failed/i.test(msg)) return "無法連線，請檢查網路後再試。";
  return msg ? `發生錯誤：${msg}` : "發生錯誤，請稍後再試。";
}

/** A magic link that failed (expired, already used) comes back as #error=…; read it before the client clears it. */
function readHashError(): string | null {
  try {
    const h = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (!h.get("error") && !h.get("error_code")) return null;
    const url = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(window.history.state, "", url);
    return h.get("error_code") === "otp_expired" ? "登入連結已失效或已使用過，請重新寄送。" : "登入沒有完成，請重新寄送登入連結。";
  } catch {
    return null;
  }
}

/** Serialize sync runs across tabs (Web Locks; unavailable on plain-http origins, then just run). */
async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
  return locks?.request ? ((await locks.request(LOCK, fn)) as T) : fn();
}

interface User {
  id: string;
  email: string;
}

const OFF: SyncState = {
  enabled: false,
  phase: "off",
  email: null,
  linkedEmail: null,
  lastSyncAt: null,
  pending: 0,
  error: null,
  conflictEmail: null,
  sendLink: async () => "雲端同步尚未開放。",
  verifyCode: async () => "雲端同步尚未開放。",
  syncNow: async () => false,
  signOut: async () => {},
  resolveConflict: async () => {},
};

export function useSync(j: JournalState, onNotice?: (msg: string) => void): SyncState {
  const { ready, getStore, refresh, localRev } = j;
  const [phase, setPhaseState] = useState<SyncPhase>(SYNC_ENABLED ? "starting" : "off");
  const [user, setUser] = useState<User | null>(null);
  const [link, setLink] = useState<SyncLink | null>(null);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [conflictEmail, setConflictEmail] = useState<string | null>(null);

  const phaseRef = useRef<SyncPhase>(phase);
  const userRef = useRef<User | null>(null);
  const clientRef = useRef<SupabaseClient | null>(null);
  const runningRef = useRef<Promise<boolean> | null>(null);
  const againRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRunRef = useRef(0);
  const noticeRef = useRef(onNotice);
  useEffect(() => {
    noticeRef.current = onNotice;
  }, [onNotice]);

  const setPhase = useCallback((p: SyncPhase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  const updatePending = useCallback(async () => {
    const store = getStore();
    const uid = userRef.current?.id ?? readLink()?.uid;
    if (!store || !uid) return setPending(0);
    try {
      setPending(await countPending(store, uid));
    } catch {
      /* ignore */
    }
  }, [getStore]);

  const runSync = useCallback(async (): Promise<boolean> => {
    const u = userRef.current;
    const client = clientRef.current;
    const store = getStore();
    if (!u || !client || !store || phaseRef.current === "conflict") {
      await updatePending();
      return false;
    }
    if (runningRef.current) {
      againRef.current = true;
      return runningRef.current;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setPhase("offline");
      setError(ERROR_TEXT.network);
      await updatePending();
      return false;
    }
    const run = (async () => {
      setPhase("syncing");
      lastRunRef.current = Date.now();
      try {
        await withLock(async () => {
          const l = readLink();
          if (!l || l.uid !== u.id) return;
          const res = await syncOnce(store, supabaseRemote(client, u.id), u.id, l.cursor, (cursor) => updateLink({ cursor }));
          setLink(updateLink({ cursor: res.cursor, lastSyncAt: new Date().toISOString() }));
          if (res.changed) await refresh();
        });
        if (userRef.current?.id !== u.id) return false; // signed out meanwhile
        setError(null);
        setPhase("idle");
        return true;
      } catch (err) {
        if (userRef.current?.id !== u.id) return false;
        const kind = errorKind(err);
        setError(ERROR_TEXT[kind]);
        setPhase(kind === "network" ? "offline" : "error");
        return false;
      } finally {
        await updatePending();
      }
    })();
    runningRef.current = run;
    try {
      return await run;
    } finally {
      runningRef.current = null;
      if (againRef.current) {
        againRef.current = false;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => void runSyncRef.current(), 500);
      }
    }
  }, [getStore, refresh, setPhase, updatePending]);
  const runSyncRef = useRef(runSync);
  useEffect(() => {
    runSyncRef.current = runSync;
  }, [runSync]);

  const schedule = useCallback(
    (ms: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void runSync();
      }, ms);
    },
    [runSync],
  );

  const handleSession = useCallback(
    async (session: Session | null) => {
      const store = getStore();
      if (!session) {
        userRef.current = null;
        setUser(null);
        setConflictEmail(null);
        setLink(readLink());
        setPhase("signedOut");
        await updatePending();
        return;
      }
      const u: User = { id: session.user.id, email: session.user.email ?? "" };
      if (userRef.current?.id === u.id) return; // token refresh etc.
      userRef.current = u;
      setUser(u);
      const prev = readLink();
      if (prev && prev.uid !== u.id && store) {
        // This device holds another account's journal: never mix them silently.
        const records = await store.records();
        if (records.some((r) => needsPush(r, u.id))) {
          setConflictEmail(prev.email || "另一個帳號");
          setPhase("conflict");
          return;
        }
      }
      if (!prev || prev.uid !== u.id) {
        writeLink({ uid: u.id, email: u.email, cursor: null, lastSyncAt: null });
        noticeRef.current?.(`已登入 ${u.email}，開始同步`);
      } else if (prev.email !== u.email) updateLink({ email: u.email });
      setLink(readLink());
      setPhase("idle");
      await runSync();
    },
    [getStore, runSync, setPhase, updatePending],
  );

  // Start: load the client (only when enabled), restore the session, follow auth changes.
  useEffect(() => {
    if (!SYNC_ENABLED || !ready) return;
    let alive = true;
    let unsubscribe: (() => void) | null = null;
    (async () => {
      const fromLink = /access_token|error/.test(window.location.hash);
      const hashError = readHashError();
      const client = await getSupabase();
      if (!alive) return;
      if (!client) {
        setLink(readLink());
        setError("無法載入登入元件，請檢查網路後重新整理頁面。");
        setPhase("signedOut");
        return;
      }
      clientRef.current = client;
      const { error: initError } = await client.auth.initialize();
      if (!alive) return;
      if (hashError || (initError && fromLink)) setError(hashError ?? "登入沒有完成，請重新寄送登入連結。");
      // Fires INITIAL_SESSION right away, then SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED (also from other tabs).
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        // Defer: never call back into supabase-js from inside its own callback.
        setTimeout(() => {
          if (alive) void handleSession(session);
        }, 0);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    })();
    return () => {
      alive = false;
      unsubscribe?.();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [ready, handleSession, setPhase]);

  // Debounced upload after local edits (also refreshes the pending count while signed out).
  useEffect(() => {
    if (!SYNC_ENABLED || localRev === 0) return;
    schedule(EDIT_DEBOUNCE_MS);
  }, [localRev, schedule]);

  // Visibility regained / back online.
  useEffect(() => {
    if (!SYNC_ENABLED) return;
    const onVis = () => {
      if (document.visibilityState === "visible" && userRef.current && Date.now() - lastRunRef.current > VISIBLE_MIN_GAP_MS) void runSync();
    };
    const onOnline = () => {
      if (userRef.current) void runSync();
    };
    const onOffline = () => {
      if (userRef.current && phaseRef.current !== "conflict") setPhase("offline");
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [runSync, setPhase]);

  const sendLink = useCallback(async (email: string) => {
    const client = clientRef.current ?? (await getSupabase());
    if (!client) return "目前無法連線到登入服務，請檢查網路。";
    try {
      const { error: e } = await client.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: journalRedirectUrl(), shouldCreateUser: true },
      });
      return e ? authErrorText(e) : null;
    } catch (err) {
      return authErrorText(err as Error);
    }
  }, []);

  const verifyCode = useCallback(async (email: string, code: string) => {
    const client = clientRef.current ?? (await getSupabase());
    if (!client) return "目前無法連線到登入服務，請檢查網路。";
    try {
      const { error: e } = await client.auth.verifyOtp({ email: email.trim(), token: code.replace(/\s+/g, ""), type: "email" });
      return e ? authErrorText(e) : null;
    } catch (err) {
      return authErrorText(err as Error);
    }
  }, []);

  const signOut = useCallback(
    async (keepLocal: boolean) => {
      const client = clientRef.current;
      const store = getStore();
      if (timerRef.current) clearTimeout(timerRef.current);
      // Let an in-flight sync finish first, so it cannot write pulled rows into a wiped store.
      const running = runningRef.current;
      if (running) await Promise.race([running.catch(() => false), new Promise((r) => setTimeout(r, 15_000))]);
      userRef.current = null;
      // scope "local": end this browser's session only; it clears the session even when offline.
      if (client) await client.auth.signOut({ scope: "local" }).catch(() => undefined);
      if (!keepLocal && store) {
        try {
          await store.wipe();
          clearDrafts();
          writeLink(null);
          await refresh();
        } catch {
          setError("清除本機資料失敗，請到下方「清除全部紀錄」再試一次。");
        }
      }
      setUser(null);
      setConflictEmail(null);
      setLink(readLink());
      setPhase("signedOut");
      await updatePending();
    },
    [getStore, refresh, setPhase, updatePending],
  );

  const resolveConflict = useCallback(
    async (choice: "merge" | "replace" | "cancel") => {
      const u = userRef.current;
      const store = getStore();
      if (!u || !store) return;
      if (choice === "cancel") return signOut(true);
      if (choice === "replace") {
        await store.wipe();
        clearDrafts();
      } else {
        // Pending deletions belonged to the other account; do not replay them into this one.
        const dead = (await store.records()).filter(isTombstone).map((r) => r.id);
        if (dead.length) await store.updateRecords(dead, () => ({ kind: "delete" }));
      }
      writeLink({ uid: u.id, email: u.email, cursor: null, lastSyncAt: null });
      setLink(readLink());
      setConflictEmail(null);
      setPhase("idle");
      await refresh();
      await runSync();
    },
    [getStore, refresh, runSync, setPhase, signOut],
  );

  const syncNow = useCallback(() => runSync(), [runSync]);

  if (!SYNC_ENABLED) return OFF;
  return {
    enabled: true,
    phase,
    email: user?.email ?? null,
    linkedEmail: link?.email ?? null,
    lastSyncAt: link && user && link.uid === user.id ? link.lastSyncAt : null,
    pending,
    error,
    conflictEmail,
    sendLink,
    verifyCode,
    syncNow,
    signOut,
    resolveConflict,
  };
}
