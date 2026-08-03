# Tessli Product Direction

Status: **authoritative product direction**  
Approved: 2026-08-04  
Supersedes: the directory-only interpretation in the previous PRD, product scope, and build plan

## 1. North star

Tessli begins as a curated design-resource index, but the directory is only the first layer.

The long-term product helps:

1. people find the best design and frontend sources for a specific task;
2. people understand why a source is useful before leaving Tessli;
3. people save research and decisions into project context;
4. language models without MCP use stable public pages and Markdown research packs;
5. language models with MCP query the same structured source truth directly;
6. OSS evaluate whether retrieved context produces better, less-generic interfaces;
7. reviewed outcomes become a future evidence-backed UI-taste layer.

The claim progression is:

```text
Directory
→ research index
→ structured design knowledge
→ project-specific context
→ agent retrieval
→ generated UI evaluation
→ evidence-backed UI-taste system
```

Tessli must earn the final claim through project evidence. Catalogue size alone is not evidence of taste.

## 2. DesignIndex inspiration and Tessli differentiation

Tessli was initially inspired by `https://www.designindex.xyz/`.

DesignIndex demonstrates the value of:

- a calm curated directory;
- understandable categories;
- concise descriptions;
- access/pricing filters;
- a fast route to external resources.

Tessli keeps that low-friction discovery model but adds layers that a simple directory does not provide:

- task fit;
- structured source profiles;
- evidence and verification;
- limitations and governance;
- reusable project research;
- machine-readable exports;
- MCP retrieval;
- reviewed UX-pattern knowledge;
- outcome evaluation.

Tessli must not copy DesignIndex's visual identity or page structure. It should preserve its own warm editorial design system.

## 3. Product layers

### 3.1 Source Index

The 295 websites, tools, libraries, systems, and providers.

This layer answers:

> Where should I look?

Examples include inspiration directories, product-flow libraries, component systems, typography tools, accessibility tools, motion libraries, asset libraries, AI builders, APIs, CLIs, and MCP providers.

### 3.2 Research Intelligence

Structured information about each source.

This layer answers:

> Which source fits this task, why does it fit, and what are its limitations?

It may include:

- source type;
- category;
- access model;
- best use cases;
- capabilities;
- content objects;
- supported platforms and frameworks;
- discovery methods;
- integrations and agent interfaces;
- workflow fit;
- limitations;
- credential, persistence, and redistribution rules;
- evidence;
- verification state and date.

### 3.3 UI Judgment

Reviewed patterns, constraints, project decisions, and evaluated outcomes.

This layer answers:

> What should we learn, what fits this project, what should we reject, and did the result improve?

It eventually includes:

- UX-pattern dossiers;
- project constraints;
- selected and rejected references;
- responsive and accessibility rules;
- common failures;
- implementation guidance;
- browser-verification evidence;
- human review scores and notes;
- approved precedents.

The future UI-taste claim primarily belongs to this layer.

## 4. One canonical truth

The website, generated JSON, Markdown exports, future API, and MCP must read from the same canonical data.

```text
Canonical repository/database truth
├── source catalogue
├── intelligence profiles
├── evidence
├── collections/playbooks
├── local or cloud project boards
├── pattern candidates
└── evaluation records
       │
       ├── public website
       ├── static JSON
       ├── Markdown exports
       ├── future API
       ├── MCP
       └── internal OSS evaluation tools
```

Do not create separate website and MCP taxonomies.

A human-readable source detail page must represent the same facts returned by the MCP resource-profile tool.

## 5. Human and model interfaces

### 5.1 Humans

The public product helps a person:

```text
Search
→ inspect a source profile
→ save to a project board
→ record why it matters
→ export research context
→ use it in a build
```

### 5.2 Models without MCP

Support browser/search/upload workflows through:

- server-rendered source-detail pages;
- stable canonical URLs;
- semantic headings;
- sitemap coverage;
- static JSON representations where appropriate;
- static Markdown representations where appropriate;
- downloadable research packs;
- optional `llms.txt` as an additional navigation aid, never the only interface.

