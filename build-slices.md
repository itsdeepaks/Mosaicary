# Tessli Build Slices

Status: **active delivery plan after the 2026-08-04 product-direction reset**  
Rule: one independently reviewable vertical slice per branch and pull request.

The previous detailed Phase 1 ledger remains available in Git history and the individual evidence files under `docs/slices/`. This file defines the active work after the directory-to-research-product reset.

## 1. Mandatory read order

Before changing Tessli, read:

1. current `main`;
2. `docs/product-direction.md`;
3. `PRD.md`;
4. this file;
5. `AGENTS.md`;
6. `design.md` for visible work;
7. relevant contracts, schemas, code, tests, and completed slice evidence.

When documents conflict, stop and resolve the conflict in a documentation slice.

## 2. Slice-loop protocol

Every slice follows this order:

1. Refresh current `main`.
2. Read the mandatory documents and current implementation.
3. Create one branch from current `main`.
4. Define goal, acceptance criteria, exclusions, and expected files.
5. Implement one vertical slice.
6. Run focused validation.
7. Review the complete diff.
8. Fix findings.
9. Run applicable repository and browser gates.
10. Open a draft PR.
11. Review PR output, CI, accessibility, security, responsive behaviour, and scope.
12. Fix final findings.
13. Squash-merge.
14. Delete the branch.
15. Refresh `main` before the next slice.

A later slice must not start from an unmerged feature branch.

## 3. Global stop conditions

Stop before merge when any of these occur:

- the implementation follows the superseded Explore/Full Reference split;
- a source card remains only an outbound-link decision surface where profiles are required;
- unfinished Sign in, Submit, Suggest, cloud, or moderation actions are publicly promoted;
- profile level or verification is overstated;
- a recommendation is described as universally best without contextual reasons;
- sourced facts, curator judgment, project decisions, and open questions are mixed;
- all 295 resources are rendered in one unpaginated result document;
- complete mobile and desktop result sets are duplicated in the same tree;
- fake verification sorting or other mislabeled functionality remains;
- horizontal overflow appears at a supported viewport;
- keyboard, focus, semantic, or touch behaviour regresses;
- TypeScript, lint, tests, build, data drift, or required browser checks fail;
- unsafe URL/media/network handling is introduced;
- paid/private content is copied, proxied, or persisted without permission;
- a slice begins implementing the next slice's scope.

## 4. Status legend

- `DONE` — squash-merged to `main`.
- `NEXT` — approved next slice.
- `PLANNED` — defined but not started.
- `PROOF` — requires evidence from a real OSS workflow.
- `BLOCKED` — requires an external dependency, decision, or credential.
- `DEFERRED` — intentionally outside the current proof stages.
- `SUPERSEDED` — old product decision remains in history/code until replaced.

## 5. Completed baseline

The following capabilities remain reusable unless an approved slice changes them:

- Next.js App Router application and CI/release gates;
- warm editorial design foundation;
- responsive header/footer and public content routes;
- validated 295-source catalogue across 11 categories;
- current search/filter URL state;
- resource cards and media fallbacks;
- six repository-maintained collections;
- browser-local Saved;
- public policy and curation pages;
- Supabase SSR/client and user-data schema groundwork;
- 20 enriched intelligence profiles;
- profile validation and evidence tooling;
- local context-engine provider;
- deterministic research-plan/reference-packet builders;
- seven read-only native MCP tools;
- reviewed media provenance and coverage tooling.

Completed code is not automatically approved as the future product model. Explore, Full Reference, optional details, public auth placeholders, and contribution placeholders are subject to the reset below.

## 6. Active status

