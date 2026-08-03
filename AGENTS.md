# AGENTS.md — Tessli Repository Rules

This file is mandatory reading for every agent, contributor, and automated coding session working in this repository.

## 1. Active repository direction

Tessli is a human-facing design-research product and a machine-readable foundation for future UI-taste workflows.

The 295-source catalogue is the Source Index layer. It is not the complete product and must not be treated as proof of design taste.

The active direction has three layers:

1. **Source Index** — where to research;
2. **Research Intelligence** — which source fits, why, and with what limitations;
3. **UI Judgment** — reviewed patterns, project constraints, selected/rejected precedents, and evaluated outcomes.

Website pages, exports, and MCP must use the same canonical data.

Older UI-intelligence research is no longer an unrelated dormant track. Relevant profile, packet, MCP, and evaluation work is part of the active Tessli direction when an approved slice explicitly uses it. Preserve all historical research and provenance.

## 2. Mandatory read order

Always read, in order:

1. current `main` state;
2. `docs/product-direction.md`;
3. `PRD.md`;
4. `build-slices.md`;
5. this `AGENTS.md`;
6. `design.md` for visible UI work;
7. `docs/product-scope.md`;
8. `docs/architecture-and-auth.md` where applicable;
9. relevant contracts under `docs/`;
10. relevant schemas;
11. existing code and tests in the affected area;
12. completed slice evidence where the new work depends on it.

Do not rely on a previous chat summary instead of repository truth.

When documents conflict, stop and resolve them in a dedicated documentation slice.

## 3. One-slice rule

Implement exactly one vertical slice per branch and pull request.

Do not mix:

- data-contract work with visible page redesign;
- Browse consolidation with homepage redesign;
- Source Detail foundation with Boards;
- local Boards with authentication/cloud sync;
- source-profile work with unrelated media enrichment;
- pattern research with mass pattern-page generation;
- schema changes with unrelated visual polish;
- screenshot research with production publication;
- refactors not required by the slice.

Record later improvements and leave them out.

## 4. Required slice loop

1. Refresh current `main`.
2. Read the mandatory documents.
3. Create one branch from current `main`.
4. Define goal, acceptance criteria, exclusions, and expected files.
5. Implement one vertical slice.
6. Run focused tests/checks.
7. Review the complete diff.
8. Fix findings.
9. Run all applicable repository/browser gates.
10. Commit intentionally.
11. Open a draft PR.
12. Review diff, UI, CI, accessibility, security, and scope.
13. Fix final findings.
14. Squash-merge.
15. Delete the branch.
16. Refresh `main` before the next slice.

Never start a later slice from an unmerged feature branch.

## 5. Branch and commit conventions

Examples:

```text
docs/product-direction-reset
feat/source-profile-contract
feat/canonical-browse
feat/source-detail
feat/local-boards
feat/research-pack-export
fix/mobile-filter-overflow
```

Commit prefixes:

```text
chore:
feat:
fix:
test:
docs:
refactor:
```

Use intentional messages. Squash-merge unless repository policy changes.

## 6. Pull request contract

Every PR states:

- slice ID and goal;
- exact acceptance criteria;
- exclusions;
- expected and actual changed files;
- focused checks;
- full checks;
- browser widths checked;
- accessibility notes;
- security/governance notes;
- data/provenance notes;
- complete-diff findings;
- intentional deviations;
- external setup or credentials still blocked;
- rollback plan.

Open as draft until implementation, focused validation, and first diff review are complete.

## 7. Product truth rules

Non-negotiable:

- do not describe Tessli as only a directory;
- do not claim that catalogue size creates AI taste;
- do not claim a source is universally best;
- explain contextual fit and limitations;
- distinguish sourced facts, curator judgment, project decisions, and unresolved questions;
- do not overstate Listed entries as Profiled or Verified;
- repository verification is not live provider verification;
- do not show fake ratings, popularity, trends, users, curators, or activity;
- do not expose unfinished public actions;
- public navigation contains only working destinations;
- do not claim outcome improvement without recorded evidence.

## 8. Canonical product decisions

Unless a later approved documentation slice changes them:

