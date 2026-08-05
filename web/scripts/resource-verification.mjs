import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";

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

function parseArguments(args, allowedFlags) {
  const positionals = [];
  const options = new Map();

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!argument.startsWith("--")) {
      positionals.push(argument);
      continue;
    }
    if (!allowedFlags.has(argument)) {
      throw new ResourceVerificationError(`Unknown option: ${argument}.`);
    }
    if (options.has(argument)) {
      throw new ResourceVerificationError(
        `Option may only be supplied once: ${argument}.`,
      );
    }
    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new ResourceVerificationError(`${argument} requires a value.`);
    }
    options.set(argument, value);
    index += 1;
  }

  return { positionals, options };
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

function compileSchema() {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    formats: {
      date: validIsoDate,
      uri: validUri,
    },
  });
  return ajv.compile(schema);
}

function schemaErrors(validate) {
  return (validate.errors ?? []).map((error) => {
    const location = error.instancePath || error.dataPath || "record";
    return `Schema ${location}: ${error.message}.`;
  });
}

function draft(args) {
  const { positionals, options } = parseArguments(
    args,
    new Set(["--reviewer", "--date", "--name", "--output"]),
  );
  if (positionals.length !== 1) {
    throw new ResourceVerificationError(
      `Exactly one source ID or slug is required.\n${usage()}`,
    );
  }

  const [identifier] = positionals;
  const reviewerId = options.get("--reviewer");
  const startedAt = options.get("--date");
  const reviewerDisplayName = options.get("--name") ?? "";
  const output = options.get("--output");

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
  const { positionals } = parseArguments(args, new Set());
  if (positionals.length !== 1) {
    throw new ResourceVerificationError(
      `Exactly one verification record path is required.\n${usage()}`,
    );
  }

  const [input] = positionals;
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
    eligibleForPromotion: errors.length === 0 && semantic.eligibleForPromotion,
    resourceId:
      typeof record.resourceId === "string" ? record.resourceId : null,
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
