"use client";

// 「重設學習進度」 with a confirm dialog. Only clears the course progress, never the 稽古帳.

import { useId, useRef } from "react";
import { resetProgress } from "@/lib/course/progress";

export default function ResetProgress({ className = "" }: { className?: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <>
      <button
        type="button"
        onClick={() => dlg.current?.showModal()}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-sm text-muted hover:bg-surface-2 hover:text-ink ${className}`}
      >
        <span aria-hidden="true">↺</span> 重設學習進度
      </button>
      <dialog
        ref={dlg}
        aria-labelledby={titleId}
        onClick={(e) => e.target === dlg.current && dlg.current?.close()}
        className="m-auto w-[min(92vw,24rem)] rounded-2xl border border-line bg-paper p-0 text-ink shadow-2xl backdrop:bg-black/50"
      >
        <div className="p-5">
          <h2 id={titleId} className="text-lg font-bold">
            要清除學習進度嗎？
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            這台瀏覽器記錄的已讀小節、過關測驗成績和徽章會全部清除，無法復原。稽古帳的紀錄不受影響。
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              autoFocus
              onClick={() => dlg.current?.close()}
              className="inline-flex min-h-11 items-center rounded-xl border border-field-border bg-surface px-4 text-[15px] font-semibold text-ink hover:bg-surface-2"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => {
                resetProgress();
                dlg.current?.close();
              }}
              className="inline-flex min-h-11 items-center rounded-xl bg-vermilion px-4 text-[15px] font-semibold text-paper hover:bg-vermilion/85"
            >
              清除進度
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