### 5.3 Models with MCP

The existing read-only MCP remains a first-class interface.

Current native tools:

- `search_resources`;
- `get_resource_profile`;
- `compare_resources`;
- `get_collection`;
- `build_research_plan`;
- `create_reference_packet`;
- `verify_resource`.

Future tools require real underlying data before implementation:

- `find_patterns`;
- `get_pattern`;
- `create_project_research_pack`;
- `get_project_constraints`;
- internal/private approved-precedent retrieval.

Do not add tools merely because they sound agentic.

## 6. Contextual source fit

Tessli must not claim that one source is universally best.

Fit depends on:

- task;
- product type;
- platform;
- required content object;
- framework;
- access and budget;
- licence and commercial-use requirements;
- user skill;
- whether code is needed;
- integration/agent availability;
- freshness;
- credential and redistribution constraints.

Internal ranking may use a transparent fit model, but the public UI should explain reasons instead of exposing a vague universal score.

Example:

```text
Strong fit because:
- provides installable React components;
- supports Tailwind;
- exposes documented MCP access;
- fits component-selection workflows.

Important limitation:
- advanced generation requires a paid plan.
```

## 7. Source coverage levels

All 295 sources must not imply equal research depth.

### Listed

- name;
- stable ID and slug;
- URL/domain;
- category;
- source type;
- access model;
- concise sourced description;
- availability status.

### Profiled

Adds:

- best for;
- capabilities;
- content objects;
- platforms/frameworks;
- discovery model;
- integration methods;
- workflow fit;
- limitations.

### Verified

Adds:

- evidence URLs;
- verification date;
- confidence;
- agent-interface details;
- credential requirements;
- persistence and redistribution rules;
- human review;
- freshness state.

Initial target:

```text
295 Listed
40–60 Profiled
20–30 Verified
```

Enrichment priority follows real OSS use and retrieval value, not alphabetical order.

## 8. Minimum coherent product

The first complete research product contains:

```text
Home
Browse
Source Detail
Collections / Playbooks
Saved
Local Project Boards
For AI
About / Curation / Legal
```

Primary navigation:

```text
Browse
Collections
For AI
```

Utilities:

```text
Search
Saved
```

Account access appears only when cloud persistence has a real user benefit.

Patterns do not become primary navigation until Tessli has a credible reviewed corpus.

## 9. Canonical route model

```text
/                         Curated homepage
/resources                Canonical source browser
/resources/[slug]         Internal source profile
/collections              Guided research playbooks
/collections/[slug]       Staged playbook detail
/saved                    Browser-local saved objects
/boards                    Browser-local project boards
/boards/[id]               Project research workspace
/for-ai                    MCP, exports, coverage, and governance
/about                     Product purpose and boundaries
/curation                  Selection, profiling, and verification process
/privacy                   Current privacy behaviour
/terms                     Terms
/content-policy            Source, media, attribution, and takedown policy
```

Future routes are introduced only with working functionality.

Filtered category states may initially use `/resources?category=...`. Dedicated category detail pages require original editorial value and must not be thin wrappers.

## 10. Canonical Browse

`/resources` becomes the single catalogue browser.

Required direction:

- replace the competing Explore and Full Reference models;
- URL-backed search, filters, sorting, view, and page;
- server/build-time pagination;
- cards, compact list, and table views where useful;
- one responsive result rendering path rather than duplicate complete mobile and desktop trees;
- internal source profile as the primary destination;
- separate external-source action;
- Save available everywhere;
- peer comparison only where comparable metadata exists;
- Similar Sources otherwise;
- real verification-date sorting only when genuine dates exist.

Recommended initial pagination:

- 24 card results per page;
- 50 compact/table results per page.

## 11. Source detail

`/resources/[slug]` is the highest-priority missing product page.

Required sections:

