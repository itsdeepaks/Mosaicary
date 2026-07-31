import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildReleaseCatalogue } from "./release-catalogue-lib.mjs";

export const CANDIDATE_SOURCE_PATH = "lib_data/resource-media-candidates.json";
export const CANDIDATE_SCHEMA_PATH =
  "schemas/resource-media-candidates.schema.json";
export const CANDIDATE_REPORT_JSON_PATH =
  "docs/reports/resource-media-candidate-review.json";
export const CANDIDATE_REPORT_MD_PATH =
  "docs/reports/resource-media-candidate-review.md";

export const ALLOWED_RASTER_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const DISCOVERY_STATUSES = new Set([
  "pending",
  "candidate",
  "blocked",
  "failed",
  "no-raster-media",
  "uncertain",
  "rejected",
]);
const REVIEWER_STATUSES = new Set([
  "unreviewed",
  "needs-review",
  "approved-for-copy",
  "rejected",
]);
const MAX_URL_LENGTH = 2048;
const MAX_RESOURCES = 50;
const MAX_REDIRECTS = 3;
const RECORD_KEYS = new Set([
  "resourceId",
  "resourceName",
  "canonicalUrl",
  "sourcePageUrl",
  "checkedAt",
  "discoveryStatus",
  "reviewerStatus",
  "redirects",
  "preview",
  "favicon",
  "issues",
  "notes",
]);
const PREVIEW_KEYS = new Set([
  "url",
  "source",
  "contentType",
  "provenance",
  "checkedAt",
]);
const FAVICON_KEYS = new Set(["url", "contentType", "provenance", "checkedAt"]);

function repoRootFromModule() {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), "../..");
}

function issue(code, message, details = {}) {
  return { code, message, ...details };
}

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function unexpectedKeys(value, allowed) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }
  return Object.keys(value).filter((key) => !allowed.has(key));
}

function unsafeHostname(hostname) {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal") ||
    normalized === "metadata.google.internal"
  );
}

export function validateCandidateUrl(value) {
  if (typeof value !== "string" || value.length === 0) {
    return "URL must be a non-empty string.";
  }
  if (value.length > MAX_URL_LENGTH) {
    return `URL exceeds ${MAX_URL_LENGTH} characters.`;
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return "URL is not valid.";
  }

  if (url.protocol !== "https:") {
    return "Only HTTPS URLs are allowed.";
  }
  if (url.username || url.password) {
    return "URL credentials are not allowed.";
  }
  if (url.port && url.port !== "443") {
    return "Only the default HTTPS port is allowed.";
  }
  if (net.isIP(url.hostname) !== 0) {
    return "Literal IP hosts are not allowed.";
  }
  if (unsafeHostname(url.hostname)) {
    return "Local or private-style hostnames are not allowed.";
  }
  return null;
}

function validateMedia(value, label, { preview = false } = {}) {
  const errors = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [issue(`invalid-${label}`, `${label} must be an object.`)];
  }
  const allowed = preview ? PREVIEW_KEYS : FAVICON_KEYS;
  for (const key of unexpectedKeys(value, allowed)) {
    errors.push(
      issue(
        `unexpected-${label}-key`,
        `${label} contains unexpected key ${key}.`,
      ),
    );
  }
  const urlError = validateCandidateUrl(value.url);
  if (urlError) {
    errors.push(
      issue(`invalid-${label}-url`, `${label} URL is invalid: ${urlError}`),
    );
  }
  if (!ALLOWED_RASTER_TYPES.has(value.contentType)) {
    errors.push(
      issue(
        `invalid-${label}-content-type`,
        `${label} must use an approved raster content type.`,
      ),
    );
  }
  if (!new Set(["response-header", "manual-review"]).has(value.provenance)) {
    errors.push(
      issue(`invalid-${label}-provenance`, `${label} provenance is invalid.`),
    );
  }
  if (!validDate(value.checkedAt)) {
    errors.push(
      issue(`invalid-${label}-date`, `${label} checkedAt must be an ISO date.`),
    );
  }
  if (preview && !new Set(["manual", "open-graph"]).has(value.source)) {
    errors.push(
      issue(
        "invalid-preview-source",
        "Preview source must be manual or open-graph.",
      ),
    );
  }
  if (
    preview &&
    value.source === "open-graph" &&
    value.provenance !== "response-header"
  ) {
    errors.push(
      issue(
        "invalid-open-graph-provenance",
        "Open Graph candidates require response-header provenance.",
      ),
    );
  }
  return errors;
}

