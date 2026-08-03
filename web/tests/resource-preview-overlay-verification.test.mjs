import assert from "node:assert/strict";
import test from "node:test";

import {
  CHALLENGE_TERMS,
  OVERLAY_MAX_BYTES,
  OVERLAY_OUTPUT,
  OVERLAY_TARGETS,
  OVERLAY_VERIFICATION_BATCH,
  OVERLAY_VIEWPORT,
  SAFE_FINAL_ACTIONS,
  SAFE_NAVIGATION_ACTIONS,
  listSafeSnapshotCandidates,
  verifyInteractionCleared,
} from "../scripts/capture-resource-preview-overlay-verification.mjs";

test("overlay verification is fixed to the five prior consent failures", () => {
  assert.equal(OVERLAY_TARGETS.length, 5);
  assert.equal(new Set(OVERLAY_TARGETS.map((site) => site.resourceId)).size, 5);
  assert.equal(new Set(OVERLAY_TARGETS.map((site) => site.url)).size, 5);
  assert.equal(OVERLAY_VERIFICATION_BATCH, "overlay-v2-20260803");
  for (const site of OVERLAY_TARGETS) {
    assert.match(site.resourceId, /^resource-[a-f0-9]{12}$/);
    assert.equal(new URL(site.url).protocol, "https:");
    assert.ok(site.priorIssue.length > 0);
  }
});

test("capture output preserves the reviewed card-media boundary", () => {
  assert.deepEqual(OVERLAY_VIEWPORT, { width: 1440, height: 756 });
  assert.deepEqual(OVERLAY_OUTPUT, { width: 960, height: 504 });
  assert.equal(OVERLAY_VIEWPORT.width / OVERLAY_VIEWPORT.height, 40 / 21);
  assert.equal(OVERLAY_OUTPUT.width / OVERLAY_OUTPUT.height, 40 / 21);
  assert.equal(OVERLAY_MAX_BYTES, 307_200);
});

test("safe action lists contain no affirmative consent action", () => {
  const allActions = [...SAFE_FINAL_ACTIONS, ...SAFE_NAVIGATION_ACTIONS];
  const forbidden = new Set([
    "accept",
    "accept all",
    "allow all",
    "agree",
    "i agree",
    "consent",
    "save and accept",
  ]);
  assert.equal(
    allActions.some((action) => forbidden.has(action)),
    false,
  );
  assert.ok(SAFE_FINAL_ACTIONS.includes("reject"));
  assert.ok(SAFE_FINAL_ACTIONS.includes("reject non-essential cookies"));
  assert.ok(SAFE_NAVIGATION_ACTIONS.includes("manage preferences"));
});

test("snapshot candidate selection is exact, role bounded, and prioritized", () => {
  const refs = {
    e1: { role: "button", name: "Accept all" },
    e2: { role: "button", name: "Manage preferences" },
    e3: { role: "button", name: "Reject all" },
    e4: { role: "heading", name: "Reject" },
    e5: { role: "button", name: "Reject analytics" },
  };
  const finalOnly = listSafeSnapshotCandidates(refs);
  assert.deepEqual(
    finalOnly.map((candidate) => candidate.ref),
    ["@e3"],
  );
  const withNavigation = listSafeSnapshotCandidates(refs, {
    allowNavigation: true,
  });
  assert.deepEqual(
    withNavigation.map((candidate) => candidate.ref),
    ["@e3", "@e2"],
  );
});

test("interaction verification rejects successful commands when the control remains", () => {
  const beforeCandidates = [{ name: "reject all" }];
  const falsePositive = verifyInteractionCleared({
    clickedName: "reject all",
    beforeCandidates,
    afterCandidates: [{ name: "reject all" }],
    beforeAudit: { consentOverlayCount: 1 },
    afterAudit: { consentOverlayCount: 1 },
  });
  assert.equal(falsePositive.cleared, false);
  assert.equal(falsePositive.sameActionStillVisible, true);

  const verified = verifyInteractionCleared({
    clickedName: "reject all",
    beforeCandidates,
    afterCandidates: [],
    beforeAudit: { consentOverlayCount: 1 },
    afterAudit: { consentOverlayCount: 0 },
  });
  assert.equal(verified.cleared, true);
  assert.equal(verified.sameActionStillVisible, false);
});

test("challenge vocabulary includes the three missed protected-page phrases", () => {
  assert.ok(CHALLENGE_TERMS.includes("sorry, you have been blocked"));
  assert.ok(CHALLENGE_TERMS.includes("unable to access"));
  assert.ok(CHALLENGE_TERMS.includes("performing security verification"));
});