1. source identity and purpose;
2. profile/verification level;
3. best for and not ideal for;
4. access model;
5. capabilities;
6. content objects;
7. discovery/search model;
8. supported platforms/frameworks;
9. integrations and agent access;
10. workflow fit;
11. limitations and governance;
12. evidence and freshness;
13. similar sources;
14. collections containing the source;
15. Save, Add to board, and Visit source actions;
16. contextual issue reporting when the workflow exists.

The entire resource card must no longer be only an outbound link.

## 12. Collections as playbooks

Collections become guided, outcome-oriented research paths rather than equal-card lists.

A playbook defines:

- goal;
- intended user;
- stages;
- sources in each stage;
- why each source is included;
- what to inspect;
- what decision it supports;
- optional research checklist;
- deterministic Markdown export.

Example:

```text
Research a SaaS homepage
1. Positioning
2. Hero
3. Product explanation
4. Proof
5. Pricing
6. Objection handling
7. CTA and footer
8. Responsive and accessibility review
```

## 13. Local Saved and Boards before accounts

Browser-local Saved remains available without an account.

A local Board is the first research workspace and must be proven before cloud sync.

A board may contain:

- project goal;
- product and audience constraints;
- selected sources;
- rejected sources/directions;
- per-item notes;
- decisions;
- unresolved questions;
- deterministic Markdown export.

Example boards:

- OSS homepage;
- Liquidity Health;
- authentication research;
- dashboard research.

Authentication and cloud boards follow demonstrated repeat usage, not speculation.

## 14. Research-pack contract

A research pack must distinguish:

- sourced facts;
- curator judgment;
- project decisions;
- rejected directions;
- unresolved questions.

Minimum sections:

```text
Task
Audience
Product constraints
Selected sources
Why each source was selected
Relevant capabilities
Important limitations
Evidence/source URLs
Rejected directions
Recommended pattern candidates
Implementation reminders
Open decisions
```

The export must remain compact enough for model context and useful enough for human review.

## 15. Pattern strategy

Patterns are essential to the future taste layer but must be earned through research.

Start with 5–10 manually reviewed Pattern Candidates used in real OSS tasks.

Minimum candidate schema:

```yaml
id:
name:
problem:
when_to_use:
when_not_to_use:
key_rules:
common_failures:
example_sources:
project_usage:
review_status:
reviewed_at:
```

A candidate becomes a published pattern only when:

- multiple relevant examples support it;
- its rules are human reviewed;
- limitations are documented;
- it has been applied or evaluated in a real build;
- it is not merely a visual trend;
- evidence is retained.

Do not mass-generate pattern pages from URLs or screenshots.

## 16. Evaluation creates taste evidence

Retrieval alone does not create taste.

The required learning loop is:

```text
Brief
→ Tessli source/pattern retrieval
→ research pack
→ agent implementation
→ browser verification
→ human review
→ approved/rejected decisions
→ updated Tessli knowledge
```

Review dimensions:

- task fit;
- hierarchy;
- mobile usability;
- discoverability;
- density;
- coherence;
- consistency;
- component reuse;
- accessibility;
- restraint;
- regression risk;
- ship readiness.

Evidence to retain where approved:

- brief;
- research pack;
- selected and rejected sources;
- implementation screenshots;
- review scores;
- reviewer notes;
- final decision;
- changes made after review.

## 17. First proof project

Use Tessli on one real OSS page before expanding the platform.

Recommended experiment: Online Scope Studio homepage.

```text
1. Write the page brief and constraints.
2. Select 8–12 sources through Tessli.
3. Save them to a local OSS Homepage board.
4. Record why each source matters.
5. Record rejected directions.
6. Export a compact research pack.
7. Give the pack and repository context to Codex.
8. Build one candidate.
9. Run responsive browser verification.
10. Score it using the twelve review dimensions.
11. Compare it with the current manual workflow.
12. Update profiles and pattern candidates from the result.
```

Measure:

- research time;
- prompt/context size;
- rebuild loops;
- generic-design complaints;
- hierarchy score;
- mobile score;
- coherence score;
- ship-readiness score;
- manual corrections required.

