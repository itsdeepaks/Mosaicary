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

import { runEdgeCases } from "./capture-resource-preview-overlay-edge-cases.mjs";
import {
  CHALLENGE_TERMS,
  OVERLAY_MAX_BYTES,
  OVERLAY_OUTPUT,
  OVERLAY_VIEWPORT,
  listSafeSnapshotCandidates,
  verifyInteractionCleared,
} from "./capture-resource-preview-overlay-verification.mjs";

export const CONTROLLED_BATCH_ID = "controlled-20-v1-20260803";

export const UNSEEN_TARGETS = Object.freeze([
  {
    resourceId: "resource-c8e3ed2b894f",
    name: "Envato Elements",
    url: "https://elements.envato.com",
    category: "visual-assets",
  },
  {
    resourceId: "resource-9b1c10807887",
    name: "Unblast",
    url: "https://unblast.com",
    category: "visual-assets",
  },
  {
    resourceId: "resource-e6df4e7faaeb",
    name: "Freebiesbug",
    url: "https://freebiesbug.com",
    category: "visual-assets",
  },
  {
    resourceId: "resource-66b5da3637f8",
    name: "Uizard",
    url: "https://uizard.io",
    category: "design-tools-ai",
  },
  {
    resourceId: "resource-a6b11a4a9e4a",
    name: "Visily",
    url: "https://www.visily.ai",
    category: "design-tools-ai",
  },
  {
    resourceId: "resource-9e3aab723774",
    name: "Google Stitch",
    url: "https://stitch.withgoogle.com",
    category: "design-tools-ai",
  },
  {
    resourceId: "resource-cf7a3a4c926a",
    name: "Lovable",
    url: "https://lovable.dev",
    category: "design-tools-ai",
  },
  {
    resourceId: "resource-f97b4c3f7a1b",
    name: "Bolt",
    url: "https://bolt.new",
    category: "design-tools-ai",
  },
  {
    resourceId: "resource-f11c3566f12d",
    name: "Magic Patterns",
    url: "https://www.magicpatterns.com",
    category: "design-tools-ai",
  },
  {
    resourceId: "resource-5969258ea429",
    name: "Dora",
    url: "https://www.dora.run",
    category: "design-tools-ai",
  },
  {
    resourceId: "resource-29300a9360ac",
    name: "Locofy",
    url: "https://www.locofy.ai",
    category: "design-tools-ai",
  },
  {
    resourceId: "resource-79fdadef1595",
    name: "TeleportHQ",
    url: "https://teleporthq.io",
    category: "design-tools-ai",
  },
]);

export const SUITABLE_CONTROLS = Object.freeze([
  {
    resourceId: "resource-ed42ea2dfde6",
    name: "UI Store Design",
    url: "https://www.uistore.design",
    category: "visual-assets",
  },
  {
    resourceId: "resource-2a0af896ff66",
    name: "Penpot",
    url: "https://penpot.app",
    category: "design-tools-ai",
  },
  {
    resourceId: "resource-21359fe8c171",
    name: "Webflow",
    url: "https://webflow.com",
    category: "design-tools-ai",
  },
]);

export const BLOCKED_CONTROLS = Object.freeze([
  {
    resourceId: "resource-076ade306587",
    name: "UI8",
    url: "https://ui8.net",
    category: "visual-assets",
  },
  {
    resourceId: "resource-0e09218b32a8",
    name: "Creative Market",
    url: "https://creativemarket.com",
    category: "visual-assets",
  },
  {
    resourceId: "resource-da732653cd75",
    name: "Replit",
    url: "https://replit.com",
    category: "design-tools-ai",
  },
]);

export const GENERIC_TARGETS = Object.freeze([
  ...UNSEEN_TARGETS.map((target) => ({
    ...target,
    cohort: "unseen",
  })),
  ...SUITABLE_CONTROLS.map((target) => ({
    ...target,
    cohort: "suitable-control",
  })),
  ...BLOCKED_CONTROLS.map((target) => ({
    ...target,
    cohort: "blocked-control",
  })),
]);

