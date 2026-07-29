"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";
import { readSupabasePublicConfig } from "./config";

export function createSupabaseBrowserClient() {
  const { publishableKey, url } = readSupabasePublicConfig();

  return createBrowserClient<Database>(url, publishableKey);
}
