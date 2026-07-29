import type { ResourceCardData } from "@/components/resource-card/resource-card";
import type { DiscoveryState } from "@/components/explore-discovery/discovery-state";

export const explorePageSize = 48;

export type ExploreResultResource = Readonly<{
  resource: ResourceCardData;
  categoryLabel: string;
}>;

export type ExploreResultSet =
  | Readonly<{
      status: "ready";
      resources: readonly ExploreResultResource[];
    }>
  | Readonly<{
      status: "error";
      resources: readonly [];
    }>;

const nameCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

function normalizedSearchText(value: string) {
  return value.toLocaleLowerCase("en").replace(/\s+/g, " ").trim();
}

function searchTokens(query: string) {
  const normalized = normalizedSearchText(query);
  return normalized ? normalized.split(" ") : [];
}

function searchableText(resource: ResourceCardData, categoryLabel: string) {
  return normalizedSearchText(
    [
      resource.name,
      resource.domain,
      resource.description,
      categoryLabel,
      ...resource.usefulFor,
      ...resource.tags,
    ].join(" "),
  );
}

export function deriveExploreResults(
  resources: readonly ResourceCardData[],
  categoryLabels: ReadonlyMap<string, string>,
  state: DiscoveryState,
): ExploreResultSet {
  try {
    const tokens = searchTokens(state.query);
    const filtered = resources
      .map((resource, curatedIndex) => ({ resource, curatedIndex }))
      .filter(({ resource }) => {
        if (state.category && resource.category !== state.category) {
          return false;
        }
        if (
          state.access.length > 0 &&
          !state.access.includes(resource.access)
        ) {
          return false;
        }

        const categoryLabel =
          categoryLabels.get(resource.category) ?? resource.category;
        const haystack = searchableText(resource, categoryLabel);
        return tokens.every((token) => haystack.includes(token));
      });

    if (state.sort !== "curated") {
      const direction = state.sort === "name-desc" ? -1 : 1;
      filtered.sort((left, right) => {
        const nameOrder = nameCollator.compare(
          left.resource.name,
          right.resource.name,
        );
        return nameOrder === 0
          ? left.curatedIndex - right.curatedIndex
          : nameOrder * direction;
      });
    }

    return {
      status: "ready",
      resources: filtered.map(({ resource }) => ({
        resource,
        categoryLabel:
          categoryLabels.get(resource.category) ?? resource.category,
      })),
    };
  } catch {
    return { status: "error", resources: [] };
  }
}
