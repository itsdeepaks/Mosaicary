# Tessli UI-Intelligence Roadmap

Status: **approved future track; not active by default**  
Recorded: **2026-07-31**  
Owner: Tessli repository  
Entry condition: complete the current account/community sequence, or explicitly reprioritize this track in a dedicated decision slice.

## 1. Decision

Tessli will preserve and develop a future UI-intelligence track, but it will not turn the current public product into a scraped screenshot gallery or interrupt the active Phase 2–3 delivery sequence without an explicit roadmap decision.

The future track should make Tessli useful to both people and coding agents by answering:

> Which design source should I use for this task, why is it suitable, what can I legally retrieve, and what should the agent extract before implementation?

The first implementation target is not visual generation. It is a structured, evidence-backed intelligence layer over curated design resources.

## 2. Why this exists

The Phase 1 catalogue is useful for discovering resources, but its current metadata primarily describes names, URLs, categories, access models, descriptions, tags, and broad use cases.

That is not enough for an agent to reliably distinguish:

- inspiration libraries from implementation libraries;
- full-page galleries from section-level references;
- public browsing from authenticated or paid access;
- websites from APIs, CLIs, plugins, and MCP servers;
- transient reference use from content that may be stored or redistributed;
- tools suited to landing pages from tools suited to product flows, dashboards, typography, motion, accessibility, or design systems.

Landingfolio is the first recorded case study because it combines human browsing, section-level reference retrieval, paid components/templates, learning content, free tools, submissions, and an official MCP endpoint.

## 3. Product position

Tessli should not compete on screenshot volume.

Tessli should become a source-selection and research-orchestration layer:

```text
Product brief
    ↓
Research intent
    ↓
Tessli capability profiles
    ↓
Recommended native and external sources
    ↓
Provider-safe retrieval
    ↓
Reference packet with provenance and constraints
    ↓
Original design contract
    ↓
Implementation and browser evaluation
```

### Human mode

- search resources by task, capability, framework, output, access, and integration;
- compare resources;
- build ordered research stacks;
- save private research workspaces;
- export source-backed handoffs.

### Agent mode

- search resource profiles;
- request a research plan;
- inspect limitations and rights;
- select an approved provider;
- produce a reference packet;
- retain provenance without redistributing restricted assets.

## 4. Non-goals

This track does not authorize Tessli to:

- scrape or mirror Landingfolio, Mobbin, Figma Community, paid libraries, or private workspaces;
- cache or redistribute third-party screenshots, source files, templates, or components without explicit rights;
- proxy paid/private providers through Tessli credentials;
- present external work as Tessli-owned content;
- infer licences from availability;
- promise that visual similarity is legally safe;
- replace human design review;
- generate UI before a project brief and source-selection step;
- add a marketplace before the intelligence workflow proves value;
- mix provider experiments into account, auth, or community slices.

## 5. Architecture

```text
Repository catalogue
    └── stable public resource identity

Resource intelligence profiles
    ├── capabilities
    ├── content objects
    ├── supported tools/frameworks
    ├── discovery facets
    ├── agent interfaces
    ├── workflow fit
    ├── limitations
    ├── rights and persistence rules
    └── evidence and verification

Retrieval layer
    ├── native Tessli metadata
    ├── public-web research
    └── optional provider adapters using user-owned credentials

Outputs
    ├── resource comparison
    ├── research plan
    ├── reference packet
    ├── design-brief handoff
    └── agent implementation checklist
```

The public catalogue remains the identity layer. Intelligence profiles are a separate versioned data contract so the stable Phase 1 catalogue is not expanded prematurely.

## 6. Core data objects

### Resource intelligence profile

One profile per catalogue resource, containing:

- capabilities;
- content objects;
- platforms, frameworks, and design tools;
- delivery formats;
- integration methods;
- agent interfaces;
- available discovery facets;
- workflow fit;
- explicit limitations;
- governance and persistence restrictions;
- evidence-backed claims;
- verification date and status.

