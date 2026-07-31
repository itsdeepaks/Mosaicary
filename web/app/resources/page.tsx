import catalogue from "@/data/catalogue.json";
import type {
  DiscoveryAccessOption,
  DiscoveryCategoryOption,
} from "@/components/explore-discovery/discovery-options";
import {
  discoveryAccessValues,
  parseDiscoveryState,
  type DiscoveryAccess,
  type DiscoverySearchParams,
} from "@/components/explore-discovery/discovery-state";
import { FullReferenceExperience } from "@/components/full-reference/full-reference-experience";
import type {
  ResourceCardAccess,
  ResourceCardData,
} from "@/components/resource-card/resource-card";

export const metadata = {
  title: "Full Reference",
  description:
    "Browse Tessli's complete validated design-resource catalogue in a dense desktop reference view.",
};

const accessLabels: Record<DiscoveryAccess, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "Open source",
  "free-trial": "Free trial",
};

const categoryCounts = new Map<string, number>();
const accessCounts = new Map<DiscoveryAccess, number>();

for (const resource of catalogue.resources) {
  categoryCounts.set(
    resource.category,
    (categoryCounts.get(resource.category) ?? 0) + 1,
  );
  const access = resource.access as DiscoveryAccess;
  accessCounts.set(access, (accessCounts.get(access) ?? 0) + 1);
}

const categoryOptions: readonly DiscoveryCategoryOption[] =
  catalogue.categories.map((category) => ({
    id: category.id,
    label: category.shortLabel,
    fullLabel: category.label,
    count: categoryCounts.get(category.id) ?? 0,
  }));

const accessOptions: readonly DiscoveryAccessOption[] =
  discoveryAccessValues.map((value) => ({
    value,
    label: accessLabels[value],
    count: accessCounts.get(value) ?? 0,
  }));

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

const categoryIds = new Set(categoryOptions.map((category) => category.id));

type FullReferencePageProps = Readonly<{
  searchParams: Promise<DiscoverySearchParams>;
}>;

export default async function ResourcesPage({
  searchParams,
}: FullReferencePageProps) {
  const initialState = parseDiscoveryState(await searchParams, categoryIds);

  return (
    <main id="main-content">
      <FullReferenceExperience
        accessOptions={accessOptions}
        categories={categoryOptions}
        initialState={initialState}
        resources={resources}
      />
    </main>
  );
}
