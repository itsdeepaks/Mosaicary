import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildRepositoryReview,
  CANDIDATE_REPORT_JSON_PATH,
  CANDIDATE_REPORT_MD_PATH,
} from "./resource-media-review-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const { report, reportJson, reportMarkdown } = await buildRepositoryReview({
  root: repoRoot,
});

await mkdir(path.dirname(path.join(repoRoot, CANDIDATE_REPORT_JSON_PATH)), {
  recursive: true,
});
await Promise.all([
  writeFile(
    path.join(repoRoot, CANDIDATE_REPORT_JSON_PATH),
    reportJson,
    "utf8",
  ),
  writeFile(
    path.join(repoRoot, CANDIDATE_REPORT_MD_PATH),
    reportMarkdown,
    "utf8",
  ),
]);

if (report.issues.errors.length > 0) {
  console.error(
    `Media candidate review found ${report.issues.errors.length} blocking issue(s).`,
  );
  for (const entry of report.issues.errors) {
    console.error(`- [${entry.code}] ${entry.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Generated media review for ${report.summary.reviewTargets} target(s): ${report.summary.discoveredCandidates} candidate(s), ${report.summary.pending} pending, ${report.summary.blockedOrUnresolved} blocked/unresolved.`,
  );
}
