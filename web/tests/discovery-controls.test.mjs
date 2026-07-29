import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const webRoot = path.resolve(path.dirname(currentFile), "..");

async function read(relativePath) {
  return readFile(path.join(webRoot, relativePath), "utf8");
}

test("discovery URL state has one stable, allowlisted contract", async () => {
  const state = await read("components/explore-discovery/discovery-state.ts");

  for (const parameter of ["q", "category", "access", "sort"]) {
    assert.match(state, new RegExp(`"${parameter}"`));
  }

  for (const access of [
    "free",
    "freemium",
    "paid",
    "open-source",
    "free-trial",
  ]) {
    assert.match(state, new RegExp(`"${access}"`));
  }

  for (const sort of ["curated", "name-asc", "name-desc"]) {
    assert.match(state, new RegExp(`"${sort}"`));
  }

  assert.match(state, /params\.set\("access", access\.join\(","\)\)/);
  assert.match(state, /state\.sort !== defaultDiscoveryState\.sort/);
  assert.match(state, /categoryIds\.has\(categoryValue\)/);
  assert.match(state, /\.slice\(0, 160\)/);
  assert.doesNotMatch(state, /relevance|popular|trending|rating/i);
});

test("Explore state preserves Next history and restores popstate", async () => {
  const experience = await read(
    "components/explore-discovery/explore-experience.tsx",
  );

  assert.match(experience, /^"use client";/);
  assert.match(experience, /window\.history\.state \?\? \{\}/);
  assert.match(experience, /window\.history\[mode\]/);
  assert.match(experience, /"pushState" \| "replaceState"/);
  assert.match(experience, /addEventListener\("popstate"/);
  assert.match(experience, /parseDiscoveryState\(/);
  assert.match(experience, /writeHistory\(nextState, "replaceState"\)/);
  assert.match(experience, /discoveryAccessValues\.filter/);
  assert.match(experience, /setVisibleCount\(explorePageSize\)/);
  assert.match(experience, /deriveExploreResults\(/);
  assert.doesNotMatch(experience, /fetch\(|localStorage|sessionStorage/);
});

test("controls use route links, category buttons, validated access, and native dialog", async () => {
  const controls = await read(
    "components/explore-discovery/discovery-controls.tsx",
  );

  assert.match(controls, /aria-label="Browse resources by category"/);
  assert.match(controls, /aria-pressed=\{state\.category === null\}/);
  assert.match(controls, /data-category=\{category\.id\}/);
  assert.match(controls, /categoryScrollerRef/);
  assert.match(controls, /scroller\.scrollTo/);
  assert.match(controls, /primaryCategoryIds/);
  assert.match(controls, /<span>More<\/span>/);
  assert.match(controls, /id="overflow-categories"/);
  assert.match(controls, /event\.key === "Escape"/);
  assert.match(controls, /moreTriggerRef\.current\?\.focus\(\)/);
  assert.doesNotMatch(controls, /scrollIntoView/);
  assert.match(controls, /data-resource-view="all"/);
  assert.match(controls, /data-resource-view="saved"/);
  assert.match(controls, /data-resource-view="full-reference"/);
  assert.match(controls, /discoveryHref\("\/saved", state\)/);
  assert.match(controls, /discoveryHref\("\/resources", state\)/);
  assert.match(controls, /<dialog/);
  assert.match(controls, /dialog\.showModal\(\)/);
  assert.match(controls, /onCancel=/);
  assert.match(controls, /event\.target === dialogRef\.current/);
  assert.match(controls, /filterTriggerRef\.current\?\.focus\(\)/);
  assert.match(controls, /data-access-filter=\{option\.value\}/);
  assert.match(controls, /Curated order/);
  assert.match(controls, /Name A–Z/);
  assert.match(controls, /Name Z–A/);
  assert.doesNotMatch(controls, /role="tablist"|Most relevant|Recommended/);
});

test("discovery controls remain sharp, scroll-safe, and touch complete", async () => {
  const css = await read(
    "components/explore-discovery/discovery-controls.module.css",
  );

  assert.match(css, /overflow-x: auto/);
  assert.match(css, /\.desktopCategoryList/);
  assert.match(css, /\.mobileCategoryList/);
  assert.match(css, /\.categorySurface::after/);
  assert.match(css, /content: "›"/);
  assert.match(css, /scrollbar-width: none/);
  assert.match(css, /white-space: nowrap/);
  assert.match(css, /min-height: 58px/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /height: 100dvh/);
  assert.match(css, /\.filterDialog::backdrop/);
  assert.match(css, /@media \(max-width: 390px\)/);
  assert.match(css, /border-bottom: 1px solid var\(--line-subtle\)/);
  assert.doesNotMatch(css, /border-radius: 1[2-9]px|backdrop-filter/);
});

test("Explore page passes the validated catalogue into the integrated experience", async () => {
  const page = await read("app/page.tsx");

  assert.match(page, /import catalogue from "@\/data\/catalogue\.json"/);
  assert.match(page, /catalogue\.resources\.map/);
  assert.match(page, /catalogue\.categories\.map/);
  assert.match(page, /parseDiscoveryState\(await searchParams/);
  assert.match(page, /<ExploreExperience/);
  assert.match(page, /resources=\{resources\}/);
  assert.doesNotMatch(page, /fetch\(|previewImageUrl|faviconUrl/);
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

test("Saved remains an honest shell while Full Reference uses validated catalogue data", async () => {
  const [saved, resources, navigation] = await Promise.all([
    read("app/saved/page.tsx"),
    read("app/resources/page.tsx"),
    read("components/site-header/navigation.ts"),
  ]);

  assert.match(saved, /<RoutePlaceholder/);
  assert.match(saved, /private to this browser/i);
  assert.doesNotMatch(saved, /localStorage|<form|fetch\(/);
  assert.match(resources, /import catalogue from "@\/data\/catalogue\.json"/);
  assert.match(resources, /<FullReferenceExperience/);
  assert.doesNotMatch(resources, /RoutePlaceholder|localStorage|fetch\(/);
  assert.match(navigation, /label: "Saved"[\s\S]*?available: false/);
  assert.match(navigation, /label: "Resources"[\s\S]*?available: true/);
});
