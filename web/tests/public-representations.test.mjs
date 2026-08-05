import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
  PUBLIC_COLLECTION_REPRESENTATION_CONTRACT,
  PUBLIC_SOURCE_REPRESENTATION_CONTRACT,
  createPublicCollectionRepresentation,
  createPublicOptionsHeaders,
  createPublicRepresentationHeaders,
  createPublicSourceRepresentation,
  serializePublicCollectionMarkdown,
  serializePublicJson,
  serializePublicSourceMarkdown,
} from "../lib/public-representations.mjs";

const profiled = {
  contractVersion: 1,
  id: "source-one",
  slug: "source-one",
  name: "Source One",
  url: "https://example.com",
  domain: "example.com",
  summary: "Canonical summary.",
  category: "website-inspiration",
  sourceType: "inspiration-directory",
  sourceTypeBasis: "category-classification",
  accessModel: { access: "free", subscriptionRequired: "no" },
  bestFor: ["hierarchy"],
  capabilities: ["inspiration"],
  contentObjects: ["websites"],
  platforms: ["web"],
  frameworks: [],
  integrationMethods: ["web-ui"],
  limitations: ["No source code"],
  profileLevel: "profiled",
  status: "active",
  verifiedAt: "2026-07-01",
  evidence: [
    {
      claim: "Recorded claim",
      sourceUrl: "https://example.com/docs",
      sourceType: "official-docs",
      verifiedAt: "2026-07-01",
      confidence: "certain",
    },
  ],
  coverage: {
    level: "profiled",
    reason: "Structured intelligence is present.",
    profileStatus: "verified",
    lastVerifiedAt: "2026-07-01",
    confidence: "certain",
    humanReviewStatus: "not-recorded",
    freshnessStatus: "current",
    evidenceCount: 1,
  },
  intelligence: {
    profileVersion: 1,
    status: "verified",
    verifiedAt: "2026-07-01",
    summary: "Intelligence summary.",
    designTools: ["figma"],
    deliveryFormats: ["web"],
    agentInterfaces: [{ type: "mcp", transport: "stdio" }],
    discovery: { textSearch: true, facets: ["type"] },
    governance: {
      defaultPersistence: "transient",
      assetRedistribution: "restricted",
      sourceAttribution: "required",
      userCredentialRequired: false,
      termsReviewRequired: true,
      notes: [],
    },
  },
};

const listed = {
  ...profiled,
  id: "source-two",
  slug: "source-two",
  name: "Source Two",
  url: "https://two.example",
  domain: "two.example",
  profileLevel: "listed",
  verifiedAt: null,
  bestFor: [],
  capabilities: [],
  contentObjects: [],
  platforms: [],
  integrationMethods: [],
  limitations: [],
  evidence: [],
  coverage: {
    level: "listed",
    reason: "Catalogue metadata only.",
    profileStatus: null,
    lastVerifiedAt: null,
    confidence: "unknown",
    humanReviewStatus: "not-recorded",
    freshnessStatus: "unknown",
    evidenceCount: 0,
  },
  intelligence: null,
};

function collectKeys(value, keys = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, keys);
    return keys;
  }
  if (!value || typeof value !== "object") return keys;
  for (const [key, child] of Object.entries(value)) {
    keys.add(key);
    collectKeys(child, keys);
  }
  return keys;
}

test("source JSON and Markdown are deterministic and truthful", () => {
  const first = createPublicSourceRepresentation(profiled);
  const second = createPublicSourceRepresentation(profiled);
  assert.equal(first.contract, PUBLIC_SOURCE_REPRESENTATION_CONTRACT);
  assert.equal(serializePublicJson(first), serializePublicJson(second));
  assert.equal(
    serializePublicSourceMarkdown(first),
    serializePublicSourceMarkdown(second),
  );
  const json = serializePublicJson(first);
  const md = serializePublicSourceMarkdown(first);
  assert.equal(json.endsWith("\n"), true);
  assert.equal(md.endsWith("\n"), true);
  assert.doesNotMatch(md, /[ \t]+$/gmu);
  assert.match(
    md,
    /Repository intelligence is not live-provider verification/u,
  );
  assert.match(json, /"profileLevel": "profiled"/u);
  const publicKeys = collectKeys(first);
  for (const forbiddenKey of [
    "boardId",
    "boardIds",
    "savedIds",
    "localStorage",
    "cookie",
    "cookies",
    "account",
    "credential",
    "credentials",
  ]) {
    assert.equal(publicKeys.has(forbiddenKey), false, forbiddenKey);
  }
});

