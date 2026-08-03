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

export const OVERLAY_VERIFICATION_BATCH = "overlay-v2-20260803";
export const OVERLAY_VIEWPORT = Object.freeze({ width: 1440, height: 756 });
export const OVERLAY_OUTPUT = Object.freeze({ width: 960, height: 504 });
export const OVERLAY_MAX_BYTES = 307_200;
export const OVERLAY_TARGETS = Object.freeze([
  {
    resourceId: "resource-21359fe8c171",
    name: "Webflow",
    url: "https://webflow.com",
    priorIssue: "cookie-consent-overlay",
  },
  {
    resourceId: "resource-424e130e8422",
    name: "Pixelbuddha",
    url: "https://pixelbuddha.net",
    priorIssue: "cookie-preference-panel",
  },
  {
    resourceId: "resource-6529347d85fd",
    name: "Framer",
    url: "https://www.framer.com",
    priorIssue: "cookie-consent-overlay",
  },
  {
    resourceId: "resource-e81793f16a04",
    name: "Relume",
    url: "https://www.relume.io",
    priorIssue: "false-positive-reject-click",
  },
  {
    resourceId: "resource-09924984d444",
    name: "Anima",
    url: "https://www.animaapp.com",
    priorIssue: "cookie-consent-overlay",
  },
]);

export const SAFE_FINAL_ACTIONS = Object.freeze([
  "reject all",
  "reject",
  "reject non-essential cookies",
  "reject nonessential cookies",
  "reject optional",
  "reject optional cookies",
  "decline all",
  "decline",
  "only necessary",
  "necessary only",
  "use necessary cookies only",
  "continue without accepting",
  "continue without consent",
  "do not consent",
  "no thanks",
]);

export const SAFE_NAVIGATION_ACTIONS = Object.freeze([
  "manage preferences",
  "manage cookie preferences",
  "cookie preferences",
  "cookie settings",
  "privacy settings",
]);

export const CHALLENGE_TERMS = Object.freeze([
  "access denied",
  "forbidden",
  "verify you are human",
  "checking your browser",
  "just a moment",
  "enable javascript and cookies",
  "security check",
  "sorry, you have been blocked",
  "unable to access",
  "performing security verification",
]);

const QUALITY_STEPS = Object.freeze([78, 70, 62, 54]);
const CONSENT_TERMS = Object.freeze([
  "cookie",
  "cookies",
  "consent",
  "privacy preferences",
  "tracking technologies",
  "personal data",
]);
const ACTION_ROLES = new Set(["button", "link"]);

const PAGE_AUDIT_SCRIPT = `(() => {
  const normalize = (value) => String(value ?? "").replace(/\\s+/g, " ").trim();
  const visible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity || 1) > 0 && rect.width >= 8 && rect.height >= 8;
  };
  const consentTerms = ${JSON.stringify(CONSENT_TERMS)};
  const overlays = Array.from(document.querySelectorAll('body *'))
    .filter((element) => {
      if (!visible(element)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const ratio = (rect.width * rect.height) / Math.max(1, innerWidth * innerHeight);
      const zIndex = Number.parseInt(style.zIndex, 10);
      const overlayLike =
        element.getAttribute("role") === "dialog" ||
        element.getAttribute("aria-modal") === "true" ||
        ((style.position === "fixed" || style.position === "sticky") && ratio >= 0.025 && (Number.isFinite(zIndex) ? zIndex >= 1 : true));
      if (!overlayLike) return false;
      const text = normalize(element.innerText).toLowerCase();
      return consentTerms.some((term) => text.includes(term));
    })
    .slice(0, 12)
    .map((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const text = normalize(element.innerText);
      return {
        tag: element.tagName.toLowerCase(),
        role: element.getAttribute("role"),
        ariaLabel: element.getAttribute("aria-label"),
        position: style.position,
        zIndex: style.zIndex,
        viewportRatio: Number(((rect.width * rect.height) / Math.max(1, innerWidth * innerHeight)).toFixed(4)),
        text: text.slice(0, 420),
      };
    });
  const body = normalize(document.body?.innerText).toLowerCase();
  const challengeTerms = ${JSON.stringify(CHALLENGE_TERMS)};
  return JSON.stringify({
    url: location.href,
    title: document.title,
    challengeTerms: challengeTerms.filter((term) => body.includes(term)),
    consentOverlayCount: overlays.length,
    consentOverlays: overlays,
  });
})()`;

