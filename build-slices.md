# Tessli Product Plan v2 — Build Slices

Status: **active delivery plan — Phase 2 / Slice 2.3 NEXT**  
Rule: one independently reviewable vertical slice per branch and pull request.  
Phase plan: `docs/product-plan-v2.md`

The previous detailed Phase 1 ledger and legacy slice numbers remain available in Git history and under `docs/slices/`. Product Plan v2 does not rewrite history. It gives the direction-reset work a clean execution frame:

- Phase 0 is the completed direction reset;
- Phases 1–10 are the ten development phases;
- completed legacy `14.x` work is mapped to its Product Plan v2 phase;
- new work uses Product Plan v2 phase/slice identifiers.

## 1. Mandatory read order

Before changing Tessli:

1. refresh current `main`;
2. read `docs/product-direction.md`;
3. read `docs/product-plan-v2.md`;
4. read `PRD.md`;
5. read this file;
6. read `AGENTS.md`;
7. read `design.md` for visible work;
8. read relevant contracts, schemas, code, tests, and completed slice evidence.

When documents conflict, stop and resolve the conflict in a dedicated documentation slice.

## 2. Required GitHub slice loop

1. Read current `main`.
2. Read the mandatory product and repository documents.
3. Create one branch from current `main`.
4. Define exact acceptance criteria, exclusions, and expected files.
5. Implement one vertical slice.
6. Run focused tests/checks.
7. Review the complete diff.
8. Fix findings.
9. Run all applicable CI, browser, accessibility, security, and data checks.
10. Commit intentionally.
11. Open a draft PR.
12. Review the PR diff and CI.
13. Fix final findings.
14. Squash-merge only when gates pass.
15. Delete the branch where tooling permits.
16. Refresh updated `main`.
17. Start the next independent slice.

Do not start a later slice from an unmerged feature branch.

## 3. Status legend

- `DONE` — acceptance criteria demonstrated and squash-merged.
- `NEXT` — approved next slice.
- `PLANNED` — defined but not started.
- `PROOF` — requires real workflow evidence.
- `BLOCKED` — safe repository work is complete but an external/human dependency remains.
- `DEFERRED` — intentionally held until prerequisites are met.
- `SUPERSEDED` — old product decision remains in history/code until replaced.

## 4. Global stop conditions

Stop before merge when any of these occur:

- a later phase is mixed into the current slice;
- failed CI, browser, accessibility, security, data, or release checks are bypassed;
- a source is described as universally best without contextual reasons;
- Listed/Profiled/Verified status is overstated;
- sourced facts, curator judgment, project decisions, and open questions are mixed;
- all 295 records are rendered in one default result document;
- complete mobile and desktop result sets are duplicated;
- fake verification dates, rankings, trends, users, or social proof appear;
- unfinished Sign in, cloud, submission, moderation, or collaboration actions are promoted;
- human-review scores or provider verification are invented;
- paid/private content is copied, proxied, or persisted without permission;
- secrets, service keys, credentials, or personal/client data are exposed;
- a required external dependency is silently treated as completed.

## 5. Completed reusable baseline

Unless an approved slice changes them, Tessli already has:

- Next.js App Router application and CI/release gates;
- warm editorial design foundation;
- responsive public shell and legal/content pages;
- validated 295-source catalogue across 11 categories;
- resource media fallbacks and provenance tooling;
- six repository-maintained collections;
- browser-local Saved;
- Supabase SSR/client and user-data schema groundwork;
- 20 enriched intelligence profiles;
- evidence/profile validation tooling;
- local context-engine provider;
- deterministic research-plan/reference-packet builders;
- seven read-only native MCP tools;
- canonical Source contract with 275 Listed / 20 Profiled / 0 Verified.

Completed code is not automatically approved as the future product model. The Explore/Full Reference split, optional source details, hard-coded verification date, public disabled auth, and placeholder contribution actions remain superseded until replaced.

## 6. Phase status

