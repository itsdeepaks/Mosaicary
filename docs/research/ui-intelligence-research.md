# UI Intelligence for Coding Agents — research synthesis

**Researched:** 22 July 2026  
**Scope:** Codex-first UI design and frontend-quality infrastructure; public evidence only  
**Time horizon:** A private working system in weeks, a portable plugin/MCP ecosystem over 3–12 months

## Executive read

The market does not need another visual bookmark dashboard. It is splitting into specialized agent-accessible layers: products such as Mobbin, Refero, and Nicelydone expose real-product references; Figma exposes existing design structure; 21st.dev, shadcn, and Storybook expose components and implementation details; Playwright and Chrome DevTools expose the rendered browser. Each layer is useful, but the coding agent still has to decide which source to consult, translate evidence into project-specific choices, respect the repository's actual components and tokens, and verify the result.

That orchestration gap is the project. The strongest product is a **Codex UI Intelligence plugin** backed by a small source-aware MCP server and evaluation harness. The plugin defines the workflow; direct vendor MCPs remain direct; our MCP owns normalized open/user-curated evidence, pattern knowledge, project UI memory, and source discovery. An optional local studio can later curate data and inspect reviews, but it is not the primary product and should not dictate the architecture.

The defensible assets are not scraped screenshots. They are the source capability map, structured UI-pattern graph, project-to-pattern reasoning, reusable UI contracts, verification criteria, and a benchmark proving that the system improves accepted frontend outcomes without increasing token cost excessively.

## Research scope and method

The scan covered:

- current Codex extension surfaces: `AGENTS.md`, Skills, plugins, MCP, hooks, and browser tooling;
- design-reference MCPs and APIs;
- component registries and design-system MCPs;
- Figma-to-code context;
- browser, accessibility, and visual verification tooling;
- public developer discussions about generic agent-generated UI and workflow friction;
- recent UI-to-code and agent-verification research.

Public product pages and official documentation were treated as stronger evidence than forum anecdotes. Forum evidence is used to identify pain and workflow behavior, not to estimate market size.

No internal support, sales, or usage data was available. Pricing and beta availability can change and must be rechecked before integration work.

## What exists now

### 1. Real-product reference sources

| Source | Agent capability | Access signal | What it solves | What remains unsolved |
|---|---|---|---|---|
| Mobbin | Remote MCP and API over a very large screen/flow corpus | MCP requires a paid plan; API is higher-tier | Shipped-product examples and pattern comparison | Project fit, repository mapping, implementation, verification |
| Refero | MCP over curated real products and flows | Refero Pro required | Research/inspiration inside the coding workflow | Same translation and verification gap |
| Nicelydone | MCP over SaaS screens and flows | Commercial product | SaaS-specific reference retrieval | Broader product types and project-specific decisions |
| Public galleries | Usually browser/document access only | Mixed free/freemium | Visual discovery and unusual directions | Weak schemas, inconsistent metadata, fragile retrieval |

