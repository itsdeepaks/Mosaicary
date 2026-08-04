export interface PublicRepresentationHeadersInput {
  format: "json" | "markdown";
  filename: string;
  canonicalPath: string;
  jsonPath: string;
  markdownPath: string;
}

export const PUBLIC_SOURCE_REPRESENTATION_CONTRACT:
  "tessli.public-source.v1";
export const PUBLIC_COLLECTION_REPRESENTATION_CONTRACT:
  "tessli.public-collection.v1";

export function createPublicSourceRepresentation(
  profile: Record<string, unknown>,
): Record<string, any>;
export function createPublicCollectionRepresentation(
  collection: Record<string, unknown>,
  sourceProfiles: readonly Record<string, unknown>[],
): Record<string, any>;
export function serializePublicJson(value: unknown): string;
export function serializePublicSourceMarkdown(
  document: Record<string, any>,
): string;
export function serializePublicCollectionMarkdown(
  document: Record<string, any>,
): string;
export function createPublicRepresentationHeaders(
  input: PublicRepresentationHeadersInput,
): Record<string, string>;
export function createPublicOptionsHeaders(): Record<string, string>;
