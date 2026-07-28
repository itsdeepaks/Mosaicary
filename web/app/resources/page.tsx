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
        "The migration will account for every source row and report invalid or duplicated data.",
        "The complete desktop and mobile reference views are still being prepared.",
      ]}
    />
  );
}
