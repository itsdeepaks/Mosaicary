import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildRepositoryMediaCoverage,
  composeMediaCoverage,
  COVERAGE_SCHEMA_PATH,
  COVERAGE_SOURCE_PATH,
  selectPendingMediaBatch,
  serializeMediaCoverage,
  validateMediaCoverage,
} from "../scripts/resource-media-coverage-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repoRoot, relativePath), "utf8"));
}

test("coverage manifest represents all catalogue resources deterministically", async () => {
  const [coverage, schema, repositoryCoverage] = await Promise.all([
    readJson(COVERAGE_SOURCE_PATH),
    readJson(COVERAGE_SCHEMA_PATH),
    buildRepositoryMediaCoverage({ root: repoRoot }),
  ]);

  assert.equal(schema.$id, "urn:tessli:schema:resource-media-coverage:v1");
  assert.equal(coverage.resources.length, 295);
  assert.deepEqual(
    validateMediaCoverage({
      approvedSource: repositoryCoverage.approvedSource,
      catalogueResources: repositoryCoverage.catalogueResources,
      coverage,
    }),
    [],
  );
  assert.equal(repositoryCoverage.summary.total, 295);
  assert.equal(repositoryCoverage.summary.approvedMedia, 8);
  assert.equal(repositoryCoverage.summary.pending, 287);
  assert.equal(repositoryCoverage.summary.terminalWithoutMedia, 0);
  assert.equal(
    serializeMediaCoverage(repositoryCoverage.coverage),
    await readFile(path.join(repoRoot, COVERAGE_SOURCE_PATH), "utf8"),
  );
});

test("coverage composition preserves terminal research and reconciles approved media", async () => {
  const repositoryCoverage = await buildRepositoryMediaCoverage({
    root: repoRoot,
  });
  const pending = repositoryCoverage.coverage.resources.find(
    (record) => record.disposition === "pending",
  );
  const previousCoverage = structuredClone(repositoryCoverage.coverage);
  const previous = previousCoverage.resources.find(
    (record) => record.resourceId === pending.resourceId,
  );
  Object.assign(previous, {
    disposition: "no-suitable-raster",
    checkedAt: "2026-08-02",
    notes: ["No suitable raster metadata was available."],
  });

  const composed = composeMediaCoverage({
    approvedSource: repositoryCoverage.approvedSource,
    catalogueResources: repositoryCoverage.catalogueResources,
    previousCoverage,
  });
  assert.deepEqual(
    composed.resources.find(
      (record) => record.resourceId === pending.resourceId,
    ),
    previous,
  );
  assert.equal(
    composed.resources.filter(
      (record) => record.disposition === "approved-media",
    ).length,
    8,
  );
});

test("coverage validation rejects missing, duplicate, unknown, and false approval records", async () => {
  const repositoryCoverage = await buildRepositoryMediaCoverage({
    root: repoRoot,
  });
  const invalid = structuredClone(repositoryCoverage.coverage);
  invalid.resources.shift();
  const pendingResourceId = invalid.resources.find(
    (record) => record.disposition === "pending",
  ).resourceId;
  invalid.resources.push({
    resourceId: pendingResourceId,
    disposition: "approved-media",
    checkedAt: "2026-08-02",
  });
  invalid.resources.push({
    resourceId: "resource-not-in-catalogue",
    disposition: "pending",
  });

  const codes = new Set(
    validateMediaCoverage({
      approvedSource: repositoryCoverage.approvedSource,
      catalogueResources: repositoryCoverage.catalogueResources,
      coverage: invalid,
    }).map((issue) => issue.code),
  );

  for (const code of [
    "missing-coverage-resource",
    "duplicate-coverage-resource",
    "unknown-coverage-resource",
    "unapproved-media-disposition",
  ]) {
    assert.equal(codes.has(code), true, `missing validation code ${code}`);
  }
});

test("pending batch selection is catalogue ordered, resumable, and capped at twenty", async () => {
  const repositoryCoverage = await buildRepositoryMediaCoverage({
    root: repoRoot,
  });

  const first = selectPendingMediaBatch(repositoryCoverage.coverage, {
    limit: 20,
  });
  const afterFirst = selectPendingMediaBatch(repositoryCoverage.coverage, {
    after: first.at(-1).resourceId,
    limit: 20,
  });

  assert.equal(first.length, 20);
  assert.equal(afterFirst.length, 20);
  assert.equal(
    first.some((record) => record.disposition !== "pending"),
    false,
  );
  assert.equal(
    new Set([...first, ...afterFirst].map((record) => record.resourceId)).size,
    40,
  );
  assert.throws(
    () => selectPendingMediaBatch(repositoryCoverage.coverage, { limit: 21 }),
    /between 1 and 20/,
  );
  assert.throws(
    () =>
      selectPendingMediaBatch(repositoryCoverage.coverage, {
        after: "resource-not-in-coverage",
        limit: 10,
      }),
    /Unknown --after resource ID/,
  );
});
