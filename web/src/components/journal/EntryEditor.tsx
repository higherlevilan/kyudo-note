"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { addDays, formatDay, formatTime, todayISO } from "@/lib/journal/date";
import { tidyEntry, validateEntry, type FieldError } from "@/lib/journal/model";
import { TYPE_META } from "@/lib/journal/options";
import { readDraft, writeDraft, type Draft } from "@/lib/journal/store";
import type { Entry } from "@/lib/journal/types";
import { CultureFields, ExamFields, GoalFields, Group, LessonFields, PracticeFields, PurchaseFields, type EditorContext } from "./EntryFields";
import { btn, TextAreaField, TextField } from "./ui";

export const draftKeyFor = (e: Entry, isNew: boolean) => (isNew ? `new:${e.type}` : e.id);

function initialDraft(initial: Entry, isNew: boolean): Draft | null {
  const d = readDraft(draftKeyFor(initial, isNew));
  if (!d || d.entry.type !== initial.type) return null;
  if (!isNew && (d.entry.id !== initial.id || d.savedAt <= initial.updatedAt)) return null;
  if (JSON.stringify({ ...d.entry, updatedAt: "" }) === JSON.stringify({ ...initial, updatedAt: "" })) return null;
  return d;
}

const splitTags = (s: string) => [...new Set(s.split(/[,，、\s]+/).map((t) => t.trim().slice(0, 40)).filter(Boolean))].slice(0, 20);

