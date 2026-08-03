import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

import {
  CHALLENGE_TERMS,
  OVERLAY_MAX_BYTES,
  OVERLAY_OUTPUT,
  OVERLAY_VIEWPORT,
} from "./capture-resource-preview-overlay-verification.mjs";
import {
  OPTIONAL_SWITCH_NAMES,
  findNecessaryOnlyPlan,
} from "./capture-resource-preview-overlay-edge-cases.mjs";

export const PIXELBUDDHA_BATCH = "pixelbuddha-necessary-only-v4-20260803";
export const PIXELBUDDHA_TARGET = Object.freeze({
  resourceId: "resource-424e130e8422",
  name: "Pixelbuddha",
  url: "https://pixelbuddha.net",
});
export const PIXELBUDDHA_FINAL_ACTION = "deny";

const QUALITY_STEPS = Object.freeze([78, 70, 62, 54]);
const AUDIT_SCRIPT = `(() => {
  const normalize = (value) => String(value ?? "").replace(/\\s+/g, " ").trim();
  const visible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity || 1) > 0 && rect.width >= 8 && rect.height >= 8;
  };
  const terms = ["cookie", "cookies", "consent", "privacy preferences"];
  const overlays = Array.from(document.querySelectorAll("body *")).filter((element) => {
    if (!visible(element)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const ratio = (rect.width * rect.height) / Math.max(1, innerWidth * innerHeight);
    const overlayLike = element.getAttribute("role") === "dialog" || element.getAttribute("aria-modal") === "true" || ((style.position === "fixed" || style.position === "sticky") && ratio >= 0.025);
    const text = normalize(element.innerText).toLowerCase();
    return overlayLike && terms.some((term) => text.includes(term));
  });
  const body = normalize(document.body?.innerText).toLowerCase();
  const challenges = ${JSON.stringify(CHALLENGE_TERMS)};
  return JSON.stringify({
    url: location.href,
    title: document.title,
    consentOverlayCount: overlays.length,
    challengeTerms: challenges.filter((term) => body.includes(term)),
    overlayTexts: overlays.slice(0, 6).map((element) => normalize(element.innerText).slice(0, 420)),
  });
})()`;

function normalize(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 24 * 1024 * 1024,
    timeout: 90_000,
    ...options,
  });
  return {
    status: result.status,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? "",
    error: result.error?.message ?? null,
  };
}

function runAgent(session, args, options = {}) {
  return run("agent-browser", ["--session", session, ...args], options);
}

function parseJson(output) {
  const trimmed = String(output ?? "").trim();
  if (!trimmed) return null;
  for (const candidate of [trimmed, ...trimmed.split("\n").reverse()]) {
    try {
      const parsed = JSON.parse(candidate);
      return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
    } catch {
      // Continue through supported agent-browser output shapes.
    }
  }
  return null;
}

function snapshot(session) {
  const command = runAgent(session, ["snapshot", "-i", "--json"]);
  const payload = parseJson(command.stdout);
  return {
    commandStatus: command.status,
    stderr: command.stderr.slice(0, 1200),
    snapshot: payload?.data?.snapshot ?? payload?.snapshot ?? null,
    refs: payload?.data?.refs ?? payload?.refs ?? {},
  };
}

function audit(session) {
  const command = runAgent(session, ["eval", "--stdin"], {
    input: AUDIT_SCRIPT,
  });
  return {
    commandStatus: command.status,
    stderr: command.stderr.slice(0, 1200),
    result: parseJson(command.stdout),
  };
}

function lineForRef(snapshotText, ref) {
  const bareRef = ref.startsWith("@") ? ref.slice(1) : ref;
  return String(snapshotText ?? "")
    .split("\n")
    .find((line) => line.includes(`ref=${bareRef}`));
}

