import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const currentFile = fileURLToPath(import.meta.url);
const webRoot = path.resolve(path.dirname(currentFile), "..");

async function read(relativePath) {
  return readFile(path.join(webRoot, relativePath), "utf8");
}

test("project boards use a backward-compatible versioned browser-local contract", async () => {
  const store = await read("components/project-boards/board-store.ts");
  assert.match(store, /tessli-project-boards-v1/);
  assert.match(store, /goal: string/);
  assert.match(store, /constraints: string/);
  assert.match(store, /unresolvedQuestions: readonly string\[\]/);
  assert.match(store, /decision: ProjectBoardDecision/);
  assert.match(store, /rationale: string/);
  assert.match(store, /decision: "undecided"/);
  assert.match(store, /localStorage\.setItem/);
});

test("project boards support explicit research decisions and open questions", async () => {
  const experience = await read(
    "components/project-boards/project-boards-experience.tsx",
  );
  for (const phrase of [
    "Create board",
    "Delete board",
    "Project goal",
    "Constraints",
    "Unresolved questions",
    "Add question",
    "Decision rationale",
    "Undecided",
    "Selected",
    "Rejected",
    "Research note",
    "Remove",
  ]) {
    assert.match(experience, new RegExp(phrase));
  }
  assert.doesNotMatch(experience, /Export research pack/i);
  assert.doesNotMatch(experience, /Sync to cloud/i);
});

test("boards route is discoverable and private-local messaging is explicit", async () => {
  const page = await read("app/boards/page.tsx");
  const saved = await read("app/saved/page.tsx");
  const sitemap = await read("app/sitemap.ts");
  assert.match(page, /ProjectBoardsExperience/);
  assert.match(saved, /href="\/boards"/);
  assert.match(sitemap, /"\/boards"/);
});
