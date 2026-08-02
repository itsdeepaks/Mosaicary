import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { buildReleaseCatalogue } from "../scripts/release-catalogue-lib.mjs";
import {
  buildRepositoryReview,
  buildReviewReport,
  CANDIDATE_SCHEMA_PATH,
  CANDIDATE_SOURCE_PATH,
  renderReviewMarkdown,
  serializeReport,
  validateCandidateSource,
  validateCandidateUrl,
} from "../scripts/resource-media-review-lib.mjs";
import {
  discoverResourceMedia,
  extractMetadataCandidates,
  isPublicIpAddress,
} from "../scripts/resource-media-discovery-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repoRoot, relativePath), "utf8"));
}

test("candidate source and reports remain deterministic and review-only", async () => {
  const [source, schema, release, approved, repositoryReview] =
    await Promise.all([
      readJson(CANDIDATE_SOURCE_PATH),
      readJson(CANDIDATE_SCHEMA_PATH),
      buildReleaseCatalogue({ root: repoRoot }),
      readJson("lib_data/resource-media.json"),
      buildRepositoryReview({ root: repoRoot }),
    ]);

  assert.equal(schema.$id, "urn:tessli:schema:resource-media-candidates:v1");
  const validation = validateCandidateSource(
    source,
    release.catalogue.resources,
  );
  assert.deepEqual(validation.errors, []);
  assert.equal(source.resources.length, 8);
  const approvedForCopy = source.resources.filter(
    (record) => record.reviewerStatus === "approved-for-copy",
  );
  const pending = source.resources.filter(
    (record) => record.discoveryStatus === "pending",
  );
  assert.deepEqual(
    approvedForCopy.map((record) => record.resourceId),
    [
      "resource-73d75733406d",
      "resource-92baaed92865",
      "resource-08a9f0e0bd50",
      "resource-7fa85ad18d65",
      "resource-6887c11205e8",
    ],
  );
  assert.equal(
    approvedForCopy.every(
      (record) =>
        record.discoveryStatus === "candidate" &&
        Boolean(record.preview || record.favicon),
    ),
    true,
  );
  assert.equal(pending.length, 3);
  assert.equal(
    pending.every(
      (record) =>
        record.reviewerStatus === "unreviewed" &&
        !record.preview &&
        !record.favicon,
    ),
    true,
  );

  const reportAgain = buildReviewReport({
    candidateSource: source,
    approvedSource: approved,
    catalogueResources: release.catalogue.resources,
    candidateSourceBuffer: await readFile(
      path.join(repoRoot, CANDIDATE_SOURCE_PATH),
    ),
  });
  assert.equal(repositoryReview.report.summary.approvedProduction, 86);
  assert.equal(repositoryReview.report.summary.reviewTargets, 8);
  assert.equal(repositoryReview.report.summary.discoveredCandidates, 5);
  assert.equal(repositoryReview.report.summary.readyForCopy, 5);
  assert.equal(repositoryReview.report.summary.pending, 3);
  assert.equal(repositoryReview.report.summary.errors, 0);
  assert.equal(repositoryReview.reportJson, serializeReport(reportAgain));
  assert.equal(
    repositoryReview.reportMarkdown,
    renderReviewMarkdown(reportAgain),
  );
});

test("candidate validation rejects unsafe and invented review data", async () => {
  const [source, release] = await Promise.all([
    readJson(CANDIDATE_SOURCE_PATH),
    buildReleaseCatalogue({ root: repoRoot }),
  ]);
  const invalid = structuredClone(source);
  invalid.resources[0] = {
    ...invalid.resources[0],
    resourceName: "Invented name",
    canonicalUrl: "https://user:secret@example.com/resource",
    sourcePageUrl: "https://127.0.0.1/source",
    checkedAt: "2026-07-31",
    discoveryStatus: "candidate",
    reviewerStatus: "approved-for-copy",
    redirects: [
      "https://example.com/1",
      "https://example.com/2",
      "https://example.com/3",
      "https://example.com/4",
    ],
    preview: {
      url: "https://example.com/preview.svg",
      source: "open-graph",
      sourceProperty: "twitter:image",
      contentType: "image/svg+xml",
      provenance: "manual-review",
      checkedAt: "2026-07-31",
    },
  };
  invalid.resources.push(structuredClone(invalid.resources[1]));
  invalid.resources.push({
    ...structuredClone(invalid.resources[2]),
    resourceId: "resource-not-in-catalogue",
  });

  const validation = validateCandidateSource(
    invalid,
    release.catalogue.resources,
  );
  const codes = new Set(validation.errors.map((entry) => entry.code));
  for (const code of [
    "candidate-name-mismatch",
    "candidate-url-mismatch",
    "invalid-canonical-url",
    "invalid-source-page-url",
    "invalid-redirects",
    "invalid-preview-content-type",
    "invalid-open-graph-provenance",
    "preview-source-property-mismatch",
    "duplicate-candidate-resource",
    "unknown-candidate-resource",
  ]) {
    assert.equal(codes.has(code), true, `missing validation code ${code}`);
  }

  assert.match(validateCandidateUrl("http://example.com/image.png"), /HTTPS/);
  assert.match(
    validateCandidateUrl("https://localhost/image.png"),
    /private-style/,
  );
  assert.match(
    validateCandidateUrl("https://192.168.1.4/image.png"),
    /Literal IP/,
  );
  assert.match(
    validateCandidateUrl(`https://example.com/${"x".repeat(2050)}`),
    /exceeds/,
  );
});

