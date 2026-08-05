export const TESSLI_MCP_SERVER_NAME = "tessli-native-metadata" as const;
export const TESSLI_MCP_SERVER_VERSION = "0.1.0" as const;
export const TESSLI_MCP_NODE_REQUIREMENT = "Node.js 22 or newer" as const;

export const TESSLI_MCP_TOOL_CATALOGUE = [
  {
    name: "search_resources",
    title: "Search Tessli resources",
    description:
      "Search committed Tessli catalogue and intelligence-profile metadata. Results preserve catalogue order and are capped at 25. No external search or live verification occurs.",
    inputs:
      "Optional query, category, access, capability, framework, integration, and workflow-fit filters.",
    returns:
      "A bounded ordered result set with source identity, access, coverage signals, and recorded capability metadata.",
    limit: "1–25 results",
  },
  {
    name: "get_resource_profile",
    title: "Get Tessli resource profile",
    description:
      "Resolve one exact Tessli resource ID or slug and return its catalogue metadata plus the repository intelligence profile when available.",
    inputs: "One exact stable source ID or slug.",
    returns:
      "Canonical source identity, coverage state, recorded intelligence, and an interpretation boundary.",
    limit: "1 source",
  },
  {
    name: "compare_resources",
    title: "Compare Tessli resources",
    description:
      "Compare two to five unique Tessli resources in caller-supplied order using native capability, workflow, limitation, governance, and verification metadata.",
    inputs: "Two to five exact stable source IDs or slugs.",
    returns:
      "An ordered comparison of recorded capabilities, formats, interfaces, governance, limitations, and evidence counts.",
    limit: "2–5 sources",
  },
  {
    name: "get_collection",
    title: "Get Tessli Playbook",
    description:
      "Resolve one published Tessli Playbook by exact stable ID or slug and return its ordered native source list.",
    inputs: "One exact published Playbook ID or slug.",
    returns:
      "Playbook identity, review state, source count, and the preserved editorial source order.",
    limit: "1 Playbook",
  },
  {
    name: "build_research_plan",
    title: "Build Tessli research plan",
    description:
      "Build a deterministic source-review and originality plan from one to ten exact Tessli resources. No external model or provider is called.",
    inputs:
      "A task name, one to ten exact source IDs or slugs, and an optional deterministic date.",
    returns:
      "Constraint, source-review, synthesis, and verification steps for an original implementation workflow.",
    limit: "1–10 sources",
  },
  {
    name: "create_reference_packet",
    title: "Create Tessli reference packet",
    description:
      "Create the deterministic Markdown handoff from Tessli's existing reference-packet builder for one to ten exact resources.",
    inputs:
      "A task name, one to ten exact source IDs or slugs, and an optional deterministic date.",
    returns:
      "A compact Markdown packet with ordered references, recorded intelligence, limitations, and implementation reminders.",
    limit: "1–10 sources",
  },
  {
    name: "verify_resource",
    title: "Report Tessli verification state",
    description:
      "Return only repository-recorded catalogue/profile status, evidence, dates, and limitations for one resource. This tool performs no live request or current-provider verification.",
    inputs: "One exact stable source ID or slug.",
    returns:
      "Repository provenance, recorded evidence, profile dates, limitations, and an explicit no-live-check warning.",
    limit: "1 source",
  },
] as const;

export type TessliMcpToolMetadata =
  (typeof TESSLI_MCP_TOOL_CATALOGUE)[number];
export type TessliMcpToolName = TessliMcpToolMetadata["name"];

export const TESSLI_MCP_TOOL_NAMES = Object.freeze(
  TESSLI_MCP_TOOL_CATALOGUE.map((tool) => tool.name),
) as readonly TessliMcpToolName[];

export function getTessliMcpToolMetadata(
  name: TessliMcpToolName,
): TessliMcpToolMetadata {
  const metadata = TESSLI_MCP_TOOL_CATALOGUE.find(
    (candidate) => candidate.name === name,
  );

  if (!metadata) {
    throw new Error(`Missing Tessli MCP tool metadata for ${name}.`);
  }

  return metadata;
}
