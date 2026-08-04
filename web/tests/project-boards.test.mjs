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

test("project boards use a versioned browser-local contract", async () => {
  const store = await read("components/project-boards/board-store.ts");
  assert.match(store, /tessli-project-boards-v1/);
  assert.match(store, /goal: string/);
  assert.match(store, /constraints: string/);
  assert.match(store, /resourceId: string/);
  assert.match(store, /note: string/);
  assert.match(store, /localStorage\.setItem/);
});

test("project boards support lifecycle, source membership, and notes", async () => {
  const experience = await read(
    "components/project-boards/project-boards-experience.tsx",
  );
  for (const phrase of [
    "Create board",
    "Delete board",
    "Project goal",
    "Constraints",
    "Find a source to add",
    "Research note",
    "Remove",
  ]) {
    assert.match(experience, new RegExp(phrase));
  }
  assert.doesNotMatch(experience, />Selected</i);
  assert.doesNotMatch(experience, />Rejected</i);
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
