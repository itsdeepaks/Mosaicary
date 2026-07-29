import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const vercelConfigUrl = new URL("../../vercel.json", import.meta.url);

async function readVercelConfig() {
  return JSON.parse(await readFile(vercelConfigUrl, "utf8"));
}

test("automatic Vercel Git deployments remain paused during local and CI development", async () => {
  const config = await readVercelConfig();

  assert.equal(config.$schema, "https://openapi.vercel.sh/vercel.json");
  assert.equal(config.git?.deploymentEnabled, false);
});

test("pausing deployments preserves the legacy security-header contract", async () => {
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
