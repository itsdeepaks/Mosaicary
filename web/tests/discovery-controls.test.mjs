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

test("discovery URL state has one stable, allowlisted contract", async () => {
  const state = await read("components/explore-discovery/discovery-state.ts");

  assert.match(state, /export const discoverySortValues/);
  assert.match(state, /export const discoveryAccessValues/);
  assert.match(state, /export function parseDiscoveryState/);
  assert.match(state, /export function discoveryHref/);
  assert.match(state, /params\.set\("q"/);
  assert.match(state, /params\.set\("category"/);
  assert.match(state, /params\.set\("access"/);
  assert.match(state, /params\.set\("sort"/);
  assert.doesNotMatch(state, /eval\(|new Function|fetch\(/);
});

test("Explore state preserves Next history and restores popstate", async () => {
  const experience = await read(
    "components/explore-discovery/explore-discovery-experience.tsx",
  );

  assert.match(experience, /window\.history\.state \?\? \{\}/);
  assert.match(experience, /window\.history\[mode\]/);
  assert.match(experience, /addEventListener\("popstate"/);
  assert.match(experience, /parseDiscoveryState/);
  assert.doesNotMatch(experience, /fetch\(/);
});

test("controls use route links, category buttons, validated access, and native dialog", async () => {
  const controls = await read(
    "components/explore-discovery/explore-discovery-controls.tsx",
  );

  assert.match(controls, /<Link/);
  assert.match(controls, /type="button"/);
  assert.match(controls, /discoveryAccessValues/);
  assert.match(controls, /<dialog/);
  assert.match(controls, /showModal\(\)/);
});

test("discovery controls remain sharp, scroll-safe, and touch complete", async () => {
  const css = await read(
    "components/explore-discovery/explore-discovery-controls.module.css",
  );

  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /border-radius:\s*(?:0|4px|6px|8px)/);
});

test("Explore page passes the validated catalogue into the integrated experience", async () => {
  const page = await read("app/page.tsx");

  assert.match(page, /import catalogue from "@\/data\/catalogue\.json"/);
  assert.match(page, /catalogue\.resources\.map/);
  assert.match(page, /<ExploreDiscoveryExperience/);
  assert.doesNotMatch(page, /fetch\(/);
});

test("search supports controlled URL state and live result counts", async () => {
  const [search, hero] = await Promise.all([
    read("components/explore-search/explore-search.tsx"),
    read("components/explore-hero/explore-hero.tsx"),
  ]);

  assert.match(search, /value\?: string/);
  assert.match(search, /onValueChange\?: \(query: string\) => void/);
  assert.match(search, /resultCount\?: number/);
  assert.match(search, /const query = value \?\? uncontrolledQuery/);
  assert.match(search, /onValueChange\?\.\(nextQuery\)/);
  assert.match(search, /element instanceof HTMLDialogElement/);
  assert.match(hero, /resultCount=\{resultCount\}/);
});

test("Saved and canonical Browse use repository data without remote state", async () => {
  const [saved, resources, navigation] = await Promise.all([
    read("app/saved/page.tsx"),
    read("app/resources/page.tsx"),
    read("components/site-header/navigation.ts"),
  ]);

  assert.match(saved, /import catalogue from "@\/data\/catalogue\.json"/);
  assert.match(saved, /<SavedResourcesExperience/);
  assert.doesNotMatch(saved, /RoutePlaceholder|localStorage|fetch\(/);
  assert.match(resources, /import catalogue from "@\/data\/catalogue\.json"/);
  assert.match(resources, /getAllSourceProfiles\(\)/);
  assert.match(resources, /parseBrowseState/);
  assert.match(resources, /deriveBrowseResults/);
  assert.match(resources, /<BrowseResults resources=\{resources\}/);
  assert.doesNotMatch(resources, /RoutePlaceholder|localStorage|fetch\(/);
  assert.match(navigation, /label: "Saved"[\s\S]*?available: true/);
  assert.match(navigation, /label: "Resources"[\s\S]*?available: true/);
});
