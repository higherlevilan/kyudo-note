"use client";

import { useEffect, useRef, useState } from "react";
import { practiceCsv } from "@/lib/journal/csv";
import { daysBetween, formatDay, todayISO } from "@/lib/journal/date";
import { buildExport, LIMITS, parseImport, type ParsedImport } from "@/lib/journal/model";
import { isSample } from "@/lib/journal/sample";
import { isPersisted, readPref, requestPersistence, writePref, type StoreKind } from "@/lib/journal/store";
import type { Entry } from "@/lib/journal/types";
import { btn, cardCls } from "./ui";

export const LAST_EXPORT_PREF = "journal:lastExport";

const STORE_LABEL: Record<StoreKind, string> = {
  indexeddb: "瀏覽器資料庫（IndexedDB）",
  localstorage: "瀏覽器本機儲存（localStorage）",
  memory: "暫存記憶體（重新整理就會消失）",
};

function download(name: string, data: string, type: string) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function lastExportDays(today: string): number | null {
  const v = readPref(LAST_EXPORT_PREF);
  return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? daysBetween(v, today) : null;
}

export default function DataPanel({
  entries,
  today,
  storeKind,
  exportAll,
  importEntries,
  clearAll,
  loadSample,
  removeSample,
  announce,
}: {
  entries: Entry[];
  today: string;
  storeKind: StoreKind | null;
  exportAll: () => Promise<Entry[]>;
  importEntries: (es: Entry[], mode: "merge" | "replace") => Promise<{ added: number; updated: number; unchanged: number } | null>;
  clearAll: () => Promise<void>;
  loadSample: () => Promise<number>;
  removeSample: () => Promise<number>;
  announce: (msg: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<(ParsedImport & { fileName: string }) | null>(null);
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const [importError, setImportError] = useState<string | null>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [lastExport, setLastExport] = useState<string | null>(() => readPref(LAST_EXPORT_PREF));
  const sampleCount = entries.filter(isSample).length;
  const practiceCount = entries.filter((e) => e.type === "practice").length;

  useEffect(() => {
    let alive = true;
    void isPersisted().then((p) => {
      if (alive) setPersisted(p);
    });
    return () => {
      alive = false;
    };
  }, []);

  const markExported = () => {
    const d = todayISO();
    writePref(LAST_EXPORT_PREF, d);
    setLastExport(d);
  };

  const exportJson = async () => {
    const all = await exportAll();
    download(`kyudo-journal-${todayISO()}.json`, JSON.stringify(buildExport(all), null, 2), "application/json");
    markExported();
    announce(`已匯出 ${all.length} 筆紀錄`);
  };

  const exportCsv = async () => {
    const all = await exportAll();
    download(`kyudo-practice-${todayISO()}.csv`, practiceCsv(all), "text/csv;charset=utf-8");
    announce("已匯出練習紀錄 CSV");
  };

  const onFile = async (file: File | undefined) => {
    setParsed(null);
    setImportError(null);
    if (!file) return;
    if (file.size > LIMITS.importBytes) {
      setImportError(`檔案太大（上限 ${Math.round(LIMITS.importBytes / 1024 / 1024)} MB）。`);
      return;
    }
    try {
      const text = await file.text();
      const data = JSON.parse(text) as unknown;
      const p = parseImport(data);
      if (!p.entries.length) {
        setImportError(p.errors[0] ?? "檔案裡沒有可以匯入的紀錄。");
        return;
      }
      setParsed({ ...p, fileName: file.name });
    } catch {
      setImportError("無法讀取這個檔案：請選擇從稽古帳匯出的 .json 檔。");
    }
  };

  const doImport = async () => {
    if (!parsed) return;
    if (mode === "replace" && !window.confirm(`確定要用「${parsed.fileName}」取代目前全部 ${entries.length} 筆紀錄嗎？這個動作無法復原。`)) return;
    const r = await importEntries(parsed.entries, mode);
    if (r) announce(`匯入完成：新增 ${r.added} 筆、更新 ${r.updated} 筆${r.unchanged ? `、${r.unchanged} 筆已是最新` : ""}`);
    setParsed(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const exportAge = lastExport ? daysBetween(lastExport, today) : null;

  return (
    <div className="space-y-4">
      <section aria-labelledby="data-where" className={cardCls}>
        <h3 id="data-where" className="text-lg font-bold">
          資料存放在哪裡？
        </h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
          <li>
            所有紀錄只存在<strong>這台裝置的這個瀏覽器</strong>裡，不會上傳到任何伺服器；換手機、換瀏覽器看不到彼此的資料。
          </li>
          <li>
            <strong className="text-vermilion">清除瀏覽資料（Cookie 與網站資料）會一併刪除紀錄</strong>
            ，請定期匯出 JSON 備份。iOS Safari 對很久沒開的網站也可能清除資料。
          </li>
          <li>之後若推出帳號同步，可以用匯出的 JSON 檔搬家。</li>
        </ul>
        <dl className="mt-3 grid gap-1 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted">目前儲存方式：</dt>
            <dd className={storeKind === "memory" ? "text-vermilion" : ""}>{storeKind ? STORE_LABEL[storeKind] : "載入中…"}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted">紀錄數：</dt>
            <dd>
              {entries.length} 筆（練習 {practiceCount} 筆{sampleCount ? `，其中範例 ${sampleCount} 筆` : ""}）
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted">上次匯出：</dt>
            <dd className={exportAge == null || exportAge > 30 ? "text-vermilion" : ""}>
              {lastExport ? `${formatDay(lastExport, true)}（${exportAge === 0 ? "今天" : `${exportAge} 天前`}）` : "還沒有匯出過"}
            </dd>
          </div>
        </dl>
        {storeKind !== "memory" && persisted !== true && (
          <div className="mt-3">
            <button
              type="button"
              className={btn.secondary}
              onClick={async () => {
                const ok = await requestPersistence();
                setPersisted(ok);
                announce(ok ? "瀏覽器已同意保留本站資料" : "瀏覽器未同意（或不支援）；請記得定期匯出備份");
              }}
            >
              請瀏覽器保留資料
            </button>
            <p className="mt-1 text-xs text-muted">要求瀏覽器在空間不足時不要自動清除本站資料。不保證一定成功，也無法防止你手動清除。</p>
          </div>
        )}
        {persisted === true && <p className="mt-2 text-sm text-wood">✓ 瀏覽器已同意保留本站資料（仍建議定期匯出）。</p>}
      </section>

      <section aria-labelledby="data-export" className={cardCls}>
        <h3 id="data-export" className="text-lg font-bold">
          匯出
        </h3>
        <p className="mt-1 text-sm text-muted">JSON 是完整備份，可再匯入；CSV 只含練習紀錄，可用 Excel 或 Google 試算表開啟。</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={btn.primary} onClick={exportJson} disabled={!entries.length}>
            匯出完整備份（JSON）
          </button>
          <button type="button" className={btn.secondary} onClick={exportCsv} disabled={!practiceCount}>
            匯出練習紀錄（CSV）
          </button>
        </div>
      </section>

      <section aria-labelledby="data-import" className={cardCls}>
        <h3 id="data-import" className="text-lg font-bold">
          匯入
        </h3>
        <label htmlFor="import-file" className="mt-1 block text-sm text-muted">
          選擇之前從稽古帳匯出的 .json 檔。匯入前會先檢查內容，不會執行檔案裡的任何東西。
        </label>
        <input
          id="import-file"
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={(e) => void onFile(e.target.files?.[0])}
          className="mt-2 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-xl file:border file:border-line file:bg-surface-2 file:px-4 file:text-ink"
        />
        <div aria-live="polite">
          {importError && <p className="mt-2 text-sm text-vermilion">{importError}</p>}
          {parsed && (
            <div className="mt-3 rounded-xl border border-line bg-paper/60 p-3 text-[15px]">
              <p>
                「{parsed.fileName}」裡有 <strong>{parsed.entries.length}</strong> 筆可匯入的紀錄
                {parsed.skipped > 0 && `，${parsed.skipped} 筆格式不正確會略過`}。
              </p>
              {parsed.errors.map((er) => (
                <p key={er} className="mt-1 text-sm text-vermilion">
                  {er}
                </p>
              ))}
              <fieldset className="mt-2 space-y-1">
                <legend className="sr-only">匯入方式</legend>
                <label className="flex min-h-10 items-start gap-2">
                  <input type="radio" name="import-mode" checked={mode === "merge"} onChange={() => setMode("merge")} className="mt-1 h-4 w-4 accent-[var(--wood)]" />
                  <span>
                    合併<span className="block text-xs text-muted">保留現有紀錄；同一筆紀錄以較新的版本為準。</span>
                  </span>
                </label>
                <label className="flex min-h-10 items-start gap-2">
                  <input type="radio" name="import-mode" checked={mode === "replace"} onChange={() => setMode("replace")} className="mt-1 h-4 w-4 accent-[var(--wood)]" />
                  <span>
                    取代<span className="block text-xs text-muted">先刪除這個瀏覽器裡的全部紀錄，再匯入檔案內容。</span>
                  </span>
                </label>
              </fieldset>
              <div className="mt-2 flex gap-2">
                <button type="button" className={mode === "replace" ? btn.danger : btn.primary} onClick={doImport}>
                  {mode === "replace" ? "取代並匯入" : "合併匯入"}
                </button>
                <button
                  type="button"
                  className={btn.secondary}
                  onClick={() => {
                    setParsed(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="data-sample" className={cardCls}>
        <h3 id="data-sample" className="text-lg font-bold">
          範例資料
        </h3>
        <p className="mt-1 text-sm text-muted">載入約三個月的虛構紀錄，看看圖表與各頁長什麼樣子。範例都標有「範例」，可以隨時一鍵移除，不會動到你自己的紀錄。</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={btn.secondary}
            onClick={async () => {
              const n = await loadSample();
              announce(`已載入 ${n} 筆範例資料`);
            }}
          >
            {sampleCount ? "重新載入範例資料" : "載入範例資料"}
          </button>
          {sampleCount > 0 && (
            <button
              type="button"
              className={btn.danger}
              onClick={async () => {
                const n = await removeSample();
                announce(`已移除 ${n} 筆範例資料`);
              }}
            >
              移除範例資料（{sampleCount} 筆）
            </button>
          )}
        </div>
      </section>

      <section aria-labelledby="data-danger" className={`${cardCls} border-vermilion/40`}>
        <h3 id="data-danger" className="text-lg font-bold text-vermilion">
          清除全部紀錄
        </h3>
        <p className="mt-1 text-sm text-muted">刪除這個瀏覽器裡的所有稽古帳紀錄（包含範例）。建議先匯出備份。</p>
        <button
          type="button"
          className={`${btn.danger} mt-3`}
          disabled={!entries.length}
          onClick={async () => {
            const msg = exportAge == null || exportAge > 0 ? `確定要刪除全部 ${entries.length} 筆紀錄嗎？今天還沒有匯出備份，刪除後無法復原。` : `確定要刪除全部 ${entries.length} 筆紀錄嗎？刪除後無法復原。`;
            if (!window.confirm(msg)) return;
            await clearAll();
            announce("已清除全部紀錄");
          }}
        >
          清除全部紀錄
        </button>
      </section>
    </div>
  );
}
