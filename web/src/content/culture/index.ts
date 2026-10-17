// Aggregates every source cited on the /culture page, for <SourceList>.

import type { Source, SourceKind } from "../types";
import { RESEARCH } from "../common-sources";
import { CULTURE_FAQS } from "./faqs";
import { LINEAGE, SHOOTING_TYPES, type LineageNode } from "./lineage";
import { MYTHS } from "./myths";
import { RANK_HISTORY, RANK_RULES, RANK_SRC } from "./ranks";
import {
  HISTORY_TOPICS,
  ISSHA,
  QUICK_HISTORY,
  SHAGI_DEEP,
  SHAGI_SRC,
  SHAHOKUN,
  SHINZENBI_SRC,
  THOUGHT,
  TW_COLONIAL,
  TW_COLONIAL_DEEP,
  TW_TODAY,
  WHAT_IS,
  ZEN,
  ZEN_BALANCE,
  ZEN_FACTS,
} from "./sections";
import { TIMELINE } from "./timeline";
import type { LayeredSection, Point } from "../types";

const KIND_ORDER: SourceKind[] = ["official", "guide", "research", "local", "shop", "secondary", "site"];

function fromPoints(points: readonly Point[]): Source[] {
  return points.flatMap((p) => p.src ?? []);
}

function fromSection(s: LayeredSection): Source[] {
  return [...(s.introSrc ?? []), ...(s.deep ?? []).flatMap((b) => fromPoints(b.points))];
}

function fromNode(n: LineageNode): Source[] {
  return [...(n.src ?? []), ...(n.children ?? []).flatMap(fromNode)];
}

export function cultureSources(): Source[] {
  const all: Source[] = [
    ...fromSection(WHAT_IS),
    ...QUICK_HISTORY.flatMap((q) => q.src),
    ...TIMELINE.flatMap((e) => e.src),
    ...HISTORY_TOPICS.flatMap(fromSection),
    ...LINEAGE.flatMap((g) => g.roots.flatMap(fromNode)),
    ...SHOOTING_TYPES.src,
    ...SHINZENBI_SRC,
    ...THOUGHT.flatMap(fromSection),
    ...SHAGI_SRC,
    ...fromPoints(SHAGI_DEEP),
    ...SHAHOKUN.src,
    ...fromPoints(SHAHOKUN.deep),
    ...ZEN_FACTS.flatMap((f) => f.src),
    ...fromSection(ZEN),
    ...fromSection(ISSHA),
    ...fromPoints(ZEN_BALANCE),
    ...RANK_SRC,
    ...fromPoints(RANK_RULES),
    ...fromPoints(RANK_HISTORY),
    ...TW_COLONIAL.flatMap((t) => t.src),
    ...fromPoints(TW_COLONIAL_DEEP),
    ...fromSection(TW_TODAY),
    ...MYTHS.flatMap((m) => m.src),
    ...CULTURE_FAQS.flatMap((f) => fromPoints(f.a)),
    RESEARCH.history,
  ];
  const seen = new Set<string>();
  const unique = all.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
  return unique.sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
}
