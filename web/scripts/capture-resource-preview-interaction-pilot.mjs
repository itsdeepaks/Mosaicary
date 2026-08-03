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

export const INTERACTION_BATCH = "interaction-v1-20260803";
export const INTERACTION_VIEWPORT = Object.freeze({ width: 1440, height: 756 });
export const INTERACTION_OUTPUT = Object.freeze({ width: 960, height: 504 });
export const INTERACTION_MAX_BYTES = 307_200;
export const INTERACTION_SITES = Object.freeze([
  {
    resourceId: "resource-fd3c2a3a5685",
    name: "Figma",
    url: "https://www.figma.com",
    testReason: "known promotional overlay",
  },
  {
    resourceId: "resource-21359fe8c171",
    name: "Webflow",
    url: "https://webflow.com",
    testReason: "known cookie overlay",
  },
  {
    resourceId: "resource-076ade306587",
    name: "UI8",
    url: "https://ui8.net",
    testReason: "prior HTTP 403",
  },
  {
    resourceId: "resource-0e09218b32a8",
    name: "Creative Market",
    url: "https://creativemarket.com",
    testReason: "prior HTTP 403",
  },
  {
    resourceId: "resource-424e130e8422",
    name: "Pixelbuddha",
    url: "https://pixelbuddha.net",
    testReason: "misleading product-specific Open Graph image",
  },
  {
    resourceId: "resource-ed42ea2dfde6",
    name: "UI Store Design",
    url: "https://www.uistore.design",
    testReason: "heavy Open Graph image",
  },
  {
    resourceId: "resource-2a0af896ff66",
    name: "Penpot",
    url: "https://penpot.app",
    testReason: "prior HTML size ceiling",
  },
  {
    resourceId: "resource-6529347d85fd",
    name: "Framer",
    url: "https://www.framer.com",
    testReason: "prior HTML size ceiling",
  },
  {
    resourceId: "resource-4b1cd233f883",
    name: "v0",
    url: "https://v0.dev",
    testReason: "sparse Open Graph image and redirect behavior",
  },
  {
    resourceId: "resource-da732653cd75",
    name: "Replit",
    url: "https://replit.com",
    testReason: "campaign-style Open Graph image",
  },
  {
    resourceId: "resource-e81793f16a04",
    name: "Relume",
    url: "https://www.relume.io",
    testReason: "canonical redirect and representative control",
  },
  {
    resourceId: "resource-9bfe4a3897ac",
    name: "Plasmic",
    url: "https://www.plasmic.app",
    testReason: "prior HTML size ceiling",
  },
  {
    resourceId: "resource-5069590156b7",
    name: "Builder.io",
    url: "https://www.builder.io",
    testReason: "representative control",
  },
  {
    resourceId: "resource-09924984d444",
    name: "Anima",
    url: "https://www.animaapp.com",
    testReason: "oversized Open Graph image",
  },
  {
    resourceId: "resource-25d0d0a31e39",
    name: "Webstudio",
    url: "https://webstudio.is",
    testReason: "known-good screenshot control",
  },
]);

