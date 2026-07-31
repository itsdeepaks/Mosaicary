import assert from "node:assert/strict";
import test from "node:test";
import { validateIntelligenceProfiles } from "../scripts/check-intelligence-profiles.mjs";

test("validateIntelligenceProfiles verifies all dataset files against schema and catalogue", () => {
  const report = validateIntelligenceProfiles();
  assert.equal(
    report.totalScanned,
    20,
    "Pilot dataset must contain 20 profiles",
  );
  assert.equal(
    report.validCount,
    20,
    "All 20 profiles must pass schema and link validation",
  );
  assert.equal(report.errors.length, 0, "There should be 0 validation errors");
});