export function validateCandidateSource(source, catalogueResources) {
  const errors = [];
  const warnings = [];

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return {
      errors: [
        issue(
          "invalid-candidate-source",
          "Candidate source must be an object.",
        ),
      ],
      warnings,
    };
  }
  for (const key of Object.keys(source).filter(
    (key) => !new Set(["version", "resources"]).has(key),
  )) {
    errors.push(
      issue(
        "unexpected-candidate-source-key",
        `Candidate source contains unexpected key ${key}.`,
      ),
    );
  }
  if (source.version !== 1) {
    errors.push(
      issue("candidate-version", "Candidate source version must be 1."),
    );
  }
  if (!Array.isArray(source.resources)) {
    errors.push(
      issue(
        "candidate-resources",
        "Candidate source resources must be an array.",
      ),
    );
    return { errors, warnings };
  }
  if (source.resources.length > MAX_RESOURCES) {
    errors.push(
      issue(
        "candidate-count",
        `Candidate source may contain at most ${MAX_RESOURCES} records.`,
      ),
    );
  }

  const catalogueById = new Map(
    catalogueResources.map((resource) => [resource.id, resource]),
  );
  const seen = new Set();

  for (const [index, record] of source.resources.entries()) {
    const label = `Candidate ${record?.resourceId ?? index + 1}`;
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      errors.push(
        issue("invalid-candidate-record", `${label} must be an object.`),
      );
      continue;
    }
    for (const key of unexpectedKeys(record, RECORD_KEYS)) {
      errors.push(
        issue(
          "unexpected-candidate-key",
          `${label} contains unexpected key ${key}.`,
        ),
      );
    }
    if (
      typeof record.resourceId !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.resourceId)
    ) {
      errors.push(
        issue(
          "invalid-candidate-resource-id",
          `${label} has an invalid resource ID.`,
        ),
      );
      continue;
    }
    if (seen.has(record.resourceId)) {
      errors.push(
        issue(
          "duplicate-candidate-resource",
          `${label} duplicates resource ${record.resourceId}.`,
        ),
      );
    }
    seen.add(record.resourceId);

    const catalogueResource = catalogueById.get(record.resourceId);
    if (!catalogueResource) {
      errors.push(
        issue(
          "unknown-candidate-resource",
          `${label} references an unknown catalogue resource.`,
        ),
      );
      continue;
    }
    if (record.resourceName !== catalogueResource.name) {
      errors.push(
        issue(
          "candidate-name-mismatch",
          `${label} name does not match catalogue truth.`,
        ),
      );
    }
    if (record.canonicalUrl !== catalogueResource.url) {
      errors.push(
        issue(
          "candidate-url-mismatch",
          `${label} canonical URL does not match catalogue truth.`,
        ),
      );
    }

    for (const [field, value] of [
      ["canonical", record.canonicalUrl],
      ["source-page", record.sourcePageUrl],
    ]) {
      if (value === undefined) continue;
      const urlError = validateCandidateUrl(value);
      if (urlError) {
        errors.push(
          issue(
            `invalid-${field}-url`,
            `${label} ${field} URL is invalid: ${urlError}`,
          ),
        );
      }
    }

    if (!DISCOVERY_STATUSES.has(record.discoveryStatus)) {
      errors.push(
        issue(
          "invalid-discovery-status",
          `${label} has an invalid discovery status.`,
        ),
      );
    }
    if (!REVIEWER_STATUSES.has(record.reviewerStatus)) {
      errors.push(
        issue(
          "invalid-reviewer-status",
          `${label} has an invalid reviewer status.`,
        ),
      );
    }

    if (record.redirects !== undefined) {
      if (
        !Array.isArray(record.redirects) ||
        record.redirects.length > MAX_REDIRECTS
      ) {
        errors.push(
          issue(
            "invalid-redirects",
            `${label} redirects must contain at most ${MAX_REDIRECTS} URLs.`,
          ),
        );
      } else {
        const redirectSet = new Set();
        for (const redirect of record.redirects) {
          const urlError = validateCandidateUrl(redirect);
          if (urlError) {
            errors.push(
              issue(
                "invalid-redirect-url",
                `${label} redirect URL is invalid: ${urlError}`,
              ),
            );
          }
          if (redirectSet.has(redirect)) {
            errors.push(
              issue(
                "duplicate-redirect",
                `${label} contains a duplicate redirect URL.`,
              ),
            );
          }
          redirectSet.add(redirect);
        }
      }
    }

    if (record.preview !== undefined) {
      errors.push(
        ...validateMedia(record.preview, "preview", { preview: true }).map(
          (entry) => ({ ...entry, resourceId: record.resourceId }),
        ),
      );
    }
    if (record.favicon !== undefined) {
      errors.push(
        ...validateMedia(record.favicon, "favicon").map((entry) => ({
          ...entry,
          resourceId: record.resourceId,
        })),
      );
    }

    const hasMedia = Boolean(record.preview || record.favicon);
    if (record.discoveryStatus === "pending") {
      if (record.reviewerStatus !== "unreviewed") {
        errors.push(
          issue(
            "pending-reviewer-status",
            `${label} pending records must be unreviewed.`,
          ),
        );
      }
      if (record.checkedAt || record.sourcePageUrl || hasMedia) {
        errors.push(
          issue(
            "pending-has-discovery-data",
            `${label} pending records cannot contain discovered media or checked metadata.`,
          ),
        );
      }
    } else {
      if (!validDate(record.checkedAt)) {
        errors.push(
          issue(
            "invalid-candidate-date",
            `${label} checkedAt must be present after discovery.`,
          ),
        );
      }
      if (!record.sourcePageUrl) {
        errors.push(
          issue(
            "missing-source-page",
            `${label} must record the fetched source page.`,
          ),
        );
      }
    }

    if (record.discoveryStatus === "candidate" && !hasMedia) {
      errors.push(
        issue(
          "candidate-without-media",
          `${label} candidate status requires preview or favicon media.`,
        ),
      );
    }
    if (record.discoveryStatus !== "candidate" && hasMedia) {
      errors.push(
        issue(
          "media-without-candidate-status",
          `${label} may contain media only with candidate status.`,
        ),
      );
    }
    if (
      record.reviewerStatus === "approved-for-copy" &&
      record.discoveryStatus !== "candidate"
    ) {
      errors.push(
        issue(
          "invalid-approval-transition",
          `${label} can be approved for copy only when it is a valid candidate.`,
        ),
      );
    }
    if (record.reviewerStatus === "approved-for-copy" && !hasMedia) {
      errors.push(
        issue(
          "approval-without-media",
          `${label} approval requires reviewed media.`,
        ),
      );
    }
    if (
      record.discoveryStatus === "candidate" &&
      record.reviewerStatus === "unreviewed"
    ) {
      warnings.push(
        issue(
          "candidate-not-queued",
          `${label} has media but is not queued for review.`,
        ),
      );
    }
    if (
      new Set([
        "blocked",
        "failed",
        "no-raster-media",
        "uncertain",
        "rejected",
      ]).has(record.discoveryStatus) &&
      (!Array.isArray(record.issues) || record.issues.length === 0)
    ) {
      errors.push(
        issue(
          "missing-candidate-issues",
          `${label} must explain its non-candidate outcome.`,
        ),
      );
    }
  }

  return { errors, warnings };
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function countBy(records, field) {
  return Object.fromEntries(
    [...new Set(records.map((record) => record[field]))]
      .sort()
      .map((value) => [
        value,
        records.filter((record) => record[field] === value).length,
      ]),
  );
}

