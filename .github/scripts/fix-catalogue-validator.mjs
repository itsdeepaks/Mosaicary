import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const webRoot = process.cwd();

function replaceBetween(text, startMarker, endMarker, replacement, label) {
  const start = text.indexOf(startMarker);
  if (start === -1) {
    throw new Error(`Could not find ${label} start marker.`);
  }
  const end = text.indexOf(endMarker, start);
  if (end === -1) {
    throw new Error(`Could not find ${label} end marker.`);
  }
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

const libraryPath = path.join(webRoot, "scripts/catalogue-lib.mjs");
let library = await readFile(libraryPath, "utf8");

if (!library.includes("function objectShapeErrors(")) {
  library = replaceBetween(
    library,
    "function exactKeys(",
    "\n\nexport function validateCatalogueAgainstSchema",
    `function objectShapeErrors(value, requiredKeys, allowedKeys, label) {
  const missingKeys = requiredKeys.filter(
    (key) => !Object.hasOwn(value, key),
  );
  const unexpectedKeys = Object.keys(value).filter(
    (key) => !allowedKeys.includes(key),
  );
  const errors = [];

  if (missingKeys.length > 0) {
    errors.push(
      \`${"${label}"} is missing required keys: ${"${missingKeys.join(\", \")}"}.\`,
    );
  }
  if (unexpectedKeys.length > 0) {
    errors.push(
      \`${"${label}"} has unexpected keys: ${"${unexpectedKeys.join(\", \")}"}.\`,
    );
  }

  return errors;
}`,
    "shape-helper",
  );
}

if (library.includes("if (!exactKeys(catalogue, schema.required))")) {
  library = replaceBetween(
    library,
    "  if (!exactKeys(catalogue, schema.required))",
    "\n\n  if (catalogue.source.path",
    `  errors.push(
    ...objectShapeErrors(
      catalogue,
      schema.required,
      Object.keys(schema.properties),
      "Catalogue",
    ),
  );`,
    "catalogue-shape",
  );
}

if (library.includes("if (!exactKeys(category, categorySchema.required))")) {
  library = replaceBetween(
    library,
    "    if (!exactKeys(category, categorySchema.required))",
    "\n    if (!identifierPattern.test(category.id))",
    `    errors.push(
      ...objectShapeErrors(
        category,
        categorySchema.required,
        Object.keys(categorySchema.properties),
        \`Category ${"${category.id ?? \"<unknown>\"}"}\`,
      ),
    );`,
    "category-shape",
  );
}

if (library.includes("if (!exactKeys(resource, resourceSchema.required))")) {
  library = replaceBetween(
    library,
    "    if (!exactKeys(resource, resourceSchema.required))",
    "\n    if (!identifierPattern.test(resource.id))",
    `    errors.push(
      ...objectShapeErrors(
        resource,
        resourceSchema.required,
        Object.keys(resourceSchema.properties),
        \`Resource ${"${resource.id ?? \"<unknown>\"}"}\`,
      ),
    );`,
    "resource-shape",
  );
}

await writeFile(libraryPath, library, "utf8");

const testsPath = path.join(webRoot, "tests/catalogue-migration.test.mjs");
let tests = await readFile(testsPath, "utf8");
const importOld = "  REPORT_PATH,\n  slugify,\n";
const importNew =
  "  REPORT_PATH,\n  SCHEMA_PATH,\n  slugify,\n  validateCatalogueAgainstSchema,\n";
if (!tests.includes("validateCatalogueAgainstSchema,")) {
  if (!tests.includes(importOld)) {
    throw new Error("Could not find the catalogue-test import marker.");
  }
  tests = tests.replace(importOld, importNew);
}

const testMarker =
  'test("committed catalogue data matches deterministic migration output", async () => {';
const regressionTitle =
  'test("schema shape accepts defined optional properties and rejects unknown keys"';
if (!tests.includes(regressionTitle)) {
  const markerIndex = tests.indexOf(testMarker);
  if (markerIndex === -1) {
    throw new Error("Could not find the committed-output test marker.");
  }
  const regression = `test("schema shape accepts defined optional properties and rejects unknown keys", async () => {
  const { catalogue } = await catalogueBuild();
  const schema = JSON.parse(
    await readFile(path.join(repoRoot, SCHEMA_PATH), "utf8"),
  );
  const withOptionalFields = structuredClone(catalogue);
  withOptionalFields.generatedAt = "2026-07-28T00:00:00.000Z";
  withOptionalFields.resources[0].faviconUrl =
    "https://designindex.xyz/favicon.ico";
  withOptionalFields.resources[0].previewImageUrl =
    "https://designindex.xyz/preview.webp";
  withOptionalFields.resources[0].previewSource = "manual";
  withOptionalFields.resources[0].lastVerifiedAt = "2026-07-28";

  assert.deepEqual(
    validateCatalogueAgainstSchema(withOptionalFields, schema),
    [],
  );

  withOptionalFields.resources[0].unsupportedField = true;
  assert.equal(
    validateCatalogueAgainstSchema(withOptionalFields, schema).some((message) =>
      message.includes("unexpected keys: unsupportedField"),
    ),
    true,
  );
});

`;
  tests = `${tests.slice(0, markerIndex)}${regression}${tests.slice(markerIndex)}`;
}

await writeFile(testsPath, tests, "utf8");
