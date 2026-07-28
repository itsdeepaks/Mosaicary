import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Terms preview notice"
      title="Production terms will be published before the public cutover."
      summary="Tessli is an index for discovery and research. A listing is not an endorsement, licence grant, warranty, or permission to copy another product's design or content."
      details={[
        "Visitors remain responsible for checking destination terms, licences, pricing, and availability.",
        "Third-party services are operated independently from Tessli.",
        "Complete production terms will be reviewed and published before the public cutover.",
      ]}
    />
  );
}
