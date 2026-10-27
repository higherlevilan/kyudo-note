"use client";

// 「弓與禪」的傳話路線: the six links of ZEN_FLOW (阿波研造 → 小町谷操三 → Herrigel → 德文著作 →
// 英譯 → 日譯) as a relay, with a note travelling along it. Every caption restates ZEN_FLOW and
// the 山田奨治 section (ZEN) on this page; the 「それでした」 → 「es」 step is a hypothesis
// (Feliks Hoff, supported by 山田) and is labelled as such.

import Stepper from "@/components/course/Stepper";
import { Cites, TagBadge } from "@/components/content/Blocks";
import { useProgress } from "@/components/shaguse/anim";
import { ZEN_FLOW } from "@/content/culture/sections";
import { CS } from "@/content/culture/sources";
import type { Tag } from "@/content/types";

/** Node positions (two rows of three, read like a Z). */
const POS: [number, number][] = [
  [58, 42],
  [165, 42],
  [272, 42],
  [272, 128],
  [165, 128],
  [58, 128],
];

interface Extra {
  /** what is being passed along at this link */
  note: string;
  text: string;
  tag?: Tag;
}

const EXTRA: Extra[] = [
  {
    note: "「それでした」？",
    text: "有一種假說（德國弓道連盟前會長 Feliks Hoff 提出，山田奨治支持）：Herrigel 射得好時，阿波可能只是說了「それでした」（就是這樣）。",
    tag: "research",
  },
  { note: "意譯…", text: "遇到難以翻譯的話時，會用「一射絶命、百發聖射」之類的說法帶過。", tag: "research" },
  { note: "「es」＝它？", text: "翻成德文後，「es」可能被理解成超越自我的「它」（同一個假說）。", tag: "research" },
  { note: "Zen in der Kunst…", text: "山田的自我修正：1936 年德文論文其實有兩處提到「es」，只是沒有發揮。", tag: "research" },
  { note: "“It shoots”", text: "英譯本讓「弓與禪」的形象在西方傳開。" },
  { note: "《弓と禅》", text: "所以弓道和禪的強烈連結，主要是二戰後、尤其 1956 年日譯本出版以後才形成的；說兩者「完全無關」也過頭了。", tag: "research" },
];

const RED = "var(--vermilion)";

function Relay({ i }: { i: number }) {
  const p = useProgress(i, 800);
  const a = POS[Math.max(0, i - 1)];
  const b = POS[i];
  const e = 1 - Math.pow(1 - p, 3);
  const nx = a[0] + (b[0] - a[0]) * e;
  const ny = a[1] + (b[1] - a[1]) * e;
  const note = EXTRA[i].note;
  return (
    <figure className="ill-plate rounded-xl p-2 sm:p-3">
      <svg viewBox="0 0 330 178" className="block h-auto w-full" role="img" aria-label={`傳話路線第 ${i + 1} 站：${ZEN_FLOW[i].who}，${ZEN_FLOW[i].what}`}>
        {POS.slice(1).map((q, k) => {
          const pr = POS[k];
          const done = k + 1 <= i;
          return <path key={k} d={`M${pr[0]} ${pr[1]}L${q[0]} ${q[1]}`} stroke={done ? "var(--wood)" : "var(--line)"} strokeWidth={done ? 2.2 : 1.6} strokeDasharray={done ? undefined : "4 4"} />;
        })}
        {ZEN_FLOW.map((n, k) => {
          const [x, y] = POS[k];
          const on = k === i;
          return (
            <g key={n.who}>
              <rect x={x - 44} y={y - 15} width={88} height={30} rx={8} fill={on ? "var(--wood-soft)" : "var(--surface)"} stroke={on ? "var(--wood)" : k < i ? "var(--wood)" : "var(--line)"} strokeWidth={on ? 1.8 : 1.1} />
              <text x={x} y={y + 4.5} fontSize={12.5} textAnchor="middle" fill={k <= i ? "var(--ink)" : "var(--muted)"} fontWeight={on ? 700 : 400}>
                {n.who}
              </text>
            </g>
          );
        })}
        {/* the travelling note */}
        <g transform={`translate(${nx.toFixed(1)} ${(ny - 27).toFixed(1)})`}>
          <rect x={-56} y={-13} width={112} height={20} rx={10} fill="#fffbf3" stroke={RED} strokeWidth={1.2} />
          <text y={1.5} fontSize={11.5} textAnchor="middle" fill={RED}>
            {note}
          </text>
        </g>
      </svg>
      <figcaption className="mt-1 px-1 text-xs leading-5 text-muted">依山田奨治（2001）整理；圖中的「話」只是示意，引號內的詞是研究者的推測或書名。</figcaption>
    </figure>
  );
}

export default function ZenRelay() {
  return (
    <Stepper
      label="弓與禪的傳話路線"
      autoplayMs={4200}
      steps={ZEN_FLOW.map((n, k) => ({
        title: n.who,
        text: (
          <>
            {n.what}。{EXTRA[k].tag && <TagBadge tag={EXTRA[k].tag!} />}
            {EXTRA[k].text}
            <Cites src={[CS.yamada]} />
          </>
        ),
      }))}
    >
      {(i) => <Relay i={i} />}
    </Stepper>
  );
}
