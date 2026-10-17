// Lazily created Supabase client. The library is loaded with a dynamic import only when
// sync is enabled at build time and the journal actually needs it.

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

let pending: Promise<SupabaseClient | null> | null = null;

export function getSupabase(): Promise<SupabaseClient | null> {
  if (!supabaseConfig || typeof window === "undefined") return Promise.resolve(null);
  if (!pending) {
    const { url, anonKey } = supabaseConfig;
    pending = import("@supabase/supabase-js")
      .then(({ createClient }) =>
        createClient(url, anonKey, {
          auth: {
            // Implicit flow: the magic link works even when the mail app opens it in another
            // browser than the one that requested it (PKCE would need the same browser).
            flowType: "implicit",
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: "kyudo-note:auth",
          },
        }),
      )
      .catch(() => {
        pending = null; // e.g. chunk failed to load offline; try again later
        return null;
      });
  }
  return pending;
}
