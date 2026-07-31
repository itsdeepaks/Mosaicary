import assert from "node:assert/strict";
import test from "node:test";
import {
  getAllIntelligenceProfiles,
  getIntelligenceBadge,
  getIntelligenceProfile,
} from "../lib/intelligence.ts";

test("getIntelligenceProfile resolves all 20 pilot resource profiles", () => {
  const all = getAllIntelligenceProfiles();
  assert.equal(all.length, 20, "Must have 20 intelligence profiles");

  for (const profile of all) {
    const resolved = getIntelligenceProfile(profile.resourceId);
    assert.ok(resolved, `Profile for ${profile.resourceId} must be resolvable`);
    assert.equal(resolved.resourceId, profile.resourceId);
  }
});

test("getIntelligenceBadge returns appropriate human-readable indicator", () => {
  const landingfolioProfile = getIntelligenceProfile("landingfolio");
  assert.ok(landingfolioProfile);
  assert.equal(
    getIntelligenceBadge(landingfolioProfile),
    "MCP Enabled",
    "Landingfolio should have MCP Enabled badge",
  );

  const v0Profile = getIntelligenceProfile("v0");
  assert.ok(v0Profile);
  assert.equal(
    getIntelligenceBadge(v0Profile),
    "AI Builder",
    "v0 should have AI Builder badge",
  );
});
