# Tessli Product Plan v2

Status: **active execution plan — Phase 4**  
Approved direction: `docs/product-direction.md`  
Operational ledger: `build-slices.md`  
Effective date: 2026-08-04

## 1. Why this plan exists

The legacy Tessli roadmap used continuously increasing slice numbers from the original directory build. That history remains valid, but it makes the direction reset look like another extension of the old product.

Product Plan v2 provides the active execution frame:

- **Phase 0** records the completed direction reset;
- **Phases 1–10** are the ten development phases;
- each phase contains independently reviewable vertical slices;
- legacy `14.x` identifiers remain only as historical aliases for completed work;
- no merged history or evidence is rewritten.

`build-slices.md` is the operational source of truth for the active and next slice. This document defines the phase outcomes, dependencies, proof boundaries, and completion rules.

## 2. North-star workflow

```text
Search
→ inspect an internal source profile
→ save sources to a project Board
→ record selected and rejected directions
→ export compact research context
→ use it with an LLM or MCP client
→ build
→ verify in a browser
→ review with a human
→ retain approved and rejected outcomes
```

The first five phases prove this workflow. Later phases improve presentation, persistence, contribution, and the evidence-backed UI-taste layer.

## 3. Phase map

| Phase | Name                                        | Status   | Outcome                                                                     |
| ----: | ------------------------------------------- | -------- | --------------------------------------------------------------------------- |
|     0 | Direction Reset                             | DONE     | One approved product truth and operating contract                           |
|     1 | Source Intelligence Foundation              | DONE     | One canonical source/profile model shared by website, exports, and MCP      |
|     2 | Browse and Source Detail                    | DONE     | One paginated browser and useful internal profile for every source          |
|     3 | Local Saved and Project Boards              | DONE     | Reusable browser-local research without requiring an account                |
|     4 | Research-Pack Export                        | ACTIVE   | Deterministic, model-independent project context                            |
|     5 | Real OSS Proof Project                      | PROOF    | Evidence that Tessli improves or fails to improve a real workflow           |
|     6 | Homepage, Navigation, Playbooks, and For AI | PLANNED  | Public presentation built around the proven workflow                        |
|     7 | Reviewed Pattern Candidates                 | PLANNED  | Small human-reviewed pattern knowledge derived from real work               |
|     8 | Authentication and Cloud Workspace          | DEFERRED | Google/email accounts and cross-device research persistence                 |
|     9 | Community and Moderation                    | DEFERRED | Safe source submissions, corrections, reports, and review workflow          |
|    10 | Evidence-Backed UI-Taste Layer              | DEFERRED | Evaluated precedents, pattern promotion, design packs, and truthful claims  |

## 4. Phase 0 — Direction Reset

Status: **DONE**

Delivered:

- Tessli defined as Source Index + Research Intelligence + UI Judgment;
- DesignIndex recorded as inspiration for the directory layer, not the final product blueprint;
- public pages, exports, and MCP required to share canonical truth;
- UI-taste claims tied to evidence rather than catalogue size;
- directory-only decisions marked superseded;
- authentication deferred until local workspace value exists.

Historical mapping:

- Product Plan v2 Phase 0 / Slice 0.1;
- legacy ID `14.0`;
- merged PR #74.

## 5. Phase 1 — Source Intelligence Foundation

Status: **DONE**

Goal: define the smallest truthful source model that Browse, Source Detail, exports, and MCP can share.

### 1.1 Canonical source-profile contract

Status: **DONE**

- all 295 sources represented;
- stable IDs and slugs;
- Listed/Profiled/Verified levels;
- direct required fields;
- truthful empty/null fallback;
- no invented enrichment.

### 1.2 Coverage mapping and intelligence adapter

Status: **DONE**

- 275 Listed;
- 20 Profiled;
- 0 Verified until completed human-review provenance exists;
- existing evidence preserved;
- website and MCP compatibility retained.

Exit criteria met:

- schema validation;
- deterministic network-free generation;
- truthful coverage for every record;
- focused and full CI.

## 6. Phase 2 — Browse and Source Detail

Status: **DONE**

Goal: replace the competing Explore/Full Reference catalogue experiences with one canonical, paginated source browser and a useful internal profile for every source.

### 2.1 Canonical Browse contract

Status: **DONE**

