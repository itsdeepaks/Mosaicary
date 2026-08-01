import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildReleaseCatalogue,
  MEDIA_SOURCE_PATH,
} from "./release-catalogue-lib.mjs";
import {
  composeMediaCoverage,
  COVERAGE_SOURCE_PATH,
  serializeMediaCoverage,
  summarizeMediaCoverage,
  validateMediaCoverage,
} from "./resource-media-coverage-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const coveragePath = path.join(repoRoot, COVERAGE_SOURCE_PATH);
const release = await buildReleaseCatalogue({ root: repoRoot });
const approvedSource = JSON.parse(
  await readFile(path.join(repoRoot, MEDIA_SOURCE_PATH), "utf8"),
);
let previousCoverage;
try {
  previousCoverage = JSON.parse(await readFile(coveragePath, "utf8"));
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
if (previousCoverage) {
  const reconcilableCodes = new Set([
    "approved-media-terminal-conflict",
    "coverage-order-drift",
    "missing-approved-media-disposition",
    "missing-coverage-resource",
  ]);
  const blockingPreviousIssues = validateMediaCoverage({
    approvedSource,
    catalogueResources: release.catalogue.resources,
    coverage: previousCoverage,
  }).filter((entry) => !reconcilableCodes.has(entry.code));
  if (blockingPreviousIssues.length > 0) {
    for (const entry of blockingPreviousIssues) {
      console.error(`[${entry.code}] ${entry.message}`);
    }
    console.error(
      "Refusing to regenerate from invalid coverage because reviewed evidence could be lost.",
    );
    process.exit(1);
  }
}
const coverage = composeMediaCoverage({
  approvedSource,
  catalogueResources: release.catalogue.resources,
  previousCoverage,
});
const issues = validateMediaCoverage({
  approvedSource,
  catalogueResources: release.catalogue.resources,
  coverage,
});
if (issues.length > 0) {
  for (const entry of issues) console.error(`[${entry.code}] ${entry.message}`);
  process.exit(1);
}
await writeFile(coveragePath, serializeMediaCoverage(coverage), "utf8");
const summary = summarizeMediaCoverage(coverage);
console.log(
  `Wrote media coverage for ${summary.total} resources: ${summary.approvedMedia} approved, ${summary.pending} pending, ${summary.terminalWithoutMedia} terminal without media.`,
);
