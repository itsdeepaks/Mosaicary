import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "Curation process",
};

export default function CurationPage() {
  return (
    <RoutePlaceholder
      eyebrow="How resources are selected"
      title="Curation favours usefulness, clarity, and maintainable truth."
      summary="Resources are reviewed as references, tools, libraries, or learning sources. Tessli does not treat a URL count, visual novelty, or AI-generated description as evidence of quality."
      details={[
        "Descriptions should explain what a resource is useful for before a visitor opens it.",
        "Access, licensing, pricing, and availability must be verified at the original source.",
        "A complete correction, review, and takedown process will be published before launch.",
      ]}
    />
  );
}