- canonical URL state;
- 24-card / 50-row pagination;
- card/list/table responsibilities;
- one responsive result tree;
- primary internal profile navigation;
- separate Save and Visit actions;
- history, focus, scroll, progressive-enhancement, and browser-test contract.

Historical mapping: legacy ID `14.2`, contract `docs/slices/14.2-canonical-browse-contract.md`, PR #77.

### 2.2 Canonical Browse implementation

Status: **DONE**

- server-derived current page rather than all 295 records in the client;
- URL-backed query, category, access, source type, profile level, sort, view, and page;
- card, compact-list, and table views;
- no duplicated mobile/desktop result map;
- no hard-coded verification date or fake verification sort;
- homepage search routes to `/resources`;
- homepage catalogue reduced to a bounded preview;
- complete unit, route, accessibility, responsive, and no-JavaScript checks.

Evidence: `docs/slices/2.2-canonical-browse-implementation.md`, PR #79.

### 2.3 Source Detail foundation

Status: **DONE**

- `/resources/[slug]` for all 295 stable slugs;
- truthful Listed state and progressive Profiled/Verified sections;
- Save and Visit actions;
- availability, limitations, evidence, freshness, and collection membership;
- metadata and sitemap;
- internal profiles remain available when provider destinations fail.

Evidence: `docs/slices/2.3-source-detail-foundation.md`, PR #80.

### 2.4 Enriched intelligence and Similar Sources

Status: **DONE**

- capabilities, objects, platforms, frameworks, integrations, formats, tools, governance, and evidence for the 20 Profiled sources;
- explainable Similar Sources based on category, source type, and recorded metadata overlap;
- explicit repository-intelligence versus live-provider-verification boundary;
- no popularity, rating, trend, aesthetic, or universal-best scoring.

Evidence: `docs/slices/2.4-enriched-intelligence-detail.md`, PR #81.

## 7. Phase 3 — Local Saved and Project Boards

Status: **DONE**

Goal: make research reusable without introducing authentication.

### 3.1 Universal local Save

Status: **DONE**

- one stable-ID local store across Browse, Source Detail, collection resources, and Saved;
- legacy Tessli and Mosaicary migration;
- accessible announcements;
- same-document and cross-tab synchronization;
- local-only privacy boundary.

Evidence: `docs/slices/3.1-universal-local-save.md`, PR #82.

### 3.2 Saved workspace refinement

Status: **DONE**

- search, filters, and sorting;
- truthful counts and no-match state;
- remove/undo and clear-all confirmation/undo;
- persisted order and storage compatibility preserved;
- responsive labelled controls.

Evidence: `docs/slices/3.2-saved-workspace-refinement.md`, PR #83.

### 3.3 Local project Boards

Status: **DONE**

- create, rename, switch, and delete;
- project goal and constraints;
- catalogue source membership;
- per-source notes;
- versioned local persistence;
- safe malformed-data fallback;
- same-document and cross-tab synchronization.

Evidence: `docs/slices/3.3-local-project-boards.md`, PR #84.

### 3.4 Decisions and unresolved questions

Status: **DONE**

- selected, rejected, and undecided source state;
- rationale kept separate from research notes;
- editable unresolved questions retained in Board order;
- backward-compatible local persistence.

Evidence: `docs/slices/3.4-board-decisions.md`, PR #85.

Phase exit criteria met:

- research survives refresh and normal browser use;
- selected and rejected references are retained by project;
- no account is required;
- data can later migrate without silent loss.

## 8. Phase 4 — Research-Pack Export

Status: **ACTIVE**

Goal: turn one project Board into compact context usable by any language model, with or without MCP.

### 4.1 Board research-pack contract

Status: **DONE**

Contract: `docs/research-pack-contract.md`

Defined:

- canonical source facts, project judgment, and Tessli interpretation boundaries;
- selected, rejected, undecided, and unresolved-question output;
- deterministic ordering and explicit date injection;
- a twelve-selected-source relevance budget with no silent truncation;
- unknown-source and missing-intelligence behavior;
- provenance, evidence, privacy, security, filename, and accessibility rules;
- executable requirements for Slice 4.2;
- backward-compatible boundary for the existing MCP reference-packet tool.

Evidence: PR #86.

### 4.2 Deterministic Markdown export

Status: **NEXT**

