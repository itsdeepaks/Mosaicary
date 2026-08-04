import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const catalogue = JSON.parse(
  await readFile(new URL("../data/catalogue.json", import.meta.url), "utf8"),
);
const page = await readFile(
  new URL("../app/resources/[slug]/page.tsx", import.meta.url),
  "utf8",
);
const actions = await readFile(
  new URL("../components/source-detail/source-actions.tsx", import.meta.url),
  "utf8",
);
const sitemap = await readFile(
  new URL("../app/sitemap.ts", import.meta.url),
  "utf8",
);

test("source detail keeps the complete canonical route set", () => {
  assert.equal(catalogue.resources.length, 295);
  assert.match(page, /generateStaticParams/);
  assert.match(page, /getAllSourceProfiles\(\)/);
  assert.match(page, /dynamicParams = false/);
  assert.match(page, /data-source-detail/);
  assert.match(page, /alternates: \{ canonical:/);
});

test("source detail exposes truthful progressive profile state", () => {
  for (const text of [
    "Availability",
    "Coverage",
    "Freshness",
    "Evidence records",
    "Human review",
    "Best-for information",
    "Known limitations",
    "Collections",
  ]) {
    assert.match(page, new RegExp(text));
  }
  assert.match(page, /items=\{profile\.bestFor\}/);
  assert.match(page, /items=\{profile\.limitations\}/);
  assert.match(page, /items\.length > 0/);
  assert.match(page, /profile\.evidence\.length/);
  assert.doesNotMatch(page, /Add to board/);
});

test("source actions preserve local save and safe provider exit", () => {
  assert.match(actions, /readSavedResourceIds/);
  assert.match(actions, /writeSavedResourceIds/);
  assert.match(actions, /aria-pressed/);
  assert.match(actions, /aria-live="polite"/);
  assert.match(actions, /rel="noopener noreferrer"/);
  assert.match(actions, /target="_blank"/);
  assert.match(actions, /Provider currently unavailable/);
});

test("sitemap includes every canonical source profile", () => {
  assert.match(sitemap, /getAllSourceProfiles/);
  assert.match(sitemap, /\/resources\/\$\{profile\.slug\}/);
  assert.match(sitemap, /NEXT_PUBLIC_SITE_URL/);
  assert.match(sitemap, /VERCEL_PROJECT_PRODUCTION_URL/);
});
