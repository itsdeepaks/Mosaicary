# Tessli Product Direction

Status: **authoritative V3 direction**
Approved: 2026-08-08
Execution plan: `docs/product-realignment-v3.md`

## 1. Product definition

Tessli is a **human-curated, AI-native design-source router**.

It helps people and coding agents describe a design or frontend task, find a small relevant set of sources, understand why each source fits, choose a useful access route, and retain project decisions for implementation and review.

Tessli is not only a directory, an iframe browser, a screenshot warehouse, or an autonomous taste engine. Its public site is the human discovery and curation surface; public representations and MCP are machine interfaces over the same canonical truth.

## 2. Product promise

For people:

> Find the right design source, understand what it offers, and keep useful project decisions.

For agents:

> Find the right source for the task, understand why it fits, and know how to access and use it.

Tessli must not claim that catalogue size creates AI taste, that a source is universally best, or that outcomes improve without recorded evidence.

## 3. Product model

```text
task
→ task-fit retrieval
→ small source set with reasons
→ source guide
→ browser, documentation, registry, source code, API, MCP, CLI, or plugin
→ Saved or Board
→ compact project context
→ agent implementation
→ browser verification and human decision
```

### Source Index

The repository-managed catalogue answers: **Where should I research?**

### Research Intelligence

Curated source profiles answer: **Which source fits this task, why, and with what limitations?** They may contain capabilities, workflow fit, access details, evidence, freshness, and governance facts when those facts exist.

### UI Judgment

Reviewed patterns, constraints, selected/rejected decisions, and evaluated outcomes answer: **What should this project learn, choose, reject, and verify?** This layer earns any future UI-taste claim through real evidence.

## 4. Shared canonical truth

The website, public JSON and Markdown, Boards exports, local MCP, later remote MCP, and future APIs must derive from the same canonical source and Collection objects. Presentation can differ; factual claims cannot.

Do not create separate website and MCP taxonomies. Do not copy paid or private provider content merely because a provider is indexed.

## 5. Human and machine interfaces

### Human interface

The normal human loop is:

```text
state a task
→ inspect a source guide
→ Save or Add to Board
→ record selected, rejected, and unresolved decisions
→ export compact context
→ build and review
```

Humans receive visual task-led discovery, concise source guidance, useful previews, differentiated alternatives, private Saved items, and local Boards.

### Machine interface

Models can use semantic source pages, stable URLs, public JSON/Markdown, Board exports, and MCP. Machine access must not depend on an iframe, browser-local Board access, provider credential proxying, or Tessli writes.

Routine outputs explain what a source helps with, when to choose it, what to inspect, how to access it, an important limitation, and differentiated alternatives. Provenance, freshness, and governance remain available as diagnostics.

## 6. Product rules

1. **Task fit before taxonomy.** Categories organise; task intent selects.
2. **Route, do not mirror.** Direct users and agents to a provider’s allowed website, documentation, registry, source, API, MCP, CLI, or plugin.
3. **Visual for humans, structured for agents.** Preview media supports human evaluation; it is never required for machine access.
4. **Compact by default.** Show useful action and context first; reveal diagnostic depth when needed.
5. **Small relevant result sets.** Retrieval returns explained choices, not an undifferentiated catalogue dump.
6. **Project decisions matter.** Selected, rejected, and unresolved decisions are more useful than a pile of saved URLs.
7. **Local privacy first.** Boards remain local until a later cloud slice proves value.
8. **No invented taste.** Alternatives use recorded fit and limitations, never universal ratings.

## 7. Global information architecture

Primary navigation:

```text
Browse | Collections | For AI
```

Personal utilities:

```text
Search | Saved | Boards
```

Footer-only destinations:

```text
About | Curation | Privacy | Terms | Content policy
```

`/auth`, `/submit`, `/suggest`, and reporting flows remain unpublished until complete working flows exist. `/lab/*`, `/proofs/*`, and human-review workspaces are internal, unlinked, and `noindex`.

## 8. Canonical routes and page priorities

```text
/                         Task-led entry
/resources                Canonical source browser
/resources/[slug]         Source guide for every stable source
/collections              Guided research paths
/collections/[slug]       Ordered research checklist
/saved                    Lightweight private shortlist
/boards                   Local project decisions
/boards/[id]              Project research workspace
/for-ai                   Human-to-agent workflow and setup truth
/about, /curation, legal  Footer-only product and policy pages
```

### Home

