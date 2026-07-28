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

test("resource card keeps external navigation native and save independent", async () => {
  const component = await read("components/resource-card/resource-card.tsx");
  const anchorClose = component.indexOf("</a>");
  const saveButton = component.indexOf("<button", anchorClose);

  assert.match(component, /^"use client";/);
  assert.match(component, /<a[\s\S]*?className=\{styles\.cardLink\}/);
  assert.match(component, /aria-labelledby=\{titleId\}/);
  assert.match(component, /aria-describedby=\{descriptionId\}/);
  assert.match(component, /target="_blank"/);
  assert.match(component, /rel="noopener noreferrer"/);
  assert.ok(anchorClose > 0 && saveButton > anchorClose);
  assert.match(component, /aria-pressed=\{saved\}/);
  assert.match(component, /data-resource-save=\{resource\.id\}/);
  assert.match(component, /onSavedChange\(resource\.id, !saved\)/);
  assert.doesNotMatch(component, /window\.open|router\.push|preventDefault/);
});

test("resource media follows the safe preview, favicon, generated fallback chain", async () => {
  const component = await read("components/resource-card/resource-card.tsx");

  assert.match(component, /kind: "preview"/);
  assert.match(component, /kind: "favicon"/);
  assert.match(component, /generatedMark\(resource\.name\)/);
  assert.match(component, /image\.addEventListener\("error", advanceFallback\)/);
  assert.match(component, /image\.complete && image\.naturalWidth === 0/);
  assert.match(component, /queueMicrotask\(advanceFallback\)/);
  assert.match(component, /setMediaIndex\(\(current\) => current \+ 1\)/);
  assert.match(component, /loading="lazy"/);
  assert.match(component, /decoding="async"/);
  assert.match(component, /referrerPolicy="no-referrer"/);
  assert.match(component, /!value\.startsWith\("\/\/"\)/);
  assert.match(
    component,
    /url\.protocol === "https:" \|\| url\.protocol === "http:"/,
  );
  assert.doesNotMatch(component, /onLoad=|data-media-loaded/);
  assert.doesNotMatch(
    component,
    /next\/image|dangerouslySetInnerHTML|fetch\(|XMLHttpRequest|innerHTML/,
  );
});

test("resource card geometry survives long copy and missing media", async () => {
  const css = await read("components/resource-card/resource-card.module.css");

  assert.match(css, /aspect-ratio: 16 \/ 10/);
  assert.match(css, /border-radius: 0/);
  assert.match(css, /\.mediaImage\s*\{[\s\S]*?opacity: 1/);
  assert.doesNotMatch(css, /\.mediaImage\s*\{[\s\S]*?opacity: 0/);
  assert.match(css, /\.mediaLabel\s*\{[\s\S]*?background:/);
  assert.match(css, /-webkit-line-clamp: 2/);
  assert.match(css, /-webkit-line-clamp: 3/);
  assert.match(css, /min-width: 44px/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /\.card:hover,\s*\.card:focus-within/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(css, /border-radius: 1[2-9]px|backdrop-filter/);
});

test("pilot lab uses twelve real resources and labels every fixture boundary", async () => {
  const [page, lab] = await Promise.all([
    read("app/lab/resource-cards/page.tsx"),
    read("app/lab/resource-cards/resource-card-lab.tsx"),
  ]);

  for (const slug of [
    "land-book",
    "dark-mode-design",
    "awwwards",
    "shadcn-ui",
    "designindex",
    "lapa-ninja",
    "godly",
    "tailwind-plus",
    "toools-design",
    "pttrns",
    "atmos",
    "dark-design",
  ]) {
    assert.match(page, new RegExp(`slug: "${slug}"`));
  }

  assert.match(page, /Fixture boundary/);
  assert.match(page, /QA fixtures—not published catalogue\s+metadata/);
  assert.match(page, /Broken preview → favicon/);
  assert.match(page, /Broken preview → generated mark/);
  assert.match(page, /Long title · paid/);
  assert.match(page, /Long description · free/);
  assert.match(page, /Free-trial access state/);
  assert.match(lab, /new Set\(cases\.slice\(0, 1\)/);
  assert.match(lab, /data-resource-card-pilot/);
  assert.doesNotMatch(lab, /localStorage|sessionStorage|fetch\(/);
});

test("pilot media fixtures remain repository-local and non-production", async () => {
  const page = await read("app/lab/resource-cards/page.tsx");

  for (const asset of [
    "/lab/resource-preview-light.svg",
    "/lab/resource-preview-dark.svg",
    "/lab/resource-logo-transparent.svg",
    "/lab/resource-favicon.svg",
  ]) {
    assert.match(page, new RegExp(asset.replaceAll("/", "\\/")));
  }

  assert.match(page, /\/lab\/missing-preview\.png/);
  assert.doesNotMatch(
    page,
    /previewImageUrl|faviconUrl\s*=|catalogue\.resources\.map/,
  );
});
