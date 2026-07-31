import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildCatalogue,
  CATALOGUE_PATH,
  CATEGORY_DEFINITIONS,
  EXPECTED_ACCESS_COUNTS,
  parseCsv,
  REPORT_PATH,
  SCHEMA_PATH,
  slugify,
  sourceProvenanceSha256,
  validateCatalogueAgainstSchema,
} from "../scripts/catalogue-lib.mjs";
import { buildReleaseCatalogue } from "../scripts/release-catalogue-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");

let cachedBuild;
async function catalogueBuild() {
  cachedBuild ??= buildCatalogue({ root: repoRoot });
  return cachedBuild;
}

test("CSV parser handles BOM, quoted commas, escaped quotes, and newlines", () => {
  const rows = parseCsv(
    '\uFEFFCategory,Website,Description\r\nTools,"Example, Inc.","Says ""hello"""\r\n',
  );

  assert.deepEqual(rows, [
    ["Category", "Website", "Description"],
    ["Tools", "Example, Inc.", 'Says "hello"'],
  ]);
});

test("slug generation is stable and identifier-safe", () => {
  assert.equal(slugify("shadcn/ui"), "shadcn-ui");
  assert.equal(slugify("Colors & Fonts"), "colors-and-fonts");
  assert.equal(slugify("  3D Websites  "), "3d-websites");
  assert.equal(slugify("***"), "resource");
});

test("migration accounts for all source rows and approved categories", async () => {
  const { catalogue, report } = await catalogueBuild();

  assert.equal(report.issues.errors.length, 0);
  assert.equal(catalogue.source.rowCount, 295);
  assert.equal(catalogue.resources.length, 295);
  assert.equal(catalogue.categories.length, 11);
  assert.equal(catalogue.collections.length, 0);
  assert.equal(report.summary.resources, 295);
  assert.equal(report.summary.categories, 11);
  assert.deepEqual(report.summary.access, EXPECTED_ACCESS_COUNTS);
  assert.equal(report.summary.access["free-trial"], 1);
  assert.equal(report.summary.subscriptionRequired["after-trial"], 1);
  assert.equal(catalogue.resources[0].name, "DesignIndex");
});

test("category counts preserve the documented 295-resource taxonomy", async () => {
  const { report } = await catalogueBuild();
  const expected = CATEGORY_DEFINITIONS.map((category) => ({
    category: category.id,
    expected: category.expectedCount,
  }));
  const actual = report.categoryCounts.map(({ category, actual }) => ({
    category,
    expected: actual,
  }));

  assert.deepEqual(actual, expected);
  assert.equal(
    report.categoryCounts.reduce((sum, category) => sum + category.actual, 0),
    295,
  );
});

test("generated identifiers, slugs, URLs, and domains are unique and valid", async () => {
  const { catalogue, report } = await catalogueBuild();
  const ids = new Set();
  const slugs = new Set();

  for (const resource of catalogue.resources) {
    assert.match(resource.id, /^resource-[a-f0-9]{12}$/);
    assert.match(resource.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(resource.domain, /^[A-Za-z0-9.-]+$/);
    assert.doesNotThrow(() => new URL(resource.url));
    assert.equal(ids.has(resource.id), false, `Duplicate ID: ${resource.id}`);
    assert.equal(
      slugs.has(resource.slug),
      false,
      `Duplicate slug: ${resource.slug}`,
    );
    ids.add(resource.id);
    slugs.add(resource.slug);
  }

  assert.equal(report.duplicates.urls.length, 0);
});

test("CSV migration does not invent tags, collections, or useful-for metadata", async () => {
  const { catalogue } = await catalogueBuild();

  assert.equal(catalogue.collections.length, 0);
  assert.equal(
    catalogue.resources.every(
      (resource) =>
        resource.tags.length === 0 && resource.usefulFor.length === 0,
    ),
    true,
  );
});

test("catalogue and validation output are deterministic", async () => {
  const first = await buildCatalogue({ root: repoRoot });
  const second = await buildCatalogue({ root: repoRoot });

  assert.equal(first.catalogueText, second.catalogueText);
  assert.equal(first.reportText, second.reportText);
  assert.match(first.catalogue.source.sha256, /^[a-f0-9]{64}$/);
});

test("catalogue provenance hashing is stable across line endings", () => {
  assert.equal(
    sourceProvenanceSha256("Category,Website\r\nTools,Example\r\n"),
    sourceProvenanceSha256("Category,Website\nTools,Example\n"),
  );
});

test("schema shape accepts defined optional properties and rejects unknown keys", async () => {
  const { catalogue } = await catalogueBuild();
  const schema = JSON.parse(
    await readFile(path.join(repoRoot, SCHEMA_PATH), "utf8"),
  );
  const withOptionalFields = structuredClone(catalogue);
  withOptionalFields.generatedAt = "2026-07-28T00:00:00.000Z";
  withOptionalFields.resources[0].faviconUrl =
    "https://designindex.xyz/favicon.ico";
  withOptionalFields.resources[0].previewImageUrl =
    "https://designindex.xyz/preview.webp";
  withOptionalFields.resources[0].previewSource = "manual";
  withOptionalFields.resources[0].lastVerifiedAt = "2026-07-28";

  assert.deepEqual(
    validateCatalogueAgainstSchema(withOptionalFields, schema),
    [],
  );

  withOptionalFields.resources[0].unsupportedField = true;
  assert.equal(
    validateCatalogueAgainstSchema(withOptionalFields, schema).some((message) =>
      message.includes("unexpected keys: unsupportedField"),
    ),
    true,
  );
});

test("committed catalogue data matches deterministic release composition", async () => {
  const result = await buildReleaseCatalogue({ root: repoRoot });
  const [committedCatalogue, committedReport] = await Promise.all([
    readFile(path.join(repoRoot, CATALOGUE_PATH), "utf8"),
    readFile(path.join(repoRoot, REPORT_PATH), "utf8"),
  ]);

  assert.equal(committedCatalogue, result.catalogueText);
  assert.equal(committedReport, result.reportText);
});
