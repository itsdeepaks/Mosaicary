import { pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod/v4";
import {
  NATIVE_ACCESS_VALUES,
  NATIVE_CATEGORY_IDS,
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

export const TESSLI_MCP_TOOL_NAMES = Object.freeze([
  "search_resources",
  "get_resource_profile",
  "compare_resources",
  "get_collection",
  "build_research_plan",
  "create_reference_packet",
  "verify_resource",
] as const);

const readOnlyAnnotations = Object.freeze({
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
});

const identifierSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .describe("Exact Tessli resource or collection stable ID or slug.");

const taskNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .describe("Short name for the target design or implementation task.");

const generatedAtSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u)
  .optional()
  .describe("Optional deterministic YYYY-MM-DD packet date.");

const filterListSchema = z
  .array(z.string().trim().min(1).max(100))
  .max(10)
  .optional();

const structuredOutputSchema = {
  result: z.record(z.string(), z.unknown()),
};

function toSuccessResult(result: object) {
  const structuredResult = { ...result };
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(structuredResult, null, 2),
      },
    ],
    structuredContent: { result: structuredResult },
  };
}

function toErrorResult(error: unknown) {
  const isInputError = error instanceof NativeMcpInputError;
  const message = isInputError
    ? error.message
    : "The Tessli native metadata tool failed safely.";

  if (!isInputError) {
    console.error(
      "[tessli-mcp] Native tool failure:",
      error instanceof Error ? error.message : "unknown error",
    );
  }

  const structuredResult = {
    error: message,
    retryable: false,
  };

  return {
    isError: true,
    content: [{ type: "text" as const, text: message }],
    structuredContent: { result: structuredResult },
  };
}

export function createTessliMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: "tessli-native-metadata",
      version: "0.1.0",
    },
    {
      instructions:
        "Use Tessli to select and compare design resources, inspect repository-recorded evidence, and create original research handoffs. This server is read-only and repository-backed. It performs no live website verification, provider call, screenshot retrieval, project-code ingestion, account access, or write operation.",
    },
  );

  server.registerTool(
    "search_resources",
    {
      title: "Search Tessli resources",
      description:
        "Search committed Tessli catalogue and intelligence-profile metadata. Results preserve catalogue order and are capped at 25. No external search or live verification occurs.",
      inputSchema: {
        query: z.string().trim().max(200).optional(),
        category: z
          .string()
          .trim()
          .refine(
            (value) => NATIVE_CATEGORY_IDS.includes(value),
            "Unknown Tessli category.",
          )
          .optional(),
        access: z
          .string()
          .trim()
          .refine(
            (value) => NATIVE_ACCESS_VALUES.includes(value),
            "Unknown Tessli access value.",
          )
          .optional(),
        capabilities: filterListSchema,
        frameworks: filterListSchema,
        integrationMethods: filterListSchema,
        workflowFit: filterListSchema,
        limit: z
          .number()
          .int()
          .min(1)
          .max(NATIVE_MCP_LIMITS.searchResults)
          .default(10),
      },
      outputSchema: structuredOutputSchema,
      annotations: readOnlyAnnotations,
    },
    async (input) => {
      try {
        return toSuccessResult(searchNativeResources(input));
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "get_resource_profile",
    {
      title: "Get Tessli resource profile",
      description:
        "Resolve one exact Tessli resource ID or slug and return its catalogue metadata plus the repository intelligence profile when available.",
      inputSchema: { identifier: identifierSchema },
      outputSchema: structuredOutputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ identifier }) => {
      try {
        return toSuccessResult(getNativeResourceProfile(identifier));
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "compare_resources",
    {
      title: "Compare Tessli resources",
      description:
        "Compare two to five unique Tessli resources in caller-supplied order using native capability, workflow, limitation, governance, and verification metadata.",
      inputSchema: {
        identifiers: z
          .array(identifierSchema)
          .min(2)
          .max(NATIVE_MCP_LIMITS.comparisonResources),
      },
      outputSchema: structuredOutputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ identifiers }) => {
      try {
        return toSuccessResult(compareNativeResources(identifiers));
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "get_collection",
    {
      title: "Get Tessli collection",
      description:
        "Resolve one published Tessli collection by exact stable ID or slug and return its ordered native resource list.",
      inputSchema: { identifier: identifierSchema },
      outputSchema: structuredOutputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ identifier }) => {
      try {
        return toSuccessResult(getNativeCollection(identifier));
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "build_research_plan",
    {
      title: "Build Tessli research plan",
      description:
        "Build a deterministic source-review and originality plan from one to ten exact Tessli resources. No external model or provider is called.",
      inputSchema: {
        taskName: taskNameSchema,
        identifiers: z
          .array(identifierSchema)
          .min(1)
          .max(NATIVE_MCP_LIMITS.researchResources),
        generatedAt: generatedAtSchema,
      },
      outputSchema: structuredOutputSchema,
      annotations: readOnlyAnnotations,
    },
    async (input) => {
      try {
        return toSuccessResult(buildNativeResearchPlan(input));
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "create_reference_packet",
    {
      title: "Create Tessli reference packet",
      description:
        "Create the deterministic Markdown handoff from Tessli's existing Slice 13.4 packet builder for one to ten exact resources.",
      inputSchema: {
        taskName: taskNameSchema,
        identifiers: z
          .array(identifierSchema)
          .min(1)
          .max(NATIVE_MCP_LIMITS.researchResources),
        generatedAt: generatedAtSchema,
      },
      outputSchema: structuredOutputSchema,
      annotations: readOnlyAnnotations,
    },
    async (input) => {
      try {
        return toSuccessResult(createNativeReferencePacket(input));
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "verify_resource",
    {
      title: "Report Tessli verification state",
      description:
        "Return only repository-recorded catalogue/profile status, evidence, dates, and limitations for one resource. This tool performs no live request or current-provider verification.",
      inputSchema: { identifier: identifierSchema },
      outputSchema: structuredOutputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ identifier }) => {
      try {
        return toSuccessResult(verifyNativeResource(identifier));
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  return server;
}

export async function runTessliMcpServer(): Promise<void> {
  const server = createTessliMcpServer();
  const transport = new StdioServerTransport();

  const shutdown = async () => {
    await server.close();
    process.exit(0);
  };

  process.once("SIGINT", () => {
    void shutdown();
  });
  process.once("SIGTERM", () => {
    void shutdown();
  });

  await server.connect(transport);
  console.error("Tessli native metadata MCP running on stdio.");
}

const isDirectExecution =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  void runTessliMcpServer().catch((error: unknown) => {
    console.error(
      "Tessli MCP failed to start:",
      error instanceof Error ? error.message : "unknown error",
    );
    process.exit(1);
  });
}
