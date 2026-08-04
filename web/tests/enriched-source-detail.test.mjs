import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath) {
  return readFile(path.join(webRoot, relativePath), "utf8");
}

test("source detail renders recorded intelligence without claiming live verification", async () => {
  const page = await read("app/resources/[slug]/page.tsx");
  const detail = await read("components/source-detail/intelligence-detail.tsx");

  assert.match(page, /getSimilarSourceProfiles\(profile, 4\)/);
  assert.match(page, /<IntelligenceDetail profile=\{profile\} similar=\{similar\}/);
  assert.match(detail, /Profiled record, not a live provider verification/);
  assert.match(detail, /Governance/);
  assert.match(detail, /Evidence/);
  assert.match(detail, /not a universal quality ranking/);
});

test("similar sources use explainable metadata instead of popularity", async () => {
  const similar = await read("lib/similar-sources.ts");

  assert.match(similar, /candidate\.category === source\.category/);
  assert.match(similar, /candidate\.sourceType === source\.sourceType/);
  assert.match(similar, /capabilityOverlap/);
  assert.match(similar, /contentObjects/);
  assert.doesNotMatch(similar, /popularity|rating|trend/i);
});
