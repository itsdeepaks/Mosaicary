import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";

import {
  RESOURCE_VERIFICATION_CONTRACT,
  ResourceVerificationError,
  createResourceVerificationDraft,
  stableJson,
  validateResourceVerificationRecord,
} from "../lib/resource-verification.ts";
import { getSourceCoverageCounts } from "../lib/source-profiles.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(
  __dirname,
  "../../schemas/resource-verification-record.schema.json",
);

function structuredCloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function completeRecord(draft, decision) {
  const record = structuredCloneJson(draft);
  record.status = "completed";
  record.completedAt = "2026-08-06";
  record.availabilityCheck = {
    ...record.availabilityCheck,
    result: decision === "verified" ? "passed" : "unknown",
    method: "manual-browser",
    checkedAt: "2026-08-06",
    notes: "Canonical destination reviewed manually.",
  };
  record.claimChecks = record.claimChecks.map((check) => ({
    ...check,
    result: decision === "verified" ? "confirmed" : "uncertain",
    method: "document-review",
    checkedAt: "2026-08-06",
    notes: "Official evidence reviewed.",
  }));
  record.interfaceChecks = record.interfaceChecks.map((check) => ({
    ...check,
    result: decision === "verified" ? "passed" : "unknown",
    method: "manual-api-test",
    checkedAt: "2026-08-06",
    notes: "Interface reviewed without recording credentials.",
  }));
  record.governanceCheck = {
    persistence: decision === "verified" ? "confirmed" : "uncertain",
    redistribution: decision === "verified" ? "confirmed" : "uncertain",
    attribution: decision === "verified" ? "confirmed" : "uncertain",
    terms: decision === "verified" ? "confirmed" : "uncertain",
    termsUrl: "https://developers.google.com/fonts/faq/privacy",
    checkedAt: "2026-08-06",
    notes: "Current official governance material reviewed.",
  };
  record.limitationsReviewed = true;
  record.freshness = {
    status: decision === "verified" ? "current" : "aging",
    recheckBy: "2026-11-04",
  };
  record.decision = decision;
  record.decisionNotes =
    decision === "verified"
      ? "All required checks passed for later promotion review."
      : "Material uncertainty remains; do not promote.";
  return record;
}

test("verification schema fixes the public v1 record shape", () => {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  assert.equal(
    schema.$id,
    "https://tessli.dev/schemas/resource-verification-record.schema.json",
  );
  assert.equal(
    schema.properties.contract.const,
    RESOURCE_VERIFICATION_CONTRACT,
  );
  assert.equal(schema.properties.recordVersion.const, 1);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.$defs.reviewer.properties.type.const, "human-operator");
  assert.deepEqual(schema.properties.decision.enum, [
    "pending",
    "verified",
    "needs-review",
    "rejected",
  ]);
});

test("draft generation is deterministic and bound to canonical profile evidence", () => {
  const input = {
    identifier: "google-fonts",
    reviewerId: "operator-1",
    reviewerDisplayName: "Operator One",
    startedAt: "2026-08-06",
  };
  const first = createResourceVerificationDraft(input);
  const second = createResourceVerificationDraft(input);

  assert.deepEqual(first, second);
  assert.equal(stableJson(first), stableJson(second));
  assert.equal(first.contract, RESOURCE_VERIFICATION_CONTRACT);
  assert.equal(first.resourceId, "resource-75ecf91b7063");
  assert.equal(first.resourceSlug, "google-fonts");
  assert.match(first.profileSha256, /^[a-f0-9]{64}$/u);
  assert.equal(first.profileReviewedAt, "2026-08-05");
  assert.equal(first.status, "draft");
  assert.equal(first.completedAt, null);
  assert.equal(first.decision, "pending");
  assert.equal(first.claimChecks.length, 2);
  assert.equal(first.interfaceChecks.length, 1);
  assert.equal(first.interfaceChecks[0].credentialHandling, "user-owned-not-recorded");
  assert.match(stableJson(first), /\n$/u);
});

test("generated drafts satisfy JSON Schema", () => {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  delete schema.$schema;
  const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
  const draft = createResourceVerificationDraft({
    identifier: "google-fonts",
    reviewerId: "operator-1",
    startedAt: "2026-08-06",
  });
  assert.equal(validate(draft), true, JSON.stringify(validate.errors, null, 2));
});

test("draft generation rejects unknown, Listed-only, and invalid reviewer input", () => {
  assert.throws(
    () =>
      createResourceVerificationDraft({
        identifier: "missing-source",
        reviewerId: "operator-1",
        startedAt: "2026-08-06",
      }),
    ResourceVerificationError,
  );
  assert.throws(
    () =>
      createResourceVerificationDraft({
        identifier: "awwwards",
        reviewerId: "operator-1",
        startedAt: "2026-08-06",
      }),
    /Listed only/u,
  );
  assert.throws(
    () =>
      createResourceVerificationDraft({
        identifier: "google-fonts",
        reviewerId: " ",
        startedAt: "2026-08-06",
      }),
    /reviewerId/u,
  );
});

test("stale profile fingerprints and incomplete completed records fail safely", () => {
  const draft = createResourceVerificationDraft({
    identifier: "google-fonts",
    reviewerId: "operator-1",
    startedAt: "2026-08-06",
  });
  const stale = structuredCloneJson(draft);
  stale.profileSha256 = "0".repeat(64);
  assert.match(
    validateResourceVerificationRecord(stale).errors.join(" "),
    /profileSha256 is stale/u,
  );

  const incomplete = structuredCloneJson(draft);
  incomplete.status = "completed";
  incomplete.completedAt = "2026-08-06";
  incomplete.decision = "verified";
  const result = validateResourceVerificationRecord(incomplete);
  assert.equal(result.valid, false);
  assert.equal(result.eligibleForPromotion, false);
  assert.match(result.errors.join(" "), /availability/u);
  assert.match(result.errors.join(" "), /pending claim/u);
  assert.match(result.errors.join(" "), /decisionNotes/u);
});

test("completed needs-review records are valid but never promotion eligible", () => {
  const draft = createResourceVerificationDraft({
    identifier: "google-fonts",
    reviewerId: "operator-1",
    startedAt: "2026-08-06",
  });
  const record = completeRecord(draft, "needs-review");
  const result = validateResourceVerificationRecord(record);
  assert.deepEqual(result, {
    valid: true,
    eligibleForPromotion: false,
    errors: [],
  });
});

test("only a complete verified record becomes eligible for later promotion", () => {
  const draft = createResourceVerificationDraft({
    identifier: "google-fonts",
    reviewerId: "operator-1",
    startedAt: "2026-08-06",
  });
  const record = completeRecord(draft, "verified");
  assert.deepEqual(validateResourceVerificationRecord(record), {
    valid: true,
    eligibleForPromotion: true,
    errors: [],
  });

  const contradicted = structuredCloneJson(record);
  contradicted.claimChecks[0].result = "contradicted";
  const result = validateResourceVerificationRecord(contradicted);
  assert.equal(result.valid, false);
  assert.equal(result.eligibleForPromotion, false);
  assert.match(result.errors.join(" "), /every claim/u);
});

test("Slice 1.5 leaves canonical coverage unchanged", () => {
  assert.deepEqual(getSourceCoverageCounts(), {
    listed: 255,
    profiled: 40,
    verified: 0,
  });
});
