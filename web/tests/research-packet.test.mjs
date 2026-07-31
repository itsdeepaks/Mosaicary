import assert from "node:assert/strict";
import test from "node:test";
import {
  buildResearchStack,
  generateMarkdownReferencePacket,
} from "../lib/research-packet.ts";

test("buildResearchStack compiles ordered references and intelligence metadata", () => {
  const stack = buildResearchStack("SaaS Landing Page", [
    "landingfolio",
    "shadcn-ui",
    "v0",
  ]);

  assert.equal(stack.taskName, "SaaS Landing Page");
  assert.equal(stack.resources.length, 3);
  assert.equal(stack.resources[0].slug, "landingfolio");
  assert.equal(stack.resources[0].badge, "MCP Enabled");
  assert.ok(stack.resources[0].intelligenceProfile);
  assert.equal(stack.resources[1].slug, "shadcn-ui");
  assert.equal(stack.resources[2].slug, "v0");
  assert.equal(stack.resources[2].badge, "AI Builder");

  const deduplicated = buildResearchStack("Deduplicated", [
    "landingfolio",
    stack.resources[0].id,
    "not-a-resource",
  ]);
  assert.equal(deduplicated.resources.length, 1);
});

test("generateMarkdownReferencePacket produces formatted markdown handoff packet", () => {
  const stack = buildResearchStack(
    "UI Component Stack",
    ["landingfolio", "shadcn-ui"],
    { generatedAt: "2026-07-31" },
  );
  const markdown = generateMarkdownReferencePacket(stack);

  assert.match(markdown, /# Tessli Reference Packet — UI Component Stack/);
  assert.match(markdown, /Landingfolio/);
  assert.match(markdown, /\*\*Capability Badge:\*\* MCP Enabled/);
  assert.match(markdown, /\*\*Evidence:\*\*/);
  assert.match(markdown, /Interpretation boundary/);
  assert.match(markdown, /Agent Implementation Handoff Checklist/);

  assert.equal(markdown, generateMarkdownReferencePacket(stack));
});