Schema: `schemas/resource-intelligence-profile.schema.json`.

### Provider adapter

An optional integration with an external source.

Every adapter must declare:

- provider identity and official endpoint;
- supported transport;
- authentication method;
- request and rate limits;
- returned data classes;
- whether data may be persisted;
- attribution requirements;
- error and degradation behaviour;
- credential handling;
- security review state.

### Reference packet

A project-scoped export containing:

- product brief and design task;
- selected source profiles;
- source URLs;
- observations written by Tessli/user/agent;
- provider restrictions;
- design constraints;
- originality and accessibility checklist;
- implementation handoff.

Restricted screenshots or source assets are not embedded unless the rights policy explicitly permits it.

## 7. Proposed Tessli MCP tools

The first MCP should expose Tessli's own structured knowledge, not act as a screenshot proxy.

```text
search_resources
get_resource_profile
compare_resources
get_collection
build_research_plan
create_reference_packet
verify_resource
```

A later provider tool may be added:

```text
search_external_provider
```

That tool must:

- use the requesting user's provider credentials;
- call the provider directly or through an approved non-caching adapter;
- return only provider-authorized fields;
- mark external output as transient by default;
- preserve provider and original-source attribution;
- never expose another user's token or results.

## 8. Delivery sequence

| ID | Slice | Status | Depends on |
|---|---|---|---|
| 13.0 | UI-intelligence roadmap, research, provider boundary, and schema | CURRENT DOCUMENTATION SLICE | current `main` |
| 13.1 | Capability-profile pilot for 20 high-value resources | DEFERRED | 13.0 |
| 13.2 | Profile validation, evidence freshness, and review tooling | DEFERRED | 13.1 |
| 13.3 | Resource detail intelligence UI and advanced filters | DEFERRED | 13.2, active product-track decision |
| 13.4 | Research stack builder and Markdown reference-packet export | DEFERRED | 13.2 |
| 13.5 | Read-only Tessli MCP over native metadata | DEFERRED | 13.2, 13.4 |
| 13.6 | Landingfolio official-MCP provider experiment | DEFERRED | 13.0, user-owned token |
| 13.7 | Provider adapter framework and security controls | DEFERRED | 13.5, successful provider experiment |
| 13.8 | Agent-assisted UI research evaluation harness | DEFERRED | 13.5–13.7 |

### 13.1 — Capability-profile pilot

Profile 20 resources chosen to cover:

- full-page inspiration;
- section inspiration;
- product-flow research;
- component libraries;
- design systems;
- typography;
- colour/accessibility;
- motion/3D;
- templates/assets;
- AI visual builders;
- MCP/API/CLI integrations.

Acceptance requires evidence for every non-obvious claim and an explicit unknown state rather than guessed metadata.

### 13.2 — Validation and freshness

Add:

- schema validation;
- duplicate and identity checks;
- evidence URL requirements;
- last-verified and needs-review states;
- stale-claim detection;
- provider-count and pricing claims treated as time-sensitive;
- review reports suitable for pull-request inspection.

### 13.3 — Intelligence UI

Add to resource detail and discovery:

- capability badges;
- supported framework/tool filters;
- integration indicators;
- output formats;
- rights and persistence notes;
- known limitations;
- evidence and last verification;
- workflow recommendations.

Do not expose provider credentials or restricted content.

### 13.4 — Research stack and export

Allow a user to select a design task and produce an ordered plan:

```text
1. establish product and audience constraints;
2. inspect structural references;
3. inspect implementation sources;
4. inspect typography/motion/accessibility sources;
5. record observations;
6. export an original design brief and Codex handoff.
```

### 13.5 — Native Tessli MCP

Start read-only and repository-backed. No provider adapters, account data, screenshot proxying, generation, or writes in the first MCP slice.

### 13.6 — Landingfolio provider experiment

