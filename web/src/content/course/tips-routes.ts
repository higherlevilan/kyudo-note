// 小弓's route tips, lazy form: the types, the route matching and `loadTips`, which imports only
// the current route's tip module (./tips-data/*), so the corner companion does not ship every
// page's tips (~15 KB) on every page. The data lives in ./tips-data.

import type { Mood } from "@/lib/course/types";

export interface Tip {
  /** one or two short sentences; may contain <b>, <i>, <br> */
  text: string;
  mood?: Mood;
  /** optional 「去看看 →」 link, e.g. "#safety" (same page) or "/shaho/#kai" */
  href?: string;
}

export type TipRoute =
  | "/"
  | "/guide/"
  | "/etiquette/"
  | "/shaho/"
  | "/shaguse/"
  | "/equipment/"
  | "/culture/"
  | "/glossary/"
  | "/faq/"
  | "/practice/"
  | "/journal/"
  | "/form-check/"
  | "*";

export const TIP_ROUTES: readonly TipRoute[] = [
  "/",
  "/guide/",
  "/etiquette/",
  "/shaho/",
  "/shaguse/",
  "/equipment/",
  "/culture/",
  "/glossary/",
  "/faq/",
  "/practice/",
  "/journal/",
  "/form-check/",
  "*",
];

/** The tip route for a pathname (with or without trailing slash); "*" for any other page. */
export function tipRoute(pathname: string | null | undefined): TipRoute {
  const p = !pathname || pathname === "/" ? "/" : pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (p === "/") return "/";
  return TIP_ROUTES.find((k) => k !== "*" && k !== "/" && p.startsWith(k)) ?? "*";
}

// One literal import() per module, so the bundler splits each into its own chunk.
async function load(route: TipRoute): Promise<Tip[]> {
  switch (route) {
    case "/":
      return (await import("./tips-data/home")).default;
    case "/guide/":
      return (await import("./tips-data/guide")).default;
    case "/etiquette/":
      return (await import("./tips-data/etiquette")).default;
    case "/shaho/":
      return (await import("./tips-data/shaho")).default;
    case "/shaguse/":
      return (await import("./tips-data/shaguse")).default;
    case "/equipment/":
      return (await import("./tips-data/equipment")).default;
    case "/culture/":
      return (await import("./tips-data/culture")).default;
    case "*":
      return (await import("./tips-data/fallback")).default;
    default:
      return (await import("./tips-data/tools")).default[route] ?? [];
  }
}

/** Tips for a pathname, loading only that route's module; falls back to the "*" tips. */
export async function loadTips(pathname: string | null | undefined): Promise<Tip[]> {
  const list = await load(tipRoute(pathname));
  return list.length ? list : load("*");
}
