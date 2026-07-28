import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <RoutePlaceholder
      eyebrow="About Tessli"
      title="A calmer way to find useful design resources."
      summary="Tessli is a manually curated index for designers, frontend developers, product builders, and small teams that need useful references without another noisy feed."
      details={[
        "The public catalogue begins with 295 repository-managed resources across 11 categories.",
        "Tessli links to original destinations instead of mirroring or redistributing their content.",
        "A fuller About and policy narrative will replace this preview before public launch.",
      ]}
    />
  );
}