function normalizeRecord(record) {
  const normalized = {
    resourceId: record.resourceId,
    resourceName: record.resourceName,
    canonicalUrl: record.canonicalUrl,
    discoveryStatus: record.discoveryStatus,
    reviewerStatus: record.reviewerStatus,
  };
  for (const key of [
    "sourcePageUrl",
    "checkedAt",
    "redirects",
    "preview",
    "favicon",
    "issues",
    "notes",
  ]) {
    if (record[key] !== undefined) normalized[key] = record[key];
  }
  return normalized;
}

export function buildReviewReport({
  candidateSource,
  approvedSource,
  catalogueResources,
  candidateSourceBuffer,
}) {
  const validation = validateCandidateSource(
    candidateSource,
    catalogueResources,
  );
  const catalogueOrder = new Map(
    catalogueResources.map((resource, index) => [resource.id, index]),
  );
  const records = [...(candidateSource.resources ?? [])]
    .sort(
      (left, right) =>
        (catalogueOrder.get(left.resourceId) ?? Infinity) -
        (catalogueOrder.get(right.resourceId) ?? Infinity),
    )
    .map(normalizeRecord);
  const approvedIds = new Set(
    (approvedSource.resources ?? []).map((resource) => resource.resourceId),
  );
  const candidateIds = new Set(
    records
      .filter((record) => record.discoveryStatus === "candidate")
      .map((record) => record.resourceId),
  );
  const overlap = [...candidateIds]
    .filter((resourceId) => approvedIds.has(resourceId))
    .sort();
  if (overlap.length > 0) {
    validation.warnings.push(
      issue(
        "candidate-already-approved",
        `Candidate source contains ${overlap.length} resource(s) already present in approved media.`,
        { resourceIds: overlap },
      ),
    );
  }

  return {
    version: 1,
    source: {
      path: CANDIDATE_SOURCE_PATH,
      sha256: sha256(candidateSourceBuffer),
      recordCount: records.length,
    },
    approvedSource: {
      path: "lib_data/resource-media.json",
      approvedCount: approvedSource.resources?.length ?? 0,
    },
    summary: {
      approvedProduction: approvedSource.resources?.length ?? 0,
      reviewTargets: records.length,
      discoveredCandidates: records.filter(
        (record) => record.discoveryStatus === "candidate",
      ).length,
      readyForCopy: records.filter(
        (record) => record.reviewerStatus === "approved-for-copy",
      ).length,
      pending: records.filter((record) => record.discoveryStatus === "pending")
        .length,
      blockedOrUnresolved: records.filter((record) =>
        new Set(["blocked", "failed", "no-raster-media", "uncertain"]).has(
          record.discoveryStatus,
        ),
      ).length,
      rejected: records.filter(
        (record) =>
          record.discoveryStatus === "rejected" ||
          record.reviewerStatus === "rejected",
      ).length,
      errors: validation.errors.length,
      warnings: validation.warnings.length,
    },
    counts: {
      byDiscoveryStatus: countBy(records, "discoveryStatus"),
      byReviewerStatus: countBy(records, "reviewerStatus"),
    },
    records,
    issues: validation,
  };
}

