// Collects every source cited anywhere in 弓具, for the page's 資料來源 list.

import type { Source, SourceKind } from "@/content/types";
import * as budget from "./budget";
import * as calc from "./calc";
import { EQUIPMENT_FAQS } from "./faqs";
import { RESEARCH } from "./sources";
import * as topics from "./topics";

function isSource(v: unknown): v is Source {
  return typeof v === "object" && v !== null && "url" in v && "label" in v && "kind" in v && typeof (v as Source).url === "string";
}

function walk(v: unknown, out: Source[], seen: Set<unknown>) {
  if (typeof v !== "object" || v === null || seen.has(v)) return;
  seen.add(v);
  if (isSource(v)) {
    out.push(v);
    return;
  }
  for (const x of Array.isArray(v) ? v : Object.values(v)) walk(x, out, seen);
}

const ORDER: SourceKind[] = ["official", "guide", "local", "research", "shop", "secondary", "site"];

export function collectSources(): Source[] {
  const out: Source[] = [];
  const seen = new Set<unknown>();
  walk([topics, calc.MARGIN_RULES, calc.DRAW_CHARTS, calc.HEIGHT_CHARTS, calc.HEIGHT_ESTIMATE_SRC, budget.BUDGET_ITEMS, EQUIPMENT_FAQS], out, seen);
  out.push(RESEARCH.equipment);
  return out.map((s, i) => ({ s, i })).sort((a, b) => ORDER.indexOf(a.s.kind) - ORDER.indexOf(b.s.kind) || a.i - b.i).map((x) => x.s);
}
