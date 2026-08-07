# Tessli Native MCP

Status: **current local MCP v1 implementation guide; V3.8 migration planned**

Tessli's current MCP server exposes only repository-managed catalogue and UI-intelligence metadata through a local stdio process. It is the only supported MCP transport today.

It does not connect to Landingfolio or another provider, retrieve screenshots, inspect a project repository, access Tessli accounts, or modify data.

## Requirements

- Node.js 22 or later;
- a local checkout of `itsdeepaks/tessli`;
- locked dependencies installed under `web/`.

## Install

From the repository root:

```bash
cd web
npm ci
```

## Run

```bash
cd web
npm run mcp
```

A stdio server waits for an MCP client on standard input and writes protocol messages to standard output. Operational messages use standard error only.

## Client configuration

Use an absolute path to the Tessli checkout. A generic stdio configuration is:

```json
{
  "mcpServers": {
    "tessli": {
      "command": "npm",
      "args": ["--prefix", "/absolute/path/to/tessli/web", "run", "mcp"]
    }
  }
}
```

Some clients use a top-level `servers` key or require an explicit `type: "stdio"`. Follow that client's current MCP configuration format while preserving the same local command and absolute path.

## Current v1 tools

### `search_resources`

Searches committed catalogue text and optional intelligence-profile fields. Results are deterministic and capped at 25.

Supported filters:

- category;
- access;
- capability;
- framework;
- integration method;
- workflow fit.

### `get_resource_profile`

Returns one catalogue resource and its repository intelligence profile when one exists.

### `compare_resources`

Compares two to five unique resources in caller-supplied order.

### `get_collection`

Returns one published repository collection and its ordered member resources.

### `build_research_plan`

Builds a deterministic plan from one to ten selected resources. It does not call an external model or provider.

### `create_reference_packet`

Returns the Markdown reference packet from Tessli's existing Slice 13.4 packet builder.

### `verify_resource`

Reports repository-recorded evidence and dates only. It never performs live website, pricing, terms, availability, or provider verification.

## Planned V3 local MCP

V3.8 follows V3.7 deterministic task retrieval. It will expose five focused capabilities:

- `find_sources`;
- `get_source`;
- `find_alternatives`;
- `get_collection`;
- `create_research_brief`.

The planned default task result is capped at eight explained choices, not the complete catalogue. It will include task fit, a recorded access route, a limitation, and differentiated alternatives; provenance, freshness, and governance remain optional diagnostics. Existing v1 names remain temporary compatibility aliases during migration. Do not infer a one-to-one alias mapping or the availability of the five names before V3.8.

`verify_resource` remains a diagnostic compatibility path, not a normal agent workflow. V3.2 must establish the canonical `AccessRoute` fields before MCP can expose them. MCP output routes agents to the canonical provider website, documentation, registry, source repository, API, MCP, CLI, or plugin; it does not inspect or use those providers itself.

## Remote MCP availability

Hosted Streamable HTTP MCP is not available. It is deferred to V3.16, after local task retrieval and compact static public representations/discovery (V3.9–V3.10) are stable. Any future hosted transport must wrap the same pure read-only layer, expose public data only, and add bounded inputs, origin validation, rate limits, safe logging, timeouts, and monitoring. It must never read browser-local Boards, write Tessli state, fetch providers, proxy paid/private content, or accept provider credentials.

## Data and retention

The process reads committed JSON modules already used by Tessli. It keeps no database, cache, log file, or user profile.

Tool calls are not persisted by Tessli. The invoking MCP client may have its own logging or retention policy.

## Security boundary

The server:

- has no HTTP listener;
- uses no environment credential;
- performs no network request;
- exposes no write tool;
- accepts no arbitrary path or URL to fetch;
- reads no project source or user file;
- returns no provider-rendered screenshot or source asset;
- caps all list-producing tools;
- labels repository classifications and non-live verification clearly.

It also keeps routine output compact: task fit, action, limitation, and alternatives come first; provenance and operational status are diagnostic depth on demand.

## Research boundary

Use results to choose sources and extract principles. Do not treat Tessli metadata or a provider reference as permission to copy layouts, illustrations, copy, brand assets, templates, or restricted code.

## Development verification

```bash
cd web
node --test tests/mcp-native-tools.test.mjs tests/mcp-stdio.test.mjs
npm run typecheck
npm run lint
npm test
npm run catalogue:check
npm run build
```
