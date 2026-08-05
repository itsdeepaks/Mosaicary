import { pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod/v4";
import {
  TESSLI_MCP_SERVER_NAME,
  TESSLI_MCP_SERVER_VERSION,
  TESSLI_MCP_TOOL_NAMES,
  getTessliMcpToolMetadata,
} from "../lib/mcp-tool-catalogue.ts";
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

export { TESSLI_MCP_TOOL_NAMES };

const searchResourcesTool = getTessliMcpToolMetadata("search_resources");
const resourceProfileTool = getTessliMcpToolMetadata("get_resource_profile");
const compareResourcesTool = getTessliMcpToolMetadata("compare_resources");
const collectionTool = getTessliMcpToolMetadata("get_collection");
const researchPlanTool = getTessliMcpToolMetadata("build_research_plan");
const referencePacketTool = getTessliMcpToolMetadata(
  "create_reference_packet",
);
const verificationTool = getTessliMcpToolMetadata("verify_resource");

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
      name: TESSLI_MCP_SERVER_NAME,
      version: TESSLI_MCP_SERVER_VERSION,
    },
    {
      instructions:
        "Use Tessli to select and compare design resources, inspect repository-recorded evidence, and create original research handoffs. This server is read-only and repository-backed. It performs no live website verification, provider call, screenshot retrieval, project-code ingestion, account access, or write operation.",
    },
  );

  server.registerTool(
    searchResourcesTool.name,
    {
      title: searchResourcesTool.title,
      description: searchResourcesTool.description,
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
    resourceProfileTool.name,
    {
      title: resourceProfileTool.title,
      description: resourceProfileTool.description,
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
    compareResourcesTool.name,
    {
      title: compareResourcesTool.title,
      description: compareResourcesTool.description,
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
    collectionTool.name,
    {
      title: collectionTool.title,
      description: collectionTool.description,
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
    researchPlanTool.name,
    {
      title: researchPlanTool.title,
      description: researchPlanTool.description,
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
    referencePacketTool.name,
    {
      title: referencePacketTool.title,
      description: referencePacketTool.description,
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
    verificationTool.name,
    {
      title: verificationTool.title,
      description: verificationTool.description,
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
