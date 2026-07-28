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

test("approved variable fonts are loaded through next/font", async () => {
  const fonts = await read("app/fonts.ts");
  const layout = await read("app/layout.tsx");

  assert.match(fonts, /Instrument_Sans/);
  assert.match(fonts, /Newsreader/);
  assert.match(fonts, /--font-newsreader/);
  assert.match(fonts, /--font-instrument-sans/);
  assert.match(layout, /interfaceFont\.variable/);
  assert.match(layout, /displayFont\.variable/);
});

test("visual tokens match the approved Tessli contract", async () => {
  const css = await read("app/globals.css");

  for (const token of [
    "--canvas: #fcf8f3",
    "--surface: #fffefc",
    "--text-strong: #151412",
    "--accent: #f05217",
    "--line: #d8d1c8",
  ]) {
    assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(css, /letter-spacing: -0\.015em/);
  assert.match(css, /letter-spacing: -0\.025em/);
  assert.match(css, /\.tessli-panel[\s\S]*border-radius: 0/);
  assert.match(css, /--radius-control-md: 7px/);
});

test("grain and responsive grid safeguards are present", async () => {
  const css = await read("app/globals.css");

  assert.match(css, /html\[data-grain="on"\] body/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /grid-template-columns: repeat\(12/);
  assert.match(css, /grid-template-columns: repeat\(8/);
  assert.match(css, /grid-template-columns: repeat\(4/);
});

test("foundation lab contains all required specimen sections", async () => {
  const page = await read("app/lab/page.tsx");

  for (const marker of [
    "Typography with character",
    "Soothing colour comes from restraint",
    "A grid that recomposes",
    "Sharp content surfaces",
  ]) {
    assert.match(page, new RegExp(marker));
  }
});
