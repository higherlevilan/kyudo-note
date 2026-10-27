// Registry text for 小弓's bubbles may contain <b>, <i> and <br>. Everything else is escaped,
// so the result is safe for dangerouslySetInnerHTML. Existing entities (&amp; &#39; …) are kept.

const ALLOWED = /<(\/?)(b|i|br)\s*\/?>/gi;

function escapeText(s: string): string {
  return s
    .replace(/&(?!(?:#\d{1,7}|#x[0-9a-f]{1,6}|[a-z][a-z0-9]{1,31});)/gi, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escape all markup except bare <b>, </b>, <i>, </i> and <br>; unclosed tags are closed at the end. */
export function sanitizeSayHtml(html: string): string {
  let out = "";
  let last = 0;
  const open: string[] = [];
  for (const m of html.matchAll(ALLOWED)) {
    out += escapeText(html.slice(last, m.index));
    last = (m.index ?? 0) + m[0].length;
    const tag = m[2].toLowerCase();
    if (tag === "br") {
      out += "<br>";
    } else if (m[1]) {
      const i = open.lastIndexOf(tag);
      if (i >= 0) {
        // close anything opened inside it first, keeping the markup well-formed
        while (open.length > i) out += `</${open.pop()}>`;
      }
    } else {
      open.push(tag);
      out += `<${tag}>`;
    }
  }
  out += escapeText(html.slice(last));
  while (open.length) out += `</${open.pop()}>`;
  return out;
}

/** Plain text of a registry string (for aria-live announcements and titles). */
export function sayPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
