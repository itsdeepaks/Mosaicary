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
  assert.doesNotMatch(
    page,
    /RoutePlaceholder|fetch\(|previewImageUrl|faviconUrl/,
  );
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
  assert.match(experience, /discoveryHref\("\/", state\)/);
  assert.match(experience, /window\.history\.state \?\? \{\}/);
  assert.match(experience, /window\.history\[mode\]/);
  assert.match(experience, /writeHistory\(nextState, "replaceState"\)/);
  assert.match(experience, /addEventListener\("popstate"/);
  assert.match(experience, /parseDiscoveryState\(/);
  assert.match(experience, /discoveryAccessValues\.filter/);
  assert.match(experience, /applyState\(defaultDiscoveryState\)/);
  assert.doesNotMatch(experience, /localStorage|sessionStorage|fetch\(/);
});

test("Full Reference uses native controls and one semantic all-row table", async () => {
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
  assert.doesNotMatch(
    experience,
    /data-resource-save|onSavedChange|saved=\{|<dialog|showModal|load more|virtual/i,
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

test("responsive contract withholds desktop table below 1100px and shows Explore handoff", async () => {
  const css = await read("components/full-reference/full-reference.module.css");
  const experience = await read(
    "components/full-reference/full-reference-experience.tsx",
  );

  assert.match(
    css,
    /grid-template-columns:\s*minmax\(220px,\s*0\.78fr\)\s*minmax\(0,\s*2\.5fr\)\s*minmax\(\s*210px,\s*0\.72fr\s*\)/,
  );
  assert.match(css, /\.table\s*\{[\s\S]*?min-width: 720px/);
  assert.match(css, /@media \(max-width: 1099px\)/);
  assert.match(
    css,
    /@media \(max-width: 1099px\)[\s\S]*?\.desktopReference\s*\{[\s\S]*?display: none/,
  );
  assert.match(
    css,
    /@media \(max-width: 1099px\)[\s\S]*?\.mobileHandoff\s*\{[\s\S]*?display: block/,
  );
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(experience, /data-full-reference-handoff/);
  assert.match(experience, /Continue in Explore/);
  assert.doesNotMatch(
    `${css}\n${experience}`,
    /compact resource row|filterDialog|filter sheet|bottom sheet/i,
  );
});
