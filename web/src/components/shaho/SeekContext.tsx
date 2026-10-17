"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type SeekRequest = { segmentId: string; nonce: number };

type SeekContextValue = {
  request: SeekRequest | null;
  seek: (segmentId: string) => void;
};

const SeekContext = createContext<SeekContextValue>({ request: null, seek: () => {} });

export const VIEWER_ID = "shaho-viewer";

/** Lets the article's 「在 3D 中看這一節」 buttons drive the viewer. */
export function SeekProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<SeekRequest | null>(null);
  const seek = useCallback((segmentId: string) => {
    setRequest((prev) => ({ segmentId, nonce: (prev?.nonce ?? 0) + 1 }));
    const el = document.getElementById(VIEWER_ID);
    if (el) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, []);
  const value = useMemo(() => ({ request, seek }), [request, seek]);
  return <SeekContext.Provider value={value}>{children}</SeekContext.Provider>;
}

export const useSeek = () => useContext(SeekContext);

export function JumpButton({ segmentId, children }: { segmentId: string; children: ReactNode }) {
  const { seek } = useSeek();
  return (
    <button
      type="button"
      onClick={() => seek(segmentId)}
      className="inline-flex items-center gap-1.5 rounded-full border border-wood/60 bg-surface px-3.5 py-1.5 text-sm text-ink transition-colors hover:bg-wood-soft"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current text-wood">
        <path d="M8 1 14 4.5v7L8 15 2 11.5v-7L8 1Zm0 1.7L3.5 5.3 8 7.9l4.5-2.6L8 2.7ZM3 6.2v4.7l4.5 2.6V8.8L3 6.2Zm10 0L8.5 8.8v4.7l4.5-2.6V6.2Z" />
      </svg>
      {children}
    </button>
  );
}
