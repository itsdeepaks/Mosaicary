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
        "Collection schemas and reviewed launch data are owned by Slice 6.1.",
        "The complete collection browsing experience is owned by Slice 6.2.",
      ]}
    />
  );
}
