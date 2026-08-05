import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";

import {
  ResourceVerificationError,
  createResourceVerificationDraft,
  stableJson,
  validateResourceVerificationRecord,
} from "../lib/resource-verification.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(
  __dirname,
  "../../schemas/resource-verification-record.schema.json",
);

function usage() {
  return `Usage:
  npm run verification:draft -- <source-id-or-slug> --reviewer <id> --date YYYY-MM-DD [--name <display-name>] [--output <path>]
  npm run verification:check -- <record-path>`;
}

function argumentValue(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new ResourceVerificationError(`${flag} requires a value.`);
  }
  return value;
}

function compileSchema() {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const ajv = new Ajv({ allErrors: true, strict: false });
  return ajv.compile(schema);
}

function schemaErrors(validate) {
  return (validate.errors ?? []).map((error) => {
    const location = error.instancePath || error.dataPath || "record";
    return `Schema ${location}: ${error.message}.`;
  });
}

function draft(args) {
  const identifier = args[0];
  if (!identifier || identifier.startsWith("--")) {
    throw new ResourceVerificationError(
      `A source ID or slug is required.\n${usage()}`,
    );
  }

  const reviewerId = argumentValue(args, "--reviewer");
  const startedAt = argumentValue(args, "--date");
  const reviewerDisplayName = argumentValue(args, "--name") ?? "";
  const output = argumentValue(args, "--output");

  if (!reviewerId || !startedAt) {
    throw new ResourceVerificationError(
      `--reviewer and --date are required.\n${usage()}`,
    );
  }

  const record = createResourceVerificationDraft({
    identifier,
    reviewerId,
    reviewerDisplayName,
    startedAt,
  });
  const bytes = stableJson(record);

  if (!output) {
    process.stdout.write(bytes);
    return;
  }

  const outputPath = path.resolve(process.cwd(), output);
  if (fs.existsSync(outputPath)) {
    throw new ResourceVerificationError(
      `Refusing to overwrite existing verification record: ${outputPath}`,
    );
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, bytes, { encoding: "utf8", flag: "wx" });
  console.log(`Created verification draft: ${outputPath}`);
}

function check(args) {
  const input = args[0];
  if (!input || input.startsWith("--")) {
    throw new ResourceVerificationError(
      `A verification record path is required.\n${usage()}`,
    );
  }

  const inputPath = path.resolve(process.cwd(), input);
  if (!fs.existsSync(inputPath)) {
    throw new ResourceVerificationError(
      `Verification record does not exist: ${inputPath}`,
    );
  }

  let record;
  try {
    record = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  } catch (error) {
    throw new ResourceVerificationError(
      `Verification record is not valid JSON: ${error instanceof Error ? error.message : "unknown parse error"}`,
    );
  }

  const validateSchema = compileSchema();
  const shapeValid = validateSchema(record);
  const errors = shapeValid ? [] : schemaErrors(validateSchema);
  const semantic = shapeValid
    ? validateResourceVerificationRecord(record)
    : { valid: false, eligibleForPromotion: false, errors: [] };
  errors.push(...semantic.errors);

  const result = {
    valid: errors.length === 0,
    eligibleForPromotion:
      errors.length === 0 && semantic.eligibleForPromotion,
    resourceId: typeof record.resourceId === "string" ? record.resourceId : null,
    resourceSlug:
      typeof record.resourceSlug === "string" ? record.resourceSlug : null,
    status: typeof record.status === "string" ? record.status : null,
    decision: typeof record.decision === "string" ? record.decision : null,
    errors,
  };

  process.stdout.write(stableJson(result));
  if (!result.valid) process.exitCode = 1;
}

const [command, ...args] = process.argv.slice(2);

try {
  if (command === "draft") draft(args);
  else if (command === "check") check(args);
  else throw new ResourceVerificationError(usage());
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
