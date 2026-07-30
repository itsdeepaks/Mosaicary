import type { Metadata } from "next";

import { AuthShell } from "@/components/auth-shell/auth-shell";
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

export default function AuthPage() {
  const configuration = inspectSupabasePublicConfig();

  return <AuthShell configurationState={configuration.state} />;
}