## 18. What is likely to work

- one canonical Browse route;
- internal source profiles;
- coverage levels;
- task-based search;
- local Saved and Boards;
- deterministic Markdown exports;
- shared website/MCP data;
- evidence and freshness;
- manual enrichment of high-value sources;
- a small reviewed pattern corpus;
- real OSS project testing;
- retaining selected and rejected decisions;
- explaining recommendation reasons.

## 19. What will not work

- feeding 295 raw URLs directly to an LLM;
- treating semantic similarity as judgment;
- one universal aesthetic score;
- unreviewed mass-generated profiles;
- mass screenshot scraping or redistribution;
- proxying paid/private libraries;
- building authentication before workspace value;
- building a full Styles platform before repeated project evidence;
- redesigning the homepage before Browse and Source Detail work;
- claiming UI taste before measured outcome evidence.

## 20. Authentication direction

Authentication is deferred until local Boards and research-pack export prove value.

When implemented:

### Sign up

```text
Google OAuth
or
first name + last name + email + password
→ email verification OTP
→ optional local-data merge
```

### Standard sign in

```text
Google OAuth
or
email + password
```

Do not require an emailed OTP after every normal password sign-in.

Optional MFA should use authenticator-app TOTP. Email codes remain suitable for signup verification, passwordless access if deliberately offered, recovery, or an explicit fallback.

## 21. Visual direction

Keep the approved warm editorial foundation:

- warm off-white canvas;
- near-black/charcoal text;
- Newsreader for display;
- Instrument Sans for interface text;
- restrained orange accent;
- subtle page grain;
- border-led hierarchy;
- real Tessli product UI as primary imagery.

Avoid generic AI-purple branding, decorative orbs, meaningless 3D, continuous animation, glassmorphism, oversized rounded containers, fake metrics, and fake social proof.

Research pages may be denser than marketing pages.

## 22. Delivery proof stages

### Stage 1 — Useful, trustworthy directory

- canonical Browse;
- pagination;
- URL-backed controls;
- Listed/Profiled/Verified levels;
- source details;
- universal local Save.

Proof: users can find and evaluate a source without endless scrolling.

### Stage 2 — Reusable research

- local Boards;
- notes;
- staged playbooks;
- Markdown export;
- Similar Sources;
- limited peer comparison.

Proof: one OSS project retains and reuses research.

### Stage 3 — Agent research

- board/reference-pack export;
- shared MCP/profile truth;
- project-specific queries;
- 5–10 reviewed pattern candidates;
- evidence and limitations in outputs.

Proof: Codex receives smaller, more relevant, better-structured context.

### Stage 4 — Taste evidence

- browser verification;
- human review packet;
- approved/rejected decisions;
- outcome comparison;
- pattern promotion.

Proof: Tessli-assisted builds improve against defined review dimensions.

### Stage 5 — Persistence and scale

- authentication;
- cloud Boards;
- local-to-cloud merge;
- submissions and reports;
- expanded verified corpus;
- pattern expansion.

Proof: repeated cross-project/device usage justifies persistence.

## 23. Explicit deferrals

Do not build yet:

- full authentication activation;
- cloud Saved or Boards;
- a large Pattern catalogue;
- a Styles marketplace or design-token generator;
- payments;
- team workspaces;
- public screenshot scraping;
- a Figma plugin;
- a browser extension;
- automatic aesthetic scoring;
- more MCP tools without stable data;
- a homepage redesign before the core research loop works.

## 24. Success definition

For humans:

> Tessli helps builders find, understand, and organise the right frontend and design sources for a specific project.

For models without MCP:

> Tessli exposes stable, structured, evidence-linked pages and research packs that can be searched, shared, uploaded, and cited.

For models with MCP:

> Tessli provides structured retrieval across source profiles, evidence, collections, constraints, and later reviewed patterns.

Long-term:

> Tessli helps agents make better UI decisions by combining curated design knowledge, project constraints, relevant precedents, and human-evaluated outcomes.
