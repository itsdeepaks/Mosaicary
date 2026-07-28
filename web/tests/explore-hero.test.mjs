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

test("Explore hero uses approved truthful content", async () => {
  const page = await read("app/page.tsx");

  assert.match(page, /Find better design resources, faster\./);
  assert.match(page, /295 carefully selected resources/);
  assert.match(page, /11\s+practical categories/);
  assert.match(page, /href="\/resources"/);
  assert.match(page, /href="\/collections"/);
  assert.doesNotMatch(page, /testimonial|trusted by|users love/i);
});

test("hero artwork is decorative and dimensionally stable", async () => {
  const page = await read("app/page.tsx");

  assert.match(page, /src="\/brand\/tessli-hero-geometry\.webp"/);
  assert.match(page, /alt=""/);
  assert.match(page, /width=\{1536\}/);
  assert.match(page, /height=\{1024\}/);
  assert.match(page, /priority/);
  assert.match(page, /aria-hidden="true"/);
});

test("hero responsive contract avoids animation and hides artwork below 390px", async () => {
  const css = await read("app/page.module.css");

  assert.match(css, /grid-column: 1 \/ span 7/);
  assert.match(css, /grid-column: 8 \/ -1/);
  assert.match(css, /@media \(max-width: 767px\)/);
  assert.match(css, /@media \(max-width: 389px\)[\s\S]*?\.artwork \{[\s\S]*?display: none/);
  assert.doesNotMatch(css, /animation:/);
  assert.doesNotMatch(css, /cursor-follow|scroll-jack/i);
});

test("search and statistics remain outside Slice 3.1", async () => {
  const page = await read("app/page.tsx");

  assert.doesNotMatch(page, /<input|role="search"|aria-live/);
  assert.doesNotMatch(page, /Curated resources|Practical categories|Browser-local saves/);
});
