import { NextResponse, type NextRequest } from "next/server";

import { resolveSafeAuthRedirectPath } from "@/lib/supabase/auth-callback";
import { inspectSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function redirectToAuth(request: NextRequest, status: string) {
  const destination = new URL("/auth", request.url);
  destination.searchParams.set("auth", status);

  return NextResponse.redirect(destination);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return redirectToAuth(request, "link-invalid");
  }

  if (inspectSupabasePublicConfig().state === "unconfigured") {
    return redirectToAuth(request, "unavailable");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectToAuth(request, "link-invalid");
  }

  const nextPath = resolveSafeAuthRedirectPath(
    request.nextUrl.searchParams.get("next"),
  );

  return NextResponse.redirect(new URL(nextPath, request.url));
}
