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

test("canonical Browse derives one paginated result set from source profiles", async () => {
  const [page, browse] = await Promise.all([
    read("app/resources/page.tsx"),
    read("lib/browse.ts"),
  ]);

  assert.match(page, /getAllSourceProfiles\(\)/);
  assert.match(page, /parseBrowseState\(/);
  assert.match(page, /deriveBrowseResults\(/);
  assert.match(page, /<BrowseResults resources=\{resources\}/);
  assert.match(
    page,
    /redirect\(withState\(state, \{ page: result\.page \}\)\)/,
  );
  assert.match(browse, /state\.view === "cards" \? 24 : 50/);
  assert.match(browse, /filtered\.slice\(start, start \+ pageSize\)/);
  assert.doesNotMatch(page, /FullReferenceExperience|fetch\(/);
});

test("Browse state is allowlisted, serializable, and rejects fake verification sorting", async () => {
  const browse = await read("lib/browse.ts");

  for (const field of [
    "q",
    "category",
    "access",
    "sourceType",
    "profileLevel",
    "sort",
    "view",
    "page",
  ]) {
    assert.match(browse, new RegExp(`"${field}"`));
  }

  assert.match(
    browse,
    /browseSortValues = \["curated", "name-asc", "name-desc"\]/,
  );
  assert.match(
    browse,
    /Legacy sort=verified intentionally normalizes to curated/,
  );
  assert.doesNotMatch(browse, /browseSortValues[^\n]*verified/);
  assert.match(browse, /Number\.isSafeInteger\(number\) && number > 0/);
  assert.match(browse, /slice\(0, 160\)/);
});

test("cards, list, and table expose internal profiles plus independent save and provider actions", async () => {
  const results = await read("components/browse/browse-results.tsx");

  assert.match(results, /if \(view === "cards"\)/);
  assert.match(results, /if \(view === "table"\)/);
  assert.match(results, /data-browse-view="cards"/);
  assert.match(results, /data-browse-view="table"/);
  assert.match(results, /data-browse-view="list"/);
  assert.match(results, /href=\{`\/resources\/\$\{profile\.slug\}`\}/);
  assert.match(results, /Visit source ↗/);
  assert.match(results, /target="_blank"/);
  assert.match(results, /rel="noopener noreferrer"/);
  assert.match(results, /aria-pressed=\{savedIds\.includes\(card\.id\)\}/);
  assert.match(results, /aria-live="polite"/);
  assert.match(results, /<table className=\{styles\.table\}>/);
  assert.match(results, /<caption className=\{styles\.srOnly\}>/);
  assert.doesNotMatch(results, /fetch\(|sessionStorage/);
});

test("canonical Browse renders one responsive result tree without duplicate desktop and mobile catalogues", async () => {
  const [page, results, css] = await Promise.all([
    read("app/resources/page.tsx"),
    read("components/browse/browse-results.tsx"),
    read("components/browse/browse.module.css"),
  ]);

  assert.equal((page.match(/<BrowseResults/g) ?? []).length, 1);
  assert.doesNotMatch(
    results,
    /desktopResources|mobileResources|desktopReference|mobileReference/,
  );
  assert.match(css, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 1100px\)/);
  assert.match(css, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /overflow-x:\s*auto/);
});

test("minimum source profile routes cover all source slugs without overstating enrichment", async () => {
  const detail = await read("app/resources/[slug]/page.tsx");

  assert.match(detail, /generateStaticParams/);
  assert.match(detail, /getAllSourceProfiles\(\)\.map/);
  assert.match(detail, /getSourceProfile/);
  assert.match(detail, /if \(!profile\) notFound\(\)/);
  assert.match(detail, /profile\.profileLevel/);
  assert.match(detail, /profile\.coverage\.reason/);
  assert.match(detail, /Visit source ↗/);
  assert.match(detail, /minimum truthful profile boundary/i);
  assert.doesNotMatch(detail, /rating|popularity|quality score|trend/i);
});
