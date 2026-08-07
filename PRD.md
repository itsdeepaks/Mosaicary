# Tessli Product Requirements Document

Status: **authoritative V3 requirements**
Last updated: 2026-08-08
Authoritative strategy: `docs/product-direction.md`
Execution plan: `docs/product-realignment-v3.md`

## 1. Product summary

Tessli is a **human-curated, AI-native design-source router** for people and coding agents. It routes a task to a small, explainable set of design and frontend sources, shows what to inspect and how to access each source, and retains useful project decisions for handoff and review.

The 295-source catalogue is the Source Index, not the whole product. Tessli is not an iframe browser, a screenshot archive, a provider mirror, or an autonomous taste engine.

## 2. Product promise

For people:

> Find the right design source, understand what it offers, and keep useful decisions for your project.

For agents:

> Find the right source for the task, understand why it fits, and know how to access and use it.

The product must distinguish sourced facts, curator judgment, project decisions, and unresolved questions. It must not claim universal rankings, live provider verification, or outcome improvement without evidence.

## 3. Product layers

1. **Source Index** — where to research.
2. **Research Intelligence** — which source fits, why, and with what limitations.
3. **UI Judgment** — reviewed patterns, project constraints, selected/rejected precedents, and evaluated outcomes.

The first two layers support the current product. The third earns any future UI-taste claim through the documented evaluation loop.

## 4. Product principles

1. **Task fit before taxonomy.** Categories organise; task intent selects.
2. **Route, do not mirror.** Point to permitted provider sites, docs, registries, source code, APIs, MCP, CLIs, and plugins rather than copying them.
3. **Visual for humans, structured for agents.** Preview media aids people; machine access never depends on an iframe.
4. **Compact default.** Show practical value and action first; make provenance and operational detail available second.
5. **Small relevant sets.** Do not give people or agents an undifferentiated catalogue dump.
6. **Project decisions matter.** Selected, rejected, and unresolved decisions carry more value than a saved-link pile.
7. **Local value first.** Local Saved, Boards, and handoff precede cloud persistence.
8. **Truthful curation.** Never invent facts, ratings, popularity, trends, users, or taste.

## 5. Non-goals

Tessli is not:

- a styled bookmark directory only;
- a scraped mirror or screenshot archive for paid/private sources;
- a universal aesthetic scoring engine;
- an unreviewed AI-generated pattern dump;
- a proxy for provider credentials;
- proof that every source has equal intelligence depth;
- a public account, submission, or suggestion product before those flows work.

## 6. Core jobs

### Human jobs

- describe a task without knowing an exact provider;
- inspect why a source fits before leaving Tessli;
- see what to inspect, how to access it, and its important limitation;
- Save and add sources to a local Board;
- record selected, rejected, undecided, and unresolved decisions;
- export compact Markdown and JSON project context.

### Agent jobs

- retrieve a small task-fit source set with reasons and caveats;
- understand canonical provider URLs and useful access routes;
- find differentiated alternatives;
- consume compact source, Collection, and Board representations;
- respect credentials, persistence, redistribution, attribution, and provider boundaries.

## 7. Canonical truth and source levels

The website, public representations, local MCP, later remote MCP, and exports consume the same repository-managed source and Collection truth. Stable IDs/slugs are preserved; normal generated data stays deterministic and network-free.

Coverage remains explicit, never invented:

- **Listed:** identity, type, access, concise sourced description, status.
- **Profiled:** adds capabilities, best-for, content objects, platforms/frameworks, discovery, workflow fit, limitations.
- **Verified:** adds evidence, dates, confidence, agent-interface details, credential and persistence/redistribution rules, human review, freshness.

Coverage, evidence, human-review status, verification mechanics, and governance are diagnostic detail in routine human interfaces—not a primary dashboard or reading flow. Repository verification does not imply live provider verification.

## 8. Required public information architecture

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

```text
/                         Task-led entry
/resources                Canonical Browse
/resources/[slug]         Source Guide
/collections              Guided research paths
/collections/[slug]       Ordered research checklist
/saved                    Browser-local shortlist
/boards                   Browser-local project Boards
/boards/[id]              Project decision workspace
/for-ai                   Human-to-agent workflow and setup truth
```

`/auth`, `/submit`, `/suggest`, and reporting routes are unpublished until complete approved flows exist. `/lab/*`, `/proofs/*`, Pattern Candidates, and human-review workspaces are unlinked internal surfaces and `noindex`.

