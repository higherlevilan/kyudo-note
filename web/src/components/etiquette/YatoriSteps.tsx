"use client";

// 矢取り的對答，一步一步看：用指導書第Ⅱ章的版本（YATORI 的第一個版本），每一行對答是一步，
// 「取箭 → 收赤旗」拆成兩步。俯視示意圖畫射場、矢道、的、看的所與赤旗；取箭的人用小圓盤表示。
// 看的所的位置依道場而不同（這裡放在安土左前方，和入門指南的射場圖一樣只是一例），矢道不按比例。

import Stepper from "@/components/course/Stepper";
import { Cites, TagBadge } from "@/components/content/Blocks";
import type { YatoriVersion } from "@/content/etiquette/sections";
import { ANKF, BUDOKAN, ET } from "@/content/etiquette/sources";
import type { Point } from "@/content/types";

type Who = "shajo" | "kanteki" | null;

interface Frame {
  /** index into version.lines */
  line: number;
  /** override of the line text when one line is split into two frames */
  title?: string;
  speaker: Who;
  /** Japanese call shown in the bubble */
  say?: string;
  flag: boolean;
  /** where the 取箭 discs are */
  people: "kanteki" | "mato";
  restart?: boolean;
  extra?: Point;
}

const FRAMES: Frame[] = [
  { line: 0, speaker: "shajo", say: "矢取り、お願いします", flag: false, people: "kanteki" },
  { line: 1, speaker: "kanteki", say: "矢取り入ります", flag: false, people: "kanteki" },
  { line: 2, speaker: null, flag: true, people: "kanteki", extra: { text: "赤旗掛出期間，射場不得取懸け。", tag: "guide", src: [BUDOKAN.ch4] } },
  { line: 3, speaker: "shajo", say: "お願いします", flag: true, people: "kanteki", extra: { text: "同一本指導書第Ⅳ章（町道場）的這一步寫成「矢取りしてください」。", tag: "guide", src: [BUDOKAN.ch4] } },
  {
    line: 4,
    title: "取箭",
    speaker: null,
    flag: true,
    people: "mato",
    extra: { text: "中靶的箭：左手按住靶，右手握住箭的根部，沿著箭的方向（矢筋）拔出。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5] },
  },
  {
    line: 4,
    title: "收赤旗",
    speaker: null,
    flag: false,
    people: "kanteki",
    extra: { text: "競技會：的前人員先掛赤旗、確認安全，才能進入的前與矢道；矢取り結束、安全確保後才撤旗。", tag: "official", src: [ANKF.playRules, ET.operation] },
  },
  { line: 5, speaker: "shajo", say: "始め", flag: false, people: "kanteki", restart: true },
];

const WHO_LABEL: Record<string, string> = { 射場: "射場", 看的: "看的", 動作: "動作" };

const MATO = [
  [130, 50],
  [210, 50],
] as const;
const KANTEKI: [number, number] = [50, 70];

function Bubble({ x, y, text, tone }: { x: number; y: number; text: string; tone: "indigo" | "wood" }) {
  const w = (text.length + 2) * 12 + 10;
  const box = tone === "indigo" ? "fill-surface stroke-indigo" : "fill-surface stroke-wood";
  return (
    <g key={text} className="course-pop" style={{ transformOrigin: `${x}px ${y}px` }}>
      <rect x={x - w / 2} y={y - 15} width={w} height={26} rx={13} className={box} strokeWidth={1.6} />
      <text lang="ja" x={x} y={y + 3} textAnchor="middle" className={tone === "indigo" ? "fill-indigo" : "fill-wood"} fontSize={12} fontWeight={700}>
        「{text}」
      </text>
    </g>
  );
}

function YatoriMap({ f }: { f: Frame }) {
  const shooting = f.flag ? "stop" : f.restart ? "go" : null;
  return (
    <svg viewBox="0 0 340 290" role="img" aria-label={`矢取り的俯視示意圖：${f.say ? `「${f.say}」` : f.title ?? ""}`} className="mx-auto block h-auto w-full max-w-md">
      <g fontSize={11.5}>
        {/* 安土・的 */}
        <rect x={100} y={8} width={232} height={26} rx={6} className="fill-wood-soft stroke-line" />
        <text x={326} y={25} textAnchor="end" className="fill-ink">
          安土
        </text>
        {MATO.map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={10} className="fill-surface stroke-ink" strokeWidth={2} />
            <circle cx={x} cy={y} r={4} className="fill-ink" />
          </g>
        ))}

        {/* 矢道 */}
        <rect x={100} y={64} width={232} height={140} className={f.people === "mato" ? "fill-vermilion/5 stroke-vermilion/50" : "fill-none stroke-line"} strokeDasharray="5 4" />
        <text x={216} y={140} textAnchor="middle" className="fill-muted" fontSize={10.5}>
          矢道（不按比例）
        </text>

        {/* 看的所 + 赤旗 */}
        <rect x={20} y={52} width={62} height={40} rx={6} className="fill-surface stroke-wood" strokeWidth={1.4} />
        <text x={51} y={108} textAnchor="middle" className="fill-wood" fontWeight={700}>
          看的所
        </text>
        <line x1={88} y1={50} x2={88} y2={118} className="stroke-ink" strokeWidth={2} />
        <g
          className="motion-safe:transition-[transform,opacity] motion-safe:duration-500"
          style={{ transform: f.flag ? "scaleY(1)" : "scaleY(0.05)", transformOrigin: "88px 50px", opacity: f.flag ? 1 : 0 }}
        >
          <rect x={89} y={50} width={30} height={22} className="fill-vermilion" />
        </g>
        <text x={92} y={132} className={f.flag ? "fill-vermilion" : "fill-muted"} fontSize={10.5} fontWeight={f.flag ? 700 : 400}>
          {f.flag ? "赤旗掛出" : "赤旗未掛"}
        </text>

        {/* 取箭的人 */}
        {[0, 1].map((k) => {
          const [x, y] = f.people === "mato" ? [MATO[k][0] - 16, MATO[k][1] + 24] : [KANTEKI[0] - 12 + k * 24, KANTEKI[1]];
          return (
            <g key={k} className="motion-safe:transition-transform motion-safe:duration-1000 motion-safe:ease-in-out" style={{ transform: `translate(${x}px, ${y}px)` }}>
              <circle r={7} className="fill-wood stroke-surface" strokeWidth={1.5} />
            </g>
          );
        })}

        {/* 射場 */}
        <rect x={100} y={214} width={232} height={44} rx={6} className="fill-surface-2 stroke-indigo" strokeWidth={1.4} />
        <text x={110} y={240} className="fill-indigo" fontWeight={700}>
          射場
        </text>
        {[150, 190, 230, 270, 310].map((x) => (
          <circle key={x} cx={x} cy={236} r={6} className="fill-surface stroke-ink" strokeWidth={1.6} />
        ))}

        {/* status */}
        {shooting === "stop" && (
          <g className="course-pop" style={{ transformOrigin: "216px 275px" }}>
            <rect x={100} y={264} width={232} height={22} rx={11} className="fill-vermilion/10 stroke-vermilion" />
            <text x={216} y={279} textAnchor="middle" className="fill-vermilion" fontSize={11} fontWeight={700}>
              赤旗掛著：射場不取懸け、不行射
            </text>
          </g>
        )}
        {shooting === "go" && (
          <g className="course-pop" style={{ transformOrigin: "216px 275px" }}>
            <rect x={100} y={264} width={232} height={22} rx={11} className="fill-indigo/10 stroke-indigo" />
            <text x={216} y={279} textAnchor="middle" className="fill-indigo" fontSize={11} fontWeight={700}>
              以「始め」的口令重新開始行射
            </text>
          </g>
        )}

        {/* who is speaking */}
        {f.speaker === "shajo" && f.say && <Bubble x={216} y={190} text={f.say} tone="indigo" />}
        {f.speaker === "kanteki" && f.say && <Bubble x={150} y={102} text={f.say} tone="wood" />}
      </g>
    </svg>
  );
}

