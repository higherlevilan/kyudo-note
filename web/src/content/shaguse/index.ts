// 射癖與矢所 (/shaguse) content entry point.

import type { Point, Source } from "@/content/types";
import { FAULTS } from "./faults";
import { SHAGUSE_FAQS } from "./faqs";
import { RESEARCH } from "./sources";
import { ASK_INSTRUCTOR, VIDEO_EVIDENCE, VIDEO_HOW, VIDEO_SAFETY, WHAT_IS } from "./topics";
import { MAE_USHIRO, YADOKORO_ROWS } from "./yadokoro";

export { FAULTS, FAULT_TOC } from "./faults";
export { SHAGUSE_FAQS } from "./faqs";
export * from "./topics";
export { MAE_USHIRO, OTHER_FACTORS, YADOKORO_ROWS } from "./yadokoro";

const fromPoints = (ps: readonly Point[]) => ps.flatMap((p) => p.src ?? []);

/** Every source cited on the page, in reading order (SourceList deduplicates by URL). */
export function collectSources(): Source[] {
  return [
    ...fromPoints(WHAT_IS),
    ...fromPoints(ASK_INSTRUCTOR),
    ...FAULTS.flatMap((f) => [
      ...(f.section.introSrc ?? []),
      ...fromPoints(f.defs),
      ...f.studies.flatMap((s) => s.src),
      ...fromPoints(f.evidenceNotes ?? []),
      ...fromPoints(f.tips),
      ...fromPoints(f.help),
    ]),
    ...fromPoints(MAE_USHIRO),
    ...YADOKORO_ROWS.flatMap((r) => fromPoints(r.support)),
    ...fromPoints(VIDEO_EVIDENCE),
    ...fromPoints(VIDEO_HOW),
    ...fromPoints(VIDEO_SAFETY),
    ...SHAGUSE_FAQS.flatMap((f) => fromPoints(f.a)),
    RESEARCH.equipment,
  ];
}
