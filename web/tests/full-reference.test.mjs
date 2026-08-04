import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (relativePath) => readFile(new URL(relativePath, root), "utf8");

const catalogue = JSON.parse(await read("data/catalogue.json"));

const allowedViews = new Set(["cards", "list", "table"]);
const allowedSorts = new Set(["name-asc", "name-desc"]);

function normalizeView(value) {
  return allowedViews.has(value) ? value : "cards";
}

function normalizeSort(value) {
  return allowedSorts.has(value) ? value : "name-asc";
}

test("canonical Browse derives one paginated result set from source profiles", async () => {
  const [page, browse, results] = await Promise.all([
    read("app/resources/page.tsx"),
    read("lib/browse.ts"),
    read("components/browse/browse-results.tsx"),
  ]);

  assert.match(page, /getAllSourceProfiles/);
  assert.match(page, /deriveBrowseResult/);
  assert.match(page, /<BrowseResults/);
  assert.match(page, /pagination/);
  assert.match(browse, /CARD_PAGE_SIZE = 24/);
  assert.match(browse, /ROW_PAGE_SIZE = 50/);
  assert.match(browse, /slice\(start, start \+ pageSize\)/);
  assert.match(results, /data-browse-view="cards"/);
  assert.match(results, /data-browse-view="list"/);
  assert.match(results, /data-browse-view="table"/);
});

test("Browse state is allowlisted, serializable, and rejects fake verification sorting", async () => {
  const browse = await read("lib/browse.ts");

  assert.equal(normalizeView("table"), "table");
  assert.equal(normalizeView("unknown"), "cards");
  assert.equal(normalizeSort("name-desc"), "name-desc");
  assert.equal(normalizeSort("recently-verified"), "name-asc");
  assert.match(browse, /BROWSE_VIEWS/);
  assert.match(browse, /BROWSE_SORTS/);
  assert.match(browse, /URLSearchParams/);
  assert.doesNotMatch(browse, /recently-verified|verified-desc|verified-asc/);
});

test("cards, list, and table expose internal profiles plus independent save and provider actions", async () => {
  const results = await read("components/browse/browse-results.tsx");

  assert.match(results, /href={`\/resources\/\${profile\.slug}`}/);
  assert.match(results, /Inspect Tessli profile/);
  assert.match(results, /Visit source ↗/);
  assert.match(results, /aria-pressed/);
  assert.match(results, /writeSavedResourceIds/);
  assert.match(results, /rel="noopener noreferrer"/);
  assert.match(results, /target="_blank"/);
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
  const [detail, actions] = await Promise.all([
    read("app/resources/[slug]/page.tsx"),
    read("components/source-detail/source-actions.tsx"),
  ]);

  assert.match(detail, /generateStaticParams/);
  assert.match(detail, /getAllSourceProfiles\(\)\.map/);
  assert.match(detail, /getSourceProfile/);
  assert.match(detail, /if \(!profile\) notFound\(\)/);
  assert.match(detail, /profile\.profileLevel/);
  assert.match(detail, /profile\.coverage\.reason/);
  assert.match(detail, /<SourceActions resource=\{card\}/);
  assert.match(detail, /What this profile supports/i);
  assert.match(actions, /Visit source ↗/);
  assert.match(actions, /rel="noopener noreferrer"/);
  assert.doesNotMatch(detail, /rating|popularity|quality score|trend/i);
});
