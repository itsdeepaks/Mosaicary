export interface PublicRepresentationHeadersInput {
  format: "json" | "markdown";
  filename: string;
  canonicalPath: string;
  jsonPath: string;
  markdownPath: string;
}

export interface PublicRepresentationLinks {
  json: string;
  markdown: string;
}

export interface PublicSourceDocument {
  contract: "tessli.public-source.v1";
  canonicalPath: string;
  representations: PublicRepresentationLinks;
  source: {
    contractVersion: number;
    id: string;
    slug: string;
    name: string;
    url: string;
    domain: string;
    summary: string;
    category: string;
    sourceType: string;
    sourceTypeBasis: string;
    accessModel: {
      access: string;
      subscriptionRequired: string;
    };
    profileLevel: string;
    status: string;
    verifiedAt: string | null;
    coverage: Record<string, unknown>;
    bestFor: readonly string[];
    capabilities: readonly string[];
    contentObjects: readonly string[];
    platforms: readonly string[];
    frameworks: readonly string[];
    integrationMethods: readonly string[];
    limitations: readonly string[];
    evidence: readonly Record<string, unknown>[];
    intelligence: Record<string, unknown> | null;
  };
  boundaries: readonly string[];
}

export interface PublicCollectionDocument {
  contract: "tessli.public-collection.v1";
  canonicalPath: string;
  representations: PublicRepresentationLinks;
  collection: {
    id: string;
    slug: string;
    title: string;
    description: string;
    status: string;
    lastReviewedAt: string;
    resourceCount: number;
  };
  resources: readonly {
    order: number;
    id: string;
    slug: string;
    name: string;
    url: string;
    domain: string;
    summary: string;
    category: string;
    sourceType: string;
    accessModel: {
      access: string;
      subscriptionRequired: string;
    };
    profileLevel: string;
    status: string;
    tessliPath: string;
    jsonPath: string;
    markdownPath: string;
  }[];
  boundaries: readonly string[];
}

export const PUBLIC_SOURCE_REPRESENTATION_CONTRACT: "tessli.public-source.v1";
export const PUBLIC_COLLECTION_REPRESENTATION_CONTRACT: "tessli.public-collection.v1";

export function createPublicSourceRepresentation(
  profile: unknown,
): PublicSourceDocument;
export function createPublicCollectionRepresentation(
  collection: unknown,
  sourceProfiles: readonly unknown[],
): PublicCollectionDocument;
export function serializePublicJson(value: unknown): string;
export function serializePublicSourceMarkdown(
  document: PublicSourceDocument,
): string;
export function serializePublicCollectionMarkdown(
  document: PublicCollectionDocument,
): string;
export function createPublicRepresentationHeaders(
  input: PublicRepresentationHeadersInput,
): Record<string, string>;
export function createPublicOptionsHeaders(): Record<string, string>;