export const SAFE_DISMISS_TEXTS = Object.freeze([
  "reject all",
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

const QUALITY_STEPS = Object.freeze([78, 70, 62, 54]);
const SAFE_DISMISS_SCRIPT = `(() => {
  const normalize = (value) => String(value ?? "").replace(/\\s+/g, " ").trim().toLowerCase();
  const visible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity || 1) > 0 && rect.width >= 8 && rect.height >= 8;
  };
  const overlayAncestor = (element) => {
    let current = element;
    for (let depth = 0; current && depth < 10; depth += 1, current = current.parentElement) {
      if (!(current instanceof HTMLElement)) continue;
      const style = getComputedStyle(current);
      const rect = current.getBoundingClientRect();
      const ratio = (rect.width * rect.height) / Math.max(1, innerWidth * innerHeight);
      const zIndex = Number.parseInt(style.zIndex, 10);
      if (
        current.getAttribute("role") === "dialog" ||
        current.getAttribute("aria-modal") === "true" ||
        ((style.position === "fixed" || style.position === "sticky") && ratio >= 0.03 && (Number.isFinite(zIndex) ? zIndex >= 1 : true))
      ) {
        return current;
      }
    }
    return null;
  };
  const priority = ${JSON.stringify(SAFE_DISMISS_TEXTS)};
  const candidates = Array.from(document.querySelectorAll('button, [role="button"], input[type="button"], input[type="submit"], a'));
  const ranked = [];
  for (const element of candidates) {
    if (!visible(element)) continue;
    const overlay = overlayAncestor(element);
    if (!overlay) continue;
    const text = normalize(element instanceof HTMLInputElement ? element.value : element.textContent);
    const aria = normalize(element.getAttribute("aria-label"));
    const title = normalize(element.getAttribute("title"));
    const index = priority.findIndex((allowed) => text === allowed || text.startsWith(allowed));
    const isClose = [aria, title].some((value) => value === "close" || value === "dismiss" || value === "close dialog" || value === "dismiss dialog");
    if (index >= 0 || isClose) {
      ranked.push({ element, overlay, text, aria, title, rank: index >= 0 ? index : priority.length + 1 });
    }
  }
  ranked.sort((left, right) => left.rank - right.rank);
  const selected = ranked[0];
  if (!selected) {
    return JSON.stringify({ clicked: false });
  }
  selected.element.click();
  return JSON.stringify({
    clicked: true,
    text: selected.text || null,
    ariaLabel: selected.aria || null,
    title: selected.title || null,
    overlayText: normalize(selected.overlay.innerText).slice(0, 240),
  });
})()`;

const OVERLAY_AUDIT_SCRIPT = `(() => {
  const normalize = (value) => String(value ?? "").replace(/\\s+/g, " ").trim();
  const visible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity || 1) > 0 && rect.width >= 8 && rect.height >= 8;
  };
  const overlays = Array.from(document.querySelectorAll('body *'))
    .filter((element) => {
      if (!visible(element)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const ratio = (rect.width * rect.height) / Math.max(1, innerWidth * innerHeight);
      const zIndex = Number.parseInt(style.zIndex, 10);
      return (
        element.getAttribute("role") === "dialog" ||
        element.getAttribute("aria-modal") === "true" ||
        ((style.position === "fixed" || style.position === "sticky") && ratio >= 0.04 && (Number.isFinite(zIndex) ? zIndex >= 1 : true))
      );
    })
    .slice(0, 12)
    .map((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        role: element.getAttribute("role"),
        ariaLabel: element.getAttribute("aria-label"),
        position: style.position,
        zIndex: style.zIndex,
        viewportRatio: Number(((rect.width * rect.height) / Math.max(1, innerWidth * innerHeight)).toFixed(4)),
        text: normalize(element.innerText).slice(0, 320),
      };
    });
  const body = normalize(document.body?.innerText).toLowerCase();
  const challengeTerms = [
    "access denied",
    "forbidden",
    "verify you are human",
    "checking your browser",
    "just a moment",
    "enable javascript and cookies",
    "security check",
  ];
  return JSON.stringify({
    url: location.href,
    title: document.title,
    challengeTerms: challengeTerms.filter((term) => body.includes(term)),
    overlays,
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
    maxBuffer: 20 * 1024 * 1024,
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
      // Continue through known agent-browser output shapes.
    }
  }
  return { raw: trimmed.slice(0, 2000) };
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
    return resolve("artifacts/resource-preview-interaction-pilot");
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
      String(INTERACTION_OUTPUT.width),
      String(INTERACTION_OUTPUT.height),
      rawPath,
      "-o",
      optimizedPath,
    ]);
    if (result.status !== 0 || !existsSync(optimizedPath)) {
      throw new Error(`cwebp failed at quality ${quality}: ${result.stderr}`);
    }
    const bytes = statSync(optimizedPath).size;
    if (bytes <= INTERACTION_MAX_BYTES) return { quality, bytes };
  }
  throw new Error(
    `Optimized image remains above ${INTERACTION_MAX_BYTES} bytes (${statSync(optimizedPath).size}).`,
  );
}

async function uploadPreview(resourceId, filePath) {
  const uploadUrl = process.env.INTERACTION_UPLOAD_URL;
  if (!uploadUrl) return { status: "capture-only" };
  const token = process.env.INTERACTION_UPLOAD_JWT;
  if (!token) throw new Error("INTERACTION_UPLOAD_JWT is required for upload.");
  const response = await fetch(
    `${uploadUrl}?batch=${encodeURIComponent(INTERACTION_BATCH)}&resource_id=${encodeURIComponent(resourceId)}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        apikey: token,
        "content-type": "image/webp",
      },
      body: readFileSync(filePath),
    },
  );
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 500) };
  }
  if (response.status === 409) {
    return {
      status: "already-exists",
      httpStatus: response.status,
      publicUrl: `${process.env.INTERACTION_PUBLIC_BUCKET_BASE}/review/${INTERACTION_BATCH}/${resourceId}.webp`,
      response: body,
    };
  }
  if (!response.ok) {
    throw new Error(`Upload failed: HTTP ${response.status} ${text.slice(0, 500)}`);
  }
  const publicUrl = body.publicUrl;
  const head = publicUrl
    ? await fetch(publicUrl, { method: "HEAD", cache: "no-store" })
    : null;
  return {
    status: "uploaded",
    httpStatus: response.status,
    publicUrl,
    publicHeadStatus: head?.status ?? null,
    response: body,
  };
}

