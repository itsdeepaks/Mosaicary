import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const currentFile = fileURLToPath(import.meta.url);
const webRoot = path.resolve(path.dirname(currentFile), "..");
const validPublishableKey = `sb_publishable_${"a".repeat(32)}`;

async function readWebFile(relativePath) {
  return readFile(path.join(webRoot, relativePath), "utf8");
}

async function loadConfigModule() {
  const source = await readWebFile("lib/supabase/config.ts");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: "config.ts",
    reportDiagnostics: true,
  });
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;

  return import(moduleUrl);
}

test("public Supabase configuration accepts hosted and local URLs", async () => {
  const { readSupabasePublicConfig } = await loadConfigModule();

  assert.deepEqual(
    readSupabasePublicConfig({
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: validPublishableKey,
      NEXT_PUBLIC_SUPABASE_URL: "https://tessli.supabase.co/",
    }),
    {
      publishableKey: validPublishableKey,
      url: "https://tessli.supabase.co",
    },
  );

  assert.deepEqual(
    readSupabasePublicConfig({
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: validPublishableKey,
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
    }),
    {
      publishableKey: validPublishableKey,
      url: "http://127.0.0.1:54321",
    },
  );
});

test("public Supabase configuration rejects missing, unsafe, and secret values", async () => {
  const { readSupabasePublicConfig, SupabaseConfigurationError } =
    await loadConfigModule();

  for (const environment of [
    {},
    {
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: validPublishableKey,
      NEXT_PUBLIC_SUPABASE_URL: "http://remote.example.com",
    },
    {
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: validPublishableKey,
      NEXT_PUBLIC_SUPABASE_URL: "https://user:password@example.com",
    },
    {
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_secret_not_public",
      NEXT_PUBLIC_SUPABASE_URL: "https://tessli.supabase.co",
    },
  ]) {
    assert.throws(
      () => readSupabasePublicConfig(environment),
      SupabaseConfigurationError,
    );
  }
});

test("client factories use the public key and preserve request cookie boundaries", async () => {
  const [browser, server, environmentExample] = await Promise.all([
    readWebFile("lib/supabase/browser.ts"),
    readWebFile("lib/supabase/server.ts"),
    readWebFile(".env.example"),
  ]);

  assert.match(browser, /createBrowserClient<Database>/);
  assert.match(browser, /readSupabasePublicConfig\(\)/);
  assert.match(server, /await cookies\(\)/);
  assert.match(server, /createServerClient<Database>/);
  assert.match(server, /getAll\(\)/);
  assert.match(server, /setAll\(cookiesToSet\)/);
  assert.match(environmentExample, /NEXT_PUBLIC_SUPABASE_URL=/);
  assert.match(environmentExample, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=/);

  const implementation = `${browser}\n${server}`;
  assert.doesNotMatch(implementation, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(implementation, /NEXT_PUBLIC_SUPABASE_SECRET_KEY/);
});

test("Supabase dependencies and Node runtime are intentionally pinned", async () => {
  const packageJson = JSON.parse(await readWebFile("package.json"));

  assert.match(packageJson.engines.node, /^>=22(?:\.0\.0)?$/);

  for (const dependency of ["@supabase/ssr", "@supabase/supabase-js"]) {
    const version = packageJson.dependencies[dependency];
    assert.equal(typeof version, "string");
    assert.match(version, /^\d+\.\d+\.\d+$/);
  }
});

test("empty database types remain explicit until the schema slice", async () => {
  const databaseTypes = await readWebFile("lib/supabase/database.types.ts");

  assert.match(databaseTypes, /Tables: \{ \[_ in never\]: never \}/);
  assert.match(
    databaseTypes,
    /Replace this file with `supabase gen types typescript`/,
  );
  assert.doesNotMatch(databaseTypes, /profiles:/);
  assert.doesNotMatch(databaseTypes, /saved_resources:/);
});
