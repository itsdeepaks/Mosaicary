import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  BLOCKED_CONTROLS,
  CONTROLLED_BATCH_ID,
  GENERIC_TARGETS,
  STRICT_EDGE_RESOURCE_IDS,
  SUITABLE_CONTROLS,
  UNSEEN_TARGETS,
} from "../scripts/capture-resource-preview-controlled-batch-20.mjs";

const allResourceIds = [
  ...GENERIC_TARGETS.map((target) => target.resourceId),
  ...STRICT_EDGE_RESOURCE_IDS,
];

test("controlled batch contains exactly twenty distinct fixed resources", () => {
  assert.equal(CONTROLLED_BATCH_ID, "controlled-20-v1-20260803");
  assert.equal(GENERIC_TARGETS.length, 18);
  assert.equal(STRICT_EDGE_RESOURCE_IDS.length, 2);
  assert.equal(allResourceIds.length, 20);
  assert.equal(new Set(allResourceIds).size, 20);
});

test("batch composition prevents an easy-only success sample", () => {
  assert.equal(UNSEEN_TARGETS.length, 12);
  assert.equal(SUITABLE_CONTROLS.length, 3);
  assert.equal(BLOCKED_CONTROLS.length, 3);
  assert.deepEqual(
    BLOCKED_CONTROLS.map((target) => target.name),
    ["UI8", "Creative Market", "Replit"],
  );
  assert.deepEqual(STRICT_EDGE_RESOURCE_IDS, [
    "resource-424e130e8422",
    "resource-e81793f16a04",
  ]);
});

test("all generic targets are bounded HTTPS catalogue records", () => {
  for (const target of GENERIC_TARGETS) {
    assert.match(target.resourceId, /^resource-[a-f0-9]{12}$/);
    assert.equal(new URL(target.url).protocol, "https:");
    assert.ok(["visual-assets", "design-tools-ai"].includes(target.category));
    assert.ok(
      ["unseen", "suitable-control", "blocked-control"].includes(
        target.cohort,
      ),
    );
  }
});

test("controlled batch source has no upload or production-publication path", async () => {
  const source = await readFile(
    new URL("../scripts/capture-resource-preview-controlled-batch-20.mjs", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /resource-media\.json/);
  assert.doesNotMatch(source, /storage\.objects/);
  assert.doesNotMatch(source, /INTERACTION_UPLOAD_URL/);
  assert.doesNotMatch(source, /supabase\.co\/storage/);
  assert.match(source, /productionApproved: false/);
  assert.match(source, /publicationApproved: false/);
});

test("affirmative consent actions remain absent from the controlled batch", async () => {
  const source = await readFile(
    new URL("../scripts/capture-resource-preview-controlled-batch-20.mjs", import.meta.url),
    "utf8",
  );
  for (const forbidden of [
    '"accept"',
    '"accept all"',
    '"allow all"',
    '"agree"',
    '"i agree"',
  ]) {
    assert.equal(source.toLowerCase().includes(forbidden), false);
  }
});