| ID | Slice | Status | Depends on |
|---|---|---|---|
| 14.0 | Product direction, PRD, operating, architecture, and delivery reset | DONE | current `main` |
| 14.1 | Minimum source-profile and coverage-level data contract | NEXT | 14.0 |
| 14.2 | Canonical Browse architecture and pagination contract | PLANNED | 14.1 |
| 14.3 | Canonical `/resources` implementation: cards/list/table and pagination | PLANNED | 14.2 |
| 14.4 | Source Detail foundation for all 295 sources | PLANNED | 14.1, 14.3 |
| 14.5 | Verified intelligence sections for enriched profiles | PLANNED | 14.4, profile tooling |
| 14.6 | Universal browser-local Save across Browse, Detail, and Playbooks | PLANNED | 14.3, 14.4 |
| 14.7 | Local project Boards and notes | PLANNED | 14.6 |
| 14.8 | Deterministic Board research-pack export | PLANNED | 14.7, packet tooling |
| 14.9 | First OSS proof project and evidence report | PROOF | 14.8 |
| 15.0 | Homepage and global navigation redesign around proven loop | PLANNED | 14.9 |
| 15.1 | Collections-to-playbooks content and page conversion | PLANNED | 14.4, 14.8 |
| 15.2 | Saved workspace search/filter and mixed-object support | PLANNED | 14.7 |
| 15.3 | For AI page and public machine-readable exports | PLANNED | 14.5, 14.8 |
| 16.0 | Pattern Candidate schema and first 5–10 reviewed candidates | PLANNED | 14.9 |
| 16.1 | Pattern retrieval in website/export/MCP | PLANNED | 16.0 |
| 17.0 | Authentication UX/security contract refresh | DEFERRED | local Boards proof |
| 17.1 | Google + email/password + signup verification activation | DEFERRED | 17.0, SMTP, abuse controls |
| 17.2 | Cloud Saved/Boards and local-to-cloud merge | DEFERRED | 17.1, RLS review |
| 18.0 | Submission/report workflows and moderation | DEFERRED | 17.1, moderation owner |
| 19.0 | Styles/design-pack layer | DEFERRED | repeated proof projects and pattern evidence |

`5.4c` screenshot fallback work remains an independent bounded research track. It does not authorize broad screenshot publication, mass capture, or a screenshot-first product direction.

## 7. Slice 14.0 — Direction reset

### Goal

Make the human-research and machine-readable UI-taste direction the repository source of truth before feature development resumes.

### Deliverables

- `docs/product-direction.md`;
- updated `README.md`;
- updated `PRD.md`;
- updated `build-slices.md`;
- updated `AGENTS.md`;
- updated `docs/product-scope.md`;
- updated `docs/architecture-and-auth.md`.

### Acceptance criteria

- the product is no longer defined as only a resource index;
- DesignIndex is recorded as inspiration for the directory layer, not the final blueprint;
- Source Index, Research Intelligence, and UI Judgment are explicit;
- website, exports, and MCP share one canonical truth;
- `/resources` is the future canonical browser;
- Source Detail is required rather than optional;
- Listed/Profiled/Verified levels are explicit;
- local Boards and export precede auth/cloud work;
- signup verification and standard sign-in flows are distinguished;
- pattern work begins with reviewed candidates after a real proof project;
- old detailed slice history remains available through Git history and evidence files;
- no runtime, schema, data, dependency, Supabase, or deployment state changes.

### Exclusions

- no UI implementation;
- no route change;
- no authentication activation;
- no database migration;
- no catalogue/profile data mutation;
- no screenshot publication;
- no homepage redesign.

## 8. Slice 14.1 — Minimum source-profile and coverage-level contract

### Goal

Define the smallest extensible Source contract required by Browse, Detail, export, and MCP without over-specifying the mature platform.

### Required fields

```yaml
id:
slug:
name:
url:
domain:
summary:
category:
sourceType:
accessModel:
bestFor:
capabilities:
contentObjects:
platforms:
frameworks:
integrationMethods:
limitations:
profileLevel:
status:
verifiedAt:
evidence:
```

### Acceptance criteria

- all 295 entries remain represented;
- every entry resolves to Listed, Profiled, or Verified;
- existing intelligence profiles map without losing evidence;
- missing optional intelligence does not produce invented facts;
- profile level is deterministic or explicitly reviewed;
- source schema, website, and MCP remain compatible;
- generated data remains network-free and deterministic;
- focused and full data checks pass.

### Exclusions

- no Browse redesign;
- no new profiles merely to raise counts;
- no semantic/vector search;
- no live verification;
- no Supabase catalogue copy.

## 9. Slice 14.2 — Canonical Browse contract

### Goal

Specify the one `/resources` browser before changing Explore and Full Reference code.

### Decisions to freeze

- query/filter/sort/view/page URL fields;
- 24-card and 50-row page sizes;
- card/list/table responsibilities;
- one responsive result rendering strategy;
- source profile as primary navigation;
- separate Visit source, Save, and conditional Compare actions;
- Similar Sources behaviour;
- back/forward and scroll/position restoration;
- legacy URL and query-state handling;
- removal of mislabeled verification sorting;
- loading, empty, error, and unavailable-source states.

### Deliverables

