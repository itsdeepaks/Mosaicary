# Tessli Product Scope and Decisions

Status: **active V3 scope**
Repository: `itsdeepaks/tessli`
Authoritative direction: `docs/product-direction.md`
Execution plan: `docs/product-realignment-v3.md`

## 1. Active definition

Tessli is a **human-curated, AI-native design-source router**. The 295-source catalogue is its Source Index: it tells people and agents where to research, but does not itself prove judgment or taste.

The active product connects:

1. **Source Index** — where to research;
2. **Research Intelligence** — which source fits, why, and with what limitations;
3. **UI Judgment** — reviewed project decisions and evaluated outcomes, only when real evidence exists.

Tessli routes rather than mirrors provider content. It is not an iframe browser, screenshot warehouse, private-content proxy, or universal source ranking.

## 2. Current product promise

> Find the right design source, understand what it offers, and keep useful decisions for your project.

The human and agent loop is:

```text
task
→ small relevant source set with fit reasons
→ Source Guide and best access route
→ Save or Board
→ compact project context
→ implementation and browser verification
```

## 3. Information architecture

Primary navigation:

```text
Browse | Collections | For AI
```

Personal utilities:

```text
Search | Saved | Boards
```

Footer-only:

```text
About | Curation | Privacy | Terms | Content policy
```

The public route model is:

```text
/                         Task-led entry
/resources                Canonical source browser
/resources/[slug]         Source Guide
/collections              Guided research paths
/collections/[slug]       Ordered research checklist
/saved                    Browser-local shortlist
/boards                   Browser-local project Boards
/boards/[id]              Project decision workspace
/for-ai                   Human-to-agent workflow and setup truth
/about, /curation, legal  Footer-only destinations
```

`/auth`, `/submit`, `/suggest`, and report routes are unpublished until their real workflows are approved and operational. `/lab/*`, `/proofs/*`, Pattern Candidates, and human-review workspaces remain unlinked internal surfaces with `noindex`.

## 4. Page decisions

### Home

Home is a task-led entry, not a second browser. It contains task search, three to six task starters, a concise find → decide → handoff explanation, selected Collections, a concise For AI path, and footer.

It does not contain a category browser, source-result preview, sort/filter controls, a More menu, a coverage dashboard, fake metrics, or unfinished public actions.

### Browse

`/resources` is the one canonical Browse surface. It starts with task-focused search and supports category, source type, access, and truthful platform/framework refinement. It uses pagination and a single responsive result path. Cards or a compact list are normal; a table is optional only where it provides material research value.

Source identity leads to the internal Source Guide. Inspect, Save, and Visit source are independent actions. Similar Sources is the default alternative path; comparison is reserved for meaningful peer groups.

### Source Guide

`/resources/[slug]` is required for every stable source. Primary reading order is source identity/purpose, preview, Visit/Save/Add to Board, Use it when, What to explore, How to access it, useful compatibility, limitations, differentiated alternatives, containing Collections, and quiet details/references.

Listed sources degrade honestly. Coverage, verification, evidence, freshness, review state, and governance remain accessible but are secondary diagnostics rather than prominent evaluation mechanics.

### Collections

Collections are guided research paths. Their cards state goal, audience, stage count, and expected decision. Detail pages use staged checklists in which each source names its role, what to inspect, and the decision it supports. Save and Add to Board are available; public JSON/Markdown is secondary.

### Saved and Boards

Saved is a browser-local shortlist with search, filter, remove/undo, and Add to Board. Boards hold project goal, audience, constraints, source notes/rationale, selected/rejected/undecided decisions, unresolved questions, and compact Markdown/JSON handoff. Cloud persistence and accounts remain deferred.

### For AI

For AI explains the real human-to-agent workflow first: an example task/result, semantic pages/public representations/Board export, local MCP setup, only-real remote availability, access-route vocabulary, and concise privacy/provider boundaries. Tool inventories, coverage counts, and governance detail are supporting material.

### About, Curation, and legal

About tells the human-curated AI-native story and its boundaries. Curation covers selection principles, updates/correction routes, and quiet provenance; it must not turn verification bureaucracy into a public product promise. Legal pages remain factual and footer-only.

## 5. Source and data truth

- Preserve all 295 source rows and stable identifiers/slugs.
- Keep generated catalogue output deterministic and repository-managed during proof stages.
- Never invent optional source fields, previews, evidence, status, prices, capabilities, integrations, or verification.
- Website, public representations, MCP, and exports must share canonical facts.
- Paid/private provider content is not copied or redistributed merely because it is indexed.

Coverage levels remain explicit and truthful:

- **Listed:** identity, type, access, concise sourced description, status.
- **Profiled:** capabilities, best-for, content objects, platforms/frameworks, discovery, workflow fit, limitations.
- **Verified:** evidence, dates, confidence, agent-interface details, credential and persistence/redistribution rules, human review, freshness.

## 6. Deferred work

Do not activate public authentication, cloud Saved/Boards, payments, teams, marketplace work, browser extensions, a Figma plugin, mass screenshot publishing, automatic aesthetic scoring, vector search as a substitute for curation, or unreviewed pattern publication.

Pattern Candidates begin only after a real OSS proof workflow and remain internally reviewed until evidence supports promotion.

## 7. V3 delivery sequence

The approved sequence is:

```text
V3.0 Authority reconciliation
→ V3.1 Public IA hygiene
→ V3.2 AccessRoute contract pilot
→ V3.3 Source Guide proof
→ V3.4 Canonical Browse focus
→ V3.5 Homepage task entry
→ shared cards, retrieval, local MCP, representations, Collections, Saved/Boards, and For AI
```

V3.5 follows working Browse and Source Guide, not a verification-first or homepage-proof gate. Later live preview and hosted MCP work require their own approvals and safety checks.

## 8. Evaluation boundary

The future taste-evidence loop remains:

```text
brief → retrieval → research pack → agent build → browser verification → human review → approved/rejected decisions
```

Tessli does not claim outcome improvement before the loop produces retained evidence.
