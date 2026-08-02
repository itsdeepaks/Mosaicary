import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { inspectSupabasePublicConfig } from "./config";
import type { Database } from "./database.types";

/**
 * Refreshes a cookie-backed Supabase session before an auth route renders.
 *
 * This intentionally does not decide whether a visitor may access a route.
 * Later account routes must verify claims themselves before reading user data.
 */
export async function updateSupabaseSession(request: NextRequest) {
  const configuration = inspectSupabasePublicConfig();
  let response = NextResponse.next({ request });

  if (configuration.state === "unconfigured") {
    return response;
  }

  const supabase = createServerClient<Database>(
    configuration.config.url,
    configuration.config.publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, options, value }) => {
            response.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([name, value]) => {
            response.headers.set(name, value);
          });
        },
      },
    },
  );

  // Keep this immediately after client creation. It verifies identity and lets
  // Supabase rotate cookies before a Server Component receives the request.
  await supabase.auth.getClaims();

  return response;
}