export function serializeReport(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

export function renderReviewMarkdown(report) {
  const lines = [
    "# Resource media candidate review",
    "",
    "> Generated deterministically from repository-managed candidate and approved-media sources. Candidate records never enrich production catalogue data automatically.",
    "",
    "## Summary",
    "",
    `- Approved production records: **${report.summary.approvedProduction}**`,
    `- Review targets: **${report.summary.reviewTargets}**`,
    `- Discovered candidates: **${report.summary.discoveredCandidates}**`,
    `- Approved for manual copy: **${report.summary.readyForCopy}**`,
    `- Pending discovery: **${report.summary.pending}**`,
    `- Blocked or unresolved: **${report.summary.blockedOrUnresolved}**`,
    `- Rejected: **${report.summary.rejected}**`,
    `- Validation errors: **${report.summary.errors}**`,
    `- Validation warnings: **${report.summary.warnings}**`,
    "",
    "## Review queue",
    "",
    "| Resource | Discovery | Review | Preview | Favicon | Notes / issues |",
    "|---|---|---|---|---|---|",
  ];

  for (const record of report.records) {
    const notes = [
      ...(record.issues ?? []).map(
        (entry) => `${entry.code}: ${entry.message}`,
      ),
      ...(record.notes ?? []),
    ].join("; ");
    lines.push(
      `| ${record.resourceName} (\`${record.resourceId}\`) | ${record.discoveryStatus} | ${record.reviewerStatus} | ${record.preview ? `[${record.preview.contentType}](${record.preview.url})` : "—"} | ${record.favicon ? `[${record.favicon.contentType}](${record.favicon.url})` : "—"} | ${notes || "—"} |`,
    );
  }

  lines.push(
    "",
    "## Approval boundary",
    "",
    "A reviewer may copy a record into `lib_data/resource-media.json` only after changing `reviewerStatus` to `approved-for-copy` and independently verifying the source page, final raster response headers, visual suitability, and rights/takedown considerations. The review script never performs that copy.",
    "",
  );
  if (report.issues.errors.length > 0 || report.issues.warnings.length > 0) {
    lines.push("## Validation findings", "");
    for (const entry of report.issues.errors) {
      lines.push(`- **ERROR ${entry.code}:** ${entry.message}`);
    }
    for (const entry of report.issues.warnings) {
      lines.push(`- **WARNING ${entry.code}:** ${entry.message}`);
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

export async function buildRepositoryReview(options = {}) {
  const root = options.root ?? repoRootFromModule();
  const [candidateSourceBuffer, approvedSourceText, release] =
    await Promise.all([
      readFile(path.join(root, CANDIDATE_SOURCE_PATH)),
      readFile(path.join(root, "lib_data/resource-media.json"), "utf8"),
      buildReleaseCatalogue({ root }),
    ]);
  let candidateSource;
  try {
    candidateSource = JSON.parse(candidateSourceBuffer.toString("utf8"));
  } catch (error) {
    const report = {
      version: 1,
      source: {
        path: CANDIDATE_SOURCE_PATH,
        sha256: sha256(candidateSourceBuffer),
        recordCount: 0,
      },
      approvedSource: {
        path: "lib_data/resource-media.json",
        approvedCount: 0,
      },
      summary: {
        approvedProduction: 0,
        reviewTargets: 0,
        discoveredCandidates: 0,
        readyForCopy: 0,
        pending: 0,
        blockedOrUnresolved: 0,
        rejected: 0,
        errors: 1,
        warnings: 0,
      },
      counts: { byDiscoveryStatus: {}, byReviewerStatus: {} },
      records: [],
      issues: {
        errors: [
          issue("candidate-json", "Candidate source is not valid JSON.", {
            reason:
              error instanceof Error ? error.message : "Unknown JSON error",
          }),
        ],
        warnings: [],
      },
    };
    return {
      report,
      reportJson: serializeReport(report),
      reportMarkdown: renderReviewMarkdown(report),
    };
  }
  const approvedSource = JSON.parse(approvedSourceText);
  const report = buildReviewReport({
    candidateSource,
    approvedSource,
    catalogueResources: release.catalogue.resources,
    candidateSourceBuffer,
  });
  return {
    report,
    reportJson: serializeReport(report),
    reportMarkdown: renderReviewMarkdown(report),
  };
}
