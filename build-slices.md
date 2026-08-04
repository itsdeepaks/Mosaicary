# Tessli Product Plan v2 — Build Slices

Status: **active delivery plan — Phase 3 / Slice 3.4 NEXT**  
Rule: one independently reviewable vertical slice per branch and pull request.  
Phase plan: `docs/product-plan-v2.md`

The previous detailed Phase 1 ledger and legacy slice numbers remain available in Git history and under `docs/slices/`. Product Plan v2 does not rewrite history. It provides the active execution frame:

- Phase 0 is the completed direction reset;
- Phases 1–10 are the ten development phases;
- completed legacy `14.x` work is mapped to Product Plan v2;
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

When documents conflict, resolve the conflict in a dedicated documentation slice.

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
- one canonical paginated `/resources` browser;
- internal source-detail routes for all 295 sources;
- truthful 275 Listed / 20 Profiled / 0 Verified coverage;
- enriched Profiled intelligence detail and explainable Similar Sources;
- resource media fallbacks and provenance tooling;
- six repository-maintained collections;
- browser-local Saved;
- Supabase SSR/client and user-data schema groundwork;
- evidence/profile validation tooling;
- local context-engine provider;
- deterministic research-plan/reference-packet builders;
- seven read-only native MCP tools.

Completed code is not automatically approval for later-phase functionality. Public auth, cloud workspaces, submissions, moderation, pattern claims, and UI-taste claims remain deferred until their prerequisites are met.

## 6. Phase status

| Phase | Name | Status | Active/next slice |
|---:|---|---|---|
| 0 | Direction Reset | DONE | — |
| 1 | Source Intelligence Foundation | DONE | — |
| 2 | Browse and Source Detail | DONE | — |
| 3 | Local Saved and Project Boards | ACTIVE | 3.4 NEXT |
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
| 2.3 | Source Detail foundation for all 295 sources | DONE | 1.2, 2.2 | `docs/slices/2.3-source-detail-foundation.md`, PR #80 |
| 2.4 | Enriched intelligence detail and Similar Sources | DONE | 2.3 | `docs/slices/2.4-enriched-intelligence-detail.md`, PR #81 |
| 3.1 | Universal browser-local Save | DONE | 2.2, 2.3 | `docs/slices/3.1-universal-local-save.md`, PR #82 |
| 3.2 | Saved workspace search/filter refinement | DONE | 3.1 | `docs/slices/3.2-saved-workspace-refinement.md`, PR #83 |
| 3.3 | Local project Boards and notes | DONE | 3.1, 3.2 | `docs/slices/3.3-local-project-boards.md`, PR #84 |
| 3.4 | Selected/rejected decisions and unresolved questions | NEXT | 3.3 | — |
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

## 8. Completed phase evidence

### Phase 0 — Direction Reset

Established Source Index, Research Intelligence, UI Judgment, shared website/export/MCP truth, local value before authentication, and evidence before UI-taste claims.

### Phase 1 — Source Intelligence Foundation

Delivered the canonical source-profile schema and deterministic adapter with the truthful baseline:

```text
275 Listed
20 Profiled
0 Verified
```

### Phase 2 — Browse and Source Detail

Delivered:

- canonical Browse contract and implementation;
- bounded server-derived pagination;
- URL-restorable query, filters, sorting, view, and page;
- one responsive result tree;
- internal source profiles as the primary destination;
- truthful source-detail routes for all 295 sources;
- progressive Listed/Profiled coverage;
- enriched Profiled capabilities, objects, platforms, frameworks, integrations, formats, tools, governance, and evidence;
- explicit repository-intelligence versus live-provider-verification messaging;
- explainable Similar Sources using category, source type, and recorded metadata overlap;
- no popularity, rating, trend, aesthetic, or universal-best scoring.

Evidence:

- `docs/slices/14.2-canonical-browse-contract.md`;
- `docs/slices/2.2-canonical-browse-implementation.md`;
- `docs/slices/2.3-source-detail-foundation.md`;
- `docs/slices/2.4-enriched-intelligence-detail.md`;
- PRs #77, #79, #80, and #81.

## 9. Phase 3 — Local Saved and Project Boards

### DONE — Slice 3.1 Universal browser-local Save

Goal: one versioned local Save contract across Browse, Source Detail, collections/playbooks, and Saved.

Required:

- preserve current saved IDs through migration;
- one shared storage key/version and deterministic parser;
- Save/un-save from Browse and Source Detail;
- collection/playbook item support where the surface exists;
- accessible announcements;
- cross-tab synchronization where practical;
- truthful local-only/device-only messaging;
- no account, cloud, or collaboration dependency.

Completion evidence:

- one stable-ID browser-local store across Browse, Source Detail, collection resources, and Saved;
- legacy Tessli and Mosaicary URL-list migration retained;
- same-document and cross-tab synchronization;
- accessible persistent Save controls on every collection resource;
- no account, network, cloud, catalogue, schema, or dependency change;
- `docs/slices/3.1-universal-local-save.md`;
- PR #82.

### DONE — Slice 3.2 Saved workspace refinement

Delivered:

- search across saved source name, domain, description, use case, and tags;
- filters limited to categories and access models present in the saved set;
- recent, A–Z, and Z–A sorting without changing persisted order;
- truthful counts, no-match state, and accessible filter reset;
- individual removal undo plus retained clear-all confirmation and undo;
- responsive labelled controls with 44px targets and visible focus;
- the existing stable-ID local store, legacy migration, and synchronization boundaries unchanged;
- `docs/slices/3.2-saved-workspace-refinement.md`;
- PR #83.

### DONE — Slice 3.3 Local project Boards

Delivered create, rename, switch, and delete; project goal and constraints; catalogue source membership; per-source notes; versioned browser-local persistence; safe malformed-data fallback; same-document and cross-tab synchronization; Saved navigation; sitemap coverage; responsive and accessible controls; `docs/slices/3.3-local-project-boards.md`; PR #84.

### Slice 3.4 Decisions

Selected/rejected status, rationale, unresolved questions, and stable local persistence.

No authentication or cloud work belongs in Phase 3.

## 10. Later phase boundaries

### Phase 4 — Research-Pack Export

Freeze the Board export contract, then implement deterministic model-independent Markdown and safe public source/collection representations. Never publish private local Board content.

### Phase 5 — Real OSS Proof Project

Use a real OSS brief, Board, exported pack, agent build, browser verification, and genuine human review. Missing human review is a blocker, not permission to invent scores.

### Phase 6 — Homepage, Navigation, Playbooks, and For AI

Only working routes enter public navigation. Homepage redesign follows the proven research loop. Collections become staged playbooks. For AI documents real tools, setup, coverage, governance, and exports.

### Phase 7 — Reviewed Pattern Candidates

Start with a schema, then 5–10 genuinely reviewed candidates from real evidence. Do not mass-generate published patterns.

### Phase 8 — Authentication and Cloud Workspace

Begins only after local Boards/export/proof demonstrate value. External credentials, SMTP, OAuth, environment separation, RLS, and security review are legitimate blockers.

### Phase 9 — Community and Moderation

Requires contextual forms, server validation, duplicate detection, rate limiting, moderation ownership, audit state, safe errors, and provider readiness.

### Phase 10 — Evidence-Backed UI-Taste Layer

Requires multiple proof projects, permission-aware precedent retrieval, pattern promotion, repeated evaluation, and a final public-claim review. Catalogue size, screenshots, embeddings, or one successful page cannot complete this phase.

## 11. Autonomous execution boundary

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

Each run completes at most one vertical slice, merges it when all gates pass, refreshes `main`, and lets the following run continue the next eligible slice.