- page contract;
- interaction/state contract;
- responsive contract;
- migration/redirect plan;
- browser test matrix;
- explicit exclusions.

No runtime implementation belongs in 14.2.

## 10. Slice 14.3 — Canonical Browse implementation

### Goal

Replace competing catalogue browsers with a paginated, shareable, responsive `/resources` experience.

### Acceptance criteria

- no default route renders all 295 result objects;
- no duplicate full mobile/desktop result mapping;
- URL state restores query, filters, sort, view, and page;
- verification sorting uses genuine dates only;
- cards/list/table serve distinct tasks;
- internal Detail navigation is primary;
- Save remains functional;
- legacy URLs preserve useful query state;
- browser, accessibility, performance, and regression gates pass.

## 11. Slice 14.4 — Source Detail foundation

### Goal

Create `/resources/[slug]` for every catalogue source with truthful progressive coverage.

### Acceptance criteria

- all 295 stable slugs resolve;
- Listed pages remain useful without pretending to be enriched;
- Profiled/Verified pages progressively reveal supported fields;
- actions include Save, future Add to board, and Visit source;
- limitations and freshness are visible;
- Similar Sources uses defensible peer/category logic;
- metadata and sitemap behaviour are defined;
- external-source failure does not break the Tessli profile;
- responsive and accessibility gates pass.

## 12. Slice 14.5 — Intelligence profile detail

Expose capabilities, discovery model, integrations, agent access, workflow fit, governance, evidence, and verification for enriched profiles.

Requirements:

- same truth as MCP;
- evidence claims retain source URLs and dates;
- repository verification is not live-provider verification;
- credentials and persistence rules are explicit;
- missing fields degrade honestly;
- no paid/private content is copied into Tessli.

## 13. Slice 14.6 — Universal local Save

Make Save available in:

- Browse cards/list/table;
- Source Detail;
- collection/playbook items;
- Saved workspace.

Use one versioned local contract, preserve legacy migration, provide accessible announcements, synchronise tabs where practical, and require no account.

## 14. Slice 14.7 — Local project Boards

Minimum capabilities:

- create, rename, and delete local Board;
- project goal and constraints;
- add/remove sources;
- per-item notes;
- selected/rejected state;
- unresolved questions;
- versioned local persistence;
- clear local-only explanation.

No auth, cloud sync, sharing, collaboration, or rich-text editor.

## 15. Slice 14.8 — Research-pack export

Export compact deterministic Markdown from one Board.

Requirements:

- sourced facts, project judgment, and open questions remain distinct;
- source/evidence URLs are retained;
- selected and rejected directions are represented;
- output is deterministic and compact enough for model context;
- export works without an account;
- existing packet-builder logic is reused where appropriate.

## 16. Slice 14.9 — First OSS proof project

Recommended project: Online Scope Studio homepage.

Required evidence:

- brief and constraints;
- 8–12 selected sources;
- rejected directions;
- exported research pack;
- Codex handoff;
- browser screenshots/checks;
- twelve-dimension human review;
- time and iteration comparison;
- findings that update profiles or Pattern Candidates.

Exit criterion: state whether Tessli produced a smaller/better context pack, fewer rebuild loops, or improved review outcomes. Do not claim UI taste.

## 17. Homepage and navigation boundary

Homepage redesign begins only after the research loop works.

Future homepage content:

- task-based hero search;
- real coverage facts;
- research-goal entry points;
- featured playbooks;
- recently verified sources;
- human/MCP demonstration;
- research-pack explanation;
- limited source examples rather than the complete catalogue.

Primary navigation direction:

```text
Browse | Collections | For AI
```

Utilities:

```text
Search | Saved
```

Sign in remains withheld until cloud workspace value exists.

## 18. Authentication boundary

Authentication resumes only after local Boards/export prove repeated value.

Future signup:

```text
Google OAuth
or
first name + last name + email + password
→ email verification OTP
→ optional local-data merge
```

Future standard sign in:

```text
Google OAuth
or
email + password
```

Do not require email OTP after every normal password sign-in. Optional MFA uses authenticator TOTP.

## 19. Explicit deferrals

Until proof stages justify them, do not implement:

- cloud Boards;
- account activation;
- public submission/moderation UI;
- a large Patterns product;
- a Styles product;
- screenshot scraping at catalogue scale;
- vector search as a substitute for curation;
- automatic aesthetic scoring;
- payments;
- teams;
- Figma/browser extensions;
- more MCP tools without stable underlying data.
