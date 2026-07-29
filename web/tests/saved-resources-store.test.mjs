import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const webRoot = path.resolve(path.dirname(currentFile), "..");

async function read(relativePath) {
  return readFile(path.join(webRoot, relativePath), "utf8");
}

test("browser-local save store uses stable IDs and migrates both legacy URL keys", async () => {
  const store = await read("components/saved-resources/save-store.ts");

  assert.match(store, /tessli-saved-resource-ids-v2/);
  assert.match(store, /tessli-saved-resources-v1/);
  assert.match(store, /mosaicary-saved-resources-v1/);
  assert.match(store, /identifiers\.set\(resource\.id, resource\.id\)/);
  assert.match(store, /identifiers\.set\(resource\.url, resource\.id\)/);
  assert.match(store, /legacySaveKeys\.flatMap/);
  assert.match(store, /writeSavedResourceIds\(migrated\)/);
  assert.match(store, /storage\.setItem\(\s*savedResourceStoreKey/);
  assert.match(store, /exists: stored !== null && Array\.isArray\(parsed\)/);
  assert.match(store, /if \(current\.exists\)/);
  assert.doesNotMatch(store, /removeItem|fetch\(|sessionStorage/);
});

test("Explore owns persisted save state while resource cards remain independent controls", async () => {
  const [experience, results] = await Promise.all([
    read("components/explore-discovery/explore-experience.tsx"),
    read("components/explore-results/explore-results.tsx"),
  ]);

  assert.match(experience, /readSavedResourceIds\(resources\)/);
  assert.match(
    experience,
    /window\.addEventListener\("storage", handleStorage\)/,
  );
  assert.match(experience, /writeSavedResourceIds\(next\)/);
  assert.match(experience, /setSaveAnnouncement/);
  assert.match(results, /onSavedChange=\{onSavedChange\}/);
  assert.match(results, /saved=\{savedResourceIds\.has\(resource\.id\)\}/);
  assert.match(results, /aria-live="polite"/);
  assert.doesNotMatch(results, /localStorage|sessionStorage|fetch\(/);
});
