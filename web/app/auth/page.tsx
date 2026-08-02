import type { Metadata } from "next";

import { AuthShell } from "@/components/auth-shell/auth-shell";
import { readAuthCallbackStatus } from "@/lib/supabase/auth-callback";
import { inspectSupabasePublicConfig } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Tessli account access for cloud saves, private collections, and notes.",
  robots: {
    follow: false,
    index: false,
  },
};

type AuthPageProps = Readonly<{
  searchParams: Promise<{
    auth?: string | string[];
  }>;
}>;

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const configuration = inspectSupabasePublicConfig();
  const callbackStatus = readAuthCallbackStatus((await searchParams).auth);

  return (
    <AuthShell
      callbackStatus={callbackStatus}
      configurationState={configuration.state}
    />
  );
}
