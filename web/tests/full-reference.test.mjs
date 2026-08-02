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

test("Full Reference route passes the validated catalogue into shared discovery state", async () => {
  const page = await read("app/resources/page.tsx");

  assert.match(page, /import catalogue from "@\/data\/catalogue\.json"/);
  assert.match(page, /catalogue\.resources\.map/);
  assert.match(page, /catalogue\.categories\.map/);
  assert.match(page, /parseDiscoveryState\(await searchParams/);
  assert.match(page, /<FullReferenceExperience/);
  assert.match(page, /resources=\{resources\}/);
  assert.match(page, /previewImageUrl: resource\.previewImageUrl/);
  assert.match(page, /faviconUrl: resource\.faviconUrl/);
  assert.doesNotMatch(page, /RoutePlaceholder|fetch\(/);
});

test("desktop reference state reuses canonical discovery derivation and browser history", async () => {
  const experience = await read(
    "components/full-reference/full-reference-experience.tsx",
  );

  assert.match(experience, /^"use client";/);
  assert.match(
    experience,
    /deriveExploreResults\(resources, categoryLabels, state\)/,
  );
  assert.match(experience, /discoveryHref\("\/resources", state\)/);
  assert.match(experience, /window\.history\.state \?\? \{\}/);
  assert.match(experience, /window\.history\[mode\]/);
  assert.match(experience, /writeHistory\(nextState, "replaceState"\)/);
  assert.match(experience, /addEventListener\("popstate"/);
  assert.match(experience, /parseDiscoveryState\(/);
  assert.match(experience, /discoveryAccessValues\.filter/);
  assert.match(experience, /applyState\(defaultDiscoveryState\)/);
  assert.doesNotMatch(experience, /localStorage|sessionStorage|fetch\(/);
});

test("Full Reference uses native controls, a semantic desktop table, and compact external rows", async () => {
  const experience = await read(
    "components/full-reference/full-reference-experience.tsx",
  );

  assert.match(experience, /type="search"/);
  assert.match(experience, /type="radio"/);
  assert.match(experience, /type="checkbox"/);
  assert.match(experience, /<select/);
  assert.match(
    experience,
    /<table className=\{styles\.table\} data-reference-table>/,
  );
  assert.match(experience, /<caption>/);
  assert.match(experience, /<thead>/);
  assert.match(experience, /<tbody>/);
  assert.match(experience, /resultSet\.resources\.map/);
  assert.match(experience, /target="_blank"/);
  assert.match(experience, /rel="noopener noreferrer"/);
  assert.match(experience, /aria-live="polite"/);
  assert.match(experience, /data-reference-state="empty"/);
  assert.match(experience, /data-reference-state="error"/);
  assert.match(experience, /data-mobile-reference-rows/);
  assert.match(experience, /data-mobile-reference-row/);
  assert.match(experience, /<th scope="col">Last verified<\/th>/);
  assert.match(experience, /data-reference-verified="true"/);
  assert.match(experience, /value: "verified", label: "Verification date"/);
  assert.match(experience, /<dialog/);
  assert.doesNotMatch(
    experience,
    /data-resource-save|onSavedChange|saved=\{|load more|virtual/i,
  );
});

test("supporting panel is factual and omits unsupported ranking signals", async () => {
  const experience = await read(
    "components/full-reference/full-reference-experience.tsx",
  );

  assert.match(experience, /Source-backed, not ranked/);
  assert.match(experience, /Curated order follows repository data/);
  assert.match(
    experience,
    /does not infer\s+popularity, quality scores, sponsorship, or trends/,
  );
  assert.match(experience, /href="\/curation"/);
  assert.match(experience, /href="\/submit"/);
  assert.match(experience, /href="\/suggest"/);
  assert.doesNotMatch(
    experience,
    /data-(?:quality-score|rating|popularity|trend)|popular tags|trending tags/i,
  );
});

test("responsive contract replaces the desktop table with compact rows and a native filter sheet", async () => {
  const css = await read("components/full-reference/full-reference.module.css");
  const experience = await read(
    "components/full-reference/full-reference-experience.tsx",
  );

  assert.match(
    css,
    /grid-template-columns:\s*minmax\(220px,\s*0\.78fr\)\s*minmax\(0,\s*2\.5fr\)\s*minmax\(\s*210px,\s*0\.72fr\s*\)/,
  );
  assert.match(css, /\.table\s*\{[\s\S]*?min-width: 720px/);
  assert.match(css, /\.table th:nth-child\(4\)[\s\S]*?width: 13%/);
  assert.match(css, /\.table td:nth-child\(4\)[\s\S]*?white-space: nowrap/);
  assert.match(css, /@media \(max-width: 1099px\)/);
  assert.match(
    css,
    /@media \(max-width: 1099px\)[\s\S]*?\.desktopReference\s*\{[\s\S]*?display: none/,
  );
  assert.match(
    css,
    /@media \(max-width: 1099px\)[\s\S]*?\.mobileReference\s*\{[\s\S]*?display: block/,
  );
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(experience, /data-full-reference-mobile/);
  assert.match(experience, /data-mobile-reference-search/);
  assert.match(experience, /data-mobile-reference-rows/);
  assert.match(experience, /data-mobile-reference-row/);
  assert.match(experience, /<dialog/);
  assert.match(experience, /data-reference-filter-dialog/);
  assert.match(experience, /showModal\(\)/);
  assert.match(experience, /onCancel=\{\(event\) => \{/);
  assert.match(experience, /onClose=\{restoreFilterFocus\}/);
  assert.match(experience, /<details className=\{styles\.mobileSupport\}>/);
  assert.match(experience, /data-mobile-reference-category/);
  assert.match(experience, /data-mobile-reference-access/);
  assert.doesNotMatch(
    experience,
    /localStorage|sessionStorage|data-resource-save/,
  );
});
