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

test("hero search supports the approved keyboard lifecycle", async () => {
  const search = await read("components/explore-hero/hero-search.tsx");

  assert.match(search, /event\.key\.toLowerCase\(\) === "k"/);
  assert.match(search, /event\.ctrlKey \|\| event\.metaKey/);
  assert.match(search, /event\.preventDefault\(\)/);
  assert.match(search, /inputRef\.current\?\.focus\(\)/);
  assert.match(search, /inputRef\.current\?\.select\(\)/);
  assert.match(search, /event\.key !== "Escape"/);
  assert.match(search, /event\.currentTarget\.blur\(\)/);
});

test("hero search clear and announcement states are truthful", async () => {
  const search = await read("components/explore-hero/hero-search.tsx");

  assert.match(search, /window\.setTimeout\([\s\S]*?100\)/);
  assert.match(search, /aria-live="polite"/);
  assert.match(search, /aria-atomic="true"/);
  assert.match(search, /Search query/);
  assert.match(search, /resources are available in Tessli/);
  assert.match(search, /aria-label="Clear search"/);
  assert.match(search, /requestAnimationFrame/);
  assert.doesNotMatch(search, /fetch\(|axios|router\.push|URLSearchParams/);
  assert.doesNotMatch(search, /results found|matching resources/i);
});

test("hero search exposes semantic, reusable input and shortcut guidance", async () => {
  const search = await read("components/explore-hero/hero-search.tsx");
  const css = await read("components/explore-hero/hero-search.module.css");

  assert.match(search, /useId/);
  assert.match(search, /const inputId = useId\(\)/);
  assert.match(search, /htmlFor=\{inputId\}/);
  assert.match(search, /id=\{inputId\}/);
  assert.match(search, /role="search"/);
  assert.match(search, /type="search"/);
  assert.match(search, /aria-keyshortcuts="Control\+K Meta\+K"/);
  assert.match(search, /Search Tessli resources/);
  assert.match(search, /Ctrl K/);
  assert.match(css, /min-height: 54px/);
  assert.match(css, /\.search:focus-within/);
  assert.match(css, /\.clearButton[\s\S]*?width: 44px[\s\S]*?height: 44px/);
  assert.match(
    css,
    /@media \(max-width: 480px\)[\s\S]*?\.shortcut[\s\S]*?display: none/,
  );
});

test("truthful facts use four desktop slots and a two-by-two mobile grid", async () => {
  const css = await read("components/explore-hero/hero-facts.module.css");

  assert.match(css, /grid-column: 1 \/ -1/);
  assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.fact:nth-child\(n \+ 3\)/);
});
