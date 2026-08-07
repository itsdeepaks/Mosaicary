import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";

import {
  ResourceVerificationError,
  validateResourceVerificationRecord,
  type ResourceVerificationRecord,
} from "./resource-verification.ts";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(
  moduleDirectory,
  "../../schemas/resource-verification-record.schema.json",
);
export const COMMITTED_RESOURCE_VERIFICATIONS_DIRECTORY = path.resolve(
  moduleDirectory,
  "../data/resource-verifications",
);

export interface CommittedVerificationBatch {
  valid: boolean;
  records: readonly ResourceVerificationRecord[];
  errors: readonly string[];
}

function validIsoDate(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function validUri(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const parsed = new URL(value);
    return Boolean(parsed.protocol && parsed.hostname);
  } catch {
    return false;
  }
}

function schemaErrors(record: unknown): string[] {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const validate = new Ajv2020({
    allErrors: true,
    strict: false,
    formats: { date: validIsoDate, uri: validUri },
  }).compile(schema);
  if (validate(record)) return [];
  return (validate.errors ?? []).map((error) => {
    const location = error.instancePath || "record";
    return `Schema ${location}: ${error.message}.`;
  });
}

function forbiddenFieldErrors(value: unknown, pathName = "record"): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      forbiddenFieldErrors(item, `${pathName}[${index}]`),
    );
  }
  if (!value || typeof value !== "object") return [];

  const errors: string[] = [];
  for (const [key, child] of Object.entries(value)) {
    if (
      /^(?:api[-_]?key|authorization|cookies?|credentials?|password|secret|session|token)$/iu.test(
        key,
      )
    ) {
      errors.push(`Secret-bearing field is not allowed: ${pathName}.${key}.`);
    }
    errors.push(...forbiddenFieldErrors(child, `${pathName}.${key}`));
  }
  return errors;
}

function parseRecord(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new ResourceVerificationError(
      `Committed verification record is not valid JSON: ${filePath} (${error instanceof Error ? error.message : "unknown parse error"}).`,
    );
  }
}

export function discoverCommittedVerificationRecordPaths(
  directory = COMMITTED_RESOURCE_VERIFICATIONS_DIRECTORY,
): readonly string[] {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right, "en"));
}

export function validateCommittedVerificationRecords(
  records: readonly unknown[],
): CommittedVerificationBatch {
  const errors: string[] = [];
  const eligible: ResourceVerificationRecord[] = [];
  const seenResourceIds = new Set<string>();

  if (records.length > 3) {
    errors.push(
      "Committed verification batches may contain at most 3 records per approved promotion slice.",
    );
  }

  for (const [index, record] of records.entries()) {
    const label = `records[${index}]`;
    errors.push(...forbiddenFieldErrors(record, label));
    const shapeErrors = schemaErrors(record);
    errors.push(...shapeErrors.map((error) => `${label}: ${error}`));
    if (shapeErrors.length > 0 || !record || typeof record !== "object") {
      continue;
    }

    const typedRecord = record as ResourceVerificationRecord;
    if (seenResourceIds.has(typedRecord.resourceId)) {
      errors.push(`${label}: duplicate resourceId ${typedRecord.resourceId}.`);
      continue;
    }
    seenResourceIds.add(typedRecord.resourceId);

    const semantic = validateResourceVerificationRecord(typedRecord);
    errors.push(...semantic.errors.map((error) => `${label}: ${error}`));
    if (!semantic.valid || !semantic.eligibleForPromotion) {
      errors.push(
        `${label}: committed records must be completed and eligible for promotion.`,
      );
      continue;
    }
    eligible.push(typedRecord);
  }

  return {
    valid: errors.length === 0,
    records: eligible,
    errors,
  };
}

export function loadCommittedVerificationRecords(
  directory = COMMITTED_RESOURCE_VERIFICATIONS_DIRECTORY,
): CommittedVerificationBatch {
  const paths = discoverCommittedVerificationRecordPaths(directory);
  const batch = validateCommittedVerificationRecords(paths.map(parseRecord));
  if (!batch.valid) {
    throw new ResourceVerificationError(
      `Committed verification batch is invalid:\n${batch.errors.map((error) => ` - ${error}`).join("\n")}`,
    );
  }
  return batch;
}

const committedVerificationBatch = loadCommittedVerificationRecords();
const committedVerificationByResourceId = new Map(
  committedVerificationBatch.records.map((record) => [
    record.resourceId,
    record,
  ]),
);

export function getCommittedVerificationRecord(
  resourceId: string,
): ResourceVerificationRecord | null {
  return committedVerificationByResourceId.get(resourceId) ?? null;
}
