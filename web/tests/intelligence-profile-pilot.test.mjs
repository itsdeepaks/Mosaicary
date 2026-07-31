import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "../..");
const webDir = path.join(rootDir, "web");
const profilesDir = path.join(webDir, "data/intelligence-profiles");
const schemaPath = path.join(
  rootDir,
  "schemas/resource-intelligence-profile.schema.json",
);
const cataloguePath = path.join(webDir, "data/catalogue.json");

async function readJson(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

function validateProfileContract(profile, schema, catalogueSlugs) {
  assert.equal(profile.profileVersion, 1, "profileVersion must be 1");
  assert.equal(
    typeof profile.resourceId,
    "string",
    "resourceId must be string",
  );
  assert.match(
    profile.resourceId,
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "resourceId must be valid slug",
  );
  assert.ok(
    catalogueSlugs.has(profile.resourceId),
    `resourceId "${profile.resourceId}" must exist in catalogue.json`,
  );

  assert.ok(
    ["draft", "verified", "needs-review", "archived"].includes(profile.status),
    "invalid status",
  );
  assert.match(
    profile.verifiedAt,
    /^\d{4}-\d{2}-\d{2}$/,
    "verifiedAt must be YYYY-MM-DD",
  );

  assert.ok(
    Array.isArray(profile.capabilities) && profile.capabilities.length > 0,
    "capabilities required",
  );
  assert.ok(
    Array.isArray(profile.contentObjects) && profile.contentObjects.length > 0,
    "contentObjects required",
  );
  assert.ok(Array.isArray(profile.platforms), "platforms required array");
  assert.ok(Array.isArray(profile.frameworks), "frameworks required array");
  assert.ok(Array.isArray(profile.designTools), "designTools required array");
  assert.ok(
    Array.isArray(profile.deliveryFormats),
    "deliveryFormats required array",
  );
  assert.ok(
    Array.isArray(profile.integrationMethods),
    "integrationMethods required array",
  );
  assert.ok(
    Array.isArray(profile.agentInterfaces),
    "agentInterfaces required array",
  );

  for (const agentIface of profile.agentInterfaces) {
    assert.ok(
      ["mcp", "api", "cli", "sdk", "plugin"].includes(agentIface.type),
      "invalid agentInterface type",
    );
    assert.ok(
      [
        "http",
        "sse",
        "stdio",
        "websocket",
        "local-process",
        "in-product",
      ].includes(agentIface.transport),
      "invalid transport",
    );
    assert.ok(
      [
        "none",
        "bearer-token",
        "api-key",
        "oauth",
        "session",
        "unknown",
      ].includes(agentIface.authentication),
      "invalid auth",
    );
    assert.ok(
      ["none", "user", "workspace", "tessli-organization", "unknown"].includes(
        agentIface.credentialOwner,
      ),
      "invalid credentialOwner",
    );
    assert.ok(
      Array.isArray(agentIface.dataReturned) &&
        agentIface.dataReturned.length > 0,
      "dataReturned required",
    );
    assert.ok(
      [
        "persistent",
        "metadata-only",
        "transient",
        "prohibited",
        "unknown",
      ].includes(agentIface.persistencePolicy),
      "invalid persistencePolicy",
    );
    assert.ok(
      ["documented", "tested", "unavailable", "unknown"].includes(
        agentIface.status,
      ),
      "invalid agentInterface status",
    );
  }

  assert.equal(typeof profile.discovery, "object", "discovery required object");
  assert.equal(
    typeof profile.discovery.textSearch,
    "boolean",
    "discovery.textSearch required boolean",
  );
  assert.ok(
    Array.isArray(profile.discovery.facets),
    "discovery.facets required array",
  );

  assert.ok(
    Array.isArray(profile.workflowFit) && profile.workflowFit.length > 0,
    "workflowFit required array",
  );
  assert.ok(Array.isArray(profile.limitations), "limitations required array");

  assert.equal(
    typeof profile.governance,
    "object",
    "governance required object",
  );
  assert.ok(
    [
      "persistent",
      "metadata-only",
      "transient",
      "prohibited",
      "unknown",
    ].includes(profile.governance.defaultPersistence),
  );
  assert.ok(
    ["allowed", "restricted", "prohibited", "unknown"].includes(
      profile.governance.assetRedistribution,
    ),
  );
  assert.ok(
    ["required", "recommended", "not-required", "unknown"].includes(
      profile.governance.sourceAttribution,
    ),
  );
  assert.equal(typeof profile.governance.userCredentialRequired, "boolean");
  assert.equal(typeof profile.governance.termsReviewRequired, "boolean");

  assert.ok(
    Array.isArray(profile.evidence) && profile.evidence.length > 0,
    "evidence required array",
  );
  for (const item of profile.evidence) {
    assert.equal(typeof item.claim, "string", "evidence claim must be string");
    assert.match(
      item.sourceUrl,
      /^https:\/\//,
      "evidence sourceUrl must be absolute https URL",
    );
    assert.ok(
      [
        "official-documentation",
        "official-product-page",
        "official-legal-page",
        "repository",
        "manual-test",
        "other",
      ].includes(item.sourceType),
    );
    assert.match(
      item.verifiedAt,
      /^\d{4}-\d{2}-\d{2}$/,
      "evidence verifiedAt must be YYYY-MM-DD",
    );
  }
}

test("Resource Intelligence Profile schema file exists and parses as valid JSON", async () => {
  const schema = await readJson(schemaPath);
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(
    schema.$id,
    "urn:tessli:schema:resource-intelligence-profile:v1",
  );
  assert.equal(schema.title, "Tessli Resource Intelligence Profile");
});

test("Pilot dataset contains exactly 20 profile JSON files", async () => {
  const files = await fs.readdir(profilesDir);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  assert.equal(
    jsonFiles.length,
    20,
    "Expected exactly 20 intelligence profile JSON files",
  );
});

test("Every profile JSON in the pilot dataset validates against schema contracts and catalogue links", async () => {
  const schema = await readJson(schemaPath);
  const catalogue = await readJson(cataloguePath);
  const catalogueSlugs = new Set(catalogue.resources.map((r) => r.slug));

  const files = await fs.readdir(profilesDir);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  for (const file of jsonFiles) {
    const profilePath = path.join(profilesDir, file);
    const profile = await readJson(profilePath);
    validateProfileContract(profile, schema, catalogueSlugs);
  }
});

test("Invalid profile structure fails contract validation", async () => {
  const schema = await readJson(schemaPath);
  const catalogue = await readJson(cataloguePath);
  const catalogueSlugs = new Set(catalogue.resources.map((r) => r.slug));

  const invalidProfile = {
    profileVersion: 1,
    resourceId: "non-existent-resource-xyz-123",
    status: "verified",
    verifiedAt: "2026-07-31",
  };

  assert.throws(() => {
    validateProfileContract(invalidProfile, schema, catalogueSlugs);
  });
});
