import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const currentFile = fileURLToPath(import.meta.url);
const webRoot = path.resolve(path.dirname(currentFile), "..");

async function readWebFile(relativePath) {
  return readFile(path.join(webRoot, relativePath), "utf8");
}

async function loadAuthCallbackModule() {
  const source = await readWebFile("lib/supabase/auth-callback.ts");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: "auth-callback.ts",
  });
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;

  return import(moduleUrl);
}

test("session proxy refreshes configured auth routes without breaking unconfigured environments", async () => {
  const [entrypoint, sessionProxy] = await Promise.all([
    readWebFile("proxy.ts"),
    readWebFile("lib/supabase/proxy.ts"),
  ]);

  assert.match(entrypoint, /export async function proxy/);
  assert.match(entrypoint, /matcher: \["\/auth\/:path\*"\]/);
  assert.match(entrypoint, /updateSupabaseSession/);
  assert.match(sessionProxy, /inspectSupabasePublicConfig\(\)/);
  assert.match(sessionProxy, /configuration\.state === "unconfigured"/);
  assert.match(sessionProxy, /createServerClient<Database>/);
  assert.match(sessionProxy, /request\.cookies\.getAll\(\)/);
  assert.match(sessionProxy, /request\.cookies\.set\(name, value\)/);
  assert.match(sessionProxy, /response\.cookies\.set\(name, value, options\)/);
  assert.match(sessionProxy, /Object\.entries\(headers\)/);
  assert.match(sessionProxy, /await supabase\.auth\.getClaims\(\)/);
  assert.doesNotMatch(sessionProxy, /auth\.getSession\(\)/);
  assert.doesNotMatch(sessionProxy, /SUPABASE_SERVICE_ROLE_KEY/);
});

test("callback accepts only same-origin return paths and reports safe failure states", async () => {
  const [callbackRoute, authShell] = await Promise.all([
    readWebFile("app/auth/callback/route.ts"),
    readWebFile("components/auth-shell/auth-shell.tsx"),
  ]);
  const { readAuthCallbackStatus, resolveSafeAuthRedirectPath } =
    await loadAuthCallbackModule();

  assert.equal(resolveSafeAuthRedirectPath(null), "/");
  assert.equal(
    resolveSafeAuthRedirectPath("/saved?from=auth#latest"),
    "/saved?from=auth#latest",
  );
  assert.equal(resolveSafeAuthRedirectPath("//attacker.example"), "/");
  assert.equal(resolveSafeAuthRedirectPath("https://attacker.example"), "/");
  assert.equal(readAuthCallbackStatus("link-invalid"), "link-invalid");
  assert.equal(readAuthCallbackStatus("unavailable"), "unavailable");
  assert.equal(readAuthCallbackStatus("anything-else"), undefined);

  assert.match(callbackRoute, /exchangeCodeForSession\(code\)/);
  assert.match(callbackRoute, /resolveSafeAuthRedirectPath/);
  assert.match(callbackRoute, /redirectToAuth\(request, "link-invalid"\)/);
  assert.match(callbackRoute, /redirectToAuth\(request, "unavailable"\)/);
  assert.match(authShell, /This sign-in link is invalid or has expired/);
  assert.doesNotMatch(
    callbackRoute,
    /signInWithOAuth|signInWithOtp|signInWithPassword/,
  );
});
