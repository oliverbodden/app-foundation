import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Each app reads its own env vars (NEXT_PUBLIC_* on web, EXPO_PUBLIC_* on mobile)
 * and passes them in, so this package stays platform-neutral.
 * Returns null when not configured, so the apps still run before Supabase is set up.
 */
export function makeSupabase(
  url: string | undefined,
  anonKey: string | undefined,
  options?: Parameters<typeof createClient>[2]
): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, options);
}