- one pure Board formatter using the canonical source-profile adapter;
- Copy Markdown and Download `.md` from Boards;
- exact same bytes for copy and download;
- selected and rejected items, project constraints, unresolved questions, provenance, and interpretation boundaries;
- deterministic filename and explicit generated date;
- local-only processing with no Board upload;
- accessible validation, success, and failure states;
- no MCP behavior change.

### 4.3 Safe public machine-readable representations

Status: **PLANNED**

Only after privacy review:

- public source `.md` and `.json` representations;
- public collection/playbook representations;
- stable semantic pages and sitemap;
- example public research pack;
- no public exposure of private local Board content.

Phase exit criteria:

- the same Board snapshot and explicit date always produce the same export;
- export is useful in models without MCP;
- evidence and limitations survive compression;
- private browser-local content is never published.

## 9. Phase 5 — Real OSS Proof Project

Status: **PROOF**

Goal: test whether Tessli improves one real Online Scope Studio design workflow.

### 5.1 Research setup

- real brief, audience, and constraints;
- 8–12 selected sources;
- rejected directions;
- exported research pack;
- baseline timing and process notes.

### 5.2 Agent implementation

- give the pack and repository context to Codex;
- implement one approved page or section candidate;
- retain prompts, changed files, time, and iteration count;
- do not present hidden manual intervention as automation.

### 5.3 Browser and human review

- 1440, 1024, 768, 390, and 320 px checks where applicable;
- accessibility and interaction review;
- twelve approved human-review dimensions;
- no invented human scores;
- blind review preserved where used.

### 5.4 Outcome report

Report honestly whether Tessli produced:

- smaller or better context;
- faster research;
- fewer rebuild loops;
- less generic output;
- better hierarchy, mobile usability, coherence, accessibility, restraint, or ship readiness;
- no measurable improvement.

One proof cannot justify a broad public UI-taste claim.

## 10. Phase 6 — Homepage, Navigation, Playbooks, and For AI

Status: **PLANNED**

Goal: present the proven workflow clearly to humans and models.

### 6.1 Global navigation and naming

Primary navigation:

```text
Browse | Collections | For AI
```

Utilities:

```text
Search | Saved
```

- remove duplicated Resources/Full Reference/Explore naming;
- About moves to secondary/footer navigation;
- Sign in remains absent until Phase 8 works.

### 6.2 Curated homepage

- task-based hero search routed to `/resources`;
- real coverage facts and research-goal entry points;
- 3–6 featured playbooks;
- 8–12 featured or recently reviewed sources;
- human versus MCP example;
- research-pack explanation;
- no fake metrics, logos, trends, or AI decoration.

### 6.3 Collections become playbooks

- outcome and audience;
- staged research sequence;
- why each source is included;
- what to inspect and which decision it supports;
- Save/add-to-Board/export where available;
- last reviewed date.

### 6.4 For AI

- current seven MCP tools;
- coverage, limits, setup, evidence, governance, and exports;
- no paid/private-library proxy claims;
- model-independent export workflow.

## 11. Phase 7 — Reviewed Pattern Candidates

Status: **PLANNED**

Goal: create the first small, evidence-linked layer of reusable UI judgment.

### 7.1 Pattern Candidate contract

Required:

- problem;
- when to use and when not to use;
- anatomy and key rules;
- responsive behavior;
- accessibility requirements;
- common failures;
- example sources;
- project usage;
- review state and date.

### 7.2 First 5–10 candidates

- derived from real OSS research and proof evidence;
- multiple examples where possible;
- written and reviewed by a human;
- no automatic promotion from screenshots;
- limitations retained.

### 7.3 Retrieval

- website and export representations;
- `find_patterns` / `get_pattern` only after schema and content are stable;
- no mass-generated catalogue.

## 12. Phase 8 — Authentication and Cloud Workspace

Status: **DEFERRED UNTIL LOCAL PROOF**

Goal: add accounts only when cross-device persistence has demonstrated value.

### 8.1 Auth and security contract

- Google OAuth;
- email/password signup;
- first and last names;
- Terms/Privacy acceptance;
- signup email-verification OTP;
- standard password sign-in without email OTP after every login;
- optional authenticator TOTP MFA;
- recovery, security notifications, sessions, export, and deletion.

### 8.2 Authentication implementation

