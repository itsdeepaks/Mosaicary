import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildRepositoryMediaCoverage,
  composeMediaCoverage,
  COVERAGE_SOURCE_PATH,
  serializeMediaCoverage,
} from "./resource-media-coverage-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const result = await buildRepositoryMediaCoverage({ root: repoRoot });
let failed = false;
for (const entry of result.issues) {
  failed = true;
  console.error(`[${entry.code}] ${entry.message}`);
}
const expected = composeMediaCoverage({
  approvedSource: result.approvedSource,
  catalogueResources: result.catalogueResources,
  previousCoverage: result.coverage,
});
const committed = await readFile(
  path.join(repoRoot, COVERAGE_SOURCE_PATH),
  "utf8",
);
if (committed !== serializeMediaCoverage(expected)) {
  failed = true;
  console.error(
    "Media coverage is stale. Run npm run media:coverage:generate.",
  );
}
if (failed) process.exitCode = 1;
else {
  console.log(
    `Media coverage is current: ${result.summary.total} total, ${result.summary.approvedMedia} approved, ${result.summary.pending} pending, ${result.summary.terminalWithoutMedia} terminal without media.`,
  );
}
