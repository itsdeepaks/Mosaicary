import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const webRoot = path.resolve(path.dirname(currentFile), "..");
const repositoryRoot = path.resolve(webRoot, "..");

async function readRepositoryFile(relativePath) {
  return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

test("release history remains preserved under Product Plan v2", async () => {
  const slices = await readRepositoryFile("build-slices.md");
  const plan = await readRepositoryFile("docs/product-plan-v2.md");
  const cutover = await readRepositoryFile(
    "docs/slices/9.3-production-replacement.md",
  );

  assert.match(
    slices,
    /previous detailed Phase 1 ledger and legacy slice numbers remain available in Git history/i,
  );
  assert.match(
    slices,
    /\| 0\.1 \| Product direction and operating reset \| DONE \| previous baseline \| legacy `14\.0`, PR #74 \|/,
  );
  assert.match(
    slices,
    /\| 1\.1 \| Canonical source-profile contract \| DONE \| 0\.1 \| legacy `14\.1` \|/,
  );
  assert.match(
    slices,
    /\| 2\.1 \| Canonical Browse architecture and pagination contract \| DONE \| 1\.2 \| legacy `14\.2`, PR #77 \|/,
  );
  assert.match(
    slices,
    /\| 2\.2 \| Canonical `\/resources` implementation \| NEXT \| 2\.1 \| — \|/,
  );
  assert.match(
    plan,
    /(?:\*\*)?Phases 1–10(?:\*\*)? are the ten development phases/i,
  );
  assert.match(plan, /Phase 10 — Evidence-Backed UI-Taste Layer/i);
  assert.match(cutover, /dpl_6fj2gzYhAEDahEbeQZvVrTneejy9/);
  assert.match(cutover, /dpl_CQXFJvSFdnXGkEsswdGQv38NhymS/);
  assert.match(cutover, /no grouped runtime errors/i);
});

test("release workflow covers the locked checks and formal viewport set", async () => {
  const workflow = await readRepositoryFile(
    ".github/workflows/phase-1-release-gate.yml",
  );
  const browser = await readRepositoryFile(
    "web/tests/release-gate-browser.mjs",
  );

  for (const command of [
    "npm ci",
    "npm run format:check",
    "npm run typecheck",
    "npm run lint",
    "npm test",
    "npm run catalogue:check",
    "npm run build",
  ]) {
    assert.match(
      workflow,
      new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }

  for (const viewport of [
    "1440, 900",
    "1280, 800",
    "1024, 768",
    "768, 1024",
    "430, 932",
    "390, 844",
    "360, 800",
  ]) {
    assert.match(browser, new RegExp(viewport));
  }

  for (const route of [
    "/collections",
    "/resources",
    "/saved",
    "/about",
    "/curation",
    "/privacy",
    "/terms",
    "/content-policy",
    "/submit",
    "/suggest",
    "/a-clearly-missing-route",
  ]) {
    assert.match(browser, new RegExp(route.replaceAll("/", "\\/")));
  }

  assert.match(browser, /data-saved-resources-empty/);
  assert.match(browser, /scrollWidth > document\.documentElement\.clientWidth/);
  assert.match(workflow, /tessli-phase-1-release-evidence/);
});

test("release note and README preserve evidence and rollback boundaries", async () => {
  const note = await readRepositoryFile(
    "docs/slices/9.2-phase-1-release-hardening.md",
  );
  const readme = await readRepositoryFile("README.md");

  for (const heading of [
    "Acceptance criteria",
    "Exclusions",
    "Release evidence",
    "Production preconditions",
    "Rollback procedure",
  ]) {
    assert.match(note, new RegExp(`## ${heading}`));
  }

  assert.match(note, /does not change the production deployment target/i);
  assert.match(note, /previous known-good deployment/i);
  assert.match(readme, /Phase 1 application/i);
  assert.match(readme, /web\/package\.json/i);
  assert.match(
    readme,
    /previous repository-root static production deployment/i,
  );
  assert.match(readme, /rollback target/i);
  assert.match(
    readme,
    /probe `\/`, `\/collections`, `\/resources`, `\/saved`, `\/about`/i,
  );
});