function normalize(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function commandPath(command) {
  const result = spawnSync("bash", ["-lc", `command -v ${command}`], {
    encoding: "utf8",
  });
  return result.status === 0 ? result.stdout.trim() : null;
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
    signal: result.signal,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? "",
    error: result.error?.message ?? null,
  };
}

function runAgent(session, args, options = {}) {
  return run("agent-browser", ["--session", session, ...args], options);
}

function parseJsonPayload(output) {
  const trimmed = String(output ?? "").trim();
  if (!trimmed) return null;
  const attempts = [trimmed, ...trimmed.split("\n").reverse()];
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    attempts.push(trimmed.slice(firstBrace, lastBrace + 1));
  }
  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt);
      return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
    } catch {
      // Continue through agent-browser's supported output shapes.
    }
  }
  return { raw: trimmed.slice(0, 3000) };
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function compressionPercent(rawBytes, optimizedBytes) {
  return Number((((rawBytes - optimizedBytes) / rawBytes) * 100).toFixed(2));
}

function parseOutputDirectory(argv) {
  const outputIndex = argv.indexOf("--output");
  if (outputIndex === -1) {
    return resolve("artifacts/resource-preview-overlay-verification");
  }
  const value = argv[outputIndex + 1];
  if (!value) throw new Error("--output requires a directory path.");
  return resolve(value);
}

function optimizeScreenshot(rawPath, optimizedPath) {
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
      throw new Error(`cwebp failed at quality ${quality}: ${result.stderr}`);
    }
    const bytes = statSync(optimizedPath).size;
    if (bytes <= OVERLAY_MAX_BYTES) return { quality, bytes };
  }
  throw new Error(
    `Optimized image remains above ${OVERLAY_MAX_BYTES} bytes (${statSync(optimizedPath).size}).`,
  );
}

function snapshotPage(session) {
  const result = runAgent(session, ["snapshot", "-i", "--json"]);
  const payload = parseJsonPayload(result.stdout);
  return {
    commandStatus: result.status,
    commandError: result.error,
    stderr: result.stderr.slice(0, 1200),
    snapshot: payload?.data?.snapshot ?? payload?.snapshot ?? null,
    refs: payload?.data?.refs ?? payload?.refs ?? {},
    raw: payload,
  };
}

function auditPage(session) {
  const result = runAgent(session, ["eval", "--stdin"], {
    input: PAGE_AUDIT_SCRIPT,
  });
  return {
    commandStatus: result.status,
    commandError: result.error,
    result: parseJsonPayload(result.stdout),
    stderr: result.stderr.slice(0, 1200),
  };
}

export function listSafeSnapshotCandidates(refs, { allowNavigation = false } = {}) {
  const actions = allowNavigation
    ? [...SAFE_FINAL_ACTIONS, ...SAFE_NAVIGATION_ACTIONS]
    : SAFE_FINAL_ACTIONS;
  const priorities = new Map(actions.map((action, index) => [action, index]));
  return Object.entries(refs ?? {})
    .map(([ref, descriptor]) => ({
      ref: ref.startsWith("@") ? ref : `@${ref}`,
      role: normalize(descriptor?.role),
      name: normalize(descriptor?.name),
      rawName: descriptor?.name ?? null,
    }))
    .filter((candidate) => ACTION_ROLES.has(candidate.role))
    .filter((candidate) => priorities.has(candidate.name))
    .map((candidate) => ({
      ...candidate,
      actionType: SAFE_NAVIGATION_ACTIONS.includes(candidate.name)
        ? "navigation"
        : "final",
      priority: priorities.get(candidate.name),
    }))
    .sort((left, right) => left.priority - right.priority);
}

