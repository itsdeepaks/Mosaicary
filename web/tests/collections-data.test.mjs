import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildReleaseCatalogue,
  COLLECTION_SCHEMA_PATH,
  COLLECTION_SOURCE_PATH,
  prepareCollectionComposition,
  validateCollectionSource,
} from "../scripts/release-catalogue-lib.mjs";
import { sourceProvenanceSha256 } from "../scripts/catalogue-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");

let cachedRelease;
async function releaseBuild() {
  cachedRelease ??= buildReleaseCatalogue({ root: repoRoot });
  return cachedRelease;
}

async function collectionInputs() {
  const [sourceBuffer, schemaText] = await Promise.all([
    readFile(path.join(repoRoot, COLLECTION_SOURCE_PATH)),
    readFile(path.join(repoRoot, COLLECTION_SCHEMA_PATH), "utf8"),
  ]);

  return {
    sourceBuffer,
    source: JSON.parse(sourceBuffer.toString("utf8")),
    schema: JSON.parse(schemaText),
  };
}

test("release catalogue contains the six approved published launch collections", async () => {
  const { catalogue, report } = await releaseBuild();

  assert.equal(report.issues.errors.length, 0);
  assert.equal(catalogue.collections.length, 6);
  assert.equal(report.summary.collections, 6);
  assert.equal(report.summary.collectionItems, 60);
  assert.deepEqual(
    catalogue.collections.map((collection) => collection.slug),
    [
      "saas-landing-pages",
      "typography-font-tools",
      "motion-starter-pack",
      "open-source-ui-libraries",
      "accessible-colour-tools",
      "design-systems-worth-studying",
    ],
  );

  for (const collection of catalogue.collections) {
    assert.equal(collection.status, "published");
    assert.equal(collection.lastReviewedAt, "2026-07-29");
    assert.equal(collection.resourceIds.length, 10);
    assert.equal(new Set(collection.resourceIds).size, 10);
    assert.equal(Object.hasOwn(collection, "curator"), false);
  }
});

test("launch collection membership matches each collection's stated workflow", async () => {
  const { catalogue } = await releaseBuild();
  const resources = new Map(
    catalogue.resources.map((resource) => [resource.id, resource]),
  );
  const collections = new Map(
    catalogue.collections.map((collection) => [collection.slug, collection]),
  );

  const assertMembers = (slug, predicate) => {
    const collection = collections.get(slug);
    assert.ok(collection, `Missing collection: ${slug}`);

    for (const resourceId of collection.resourceIds) {
      const resource = resources.get(resourceId);
      assert.ok(resource, `${slug} references unknown resource ${resourceId}`);
      assert.equal(resource.status, "active");
      assert.equal(
        predicate(resource),
        true,
        `${resource.name} does not match ${slug}`,
      );
    }
  };

  assertMembers(
    "saas-landing-pages",
    (resource) => resource.category === "landing-marketing",
  );
  assertMembers(
    "typography-font-tools",
    (resource) => resource.category === "typography",
  );
  assertMembers(
    "motion-starter-pack",
    (resource) => resource.category === "motion-3d",
  );
  assertMembers(
    "open-source-ui-libraries",
    (resource) =>
      resource.category === "ui-libraries" && resource.access === "open-source",
  );
  assertMembers(
    "accessible-colour-tools",
    (resource) => resource.category === "color-accessibility",
  );
  assertMembers(
    "design-systems-worth-studying",
    (resource) => resource.category === "design-systems",
  );
});

test("collection source provenance is deterministic and separate from CSV provenance", async () => {
  const [{ catalogue, report }, { sourceBuffer, source }] = await Promise.all([
    releaseBuild(),
    collectionInputs(),
  ]);
  const sourceSha256 = sourceProvenanceSha256(sourceBuffer);

  assert.deepEqual(catalogue.collections, source.collections);
  assert.equal(report.source.path, "lib_data/design-resource-library-295.csv");
  assert.equal(report.source.rowCount, 295);
  assert.deepEqual(report.collectionSource, {
    path: COLLECTION_SOURCE_PATH,
    sha256: sourceSha256,
    collectionCount: 6,
  });
  assert.match(report.collectionSource.sha256, /^[a-f0-9]{64}$/);
});

test("collection source validator rejects duplicate and unknown relationships", async () => {
  const [{ catalogue }, { source, schema }] = await Promise.all([
    releaseBuild(),
    collectionInputs(),
  ]);
  const invalid = structuredClone(source);
  invalid.collections[1].id = invalid.collections[0].id;
  invalid.collections[2].slug = invalid.collections[0].slug;
  invalid.collections[3].resourceIds[1] = invalid.collections[3].resourceIds[0];
  invalid.collections[4].resourceIds[0] = "resource-does-not-exist";

  const codes = new Set(
    validateCollectionSource(invalid, schema, catalogue.resources).map(
      (error) => error.code,
    ),
  );

  assert.equal(codes.has("duplicate-collection-id"), true);
  assert.equal(codes.has("duplicate-collection-slug"), true);
  assert.equal(codes.has("duplicate-collection-member"), true);
  assert.equal(codes.has("unknown-collection-resource"), true);
});

test("collection source validator rejects malformed launch metadata", async () => {
  const [{ catalogue }, { source, schema }] = await Promise.all([
    releaseBuild(),
    collectionInputs(),
  ]);
  const invalid = structuredClone(source);
  invalid.collections[0].lastReviewedAt = "2026-02-30";
  invalid.collections[1].coverStyle = "gradient";
  invalid.collections[2].status = "draft";
  invalid.collections[3].resourceIds = invalid.collections[3].resourceIds.slice(
    0,
    7,
  );
  invalid.collections[4].curator = { name: "Imaginary curator" };

  const codes = new Set(
    validateCollectionSource(invalid, schema, catalogue.resources).map(
      (error) => error.code,
    ),
  );

  assert.equal(codes.has("collection-review-date"), true);
  assert.equal(codes.has("collection-cover-style"), true);
  assert.equal(codes.has("collection-status"), true);
  assert.equal(codes.has("collection-resource-count"), true);
  assert.equal(codes.has("unexpected-keys"), true);
});

test("invalid collection source reports errors and publishes no collections", async () => {
  const [{ catalogue }, { source, schema }] = await Promise.all([
    releaseBuild(),
    collectionInputs(),
  ]);
  const invalid = structuredClone(source);
  invalid.collections[0].resourceIds = null;

  const composition = prepareCollectionComposition(
    invalid,
    schema,
    catalogue.resources,
  );

  assert.equal(composition.errors.length > 0, true);
  assert.equal(composition.sourceCollections.length, 6);
  assert.deepEqual(composition.collections, []);
  assert.equal(
    composition.errors.some(
      (error) => error.code === "collection-resource-array",
    ),
    true,
  );
});

test("release catalogue and collection report output are deterministic", async () => {
  const first = await buildReleaseCatalogue({ root: repoRoot });
  const second = await buildReleaseCatalogue({ root: repoRoot });

  assert.equal(first.catalogueText, second.catalogueText);
  assert.equal(first.reportText, second.reportText);
});
