import catalogue from "@/data/catalogue.json";
import type {
  ResourceCardAccess,
  ResourceCardData,
} from "@/components/resource-card/resource-card";

export type CollectionCoverStyle =
  | "editorial"
  | "typography"
  | "motion"
  | "systems";

export type CollectionResource = Readonly<{
  resource: ResourceCardData;
  categoryLabel: string;
}>;

export type PublishedCollection = Readonly<{
  id: string;
  slug: string;
  title: string;
  description: string;
  resourceIds: readonly string[];
  coverStyle: CollectionCoverStyle;
  lastReviewedAt: string;
  status: "published";
  resources: readonly CollectionResource[];
}>;

const resourceById = new Map(
  catalogue.resources.map((resource) => [resource.id, resource]),
);
const categoryLabelById = new Map(
  catalogue.categories.map((category) => [category.id, category.label]),
);

function toResourceCardData(
  resource: (typeof catalogue.resources)[number],
): ResourceCardData {
  return {
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
  };
}

function resolveCollection(
  collection: (typeof catalogue.collections)[number],
): PublishedCollection {
  const resources = collection.resourceIds.map((resourceId) => {
    const source = resourceById.get(resourceId);
    if (!source) {
      throw new Error(
        `Collection ${collection.slug} references missing resource ${resourceId}.`,
      );
    }

    return {
      resource: toResourceCardData(source),
      categoryLabel:
        categoryLabelById.get(source.category) ?? source.category,
    };
  });

  return {
    id: collection.id,
    slug: collection.slug,
    title: collection.title,
    description: collection.description,
    resourceIds: collection.resourceIds,
    coverStyle: collection.coverStyle as CollectionCoverStyle,
    lastReviewedAt: collection.lastReviewedAt,
    status: collection.status as "published",
    resources,
  };
}

const publishedCollections = catalogue.collections
  .filter((collection) => collection.status === "published")
  .map(resolveCollection);

export function getPublishedCollections(): readonly PublishedCollection[] {
  return publishedCollections;
}

export function getPublishedCollection(
  slug: string,
): PublishedCollection | null {
  return (
    publishedCollections.find((collection) => collection.slug === slug) ?? null
  );
}

export function formatCollectionReviewDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
