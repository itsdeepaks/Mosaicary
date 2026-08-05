import assert from "node:assert/strict";
import test from "node:test";
import { validateIntelligenceProfiles } from "../scripts/check-intelligence-profiles.mjs";

test("validateIntelligenceProfiles verifies individual and batched profiles against schema and catalogue", () => {
  const report = validateIntelligenceProfiles();
  assert.equal(report.totalScanned, 40);
  assert.equal(report.individualProfileCount, 20);
  assert.equal(report.batchFileCount, 2);
  assert.equal(report.batchProfileCount, 20);
  assert.equal(report.validCount, 40);
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors, null, 2));
});
