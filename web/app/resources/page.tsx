import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "Full reference",
};

export default function ResourcesPage() {
  return (
    <RoutePlaceholder
      eyebrow="Complete catalogue"
      title="The validated 295-entry catalogue is ready for its dense reference view."
      summary="The deterministic catalogue now accounts for every source row. This route remains intentionally simple until the desktop table, compact mobile rows, and filter layouts are implemented together."
      details={[
        "All 295 curated resources and 11 category counts are validated in repository-managed data.",
        "Access and subscription states preserve the researched source values without silent conversion.",
        "The final reference interface will not ship as a partial table or force desktop columns onto mobile.",
      ]}
    />
  );
}
