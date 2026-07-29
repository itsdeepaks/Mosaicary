import type { ResourceCardData } from "@/components/resource-card/resource-card";

export const savedResourceStoreKey = "tessli-saved-resource-ids-v2";

const legacySaveKeys = [
  "tessli-saved-resources-v1",
  "mosaicary-saved-resources-v1",
] as const;

type BrowserStorage = Pick<Storage, "getItem" | "setItem">;

function uniqueStrings(values: readonly unknown[]) {
  return Array.from(
    new Set(
      values.filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0,
      ),
    ),
  );
}

function readArray(storage: BrowserStorage, key: string) {
  try {
    const stored = storage.getItem(key);
    const parsed = JSON.parse(stored ?? "null");
    return {
      exists: stored !== null && Array.isArray(parsed),
      values: Array.isArray(parsed) ? uniqueStrings(parsed) : [],
    };
  } catch {
    return { exists: false, values: [] };
  }
}

function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function resourceIdentifiers(resources: readonly ResourceCardData[]) {
  const identifiers = new Map<string, string>();

  for (const resource of resources) {
    identifiers.set(resource.id, resource.id);
    identifiers.set(resource.url, resource.id);
  }

  return identifiers;
}

function mapLegacyValues(
  values: readonly string[],
  identifiers: ReadonlyMap<string, string>,
) {
  return uniqueStrings(
    values.map((value) => identifiers.get(value)).filter(Boolean),
  );
}

export function readSavedResourceIds(resources: readonly ResourceCardData[]) {
  const storage = browserStorage();
  if (!storage) {
    return [];
  }

  const current = readArray(storage, savedResourceStoreKey);
  if (current.exists) {
    return current.values;
  }

  const identifiers = resourceIdentifiers(resources);
  const migrated = uniqueStrings(
    legacySaveKeys.flatMap((key) =>
      mapLegacyValues(readArray(storage, key).values, identifiers),
    ),
  );

  if (migrated.length > 0) {
    writeSavedResourceIds(migrated);
  }

  return migrated;
}

export function writeSavedResourceIds(resourceIds: readonly string[]) {
  const storage = browserStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(
      savedResourceStoreKey,
      JSON.stringify(uniqueStrings(resourceIds)),
    );
    return true;
  } catch {
    return false;
  }
}
