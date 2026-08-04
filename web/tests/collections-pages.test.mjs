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

test("collection adapter resolves validated IDs without silent member loss", async () => {
  const adapter = await read("lib/collections.ts");

  assert.match(adapter, /import catalogue from "@\/data\/catalogue\.json"/);
  assert.match(adapter, /const resourceById = new Map/);
  assert.match(adapter, /const categoryLabelById = new Map/);
  assert.match(adapter, /collection\.resourceIds\.map/);
  assert.match(adapter, /references missing resource/);
  assert.match(
    adapter,
    /\.filter\(\(collection\) => collection\.status === "published"\)/,
  );
  assert.match(adapter, /getPublishedCollections/);
  assert.match(adapter, /getPublishedCollection/);
  assert.match(adapter, /timeZone: "UTC"/);
  assert.doesNotMatch(
    adapter,
    /filter\(Boolean\)|fetch\(|localStorage|sessionStorage/,
  );
});

test("Collections index renders six repository collections with layout-only variants", async () => {
  const page = await read("app/collections/page.tsx");

  assert.match(page, /getPublishedCollections\(\)/);
  assert.match(page, /data-collections-grid/);
  assert.match(page, /collections\.map\(\(collection, index\)/);
  assert.match(page, /index < 2 \? "featured" : "compact"/);
  assert.match(
    page,
    /<CollectionCard collection=\{collection\} variant=\{variant\}/,
  );
  assert.match(
    page,
    /There are no trend\s+scores, fictional curators, or popularity rankings/,
  );
  assert.doesNotMatch(
    page,
    /RoutePlaceholder|<input|Search|Trending|Recent|save/i,
  );
});

test("collection cards are native internal links with factual metadata and no save UI", async () => {
  const card = await read("components/collection-card/collection-card.tsx");

  assert.match(
    card,
    /export type CollectionCardVariant = "featured" \| "compact"/,
  );
  assert.match(card, /href=\{`\/collections\/\$\{collection\.slug\}`\}/);
  assert.match(card, /collection\.resources\.length/);
  assert.match(card, /formatCollectionReviewDate/);
  assert.match(card, /data-collection-cover-style=\{style\}/);
  assert.match(card, /aria-labelledby=\{titleId\}/);
  assert.match(card, /aria-describedby=\{descriptionId\}/);
  assert.doesNotMatch(
    card,
    /button|onClick|saved|curator|avatar|trending\b|popular\b/i,
  );
});

test("collection details are static, ordered, truthful, and 404 unknown slugs", async () => {
  const [detail, resourceList] = await Promise.all([
    read("app/collections/[slug]/page.tsx"),
    read("components/collection-resources/collection-resource-list.tsx"),
  ]);

  assert.match(detail, /export const dynamicParams = false/);
  assert.match(detail, /generateStaticParams/);
  assert.match(detail, /getPublishedCollections\(\)\.map/);
  assert.match(detail, /getPublishedCollection\(slug\)/);
  assert.match(detail, /notFound\(\)/);
  assert.match(
    detail,
    /data-collection-resource-count=\{collection\.resources\.length\}/,
  );
  assert.match(detail, /<time dateTime=\{collection\.lastReviewedAt\}>/);
  assert.match(detail, /href="\/suggest"/);
  assert.match(detail, /<CollectionResourceList/);
  assert.match(detail, /className=\{styles\.grid\}/);
  assert.match(detail, /resources=\{collection\.resources\}/);

  assert.match(
    resourceList,
    /<ol className=\{className\} data-collection-resource-grid>/,
  );
  assert.match(resourceList, /resources\.map/);
  assert.match(resourceList, /<ResourceCard/);
  assert.match(resourceList, /onSavedChange=\{handleSavedChange\}/);
  assert.match(resourceList, /saved=\{savedIds\.includes\(resource\.id\)\}/);
  assert.doesNotMatch(resourceList, /curator|avatar|trending\b|popular\b/i);
});

test("Collections layouts follow featured/compact and four-two-one resource contracts", async () => {
  const [cardCss, indexCss, detailCss] = await Promise.all([
    read("components/collection-card/collection-card.module.css"),
    read("app/collections/collections.module.css"),
    read("app/collections/[slug]/collection-detail.module.css"),
  ]);

  assert.match(cardCss, /data-collection-variant="featured"/);
  assert.match(cardCss, /data-collection-variant="compact"/);
  assert.match(cardCss, /data-collection-cover-style="editorial"/);
  assert.match(cardCss, /data-collection-cover-style="typography"/);
  assert.match(cardCss, /data-collection-cover-style="motion"/);
  assert.match(cardCss, /data-collection-cover-style="systems"/);
  assert.match(cardCss, /@media \(forced-colors: active\)/);
  assert.match(
    indexCss,
    /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/,
  );
  assert.match(indexCss, /\.featuredItem\s*\{[\s\S]*?grid-column: 1 \/ -1/);
  assert.match(indexCss, /@media \(max-width: 767px\)/);
  assert.match(
    detailCss,
    /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/,
  );
  assert.match(detailCss, /@media \(max-width: 1279px\)/);
  assert.match(
    detailCss,
    /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/,
  );
  assert.match(detailCss, /@media \(max-width: 767px\)/);
  assert.match(detailCss, /grid-template-columns: 1fr/);
  assert.doesNotMatch(
    `${cardCss}\n${indexCss}\n${detailCss}`,
    /backdrop-filter|border-radius: 1[2-9]px/,
  );
});