export function hydrateControls(refs, snapshotText = "") {
  return Object.entries(refs ?? {}).map(([ref, descriptor]) => {
    const line = lineForRef(snapshotText, ref) ?? "";
    return {
      ref: ref.startsWith("@") ? ref : `@${ref}`,
      role: normalize(descriptor?.role),
      name: normalize(descriptor?.name),
      checked:
        descriptor?.checked === true || line.includes("checked=true"),
      disabled:
        descriptor?.disabled === true ||
        /(?:^|[\s,])disabled(?:[=,\]])/.test(line),
    };
  });
}

export function selectNecessaryOnlyDeny(refs, snapshotText = "") {
  const available = hydrateControls(refs, snapshotText);
  const necessaryLocked = available.some(
    (control) =>
      (control.role === "checkbox" || control.role === "switch") &&
      control.name === "necessary" &&
      control.checked &&
      control.disabled,
  );
  const optionalStillOn = available.some(
    (control) =>
      (control.role === "checkbox" || control.role === "switch") &&
      OPTIONAL_SWITCH_NAMES.includes(control.name) &&
      control.checked &&
      !control.disabled,
  );
  const deny = available.find(
    (control) =>
      control.role === "button" && control.name === PIXELBUDDHA_FINAL_ACTION,
  );
  return necessaryLocked && !optionalStillOn ? deny : undefined;
}

function optimize(rawPath, optimizedPath) {
  for (const quality of QUALITY_STEPS) {
    rmSync(optimizedPath, { force: true });
    const result = run("cwebp", [
      "-quiet",
      "-q",
      String(quality),
      "-m",
      "6",
      "-resize",
      String(OVERLAY_OUTPUT.width),
      String(OVERLAY_OUTPUT.height),
      rawPath,
      "-o",
      optimizedPath,
    ]);
    if (result.status !== 0 || !existsSync(optimizedPath)) {
      throw new Error(`cwebp failed: ${result.stderr}`);
    }
    const bytes = statSync(optimizedPath).size;
    if (bytes <= OVERLAY_MAX_BYTES) return { quality, bytes };
  }
  throw new Error("optimized screenshot exceeds the reviewed size cap");
}

async function capture(rawPath) {
  const session = "tessli-pixelbuddha-final";
  const commands = [];
  const record = (name, result) => {
    commands.push({
      name,
      status: result.status,
      stdout: result.stdout.slice(0, 1600),
      stderr: result.stderr.slice(0, 1600),
      error: result.error,
    });
    return result;
  };

  try {
    const blank = record(
      "open-blank",
      runAgent(session, ["open", "about:blank"]),
    );
    if (blank.status !== 0) {
      throw new Error(blank.stderr || "browser failed to start");
    }
    record(
      "set-viewport",
      runAgent(session, [
        "set",
        "viewport",
        String(OVERLAY_VIEWPORT.width),
        String(OVERLAY_VIEWPORT.height),
      ]),
    );
    record("set-light-media", runAgent(session, ["set", "media", "light"]));
    const opened = record(
      "open-site",
      runAgent(session, ["open", PIXELBUDDHA_TARGET.url]),
    );
    if (opened.status !== 0) {
      throw new Error(opened.stderr || "navigation failed");
    }
    record("initial-wait", runAgent(session, ["wait", "7000"]));

    const beforeSnapshot = snapshot(session);
    const beforeAudit = audit(session);
    const plan = findNecessaryOnlyPlan(
      beforeSnapshot.refs,
      beforeSnapshot.snapshot,
    );
    if (!plan) {
      throw new Error("necessary-only plan was not proven before interaction");
    }

    const toggles = [];
    for (const optional of plan.optional) {
      const fresh = snapshot(session);
      const current = hydrateControls(fresh.refs, fresh.snapshot).find(
        (control) =>
          control.name === optional.name &&
          control.checked &&
          !control.disabled,
      );
      if (!current) continue;
      const clicked = record(
        `disable-${current.name}`,
        runAgent(session, ["click", current.ref]),
      );
      toggles.push({
        name: current.name,
        ref: current.ref,
        status: clicked.status,
      });
      record(`wait-disable-${current.name}`, runAgent(session, ["wait", "400"]));
    }

    const selectionSnapshot = snapshot(session);
    const deny = selectNecessaryOnlyDeny(
      selectionSnapshot.refs,
      selectionSnapshot.snapshot,
    );
    if (!deny) {
      throw new Error("deny action was not proven in necessary-only state");
    }
    const denied = record(
      "deny-optional-cookies",
      runAgent(session, ["click", deny.ref]),
    );
    record("wait-deny", runAgent(session, ["wait", "1600"]));

    const afterSnapshot = snapshot(session);
    const afterAudit = audit(session);
    const denyStillVisible = hydrateControls(
      afterSnapshot.refs,
      afterSnapshot.snapshot,
    ).some(
      (control) =>
        control.role === "button" &&
        control.name === PIXELBUDDHA_FINAL_ACTION,
    );
    const overlayCleared =
      Number(afterAudit.result?.consentOverlayCount ?? 0) <
      Number(beforeAudit.result?.consentOverlayCount ?? 0);
    const verifiedClear =
      denied.status === 0 && !denyStillVisible && overlayCleared;

    const screenshot = record(
      "screenshot",
      runAgent(session, ["screenshot", rawPath]),
    );
    if (
      screenshot.status !== 0 ||
      !existsSync(rawPath) ||
      statSync(rawPath).size === 0
    ) {
      throw new Error(screenshot.stderr || "screenshot failed");
    }

    return {
      commands,
      beforeSnapshot,
      beforeAudit,
      plan,
      toggles,
      selectionSnapshot,
      deny,
      denyStatus: denied.status,
      afterSnapshot,
      afterAudit,
      denyStillVisible,
      overlayCleared,
      decision: verifiedClear ? "verified-clear" : "overlay-remains",
    };
  } finally {
    runAgent(session, ["close"]);
  }
}

