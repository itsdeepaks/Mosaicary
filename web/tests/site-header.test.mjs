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

test("only implemented navigation routes are available", async () => {
  const navigation = await read("components/site-header/navigation.ts");

  assert.match(
    navigation,
    /label: "Explore", href: "\/", available: true/,
  );
  for (const label of ["Collections", "Resources", "About", "Saved"]) {
    assert.match(
      navigation,
      new RegExp(`label: "${label}"[\\s\\S]*?available: false`),
    );
  }
});

test("header implements accessible modal navigation behaviour", async () => {
  const header = await read("components/site-header/site-header.tsx");

  assert.match(header, /aria-modal="true"/);
  assert.match(header, /role="dialog"/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /document\.body\.style\.overflow = "hidden"/);
  assert.match(header, /triggerRef\.current\?\.focus\(\)/);
  assert.match(header, /event\.key !== "Tab"/);
  assert.doesNotMatch(header, /Sign in|fake avatar|theme toggle/i);
});

test("header visual contract uses underline and mobile breakpoint", async () => {
  const css = await read("components/site-header/site-header.module.css");

  assert.match(css, /\.navigationLink::after/);
  assert.match(css, /background: var\(--accent\)/);
  assert.match(css, /@media \(max-width: 767px\)/);
  assert.match(css, /\.sheet[\s\S]*height: 100%/);
});

test("root layout mounts one global header and skip link", async () => {
  const layout = await read("app/layout.tsx");
  const home = await read("app/page.tsx");
  const lab = await read("app/lab/page.tsx");

  assert.match(layout, /<SiteHeader \/>/);
  assert.match(layout, /href="#main-content"/);
  assert.match(home, /id="main-content"/);
  assert.match(lab, /id="main-content"/);
  assert.doesNotMatch(lab, /<header/);
});