Use only the official Landingfolio MCP with a user-owned token. Evaluate:

- setup reliability;
- query quality;
- category coverage;
- returned screenshot/source metadata;
- latency and rate limits;
- whether results improve an agent's research plan;
- whether outputs remain attributable and transient;
- failure behaviour when the provider is unavailable.

The experiment must not commit provider screenshots or tokens.

### 13.7 — Adapter framework

Only after an experiment proves value, define a reusable provider interface with:

- capability negotiation;
- credential isolation;
- transient-result defaults;
- provider-specific quotas;
- timeouts and circuit breaking;
- audit-safe request metadata;
- no project-code ingestion;
- explicit source attribution;
- revocation and deletion behaviour.

### 13.8 — Evaluation harness

Compare a baseline agent against Tessli-assisted research on the same brief.

Score:

- task fit;
- hierarchy;
- mobile usability;
- discoverability;
- density;
- coherence;
- repository consistency;
- component reuse;
- accessibility;
- restraint;
- regression risk;
- ship readiness.

Record the model, tools, prompt, sources, time, output, reviewer scores, and limitations.

## 9. Go/no-go gates

Do not build the public intelligence UI until:

- at least 20 profiles validate;
- reviewers can distinguish inspiration, implementation, learning, and agent sources;
- every profile has provenance and a verification state;
- rights/persistence rules are represented;
- the pilot demonstrates that structured profiles improve source selection.

Do not build a public MCP until:

- native tools have stable schemas;
- rate limiting and abuse controls are designed;
- no private/user-owned data is required for the first version;
- tool responses have deterministic source attribution;
- failure behaviour is documented.

Do not build provider adapters until:

- the provider offers an official API/MCP or gives written permission;
- credentials are user-owned or contractually authorized;
- persistence and redistribution rules are explicit;
- SSRF, secret handling, logging, and deletion are reviewed.

## 10. Success measures

Pilot measures:

- time to identify an appropriate source for a task;
- percentage of recommendations with valid evidence;
- stale or incorrect-claim rate;
- reviewer agreement on workflow fit;
- research-packet usefulness to Codex;
- reduction in irrelevant browsing;
- originality and source-attribution compliance.

Later product measures:

- research stacks created;
- reference packets exported;
- resource comparisons completed;
- agent tool success rate;
- provider failures handled without blocking the workflow;
- percentage of shipped UI work with recorded provenance and review.

Do not use fake popularity, unverified user counts, or vanity metrics.

## 11. Primary risks

### Becoming another gallery

Mitigation: optimize for source selection, capability metadata, research plans, and handoffs rather than screenshot volume.

### Rights and redistribution

Mitigation: persist metadata and original observations by default; treat third-party visual/source output as transient unless explicitly licensed.

### Metadata hallucination

Mitigation: require evidence, verification dates, explicit unknowns, and reviewable changes.

### Provider dependence

Mitigation: native Tessli metadata remains useful without any external provider; adapters degrade independently.

### Generic AI output

Mitigation: require a product brief, selected references, an originality checklist, and browser evaluation before approval.

### Roadmap distraction

Mitigation: this track remains deferred until the active product track finishes or a dedicated decision changes priority.

## 12. Pickup instructions

A future session starting this track must:

1. read current `main`;
2. read `PRD.md`, `build-slices.md`, `AGENTS.md`, and `design.md`;
3. read this roadmap;
4. read `docs/research/landingfolio-product-study-2026-07-31.md`;
5. read `docs/contracts/ui-intelligence-provider-boundary.md`;
6. read `schemas/resource-intelligence-profile.schema.json`;
7. read the relevant slice note;
8. confirm whether active product work is complete or explicitly reprioritized;
9. create a branch from current `main`;
10. implement only one approved slice through the repository slice loop.

## 13. Immediate next action

After this documentation slice merges, return to the currently approved product track. The next UI-intelligence implementation action is Slice 13.1 only when the entry condition is satisfied.
