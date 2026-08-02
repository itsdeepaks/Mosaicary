import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const webRoot = path.resolve(path.dirname(currentFile), "..");

async function readWebFile(relativePath) {
  return readFile(path.join(webRoot, relativePath), "utf8");
}

test("auth route renders from the non-throwing Supabase readiness contract", async () => {
  const page = await readWebFile("app/auth/page.tsx");

  assert.match(page, /inspectSupabasePublicConfig\(\)/);
  assert.match(page, /configurationState=\{configuration\.state\}/);
  assert.match(page, /readAuthCallbackStatus/);
  assert.match(page, /title: "Sign in"/);
  assert.match(page, /index: false/);
  assert.match(page, /follow: false/);
});

test("credential-ready shell is truthful and does not send auth requests", async () => {
  const shell = await readWebFile("components/auth-shell/auth-shell.tsx");

  assert.match(shell, /data-auth-shell="ready"/);
  assert.match(shell, /data-auth-configuration=\{configurationState\}/);
  assert.match(shell, /Account access unavailable/);
  assert.match(shell, /Configuration detected/);
  assert.match(shell, /<fieldset className=\{styles\.fieldset\} disabled>/);
  assert.match(shell, /Continue with Google/);
  assert.match(shell, /Six-digit email code/);
  assert.match(shell, /No sign-in request is sent from this page yet/);
  assert.match(shell, /browser-local\s+saves remain available/);
  assert.doesNotMatch(shell, /signInWithPassword/);
  assert.doesNotMatch(shell, /signInWithOtp/);
  assert.doesNotMatch(shell, /signInWithOAuth/);
  assert.doesNotMatch(shell, /verifyOtp/);
  assert.doesNotMatch(shell, /createBrowserSupabaseClient/);
});

test("header exposes separate desktop and mobile account entry points", async () => {
  const [header, styles] = await Promise.all([
    readWebFile("components/site-header/site-header.tsx"),
    readWebFile("components/site-header/site-header.module.css"),
  ]);

  assert.equal(header.match(/href="\/auth"/g)?.length, 2);
  assert.match(header, /isAuthActive = pathname\.startsWith\("\/auth"\)/);
  assert.match(header, /Sign in to Tessli/);
  assert.match(header, /aria-current=\{isAuthActive \? "page" : undefined\}/);
  assert.match(styles, /\.accountLink \{/);
  assert.match(styles, /\.mobileAccountLink \{/);
  assert.match(
    styles,
    /\.desktopNavigation,\n  \.accountLink \{\n    display: none;/,
  );
});

test("auth shell follows the editorial responsive design contract", async () => {
  const styles = await readWebFile(
    "components/auth-shell/auth-shell.module.css",
  );

  assert.match(
    styles,
    /grid-template-columns: minmax\(0, 1fr\) minmax\(380px, 480px\)/,
  );
  assert.match(styles, /font-family: var\(--font-newsreader\)/);
  assert.match(styles, /background: var\(--accent\)/);
  assert.match(styles, /@media \(max-width: 900px\)/);
  assert.match(styles, /@media \(max-width: 767px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /backdrop-filter/);
  assert.doesNotMatch(styles, /linear-gradient/);
});
