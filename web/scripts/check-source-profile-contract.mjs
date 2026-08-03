import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import catalogue from "../data/catalogue.json" with { type: "json" };
import {
  SOURCE_PROFILE_CONTRACT_VERSION,
  SOURCE_PROFILE_REVIEWED_AT,
  SOURCE_TYPES,
  getAllSourceProfiles,
  getSourceContractSummary,
  getSourceProfile,
} from "../lib/source-profiles.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "../../schemas/source-profile.schema.json");

function issue(code, message, details = {}) {
  return { code, message, ...details };
}

function validIsoDate(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(`${value}T00:00:00Z`))
  );
}

export function validateSourceProfileContract() {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const profiles = [...getAllSourceProfiles()];
  const summary = getSourceContractSummary();
  const errors = [];

  if (schema.$id !== "urn:tessli:schema:source-profile:v1") {
    errors.push(issue("schema-id", "Source profile schema ID is not canonical."));
  }
  if (schema.properties?.contractVersion?.const !== SOURCE_PROFILE_CONTRACT_VERSION) {
    errors.push(
      issue(
        "schema-version",
        "Source profile schema version does not match the runtime contract.",
      ),
    );
  }
  if (!validIsoDate(SOURCE_PROFILE_REVIEWED_AT)) {
    errors.push(
      issue("reviewed-at", "Source profile contract review date is invalid."),
    );
  }

  if (profiles.length !== catalogue.resources.length) {
    errors.push(
      issue(
        "resource-count",
        "Source profile count does not match the canonical catalogue.",
        { expected: catalogue.resources.length, actual: profiles.length },
      ),
    );
  }

  const ids = new Set();
  const slugs = new Set();
  const allowedSourceTypes = new Set(SOURCE_TYPES);
  const catalogueById = new Map(
    catalogue.resources.map((resource) => [resource.id, resource]),
  );

  for (const profile of profiles) {
    const catalogueResource = catalogueById.get(profile.id);
    if (!catalogueResource) {
      errors.push(
        issue("unknown-resource", `Unknown source profile resource: ${profile.id}.`),
      );
      continue;
    }

    if (ids.has(profile.id)) {
      errors.push(issue("duplicate-id", `Duplicate source profile ID: ${profile.id}.`));
    }
    if (slugs.has(profile.slug)) {
      errors.push(
        issue("duplicate-slug", `Duplicate source profile slug: ${profile.slug}.`),
      );
    }
    ids.add(profile.id);
    slugs.add(profile.slug);

    for (const key of [
      "slug",
      "name",
      "url",
      "domain",
      "description",
      "category",
      "access",
      "subscriptionRequired",
    ]) {
      if (profile[key] !== catalogueResource[key]) {
        errors.push(
          issue(
            "catalogue-drift",
            `${profile.id} does not preserve catalogue field ${key}.`,
          ),
        );
      }
    }

    if (!allowedSourceTypes.has(profile.sourceType)) {
      errors.push(
        issue(
          "source-type",
          `${profile.id} has unsupported source type ${profile.sourceType}.`,
        ),
      );
    }
    if (profile.sourceTypeBasis !== "category-classification") {
      errors.push(
        issue(
          "source-type-basis",
          `${profile.id} has an unsupported source type basis.`,
        ),
      );
    }

    if (profile.coverage.level === "listed" && profile.intelligence !== null) {
      errors.push(
        issue(
          "listed-has-intelligence",
          `${profile.id} is Listed despite having intelligence data.`,
        ),
      );
    }
    if (profile.coverage.level !== "listed" && profile.intelligence === null) {
      errors.push(
        issue(
          "profile-missing-intelligence",
          `${profile.id} has ${profile.coverage.level} coverage without intelligence data.`,
        ),
      );
    }

    if (profile.intelligence) {
      if (
        profile.intelligence.resourceId !== profile.id &&
        profile.intelligence.resourceId !== profile.slug
      ) {
        errors.push(
          issue(
            "intelligence-link",
            `${profile.id} is linked to unrelated intelligence ID ${profile.intelligence.resourceId}.`,
          ),
        );
      }
      if (profile.coverage.evidenceCount !== profile.intelligence.evidence.length) {
        errors.push(
          issue(
            "evidence-count",
            `${profile.id} evidence count does not match its intelligence profile.`,
          ),
        );
      }
      if (profile.coverage.lastVerifiedAt !== profile.intelligence.verifiedAt) {
        errors.push(
          issue(
            "verification-date",
            `${profile.id} verification date does not match its intelligence profile.`,
          ),
        );
      }
      if (
        profile.coverage.level === "verified" &&
        profile.coverage.humanReviewStatus !== "completed"
      ) {
        errors.push(
          issue(
            "verified-without-review",
            `${profile.id} is Verified without an explicit human-review record.`,
          ),
        );
      }
    } else if (
      profile.coverage.evidenceCount !== 0 ||
      profile.coverage.lastVerifiedAt !== null ||
      profile.coverage.confidence !== "unknown" ||
      profile.coverage.freshnessStatus !== "unknown" ||
      profile.coverage.humanReviewStatus !== "not-recorded"
    ) {
      errors.push(
        issue(
          "listed-evidence",
          `${profile.id} exposes verification claims without an intelligence profile.`,
        ),
      );
    }

    if (getSourceProfile(profile.id)?.slug !== profile.slug) {
      errors.push(
        issue("id-lookup", `${profile.id} does not resolve by stable ID.`),
      );
    }
    if (getSourceProfile(profile.slug)?.id !== profile.id) {
      errors.push(
        issue("slug-lookup", `${profile.id} does not resolve by slug.`),
      );
    }
  }

  const coverageTotal = Object.values(summary.coverageCounts).reduce(
    (total, count) => total + count,
    0,
  );
  if (coverageTotal !== profiles.length) {
    errors.push(
      issue(
        "coverage-total",
        "Coverage counts do not account for every source profile.",
      ),
    );
  }
  if (summary.intelligenceProfileCount !== 20) {
    errors.push(
      issue(
        "intelligence-count",
        "The current reviewed intelligence pilot must contain exactly 20 profiles.",
        { actual: summary.intelligenceProfileCount },
      ),
    );
  }
  if (
    summary.coverageCounts.listed !== 275 ||
    summary.coverageCounts.profiled !== 20 ||
    summary.coverageCounts.verified !== 0
  ) {
    errors.push(
      issue(
        "coverage-composition",
        "Coverage composition is not the truthful Slice 14.1 baseline.",
        { actual: summary.coverageCounts },
      ),
    );
  }

  return {
    valid: errors.length === 0,
    contractVersion: SOURCE_PROFILE_CONTRACT_VERSION,
    reviewedAt: SOURCE_PROFILE_REVIEWED_AT,
    resourceCount: profiles.length,
    intelligenceProfileCount: summary.intelligenceProfileCount,
    coverageCounts: summary.coverageCounts,
    errors,
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const report = validateSourceProfileContract();
  console.log(
    `Source profile contract: ${report.resourceCount} resources; ` +
      `${report.coverageCounts.listed} Listed, ` +
      `${report.coverageCounts.profiled} Profiled, ` +
      `${report.coverageCounts.verified} Verified.`,
  );

  if (!report.valid) {
    for (const error of report.errors) {
      console.error(` - [${error.code}] ${error.message}`);
    }
    process.exit(1);
  }
}
