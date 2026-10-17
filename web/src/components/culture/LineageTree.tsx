// 流派系譜: nested-list tree. Connector style shows how well a link is documented.

import { Cites, TagBadge } from "@/components/content/Blocks";
import { EDGE_LABEL, LINEAGE, type Edge, type LineageNode } from "@/content/culture/lineage";

const LINE: Record<Edge, string> = {
  solid: "border-solid border-wood",
  legend: "border-dashed border-vermilion",
  gap: "border-dotted border-muted",
};

const LABEL_TONE: Record<Edge, string> = {
  solid: "text-wood",
  legend: "text-vermilion",
  gap: "text-muted",
};

function NodeCard({ n }: { n: LineageNode }) {
  const dashed = n.tag === "disputed";
  return (
    <div className={`rounded-xl border bg-surface p-3 ${dashed ? "border-dashed border-vermilion/60" : "border-line"}`}>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span lang="ja" className="font-semibold">
          {n.name}
        </span>
        {n.kana && (
          <span lang="ja" className="text-xs text-muted">
            {n.kana}
          </span>
        )}
        {n.tag && <TagBadge tag={n.tag} />}
      </p>
      {n.who && <p className="mt-0.5 text-sm text-ink">{n.who}</p>}
      {n.note && (
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {n.note}
          <Cites src={n.src} />
        </p>
      )}
      {!n.note && n.src && (
        <p className="text-sm">
          <Cites src={n.src} />
        </p>
      )}
    </div>
  );
}

function Branch({ nodes }: { nodes: readonly LineageNode[] }) {
  return (
    <ul className="mt-2 space-y-2">
      {nodes.map((c, i) => {
        const edge = c.edge ?? "solid";
        const last = i === nodes.length - 1;
        // Plain solid links need no caption; the legend explains them.
        const label = c.edgeLabel ?? (edge === "solid" ? undefined : EDGE_LABEL[edge]);
        const tick = label ? "top-[2.25rem]" : "top-[1.5rem]";
        const trunk = last ? (label ? "h-[2.875rem]" : "h-[2.125rem]") : "bottom-[-0.5rem]";
        return (
          <li key={c.id} className="relative pl-5 sm:pl-7">
            {/* vertical trunk + horizontal tick */}
            <span aria-hidden="true" className={`absolute top-[-0.5rem] left-2 border-l-2 ${LINE[edge]} ${trunk}`} />
            <span aria-hidden="true" className={`absolute left-2 w-3 border-t-2 sm:w-5 ${tick} ${LINE[edge]}`} />
            {label ? (
              <p className={`mb-1 text-[11px] leading-4 ${LABEL_TONE[edge]}`}>
                <span className="sr-only">與上一層的關係：</span>
                {label}
              </p>
            ) : (
              <p className="sr-only">與上一層的關係：{EDGE_LABEL[edge]}</p>
            )}
            <NodeCard n={c} />
            {c.children && c.children.length > 0 && <Branch nodes={c.children} />}
          </li>
        );
      })}
    </ul>
  );
}

function Legend() {
  return (
    <ul aria-label="圖例" className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
      {(Object.keys(EDGE_LABEL) as Edge[]).map((e) => (
        <li key={e} className="inline-flex items-center gap-2">
          <span aria-hidden="true" className={`inline-block w-8 border-t-2 ${LINE[e]}`} />
          <span>
            {e === "solid" ? "實線" : e === "legend" ? "虛線" : "點線"}＝{EDGE_LABEL[e]}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function LineageTree() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line bg-surface-2/60 p-4">
        <Legend />
        <p className="mt-2 text-sm leading-relaxed text-muted">
          這是主要流派的簡化系譜，不是完整的傳承表。紅框表示人物或流派本身的歸屬有爭議。
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {LINEAGE.map((g) => (
          <section
            key={g.id}
            aria-labelledby={`lin-${g.id}`}
            className={`rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5 ${g.id === "heki" ? "lg:row-span-2" : "lg:self-start"}`}
          >
            <h3 id={`lin-${g.id}`} className="text-lg font-bold">
              {g.title}
            </h3>
            <p className="mb-3 text-sm text-muted">{g.lead}</p>
            <ul className="space-y-3">
              {g.roots.map((r) => (
                <li key={r.id}>
                  <NodeCard n={r} />
                  {r.children && r.children.length > 0 && <Branch nodes={r.children} />}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
