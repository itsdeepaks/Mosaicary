import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import catalogue from "../data/catalogue.json" with { type: "json" };
import { getNativeResourceProfile } from "../lib/mcp-native-tools.ts";
import {
  SOURCE_PROFILE_CONTRACT_VERSION,
  SOURCE_PROFILE_REVIEWED_AT,
  SOURCE_TYPE_BY_CATEGORY,
  deriveCoverageLevel,
  getAllSourceProfiles,
  getSourceContractSummary,
  getSourceCoverageCounts,
  getSourceProfile,
} from "../lib/source-profiles.ts";
import { validateSourceProfileContract } from "../scripts/check-source-profile-contract.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(
  __dirname,
  "../../schemas/source-profile.schema.json",
);

test("source profile schema defines the canonical v1 coverage contract", () => {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  assert.equal(schema.$id, "urn:tessli:schema:source-profile:v1");
  assert.equal(
    schema.properties.contractVersion.const,
    SOURCE_PROFILE_CONTRACT_VERSION,
  );
  assert.deepEqual(schema.$defs.coverage.properties.level.enum, [
    "listed",
    "profiled",
    "verified",
  ]);
  assert.equal(SOURCE_PROFILE_REVIEWED_AT, "2026-08-04");
});

test("all 295 catalogue resources have one deterministic source profile", () => {
  const profiles = getAllSourceProfiles();
  assert.equal(profiles.length, 295);
  assert.equal(profiles.length, catalogue.resources.length);
  assert.equal(new Set(profiles.map((profile) => profile.id)).size, 295);
  assert.equal(new Set(profiles.map((profile) => profile.slug)).size, 295);

  for (const resource of catalogue.resources) {
    const profile = getSourceProfile(resource.id);
    assert.ok(profile);
    assert.equal(profile.slug, resource.slug);
    assert.equal(getSourceProfile(resource.slug)?.id, resource.id);
    assert.equal(profile.name, resource.name);
    assert.equal(profile.url, resource.url);
    assert.equal(profile.category, resource.category);
  }
});

test("coverage baseline is truthful: 275 Listed, 20 Profiled, 0 Verified", () => {
  assert.deepEqual(getSourceCoverageCounts(), {
    listed: 275,
    profiled: 20,
    verified: 0,
  });
  assert.deepEqual(getSourceContractSummary(), {
    contractVersion: 1,
    reviewedAt: "2026-08-04",
    resourceCount: 295,
    intelligenceProfileCount: 20,
    coverageCounts: {
      listed: 275,
      profiled: 20,
      verified: 0,
    },
  });
});

test("legacy verified status does not silently claim Verified coverage", () => {
  const relume = getSourceProfile("relume");
  assert.ok(relume?.intelligence);
  assert.equal(relume.intelligence.status, "verified");
  assert.equal(relume.coverage.level, "profiled");
  assert.equal(relume.coverage.humanReviewStatus, "not-recorded");
  assert.equal(relume.coverage.lastVerifiedAt, "2026-07-31");
  assert.equal(relume.coverage.freshnessStatus, "current");
  assert.equal(relume.coverage.confidence, "certain");
  assert.equal(
    deriveCoverageLevel(relume.intelligence, "completed"),
    "verified",
  );
});

test("Listed records expose no invented evidence, confidence, or timestamps", () => {
  const listed = getAllSourceProfiles().filter(
    (profile) => profile.coverage.level === "listed",
  );
  assert.equal(listed.length, 275);
  for (const profile of listed) {
    assert.equal(profile.intelligence, null);
    assert.equal(profile.coverage.profileStatus, null);
    assert.equal(profile.coverage.lastVerifiedAt, null);
    assert.equal(profile.coverage.confidence, "unknown");
    assert.equal(profile.coverage.freshnessStatus, "unknown");
    assert.equal(profile.coverage.humanReviewStatus, "not-recorded");
    assert.equal(profile.coverage.evidenceCount, 0);
  }
});

test("source type is a deterministic category classification, not provider fact", () => {
  assert.equal(Object.keys(SOURCE_TYPE_BY_CATEGORY).length, 11);
  for (const profile of getAllSourceProfiles()) {
    assert.equal(
      profile.sourceType,
      SOURCE_TYPE_BY_CATEGORY[profile.category],
    );
    assert.equal(profile.sourceTypeBasis, "category-classification");
  }
});

test("website-ready source profiles and MCP preserve the same source identity", () => {
  const sourceProfile = getSourceProfile("relume");
  const nativeProfile = getNativeResourceProfile("relume");
  assert.ok(sourceProfile);
  assert.equal(nativeProfile.resource.id, sourceProfile.id);
  assert.equal(nativeProfile.resource.slug, sourceProfile.slug);
  assert.equal(
    nativeProfile.intelligenceProfile?.resourceId,
    sourceProfile.intelligence?.resourceId,
  );
});

test("source profile validator accepts the complete deterministic baseline", () => {
  const report = validateSourceProfileContract();
  assert.equal(report.valid, true, JSON.stringify(report.errors, null, 2));
  assert.equal(report.resourceCount, 295);
  assert.equal(report.intelligenceProfileCount, 20);
  assert.deepEqual(report.coverageCounts, {
    listed: 275,
    profiled: 20,
    verified: 0,
  });
});