test("malformed candidate data cannot enrich production catalogue output", async () => {
  const tempRoot = await mkdtemp(
    path.join(os.tmpdir(), "tessli-media-candidates-"),
  );
  await Promise.all([
    cp(path.join(repoRoot, "lib_data"), path.join(tempRoot, "lib_data"), {
      recursive: true,
    }),
    cp(path.join(repoRoot, "schemas"), path.join(tempRoot, "schemas"), {
      recursive: true,
    }),
  ]);
  await writeFile(
    path.join(tempRoot, CANDIDATE_SOURCE_PATH),
    JSON.stringify({
      version: 1,
      resources: [{ preview: { url: "http://127.0.0.1" } }],
    }),
    "utf8",
  );

  const [baseline, withMalformedCandidate] = await Promise.all([
    buildReleaseCatalogue({ root: repoRoot }),
    buildReleaseCatalogue({ root: tempRoot }),
  ]);
  assert.equal(withMalformedCandidate.catalogueText, baseline.catalogueText);
  assert.equal(
    withMalformedCandidate.report.summary.approvedMedia,
    baseline.report.summary.approvedMedia,
  );
});

test("metadata parser resolves Open Graph and favicon URLs without executing HTML", () => {
  const html = `<!doctype html><html><head>
    <meta property="og:image" content="/assets/card.webp?x=1&amp;y=2">
    <meta name='twitter:image' content='https://cdn.example.com/later.png'>
    <link rel="icon" sizes="32x32" href="/favicon-32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="https://cdn.example.com/touch.png">
  </head><body><script>throw new Error("must not run")</script></body></html>`;
  const result = extractMetadataCandidates(html, "https://example.com/path");
  assert.deepEqual(result.previewCandidates, [
    {
      url: "https://example.com/assets/card.webp?x=1&y=2",
      source: "open-graph",
      sourceProperty: "og:image",
    },
    {
      url: "https://cdn.example.com/later.png",
      source: "twitter",
      sourceProperty: "twitter:image",
    },
  ]);
  assert.deepEqual(result.faviconUrls.slice(0, 3), [
    "https://cdn.example.com/touch.png",
    "https://example.com/favicon-32.png",
    "https://example.com/favicon.ico",
  ]);
});

test("public address classification blocks unsafe address ranges", () => {
  for (const value of [
    "127.0.0.1",
    "10.0.0.1",
    "169.254.169.254",
    "192.168.1.1",
    "198.51.100.4",
    "::1",
    "fc00::1",
    "fe80::1",
    "2001:db8::1",
    "::ffff:127.0.0.1",
  ]) {
    assert.equal(isPublicIpAddress(value), false, `${value} should be blocked`);
  }
  assert.equal(isPublicIpAddress("93.184.216.34"), true);
  assert.equal(isPublicIpAddress("2606:2800:220:1:248:1893:25c8:1946"), true);
});

