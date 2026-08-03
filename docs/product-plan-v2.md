# Tessli Product Plan v2

Status: **active execution plan**  
Approved direction: `docs/product-direction.md`  
Operational ledger: `build-slices.md`  
Effective date: 2026-08-04

## 1. Why this plan exists

The legacy Tessli roadmap used continuously increasing slice numbers from the original directory build. That history remains valid, but it makes the direction reset look like another extension of the old product.

Product Plan v2 starts a new execution frame:

- **Phase 0** records the completed direction reset;
- **Phases 1–10** are the ten development phases;
- each phase contains one or more independently reviewable slices;
- legacy `14.x` identifiers remain only as historical aliases for already completed work;
- no Git history or merged evidence is rewritten.

## 2. North-star workflow

```text
Search
→ inspect an internal source profile
→ save sources to a project
→ record selected and rejected directions
→ export compact research context
→ use it with an LLM or MCP client
→ build
→ verify in a browser
→ review with a human
→ retain approved and rejected outcomes
```

The first five phases prove the workflow. Later phases improve presentation, persistence, contribution, and the evidence-backed UI-taste layer.

## 3. Phase map

| Phase | Name | Outcome |
|---:|---|---|
| 0 | Direction Reset | One approved product truth and operating contract |
| 1 | Source Intelligence Foundation | One canonical source/profile model shared by website, exports, and MCP |
| 2 | Browse and Source Detail | One paginated browser and useful internal profile for every source |
| 3 | Local Saved and Project Boards | Reusable browser-local research without requiring an account |
| 4 | Research-Pack Export | Deterministic, model-independent project context |
| 5 | Real OSS Proof Project | Evidence that Tessli improves or fails to improve a real workflow |
| 6 | Homepage, Navigation, Playbooks, and For AI | Public product presentation built around the proven workflow |
| 7 | Reviewed Pattern Candidates | Small human-reviewed pattern knowledge derived from real work |
| 8 | Authentication and Cloud Workspace | Google/email accounts and cross-device research persistence |
| 9 | Community and Moderation | Safe source submissions, corrections, reports, and review workflow |
| 10 | Evidence-Backed UI-Taste Layer | Evaluated precedents, pattern promotion, design packs, and truthful claims |

## 4. Phase 0 — Direction Reset

Status: **DONE**

Outcome:

- Tessli is defined as Source Index + Research Intelligence + UI Judgment;
- DesignIndex is recorded as inspiration for the directory layer, not the final product blueprint;
- public pages, exports, and MCP use one canonical truth;
- UI-taste claims require evidence;
- old directory-only decisions are marked superseded;
- authentication is deferred until local workspace value exists.

Historical mapping:

- Product Plan v2 Phase 0 / Slice 0.1
- legacy ID `14.0`
- merged PR `#74`

## 5. Phase 1 — Source Intelligence Foundation

Status: **DONE**

Goal:

Define the smallest truthful source model that Browse, Source Detail, exports, and MCP can share.

Completed slices:

### 1.1 Canonical source-profile contract

- all 295 sources represented;
- stable IDs and slugs;
- Listed/Profiled/Verified levels;
- direct required fields;
- truthful empty/null fallback;
- no invented enrichment.

### 1.2 Coverage mapping and intelligence-profile adapter

- 275 Listed;
- 20 Profiled;
- 0 Verified until completed human-review provenance exists;
- existing evidence preserved;
- website and MCP compatibility retained.

Historical mapping:

- Product Plan v2 Phase 1 / Slices 1.1–1.2
- legacy ID `14.1`
- detailed evidence: `docs/slices/14.1-source-profile-contract.md`

Exit criteria:

- schema validates;
- generated mapping is deterministic and network-free;
- all records resolve to a truthful level;
- focused and full CI pass.

## 6. Phase 2 — Browse and Source Detail

Status: **ACTIVE**

Goal:

Replace the competing Explore/Full Reference catalogue experiences with one canonical, paginated source browser and a useful internal profile for every source.

### 2.1 Canonical Browse contract

Status: **DONE**

- canonical URL state;
- initial filters and sorts;
- 24-card / 50-row pagination;
- card/list/table responsibilities;
- one responsive result tree;
- primary internal profile navigation;
- separate Save and Visit source actions;
- history, focus, scroll, progressive-enhancement, and browser-test contract.

Historical mapping:

- legacy ID `14.2`
- contract: `docs/slices/14.2-canonical-browse-contract.md`
- merged PR `#77`

### 2.2 Canonical Browse implementation

Status: **NEXT**

- server-derived current page rather than all 295 records in the client;
- URL-backed query, category, access, source type, profile level, sort, view, and page;
- cards, compact list, and table;
- no duplicated mobile/desktop result map;
- no hard-coded verification date;
- no fake verification sort;
- homepage search and global navigation route to `/resources`;
- homepage full catalogue reduced to a bounded compatibility preview;
- complete unit, route, accessibility, responsive, history, and no-JavaScript checks.

### 2.3 Source Detail foundation