test("Listed sources remain sparse without invented intelligence", () => {
  const document = createPublicSourceRepresentation(listed);
  assert.equal(document.source.intelligence, null);
  assert.deepEqual(document.source.capabilities, []);
  assert.deepEqual(document.source.evidence, []);
  assert.match(
    serializePublicSourceMarkdown(document),
    /### Capabilities\n\nNone recorded/u,
  );
});

test("Playbook representations preserve staged guidance and editorial order", () => {
  const collection = {
    id: "collection-one",
    slug: "collection-one",
    title: "Playbook One",
    description: "A reviewed research path.",
    outcome: "A defensible decision.",
    audience: "Product teams.",
    status: "published",
    lastReviewedAt: "2026-08-01",
    resourceIds: ["source-two", "source-one"],
    stages: [
      {
        id: "compare",
        title: "Compare",
        inspect: "Inspect the available evidence.",
        decision: "Choose the direction to prototype.",
        resources: [
          { resource: { id: "source-two" }, role: "Establish the baseline." },
          { resource: { id: "source-one" }, role: "Test the richer option." },
        ],
      },
    ],
  };
  const document = createPublicCollectionRepresentation(collection, [
    profiled,
    listed,
  ]);
  assert.equal(document.contract, "tessli.public-playbook.v2");
  assert.equal(document.playbook.outcome, "A defensible decision.");
  assert.equal(document.playbook.stageCount, 1);
  assert.equal(
    document.stages[0].decision,
    "Choose the direction to prototype.",
  );
  assert.deepEqual(
    document.resources.map((resource) => resource.id),
    ["source-two", "source-one"],
  );
  assert.deepEqual(
    document.resources.map((resource) => resource.role),
    ["Establish the baseline.", "Test the richer option."],
  );
  assert.equal(document.resources[0].order, 1);
  assert.equal(document.resources[1].order, 2);
  assert.equal(document.resources[0].intelligence, undefined);
  const md = serializePublicCollectionMarkdown(document);
  assert.match(md, /# Tessli Playbook — Playbook One/u);
  assert.match(md, /## Stages/u);
  assert.match(md, /Why included:\*\* Establish the baseline/u);
  assert.ok(md.indexOf("1. Source Two") < md.indexOf("2. Source One"));
  assert.doesNotMatch(md, /[ \t]+$/gmu);
});

test("public headers are readable, cacheable, indexable, and safe", () => {
  const headers = createPublicRepresentationHeaders({
    format: "json",
    filename: "tessli-source.json",
    canonicalPath: "/resources/source-one",
    jsonPath: "/resources/source-one/profile.json",
    markdownPath: "/resources/source-one/profile.md",
  });
  assert.equal(headers["Content-Type"], "application/json; charset=utf-8");
  assert.equal(headers["Access-Control-Allow-Origin"], "*");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["X-Robots-Tag"], "index, follow");
  assert.match(headers["Cache-Control"], /s-maxage=86400/u);
  assert.match(headers.Link, /rel="canonical"/u);
  const options = createPublicOptionsHeaders();
  assert.equal(options.Allow, "GET, HEAD, OPTIONS");
});

test("runtime routes are static, canonical-data only, and privacy bounded", async () => {
  const sourceRoute = await readFile(
    new URL(
      "../app/resources/[slug]/[representation]/route.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const collectionRoute = await readFile(
    new URL(
      "../app/collections/[slug]/[representation]/route.ts",
      import.meta.url,
    ),
    "utf8",
  );
  for (const route of [sourceRoute, collectionRoute]) {
    assert.match(route, /dynamicParams = false/u);
    assert.match(route, /generateStaticParams/u);
    assert.doesNotMatch(
      route,
      /localStorage|cookies\(|process\.env|fetch\(|ProjectBoard/u,
    );
  }
  assert.match(sourceRoute, /getSourceProfile/u);
  assert.match(collectionRoute, /getPublishedCollection/u);
});

test("formatter has no clock, network, storage, cookie, or environment dependency", async () => {
  const source = await readFile(
    new URL("../lib/public-representations.mjs", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    source,
    /Date\.now\(|new Date\(|fetch\(|XMLHttpRequest|localStorage|cookies\(|process\.env/u,
  );
});
