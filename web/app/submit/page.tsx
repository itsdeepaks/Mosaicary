import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "Submit a resource",
};

export default function SubmitPage() {
  return (
    <RoutePlaceholder
      eyebrow="Community contribution"
      title="Resource submissions will open with moderation safeguards."
      summary="Tessli will accept useful additions only after server validation, duplicate detection, rate limits, moderation ownership, and contribution status are implemented."
      details={[
        "No public form is collecting personal data in this preview.",
        "Accepted catalogue changes remain reviewable and attributable.",
        "The complete submission workflow is owned by Slices 12.1 and 12.2.",
      ]}
    />
  );
}
