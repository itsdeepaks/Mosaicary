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
  SAFE_FINAL_ACTIONS,
} from "./capture-resource-preview-overlay-verification.mjs";

export const EDGE_BATCH = "overlay-edge-v3-20260803";
export const EDGE_TARGETS = Object.freeze([
  {
    resourceId: "resource-424e130e8422",
    name: "Pixelbuddha",
    url: "https://pixelbuddha.net",
    strategy: "necessary-only-selection",
  },
  {
    resourceId: "resource-e81793f16a04",
    name: "Relume",
    url: "https://www.relume.io",
    strategy: "prefer-consent-button",
  },
]);
export const OPTIONAL_SWITCH_NAMES = Object.freeze([
  "preferences",
  "statistics",
  "marketing",
]);
export const NECESSARY_ONLY_SAVE_ACTIONS = Object.freeze(["allow selection"]);
export const SETTINGS_ACTIONS = Object.freeze([
  "cookie settings",
  "manage preferences",
  "manage cookie preferences",
]);

const QUALITY_STEPS = Object.freeze([78, 70, 62, 54]);
const CONSENT_TERMS = ["cookie", "cookies", "consent", "privacy preferences"];
const AUDIT_SCRIPT = `(() => {
  const normalize = (value) => String(value ?? "").replace(/\\s+/g, " ").trim();
  const visible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity || 1) > 0 && rect.width >= 8 && rect.height >= 8;
  };
  const terms = ${JSON.stringify(CONSENT_TERMS)};
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

function controls(refs) {
  return Object.entries(refs ?? {}).map(([ref, descriptor]) => ({
    ref: ref.startsWith("@") ? ref : `@${ref}`,
    role: normalize(descriptor?.role),
    name: normalize(descriptor?.name),
    checked: descriptor?.checked === true,
    disabled: descriptor?.disabled === true,
  }));
}

export function chooseSettingsButton(refs) {
  return controls(refs)
    .filter((control) => SETTINGS_ACTIONS.includes(control.name))
    .filter((control) => control.role === "button" || control.role === "link")
    .sort(
      (left, right) =>
        Number(right.role === "button") - Number(left.role === "button"),
    )[0];
}

export function chooseFinalRejection(refs) {
  const priorities = new Map(
    SAFE_FINAL_ACTIONS.map((action, index) => [action, index]),
  );
  return controls(refs)
    .filter((control) => control.role === "button" || control.role === "link")
    .filter((control) => priorities.has(control.name))
    .sort(
      (left, right) =>
        priorities.get(left.name) - priorities.get(right.name) ||
        Number(right.role === "button") - Number(left.role === "button"),
    )[0];
}

export function findNecessaryOnlyPlan(refs) {
  const available = controls(refs);
  const necessary = available.find(
    (control) =>
      (control.role === "checkbox" || control.role === "switch") &&
      control.name === "necessary" &&
      control.checked &&
      control.disabled,
  );
  const optional = available.filter(
    (control) =>
      (control.role === "checkbox" || control.role === "switch") &&
      OPTIONAL_SWITCH_NAMES.includes(control.name) &&
      control.checked &&
      !control.disabled,
  );
  const save = available.find(
    (control) =>
      control.role === "button" &&
      NECESSARY_ONLY_SAVE_ACTIONS.includes(control.name),
  );
  if (!necessary || optional.length === 0 || !save) return null;
  return { necessary, optional, save };
}

function verifyOverlayCleared(beforeAudit, afterAudit) {
  return (
    Number(afterAudit?.result?.consentOverlayCount ?? 0) <
    Number(beforeAudit?.result?.consentOverlayCount ?? 0)
  );
}

function executeNecessaryOnly(session, record) {
  const beforeSnapshot = snapshot(session);
  const beforeAudit = audit(session);
  const initialPlan = findNecessaryOnlyPlan(beforeSnapshot.refs);
  if (!initialPlan) {
    return { status: "no-necessary-only-plan", beforeSnapshot, beforeAudit };
  }

  const toggles = [];
  for (const optional of initialPlan.optional) {
    const fresh = snapshot(session);
    const current = controls(fresh.refs).find(
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
    toggles.push({ name: current.name, ref: current.ref, status: clicked.status });
    record(`wait-disable-${current.name}`, runAgent(session, ["wait", "400"]));
  }

  const selectionSnapshot = snapshot(session);
  const available = controls(selectionSnapshot.refs);
  const necessaryStillLocked = available.some(
    (control) =>
      control.name === "necessary" &&
      control.checked &&
      control.disabled &&
      (control.role === "checkbox" || control.role === "switch"),
  );
  const optionalStillOn = available.filter(
    (control) =>
      OPTIONAL_SWITCH_NAMES.includes(control.name) &&
      control.checked &&
      !control.disabled &&
      (control.role === "checkbox" || control.role === "switch"),
  );
  const save = available.find(
    (control) =>
      control.role === "button" &&
      NECESSARY_ONLY_SAVE_ACTIONS.includes(control.name),
  );
  if (!necessaryStillLocked || optionalStillOn.length > 0 || !save) {
    return {
      status: "necessary-only-not-proven",
      beforeSnapshot,
      beforeAudit,
      toggles,
      selectionSnapshot,
      necessaryStillLocked,
      optionalStillOn,
    };
  }

  const saved = record("save-necessary-only", runAgent(session, ["click", save.ref]));
  record("wait-save-necessary-only", runAgent(session, ["wait", "1600"]));
  const afterSnapshot = snapshot(session);
  const afterAudit = audit(session);
  const saveStillVisible = controls(afterSnapshot.refs).some(
    (control) =>
      control.role === "button" &&
      NECESSARY_ONLY_SAVE_ACTIONS.includes(control.name),
  );
  const overlayCleared = verifyOverlayCleared(beforeAudit, afterAudit);
  return {
    status:
      saved.status === 0 && !saveStillVisible && overlayCleared
        ? "verified-necessary-only"
        : "necessary-only-unverified",
    beforeSnapshot,
    beforeAudit,
    toggles,
    selectionSnapshot,
    necessaryStillLocked,
    optionalStillOn,
    save,
    saveStatus: saved.status,
    afterSnapshot,
    afterAudit,
    saveStillVisible,
    overlayCleared,
  };
}

function executeSettingsThenReject(session, record) {
  const beforeSnapshot = snapshot(session);
  const beforeAudit = audit(session);
  const settings = chooseSettingsButton(beforeSnapshot.refs);
  if (!settings) return { status: "no-settings-button", beforeSnapshot, beforeAudit };
  const opened = record("open-cookie-settings", runAgent(session, ["click", settings.ref]));
  record("wait-cookie-settings", runAgent(session, ["wait", "1200"]));
  const settingsSnapshot = snapshot(session);
  const rejection = chooseFinalRejection(settingsSnapshot.refs);
  if (!rejection) {
    return {
      status: "no-rejection-after-settings",
      beforeSnapshot,
      beforeAudit,
      settings,
      settingsStatus: opened.status,
      settingsSnapshot,
    };
  }
  const rejected = record(
    `reject-${rejection.name}`,
    runAgent(session, ["click", rejection.ref]),
  );
  record("wait-rejection", runAgent(session, ["wait", "1600"]));
  const afterSnapshot = snapshot(session);
  const afterAudit = audit(session);
  const rejectionStillVisible = controls(afterSnapshot.refs).some(
    (control) => control.name === rejection.name,
  );
  const overlayCleared = verifyOverlayCleared(beforeAudit, afterAudit);
  return {
    status:
      opened.status === 0 &&
      rejected.status === 0 &&
      !rejectionStillVisible &&
      overlayCleared
        ? "verified-settings-rejection"
        : "settings-rejection-unverified",
    beforeSnapshot,
    beforeAudit,
    settings,
    settingsStatus: opened.status,
    settingsSnapshot,
    rejection,
    rejectionStatus: rejected.status,
    afterSnapshot,
    afterAudit,
    rejectionStillVisible,
    overlayCleared,
  };
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

async function capture(site, rawPath) {
  const session = `tessli-edge-${site.resourceId.slice(-12)}`;
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
    const blank = record("open-blank", runAgent(session, ["open", "about:blank"]));
    if (blank.status !== 0) throw new Error(blank.stderr || "browser failed to start");
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
    const opened = record("open-site", runAgent(session, ["open", site.url]));
    if (opened.status !== 0) throw new Error(opened.stderr || "navigation failed");
    record("initial-wait", runAgent(session, ["wait", "7000"]));
    const interaction =
      site.strategy === "necessary-only-selection"
        ? executeNecessaryOnly(session, record)
        : executeSettingsThenReject(session, record);
    const finalSnapshot = snapshot(session);
    const finalAudit = audit(session);
    const screenshot = record("screenshot", runAgent(session, ["screenshot", rawPath]));
    if (screenshot.status !== 0 || !existsSync(rawPath) || statSync(rawPath).size === 0) {
      throw new Error(screenshot.stderr || "screenshot failed");
    }
    return {
      commands,
      interaction,
      finalSnapshot,
      finalAudit,
      decision:
        (finalAudit.result?.challengeTerms ?? []).length > 0
          ? "blocked"
          : Number(finalAudit.result?.consentOverlayCount ?? 0) > 0
            ? "overlay-remains"
            : interaction.status.startsWith("verified-")
              ? "verified-clear"
              : "no-overlay-unverified",
    };
  } finally {
    runAgent(session, ["close"]);
  }
}

export async function runEdgeCases({ outputDirectory } = {}) {
  const outputDir = resolve(
    outputDirectory ?? "artifacts/resource-preview-overlay-edge-cases",
  );
  const rawDir = join(outputDir, "raw");
  const optimizedDir = join(outputDir, "optimized");
  mkdirSync(rawDir, { recursive: true });
  mkdirSync(optimizedDir, { recursive: true });

  const results = [];
  for (const site of EDGE_TARGETS) {
    const rawPath = join(rawDir, `${site.resourceId}.png`);
    const optimizedPath = join(optimizedDir, `${site.resourceId}.webp`);
    try {
      const browser = await capture(site, rawPath);
      const rawBytes = statSync(rawPath).size;
      const compressed = optimize(rawPath, optimizedPath);
      results.push({
        ...site,
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
        ...site,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const captured = results.filter((result) => result.status === "captured");
  const manifest = {
    version: 1,
    batch: EDGE_BATCH,
    generatedAt: new Date().toISOString(),
    captureCount: captured.length,
    failureCount: results.length - captured.length,
    verifiedClearCount: captured.filter(
      (result) => result.browser.decision === "verified-clear",
    ).length,
    overlayRemainsCount: captured.filter(
      (result) => result.browser.decision === "overlay-remains",
    ).length,
    rawTotalBytes: captured.reduce((sum, result) => sum + result.rawBytes, 0),
    optimizedTotalBytes: captured.reduce(
      (sum, result) => sum + result.optimizedBytes,
      0,
    ),
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
  const outputDirectory = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  await runEdgeCases({ outputDirectory });
}
