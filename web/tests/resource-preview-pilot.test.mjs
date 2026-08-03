import assert from "node:assert/strict";
import test from "node:test";

import {
  PILOT_MAX_BYTES,
  PILOT_OUTPUT,
  PILOT_SITES,
  PILOT_VIEWPORT,
} from "../scripts/capture-resource-preview-pilot.mjs";

test("resource preview pilot remains bounded and deterministic", () => {
  assert.equal(PILOT_SITES.length, 5);
  assert.equal(new Set(PILOT_SITES.map((site) => site.resourceId)).size, 5);
  assert.equal(new Set(PILOT_SITES.map((site) => site.url)).size, 5);

  for (const site of PILOT_SITES) {
    assert.match(site.resourceId, /^resource-[a-f0-9]{12}$/);
    assert.equal(new URL(site.url).protocol, "https:");
    assert.ok(site.name.length > 0);
  }
});

test("pilot output is card-sized and capped before upload", () => {
  assert.deepEqual(PILOT_VIEWPORT, { width: 1440, height: 756 });
  assert.deepEqual(PILOT_OUTPUT, { width: 960, height: 504 });
  assert.equal(PILOT_VIEWPORT.width / PILOT_VIEWPORT.height, 40 / 21);
  assert.equal(PILOT_OUTPUT.width / PILOT_OUTPUT.height, 40 / 21);
  assert.equal(PILOT_MAX_BYTES, 307_200);
});