| Phase | Name | Status | Active/next slice |
|---:|---|---|---|
| 0 | Direction Reset | DONE | — |
| 1 | Source Intelligence Foundation | DONE | — |
| 2 | Browse and Source Detail | ACTIVE | 2.3 NEXT |
| 3 | Local Saved and Project Boards | PLANNED | 3.1 |
| 4 | Research-Pack Export | PLANNED | 4.1 |
| 5 | Real OSS Proof Project | PROOF | 5.1 |
| 6 | Homepage, Navigation, Playbooks, and For AI | PLANNED | 6.1 |
| 7 | Reviewed Pattern Candidates | PLANNED | 7.1 |
| 8 | Authentication and Cloud Workspace | DEFERRED | 8.1 after local proof |
| 9 | Community and Moderation | DEFERRED | 9.1 after auth/owner |
| 10 | Evidence-Backed UI-Taste Layer | DEFERRED | 10.1 after multiple proofs |

## 7. Slice status

| ID | Slice | Status | Depends on | Historical alias/evidence |
|---|---|---|---|---|
| 0.1 | Product direction and operating reset | DONE | previous baseline | legacy `14.0`, PR #74 |
| 1.1 | Canonical source-profile contract | DONE | 0.1 | legacy `14.1` |
| 1.2 | Coverage mapping and intelligence adapter | DONE | 1.1 | `docs/slices/14.1-source-profile-contract.md` |
| 2.1 | Canonical Browse architecture and pagination contract | DONE | 1.2 | legacy `14.2`, PR #77 |
| 2.2 | Canonical `/resources` implementation | DONE | 2.1 | `docs/slices/2.2-canonical-browse-implementation.md`, PR #79 |
| 2.3 | Source Detail foundation for all 295 sources | NEXT | 1.2, 2.2 | — |
| 2.4 | Enriched intelligence detail and Similar Sources | PLANNED | 2.3 | — |
| 3.1 | Universal browser-local Save | PLANNED | 2.2, 2.3 | — |
| 3.2 | Saved workspace search/filter refinement | PLANNED | 3.1 | — |
| 3.3 | Local project Boards and notes | PLANNED | 3.1 | — |
| 3.4 | Selected/rejected decisions and unresolved questions | PLANNED | 3.3 | — |
| 4.1 | Board research-pack contract | PLANNED | 3.4 | — |
| 4.2 | Deterministic Markdown export | PLANNED | 4.1 | — |
| 4.3 | Safe public machine-readable representations | PLANNED | 2.4, 4.2 | — |
| 5.1 | OSS proof brief and research Board | PROOF | 4.2 | — |
| 5.2 | Agent implementation from exported pack | PROOF | 5.1 | — |
| 5.3 | Browser and human review | PROOF | 5.2 | — |
| 5.4 | Outcome/evidence report | PROOF | 5.3 | — |
| 6.1 | Global navigation and naming cleanup | PLANNED | 2.2 | — |
| 6.2 | Curated homepage built around proven workflow | PLANNED | 5.4, 6.1 | — |
| 6.3 | Collections-to-playbooks conversion | PLANNED | 3.3, 4.2 | — |
| 6.4 | For AI product page | PLANNED | 2.4, 4.3 | — |
| 7.1 | Pattern Candidate schema | PLANNED | 5.4 | — |
| 7.2 | First 5–10 reviewed candidates | PLANNED | 7.1 | — |
| 7.3 | Pattern retrieval for website/export/MCP | PLANNED | 7.2 | — |
| 8.1 | Authentication UX/security contract | DEFERRED | Phase 3–5 proof | — |
| 8.2 | Google + email/password + signup verification | DEFERRED | 8.1, SMTP/OAuth | — |
| 8.3 | Cloud Saved/Boards and local merge | DEFERRED | 8.2, RLS review | — |
| 8.4 | Account security, sessions, export, deletion | DEFERRED | 8.2 | — |
| 9.1 | Submission and correction forms | DEFERRED | 8.2, moderation owner | — |
| 9.2 | Moderation workflow and audit state | DEFERRED | 9.1 | — |
| 9.3 | Abuse protection and transactional email | DEFERRED | 9.1, provider setup | — |
| 10.1 | Evaluation and approved-precedent model | DEFERRED | multiple Phase 5 proofs | — |
| 10.2 | Permission-aware precedent retrieval | DEFERRED | 10.1 | — |
| 10.3 | Pattern promotion and project design packs | DEFERRED | 7.3, 10.1 | — |
| 10.4 | Repeated outcome evaluation | DEFERRED | 10.1–10.3 | — |
| 10.5 | Public UI-taste claim review | DEFERRED | 10.4 | — |

