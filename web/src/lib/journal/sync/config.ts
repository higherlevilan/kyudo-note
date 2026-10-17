// Build-time switch for cloud sync. Next.js inlines NEXT_PUBLIC_* values at build time, so
// these must be read with literal `process.env.NAME` expressions. When either value is
// missing (e.g. the GitHub secrets are not set) the whole account/sync feature is off and
// no Supabase code is ever loaded.

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

function validUrl(u: string): boolean {
  try {
    const p = new URL(u);
    return p.protocol === "https:" || p.hostname === "localhost" || p.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export const SYNC_ENABLED = Boolean(url && anonKey && validUrl(url));

export const supabaseConfig = SYNC_ENABLED ? { url, anonKey } : null;

/** Where the magic link sends the user back to: the journal page, including the base path. */
export function journalRedirectUrl(): string {
  return `${window.location.origin}${basePath}/journal/`;
}