export default function EntryEditor({
  initial: initialProp,
  isNew,
  ctx,
  onSave,
  onCancel,
  onDelete,
}: {
  /** The entry to edit, or a factory for a new one (called once). */
  initial: Entry | (() => Entry);
  isNew: boolean;
  ctx: EditorContext;
  onSave: (e: Entry) => Promise<boolean>;
  onCancel: (dirty: boolean) => void;
  onDelete?: (id: string) => void;
}) {
  const [initial] = useState<Entry>(initialProp);
  const [entry, setEntry] = useState<Entry>(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [draft, setDraft] = useState<Draft | null>(() => initialDraft(initial, isNew));
  const [tagsText, setTagsText] = useState(initial.tags.join(" "));
  const [errors, setErrors] = useState<FieldError[] | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const draftKey = draftKeyFor(initial, isNew);
  const dirty = useMemo(() => JSON.stringify(entry) !== baseline, [entry, baseline]);
  const meta = TYPE_META[entry.type];

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const update = (next: Entry) => {
    setEntry(next);
    // Autosave the draft on every change (small JSON, cheap), announce it once typing pauses.
    writeDraft(draftKey, next);
    if (errors) setErrors(validateEntry(next));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(`草稿已自動暫存（${formatTime(new Date().toISOString())}）`), 900);
  };
  const set = (patch: Partial<Entry>) => update({ ...entry, ...patch } as Entry);
  const err = (f: string) => errors?.find((x) => x.field === f)?.message;

  const save = async () => {
    const errs = validateEntry(entry);
    if (errs.length) {
      setErrors(errs);
      setStatus(`有 ${errs.length} 個欄位需要修正`);
      requestAnimationFrame(() => document.getElementById("editor-errors")?.focus());
      return;
    }
    setSaving(true);
    const tidy = tidyEntry(entry, new Date().toISOString());
    const ok = await onSave(tidy);
    setSaving(false);
    if (ok) {
      if (timer.current) clearTimeout(timer.current);
      writeDraft(draftKey, null);
      setBaseline(JSON.stringify(entry));
      setStatus("已儲存");
    } else setStatus("儲存失敗，草稿仍保留在這台裝置上。");
  };

  const onKeyDown = (ev: KeyboardEvent<HTMLFormElement>) => {
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "s") {
      ev.preventDefault();
      void save();
    } else if (ev.key === "Enter" && ev.target instanceof HTMLInputElement && ev.target.type !== "checkbox" && ev.target.type !== "radio") {
      // Enter in a text box should not submit the whole entry by accident.
      ev.preventDefault();
    }
  };

  const fieldsProps = { err, ctx };
  let body;
  switch (entry.type) {
    case "practice":
      body = <PracticeFields e={entry} set={set} {...fieldsProps} />;
      break;
    case "lesson":
      body = <LessonFields e={entry} set={set} {...fieldsProps} />;
      break;
    case "exam":
      body = <ExamFields e={entry} set={set} {...fieldsProps} />;
      break;
    case "purchase":
      body = <PurchaseFields e={entry} set={set} {...fieldsProps} />;
      break;
    case "culture":
      body = <CultureFields e={entry} set={set} {...fieldsProps} />;
      break;
    case "goal":
      body = <GoalFields e={entry} set={set} {...fieldsProps} />;
      break;
  }

  const dateLabel = entry.type === "goal" ? "目標日期" : entry.type === "purchase" ? "購買日期" : "日期";

  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault();
        void save();
      }}
      onKeyDown={onKeyDown}
      className="pb-28"
      aria-labelledby="editor-title"
    >
      <div className="flex items-center gap-2 pt-2">
        <button type="button" onClick={() => onCancel(dirty)} className={btn.ghost}>
          ‹ 返回
        </button>
      </div>
      <h2 id="editor-title" ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-bold focus:outline-none">
        {isNew ? "新增" : "編輯"}
        {meta.label}
        <span lang="ja" className="ml-2 text-base font-normal text-muted">
          {meta.ja}
        </span>
      </h2>

      {draft && (
        <div role="region" aria-label="未儲存的草稿" className="mt-4 rounded-2xl border border-wood/40 bg-wood-soft/40 p-4 text-[15px]">
          <p>
            找到一份 {formatDay(todayISO(new Date(draft.savedAt)))} {formatTime(draft.savedAt)} 自動暫存、尚未儲存的草稿。
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className={btn.primary}
              onClick={() => {
                setEntry(draft.entry);
                setTagsText(draft.entry.tags.join(" "));
                setDraft(null);
                setStatus("已恢復草稿");
              }}
            >
              恢復草稿
            </button>
            <button
              type="button"
              className={btn.secondary}
              onClick={() => {
                writeDraft(draftKey, null);
                setDraft(null);
                setStatus("已捨棄草稿");
              }}
            >
              捨棄
            </button>
          </div>
        </div>
      )}

      {errors && errors.length > 0 && (
        <div id="editor-errors" tabIndex={-1} role="alert" className="mt-4 rounded-2xl border border-vermilion/50 bg-vermilion/5 p-4 focus:outline-none">
          <p className="font-semibold text-vermilion">請修正以下欄位：</p>
          <ul className="mt-1 list-disc pl-5 text-[15px]">
            {errors.map((x) => (
              <li key={x.field + x.message}>
                <a
                  href={`#${x.field}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    const el = document.getElementById(x.field);
                    el?.closest("details")?.setAttribute("open", "");
                    el?.focus();
                  }}
                  className="text-ink underline"
                >
                  {x.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <TextField id="date" type="date" label={dateLabel} value={entry.date} onChange={(date) => set({ date })} error={err("date")} />
          {entry.type !== "goal" && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { label: "今天", d: ctx.today },
                { label: "昨天", d: addDays(ctx.today, -1) },
              ].map((q) => (
                <button
                  key={q.label}
                  type="button"
                  aria-pressed={entry.date === q.d}
                  onClick={() => set({ date: q.d })}
                  className="rounded-lg border border-field-border px-2.5 py-1 text-sm aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {body}

        <Group title="備註與標籤" filled={!!(entry.notes || entry.tags.length)} open={entry.type !== "practice"}>
          <TextAreaField id="notes" label="備註" value={entry.notes} onChange={(notes) => set({ notes })} optional />
          <TextField
            id="tags"
            label="標籤"
            value={tagsText}
            onChange={(v) => {
              setTagsText(v);
              set({ tags: splitTags(v) });
            }}
            hint="以空白或逗號分隔，例如：遠的 射會前"
            optional
          />
        </Group>
      </div>

      <div data-fixed-bottom="always" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2.5">
          <p className="min-w-0 flex-1 truncate text-xs text-muted" role="status" aria-live="polite">
            {status || (dirty ? "編輯中，內容會自動暫存為草稿" : "")}
          </p>
          {!isNew && onDelete && (
            <button type="button" className={btn.danger} onClick={() => onDelete(entry.id)}>
              刪除
            </button>
          )}
          <button type="button" className={btn.secondary} onClick={() => onCancel(dirty)}>
            取消
          </button>
          <button type="submit" className={btn.primary} disabled={saving}>
            {saving ? "儲存中…" : "儲存"}
          </button>
        </div>
      </div>
    </form>
  );
}
