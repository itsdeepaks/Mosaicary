import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "Collections",
};

export default function CollectionsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Curated workflows"
      title="Collections are being assembled from real catalogue data."
      summary="Tessli collections will group useful resources around practical design and frontend tasks without inventing trends, curators, or popularity signals."
      details={[
        "Launch collection data will remain version-controlled in the repository.",
        "Initial collections will focus on practical workflows and reviewed source data.",
        "The complete browsing experience will replace this preview before public launch.",
      ]}
    />
  );
}