function interactionAttempt(session) {
  const result = runAgent(session, ["eval", "--stdin"], {
    input: SAFE_DISMISS_SCRIPT,
  });
  return {
    commandStatus: result.status,
    commandError: result.error,
    result: parseJsonPayload(result.stdout),
    stderr: result.stderr.slice(0, 1000),
  };
}

function auditPage(session) {
  const result = runAgent(session, ["eval", "--stdin"], {
    input: OVERLAY_AUDIT_SCRIPT,
  });
  return {
    commandStatus: result.status,
    commandError: result.error,
    result: parseJsonPayload(result.stdout),
    stderr: result.stderr.slice(0, 1000),
  };
}

async function captureSite(site, rawPath) {
  const session = `tessli-${site.resourceId.slice(-12)}`;
  const commands = [];
  const record = (name, result) => {
    commands.push({
      name,
      status: result.status,
      signal: result.signal,
      error: result.error,
      stdout: result.stdout.slice(0, 1500),
      stderr: result.stderr.slice(0, 1500),
    });
    return result;
  };

  try {
    const blank = record("open-blank", runAgent(session, ["open", "about:blank"]));
    if (blank.status !== 0) throw new Error(`agent-browser could not start: ${blank.stderr}`);
    record(
      "set-viewport",
      runAgent(session, [
        "set",
        "viewport",
        String(INTERACTION_VIEWPORT.width),
        String(INTERACTION_VIEWPORT.height),
      ]),
    );
    record("set-light-media", runAgent(session, ["set", "media", "light"]));
    const opened = record("open-site", runAgent(session, ["open", site.url]));
    if (opened.status !== 0) throw new Error(`navigation failed: ${opened.stderr}`);
    record("initial-wait", runAgent(session, ["wait", "7000"]));

    const beforeAudit = auditPage(session);
    const interactions = [];
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const interaction = interactionAttempt(session);
      interactions.push(interaction);
      if (!interaction.result?.clicked) break;
      record(`post-interaction-wait-${attempt + 1}`, runAgent(session, ["wait", "1200"]));
    }

    if (!interactions.some((interaction) => interaction.result?.clicked)) {
      const fallbackTexts = [
        "Reject all",
        "Reject All",
        "Only necessary",
        "Decline all",
        "Continue without accepting",
      ];
      for (const text of fallbackTexts) {
        const fallback = record(
          `fallback-${text}`,
          runAgent(session, ["find", "text", text, "click"]),
        );
        if (fallback.status === 0) {
          interactions.push({ fallbackText: text, commandStatus: 0 });
          record("post-fallback-wait", runAgent(session, ["wait", "1200"]));
          break;
        }
      }
    }

    const afterAudit = auditPage(session);
    const screenshot = record("screenshot", runAgent(session, ["screenshot", rawPath]));
    if (screenshot.status !== 0 || !existsSync(rawPath) || statSync(rawPath).size === 0) {
      throw new Error(`screenshot failed: ${screenshot.stderr}`);
    }

    return {
      commands,
      beforeAudit,
      interactions,
      afterAudit,
    };
  } finally {
    runAgent(session, ["close"]);
  }
}

export async function runInteractionPilot({ outputDirectory } = {}) {
  const outputDir = outputDirectory
    ? resolve(outputDirectory)
    : parseOutputDirectory(process.argv.slice(2));
  const rawDir = join(outputDir, "raw");
  const optimizedDir = join(outputDir, "optimized");
  mkdirSync(rawDir, { recursive: true });
  mkdirSync(optimizedDir, { recursive: true });

  if (!commandPath("agent-browser")) {
    throw new Error("agent-browser is required for the interaction pilot.");
  }
  if (!commandPath("cwebp")) {
    throw new Error("cwebp is required for deterministic WebP compression.");
  }

  const version = run("agent-browser", ["--version"]);
  const results = [];
  for (const site of INTERACTION_SITES) {
    const rawPath = join(rawDir, `${site.resourceId}.png`);
    const optimizedPath = join(optimizedDir, `${site.resourceId}.webp`);
    const startedAt = new Date().toISOString();
    try {
      const browser = await captureSite(site, rawPath);
      const rawBytes = statSync(rawPath).size;
      const optimized = optimizeScreenshot(rawPath, optimizedPath);
      const upload = await uploadPreview(site.resourceId, optimizedPath);
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
        upload,
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
    batch: INTERACTION_BATCH,
    generatedAt: new Date().toISOString(),
    agentBrowserVersion: version.stdout || version.stderr || "unknown",
    viewport: INTERACTION_VIEWPORT,
    output: INTERACTION_OUTPUT,
    maxBytes: INTERACTION_MAX_BYTES,
    captureCount: captured.length,
    failureCount: results.length - captured.length,
    rawTotalBytes: captured.reduce((total, result) => total + result.rawBytes, 0),
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
  await runInteractionPilot();
}
