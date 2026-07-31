import catalogue from "@/data/catalogue.json";
import { SavedResourcesExperience } from "@/components/saved-resources/saved-resources-experience";
import type {
  ResourceCardAccess,
  ResourceCardData,
} from "@/components/resource-card/resource-card";

export const metadata = {
  title: "Saved resources",
  description:
    "Private browser-local saves from Tessli's curated design-resource catalogue.",
};

const categoryLabels = Object.fromEntries(
  catalogue.categories.map((category) => [category.id, category.label]),
);

const resources: readonly ResourceCardData[] = catalogue.resources.map(
  (resource) => ({
    id: resource.id,
    slug: resource.slug,
    name: resource.name,
    url: resource.url,
    domain: resource.domain,
    description: resource.description,
    category: resource.category,
    access: resource.access as ResourceCardAccess,
    usefulFor: resource.usefulFor,
    tags: resource.tags,
    status: resource.status as ResourceCardData["status"],
    faviconUrl: resource.faviconUrl,
    previewImageUrl: resource.previewImageUrl,
    previewSource: resource.previewSource as ResourceCardData["previewSource"],
  }),
);

export default function SavedPage() {
  return (
    <main id="main-content">
      <SavedResourcesExperience
        categoryLabels={categoryLabels}
        resources={resources}
      />
    </main>
  );
}
