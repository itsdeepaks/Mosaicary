import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

import { createBoardResearchPack } from "../lib/board-research-pack.mjs";

export const OSS_PROOF_ID = "oss-homepage-2026-08-04";
export const OSS_PROOF_DATE = "2026-08-04";

const proofDirectory = new URL(
  "../../docs/proofs/oss-homepage/",
  import.meta.url,
);
const boardPath = new URL("research-board.json", proofDirectory);
const packPath = new URL("research-pack.md", proofDirectory);
const cataloguePath = new URL("../data/catalogue.json", import.meta.url);
const profilesDirectory = new URL(
  "../data/intelligence-profiles/",
  import.meta.url,
);

async function loadBoardSnapshot() {
  return JSON.parse(await readFile(boardPath, "utf8"));
}

async function loadCanonicalSources(resourceIds) {
  const catalogue = JSON.parse(await readFile(cataloguePath, "utf8"));
  const catalogueById = new Map(
    catalogue.resources.map((resource) => [resource.id, resource]),
  );
  const profiles = new Map();
  for (const filename of await readdir(profilesDirectory)) {
    if (!filename.endsWith(".json")) continue;
    const profile = JSON.parse(
      await readFile(new URL(filename, profilesDirectory), "utf8"),
    );
    profiles.set(profile.resourceId, profile);
  }

  return resourceIds.map((resourceId) => {
    const resource = catalogueById.get(resourceId);
    if (!resource) throw new Error(`Unknown canonical source: ${resourceId}`);
    const profile = profiles.get(resource.id) ?? null;
    return {
      id: resource.id,
      slug: resource.slug,
      name: resource.name,
      url: resource.url,
      domain: resource.domain,
      summary: resource.description,
      category: resource.category,
      access: resource.access,
      profileLevel: profile ? "profiled" : "listed",
      bestFor: profile?.workflowFit ?? [],
      capabilities: profile?.capabilities ?? [],
      limitations: profile?.limitations ?? [],
      evidence: profile?.evidence ?? [],
    };
  });
}

export async function buildOssProofArtifacts() {
  const snapshot = await loadBoardSnapshot();
  if (snapshot.proofId !== OSS_PROOF_ID) {
    throw new Error(`Unexpected OSS proof ID: ${snapshot.proofId}`);
  }
  if (snapshot.generatedAt !== OSS_PROOF_DATE) {
    throw new Error(`Unexpected OSS proof date: ${snapshot.generatedAt}`);
  }
  const resourceIds = snapshot.board.items.map((item) => item.resourceId);
  const sources = await loadCanonicalSources(resourceIds);
  const result = createBoardResearchPack({
    contractVersion: 1,
    generatedAt: snapshot.generatedAt,
    board: snapshot.board,
    sources,
    implementationReminders: snapshot.implementationReminders,
  });
  if (!result.ok) {
    throw new Error(`OSS proof pack is invalid: ${result.errors.join(" ")}`);
  }
  return {
    snapshot,
    sources,
    markdown: result.markdown,
    filename: result.filename,
  };
}

export async function writeOssProofPack() {
  const artifacts = await buildOssProofArtifacts();
  await writeFile(packPath, artifacts.markdown, "utf8");
  return artifacts;
}

const executedPath = process.argv[1]
  ? pathToFileURL(fileURLToPath(process.argv[1])).href
  : null;
if (executedPath === import.meta.url) {
  const artifacts = await writeOssProofPack();
  console.log(
    `Generated ${artifacts.filename} with ${artifacts.snapshot.board.items.filter((item) => item.decision === "selected").length} selected references.`,
  );
}