export async function runPixelbuddhaFinal({ outputDirectory } = {}) {
  const outputDir = resolve(
    outputDirectory ?? "artifacts/resource-preview-pixelbuddha-final",
  );
  const rawDir = join(outputDir, "raw");
  const optimizedDir = join(outputDir, "optimized");
  mkdirSync(rawDir, { recursive: true });
  mkdirSync(optimizedDir, { recursive: true });

  const rawPath = join(rawDir, `${PIXELBUDDHA_TARGET.resourceId}.png`);
  const optimizedPath = join(
    optimizedDir,
    `${PIXELBUDDHA_TARGET.resourceId}.webp`,
  );
  const results = [];
  try {
    const browser = await capture(rawPath);
    const rawBytes = statSync(rawPath).size;
    const compressed = optimize(rawPath, optimizedPath);
    results.push({
      ...PIXELBUDDHA_TARGET,
      status: "captured",
      rawFile: basename(rawPath),
      optimizedFile: basename(optimizedPath),
      rawBytes,
      optimizedBytes: compressed.bytes,
      quality: compressed.quality,
      sha256: createHash("sha256")
        .update(readFileSync(optimizedPath))
        .digest("hex"),
      browser,
    });
  } catch (error) {
    results.push({
      ...PIXELBUDDHA_TARGET,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const captured = results.filter((result) => result.status === "captured");
  const manifest = {
    version: 1,
    batch: PIXELBUDDHA_BATCH,
    generatedAt: new Date().toISOString(),
    captureCount: captured.length,
    failureCount: results.length - captured.length,
    verifiedClearCount: captured.filter(
      (result) => result.browser.decision === "verified-clear",
    ).length,
    overlayRemainsCount: captured.filter(
      (result) => result.browser.decision === "overlay-remains",
    ).length,
    resources: results,
  };
  writeFileSync(
    join(outputDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  console.log(JSON.stringify(manifest, null, 2));
  if (manifest.captureCount === 0) process.exitCode = 1;
  return manifest;
}

const invokedPath = process.argv[1]
  ? pathToFileURL(process.argv[1]).href
  : null;
if (invokedPath === import.meta.url) {
  const outputIndex = process.argv.indexOf("--output");
  const outputDirectory =
    outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  await runPixelbuddhaFinal({ outputDirectory });
}