## 9. Page requirements

### Home

Home asks what the visitor is trying to design. Its order is task search to `/resources?q=...`, three to six task starters, a short find → decide → handoff explanation, selected Collections, a concise For AI path, and footer. It must not duplicate Browse with source-result previews, category rails, sort/filter controls, coverage dashboards, a More menu, fake metrics, or unfinished actions.

### Browse

`/resources` is the only source browser. It provides task-focused search, a result summary, category/source-type/access and truthful platform/framework refinement, active filters, pagination, and empty-query recovery. Cards or a compact list are default; a table is optional only where it has a clear research benefit.

Every result provides source identity, one-line purpose, two or three task cues, approved preview/fallback, internal Inspect, independent Save, and independent Visit. URL state remains shareable and back/forward safe. Do not render duplicate complete result trees for mobile and desktop.

### Source Guide

Every stable source slug has `/resources/[slug]`. Required primary order:

1. breadcrumb, identity, and one-line purpose;
2. approved fixed-ratio preview or resilient fallback;
3. Visit, Save, and Add to Board;
4. Use it when;
5. What to explore;
6. How to access it;
7. Works with, when useful;
8. Important limitations;
9. Consider instead, with a differentiated reason;
10. Collections containing the source;
11. quiet source details and references.

Listed profiles must degrade honestly; optional data is never fabricated. There is no embedded copy of a provider site.

### Collections, Saved, and Boards

Collection cards show goal, audience, stage count, and expected decision. A Collection detail is an ordered checklist in which every source states its role, inspect prompt, and supported decision. Machine representations are secondary.

Saved is a lightweight browser-local shortlist with search, filter, remove/undo, and Add to Board. Boards contain goal, audience, constraints, source notes and rationale, selected/rejected/undecided decisions, unresolved questions, deterministic Markdown, and compact JSON handoff. No account/cloud prompt appears before its separate approved slice.

### For AI

For AI leads with the human-to-agent workflow, one example task/result, no-MCP representations and Board export, local MCP setup, later remote availability only when real, access-route vocabulary, then concise boundaries. It must not lead with a tool inventory, coverage dashboard, or verification exposition.

### About, Curation, and legal

About explains Tessli’s human-curated AI-native definition and boundaries. Curation explains selection, updates/corrections, and quiet provenance rather than verification bureaucracy. Legal pages are footer-only and factual.

## 10. Data, privacy, and safety requirements

- Preserve all 295 source rows and stable IDs/slugs.
- Do not invent media, prices, status, capabilities, integrations, or verification claims.
- Respect paid/private source terms; do not copy, proxy, or redistribute source content without permission.
- Live previews are an optional later allowlisted enhancement; standard previews use approved repository-managed media and complete fallbacks.
- Boards are browser-local; local MCP does not read Boards or write Tessli state.
- Validate external URLs and retain evidence provenance and dates when claims require them.

## 11. Evaluation and pattern requirements

The future learning loop is:

```text
brief → retrieval → research pack → agent build → browser verification → human review → approved/rejected decisions
```

Pattern Candidates start only after a real OSS proof workflow. They require a documented problem, use/non-use conditions, rules, common failures, examples where possible, project usage, review state, and review date. Do not mass-publish patterns or claim UI-taste results without real evidence.

## 12. Delivery order

The V3 slice order in `docs/product-realignment-v3.md` is authoritative:

1. V3.0 authority reconciliation;
2. V3.1 public IA hygiene;
3. V3.2 access-route contract;
4. V3.3 Source Guide proof;
5. V3.4 canonical Browse;
6. V3.5 task-led Home;
7. later shared-card, retrieval, machine, Collection, Saved/Board, and For AI slices.

Authentication, cloud Boards, payments, teams, a marketplace, public screenshots, vector search as a curation substitute, browser extensions, and automatic aesthetic scoring remain deferred until separately approved prerequisites are met.

## 13. Quality requirements

All visible work preserves the approved visual system, semantic landmarks and headings, keyboard operation, focus visibility, touch targets, reduced motion, no hover-only information, responsive recomposition, and WCAG 2.2 AA targets. Browse and Source Guide work must pass 1440, 1024, 768, 390, and applicable 320px checks with no horizontal overflow.

## 14. Success definition

Tessli succeeds when a person or agent can move from a specific design question to a small relevant source set, understand what each source offers and how to access it, retain project decisions locally, and hand compact context to an implementation workflow without overclaiming taste or provider facts.
