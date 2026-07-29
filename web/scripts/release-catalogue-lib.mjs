import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildCatalogue,
  CATALOGUE_PATH,
  REPORT_PATH,
} from "./catalogue-lib.mjs";

export { CATALOGUE_PATH, REPORT_PATH };

export const COLLECTION_SOURCE_PATH =
  "lib_data/tessli-launch-collections.json";
export const COLLECTION_SCHEMA_PATH = "schemas/collections.schema.json";

function repoRootFromModule() {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), "../..");
}

function issue(code, message, details = {}) {
  return { code, message, ...details };
}

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function objectShapeIssues(value, requiredKeys, allowedKeys, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [issue("invalid-shape", `${label} must be an object.`)];
  }

  const missingKeys = requiredKeys.filter((key) => !Object.hasOwn(value, key));
  const unexpectedKeys = Object.keys(value).filter(
    (key) => !allowedKeys.includes(key),
  );
  const issues = [];

  if (missingKeys.length > 0) {
    issues.push(
      issue("missing-keys", `${label} is missing required keys.`, {
        keys: missingKeys,
      }),
    );
  }
  if (unexpectedKeys.length > 0) {
    issues.push(
      issue("unexpected-keys", `${label} has unexpected keys.`, {
        keys: unexpectedKeys,
      }),
    );
  }

  return issues;
}

function validIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function validBoundedString(value, schema) {
  return (
    typeof value === "string" &&
    value.trim().length >= (schema.minLength ?? 0) &&
    value.length <= (schema.maxLength ?? Number.POSITIVE_INFINITY)
  );
}

export function validateCollectionSource(source, schema, resources) {
  const errors = [];
  const sourceShape = objectShapeIssues(
    source,
    schema.required,
    Object.keys(schema.properties),
    "Collection source",
  );
  errors.push(...sourceShape);

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return errors;
  }

  if (source.version !== schema.properties.version.const) {
    errors.push(
      issue(
        "collection-version",
        "Collection source version does not match the schema constant.",
      ),
    );
  }

  if (!Array.isArray(source.collections)) {
    errors.push(
      issue("collection-array", "Collection source collections must be an array."),
    );
    return errors;
  }

  const collectionArraySchema = schema.properties.collections;
  if (
    source.collections.length < collectionArraySchema.minItems ||
    source.collections.length > collectionArraySchema.maxItems
  ) {
    errors.push(
      issue(
        "collection-count",
        `Collection source must contain exactly ${collectionArraySchema.minItems} collections.`,
        {
          expected: collectionArraySchema.minItems,
          actual: source.collections.length,
        },
      ),
    );
  }

  const identifierPattern = new RegExp(schema.$defs.identifier.pattern);
  const collectionSchema = schema.$defs.collection;
  const resourceIdSchema = collectionSchema.properties.resourceIds;
  const coverStyles = new Set(collectionSchema.properties.coverStyle.enum);
  const publishedStatus = collectionSchema.properties.status.const;
  const availableResourceIds = new Set(resources.map((resource) => resource.id));
  const collectionIds = new Set();
  const collectionSlugs = new Set();

  for (const [index, collection] of source.collections.entries()) {
    const label = `Collection ${collection?.id ?? index + 1}`;
    errors.push(
      ...objectShapeIssues(
        collection,
        collectionSchema.required,
        Object.keys(collectionSchema.properties),
        label,
      ),
    );

    if (!collection || typeof collection !== "object" || Array.isArray(collection)) {
      continue;
    }

    if (!identifierPattern.test(collection.id ?? "")) {
      errors.push(
        issue("collection-id", `${label} has an invalid identifier.`, {
          value: collection.id,
        }),
      );
    } else if (collectionIds.has(collection.id)) {
      errors.push(
        issue("duplicate-collection-id", `Duplicate collection ID: ${collection.id}.`),
      );
    }
    collectionIds.add(collection.id);

    if (!identifierPattern.test(collection.slug ?? "")) {
      errors.push(
        issue("collection-slug", `${label} has an invalid slug.`, {
          value: collection.slug,
        }),
      );
    } else if (collectionSlugs.has(collection.slug)) {
      errors.push(
        issue(
          "duplicate-collection-slug",
          `Duplicate collection slug: ${collection.slug}.`,
        ),
      );
    }
    collectionSlugs.add(collection.slug);

    for (const field of ["title", "description"]) {
      if (
        !validBoundedString(
          collection[field],
          collectionSchema.properties[field],
        )
      ) {
        errors.push(
          issue(
            `collection-${field}`,
            `${label} has an invalid ${field}.`,
          ),
        );
      }
    }

    if (!Array.isArray(collection.resourceIds)) {
      errors.push(
        issue(
          "collection-resource-array",
          `${label} resourceIds must be an array.`,
        ),
      );
    } else {
      if (
        collection.resourceIds.length < resourceIdSchema.minItems ||
        collection.resourceIds.length > resourceIdSchema.maxItems
      ) {
        errors.push(
          issue(
            "collection-resource-count",
            `${label} must contain between ${resourceIdSchema.minItems} and ${resourceIdSchema.maxItems} resources.`,
            { actual: collection.resourceIds.length },
          ),
        );
      }

      const memberIds = new Set();
      for (const resourceId of collection.resourceIds) {
        if (!identifierPattern.test(resourceId)) {
          errors.push(
            issue(
              "collection-resource-id",
              `${label} contains an invalid resource ID.`,
              { resourceId },
            ),
          );
        }
        if (memberIds.has(resourceId)) {
          errors.push(
            issue(
              "duplicate-collection-member",
              `${label} contains a duplicate resource ID.`,
              { resourceId },
            ),
          );
        }
        if (!availableResourceIds.has(resourceId)) {
          errors.push(
            issue(
              "unknown-collection-resource",
              `${label} references a resource that is not in the catalogue.`,
              { resourceId },
            ),
          );
        }
        memberIds.add(resourceId);
      }
    }

    if (!coverStyles.has(collection.coverStyle)) {
      errors.push(
        issue(
          "collection-cover-style",
          `${label} has an invalid cover style.`,
          { value: collection.coverStyle },
        ),
      );
    }
    if (!validIsoDate(collection.lastReviewedAt)) {
      errors.push(
        issue(
          "collection-review-date",
          `${label} has an invalid last-reviewed date.`,
          { value: collection.lastReviewedAt },
        ),
      );
    }
    if (collection.status !== publishedStatus) {
      errors.push(
        issue(
          "collection-status",
          `${label} must use the published launch status.`,
          { value: collection.status },
        ),
      );
    }
  }

  return errors;
}

