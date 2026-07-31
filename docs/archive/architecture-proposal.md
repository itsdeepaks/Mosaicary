# Agent-native architecture proposal

## Architectural decision

Build this as a **Skill-led Codex plugin with a focused Source Hub MCP and an independent evaluation harness**. Do not begin with a Next.js application or hosted platform. The optional workbench consumes the same schemas and services later.

## System layers

```text
┌───────────────────────────────────────────────────────────────┐
│ Codex / compatible coding agent                              │
│  UI Planning Skill · UI Build Skill · UI Review Skill        │
└───────────────────────┬───────────────────────────────────────┘
                        │ routes by capability and source policy
          ┌─────────────┼──────────────────────┐
          │             │                      │
          ▼             ▼                      ▼
┌────────────────┐ ┌──────────────────┐ ┌─────────────────────┐
│ Repository     │ │ Direct MCPs      │ │ UI Source Hub MCP   │
│ code/tokens/   │ │ Figma, Storybook,│ │ patterns, open/user │
│ assets/tests   │ │ shadcn, Mobbin…  │ │ evidence, contracts │
└────────────────┘ └──────────────────┘ └──────────┬──────────┘
                                                   │
                                      ┌────────────▼───────────┐
                                      │ Source adapters/index  │
                                      │ open docs/registries/  │
                                      │ curated local content  │
                                      └────────────────────────┘

                         approved UI Contract
                                  │
                                  ▼
                  ┌────────────────────────────────┐
                  │ Implementation + browser review│
                  │ host browser MCP/CLI + axe     │
                  └───────────────┬────────────────┘
                                  ▼
                         Evaluation artifacts
```

## Why the Skill leads

The workflow—not the database—is the first hypothesis to test. Codex Skills provide progressive disclosure and can coordinate repository inspection, source selection, contract creation, implementation, and verification without keeping all instructions in every prompt.

Start with repo-local Skills in `.agents/skills/`. After their triggers, steps, outputs, and verification behavior are stable, package them with MCP configuration as a plugin. This follows the documented Codex extension path: local Skill for a developing workflow, MCP for external context, plugin for distribution.

## Proposed plugin structure

```text
plugins/ui-intelligence/
├── .codex-plugin/plugin.json
├── skills/
│   ├── ui-plan/SKILL.md
│   ├── ui-build/SKILL.md
│   ├── ui-review/SKILL.md
│   └── ui-curate/SKILL.md
├── references/
│   ├── source-policy.md
│   ├── ui-contract-guide.md
│   └── review-rubric.md
├── scripts/
│   ├── inspect-project-ui.*
│   ├── validate-ui-contract.*
│   └── summarize-review.*
├── .mcp.json
├── agents/openai.yaml
└── assets/
```

Do not create all four Skills immediately. Prototype `ui-plan` first, then `ui-review`; add `ui-build` only after the UI Contract is stable. `ui-curate` is maintainer-facing.

## Skill responsibilities

### `ui-plan`

- identify the target and intended user outcome;
- inspect repository UI truth;
- resolve available source capabilities;
- retrieve at most a bounded evidence set;
- compare patterns and surface conflicts;
- produce a schema-valid UI Contract;
- stop for approval when decisions materially change product direction.

### `ui-build`

- require an approved contract or explicit authority to plan-and-build;
- map decisions to existing components/tokens;
- implement the target without unrelated redesign;
- report conflicts with the contract;
- hand off to `ui-review`.

### `ui-review`

- open the actual target in a supported browser tool;
- inspect required routes, states, and viewports;
- collect deterministic evidence first;
- compare visible output with the contract/visual target;
- fix the largest actionable failure when authorized;
- emit a compact Review record.

### `ui-curate`

- classify sources and integration modes;
- validate provenance, rights, and freshness;
- author/review UI Patterns;
- reject unsupported or duplicative evidence.

## Direct MCP federation

The host agent is the federation layer. The Skill should inspect available capabilities and apply source priority. It should call provider MCP tools directly when they are installed and authorized.

Advantages over proxying through our server:

- provider OAuth and entitlements remain provider-owned;
- native tool schemas and capabilities stay current;
- paid/private results are not copied into our storage;
- attribution and source identity remain visible;
- failures can be isolated to one provider;
- users choose which MCPs they trust.