## 8. Phase 0 completion evidence

Phase 0 / Slice 0.1 established:

- Source Index, Research Intelligence, and UI Judgment;
- DesignIndex as directory inspiration, not final blueprint;
- one canonical truth for website, exports, and MCP;
- evidence before UI-taste claims;
- local workspace value before authentication;
- ten-phase Product Plan v2 direction.

Historical alias: `14.0`.

## 9. Phase 1 completion evidence

### Slice 1.1 — canonical source-profile contract

Deliverables:

- `schemas/source-profile.schema.json`;
- shared adapter `web/lib/source-profiles.ts`;
- validator `web/scripts/check-source-profile-contract.mjs`;
- complete deterministic mapping of 295 sources.

### Slice 1.2 — coverage mapping and adapter

Truthful baseline:

```text
275 Listed
20 Profiled
0 Verified
```

Existing intelligence records remain Profiled until explicit completed human-review provenance supports Verified.

Historical alias: `14.1`.

## 10. Phase 2 / Slice 2.1 completion evidence

Contract: `docs/slices/14.2-canonical-browse-contract.md`

Frozen decisions:

- `/resources` is the canonical browser;
- canonical `q`, category, access, source type, profile level, sort, view, and page state;
- 24 cards / 50 compact or table rows;
- server-derived current page;
- card/list/table responsibilities;
- one responsive result tree;
- internal Source Detail as primary action;
- separate Save and Visit source;
- no universal Compare;
- no hard-coded/fake verification date or sort;
- history, focus, scroll, progressive enhancement, and test matrix.

Historical alias: `14.2`.

## 11. Phase 2 / Slice 2.2 completion evidence

### Goal

Replace the competing catalogue browsers with one paginated, shareable, responsive `/resources` experience.

### Acceptance criteria

- server derives only the selected result page;
- default cards render at most 24 results;
- list/table render at most 50 rows;
- no complete duplicate mobile/desktop result map;
- URL restores query, category, access, source type, profile level, sort, view, and page;
- old `sort=verified` no longer creates a fake verification order;
- hard-coded verification dates are removed;
- cards/list/table have distinct responsibilities;
- internal `/resources/[slug]` navigation is primary;
- Save remains functional;
- provider destination is a separate safe action;
- homepage search routes to `/resources`;
- homepage complete catalogue is reduced to at most 12 compatibility-preview items;
- legacy useful query state is preserved;
- no-JavaScript search/pagination/navigation remains useful;
- browser Back/Forward and pagination state work;
- empty/error/unavailable states are truthful;
- accessibility, responsive, performance, route, unit, full CI, and complete-diff gates pass.

### Expected areas

- canonical Browse state/parser/serializer;
- server-side result derivation/pagination;
- `/resources` page and metadata;
- shared Browse controls;
- card/list/table result renderers;
- minimal non-dead internal profile route boundary if required;
- homepage search/preview migration;
- global navigation naming where required by the route;
- unit, component, route, and browser tests;
- slice evidence document.

### Completion evidence

- implementation and final findings: `docs/slices/2.2-canonical-browse-implementation.md`;
- pull request: PR #79;
- exact-head CI and browser run IDs are recorded in the PR before squash merge.

### Exclusions

- no mature Source Detail content beyond the minimum non-dead boundary;
- no universal Compare;
- no semantic/vector search;
- no new profiles to populate facets;
- no live provider verification;
- no Boards/export/auth/cloud/submission/moderation;
- no mature homepage redesign;
- no new MCP tools;
- no mass screenshot work;
- no unrelated refactor.

