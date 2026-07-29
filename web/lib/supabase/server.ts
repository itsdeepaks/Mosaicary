import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { readSupabasePublicConfig } from "./config";
import type { Database } from "./database.types";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { publishableKey, url } = readSupabasePublicConfig();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Slice 10.2 will add the
          // request proxy responsible for refreshing authenticated sessions.
        }
      },
    },
  });
}