- `/resources/[slug]` for all 295 stable slugs;
- useful Listed state;
- progressive Profiled/Verified sections;
- Save, Add to board when available, and Visit source;
- availability, limitations, evidence, freshness, collection membership;
- metadata and sitemap;
- internal profile remains available when provider destination fails.

### 2.4 Enriched intelligence detail and Similar Sources

- capabilities;
- discovery model;
- integrations and agent interfaces;
- workflow fit;
- governance;
- evidence;
- defensible peer/category Similar Sources;
- no copying of paid/private content.

Phase exit criteria:

- `/resources` is the only complete browser;
- every source has an internal profile;
- result state is shareable and restorable;
- current page only is rendered;
- internal evaluation precedes provider exit;
- all repository and browser gates pass.

## 7. Phase 3 — Local Saved and Project Boards

Status: **PLANNED**

Goal:

Make research reusable without introducing authentication.

### 3.1 Universal local Save

- Browse cards/list/table;
- Source Detail;
- playbook items;
- Saved workspace;
- one versioned storage contract;
- legacy migration;
- tab synchronization where practical;
- accessible save/remove announcements.

### 3.2 Saved workspace refinement

- search;
- type/category/profile-level filters where useful;
- sort;
- clear/remove/undo;
- clear local-only privacy explanation;
- no fake folders or cloud claims.

### 3.3 Local project Boards

- create, rename, and delete;
- goal, audience, and constraints;
- add/remove sources;
- per-item notes;
- selected/rejected state;
- unresolved questions;
- deterministic versioned local persistence.

Phase exit criteria:

- research survives refresh and normal browser use;
- selected and rejected references are retained by project;
- no account is required;
- data can later migrate without silent loss.

## 8. Phase 4 — Research-Pack Export

Status: **PLANNED**

Goal:

Turn one project Board into compact context usable by any language model, with or without MCP.

### 4.1 Board export contract

- sourced facts;
- curator/project judgment;
- decisions;
- rejected directions;
- open questions;
- evidence/source URLs;
- deterministic ordering;
- size and relevance budget.

### 4.2 Deterministic Markdown export

- download/copy Markdown;
- compact source summaries;
- selected and rejected items;
- constraints and implementation reminders;
- no account;
- reuse current packet-builder logic where appropriate.

### 4.3 Machine-readable public representations

Only after privacy review:

- public source `.md` / `.json` representations;
- public collection/playbook representations;
- example research pack;
- stable semantic pages and sitemap;
- no public exposure of private local Board content.

Phase exit criteria:

- same Board always produces the same export;
- export is useful in models without MCP;
- evidence and limitations survive compression;
- private browser-local content is not published.

## 9. Phase 5 — Real OSS Proof Project

Status: **PROOF**

Goal:

Test whether Tessli actually improves one real OSS design workflow.

Recommended target: Online Scope Studio homepage.

### 5.1 Research setup

- real brief;
- audience and constraints;
- 8–12 selected sources;
- rejected directions;
- exported research pack;
- baseline timing and process notes.

### 5.2 Agent implementation

- give the pack and repository context to Codex;
- implement one approved page/section candidate;
- retain prompts, changed files, time, and iteration count;
- no hidden manual intervention presented as automation.

### 5.3 Browser and human review

- 1440, 1024, 768, 390, and 320 px checks where applicable;
- accessibility and interaction review;
- twelve approved human-review dimensions;
- no invented human scores;
- blind review preserved where used.

### 5.4 Evidence report

State whether Tessli produced:

- smaller or better context;
- faster research;
- fewer rebuild loops;
- less generic output;
- better hierarchy, mobile usability, coherence, accessibility, restraint, or ship readiness;
- no measurable improvement.

Phase exit criteria:

- evidence is committed;
- success and failure are both reported honestly;
- findings update profiles, Board/export rules, or Pattern Candidates;
- no public UI-taste claim is made from one result.

## 10. Phase 6 — Homepage, Navigation, Playbooks, and For AI

Status: **PLANNED**

Goal:

Present the proven workflow clearly to humans and models.

### 6.1 Global navigation and naming

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
- real coverage facts;
- research-goal entry points;
- 3–6 featured playbooks;
- 8–12 recently reviewed/featured sources;
- human versus MCP example;
- research-pack explanation;
- no 48-card catalogue;
- no fake metrics, logos, trends, or AI decoration.

### 6.3 Collections become playbooks

- outcome and audience;
- staged research sequence;
- why each source is included;
- what to inspect;
- which decision it supports;
- Save/add to Board/export where available;
- last reviewed date.

### 6.4 For AI

- current seven MCP tools;
- coverage and limits;
- setup examples;
- evidence and governance;
- no paid/private-library proxy claims;
- model-independent export workflow.

Phase exit criteria:

- public IA matches actual functionality;
- the homepage explains the product in under ten seconds;
- no unfinished action is promoted;
- human and agent workflows are visible without overclaiming.

## 11. Phase 7 — Reviewed Pattern Candidates

Status: **PLANNED**

Goal:

Create the first small, evidence-linked layer of reusable UI judgment.

### 7.1 Pattern Candidate contract

Required:

- problem;
- when to use;
- when not to use;
- anatomy/key rules;
- responsive behaviour;
- accessibility requirements;
- common failures;
- example sources;
- project usage;
- review state/date.

### 7.2 First 5–10 candidates

- derived from real OSS research and proof evidence;
- multiple examples where possible;
- written and reviewed by a human;
- no automatic promotion from screenshots;
- limitations retained.

### 7.3 Retrieval

- website and export representation;
- `find_patterns` / `get_pattern` only after schema/content are stable;
- no mass-generated catalogue.

Phase exit criteria:

- candidates are useful in a second real project;
- provenance and limitations are visible;
- no candidate is presented as universal truth.

## 12. Phase 8 — Authentication and Cloud Workspace

Status: **DEFERRED UNTIL LOCAL PROOF**

Goal:

Add accounts only when cross-device persistence has demonstrated value.

### 8.1 Auth/security contract

- Google OAuth;
- email/password signup;
- first and last names;
- Terms/Privacy acceptance;
- signup email-verification OTP;
- standard password sign-in without email OTP after every login;
- optional authenticator TOTP MFA;
- recovery, security notifications, sessions, export, deletion.

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
- account data export/deletion.

External blockers that may legitimately stop this phase:

- missing OAuth configuration;
- missing SMTP/domain verification;
- missing production environment separation;
- unresolved RLS/security review.

Phase exit criteria:

- one complete sign-up/sign-in/recovery flow works;
- cloud workspace provides visible benefit;
- RLS and session boundaries are tested;
- public Sign in appears only after the benefit works.

## 13. Phase 9 — Community and Moderation

Status: **DEFERRED UNTIL OWNER AND AUTH EXIST**

Goal:

Let people improve Tessli without turning the catalogue into an unreviewed dump.

### 9.1 Submission and correction forms

- submit source;
- contextual report;
- suggest metadata improvement;
- duplicate detection;
- source ID/URL context;
- clear confirmation.

### 9.2 Moderation workflow

- pending/accepted/rejected/needs-info states;
- evidence and reviewer notes;
- attribution where appropriate;
- audit timestamps;
- removal/takedown requests;
- moderation owner and response expectations.

### 9.3 Abuse and transactional communication

- server validation;
- URL normalization;
- length limits;
- rate limiting;
- honeypot, with CAPTCHA only when justified;
- safe errors;
- transactional emails through approved provider.

Phase exit criteria:

- no public submission bypasses moderation;
- accepted changes preserve provenance;
- reports can be resolved and audited;
- abuse and privacy requirements are tested.

## 14. Phase 10 — Evidence-Backed UI-Taste Layer

Status: **LONG-TERM; REQUIRES MULTIPLE PROOF PROJECTS**

Goal:

Turn repeated evaluated work into a defensible design-intelligence layer.

### 10.1 Evaluation and precedent model

- brief;
- constraints;
- retrieved sources/patterns;
- research pack;
- implementation version;
- browser evidence;
- human scores/notes;
- approved/rejected decisions;
- revision outcome.

### 10.2 Approved precedent retrieval

- find prior decisions relevant to a new project;
- permission boundaries for private OSS/client work;
- no leaking client or personal data;
- explicit provenance and confidence.

### 10.3 Pattern promotion and design packs

- promote candidates only after repeated evidence;
- project-specific `design.md`/token/prompt packs where justified;
- styles emerge from repeated use rather than speculative mass generation;
- agent tools added only for stable objects.

### 10.4 Repeated outcome evaluation

- multiple project types;
- compare Tessli-assisted and baseline workflows;
- track research time, iteration count, generic-output complaints, accessibility, mobile quality, coherence, restraint, and ship readiness;
- preserve failed experiments.

### 10.5 Claim review

Only after sufficient evidence, decide whether Tessli may truthfully claim:

> Tessli helps agents make better UI decisions.

Do not claim that Tessli gives AI taste merely because it has sources, screenshots, embeddings, patterns, or MCP tools.

Phase exit criteria:

- multiple evaluated projects;
- documented improvement or bounded non-improvement;
- privacy and rights review;
- stable precedent/pattern retrieval;
- claims match the evidence.

## 15. Autonomous execution rules

The goal is to advance through all ten development phases without waiting for routine approval after each slice.

Autonomy does not permit:

- bypassing failed CI;
- merging unrelated scopes;
- inventing human review or provider verification;
- committing secrets;
- enabling authentication without credentials/security readiness;
- copying or persisting paid/private content without permission;
- weakening release, security, accessibility, or provenance gates;
- claiming completion when an external or human dependency remains unresolved.

When blocked:

1. record the exact blocker;
2. complete all safe preparatory work in the current slice;
3. mark the slice `BLOCKED` rather than `DONE`;
4. identify the smallest external action required;
5. continue only with independent work that does not violate the one-slice rule.

## 16. Definition of phase completion

A phase is complete only when:

- every required slice is merged to current `main`;
- acceptance criteria are demonstrated;
- focused and full applicable checks pass;
- browser/accessibility/security/data gates pass where relevant;
- evidence and rollback notes are committed;
- `build-slices.md` marks the phase complete;
- no hidden blocker is described as finished.
