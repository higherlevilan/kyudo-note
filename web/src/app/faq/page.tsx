import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/content/Blocks";
import FaqHub, { type HubFaq } from "@/components/faq/FaqHub";
import { CULTURE_FAQS } from "@/content/culture/faqs";
import { EQUIPMENT_FAQS } from "@/content/equipment/faqs";
import { ETIQUETTE_FAQS } from "@/content/etiquette/faqs";
import { GUIDE_FAQS } from "@/content/guide/faqs";
import { SHAGUSE_FAQS } from "@/content/shaguse/faqs";
import { FAQS as SHAHO_FAQS } from "@/content/shaho";
import { SOURCES as SHAHO_SOURCES } from "@/content/sources";
import type { Faq } from "@/content/types";

export const metadata: Metadata = pageMetadata({
  path: "/faq/",
  title: "問題研究中心",
  description:
    "弓道學習常見問題總整理：射法、禮法、裝備、入門、文化。每一題都標出依據（官方、指導書或坊間說法）並附資料來源。",
  og: "faq",
});

const MODULES: { key: string; label: string; href: string; faqs: Faq[] }[] = [
  { key: "guide", label: "入門指南", href: "/guide/", faqs: GUIDE_FAQS },
  {
    key: "shaho",
    label: "射法八節",
    href: "/shaho/",
    // The 射法八節 page cites by source key; resolve them to Source objects here.
    faqs: SHAHO_FAQS.map((f) => ({
      q: f.q,
      topic: "射法",
      a: f.a.map((p) => ({
        text: p.text,
        tag: p.tag === "demo" ? "note" : p.tag,
        src: p.src?.map((k) => SHAHO_SOURCES[k]),
      })),
    })),
  },
  { key: "shaguse", label: "射癖與矢所", href: "/shaguse/", faqs: SHAGUSE_FAQS },
  { key: "etiquette", label: "禮法與體配", href: "/etiquette/", faqs: ETIQUETTE_FAQS },
  { key: "equipment", label: "裝備百科", href: "/equipment/", faqs: EQUIPMENT_FAQS },
  { key: "culture", label: "文化與哲學", href: "/culture/", faqs: CULTURE_FAQS },
];

const ALL: HubFaq[] = MODULES.flatMap((m) =>
  m.faqs.map((f, i) => ({ ...f, id: `${m.key}-${i}`, module: m.key, moduleLabel: m.label, moduleHref: m.href })),
);

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <PageHeader kicker="問題研究中心" title="弓道常見問題" ja="問答">
        <p>
          各單元的常見問題集中在這裡，共 {ALL.length} 題。每個回答都標出依據：
          「官方」是全日本弓道連盟的規定或說明，「指導書」是日本武道協議會《少年少女武道指導書 弓道》，「坊間常見說法」則沒有官方出處。
          實際做法有差異時，請以所屬道場與指導者為準。
        </p>
      </PageHeader>
      <FaqHub faqs={ALL} modules={MODULES.map(({ key, label, href }) => ({ key, label, href }))} />
    </div>
  );
}
