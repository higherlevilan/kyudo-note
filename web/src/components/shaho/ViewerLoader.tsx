"use client";

import dynamic from "next/dynamic";

function ViewerPlaceholder() {
  return (
    <div className="flex h-[min(62vh,600px)] min-h-[360px] items-center justify-center rounded-2xl border border-line bg-[radial-gradient(var(--stage-a),var(--stage-b))] text-sm text-muted">
      3D 人形載入中…
    </div>
  );
}

const ShahoViewer = dynamic(() => import("./ShahoViewer"), { ssr: false, loading: ViewerPlaceholder });

export default function ViewerLoader({ dataUrl }: { dataUrl: string }) {
  return <ShahoViewer dataUrl={dataUrl} />;
}