- `/resources` becomes the one canonical source browser;
- pagination replaces a complete 295-result document;
- mobile and desktop must not render duplicate complete result sets;
- `/resources/[slug]` is required for every source;
- internal profile navigation is primary; Visit source is a separate action;
- Save must work across Browse, Source Detail, and playbooks;
- comparison is limited to meaningful peer groups;
- Similar Sources is the default alternative-discovery mechanism;
- Listed/Profiled/Verified levels are explicit;
- local Boards and export precede authentication;
- Pattern Candidates begin only after a real OSS proof workflow;
- homepage redesign follows, not precedes, the core research loop.

## 9. Source-profile and evidence rules

Source records must preserve stable IDs and slugs.

Coverage levels:

### Listed

Minimum source identity, type, access, concise sourced description, and status.

### Profiled

Adds capabilities, best-for, content objects, platforms/frameworks, discovery, integrations, workflow fit, and limitations.

### Verified

Adds evidence, dates, confidence, agent-interface details, credential rules, persistence/redistribution rules, human review, and freshness.

Requirements:

- no invented optional fields;
- evidence claims retain source URL and verification date;
- exact source boundaries and limitations remain visible;
- profile generation remains deterministic;
- website and MCP consume the same canonical profile truth;
- missing enrichment degrades honestly;
- paid/private content is never copied merely because a source is indexed.

## 10. Research-pack rules

Research packs must remain model-independent and human-readable.

They distinguish:

- sourced facts;
- curator/project judgment;
- selected decisions;
- rejected directions;
- unresolved questions.

They retain:

- task and audience;
- project constraints;
- source IDs/names/URLs;
- selection rationale;
- capabilities;
- limitations;
- evidence links;
- implementation reminders;
- open decisions.

Do not dump every available profile field into model context. Prefer compact relevance.

## 11. Pattern rules

Do not mass-generate published patterns.

Initial pattern work is a manually reviewed candidate set.

A candidate requires:

- problem;
- when to use;
- when not to use;
- key rules;
- common failures;
- multiple example sources where possible;
- project usage/evaluation;
- review state and date.

Promote only after real use and human review.

## 12. Evaluation rules

The future UI-taste claim requires an evidence loop:

```text
brief
→ retrieval
→ research pack
→ agent build
→ browser verification
→ human review
→ approved/rejected decisions
```

Use the approved review dimensions:

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

Do not invent human scores. Preserve blind-review conditions where used.

## 13. Tessli design rules

`design.md` remains the visual source of truth.

Non-negotiable:

- Newsreader Variable for wordmark/display;
- Instrument Sans Variable for interface;
- warm off-white canvas;
- charcoal text;
- restrained orange signal;
- subtle page grain;
- borders carry hierarchy;
- restrained elevation and motion;
- real Tessli product UI is preferred marketing imagery;
- research/database surfaces may be denser than marketing surfaces;
- no generic AI-purple branding;
- no glassmorphism, glow gradients, cursor-follow effects, scroll-jacking, or meaningless floating 3D;
- no oversized rounded wrappers used as a substitute for hierarchy;
- no prebuilt theme that overrides Tessli tokens;
- no generic AI filler copy.

## 14. Visual implementation workflow

For every visible slice:

1. identify the page/component contract and approved references;
2. list allowed visible copy and facts;
3. implement only the selected slice;
4. render in a real browser;
5. check required widths;
6. compare layout, hierarchy, typography, spacing, media, borders, and states;
7. verify keyboard, focus, and touch behaviour;
8. record mismatches and fixes;
9. repeat until no material review issue remains.

Default widths:

```text
1440px
1024px
768px
390px
```

Also run a 320px overflow gate where the affected surface can compress that far.

Mobile is a recomposition, not a shrunken desktop page.

## 15. Accessibility rules

Required:

- semantic landmarks and heading order;
- keyboard-complete interaction;
- visible `:focus-visible` states;
- Escape and focus restoration for dialogs/sheets/menus;
- appropriate touch targets;
- reduced-motion support;
- no hover-only information;
- no invalid nested interactive markup;
- accessible result, save, and export announcements;
- meaningful labels, errors, empty states, and image fallbacks;
- WCAG 2.2 AA contrast targets;
- accessible OTP input if auth is later implemented.

Automated scans do not replace manual review.

## 16. Catalogue and generated-data rules

- preserve all 295 source rows;
- never silently drop invalid rows;
- stable IDs/slugs do not change accidentally;
- generated data is deterministic and network-free during normal build/test;
- public catalogue remains repository-managed during the proof stages;
- do not duplicate the catalogue in Supabase merely for browsing;
- do not invent media, pricing, status, capability, integration, or verification facts;
- every schema/data-source change is documented and tested.