export function verifyInteractionCleared({
  clickedName,
  beforeCandidates,
  afterCandidates,
  beforeAudit,
  afterAudit,
}) {
  const normalizedClickedName = normalize(clickedName);
  const sameActionStillVisible = afterCandidates.some(
    (candidate) => normalize(candidate.name) === normalizedClickedName,
  );
  const beforeCount = Number(beforeAudit?.consentOverlayCount ?? 0);
  const afterCount = Number(afterAudit?.consentOverlayCount ?? 0);
  const overlayCountImproved = beforeCount > 0 ? afterCount < beforeCount : null;
  const snapshotImproved = afterCandidates.length < beforeCandidates.length;
  return {
    sameActionStillVisible,
    overlayCountImproved,
    snapshotImproved,
    cleared:
      !sameActionStillVisible &&
      (overlayCountImproved === true || snapshotImproved || afterCandidates.length === 0),
  };
}

function performVerifiedInteractions(session, record) {
  const attempts = [];
  const attemptedRefs = new Set();
  let navigationUsed = false;

  for (let attemptIndex = 0; attemptIndex < 5; attemptIndex += 1) {
    const beforeSnapshot = snapshotPage(session);
    const beforeAudit = auditPage(session);
    const beforeCandidates = listSafeSnapshotCandidates(beforeSnapshot.refs, {
      allowNavigation:
        !navigationUsed &&
        Number(beforeAudit.result?.consentOverlayCount ?? 0) > 0,
    }).filter((candidate) => !attemptedRefs.has(candidate.ref));
    const selected = beforeCandidates[0];
    if (!selected) {
      attempts.push({
        attempt: attemptIndex + 1,
        status: "no-safe-action",
        beforeSnapshot,
        beforeAudit,
      });
      break;
    }

    attemptedRefs.add(selected.ref);
    if (selected.actionType === "navigation") navigationUsed = true;
    const clicked = record(
      `click-${attemptIndex + 1}-${selected.name}`,
      runAgent(session, ["click", selected.ref]),
    );
    record(
      `post-click-wait-${attemptIndex + 1}`,
      runAgent(session, ["wait", "1600"]),
    );
    const afterSnapshot = snapshotPage(session);
    const afterAudit = auditPage(session);
    const afterCandidates = listSafeSnapshotCandidates(afterSnapshot.refs, {
      allowNavigation: !navigationUsed,
    });
    const verification = verifyInteractionCleared({
      clickedName: selected.name,
      beforeCandidates,
      afterCandidates,
      beforeAudit: beforeAudit.result,
      afterAudit: afterAudit.result,
    });

    attempts.push({
      attempt: attemptIndex + 1,
      status:
        clicked.status !== 0
          ? "click-failed"
          : verification.cleared
            ? "verified-cleared"
            : "unverified-click",
      selected,
      clickStatus: clicked.status,
      beforeSnapshot,
      beforeAudit,
      afterSnapshot,
      afterAudit,
      verification,
    });

    if (clicked.status !== 0) continue;
    if (selected.actionType === "navigation") continue;
    if (verification.cleared) break;
    if (verification.sameActionStillVisible) break;
  }

  return attempts;
}

