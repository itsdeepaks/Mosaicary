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

  assert.match(navigation, /label: "Explore", href: "\/", available: true/);
  for (const label of ["Collections", "Resources", "About", "Saved"]) {
    assert.match(
      navigation,
      new RegExp(`label: "${label}"[\\s\\S]*?available: true`),
    );
  }
});

test("header implements accessible modal navigation behaviour", async () => {
  const header = await read("components/site-header/site-header.tsx");

  assert.match(header, /aria-modal="true"/);
  assert.match(header, /aria-labelledby="mobile-navigation-title"/);
  assert.match(header, /role="dialog"/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /document\.body\.style\.overflow = "hidden"/);
  assert.match(header, /siteContent\.inert = true/);
  assert.match(header, /trigger\?\.isConnected/);
  assert.match(header, /event\.key !== "Tab"/);
  assert.match(header, /desktopQuery\.addEventListener\("change"/);
  assert.match(header, /window\.addEventListener\("popstate"/);
  assert.doesNotMatch(header, /Sign in|fake avatar|theme toggle/i);
});

test("header avoids synchronous state updates during effect setup", async () => {
  const header = await read("components/site-header/site-header.tsx");

  assert.doesNotMatch(header, /useEffect\(\(\) => \{\s*closeMenu\(\)/);
  assert.match(header, /requestAnimationFrame\(updateScrollState\)/);
  assert.match(header, /cancelAnimationFrame\(focusFrame\)/);
});

test("header visual contract uses underline and a viewport modal", async () => {
  const css = await read("components/site-header/site-header.module.css");

  assert.match(css, /\.navigationLink::after/);
  assert.match(css, /background: var\(--accent\)/);
  assert.match(css, /@media \(max-width: 767px\)/);
  assert.match(css, /\.sheetLayer \{[\s\S]*?inset: 0/);
  assert.match(css, /\.sheet \{[\s\S]*?height: 100%/);
  assert.doesNotMatch(css, /backdrop-filter/);
});

test("root layout mounts one global header and isolates site content", async () => {
  const layout = await read("app/layout.tsx");
  const home = await read("app/page.tsx");
  const lab = await read("app/lab/page.tsx");

  assert.match(layout, /<SiteHeader \/>/);
  assert.match(layout, /href="#main-content"/);
  assert.match(layout, /data-site-content/);
  assert.match(home, /id="main-content"/);
  assert.match(lab, /id="main-content"/);
  assert.doesNotMatch(lab, /<header/);
});