export default function YatoriSteps({ version }: { version: YatoriVersion }) {
  // FRAMES are written against 指導書第Ⅱ章's six lines; anything else falls back to the list below
  if (version.id !== "guide2" || version.lines.length !== 6) return null;
  const steps = FRAMES.map((f) => {
    const l = version.lines[f.line];
    const who = WHO_LABEL[l.who] ?? l.who;
    const what = f.title ?? (l.ja ? `「${l.text}」` : l.text);
    return {
      title: `${who}：${what}`,
      text: f.extra ? (
        <>
          {f.extra.tag && <TagBadge tag={f.extra.tag} />}
          {f.extra.text}
          <Cites src={f.extra.src} />
        </>
      ) : undefined,
    };
  });

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <p className="mb-3 text-sm text-muted">
        <TagBadge tag={version.tag} />
        以{version.title}的版本，一步一步看射場與看的之間怎麼對答、赤旗什麼時候掛出與收回。
      </p>
      <Stepper steps={steps} label="矢取り的對答步驟" autoplayMs={3400}>
        {(i) => (
          <figure className="ill-plate rounded-xl p-2 sm:p-3">
            <YatoriMap f={FRAMES[i]} />
            <figcaption className="mt-1 px-1 text-xs leading-relaxed text-muted">
              俯視示意，不按比例；看的所的位置依道場而不同，這裡只是一例。小圓盤代表去取箭的人（人數只是示意）。口令各道場不同，以所屬道場為準。依據：
              {[BUDOKAN.ch2, BUDOKAN.ch4, ANKF.playRules].map((s, k) => (
                <span key={s.url}>
                  {k > 0 && "、"}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line hover:text-wood">
                    {s.label}
                  </a>
                </span>
              ))}
              。本站以程式繪製的示意圖。
            </figcaption>
          </figure>
        )}
      </Stepper>
    </div>
  );
}
