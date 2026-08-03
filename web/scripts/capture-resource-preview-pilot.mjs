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

export const PILOT_VIEWPORT = Object.freeze({ width: 1440, height: 756 });
export const PILOT_OUTPUT = Object.freeze({ width: 960, height: 504 });
export const PILOT_MAX_BYTES = 307_200;
export const PILOT_SITES = Object.freeze([
  {
    resourceId: "resource-fd3c2a3a5685",
    name: "Figma",
    url: "https://www.figma.com/",
  },
  {
    resourceId: "resource-25d0d0a31e39",
    name: "Webstudio",
    url: "https://webstudio.is/",
  },
  {
    resourceId: "resource-66b5da3637f8",
    name: "Uizard",
    url: "https://uizard.io/",
  },
  {
    resourceId: "resource-29300a9360ac",
    name: "Locofy",
    url: "https://www.locofy.ai/",
  },
  {
    resourceId: "resource-21359fe8c171",
    name: "Webflow",
    url: "https://webflow.com/",
  },
]);

const QUALITY_STEPS = Object.freeze([78, 70, 62, 54]);

function commandExists(command) {
  const result = spawnSync("bash", ["-lc", `command -v ${command}`], {
    encoding: "utf8",
  });
  return result.status === 0 ? result.stdout.trim() : null;
}

function findChrome() {
  const configured = process.env.CHROME_BIN;
  if (configured && existsSync(configured)) {
    return configured;
  }

  for (const command of [
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
  ]) {
    const found = commandExists(command);
    if (found) {
      return found;
    }
  }

  throw new Error("Chrome or Chromium is required for the preview pilot.");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  });

  return {
    status: result.status,
    signal: result.signal,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? "",
  };
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function compressionPercent(rawBytes, optimizedBytes) {
  if (!rawBytes) {
    return 0;
  }
  return Number((((rawBytes - optimizedBytes) / rawBytes) * 100).toFixed(2));
}

function parseOutputDirectory(argv) {
  const outputIndex = argv.indexOf("--output");
  if (outputIndex === -1) {
    return resolve("artifacts/resource-preview-pilot");
  }

  const value = argv[outputIndex + 1];
  if (!value) {
    throw new Error("--output requires a directory path.");
  }
  return resolve(value);
}

async function uploadPreview(resourceId, filePath) {
  const uploadUrl = process.env.PILOT_UPLOAD_URL;
  if (!uploadUrl) {
    return { status: "capture-only" };
  }

  const response = await fetch(
    `${uploadUrl}?resource_id=${encodeURIComponent(resourceId)}`,
    {
      method: "POST",
      headers: { "content-type": "image/webp" },
      body: readFileSync(filePath),
    },
  );
  const responseText = await response.text();
  let responseBody;
  try {
    responseBody = JSON.parse(responseText);
  } catch {
    responseBody = { raw: responseText.slice(0, 500) };
  }

  if (response.status === 409) {
    return {
      status: "already-exists",
      httpStatus: response.status,
      publicUrl: `${process.env.PILOT_PUBLIC_BUCKET_BASE}/pilot/${resourceId}.webp`,
      response: responseBody,
    };
  }

  if (!response.ok) {
    throw new Error(
      `Upload failed for ${resourceId}: HTTP ${response.status} ${responseText}`,
    );
  }

  const publicUrl = responseBody.publicUrl;
  const verification = publicUrl
    ? await fetch(publicUrl, { method: "HEAD", cache: "no-store" })
    : null;

  return {
    status: "uploaded",
    httpStatus: response.status,
    publicUrl,
    publicHeadStatus: verification?.status ?? null,
    response: responseBody,
  };
}

function captureScreenshot(chrome, site, rawPath) {
  const chromeArgs = [
    "45s",
    chrome,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-extensions",
    "--disable-background-networking",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--force-prefers-reduced-motion",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=10000",
    `--window-size=${PILOT_VIEWPORT.width},${PILOT_VIEWPORT.height}`,
    `--screenshot=${rawPath}`,
    site.url,
  ];

  return run("timeout", chromeArgs);
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
      String(PILOT_OUTPUT.width),
      String(PILOT_OUTPUT.height),
      rawPath,
      "-o",
      optimizedPath,
    ]);

    if (result.status !== 0 || !existsSync(optimizedPath)) {
      throw new Error(`cwebp failed at quality ${quality}: ${result.stderr}`);
    }

    const bytes = statSync(optimizedPath).size;
    if (bytes <= PILOT_MAX_BYTES) {
      return { quality, bytes };
    }
  }

  const bytes = statSync(optimizedPath).size;
  throw new Error(
    `Optimized image remains above ${PILOT_MAX_BYTES} bytes (${bytes}).`,
  );
}

export async function runPilot({ outputDirectory } = {}) {
  const outputDir = outputDirectory
    ? resolve(outputDirectory)
    : parseOutputDirectory(process.argv.slice(2));
  const rawDir = join(outputDir, "raw");
  const optimizedDir = join(outputDir, "optimized");
  mkdirSync(rawDir, { recursive: true });
  mkdirSync(optimizedDir, { recursive: true });

  const chrome = findChrome();
  if (!commandExists("cwebp")) {
    throw new Error("cwebp is required for deterministic WebP compression.");
  }

  const results = [];
  for (const site of PILOT_SITES) {
    const rawPath = join(rawDir, `${site.resourceId}.png`);
    const optimizedPath = join(optimizedDir, `${site.resourceId}.webp`);
    const startedAt = new Date().toISOString();

    try {
      const capture = captureScreenshot(chrome, site, rawPath);
      if (!existsSync(rawPath) || statSync(rawPath).size === 0) {
        throw new Error(
          `Chrome did not produce a screenshot (exit ${capture.status}, ${capture.stderr}).`,
        );
      }

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
        captureExitStatus: capture.status,
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

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    viewport: PILOT_VIEWPORT,
    output: PILOT_OUTPUT,
    maxBytes: PILOT_MAX_BYTES,
    captureCount: results.filter((result) => result.status === "captured").length,
    failureCount: results.filter((result) => result.status === "failed").length,
    resources: results,
  };
  writeFileSync(
    join(outputDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  console.log(JSON.stringify(manifest, null, 2));
  if (manifest.captureCount === 0) {
    process.exitCode = 1;
  }
  return manifest;
}

const invokedPath = process.argv[1]
  ? pathToFileURL(process.argv[1]).href
  : null;
if (invokedPath === import.meta.url) {
  await runPilot();
}
