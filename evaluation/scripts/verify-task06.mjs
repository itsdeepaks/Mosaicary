#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const axePath = require.resolve("axe-core/axe.min.js");

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const url = argument("--url");
const out = argument("--out");
if (!url || !out) {
  console.error("Usage: node scripts/verify-task06.mjs --url <url> --out <artifact-directory>");
  process.exit(2);
}

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
];
const screenshotDir = path.join(out, "screenshots");
await mkdir(screenshotDir, { recursive: true });

async function inspectPage(page, viewport) {
  const consoleEvents = [];
  const pageErrors = [];
  page.on("console", message => {
    if (["error", "warning"].includes(message.type())) consoleEvents.push({ type: message.type(), text: message.text() });
  });
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: "networkidle" });
  const structural = await page.evaluate(() => ({
    title: document.title,
    bodyTextLength: document.body.innerText.trim().length,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    frameworkOverlay: Boolean(document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")),
  }));
  await page.screenshot({ path: path.join(screenshotDir, `library-${viewport.width}x${viewport.height}.png`), fullPage: false });
  return { viewport, ...structural, console: consoleEvents, page_errors: pageErrors };
}

const browser = await chromium.launch({ headless: true });
let passed = true;
try {
  const checks = [];
  for (const viewport of viewports) {
    const page = await browser.newPage();
    const result = await inspectPage(page, viewport);
    checks.push(result);
    if (result.overflow || result.frameworkOverlay || result.bodyTextLength === 0 || result.console.length || result.page_errors.length) passed = false;
    await page.close();
  }

  const interaction = await browser.newPage({ viewport: viewports[0] });
  await interaction.goto(url, { waitUntil: "networkidle" });
  await interaction.getByRole("searchbox", { name: "Search resources" }).fill("Mobbin");
  const searchResult = await interaction.locator("#resultText").innerText();
  await interaction.getByRole("searchbox", { name: "Search resources" }).fill("zzzz-not-a-resource");
  const noResults = await interaction.locator("#cards").innerText();
  await interaction.getByRole("tab", { name: "Markdown" }).click();
  const markdownVisible = await interaction.locator("#markdownView").isVisible();
  await interaction.screenshot({ path: path.join(screenshotDir, "mobile-interactions.png"), fullPage: false });
  const axe = await interaction.addScriptTag({ path: axePath }).then(async () => interaction.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } });
    return { violations: result.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length })), incomplete: result.incomplete.map(({ id }) => id) };
  }));
  if (axe.violations.length) passed = false;
  await interaction.close();

  const errorPage = await browser.newPage({ viewport: viewports[0] });
  await errorPage.route("**/lib_data/design-resource-library-295.csv", route => route.fulfill({ status: 503, contentType: "text/plain", body: "Injected CSV failure" }));
  await errorPage.goto(url, { waitUntil: "networkidle" });
  const csvMessage = await errorPage.locator("#cards").innerText();
  const csvFailure = { injected: true, visible_error: csvMessage.includes("Could not load CSV."), message: csvMessage };
  await errorPage.screenshot({ path: path.join(screenshotDir, "csv-load-error-390x844.png"), fullPage: false });
  if (!csvFailure.visible_error) passed = false;
  await errorPage.close();

  const evidence = { version: 1, url, viewports: checks, interactions: { search_result: searchResult, no_results: noResults, markdown_visible: markdownVisible }, csv_failure: csvFailure, axe, passed };
  await writeFile(path.join(out, "browser-evidence.json"), JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify(evidence, null, 2));
  if (!passed) process.exitCode = 1;
} finally {
  await browser.close();
}
