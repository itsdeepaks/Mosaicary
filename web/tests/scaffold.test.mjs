import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const webRoot = path.resolve(path.dirname(currentFile), "..");
const repositoryRoot = path.resolve(webRoot, "..");

async function read(relativePath) {
  return readFile(path.join(webRoot, relativePath), "utf8");
}

test("package scripts and runtime constraints are present", async () => {
  const packageJson = JSON.parse(await read("package.json"));

  assert.equal(packageJson.private, true);
  assert.equal(packageJson.engines.node, ">=20.9.0");
  assert.equal(packageJson.dependencies.next, "16.2.9");

  for (const script of [
    "dev",
    "build",
    "start",
    "typecheck",
    "lint",
    "test",
    "format:check",
  ]) {
    assert.equal(typeof packageJson.scripts[script], "string");
  }
});

test("App Router root layout owns html and body", async () => {
  const layout = await read("app/layout.tsx");

  assert.match(layout, /<html lang="en">/);
  assert.match(layout, /<body>\{children\}<\/body>/);
  assert.match(layout, /import "\.\/globals\.css"/);
});

test("Tailwind CSS v4 PostCSS pipeline is configured", async () => {
  const postcssConfig = await read("postcss.config.mjs");
  const globalCss = await read("app/globals.css");

  assert.match(postcssConfig, /@tailwindcss\/postcss/);
  assert.match(globalCss, /@import "tailwindcss";/);
});

test("legacy root static deployment remains present", async () => {
  const [indexHtml, vercelConfig] = await Promise.all([
    readFile(path.join(repositoryRoot, "index.html"), "utf8"),
    readFile(path.join(repositoryRoot, "vercel.json"), "utf8"),
  ]);

  assert.match(indexHtml, /Tessli/i);
  const parsedVercelConfig = JSON.parse(vercelConfig);
  assert.equal("buildCommand" in parsedVercelConfig, false);
  assert.equal("framework" in parsedVercelConfig, false);
});