export const STRICT_EDGE_RESOURCE_IDS = Object.freeze([
  "resource-424e130e8422",
  "resource-e81793f16a04",
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

const PAGE_AUDIT_SCRIPT = `(() => {
  const normalize = (value) => String(value ?? "").replace(/\\s+/g, " ").trim();
  const visible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity || 1) > 0 && rect.width >= 8 && rect.height >= 8;
  };
  const consentTerms = ${JSON.stringify(CONSENT_TERMS)};
  const overlays = Array.from(document.querySelectorAll("body *"))
    .filter((element) => {
      if (!visible(element)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const ratio = (rect.width * rect.height) / Math.max(1, innerWidth * innerHeight);
      const zIndex = Number.parseInt(style.zIndex, 10);
      const overlayLike =
        element.getAttribute("role") === "dialog" ||
        element.getAttribute("aria-modal") === "true" ||
        ((style.position === "fixed" || style.position === "sticky") &&
          ratio >= 0.025 &&
          (Number.isFinite(zIndex) ? zIndex >= 1 : true));
      if (!overlayLike) return false;
      const text = normalize(element.innerText).toLowerCase();
      return consentTerms.some((term) => text.includes(term));
    })
    .slice(0, 12)
    .map((element) => ({
      tag: element.tagName.toLowerCase(),
      role: element.getAttribute("role"),
      ariaLabel: element.getAttribute("aria-label"),
      text: normalize(element.innerText).slice(0, 420),
    }));
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
      // Continue through supported agent-browser output shapes.
    }
  }
  return { raw: trimmed.slice(0, 3000) };
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

async function captureGenericTarget(target, rawPath) {
  const session = `tessli-controlled-${target.resourceId.slice(-12)}`;
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
    const opened = record("open-site", runAgent(session, ["open", target.url]));
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
    const unverifiedClick = interactions.some(
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
      unverifiedClick,
      stateDecision:
        challengeTerms.length > 0
          ? "blocked"
          : unverifiedClick ||
              remainingActions.length > 0 ||
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

async function runGenericTargets(outputDirectory) {
  const rawDir = join(outputDirectory, "raw");
  const optimizedDir = join(outputDirectory, "optimized");
  mkdirSync(rawDir, { recursive: true });
  mkdirSync(optimizedDir, { recursive: true });

  const results = [];
  for (const target of GENERIC_TARGETS) {
    const rawPath = join(rawDir, `${target.resourceId}.png`);
    const optimizedPath = join(optimizedDir, `${target.resourceId}.webp`);
    const startedAt = new Date().toISOString();
    try {
      const browser = await captureGenericTarget(target, rawPath);
      const rawBytes = statSync(rawPath).size;
      const optimized = optimizeScreenshot(rawPath, optimizedPath);
      results.push({
        ...target,
        status: "captured",
        startedAt,
        completedAt: new Date().toISOString(),
        rawFile: basename(rawPath),
        optimizedFile: basename(optimizedPath),
        rawBytes,
        optimizedBytes: optimized.bytes,
        compressionPercent: Number(
          (((rawBytes - optimized.bytes) / rawBytes) * 100).toFixed(2),
        ),
        quality: optimized.quality,
        sha256: createHash("sha256")
          .update(readFileSync(optimizedPath))
          .digest("hex"),
        browser,
      });
    } catch (error) {
      results.push({
        ...target,
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
    batch: CONTROLLED_BATCH_ID,
    harness: "generic",
    generatedAt: new Date().toISOString(),
    captureCount: captured.length,
    failureCount: results.length - captured.length,
    stateDecisions: Object.fromEntries(
      ["blocked", "overlay-remains", "verified-clear", "no-detected-overlay"].map(
        (decision) => [
          decision,
          captured.filter((result) => result.browser.stateDecision === decision)
            .length,
        ],
      ),
    ),
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
    join(outputDirectory, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  return manifest;
}

function cohortCounts(resources) {
  return resources.reduce((counts, resource) => {
    const cohort = resource.cohort ?? "strict-edge";
    counts[cohort] = (counts[cohort] ?? 0) + 1;
    return counts;
  }, {});
}

export async function runControlledBatch20({ outputDirectory } = {}) {
  const outputDir = resolve(
    outputDirectory ?? "artifacts/resource-preview-controlled-batch-20",
  );
  mkdirSync(outputDir, { recursive: true });

  if (!commandPath("agent-browser")) {
    throw new Error("agent-browser is required for the controlled batch.");
  }
  if (!commandPath("cwebp")) {
    throw new Error("cwebp is required for deterministic WebP compression.");
  }

  const genericManifest = await runGenericTargets(join(outputDir, "generic"));
  const edgeManifest = await runEdgeCases({
    outputDirectory: join(outputDir, "edge"),
  });
  process.exitCode = undefined;

  const genericResources = genericManifest.resources.map((resource) => ({
    ...resource,
    harness: "generic",
  }));
  const edgeResources = edgeManifest.resources.map((resource) => ({
    ...resource,
    category:
      resource.resourceId === "resource-424e130e8422"
        ? "visual-assets"
        : "design-tools-ai",
    cohort: "strict-edge",
    harness: "strict-edge",
    browser: {
      ...resource.browser,
      stateDecision: resource.browser?.decision,
    },
  }));
  const resources = [...genericResources, ...edgeResources];
  const captured = resources.filter((resource) => resource.status === "captured");
  const terminalRecordCount = resources.length;
  const combined = {
    version: 1,
    batch: CONTROLLED_BATCH_ID,
    generatedAt: new Date().toISOString(),
    productionApproved: false,
    publicationApproved: false,
    viewport: OVERLAY_VIEWPORT,
    output: OVERLAY_OUTPUT,
    maxBytes: OVERLAY_MAX_BYTES,
    targetCount: resources.length,
    terminalRecordCount,
    captureCount: captured.length,
    failureCount: resources.length - captured.length,
    cohortCounts: cohortCounts(resources),
    categoryCounts: resources.reduce((counts, resource) => {
      counts[resource.category] = (counts[resource.category] ?? 0) + 1;
      return counts;
    }, {}),
    stateDecisionCounts: captured.reduce((counts, resource) => {
      const decision = resource.browser?.stateDecision ?? "unknown";
      counts[decision] = (counts[decision] ?? 0) + 1;
      return counts;
    }, {}),
    rawTotalBytes: captured.reduce(
      (total, resource) => total + resource.rawBytes,
      0,
    ),
    optimizedTotalBytes: captured.reduce(
      (total, resource) => total + resource.optimizedBytes,
      0,
    ),
    resources,
  };
  writeFileSync(
    join(outputDir, "manifest.json"),
    `${JSON.stringify(combined, null, 2)}\n`,
  );
  console.log(JSON.stringify(combined, null, 2));

  if (terminalRecordCount !== 20) {
    throw new Error(`Expected 20 terminal records; received ${terminalRecordCount}.`);
  }
  if (captured.length === 0) process.exitCode = 1;
  return combined;
}

const invokedPath = process.argv[1]
  ? pathToFileURL(process.argv[1]).href
  : null;
if (invokedPath === import.meta.url) {
  const outputIndex = process.argv.indexOf("--output");
  const outputDirectory =
    outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  await runControlledBatch20({ outputDirectory });
}