Home asks: **What are you trying to design?** It contains task search, three to six task starters, a concise find → decide → handoff explanation, selected Collections, a concise For AI path, and the footer. It must not duplicate Browse with a catalogue, category rail, filters, sorting, a More menu, coverage dashboard, or unfinished actions.

### Browse

`/resources` is the one paginated source browser. It begins with task-focused search and supports category, source type, access, and platform/framework refinement where truthful data exists. Cards or a compact list are the default; a table is allowed only when it earns its complexity. Search state remains shareable and restoreable.

Each result exposes source identity, a one-line purpose, two or three useful task cues, an approved preview or resilient fallback, internal Inspect, independent Save, and independent Visit actions. Coverage, evidence, and audit mechanics are not primary Browse controls or dashboards.

### Source guide

`/resources/[slug]` is required for every stable source and is the primary human evaluation surface. Its reading order is:

1. breadcrumb;
2. source identity and one-line purpose;
3. approved preview with fixed-ratio fallback;
4. Visit, Save, and Add to Board;
5. Use it when;
6. What to explore;
7. How to access it;
8. Works with, when useful;
9. Important limitations;
10. Consider instead, with a meaningful differentiator;
11. Collections containing the source;
12. quiet source details and references.

Listed sources degrade honestly. Coverage level, evidence dates, freshness, human-review state, credentials, persistence, redistribution, and governance information remain truthful diagnostic details; they do not dominate the primary reading flow.

### Collections

Collections are outcome-oriented research paths. Index cards show goal, audience, stage count, and expected decision. Detail pages give an ordered stage checklist: each source explains its role, what to inspect, and the decision it supports. Save and Add to Board remain available; JSON and Markdown are secondary machine-access links.

### Saved and Boards

Saved is a lightweight browser-local shortlist with search, filtering, remove/undo, and Add to Board. Boards turn shortlist items into local project context: goal, audience, constraints, source notes, rationale, selected/rejected/undecided decisions, unresolved questions, and deterministic Markdown plus compact JSON handoff.

No account or cloud-persistence prompt appears until a separate approved slice proves a real benefit.

### For AI

For AI explains one real human-to-agent workflow before implementation detail: what Tessli gives an agent, an example task and compact result, access without MCP, local MCP while it is the only transport, later remote availability only when real, access-route vocabulary, and concise privacy/provider boundaries. Coverage and governance material is secondary to this workflow.

### About, Curation, and legal

About explains the human-curated AI-native purpose and boundaries. Curation explains selection principles, updates/corrections, and a quiet provenance policy; it must not present verification bureaucracy as a product feature. Legal pages remain concise policy pages without product promotion.

## 9. Source truth and safety

All 295 source rows and stable IDs/slugs remain preserved. Generated catalogue data remains deterministic and network-free during normal build/test. Missing enrichment degrades honestly; no profile, media, price, status, capability, integration, or verification fact is invented.

Coverage levels remain explicit:

- **Listed** — identity, type, access, concise sourced description, and status.
- **Profiled** — adds capabilities, best-for, content objects, platforms/frameworks, discovery, workflow fit, and limitations.
- **Verified** — adds evidence, dates, confidence, agent-interface details, credential and persistence/redistribution rules, human review, and freshness.

Repository verification is not live provider verification. External links and previews must respect provider boundaries; live previews are a later optional allowlisted enhancement with a full fallback.

## 10. Evaluation and future UI Judgment

The evidence loop remains:

```text
brief
→ retrieval
→ research pack
→ agent build
→ browser verification
→ human review
→ approved/rejected decisions
```

Pattern Candidates begin only after a real OSS proof workflow. They remain manually reviewed and internal until their problem, use/non-use conditions, rules, common failures, examples, project usage, review state, and date are established. Do not mass-generate published pattern pages.

## 11. Delivery order and deferrals

`docs/product-realignment-v3.md` defines the authoritative V3 sequence. V3.0 reconciles authority; V3.1 cleans public IA; V3.2 establishes access vocabulary; V3.3–V3.5 establish Source Guide, Browse, and Home in that order. Later slices connect shared cards, retrieval, MCP, representations, Collections, Saved/Boards, and For AI.

Do not build public authentication, cloud Saved/Boards, payments, team workspaces, mass screenshot publication, automatic aesthetic scoring, a marketplace, browser extensions, or unreviewed pattern catalogues before their explicit prerequisites and approved slices.

## 12. Success definition

For people:

> Tessli helps builders find, understand, and retain the right design sources and decisions for a specific project.

For agents:

> Tessli provides compact, structured, evidence-aware source guidance and access routes without overstating taste or copying provider content.
