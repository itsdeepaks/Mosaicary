import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildCatalogue,
  CATALOGUE_PATH,
  REPORT_PATH,
} from "./catalogue-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const result = await buildCatalogue({ root: repoRoot });

if (result.report.issues.errors.length > 0) {
  console.error(
    `Catalogue validation found ${result.report.issues.errors.length} blocking issue(s).`,
  );
  for (const error of result.report.issues.errors) {
    console.error(`- [${error.code}] ${error.message}`);
  }
  process.exitCode = 1;
} else {
  const [committedCatalogue, committedReport] = await Promise.all([
    readFile(path.join(repoRoot, CATALOGUE_PATH), "utf8"),
    readFile(path.join(repoRoot, REPORT_PATH), "utf8"),
  ]);
  const drift = [];

  if (committedCatalogue !== result.catalogueText) {
    drift.push(CATALOGUE_PATH);
  }
  if (committedReport !== result.reportText) {
    drift.push(REPORT_PATH);
  }

  if (drift.length > 0) {
    console.error(
      `Committed catalogue output is stale: ${drift.join(", ")}. Run npm run catalogue:generate.`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `Catalogue check passed for ${result.report.summary.resources} resources and ${result.report.summary.categories} categories.`,
    );
  }
}