The Skill must degrade gracefully when a direct source is absent. It may use our open evidence, another authorized source, or clearly labeled model knowledge; it must not claim that a source was searched when it was unavailable.

## Source Hub MCP boundary

### Initial transport

Use a local TypeScript stdio server. Local stdio avoids hosting/auth complexity and works with Codex project configuration. Add Streamable HTTP only after multi-device or shared access is a demonstrated need.

### Initial tool surface

Keep the first server to five tools:

1. `discover_ui_sources` — returns capable sources/integration modes for a task, with availability and access notes.
2. `search_ui_evidence` — searches only permitted indexed evidence and reviewed patterns; returns compact ranked summaries.
3. `get_ui_evidence` — expands selected evidence/pattern IDs with provenance and rules.
4. `get_project_ui_context` — returns an approved compact context/rule view for a project.
5. `save_ui_artifact` — writes a user-approved context, contract, review, or rule with an explicit artifact type and version.

If mixed read/write approval behavior proves confusing, split `save_ui_artifact` into a later write-only server or local CLI. Do not add provider-specific wrapper tools.

### MCP resources

Expose stable read-only resources where client support is useful:

- `ui://sources/index`
- `ui://patterns/{id}`
- `ui://projects/{projectId}/context`
- `ui://contracts/{id}`
- `ui://schemas/{name}/{version}`

Tools should return useful structured content even when a client does not browse MCP resources.

### Server instructions

The initialization `instructions` must put the most important policy first:

> Prefer repository and approved project context. Use this server only for permitted evidence and project artifacts. Do not treat evidence as an approved design decision. Keep results bounded and preserve source attribution.

## Storage and schemas

### Repository content

Version these in Git:

- JSON Schemas;
- curated Source Descriptors;
- reviewed UI Patterns;
- evaluation tasks and rubrics;
- Skill instructions and scripts;
- seed importers and migrations.

### Local mutable content

Store these outside versioned plugin code by default:

- user-authorized references and screenshots;
- Project UI Context versions;
- UI Contracts, Reviews, and Rules;
- source credentials (in OS/client credential storage, never the database);
- evaluation run artifacts.

Use SQLite for local metadata and file paths, with plain JSON export for portability. SQLite is an implementation detail of the Source Hub, not the product center.

### Standard formats

- JSON Schema for validation and protocol contracts;
- DTCG JSON for token interchange where possible;
- Markdown/YAML for agent- and human-readable exports;
- PNG/WebP plus metadata for visual evidence;
- JSONL for evaluation results.

## Source adapter contract

An adapter that our system owns must implement:

```ts
interface SourceAdapter {
  describe(): SourceDescriptor;
  health(): Promise<SourceHealth>;
  search(query: EvidenceQuery): Promise<EvidenceSummary[]>;
  get(id: string): Promise<UiEvidence>;
}
```

It must also declare:

- authentication type;
- read/write capability;
- cost/access class;
- cache allowance and TTL;
- redistribution/thumbnail policy;
- rate policy;
- source version/freshness;
- data sent outside the machine;
- failure behavior.

The first adapters should be low-risk and structured:

1. curated local JSON pattern/evidence store;
2. shadcn-compatible registry metadata;
3. Open UI/WAI/DTCG documentation index with citations;
4. user-owned local files/screenshots.

Do not build unofficial adapters around paid websites.

## Project inspection

The Skill can inspect the repository directly, but a helper script should produce a compact deterministic inventory:

- framework and routes;
- theme/token sources;
- global styles and fonts;
- component directories and exports;
- Storybook configuration/stories;
- installed UI libraries;
- icon and asset sources;
- existing responsive breakpoints;
- test/browser commands;
- explicit repository guidance.

The script should return paths and summaries, not file dumps. It must ignore secrets, dependencies, generated output, and unrelated backends.

## Retrieval and ranking

1. Resolve the design question and required evidence type.
2. Filter Sources by availability, capability, rights, cost, platform, and user preference.
3. Query no more than two or three sources initially.
4. Apply project compatibility filters: framework, components, tokens, density, brand, accessibility, and content.
5. Return three primary candidates plus at most one counterexample.
6. Explain relevance, conflict, evidence strength, and source.
7. Expand only selected evidence.