- cookie-aware Supabase SSR clients;
- custom SMTP;
- rate limits and abuse controls;
- safe generic errors;
- callback and redirect validation;
- production/preview/local environment contract.

### 8.3 Cloud Saved and Boards

- RLS-protected user data;
- local-to-cloud merge preview;
- deduplicated import;
- no silent overwrite;
- cross-device sync;
- account data export and deletion.

Legitimate blockers include missing OAuth, SMTP/domain verification, environment separation, and unresolved RLS/security review.

## 13. Phase 9 — Community and Moderation

Status: **DEFERRED UNTIL OWNER AND AUTH EXIST**

Goal: let people improve Tessli without turning the catalogue into an unreviewed dump.

### 9.1 Submission and correction forms

- submit source;
- contextual report;
- suggest metadata improvement;
- duplicate detection;
- source ID/URL context;
- clear confirmation.

### 9.2 Moderation workflow

- pending, accepted, rejected, and needs-info states;
- evidence and reviewer notes;
- attribution where appropriate;
- audit timestamps;
- removal/takedown requests;
- moderation owner and response expectations.

### 9.3 Abuse and transactional communication

- server validation and URL normalization;
- length limits and rate limiting;
- honeypot, with CAPTCHA only when justified;
- safe errors;
- transactional emails through an approved provider.

## 14. Phase 10 — Evidence-Backed UI-Taste Layer

Status: **LONG-TERM; REQUIRES MULTIPLE PROOF PROJECTS**

Goal: turn repeated evaluated work into a defensible design-intelligence layer.

### 10.1 Evaluation and precedent model

- brief and constraints;
- retrieved sources/patterns;
- research pack;
- implementation version;
- browser evidence;
- human scores and notes;
- approved/rejected decisions;
- revision outcome.

### 10.2 Approved precedent retrieval

- find prior decisions relevant to a new project;
- permission boundaries for private OSS/client work;
- no client or personal-data leakage;
- explicit provenance and confidence.

### 10.3 Pattern promotion and design packs

- promote candidates only after repeated evidence;
- project-specific `design.md`, token, and prompt packs where justified;
- styles emerge from repeated use rather than speculative mass generation;
- agent tools added only for stable objects.

### 10.4 Repeated outcome evaluation

- multiple project types;
- compare Tessli-assisted and baseline workflows;
- track research time, iterations, generic-output complaints, accessibility, mobile quality, coherence, restraint, and ship readiness;
- preserve failed experiments.

### 10.5 Public claim review

Only after sufficient evidence, decide whether Tessli may truthfully claim:

> Tessli helps agents make better UI decisions.

Do not claim that Tessli gives AI taste merely because it has sources, screenshots, embeddings, patterns, or MCP tools.

## 15. Execution rules

Development proceeds one vertical slice at a time in the active conversation and repository loop:

1. refresh current `main`;
2. read the mandatory product and repository documents;
3. finish any approved in-progress slice before starting another;
4. create one branch from current `main`;
5. define exact acceptance criteria, exclusions, and expected files;
6. implement one vertical slice;
7. run focused checks;
8. review the complete diff and fix findings;
9. run all applicable CI, browser, accessibility, security, and data gates;
10. open or update a draft PR;
11. review the PR diff and exact-head CI;
12. fix final findings;
13. squash-merge only when gates pass;
14. delete the branch where tooling permits;
15. refresh `main` before the next slice.

No recurring scheduled development automation is part of this process.

## 16. Stop conditions

Stop and record a blocker rather than:

- bypass CI or review;
- merge unrelated scopes;
- invent human review or provider verification;
- commit secrets;
- enable authentication without credentials and security readiness;
- copy or persist paid/private content without permission;
- weaken release, security, accessibility, privacy, or provenance gates;
- claim completion when an external or human dependency remains unresolved.

When blocked:

1. record the exact blocker;
2. complete safe preparatory work within the current slice;
3. mark the slice `BLOCKED`, not `DONE`;
4. identify the smallest external action required;
5. continue only with independent work after the current slice is resolved.

## 17. Definition of phase completion

A phase is complete only when:

- every required slice is merged to current `main`;
- acceptance criteria are demonstrated;
- focused and full applicable checks pass;
- browser, accessibility, security, privacy, and data gates pass where relevant;
- evidence and rollback notes are committed;
- `build-slices.md` marks the phase complete;
- no hidden blocker is described as finished.
