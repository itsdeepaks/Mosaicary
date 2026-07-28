import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildCatalogue,
  CATALOGUE_PATH,
  REPORT_PATH,
} from "./catalogue-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const { catalogueText, report, reportText } = await buildCatalogue({
  root: repoRoot,
});

if (report.issues.errors.length > 0) {
  console.error(
    `Catalogue migration found ${report.issues.errors.length} blocking issue(s).`,
  );
  for (const error of report.issues.errors) {
    console.error(`- [${error.code}] ${error.message}`);
  }
  process.exitCode = 1;
} else {
  const cataloguePath = path.join(repoRoot, CATALOGUE_PATH);
  const reportPath = path.join(repoRoot, REPORT_PATH);
  await Promise.all([
    mkdir(path.dirname(cataloguePath), { recursive: true }),
    mkdir(path.dirname(reportPath), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(cataloguePath, catalogueText, "utf8"),
    writeFile(reportPath, reportText, "utf8"),
  ]);

  console.log(
    `Generated ${report.summary.resources} resources across ${report.summary.categories} categories.`,
  );
  console.log(
    `Validation report contains ${report.issues.warnings.length} review warning(s) and no blocking errors.`,
  );
}