## 12. NEXT — Phase 2 / Slice 2.3 Source Detail foundation

### Goal and acceptance boundary

- 295 stable routes;
- truthful Listed state;
- progressive Profiled/Verified sections;
- Save/Add to Board when available/Visit source;
- status, limitations, evidence, freshness;
- collection membership;
- metadata, sitemap, 404;
- provider failure does not break Tessli profile.

### 2.4 Enriched intelligence and Similar Sources

- capabilities and content objects;
- platforms/frameworks;
- discovery model;
- integrations and agent access;
- workflow fit;
- governance and evidence;
- defensible peers/alternatives;
- same truth as MCP.

## 13. Phase 3 slices

### 3.1 Universal local Save

One versioned local contract across Browse, Source Detail, playbooks, and Saved.

### 3.2 Saved refinement

Search/filter/sort/remove/undo with truthful local-only messaging.

### 3.3 Local Boards

Create/rename/delete, project goal/constraints, source membership, notes.

### 3.4 Decisions

Selected/rejected state, rationale, unresolved questions, stable local persistence.

No authentication or cloud work belongs in Phase 3.

## 14. Phase 4 slices

### 4.1 Research-pack contract

Freeze deterministic sections, ordering, provenance, relevance budget, and privacy boundary.

### 4.2 Markdown export

Copy/download compact model-independent project context without an account.

### 4.3 Public machine representations

Safe source/collection Markdown or JSON plus semantic pages; never publish private local Board content.

## 15. Phase 5 slices

### 5.1 Brief and Board

Use a real OSS project, recommended Online Scope Studio homepage.

### 5.2 Agent build

Use the exported pack with Codex and retain timing/iteration evidence.

### 5.3 Browser/human review

Use required widths and twelve review dimensions. Do not invent human scores.

### 5.4 Evidence report

Report improvement, non-improvement, or mixed outcome honestly.

A missing human review is a blocker, not permission to fabricate completion.

## 16. Phase 6 slices

- 6.1 navigation/naming cleanup;
- 6.2 curated homepage;
- 6.3 collections become staged playbooks;
- 6.4 For AI page with real tools, coverage, setup, governance, and exports.

Public navigation contains only working destinations.

## 17. Phase 7 slices

- 7.1 Pattern Candidate schema;
- 7.2 first 5–10 human-reviewed candidates from real evidence;
- 7.3 website/export/MCP retrieval after data stabilizes.

Do not mass-generate published patterns.

## 18. Phase 8 slices

Authentication begins only after local Boards/export/proof demonstrate value.

Future flow:

```text
Google OAuth
or
first name + last name + email + password
→ signup email-verification OTP
→ optional local-data merge
```

Standard sign in:

```text
Google OAuth
or
email + password
```

Do not require emailed OTP after every password login. Optional MFA uses authenticator TOTP.

External credentials, SMTP, OAuth, environment separation, RLS, and security review are legitimate blockers.

## 19. Phase 9 slices

- contextual submission/correction/report forms;
- moderation states and audit history;
- server validation, duplicate detection, rate limiting, safe errors;
- transactional email only after provider/domain readiness.

No submission bypasses moderation.

## 20. Phase 10 slices

- evaluation and approved-precedent model;
- permission-aware precedent retrieval;
- pattern promotion and project design packs;
- repeated project evaluation;
- final public claim review.

Phase 10 cannot be completed from catalogue size, screenshots, embeddings, or one successful page.

## 21. Autonomous execution boundary

The autonomous goal is to advance through all ten development phases without asking for routine approval between safe slices.

Automation must stop and record a blocker rather than:

- bypass CI or review;
- invent human evidence;
- fabricate provider verification;
- enable external services without credentials;
- expose secrets/private data;
- copy restricted content;
- merge unsafe or unrelated work;
- describe deferred work as complete.

Each run completes at most one vertical slice, merges it when all gates pass, refreshes `main`, and then the following run continues the next eligible slice.
