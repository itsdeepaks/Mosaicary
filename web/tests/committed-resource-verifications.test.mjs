import assert from "node:assert/strict";
import test from "node:test";

import {
  discoverCommittedVerificationRecordPaths,
  getCommittedVerificationRecord,
  loadCommittedVerificationRecords,
  validateCommittedVerificationRecords,
} from "../lib/committed-resource-verifications.ts";
import { createResourceVerificationDraft } from "../lib/resource-verification.ts";
import { getSourceCoverageCounts } from "../lib/source-profiles.ts";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function eligibleRecord(identifier = "google-fonts") {
  const record = createResourceVerificationDraft({
    identifier,
    reviewerId: "operator-1",
    startedAt: "2026-08-06",
  });
  record.status = "completed";
  record.completedAt = "2026-08-06";
  record.availabilityCheck = {
    ...record.availabilityCheck,
    result: "passed",
    method: "manual-browser",
    checkedAt: "2026-08-06",
    notes: "Observed the canonical destination manually.",
  };
  record.claimChecks = record.claimChecks.map((check) => ({
    ...check,
    result: "confirmed",
    method: "document-review",
    checkedAt: "2026-08-06",
    notes: "Reviewed the linked official source.",
  }));
  record.interfaceChecks = record.interfaceChecks.map((check) => ({
    ...check,
    result: "passed",
    method: "manual-api-test",
    checkedAt: "2026-08-06",
    notes: "Reviewed without recording credentials.",
  }));
  record.governanceCheck = {
    persistence: "confirmed",
    redistribution: "confirmed",
    attribution: "confirmed",
    terms: "confirmed",
    termsUrl: "https://developers.google.com/fonts/faq/privacy",
    checkedAt: "2026-08-06",
    notes: "Reviewed current official governance material.",
  };
  record.limitationsReviewed = true;
  record.freshness = { status: "current", recheckBy: "2026-11-04" };
  record.decision = "verified";
  record.decisionNotes = "All required human checks passed.";
  return record;
}

test("the committed verification directory is deterministic and empty at the current baseline", () => {
  assert.deepEqual(discoverCommittedVerificationRecordPaths(), []);
  assert.deepEqual(loadCommittedVerificationRecords(), {
    valid: true,
    records: [],
    errors: [],
  });
  assert.equal(getCommittedVerificationRecord("resource-75ecf91b7063"), null);
  assert.deepEqual(getSourceCoverageCounts(), {
    listed: 255,
    profiled: 40,
    verified: 0,
  });
});

test("an independently complete synthetic record is eligible for future canonical promotion", () => {
  const record = eligibleRecord();
  const batch = validateCommittedVerificationRecords([record]);
  assert.equal(batch.valid, true, batch.errors.join("\n"));
  assert.deepEqual(batch.records, [record]);
});

test("committed promotion batches are capped at three eligible records", () => {
  const batch = validateCommittedVerificationRecords([
    eligibleRecord("google-fonts"),
    eligibleRecord("shadcn-ui"),
    eligibleRecord("motion"),
    eligibleRecord("who-can-use"),
  ]);
  assert.equal(batch.valid, false);
  assert.match(batch.errors.join("\n"), /at most 3 records/u);
});

test("the committed batch rejects stale, duplicate, unknown, ineligible, and secret-bearing records", () => {
  const record = eligibleRecord();
  const stale = clone(record);
  stale.profileSha256 = "0".repeat(64);
  const unknown = clone(eligibleRecord("shadcn-ui"));
  unknown.resourceId = "resource-ffffffffffff";
  const needsReview = clone(eligibleRecord("motion"));
  needsReview.decision = "needs-review";
  const secretBearing = clone(eligibleRecord("who-can-use"));
  secretBearing.credentials = "must-not-be-stored";

  const batch = validateCommittedVerificationRecords([
    stale,
    unknown,
    needsReview,
    secretBearing,
    record,
    clone(record),
  ]);
  assert.equal(batch.valid, false);
  assert.match(batch.errors.join("\n"), /profileSha256 is stale/u);
  assert.match(batch.errors.join("\n"), /Unknown Tessli source/u);
  assert.match(batch.errors.join("\n"), /eligible for promotion/u);
  assert.match(batch.errors.join("\n"), /Secret-bearing field/u);
  assert.match(batch.errors.join("\n"), /duplicate resourceId/u);
});
