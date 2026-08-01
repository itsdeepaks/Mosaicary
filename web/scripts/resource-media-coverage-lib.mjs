import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  buildReleaseCatalogue,
  MEDIA_SOURCE_PATH,
} from "./release-catalogue-lib.mjs";

export const COVERAGE_SCHEMA_PATH =
  "schemas/resource-media-coverage.schema.json";
export const COVERAGE_SOURCE_PATH = "lib_data/resource-media-coverage.json";

const dispositions = new Set([
  "pending",
  "approved-media",
  "no-suitable-raster",
  "blocked",
  "failed",
  "rejected",
]);
const terminalWithoutMedia = new Set([
  "no-suitable-raster",
  "blocked",
  "failed",
  "rejected",
]);
const identifierPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function issue(code, message) {
  return { code, message };
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function approvedCheckedAt(record) {
  return [record.preview?.checkedAt, record.favicon?.checkedAt]
    .filter(Boolean)
    .sort()
    .at(-1);
}

export function serializeMediaCoverage(coverage) {
  return `${JSON.stringify(coverage, null, 2)}\n`;
}

export function composeMediaCoverage({
  approvedSource,
  catalogueResources,
  previousCoverage,
}) {
  const approvedById = new Map(
    approvedSource.resources.map((record) => [record.resourceId, record]),
  );
  const previousById = new Map(
    (previousCoverage?.resources ?? []).map((record) => [
      record.resourceId,
      record,
    ]),
  );

  return {
    version: 1,
    resources: catalogueResources.map((resource) => {
      const approved = approvedById.get(resource.id);
      if (approved) {
        return {
          resourceId: resource.id,
          disposition: "approved-media",
          checkedAt: approvedCheckedAt(approved),
        };
      }

      const previous = previousById.get(resource.id);
      if (
        previous &&
        previous.disposition !== "approved-media" &&
        dispositions.has(previous.disposition)
      ) {
        return structuredClone(previous);
      }

      return { resourceId: resource.id, disposition: "pending" };
    }),
  };
}

export function validateMediaCoverage({
  approvedSource,
  catalogueResources,
  coverage,
}) {
  const issues = [];
  if (
    !coverage ||
    typeof coverage !== "object" ||
    coverage.version !== 1 ||
    !Array.isArray(coverage.resources)
  ) {
    return [
      issue(
        "invalid-coverage-root",
        "Coverage must be a version 1 resource array.",
      ),
    ];
  }

  const catalogueById = new Map(
    catalogueResources.map((resource) => [resource.id, resource]),
  );
  const approvedIds = new Set(
    approvedSource.resources.map((record) => record.resourceId),
  );
  const seen = new Set();

  coverage.resources.forEach((record, index) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      issues.push(
        issue(
          "invalid-coverage-record",
          `Coverage record ${index + 1} must be an object.`,
        ),
      );
      return;
    }
    const allowedKeys = new Set([
      "resourceId",
      "disposition",
      "checkedAt",
      "notes",
    ]);
    if (Object.keys(record).some((key) => !allowedKeys.has(key))) {
      issues.push(
        issue(
          "invalid-coverage-record",
          `Coverage record ${index + 1} contains unknown fields.`,
        ),
      );
    }
    if (!identifierPattern.test(record.resourceId ?? "")) {
      issues.push(
        issue(
          "invalid-coverage-resource",
          `Coverage record ${index + 1} has an invalid resource ID.`,
        ),
      );
    }
    if (seen.has(record.resourceId)) {
      issues.push(
        issue(
          "duplicate-coverage-resource",
          `Coverage repeats ${record.resourceId}.`,
        ),
      );
    }
    seen.add(record.resourceId);
    if (!catalogueById.has(record.resourceId)) {
      issues.push(
        issue(
          "unknown-coverage-resource",
          `Coverage references unknown resource ${record.resourceId}.`,
        ),
      );
    }
    if (!dispositions.has(record.disposition)) {
      issues.push(
        issue(
          "invalid-coverage-disposition",
          `Coverage for ${record.resourceId} has an invalid disposition.`,
        ),
      );
    }
    if (record.disposition === "pending" && record.checkedAt !== undefined) {
      issues.push(
        issue(
          "pending-coverage-date",
          `Pending coverage ${record.resourceId} must not have checkedAt.`,
        ),
      );
    }
    if (record.disposition !== "pending" && !validDate(record.checkedAt)) {
      issues.push(
        issue(
          "missing-coverage-date",
          `Terminal coverage ${record.resourceId} requires a valid checkedAt date.`,
        ),
      );
    }
    if (
      record.notes !== undefined &&
      (!Array.isArray(record.notes) ||
        record.notes.length > 10 ||
        record.notes.some(
          (note) =>
            typeof note !== "string" || note.length === 0 || note.length > 500,
        ))
    ) {
      issues.push(
        issue(
          "invalid-coverage-notes",
          `Coverage notes for ${record.resourceId} are invalid.`,
        ),
      );
    }
    if (
      record.disposition === "approved-media" &&
      !approvedIds.has(record.resourceId)
    ) {
      issues.push(
        issue(
          "unapproved-media-disposition",
          `Coverage marks ${record.resourceId} approved without approved production media.`,
        ),
      );
    }
    if (
      terminalWithoutMedia.has(record.disposition) &&
      approvedIds.has(record.resourceId)
    ) {
      issues.push(
        issue(
          "approved-media-terminal-conflict",
          `Coverage marks approved resource ${record.resourceId} without media.`,
        ),
      );
    }
    const expectedId = catalogueResources[index]?.id;
    if (expectedId && record.resourceId !== expectedId) {
      issues.push(
        issue(
          "coverage-order-drift",
          `Coverage index ${index + 1} must be ${expectedId}.`,
        ),
      );
    }
  });

  for (const resource of catalogueResources) {
    if (!seen.has(resource.id)) {
      issues.push(
        issue(
          "missing-coverage-resource",
          `Coverage is missing ${resource.id}.`,
        ),
      );
    }
  }
  for (const approvedId of approvedIds) {
    const record = coverage.resources.find(
      (entry) => entry.resourceId === approvedId,
    );
    if (record?.disposition !== "approved-media") {
      issues.push(
        issue(
          "missing-approved-media-disposition",
          `Approved resource ${approvedId} must use approved-media.`,
        ),
      );
    }
  }

  return issues;
}