Use tags, filters, and full-text search first. Add embeddings only after evaluation shows retrieval misses that structured search cannot resolve. Image embeddings belong behind the same ranking and rights policy.

## UI Contract pipeline

```text
raw brief + repo inventory + project context
                ↓
missing questions and assumptions
                ↓
bounded evidence retrieval
                ↓
pattern comparison and compatibility checks
                ↓
draft UI Contract (schema-valid)
                ↓
human approval/revision
                ↓
versioned Markdown/YAML export
```

LLM output must pass schema validation. The system should preserve the raw source IDs and context version used to build each contract.

## Verification architecture

Do not duplicate mature browser MCPs. The `ui-review` Skill chooses an available host browser capability—Codex in-app browser, Playwright MCP, Chrome DevTools MCP, or a configured CLI—and follows a common evidence contract.

Deterministic checks:

- route/load success;
- required visible landmarks and text;
- required interaction/state transitions;
- console and failed-network errors;
- horizontal/vertical overflow anomalies;
- focus order and keyboard reachability;
- axe-core accessibility findings;
- viewport and screenshot metadata;
- component/test results when Storybook is available.

Visual judgment checks:

- hierarchy and scan order;
- consistency with tokens and components;
- content fit and density;
- balance, rhythm, typography, and responsive adaptation;
- fidelity to an approved visual target;
- visible anti-patterns named in the contract.

Visual judgment must cite screenshots/regions and must not be collapsed into one score.

## Optional hooks

Do not ship mandatory hooks initially. After the manual workflow is proven, test an opt-in `Stop` hook that detects changed frontend files and reminds the agent to run `ui-review` when no review artifact exists. Hooks should not launch browsers or modify code silently.

## MCP Apps and workbench UI

MCP Apps can later render evidence comparison, contract approval, or review findings inline where the host supports it. Because client support varies, treat this as progressive enhancement.

The local workbench may eventually provide:

- source capability administration;
- evidence/pattern curation;
- side-by-side reference comparison;
- UI Contract editor and approval;
- review screenshot/finding explorer;
- evaluation dashboards.

The current `index.html` can inform the source-catalog view. Do not invest in its visual redesign before the Skill + evaluation loop succeeds.

## Security and trust

- Default Source Hub tools to read-only annotations and least privilege.
- Require explicit approval for writes, downloads, code installation, captures, or external model calls.
- Keep vendor OAuth tokens in the vendor/client auth flow.
- Never log secrets, authorization headers, or private file contents.
- Pin or review executable adapters and registry packages; metadata retrieval does not imply code installation trust.
- Sanitize Markdown/HTML and validate URLs/protocols.
- Restrict repository paths and browser targets to explicit roots/hosts.
- Record what source data was sent to which external provider.
- Preserve attribution and respect cache/redistribution rules.

## Token and tool budget

- Skill discovery metadata: concise and highly specific.
- Project UI Context: target 600–1,200 tokens.
- UI Contract: target 800–1,500 tokens.
- Evidence search: three summaries by default, under 250 tokens each.
- Full evidence: fetched only by selected ID.
- Review repair: failed criteria and relevant crops only.
- Source Hub: five tools initially; no provider wrapper explosion.
- Large outputs: write artifacts to files/resources and return a compact index.

## Technology recommendations

- TypeScript monorepo only when the MCP server and shared schema package begin; do not scaffold it for the Skill-only experiment.
- MCP TypeScript SDK for the local server.
- JSON Schema + TypeBox or Zod-to-JSON-Schema for runtime validation, choosing one canonical schema source.
- SQLite with a straightforward migration layer for local metadata.
- Vitest for schemas/ranking/services.
- Playwright fixtures for the evaluation harness.
- axe-core for deterministic accessibility checks.
- No Next.js dependency unless the optional workbench is approved.

## Architectural stop conditions

Do not add a Source Hub service until the Skill-only experiment shows that repeated context/evidence needs justify it. Do not add embeddings until tagged retrieval misses are measured. Do not add remote hosting until local multi-project use is proven. Do not add MCP Apps until structured tool results are stable. Do not add public distribution until the benchmark and source rights policy are credible.
