import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const pagePath = new URL(
  "../app/proofs/oss-homepage/page.tsx",
  import.meta.url,
);
const stylesPath = new URL(
  "../app/proofs/oss-homepage/oss-homepage.module.css",
  import.meta.url,
);
const sitemapPath = new URL("../app/sitemap.ts", import.meta.url);
const navigationPath = new URL(
  "../components/site-header/navigation.ts",
  import.meta.url,
);
const evidencePath = new URL(
  "../../docs/proofs/oss-homepage/implementation.md",
  import.meta.url,
);

test("OSS proof candidate remains isolated and non-indexable", async () => {
  const [page, sitemap, navigation] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(sitemapPath, "utf8"),
    readFile(navigationPath, "utf8"),
  ]);
  assert.match(page, /data-oss-proof="ready"/u);
  assert.match(page, /data-proof-candidate="first"/u);
  assert.match(page, /index: false/u);
  assert.match(page, /follow: false/u);
  assert.doesNotMatch(sitemap, /proofs\/oss-homepage/u);
  assert.doesNotMatch(navigation, /proofs\/oss-homepage/u);
  assert.doesNotMatch(page, /fetch\(|process\.env|localStorage|cookies\(/u);
});

test("candidate implements the approved content architecture without fake proof", async () => {
  const page = await readFile(pagePath, "utf8");
  for (const expected of [
    "Your business needs a technical partner, not another hand-off.",
    "Choose the business problem, not the platform.",
    "Evidence of range, without invented results.",
    "How the partnership works",
    "Capability depth",
    "Why a technical partner",
    "ScopeQR",
    "Daddy Official",
    "BrandScope",
    "proof only",
  ]) {
    assert.match(
      page,
      new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"),
    );
  }
  assert.doesNotMatch(
    page,
    /testimonial|award-winning|trusted by|clients served|revenue increased|guaranteed results/iu,
  );
  assert.doesNotMatch(page, /social media marketing/iu);
});

test("candidate actions are in-page and no external form or provider asset is introduced", async () => {
  const page = await readFile(pagePath, "utf8");
  const hrefs = [...page.matchAll(/href="([^"]+)"/gu)].map(
    (match) => match[1],
  );
  assert.ok(hrefs.length >= 8);
  assert.equal(
    hrefs.every((href) => href.startsWith("#")),
    true,
  );
  assert.doesNotMatch(page, /<form|onSubmit|mailto:|wa\.me|target="_blank"/u);
  assert.doesNotMatch(page, /<img|next\/image|https?:\/\//u);
  assert.doesNotMatch(page, /three|WebGL|canvas/iu);
});

test("candidate CSS is route-scoped, responsive, focus-safe, and reduced-motion aware", async () => {
  const styles = await readFile(stylesPath, "utf8");
  assert.match(styles, /body:has\(\[data-oss-proof\]\)/u);
  assert.match(styles, /\[data-site-content\] > footer/u);
  assert.match(styles, /@media \(max-width: 1100px\)/u);
  assert.match(styles, /@media \(max-width: 780px\)/u);
  assert.match(styles, /@media \(max-width: 520px\)/u);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.match(styles, /@media \(forced-colors: active\)/u);
  assert.match(styles, /:focus-visible/u);
  assert.match(styles, /min-height: 48px/u);
  assert.match(styles, /overflow: clip/u);
  assert.doesNotMatch(styles, /animation:/u);
});

test("first-candidate evidence records traceability and defers human judgment", async () => {
  const evidence = await readFile(evidencePath, "utf8");
  assert.match(
    evidence,
    /First candidate head: `8577e3e6c3dbdd8d629bc8752b2f23060fb8643d`/u,
  );
  assert.match(evidence, /3D: rejected for the first candidate/u);
  assert.match(evidence, /No human scores/u);
  assert.match(evidence, /characters: pending deterministic calculation/u);
  assert.match(
    evidence,
    /approximate tokens: pending deterministic calculation/u,
  );
});