test("explicit discovery emits review-pending raster candidates", async () => {
  const html = `<!doctype html><head>
    <meta property="og:image" content="https://cdn.example.com/card.webp">
    <link rel="icon" href="https://cdn.example.com/icon.png">
  </head>`;
  const fetchImpl = async (url) => {
    if (url === "https://example.com") {
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    if (url === "https://cdn.example.com/card.webp") {
      return new Response(new Uint8Array([0]), {
        status: 206,
        headers: { "content-type": "image/webp" },
      });
    }
    if (url === "https://cdn.example.com/icon.png") {
      return new Response(new Uint8Array([0]), {
        status: 206,
        headers: { "content-type": "image/png" },
      });
    }
    throw new Error(`Unexpected URL ${url}`);
  };
  const lookup = async () => [{ address: "93.184.216.34", family: 4 }];
  const resource = {
    id: "resource-example",
    name: "Example",
    url: "https://example.com",
  };
  const candidate = await discoverResourceMedia(resource, {
    checkedAt: "2026-07-31",
    fetchImpl,
    lookup,
  });
  assert.equal(candidate.discoveryStatus, "candidate");
  assert.equal(candidate.reviewerStatus, "needs-review");
  assert.equal(candidate.preview.contentType, "image/webp");
  assert.equal(candidate.preview.source, "open-graph");
  assert.equal(candidate.preview.sourceProperty, "og:image");
  assert.equal(candidate.favicon.contentType, "image/png");
  assert.equal(candidate.preview.provenance, "response-header");
});

test("explicit discovery preserves Twitter fallback provenance", async () => {
  const html = `<!doctype html><head>
    <meta property="og:image" content="https://cdn.example.com/card.svg">
    <meta name="twitter:image" content="https://cdn.example.com/card.png">
  </head>`;
  const lookup = async () => [{ address: "93.184.216.34", family: 4 }];
  const candidate = await discoverResourceMedia(
    { id: "resource-example", name: "Example", url: "https://example.com" },
    {
      checkedAt: "2026-08-02",
      lookup,
      fetchImpl: async (url) => {
        if (url === "https://example.com") {
          return new Response(html, {
            status: 200,
            headers: { "content-type": "text/html" },
          });
        }
        if (url === "https://cdn.example.com/card.svg") {
          return new Response("<svg/>", {
            status: 200,
            headers: { "content-type": "image/svg+xml" },
          });
        }
        if (url === "https://cdn.example.com/card.png") {
          return new Response(new Uint8Array([0]), {
            status: 206,
            headers: { "content-type": "image/png" },
          });
        }
        return new Response("missing", {
          status: 404,
          headers: { "content-type": "text/plain" },
        });
      },
    },
  );

  assert.equal(candidate.discoveryStatus, "candidate");
  assert.equal(candidate.preview.source, "twitter");
  assert.equal(candidate.preview.sourceProperty, "twitter:image");
  assert.equal(candidate.preview.contentType, "image/png");
  assert.equal(
    candidate.issues.some((entry) => /SVG/.test(entry.message)),
    true,
  );
});

test("metadata parser de-duplicates identical preview URLs by priority", () => {
  const html = `<!doctype html><head>
    <meta property="og:image" content="https://cdn.example.com/shared.png">
    <meta name="twitter:image" content="https://cdn.example.com/shared.png">
  </head>`;
  const result = extractMetadataCandidates(html, "https://example.com");
  assert.deepEqual(result.previewCandidates, [
    {
      url: "https://cdn.example.com/shared.png",
      source: "open-graph",
      sourceProperty: "og:image",
    },
  ]);
});

test("explicit discovery records unsafe redirects and non-raster responses", async () => {
  const lookup = async () => [{ address: "93.184.216.34", family: 4 }];
  const resource = {
    id: "resource-example",
    name: "Example",
    url: "https://example.com",
  };
  const blocked = await discoverResourceMedia(resource, {
    checkedAt: "2026-07-31",
    lookup,
    fetchImpl: async () =>
      new Response(null, {
        status: 302,
        headers: { location: "https://127.0.0.1/private" },
      }),
  });
  assert.equal(blocked.discoveryStatus, "blocked");
  assert.equal(blocked.issues[0].code, "source-blocked");
  assert.match(blocked.issues[0].message, /Literal IP/);

  const denied = await discoverResourceMedia(resource, {
    checkedAt: "2026-07-31",
    lookup,
    fetchImpl: async () =>
      new Response("blocked", {
        status: 403,
        headers: { "content-type": "text/html" },
      }),
  });
  assert.equal(denied.discoveryStatus, "blocked");
  assert.equal(denied.issues[0].code, "source-http-403");

  const notHtml = await discoverResourceMedia(resource, {
    checkedAt: "2026-07-31",
    lookup,
    fetchImpl: async () =>
      new Response("{}", {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
  });
  assert.equal(notHtml.discoveryStatus, "failed");
  assert.equal(notHtml.issues[0].code, "source-not-html");

  const svgHtml = `<!doctype html><head><meta property="og:image" content="https://cdn.example.com/card.svg"></head>`;
  const svg = await discoverResourceMedia(resource, {
    checkedAt: "2026-07-31",
    lookup,
    fetchImpl: async (url) => {
      if (url === "https://example.com") {
        return new Response(svgHtml, {
          status: 200,
          headers: { "content-type": "text/html" },
        });
      }
      return new Response("<svg/>", {
        status: 200,
        headers: { "content-type": "image/svg+xml" },
      });
    },
  });
  assert.equal(svg.discoveryStatus, "uncertain");
  assert.equal(svg.preview, undefined);
  assert.equal(
    svg.issues.some((entry) => /SVG/.test(entry.message)),
    true,
  );
});
