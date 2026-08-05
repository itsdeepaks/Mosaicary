import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(
  __dirname,
  "../../schemas/resource-intelligence-profile.schema.json",
);
const profilesDir = path.join(__dirname, "../data/intelligence-profiles");
const profileBatchesDir = path.join(
  __dirname,
  "../data/intelligence-profile-batches",
);
const cataloguePath = path.join(__dirname, "../data/catalogue.json");

function parseJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function validIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function validUri(value) {
  try {
    const parsed = new URL(value);
    return Boolean(parsed.protocol && parsed.hostname);
  } catch {
    return false;
  }
}

function loadProfileRecords(report) {
  const records = [];
  const filenames = fs
    .readdirSync(profilesDir)
    .filter((file) => file.endsWith(".json"))
    .sort();

  report.individualProfileCount = filenames.length;

  for (const filename of filenames) {
    try {
      records.push({
        file: filename,
        profileData: parseJsonFile(path.join(profilesDir, filename)),
        batchReviewedAt: null,
      });
    } catch (error) {
      report.errors.push({
        file: filename,
        message: `JSON parse error: ${error.message}`,
      });
    }
  }

  if (!fs.existsSync(profileBatchesDir)) {
    report.batchFileCount = 0;
    report.batchProfileCount = 0;
    return records;
  }

  const batchFilenames = fs
    .readdirSync(profileBatchesDir)
    .filter((file) => file.endsWith(".json"))
    .sort();

  report.batchFileCount = batchFilenames.length;

  for (const filename of batchFilenames) {
    const filePath = path.join(profileBatchesDir, filename);
    let batch;
    try {
      batch = parseJsonFile(filePath);
    } catch (error) {
      report.errors.push({
        file: filename,
        message: `JSON parse error: ${error.message}`,
      });
      continue;
    }

    if (
      batch?.version !== 1 ||
      typeof batch.slice !== "string" ||
      !/^\d+\.\d+$/.test(batch.slice) ||
      typeof batch.reviewedAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(batch.reviewedAt) ||
      !Array.isArray(batch.profiles)
    ) {
      report.errors.push({
        file: filename,
        message:
          "Batch contract requires version 1, a numeric slice ID, an ISO review date, and a profiles array.",
      });
      continue;
    }

    for (const [index, profileData] of batch.profiles.entries()) {
      records.push({
        file: `${filename}#profiles[${index}]`,
        profileData,
        batchReviewedAt: batch.reviewedAt,
      });
    }
  }

  report.batchProfileCount = records.length - report.individualProfileCount;
  return records;
}

export function validateIntelligenceProfiles() {
  const schema = parseJsonFile(schemaPath);
  delete schema.$schema;
  if (schema.$defs && !schema.definitions) {
    schema.definitions = schema.$defs;
  }

  const ajv = new Ajv({
    allErrors: true,
    schemaId: "auto",
    formats: { date: validIsoDate, uri: validUri },
  });
  const validate = ajv.compile(schema);

  const catalogue = parseJsonFile(cataloguePath);
  const validResourceIds = new Set([
    ...catalogue.resources.map((resource) => resource.id),
    ...catalogue.resources.map((resource) => resource.slug),
  ]);

  const report = {
    totalScanned: 0,
    validCount: 0,
    individualProfileCount: 0,
    batchFileCount: 0,
    batchProfileCount: 0,
    errors: [],
  };
  const records = loadProfileRecords(report);
  report.totalScanned = records.length;

  const seenResourceIds = new Map();

  for (const { file, profileData, batchReviewedAt } of records) {
    const isValid = validate(profileData);
    if (!isValid) {
      const details = validate.errors
        .map(
          (error) =>
            `${error.dataPath || error.instancePath} (${error.keyword}): ${error.message}`,
        )
        .join("; ");
      report.errors.push({
        file,
        message: `Schema error: ${details}`,
      });
      continue;
    }

    const { resourceId } = profileData;
    if (!validResourceIds.has(resourceId)) {
      report.errors.push({
        file,
        message: `Resource ID "${resourceId}" not found in catalogue.json`,
      });
      continue;
    }

    if (seenResourceIds.has(resourceId)) {
      report.errors.push({
        file,
        message: `Duplicate resourceId "${resourceId}" found in ${seenResourceIds.get(resourceId)} and ${file}`,
      });
      continue;
    }
    seenResourceIds.set(resourceId, file);

    if (batchReviewedAt && profileData.verifiedAt !== batchReviewedAt) {
      report.errors.push({
        file,
        message: `Profile verifiedAt ${profileData.verifiedAt} does not match batch reviewedAt ${batchReviewedAt}`,
      });
      continue;
    }

    report.validCount += 1;
  }

  return report;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const report = validateIntelligenceProfiles();
  console.log(`Scanned ${report.totalScanned} intelligence profiles.`);
  console.log(
    `Sources: ${report.individualProfileCount} individual + ${report.batchProfileCount} batched across ${report.batchFileCount} batch file(s).`,
  );
  console.log(`Valid: ${report.validCount}/${report.totalScanned}`);

  if (report.errors.length > 0) {
    console.error(`\nValidation Errors (${report.errors.length}):`);
    for (const error of report.errors) {
      console.error(` - [${error.file}] ${error.message}`);
    }
    process.exit(1);
  }

  console.log("All intelligence profiles are valid and linked to catalogue!");
}
