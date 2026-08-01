import assert from "node:assert/strict";
import test from "node:test";
import {
  NATIVE_MCP_LIMITS,
  NativeMcpInputError,
  buildNativeResearchPlan,
  compareNativeResources,
  createNativeReferencePacket,
  getNativeCollection,
  getNativeResourceProfile,
  searchNativeResources,
  verifyNativeResource,
} from "../lib/mcp-native-tools.ts";

test("native search is deterministic, bounded, and profile aware", () => {
  const first = searchNativeResources({ query: "landingfolio", limit: 5 });
  const second = searchNativeResources({ query: "landingfolio", limit: 5 });

  assert.deepEqual(first, second);
  assert.equal(first.total, 1);
  assert.equal(first.returned, 1);
  assert.equal(first.resources[0].slug, "landingfolio");
  assert.equal(first.resources[0].profileAvailable, true);
  assert.equal(first.resources[0].intelligenceBadge, "MCP Enabled");

  const profileFiltered = searchNativeResources({
    capabilities: ["mcp-integration"],
    frameworks: ["react"],
    integrationMethods: ["mcp"],
    workflowFit: ["hero-research"],
    limit: 10,
  });

  assert.ok(
    profileFiltered.resources.some(
      (resource) => resource.slug === "landingfolio",
    ),
  );
  assert.ok(
    profileFiltered.resources.every(
      (resource) =>
        resource.capabilities.includes("mcp-integration") &&
        resource.frameworks.includes("react") &&
        resource.integrationMethods.includes("mcp") &&
        resource.workflowFit.includes("hero-research"),
    ),
  );

  const nativeFiltered = searchNativeResources({
    category: "website-inspiration",
    access: "free",
    limit: 3,
  });
  assert.equal(nativeFiltered.returned, 3);
  assert.ok(
    nativeFiltered.resources.every(
      (resource) =>
        resource.category === "website-inspiration" &&
        resource.access === "free",
    ),
  );

  assert.throws(
    () =>
      searchNativeResources({
        limit: NATIVE_MCP_LIMITS.searchResults + 1,
      }),
    NativeMcpInputError,
  );
});

test("resource profiles resolve by slug and stable catalogue ID", () => {
  const bySlug = getNativeResourceProfile("landingfolio");
  const byId = getNativeResourceProfile(bySlug.resource.id);

  assert.deepEqual(bySlug, byId);
  assert.equal(bySlug.resource.profileAvailable, true);
  assert.equal(bySlug.intelligenceProfile.status, "verified");
  assert.equal(bySlug.intelligenceProfile.verifiedAt, "2026-07-31");
  assert.ok(bySlug.intelligenceProfile.evidence.length > 0);

  const catalogueOnly = getNativeResourceProfile("designindex");
  assert.equal(catalogueOnly.resource.profileAvailable, false);
  assert.equal(catalogueOnly.intelligenceProfile, null);

  assert.throws(
    () => getNativeResourceProfile("not-a-tessli-resource"),
    NativeMcpInputError,
  );
});

test("comparison preserves caller order and de-duplicates stable resources", () => {
  const comparison = compareNativeResources([
    "landingfolio",
    "shadcn-ui",
    "landingfolio",
  ]);

  assert.equal(comparison.requested, 3);
  assert.equal(comparison.compared, 2);
  assert.deepEqual(
    comparison.resources.map((resource) => resource.slug),
    ["landingfolio", "shadcn-ui"],
  );
  assert.equal(comparison.resources[0].profileAvailable, true);
  assert.ok(comparison.resources[0].evidenceCount > 0);

  assert.throws(
    () => compareNativeResources(["landingfolio", "landingfolio"]),
    NativeMcpInputError,
  );
  assert.throws(
    () =>
      compareNativeResources([
        "landingfolio",
        "shadcn-ui",
        "v0",
        "typewolf",
        "coolors",
        "motion",
      ]),
    NativeMcpInputError,
  );
});

test("published collection lookup preserves reviewed member order", () => {
  const collection = getNativeCollection("saas-landing-pages");

  assert.equal(collection.slug, "saas-landing-pages");
  assert.equal(collection.status, "published");
  assert.equal(collection.resourceCount, 10);
  assert.deepEqual(
    collection.resources.map((resource) => resource.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );

  const byId = getNativeCollection(collection.id);
  assert.deepEqual(byId, collection);

  assert.throws(
    () => getNativeCollection("not-a-published-collection"),
    NativeMcpInputError,
  );
});

test("research plan is deterministic, bounded, and originality oriented", () => {
  const input = {
    taskName: "SaaS homepage",
    identifiers: ["landingfolio", "shadcn-ui", "landingfolio"],
    generatedAt: "2026-08-01",
  };
  const plan = buildNativeResearchPlan(input);

  assert.equal(plan.taskName, "SaaS homepage");
  assert.equal(plan.generatedAt, "2026-08-01");
  assert.equal(plan.resourceCount, 2);
  assert.deepEqual(
    plan.selectedResources.map((resource) => resource.slug),
    ["landingfolio", "shadcn-ui"],
  );
  assert.equal(plan.steps.length, plan.resourceCount + 3);
  assert.equal(plan.steps[0].phase, "constraints");
  assert.equal(plan.steps.at(-2).phase, "synthesis");
  assert.equal(plan.steps.at(-1).phase, "verification");
  assert.match(plan.steps.at(-2).action, /original design contract/i);
  assert.deepEqual(plan, buildNativeResearchPlan(input));

  assert.throws(
    () =>
      buildNativeResearchPlan({
        taskName: "Too many",
        identifiers: Array.from(
          { length: NATIVE_MCP_LIMITS.researchResources + 1 },
          (_, index) => (index % 2 === 0 ? "landingfolio" : "shadcn-ui"),
        ),
      }),
    NativeMcpInputError,
  );
});

test("reference packet reuses the deterministic Slice 13.4 export", () => {
  const packet = createNativeReferencePacket({
    taskName: "Component research",
    identifiers: ["landingfolio", "shadcn-ui"],
    generatedAt: "2026-08-01",
  });

  assert.equal(packet.resourceCount, 2);
  assert.equal(packet.generatedAt, "2026-08-01");
  assert.match(
    packet.markdown,
    /# Tessli Reference Packet — Component research/,
  );
  assert.match(packet.markdown, /Landingfolio/);
  assert.match(packet.markdown, /Agent Implementation Handoff Checklist/);
  assert.match(packet.markdown, /principles, not copied layouts/i);
});

test("verification reports repository evidence without a live check", () => {
  const verification = verifyNativeResource("landingfolio");

  assert.equal(verification.liveCheckPerformed, false);
  assert.equal(verification.verificationMode, "repository-recorded-only");
  assert.equal(verification.profileAvailable, true);
  assert.equal(verification.profileVerifiedAt, "2026-07-31");
  assert.ok(verification.evidence.length > 0);
  assert.match(verification.warning, /No live website/i);
  assert.equal(
    verification.catalogueSource.path,
    "lib_data/design-resource-library-295.csv",
  );

  const catalogueOnly = verifyNativeResource("designindex");
  assert.equal(catalogueOnly.liveCheckPerformed, false);
  assert.equal(catalogueOnly.profileAvailable, false);
  assert.deepEqual(catalogueOnly.evidence, []);
});
