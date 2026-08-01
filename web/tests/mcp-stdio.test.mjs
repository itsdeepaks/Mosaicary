import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { TESSLI_MCP_TOOL_NAMES } from "../mcp/server.ts";

const webRoot = fileURLToPath(new URL("../", import.meta.url));
const serverPath = fileURLToPath(new URL("../mcp/server.ts", import.meta.url));

test("stdio MCP exposes the exact read-only native tool allowlist", async () => {
  const client = new Client(
    { name: "tessli-mcp-test-client", version: "1.0.0" },
    { capabilities: {} },
  );
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    cwd: webRoot,
    stderr: "pipe",
  });

  try {
    await client.connect(transport);
    const listed = await client.listTools();

    assert.deepEqual(
      listed.tools.map((tool) => tool.name),
      [...TESSLI_MCP_TOOL_NAMES],
    );
    assert.ok(
      listed.tools.every(
        (tool) =>
          tool.annotations?.readOnlyHint === true &&
          tool.annotations?.destructiveHint === false &&
          tool.annotations?.openWorldHint === false,
      ),
    );

    const searchResult = await client.callTool({
      name: "search_resources",
      arguments: { query: "landingfolio", limit: 3 },
    });

    assert.notEqual(searchResult.isError, true);
    assert.ok(searchResult.structuredContent);
    assert.equal(searchResult.structuredContent.result.total, 1);
    assert.equal(
      searchResult.structuredContent.result.resources[0].slug,
      "landingfolio",
    );
    assert.equal(
      searchResult.structuredContent.result.resources[0].profileAvailable,
      true,
    );

    const packetResult = await client.callTool({
      name: "create_reference_packet",
      arguments: {
        taskName: "MCP integration test",
        identifiers: ["landingfolio", "shadcn-ui"],
        generatedAt: "2026-08-01",
      },
    });

    assert.notEqual(packetResult.isError, true);
    assert.equal(packetResult.structuredContent.result.resourceCount, 2);
    assert.match(
      packetResult.structuredContent.result.markdown,
      /# Tessli Reference Packet — MCP integration test/,
    );

    const unknownResult = await client.callTool({
      name: "verify_resource",
      arguments: { identifier: "not-a-tessli-resource" },
    });
    assert.equal(unknownResult.isError, true);
    assert.match(unknownResult.content[0].text, /Unknown Tessli resource/);
  } finally {
    await client.close();
  }
});

test("MCP source preserves the local read-only security boundary", async () => {
  const [serverSource, toolSource] = await Promise.all([
    readFile(serverPath, "utf8"),
    readFile(new URL("../lib/mcp-native-tools.ts", import.meta.url), "utf8"),
  ]);
  const combined = `${serverSource}\n${toolSource}`;

  assert.match(serverSource, /StdioServerTransport/);
  assert.doesNotMatch(combined, /\bfetch\s*\(/);
  assert.doesNotMatch(combined, /from\s+["']node:https?["']/);
  assert.doesNotMatch(combined, /\.listen\s*\(/);
  assert.doesNotMatch(combined, /process\.env/);
  assert.doesNotMatch(combined, /console\.log/);
  assert.doesNotMatch(combined, /\bwriteFile\b/);
  assert.doesNotMatch(combined, /\breadFile\b/);
  assert.doesNotMatch(combined, /Landingfolio.*token/i);
});
