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
const cataloguePath = path.join(__dirname, "../data/catalogue.json");

export function validateIntelligenceProfiles() {
  const schemaRaw = fs.readFileSync(schemaPath, "utf8");
  const schema = JSON.parse(schemaRaw);
  delete schema.$schema;
  if (schema.$defs && !schema.definitions) {
    schema.definitions = schema.$defs;
  }

  const ajv = new Ajv({ allErrors: true, schemaId: "auto" });
  const validate = ajv.compile(schema);

  const catalogueRaw = fs.readFileSync(cataloguePath, "utf8");
  const catalogue = JSON.parse(catalogueRaw);
  const validResourceIds = new Set([
    ...catalogue.resources.map((resource) => resource.id),
    ...catalogue.resources.map((resource) => resource.slug),
  ]);

  const filenames = fs
    .readdirSync(profilesDir)
    .filter((file) => file.endsWith(".json"));

  const report = {
    totalScanned: filenames.length,
    validCount: 0,
    errors: [],
  };

  const seenResourceIds = new Map();

  for (const filename of filenames) {
    const filePath = path.join(profilesDir, filename);
    let profileData;
    try {
      profileData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      report.errors.push({
        file: filename,
        message: `JSON parse error: ${err.message}`,
      });
      continue;
    }

    const isValid = validate(profileData);
    if (!isValid) {
      const details = validate.errors
        .map(
          (err) =>
            `${err.dataPath || err.instancePath} (${err.keyword}): ${err.message}`,
        )
        .join("; ");
      report.errors.push({
        file: filename,
        message: `Schema error: ${details}`,
      });
      continue;
    }

    const { resourceId } = profileData;
    if (!validResourceIds.has(resourceId)) {
      report.errors.push({
        file: filename,
        message: `Resource ID "${resourceId}" not found in catalogue.json`,
      });
      continue;
    }

    if (seenResourceIds.has(resourceId)) {
      report.errors.push({
        file: filename,
        message: `Duplicate resourceId "${resourceId}" found in ${seenResourceIds.get(resourceId)} and ${filename}`,
      });
      continue;
    }
    seenResourceIds.set(resourceId, filename);

    if (profileData.evidenceUrls) {
      for (const url of profileData.evidenceUrls) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          report.errors.push({
            file: filename,
            message: `Invalid evidence URL protocol: ${url}`,
          });
        }
      }
    }

    report.validCount++;
  }

  return report;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const report = validateIntelligenceProfiles();
  console.log(`Scanned ${report.totalScanned} intelligence profiles.`);
  console.log(`Valid: ${report.validCount}/${report.totalScanned}`);

  if (report.errors.length > 0) {
    console.error(`\nValidation Errors (${report.errors.length}):`);
    for (const err of report.errors) {
      console.error(` - [${err.file}] ${err.message}`);
    }
    process.exit(1);
  } else {
    console.log("All intelligence profiles are valid and linked to catalogue!");
  }
}