## 17. External media and screenshot rules

Current media fallback order remains governed by the media contracts.

Requirements:

- fixed aspect ratios;
- complete fallback when all media fails;
- lazy loading below the fold;
- safe referrer behaviour;
- no remote SVG injection;
- no unrestricted proxy or wildcard optimiser;
- operator fetchers block private networks, unsafe protocols, excessive redirects, oversized responses, and unsupported MIME;
- anti-bot, login, consent, paywall, or challenge controls are not bypassed;
- screenshots require explicit bounded approval and human review;
- screenshot research does not authorize a screenshot-first product or mass publication;
- proprietary/paid screenshots are not persisted or redistributed without permission.

## 18. Authentication and database rules

Authentication is deferred until local Boards and research-pack export demonstrate value.

Future approved flow:

### Signup

- Google OAuth; or
- first name, last name, email, password;
- Terms/Privacy acceptance;
- email verification OTP;
- optional local-data merge.

### Standard sign in

- Google OAuth; or
- email and password.

Do not require email OTP after every normal password sign-in.

Optional MFA uses authenticator TOTP.

When auth resumes:

- use cookie-aware Supabase SSR clients;
- use custom SMTP before public email testing;
- all user-owned tables require RLS;
- test anonymous/authenticated/service boundaries;
- never expose service-role keys;
- include recovery, security notifications, session handling, export, and deletion;
- do not enable public Sign in until one complete flow and cloud-workspace benefit work.

## 19. Forms and moderation rules

Submission/reporting begins only in its approved later slice.

Required:

- server-side validation;
- URL normalization;
- duplicate detection;
- input limits;
- rate limiting;
- honeypot and later CAPTCHA only if justified;
- safe generic errors;
- moderation owner and status;
- audit timestamps;
- contextual source IDs;
- evidence/provenance retention.

Until then, do not promote nonfunctional public forms. Use a real GitHub issue template or remove the action.

## 20. Testing expectations

Use repository scripts:

```bash
npm run format:check
npm run typecheck
npm run lint
npm test
npm run catalogue:check
npm run build
```

Run relevant media/profile/coverage checks when affected.

Focused tests precede full checks.

Examples:

- schema and deterministic-generation tests;
- URL-state and pagination tests;
- interaction tests for Save/Boards/export;
- route and metadata tests for profiles;
- browser checks for responsive UI;
- MCP/profile parity tests;
- RLS tests only in approved cloud slices.

State exactly which checks were available and run.

## 21. Complete-diff review checklist

Review for:

- scope creep;
- conflicting product decisions;
- duplicate implementations;
- accidental generated/binary files;
- secrets or personal data;
- overstated profile/verification claims;
- dead routes/actions;
- unhandled states;
- mobile overflow;
- invalid interactive HTML;
- accessibility regressions;
- schema/data drift;
- unnecessary dependencies;
- unsafe external URL/media handling;
- paid/private content misuse;
- divergence between website and MCP truth;
- visual drift from `design.md`.

Fix findings before merge.

## 22. Dependency policy

- prefer platform and existing capabilities;
- add a dependency only when it materially reduces risk/complexity;
- use current official documentation;
- commit lockfile changes intentionally;
- avoid abandoned packages and broad theme kits;
- do not add auth, analytics, tracking, email, vector, screenshot, or AI dependencies before their approved slice;
- a vector database never replaces curated metadata and evidence.

## 23. Generated and binary files

- keep approved references/assets in documented locations;
- preserve provenance, dimensions, and intended use;
- do not commit temporary screenshots, traces, browser profiles, build output, env files, or downloaded fonts;
- never share font binaries without an explicit licensing/repository decision;
- generated research/evaluation artifacts stay separate from curated source truth unless explicitly promoted through review.

## 24. Current source documents

Always reconcile work with:

- `docs/product-direction.md`
- `PRD.md`
- `build-slices.md`
- `AGENTS.md`
- `design.md`
- `docs/product-scope.md`
- `docs/component-contracts.md`
- `docs/page-contracts.md`
- `docs/data-and-media-contract.md`
- `docs/architecture-and-auth.md`
- `docs/quality-gates.md`
- relevant schemas and slice evidence

The product-direction document wins when older historical text conflicts, but the conflict should still be corrected rather than ignored.
