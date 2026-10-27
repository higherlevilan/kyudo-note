// 真實照片列：手機上左右滑動、寬螢幕排成格狀；全長的弓、箭這類細長照片自己佔一整列。
// 每張照片底下都有作者、授權與 Wikimedia Commons 原始頁面（CC BY / BY-SA 要求的標示）。

import { PHOTOS, type Photo, type PhotoId } from "@/content/photos";
import { BASE_PATH } from "@/lib/seo";

function Credit({ p }: { p: Photo }) {
  const link = "underline decoration-line hover:text-wood";
  return (
    <span className="mt-1 block text-[11px] leading-snug text-muted">
      照片：
      <a href={p.pageUrl} target="_blank" rel="noopener noreferrer" className={link}>
        {p.author}
      </a>
      ・
      {p.licenseUrl ? (
        <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer" className={link}>
          {p.license}
        </a>
      ) : (
        p.license
      )}
      ・Wikimedia Commons{p.changes && `（${p.changes}）`}
    </span>
  );
}

function Item({ p, wide }: { p: Photo; wide: boolean }) {
  return (
    <figure className={wide ? "w-full" : "w-[78%] shrink-0 snap-start sm:w-auto"}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
      <img
        src={`${BASE_PATH}/photos/${p.file}`}
        width={p.width}
        height={p.height}
        alt={p.alt}
        loading="lazy"
        decoding="async"
        className={`block w-full rounded-lg border border-line bg-surface-2 ${wide ? "h-auto" : "aspect-[4/3] object-cover"}`}
      />
      <figcaption className="mt-1.5 text-sm leading-relaxed text-ink">
        {p.caption}
        <Credit p={p} />
      </figcaption>
    </figure>
  );
}

export default function PhotoStrip({ ids, title = "實物照片", className = "" }: { ids: PhotoId[]; title?: string; className?: string }) {
  const photos = ids.map((id) => PHOTOS[id] as Photo);
  const wide = photos.filter((p) => p.width / p.height > 3);
  const rest = photos.filter((p) => p.width / p.height <= 3);
  return (
    <div className={`rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6 ${className}`}>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      {wide.length > 0 && (
        <div className="mb-4 space-y-4">
          {wide.map((p) => (
            <Item key={p.file} p={p} wide />
          ))}
        </div>
      )}
      {rest.length > 0 && (
        <div className={`-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 ${rest.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
          {rest.map((p) => (
            <Item key={p.file} p={p} wide={false} />
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-muted">照片皆為可自由再利用的授權，點作者名稱可看原始頁面。實物的樣式依廠牌、流派而不同。</p>
    </div>
  );
}