Mobbin explicitly positions MCP as design reference for agents and advertises more than 600,000 shipped screens. Its docs distinguish MCP for agent use from the REST API for custom integrations. Refero and Nicelydone now compete in the same reference layer. This validates demand, but it also means rebuilding a screenshot corpus is neither necessary nor strategically attractive. Sources: [Mobbin MCP](https://mobbin.com/mcp), [Mobbin developer overview](https://docs.mobbin.com/), [Refero MCP](https://doc.refero.design/mcp/getting-started), [Nicelydone MCP](https://nicelydone.club/mcp).

### 2. Design-file and design-system context

Figma MCP can extract frames, variables, components, and layout context and can write native Figma content. Code Connect adds real import paths, property mappings, snippets, and instructions from the codebase. This is the strongest bridge when an approved Figma design already exists, but it does not choose an appropriate design when the input is only a product brief. Figma also describes MCP access as beta and recommends its remote server for the broadest capability. Sources: [Figma MCP introduction](https://developers.figma.com/docs/figma-mcp-server/), [Code Connect integration](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/).

Storybook's MCP server exposes documented project components, stories, and testing workflows so agents can reuse actual component APIs instead of hallucinating them. This makes Storybook a preferred project-truth source, not another inspiration provider. Sources: [Storybook AI overview](https://storybook.js.org/docs/ai), [Storybook MCP](https://storybook.js.org/docs/ai/mcp/overview).

### 3. Component and implementation sources

21st.dev offers semantic component search, installation, generation, publishing, and team libraries through its CLI/MCP workflow. Search is free while some installation/generation capability is limited or paid. The shadcn MCP server can browse, search, and install items across any compatible public or private registry. This creates an open interoperability path: one schema can feed documentation, CLI installation, and agent retrieval without a proprietary component API. Sources: [21st MCP](https://21st.dev/mcp), [shadcn MCP](https://ui.shadcn.com/docs/mcp), [shadcn registry MCP support](https://ui.shadcn.com/docs/registry/mcp).

The important distinction is that components answer “what can I implement?” They do not answer “what should this product do, in this state, for this user?”

### 4. Standards and reusable public knowledge

Open UI researches component anatomy, states, behavior, naming, and prior art across design systems. WAI-ARIA Authoring Practices and accessibility specifications provide interaction and semantic requirements. The Design Tokens Community Group released its first stable token format (`2025.10`), giving the project a vendor-neutral interchange format for visual tokens. Sources: [Open UI](https://open-ui.org/), [Open UI research process](https://open-ui.org/get-involved/), [DTCG](https://www.designtokens.org/), [DTCG status](https://www.designtokens.org/faq/).

These sources are more valuable as structured rule/evidence inputs than as screenshots.

### 5. Rendered verification

Playwright MCP provides structured browser interaction through accessibility snapshots. Chrome DevTools MCP adds network, console, debugging, trace, and performance evidence. axe-core provides deterministic automated checks across WCAG rule sets. These tools already solve much of the browser instrumentation problem; our project should orchestrate them against a UI contract instead of replacing them. Sources: [Playwright MCP](https://playwright.dev/mcp/introduction), [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp), [axe-core](https://github.com/dequelabs/axe-core).

Recent benchmarks also treat browser execution and verification as necessary. Vision2Web evaluates static reproduction through long-horizon interactive apps and opens generated websites to check key actions; VISTA varies structural and visual context and manually annotates interactive elements and visual anchors. Sources: [Vision2Web](https://openreview.net/forum?id=lJpXXwhRRF), [VISTA](https://arxiv.org/abs/2605.26144).

## Current Codex opportunity

Codex already has the right extension primitives:

- `AGENTS.md` for durable repository guidance;
- Skills for progressive-disclosure workflows;
- plugins to distribute Skills, MCP configuration, hooks, and assets together;
- MCP for external tools, resources, and prompts;
- project-scoped MCP configuration in trusted repositories;
- hooks for optional lifecycle enforcement;
- browser tooling for live verification.

OpenAI's Codex guidance recommends starting with a local Skill for one workflow, combining Skills with MCP when external context is required, and packaging a stable workflow as a plugin for distribution. Skills are progressively disclosed, which is important because large permanent context hurts agent focus. Sources: [Build skills](https://learn.chatgpt.com/docs/build-skills), [Build plugins](https://learn.chatgpt.com/docs/build-plugins), [Model Context Protocol in Codex](https://learn.chatgpt.com/docs/extend/mcp), [Codex best practices](https://learn.chatgpt.com/docs/codex/best-practices).

MCP Apps can add interactive comparison or approval UI in clients that support the extension, but host support varies. Therefore every core capability must remain useful through structured tool results; embedded UI is progressive enhancement, not a dependency. Sources: [MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview), [MCP Apps architecture](https://apps.extensions.modelcontextprotocol.io/api/documents/Overview.html).

## Ranked user problems

### 1. Generic output caused by missing project-specific design facts

**User goal:** Receive UI that belongs to this product, not a generic SaaS template.  
**Surface:** Initial planning and generation.  
**Break:** Agents fall back to familiar gradients, card grids, generic hierarchy, and invented design systems when the brief lacks explicit structure and references.  
**Evidence:** Current forum discussions repeatedly report that references and concrete design rules improve output, while long aesthetic prompts without project facts still produce the “AI look.” These are anecdotes, but the pattern is consistent across multiple communities.  
**Severity:** Critical.  
**Frequency signal:** High in public discussions.  
**Confidence:** High that the problem exists; medium on prevalence.  
**Product move:** Require a compact Project UI Context and target-specific UI Contract before open-ended frontend generation.

Forum sources: [current UI/UX strategy discussion](https://www.reddit.com/r/ClaudeAI/comments/1uzhfz7/ui_ux_design/), [project-specific context discussion](https://www.reddit.com/r/ClaudeAI/comments/1t24gan/few_months_of_frontenddesign_uiuxpromaxskill/).

### 2. Fragmented evidence across disconnected tools

**User goal:** Ask one design question without manually switching between galleries, Figma, component docs, the repository, and browser QA.  
**Surface:** Research-to-build workflow.  
**Break:** Each MCP is optimized for one source; users mentally translate between them. Paid reference tools, Figma, component registries, and browser MCPs do not share a project-specific decision model.  
**Evidence:** The product landscape itself demonstrates fragmentation; public users explicitly describe leaving the editor, searching a reference library, and translating results back into code.  
**Severity:** Critical.  
**Frequency signal:** Medium-high.  
**Confidence:** High.  
**Product move:** Build a Skill-led source router with a shared evidence schema and explicit source priority.

Forum source: [request for UI/UX pattern MCP access](https://www.reddit.com/r/ClaudeAI/comments/1r05jbt/does_a_mobbin_mcp_server_exist_or_any_mcp_for/).

### 3. References do not automatically map to the repository

**User goal:** Implement a suitable idea with existing tokens, components, content, and framework conventions.  
**Surface:** Translation from research/design to code.  
**Break:** Screenshots communicate appearance; component MCPs communicate APIs; neither alone connects intent, content hierarchy, responsive behavior, and repository constraints. Even Figma Code Connect provides mappings/snippets rather than guaranteed composition quality.  
**Severity:** Critical.  
**Frequency signal:** High where existing design systems are involved.  
**Confidence:** High.  
**Product move:** Produce traceable component mappings inside the UI Contract and prefer Storybook/local-repo truth over external component novelty.

### 4. Agents often stop before user-visible verification

**User goal:** Receive a UI that works and looks correct at actual viewport sizes and states.  
**Surface:** Handoff and repair.  
**Break:** Source-level checks do not reveal overflow, clipped content, weak hierarchy, missing states, console/network failures, or mismatches with the intended design.  
**Severity:** Critical.  
**Frequency signal:** High in practice and explicit in current research.  
**Confidence:** High.  
**Product move:** Make browser inspection and a criteria-based review loop part of the workflow, with deterministic checks before visual judgment.

### 5. Too many tools and too much context reduce agent focus

**User goal:** Improve design quality without spending more tokens than manual iteration.  
**Surface:** Tool discovery and repeated calls.  
**Break:** Every installed tool schema and large response competes for context; full corpora and long snapshots are especially wasteful.  
**Evidence:** Codex Skills use progressive disclosure and cap their initial metadata budget. Other agent documentation explicitly warns that large tool menus consume context and make selection harder.  
**Severity:** High.  
**Frequency signal:** Structural, not anecdotal.  
**Confidence:** High.  
**Product move:** Keep our MCP to a small read-oriented surface, use source capabilities to route before querying, and return summaries before details.

Supporting source: [GitHub tool search rationale](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/tool-search).

### 6. Access, rights, freshness, and trust differ by source

**User goal:** Use strong references without breaking terms, leaking private designs, or installing unsafe code.  
**Surface:** Source configuration and component installation.  
**Break:** Some sources are paid, some are public but not redistributable, some require OAuth, and third-party registries can install code/dependencies. Browser and design MCPs can expose sensitive content.  
**Severity:** High.  
**Frequency signal:** Medium but unavoidable.  
**Confidence:** High.  
**Product move:** Treat provenance, entitlement, rights, mutability, and trust as first-class source capabilities; default to read-only; never proxy paid content without licensed integration and user authorization.

MCP authorization guidance emphasizes short-lived tokens, HTTPS, least privilege, validation, and secret-safe logs. Source: [MCP authorization guidance](https://modelcontextprotocol.io/docs/tutorials/security/authorization).

### 7. Human taste and approvals are not durable

**User goal:** Stop repeating accepted/rejected visual decisions in every prompt.  
**Surface:** Cross-screen and cross-session work.  
**Break:** Generic memories or long prompts blur project rules, temporary choices, and evidence.  
**Severity:** Medium-high.  
**Frequency signal:** Medium.  
**Confidence:** High.  
**Product move:** Store compact, scoped UI Rules and decision provenance; never silently learn from unapproved output.

## Product conclusion

The project should become a **portable UI intelligence layer for coding agents** with three artifacts:

1. **Codex UI Intelligence Skill set** — the workflow and reasoning policy.
2. **UI Source Hub MCP** — normalized open/user-curated evidence, pattern knowledge, source capability discovery, project UI memory, and UI Contracts.
3. **UI Evaluation Harness** — repeatable tasks and browser-based evidence proving whether the first two improve results.

An optional **Workbench** may later manage sources, compare evidence, edit contracts, and inspect reviews. The existing resource dashboard is suitable seed material for that workbench, but the workbench is a control surface—not the product core.

## Source strategy

### Source priority for every UI task

```text
1. Explicit user direction and supplied visual target
2. Current repository: components, tokens, styles, content, routes, tests
3. Approved project UI context and rules
4. Direct connected source MCPs owned/authorized by the user
5. Our Source Hub: open standards, curated patterns, permitted references
6. Public browser research when allowed and necessary
7. Model prior knowledge only as a clearly labeled fallback
```

### Integration modes

Every source in the 295-resource catalog should eventually declare one or more modes:

- `native_mcp` — use the provider's MCP directly;
- `structured_registry` — query a documented registry such as shadcn;
- `public_api` — use an authorized API;
- `open_docs` — index permitted public documentation with source citations;
- `browser_reference` — inspect a public URL transiently, without mirroring it;
- `user_supplied` — private screenshot, Figma file, Storybook, or URL the user is entitled to use;
- `directory_only` — discovery metadata only;
- `blocked` — rights, access, or technical constraints prevent agent retrieval.

### What our MCP should own

- source descriptors and capability discovery;
- normalized open/public evidence with provenance;
- manually reviewed UI Pattern cards;
- project UI context and approved rules;
- UI Contracts and their version history;
- evidence links and observations;
- retrieval/ranking across data we are allowed to serve;
- compact exports.

### What our MCP should not own initially

- proxying Mobbin, Refero, Nicelydone, Figma, or another vendor's paid/private corpus;
- general web browsing;
- component installation when the native shadcn/21st/Storybook tool is available;
- browser automation when Playwright/Chrome tools are available;
- model-based code generation;
- authentication for many third-party providers;
- a screenshot warehouse.

The Skill should orchestrate direct MCPs in the host. This preserves vendor authorization, provenance, rate limits, and the full native capability. Our Source Hub fills the gaps and provides a shared decision schema.

## The complete UI-upgrade loop

```text
UNDERSTAND
Inspect the brief, target, repository, components, tokens, content, and constraints.

ROUTE
Determine which sources can answer the current design question.

RESEARCH
Retrieve a small evidence set from direct MCPs and/or the Source Hub.

DECIDE
Create an editable UI Contract with rationale, references, component mappings,
responsive rules, states, accessibility, and explicit avoid rules.

BUILD
Implement against the contract and repository truth.

VERIFY
Render required routes/states; check behavior, overflow, console/network,
accessibility, hierarchy, and visible fidelity.

LEARN
Record only human-approved decisions as scoped UI Rules.
```

## Opportunity map

### Prove now

- Establish an evaluation corpus before building infrastructure.
- Author one repo-local Skill that performs Understand → Research → Decide using files and currently available tools.
- Define the Source Descriptor, UI Evidence, Project UI Context, and UI Contract schemas.
- Classify the highest-value 40 existing resources by integration mode and rights, not all 295.
- Run the same tasks with baseline Codex and Skill-assisted Codex.

### Build after the first proof

- A local Source Hub MCP with a maximum of five or six narrow tools.
- Open-source adapters for shadcn registries, Open UI/WAI guidance, DTCG tokens, and local curated patterns.
- Direct-MCP orchestration guidance for Figma, Storybook, shadcn, 21st.dev, and optional paid reference providers.
- Browser review workflow using the host's existing browser tool plus axe-core/deterministic checks.
- Plugin packaging for repeatable local installation.

### Needs deeper evidence

- Whether image embeddings materially improve retrieval over good tags and rules.
- Whether MCP Apps improve the approval/comparison workflow enough to justify client-specific UI work.
- Whether an automatic stop hook improves quality or becomes intrusive.
- Whether users want a hosted Source Hub after the local plugin is proven.
- Which commercial providers would permit normalized cross-source search or cached thumbnails.
- Whether recommendations save tokens after including research and verification calls.

## Success criteria

The project succeeds only if controlled evaluation shows improvement in at least one of these without unacceptable regression in the others:

- higher human acceptance of the first rendered UI;
- fewer repair turns;
- fewer responsive/accessibility/state failures;
- stronger reuse of existing components and tokens;
- better traceability from choice to source/project constraint;
- lower or similar total tokens to accepted output;
- lower time spent manually searching and translating references.

The dashboard's appearance, corpus size, number of MCP tools, and volume of generated documentation are not success metrics.

## Research limitations

- Product access claims were read from current public pages; integrations were not authenticated or benchmarked in this research turn.
- Forum evidence is directional and can overrepresent frustrated or enthusiastic users.
- Recent 2026 papers and beta product capabilities may change quickly.
- No legal conclusion is made about scraping or redistribution; every adapter needs source-specific rights review.
- MCP client support differs. Core workflows must degrade to structured text/files.
