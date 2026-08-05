import assert from "node:assert/strict";
import test from "node:test";

import batch13 from "../data/intelligence-profile-batches/1.3.json" with { type: "json" };
import {
  getAllIntelligenceProfiles,
  getIntelligenceProfile,
} from "../lib/intelligence.ts";

const expectedIdentifiers = [
  "google-fonts",
  "radix-ui",
  "headless-ui",
  "react-aria",
  "gsap",
  "lottiefiles",
  "rive",
  "spline",
  "react-three-fiber",
  "lucide",
];

test("Slice 1.3 is one deterministic ten-profile source", () => {
  assert.equal(batch13.version, 1);
  assert.equal(batch13.slice, "1.3");
  assert.equal(batch13.reviewedAt, "2026-08-05");
  assert.deepEqual(
    batch13.profiles.map((profile) => profile.resourceId),
    expectedIdentifiers,
  );
  assert.equal(new Set(expectedIdentifiers).size, 10);
});

test("the shared registry exposes every Slice 1.3 profile exactly once", () => {
  assert.equal(getAllIntelligenceProfiles().length, 30);
  assert.equal(
    new Set(
      getAllIntelligenceProfiles().map((profile) => profile.resourceId),
    ).size,
    30,
  );

  for (const profile of batch13.profiles) {
    assert.deepEqual(getIntelligenceProfile(profile.resourceId), profile);
    assert.equal(profile.status, "needs-review");
    assert.equal(profile.verifiedAt, batch13.reviewedAt);
    assert.ok(profile.evidence.length > 0);
    assert.equal(
      profile.evidence.every(
        (item) =>
          item.verifiedAt === batch13.reviewedAt &&
          item.sourceUrl.startsWith("https://"),
      ),
      true,
    );
  }
});

test("the batch records no human-review or public Verified promotion", () => {
  const serialized = JSON.stringify(batch13);
  assert.doesNotMatch(serialized, /humanReview/u);
  assert.equal(
    batch13.profiles.some((profile) => profile.status === "verified"),
    false,
  );
});
