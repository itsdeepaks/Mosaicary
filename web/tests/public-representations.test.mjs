import assert from "node:assert/strict";
import { test } from "node:test";

import catalogue from "../data/catalogue.json" with { type: "json" };
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
  id: "source-one",
  slug: "source-one",
  name: "Source One",
  url: "https://example.com/source-one",
  domain: "example.com",
  summary: "A profiled source for testing.",
  category: "website-inspiration",
  sourceType: "gallery",
  accessModel: "free",
  bestFor: ["Landing page research"],
  capabilities: ["Curated examples"],
  contentObjects: ["Web pages"],
  platforms: ["Web"],
  frameworks: ["Framework agnostic"],
  integrationMethods: ["Visual research"],
  limitations: ["No implementation code"],
  profileLevel: "profiled",
  status: "active",
  verifiedAt: null,
  evidence: [
    {
      label: "Official website",
      url: "https://example.com/source-one",
      accessedAt: "2026-08-02",
      supports: ["Identity", "capability", "access model"],
    },
  ],
  tags: ["web", "landing"],
  usefulFor: ["Landing pages"],
};

const listed = {
  id: "source-two",
  slug: "source-two",
  name: "Source Two",
  url: "https://example.net/source-two",
  domain: "example.net",
  summary: "A listed source with no invented intelligence.",
  category: "typography",
  sourceType: "reference",
  accessModel: "freemium",
  bestFor: [],
  capabilities: [],
  contentObjects: [],
  platforms: [],
  frameworks: [],
  integrationMethods: [],
  limitations: [],
  profileLevel: "listed",
  status: "needs-review",
  verifiedAt: null,
  evidence: [],
  tags: ["type"],
  usefulFor: ["Typography"],
};

test("source representations are deterministic and preserve canonical order", () => {
  const document = createPublicSourceRepresentation(profiled);
  assert.equal(document.contract, PUBLIC_SOURCE_REPRESENTATION_CONTRACT);
  assert.equal(document.source.id, profiled.id);
  assert.equal(document.source.intelligence.profileLevel, "profiled");
  assert.equal(document.canonicalPath, "/resources/source-one");
  assert.equal(
    document.representations.markdown,
    "/resources/source-one/profile.md",
  );
  assert.equal(
    document.representations.json,
    "/resources/source-one/profile.json",
  );
  assert.equal(document.provenance.manifest, "/catalogue.manifest.json");
  assert.equal(document.provenance.generatedAt, catalogue.generatedAt);
  assert.equal(document.source.evidence[0].accessedAt, "2026-08-02");
  assert.equal(document.source.evidence[0].provider, undefined);
  assert.deepEqual(Object.keys(document), [
    "contract",
    "generatedAt",
    "canonicalPath",
    "representations",
    "provenance",
    "source",
  ]);
  assert.deepEqual(Object.keys(document.source), [
    "id",
    "slug",
    "name",
    "url",
    "domain",
    "summary",
    "category",
    "sourceType",
    "accessModel",
    "status",
    "intelligence",
    "bestFor",
    "capabilities",
    "contentObjects",
    "platforms",
    "frameworks",
    "integrationMethods",
    "limitations",
    "tags",
    "usefulFor",
    "evidence",
  ]);
  const first = serializePublicJson(document);
  const second = serializePublicJson(
    createPublicSourceRepresentation(profiled),
  );
  assert.equal(first, second);
  assert.equal(first.endsWith("\n"), true);
  assert.doesNotMatch(first, /[ \t]+$/gmu);
  const markdown = serializePublicSourceMarkdown(document);
  assert.equal(markdown.endsWith("\n"), true);
  assert.match(markdown, /# Tessli Source Profile — Source One/u);
  assert.match(markdown, /## Intelligence boundary/u);
  assert.match(markdown, /## Evidence/u);
  assert.ok(
    markdown.indexOf("## Best for") < markdown.indexOf("## Capabilities"),
  );
  assert.ok(
    markdown.indexOf("## Capabilities") < markdown.indexOf("## Evidence"),
  );
  assert.doesNotMatch(markdown, /[ \t]+$/gmu);
});

test("public source representations exclude local and operational fields", () => {
  const document = createPublicSourceRepresentation({
    ...profiled,
    previewImageUrl: "/previews/source-one.webp",
    faviconUrl: "https://example.com/favicon.ico",
    previewSource: "manual",
    file: "intelligence/source-one.yml",
    ownerNotes: "private",
  });
  const publicKeys = new Set(Object.keys(document.source));
  for (const forbiddenKey of [
    "previewImageUrl",
    "faviconUrl",
    "previewSource",
    "file",
    "ownerNotes",
    "contact",
    "credential",
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
  assert.equal(document.contract, PUBLIC_COLLECTION_REPRESENTATION_CONTRACT);
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
  assert.equal(options["Access-Control-Allow-Methods"], "GET, HEAD, OPTIONS");
});
