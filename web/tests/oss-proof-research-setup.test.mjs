import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
  OSS_PROOF_DATE,
  OSS_PROOF_ID,
  buildOssProofArtifacts,
} from "../scripts/generate-oss-proof-research-setup.mjs";

const proofRoot = new URL("../../docs/proofs/oss-homepage/", import.meta.url);

test("OSS proof Board uses canonical bounded decisions", async () => {
  const artifacts = await buildOssProofArtifacts();
  const items = artifacts.snapshot.board.items;
  const selected = items.filter((item) => item.decision === "selected");
  const rejected = items.filter((item) => item.decision === "rejected");
  assert.equal(artifacts.snapshot.proofId, OSS_PROOF_ID);
  assert.equal(artifacts.snapshot.generatedAt, OSS_PROOF_DATE);
  assert.equal(selected.length, 10);
  assert.equal(rejected.length, 4);
  assert.equal(
    new Set(items.map((item) => item.resourceId)).size,
    items.length,
  );
  assert.equal(artifacts.sources.length, items.length);
  for (const [index, item] of items.entries()) {
    const source = artifacts.sources[index];
    assert.equal(
      source.id === item.resourceId || source.slug === item.resourceId,
      true,
      `${item.resourceId} canonical resolution`,
    );
  }
  assert.equal(
    artifacts.sources.every((source) => source.profileLevel === "profiled"),
    true,
  );
  for (const item of items) {
    assert.ok(item.rationale.trim(), `${item.resourceId} rationale`);
    assert.ok(item.note.trim(), `${item.resourceId} note`);
  }
});

test("committed research pack matches deterministic generation", async () => {
  const artifacts = await buildOssProofArtifacts();
  let committedPack = null;
  try {
    committedPack = await readFile(
      new URL("research-pack.md", proofRoot),
      "utf8",
    );
  } catch {
    // The first bootstrap run intentionally reports the exact missing bytes.
  }
  if (committedPack !== artifacts.markdown) {
    console.error(
      `OSS_PROOF_PACK_BASE64:${Buffer.from(artifacts.markdown, "utf8").toString("base64")}`,
    );
  }
  assert.equal(committedPack, artifacts.markdown);
  assert.match(committedPack, /Contract: tessli\.board-research-pack\.v1/u);
  assert.match(committedPack, /Generated: 2026-08-04/u);
  assert.match(committedPack, /Selected references: 10/u);
  assert.match(committedPack, /## 3\. Rejected Directions/u);
  assert.doesNotMatch(committedPack, /Unknown source/u);
  assert.doesNotMatch(committedPack, /[ \t]+$/gmu);
  assert.equal(committedPack.endsWith("\n"), true);
});

test("proof setup preserves evidence and outcome boundaries", async () => {
  const [brief, baseline, handoff] = await Promise.all([
    readFile(new URL("brief.md", proofRoot), "utf8"),
    readFile(new URL("baseline.md", proofRoot), "utf8"),
    readFile(new URL("slice-5.2-handoff.md", proofRoot), "utf8"),
  ]);
  assert.match(brief, /Observed current-site baseline/u);
  assert.match(brief, /Project decisions/u);
  assert.match(brief, /Open questions/u);
  assert.match(brief, /https:\/\/www\.onlinescope\.in\//u);
  assert.match(baseline, /Research time \| not measured/u);
  assert.match(baseline, /Human outcome scores: \*\*not measured\*\*/u);
  assert.match(handoff, /no implementation completed in Slice 5\.1/u);
  assert.match(handoff, /no human scores yet/u);
  assert.doesNotMatch(
    [brief, baseline, handoff].join("\n"),
    /^(?:Tessli|This proof) (?:proved|improved|guarantees?)\b/imu,
  );
});

test("proof generator is deterministic and network-free", async () => {
  const source = await readFile(
    new URL(
      "../scripts/generate-oss-proof-research-setup.mjs",
      import.meta.url,
    ),
    "utf8",
  );
  assert.doesNotMatch(
    source,
    /fetch\(|XMLHttpRequest|Date\.now\(|new Date\(|localStorage|cookies\(|process\.env/u,
  );
});