export function prepareCollectionComposition(
  source,
  schema,
  resources,
  initialErrors = [],
) {
  const errors = [...initialErrors];
  if (source) {
    errors.push(...validateCollectionSource(source, schema, resources));
  }

  const sourceCollections = Array.isArray(source?.collections)
    ? source.collections
    : [];

  return {
    errors,
    sourceCollections,
    collections: errors.length === 0 ? sourceCollections : [],
  };
}

export async function buildReleaseCatalogue(options = {}) {
  const root = options.root ?? repoRootFromModule();
  const base = await buildCatalogue({ root });
  const collectionSourcePath = path.join(root, COLLECTION_SOURCE_PATH);
  const collectionSchemaPath = path.join(root, COLLECTION_SCHEMA_PATH);
  const [collectionSourceBuffer, collectionSchemaText] = await Promise.all([
    readFile(collectionSourcePath),
    readFile(collectionSchemaPath, "utf8"),
  ]);
  const collectionSourceSha256 = createHash("sha256")
    .update(collectionSourceBuffer)
    .digest("hex");
  const collectionSchema = JSON.parse(collectionSchemaText);
  const parseErrors = [];
  let collectionSource = null;

  try {
    collectionSource = JSON.parse(collectionSourceBuffer.toString("utf8"));
  } catch (error) {
    parseErrors.push(
      issue("collection-json", "Collection source is not valid JSON.", {
        reason: error instanceof Error ? error.message : "Unknown JSON error",
      }),
    );
  }

  const composition = prepareCollectionComposition(
    collectionSource,
    collectionSchema,
    base.catalogue.resources,
    parseErrors,
  );
  const catalogue = {
    ...base.catalogue,
    collections: composition.collections,
  };
  const collectionItems = composition.collections.reduce(
    (sum, collection) => sum + collection.resourceIds.length,
    0,
  );
  const report = {
    ...base.report,
    collectionSource: {
      path: COLLECTION_SOURCE_PATH,
      sha256: collectionSourceSha256,
      collectionCount: composition.sourceCollections.length,
    },
    summary: {
      ...base.report.summary,
      collections: composition.collections.length,
      collectionItems,
    },
    collections: composition.collections.map((collection) => ({
      id: collection.id,
      slug: collection.slug,
      resourceCount: collection.resourceIds.length,
      status: collection.status,
      lastReviewedAt: collection.lastReviewedAt,
    })),
    issues: {
      errors: [...base.report.issues.errors, ...composition.errors],
      warnings: base.report.issues.warnings,
    },
  };

  return {
    catalogue,
    report,
    catalogueText: serialize(catalogue),
    reportText: serialize(report),
  };
}
