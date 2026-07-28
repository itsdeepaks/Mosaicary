import catalogue from "@/data/catalogue.json";
import { ExploreExperience } from "@/components/explore-discovery/explore-experience";
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

export const metadata = {
  title: "Explore design resources",
  description:
    "Discover a manually curated index of useful web and product design resources.",
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

const categoryIds = new Set(categoryOptions.map((category) => category.id));

type ExplorePageProps = {
  searchParams: Promise<DiscoverySearchParams>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const initialState = parseDiscoveryState(await searchParams, categoryIds);

  return (
    <main id="main-content">
      <ExploreExperience
        accessOptions={accessOptions}
        categories={categoryOptions}
        initialState={initialState}
      />
    </main>
  );
}
