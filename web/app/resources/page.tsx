import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "Full reference",
};

export default function ResourcesPage() {
  return (
    <RoutePlaceholder
      eyebrow="Complete catalogue"
      title="The full reference will be built from the validated 295-entry source."
      summary="This route is reserved for Tessli's dense, searchable reference view. It will not display partial or manually duplicated catalogue data."
      details={[
        "The repository CSV remains the Phase 1 release source of truth.",
        "Typed migration and validation are owned by Slice 4.1.",
        "Desktop and responsive reference views are owned by Slices 7.1 and 7.2.",
      ]}
    />
  );
}