export function summarizeMediaCoverage(coverage) {
  const summary = {
    total: coverage.resources.length,
    approvedMedia: 0,
    pending: 0,
    terminalWithoutMedia: 0,
  };
  for (const record of coverage.resources) {
    if (record.disposition === "approved-media") summary.approvedMedia += 1;
    else if (record.disposition === "pending") summary.pending += 1;
    else if (terminalWithoutMedia.has(record.disposition)) {
      summary.terminalWithoutMedia += 1;
    }
  }
  return summary;
}

export function selectPendingMediaBatch(coverage, { after, limit = 20 } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
    throw new Error("Batch limit must be between 1 and 20.");
  }
  let startIndex = 0;
  if (after) {
    const index = coverage.resources.findIndex(
      (record) => record.resourceId === after,
    );
    if (index === -1) throw new Error(`Unknown --after resource ID: ${after}`);
    startIndex = index + 1;
  }
  return coverage.resources
    .slice(startIndex)
    .filter((record) => record.disposition === "pending")
    .slice(0, limit);
}

export async function buildRepositoryMediaCoverage({ root }) {
  const release = await buildReleaseCatalogue({ root });
  const [approvedSource, coverage] = await Promise.all([
    readFile(path.join(root, MEDIA_SOURCE_PATH), "utf8").then(JSON.parse),
    readFile(path.join(root, COVERAGE_SOURCE_PATH), "utf8").then(JSON.parse),
  ]);
  const catalogueResources = release.catalogue.resources;
  const issues = validateMediaCoverage({
    approvedSource,
    catalogueResources,
    coverage,
  });
  return {
    approvedSource,
    catalogueResources,
    coverage,
    issues,
    summary: summarizeMediaCoverage(coverage),
  };
}