async function captureTarget(site, rawPath) {
  const session = `tessli-overlay-${site.resourceId.slice(-12)}`;
  const commands = [];
  const record = (name, result) => {
    commands.push({
      name,
      status: result.status,
      signal: result.signal,
      error: result.error,
      stdout: result.stdout.slice(0, 1800),
      stderr: result.stderr.slice(0, 1800),
    });
    return result;
  };

  try {
    const blank = record(
      "open-blank",
      runAgent(session, ["open", "about:blank"]),
    );
    if (blank.status !== 0) {
      throw new Error(`agent-browser could not start: ${blank.stderr}`);
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
    const opened = record("open-site", runAgent(session, ["open", site.url]));
    if (opened.status !== 0) {
      throw new Error(`navigation failed: ${opened.stderr}`);
    }
    record("initial-wait", runAgent(session, ["wait", "7000"]));

    const initialAudit = auditPage(session);
    const interactions = performVerifiedInteractions(session, record);
    const finalSnapshot = snapshotPage(session);
    const finalAudit = auditPage(session);
    const remainingActions = listSafeSnapshotCandidates(finalSnapshot.refs, {
      allowNavigation: false,
    });
    const challengeTerms = finalAudit.result?.challengeTerms ?? [];
    const verifiedClear = interactions.some(
      (attempt) => attempt.status === "verified-cleared",
    );
    const falsePositive = interactions.some(
      (attempt) => attempt.status === "unverified-click",
    );

    const screenshot = record(
      "screenshot",
      runAgent(session, ["screenshot", rawPath]),
    );
    if (
      screenshot.status !== 0 ||
      !existsSync(rawPath) ||
      statSync(rawPath).size === 0
    ) {
      throw new Error(`screenshot failed: ${screenshot.stderr}`);
    }

    return {
      commands,
      initialAudit,
      interactions,
      finalSnapshot,
      finalAudit,
      remainingActions,
      challengeTerms,
      verifiedClear,
      falsePositive,
      interactionDecision:
        challengeTerms.length > 0
          ? "blocked"
          : remainingActions.length > 0 ||
              Number(finalAudit.result?.consentOverlayCount ?? 0) > 0
            ? "overlay-remains"
            : verifiedClear
              ? "verified-clear"
              : "no-detected-overlay",
    };
  } finally {
    runAgent(session, ["close"]);
  }
}

export async function runOverlayVerification({ outputDirectory } = {}) {
  const outputDir = outputDirectory
    ? resolve(outputDirectory)
    : parseOutputDirectory(process.argv.slice(2));
  const rawDir = join(outputDir, "raw");
  const optimizedDir = join(outputDir, "optimized");
  mkdirSync(rawDir, { recursive: true });
  mkdirSync(optimizedDir, { recursive: true });

  if (!commandPath("agent-browser")) {
    throw new Error("agent-browser is required for overlay verification.");
  }
  if (!commandPath("cwebp")) {
    throw new Error("cwebp is required for deterministic WebP compression.");
  }

  const version = run("agent-browser", ["--version"]);
  const results = [];
  for (const site of OVERLAY_TARGETS) {
    const rawPath = join(rawDir, `${site.resourceId}.png`);
    const optimizedPath = join(optimizedDir, `${site.resourceId}.webp`);
    const startedAt = new Date().toISOString();
    try {
      const browser = await captureTarget(site, rawPath);
      const rawBytes = statSync(rawPath).size;
      const optimized = optimizeScreenshot(rawPath, optimizedPath);
      results.push({
        ...site,
        status: "captured",
        startedAt,
        completedAt: new Date().toISOString(),
        rawFile: basename(rawPath),
        optimizedFile: basename(optimizedPath),
        rawBytes,
        optimizedBytes: optimized.bytes,
        compressionPercent: compressionPercent(rawBytes, optimized.bytes),
        quality: optimized.quality,
        sha256: sha256(optimizedPath),
        browser,
      });
    } catch (error) {
      results.push({
        ...site,
        status: "failed",
        startedAt,
        completedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const captured = results.filter((result) => result.status === "captured");
  const manifest = {
    version: 1,
    batch: OVERLAY_VERIFICATION_BATCH,
    generatedAt: new Date().toISOString(),
    agentBrowserVersion: version.stdout || version.stderr || "unknown",
    viewport: OVERLAY_VIEWPORT,
    output: OVERLAY_OUTPUT,
    maxBytes: OVERLAY_MAX_BYTES,
    captureCount: captured.length,
    failureCount: results.length - captured.length,
    verifiedClearCount: captured.filter(
      (result) => result.browser.interactionDecision === "verified-clear",
    ).length,
    overlayRemainsCount: captured.filter(
      (result) => result.browser.interactionDecision === "overlay-remains",
    ).length,
    blockedCount: captured.filter(
      (result) => result.browser.interactionDecision === "blocked",
    ).length,
    rawTotalBytes: captured.reduce(
      (total, result) => total + result.rawBytes,
      0,
    ),
    optimizedTotalBytes: captured.reduce(
      (total, result) => total + result.optimizedBytes,
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
  await runOverlayVerification();
}
