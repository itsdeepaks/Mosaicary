import assert from "node:assert/strict";
import test from "node:test";

import batch14 from "../data/intelligence-profile-batches/1.4.json" with { type: "json" };
import {
  getAllIntelligenceProfiles,
  getIntelligenceProfile,
} from "../lib/intelligence.ts";

const expectedIdentifiers = [
  "fonts-in-use",
  "font-squirrel",
  "free-faces",
  "open-foundry",
  "fontpair",
  "velvetyne",
  "adobe-fonts",
  "theatre-js",
  "anime-js",
  "autoanimate",
];

test("Slice 1.4 is one deterministic ten-profile source", () => {
  assert.equal(batch14.version, 1);
  assert.equal(batch14.slice, "1.4");
  assert.equal(batch14.reviewedAt, "2026-08-05");
  assert.deepEqual(
    batch14.profiles.map((profile) => profile.resourceId),
    expectedIdentifiers,
  );
  assert.equal(new Set(expectedIdentifiers).size, 10);
});

test("the shared registry exposes every Slice 1.4 profile exactly once", () => {
  assert.equal(getAllIntelligenceProfiles().length, 40);
  assert.equal(
    new Set(getAllIntelligenceProfiles().map((profile) => profile.resourceId))
      .size,
    40,
  );

  for (const profile of batch14.profiles) {
    assert.deepEqual(getIntelligenceProfile(profile.resourceId), profile);
    assert.equal(profile.status, "needs-review");
    assert.equal(profile.verifiedAt, batch14.reviewedAt);
    assert.ok(profile.evidence.length > 0);
    assert.equal(
      profile.evidence.every(
        (item) =>
          item.verifiedAt === batch14.reviewedAt &&
          item.sourceUrl.startsWith("https://"),
      ),
      true,
    );
  }
});

test("the batch records no human review or public Verified promotion", () => {
  const serialized = JSON.stringify(batch14);
  assert.doesNotMatch(serialized, /humanReview/u);
  assert.equal(
    batch14.profiles.some((profile) => profile.status === "verified"),
    false,
  );
});
