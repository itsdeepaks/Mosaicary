import { readFile } from "node:fs/promises";
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
const [committedJson, committedMarkdown] = await Promise.all([
  readFile(path.join(repoRoot, CANDIDATE_REPORT_JSON_PATH), "utf8"),
  readFile(path.join(repoRoot, CANDIDATE_REPORT_MD_PATH), "utf8"),
]);

let failed = false;
if (report.issues.errors.length > 0) {
  failed = true;
  console.error(
    `Media candidate validation found ${report.issues.errors.length} blocking issue(s).`,
  );
  for (const entry of report.issues.errors) {
    console.error(`- [${entry.code}] ${entry.message}`);
  }
}
if (committedJson !== reportJson) {
  failed = true;
  console.error(
    "Candidate JSON report is stale. Run npm run media:review:generate.",
  );
}
if (committedMarkdown !== reportMarkdown) {
  failed = true;
  console.error(
    "Candidate Markdown report is stale. Run npm run media:review:generate.",
  );
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log(
    `Media candidate review is current: ${report.summary.approvedProduction} approved, ${report.summary.discoveredCandidates} candidates, ${report.summary.pending} pending.`,
  );
}
