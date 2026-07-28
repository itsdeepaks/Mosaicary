import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <RoutePlaceholder
      eyebrow="Privacy preview notice"
      title="This application preview does not introduce account tracking."
      summary="The isolated Next.js preview currently has no authentication, analytics provider, optional cookies, form submission, or cloud user-data storage. This is not the final production privacy policy."
      details={[
        "Browser-local saves will be documented when their production implementation exists.",
        "Account and cloud-data disclosures begin only after Supabase integration is approved.",
        "The complete production privacy policy is owned by Slice 9.1 and must match actual behaviour.",
      ]}
    />
  );
}
