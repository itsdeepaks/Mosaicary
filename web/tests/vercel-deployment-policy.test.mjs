import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { test } from "node:test";

const repositoryRootUrl = new URL("../../", import.meta.url);
const vercelConfigUrl = new URL("vercel.json", repositoryRootUrl);
const legacyIndexUrl = new URL("index.html", repositoryRootUrl);

async function readVercelConfig() {
  return JSON.parse(await readFile(vercelConfigUrl, "utf8"));
}

test("Vercel builds and deploys the Next.js workspace", async () => {
  const config = await readVercelConfig();

  assert.equal(config.$schema, "https://openapi.vercel.sh/vercel.json");
  assert.equal(config.framework, "nextjs");
  assert.equal(config.installCommand, "npm --prefix web ci");
  assert.equal(config.buildCommand, "npm --prefix web run build");
  assert.equal(config.outputDirectory, "web/.next");
  assert.equal(config.git?.deploymentEnabled, true);
});

test("the repository-root legacy static entry point is retired", async () => {
  await assert.rejects(access(legacyIndexUrl, constants.F_OK), {
    code: "ENOENT",
  });
});

test("the Next.js cutover preserves the browser security-header contract", async () => {
  const config = await readVercelConfig();
  const catchAll = config.headers?.find((entry) => entry.source === "/(.*)");
  const headers = new Map(
    catchAll?.headers?.map((header) => [header.key, header.value]) ?? [],
  );

  assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(
    headers.get("Referrer-Policy"),
    "strict-origin-when-cross-origin",
  );
  assert.equal(headers.get("X-Frame-Options"), "DENY");
});
