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

test("Explore page delegates to the scoped hero component", async () => {
  const page = await read("app/page.tsx");

  assert.match(page, /<ExploreHero \/>/);
  assert.match(page, /id="main-content"/);
  assert.doesNotMatch(page, /application foundation/i);
});

test("Explore hero uses approved factual content without later-slice UI", async () => {
  const hero = await read("components/explore-hero/explore-hero.tsx");

  assert.match(hero, /Find better design resources, faster\./);
  assert.match(hero, /manually curated index/);
  assert.match(hero, /web and product design/);
  assert.doesNotMatch(hero, /<input|role="search"|aria-live/);
  assert.doesNotMatch(hero, /295|11|Browser-local saves|Community-built/);
  assert.doesNotMatch(hero, /href=|<button/);
  assert.doesNotMatch(hero, /testimonial|trusted by|users love/i);
});

test("hero artwork is decorative, stable, responsive, and preloaded", async () => {
  const hero = await read("components/explore-hero/explore-hero.tsx");

  assert.match(hero, /src="\/brand\/tessli-hero-geometry\.webp"/);
  assert.match(hero, /alt=""/);
  assert.match(hero, /width=\{900\}/);
  assert.match(hero, /height=\{614\}/);
  assert.match(hero, /preload/);
  assert.match(hero, /unoptimized/);
  assert.match(hero, /sizes=/);
  assert.match(hero, /aria-hidden="true"/);
});

test("hero layout recomposes instead of shrinking or animating", async () => {
  const css = await read("components/explore-hero/explore-hero.module.css");

  assert.match(css, /grid-column: 1 \/ span 6/);
  assert.match(css, /grid-column: 7 \/ -1/);
  assert.match(css, /width: min\(92%, 720px\)/);
  assert.match(css, /@media \(max-width: 1024px\)/);
  assert.match(css, /grid-column: 1 \/ span 5/);
  assert.match(css, /grid-column: 6 \/ -1/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /overflow: hidden/);
  assert.match(css, /width: min\(560px, 145vw\)/);
  assert.match(css, /@media \(max-width: 389px\)[\s\S]*?display: none/);
  assert.doesNotMatch(css, /animation:/);
});

test("global overflow QA is independent from the grain control", async () => {
  const [layout, probe, grainToggle] = await Promise.all([
    read("app/layout.tsx"),
    read("components/viewport-overflow-probe/viewport-overflow-probe.tsx"),
    read("app/lab/grain-toggle.tsx"),
  ]);

  assert.match(layout, /<ViewportOverflowProbe \/>/);
  assert.match(probe, /data.*horizontalOverflow|horizontalOverflow/);
  assert.match(probe, /ResizeObserver/);
  assert.doesNotMatch(grainToggle, /horizontalOverflow|ResizeObserver/);
});
