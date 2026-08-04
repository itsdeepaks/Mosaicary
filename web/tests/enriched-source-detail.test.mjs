import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath) {
  return readFile(path.join(webRoot, relativePath), "utf8");
}

test("source detail renders recorded intelligence without live verification claims", async () => {
  const page = await read("app/resources/[slug]/page.tsx");
  const detail = await read("components/source-detail/intelligence-detail.tsx");

  assert.ok(page.includes("getSimilarSourceProfiles(profile, 4)"));
  assert.ok(page.includes("<IntelligenceDetail profile={profile}"));
  assert.ok(detail.includes("not a live provider verification"));
  assert.ok(detail.includes("Governance"));
  assert.ok(detail.includes("Evidence"));
  assert.ok(detail.includes("not a universal quality ranking"));
});

test("similar sources use explainable metadata instead of popularity", async () => {
  const similar = await read("lib/similar-sources.ts");

  assert.ok(similar.includes("candidate.category === source.category"));
  assert.ok(similar.includes("candidate.sourceType === source.sourceType"));
  assert.ok(similar.includes("capabilityOverlap"));
  assert.ok(similar.includes("contentObjects"));
  assert.doesNotMatch(similar, /popularity|rating|trend/i);
});
