import assert from "node:assert/strict";
import test from "node:test";

import {
  INTERACTION_BATCH,
  INTERACTION_MAX_BYTES,
  INTERACTION_OUTPUT,
  INTERACTION_SITES,
  INTERACTION_VIEWPORT,
  SAFE_DISMISS_TEXTS,
} from "../scripts/capture-resource-preview-interaction-pilot.mjs";

test("interaction preview pilot is fixed to fifteen distinct resources", () => {
  assert.equal(INTERACTION_SITES.length, 15);
  assert.equal(
    new Set(INTERACTION_SITES.map((site) => site.resourceId)).size,
    15,
  );
  assert.equal(new Set(INTERACTION_SITES.map((site) => site.url)).size, 15);
  assert.equal(INTERACTION_BATCH, "interaction-v1-20260803");

  for (const site of INTERACTION_SITES) {
    assert.match(site.resourceId, /^resource-[a-f0-9]{12}$/);
    assert.equal(new URL(site.url).protocol, "https:");
    assert.ok(site.name.length > 0);
    assert.ok(site.testReason.length > 0);
  }
});

test("interaction pilot preserves the reviewed card-media boundary", () => {
  assert.deepEqual(INTERACTION_VIEWPORT, { width: 1440, height: 756 });
  assert.deepEqual(INTERACTION_OUTPUT, { width: 960, height: 504 });
  assert.equal(
    INTERACTION_VIEWPORT.width / INTERACTION_VIEWPORT.height,
    40 / 21,
  );
  assert.equal(INTERACTION_OUTPUT.width / INTERACTION_OUTPUT.height, 40 / 21);
  assert.equal(INTERACTION_MAX_BYTES, 307_200);
});

test("dismiss actions exclude affirmative consent controls", () => {
  assert.ok(SAFE_DISMISS_TEXTS.includes("reject all"));
  assert.ok(SAFE_DISMISS_TEXTS.includes("only necessary"));
  assert.ok(SAFE_DISMISS_TEXTS.includes("continue without accepting"));

  const forbiddenActions = new Set([
    "accept",
    "accept all",
    "allow all",
    "agree",
    "i agree",
    "consent",
  ]);
  assert.equal(
    SAFE_DISMISS_TEXTS.some((text) => forbiddenActions.has(text)),
    false,
  );
});
