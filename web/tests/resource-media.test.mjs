import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildReleaseCatalogue,
  MEDIA_SCHEMA_PATH,
  MEDIA_SOURCE_PATH,
  validateMediaSource,
} from "../scripts/release-catalogue-lib.mjs";
import { sourceProvenanceSha256 } from "../scripts/catalogue-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");

async function mediaSource() {
  return JSON.parse(
    await readFile(path.join(repoRoot, MEDIA_SOURCE_PATH), "utf8"),
  );
}

async function mediaSchema() {
  return JSON.parse(
    await readFile(path.join(repoRoot, MEDIA_SCHEMA_PATH), "utf8"),
  );
}

test("approved media is merged deterministically into only its linked resources", async () => {
  const result = await buildReleaseCatalogue({ root: repoRoot });
  const enriched = result.catalogue.resources.filter(
    (resource) => resource.previewImageUrl || resource.faviconUrl,
  );

  assert.equal(result.report.issues.errors.length, 0);
  assert.deepEqual(
    enriched.map((resource) => resource.slug),
    [
      "toools-design",
      "one-page-love",
      "awwwards",
      "the-fwa",
      "best-website-gallery",
      "minimal-gallery",
      "siiimple",
      "sitesee",
      "landing-love",
      "dark-mode-design",
      "dark-design",
      "navbar-gallery",
      "footer-design",
      "404s",
      "browsing-mode",
      "a-fresh-website",
      "cta-gallery",
      "a1-gallery",
      "webzooo",
      "recent-design",
      "detail",
      "bentogrids",
      "mobbin",
      "refero",
      "page-flows",
      "undraw",
      "storyset",
      "drawkit",
      "fffuel",
      "haikei",
    ],
  );
  assert.equal(enriched[0].previewSource, "open-graph");
  assert.equal(result.report.mediaSource.path, MEDIA_SOURCE_PATH);
  assert.equal(
    result.report.mediaSource.sha256,
    sourceProvenanceSha256(
      await readFile(path.join(repoRoot, MEDIA_SOURCE_PATH)),
    ),
  );
  assert.equal(result.report.mediaSource.approvedCount, 30);
  assert.equal(result.report.summary.approvedMedia, 30);
});

test("media validation rejects unknown, duplicate, and unsafe resource metadata", async () => {
  const [source, schema, result] = await Promise.all([
    mediaSource(),
    mediaSchema(),
    buildReleaseCatalogue({ root: repoRoot }),
  ]);
  const invalid = structuredClone(source);
  invalid.resources[0].preview.url = "http://127.0.0.1/preview.jpg";
  invalid.resources.push({
    ...structuredClone(source.resources[0]),
    resourceId: "resource-not-in-catalogue",
  });
  invalid.resources.push(structuredClone(source.resources[0]));

  const errors = validateMediaSource(
    invalid,
    schema,
    result.catalogue.resources,
  );
  assert.equal(
    errors.some((error) => error.code === "invalid-preview-url"),
    true,
  );
  assert.equal(
    errors.some((error) => error.code === "unknown-media-resource"),
    true,
  );
  assert.equal(
    errors.some((error) => error.code === "duplicate-media-resource"),
    true,
  );
});
