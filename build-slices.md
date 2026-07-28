# Tessli Build Slices

Status: **active delivery plan**  
Rule: one independently reviewable vertical slice per branch and pull request.

## 1. Slice-loop protocol

Every slice follows this order:

1. Read current `main`.
2. Read `PRD.md`, `build-slices.md`, `AGENTS.md`, `design.md`, and the relevant schema/contracts.
3. Create a branch from current `main`.
4. Write exact acceptance criteria and exclusions in the PR description or slice note.
5. Implement one vertical slice.
6. Run focused tests.
7. Review the complete diff.
8. Fix findings.
9. Run all available CI checks.
10. Commit intentionally.
11. Open a draft PR.
12. Review the PR diff, browser output, and CI.
13. Fix final issues.
14. Squash-merge.
15. Delete the branch.
16. Refresh from updated `main`.
17. Start the next slice.

A later slice must not begin from an unmerged branch.

## 2. Global stop conditions

Stop and fix before merge when any of these occur:

- horizontal overflow at a supported viewport;
- missing or broken local assets;
- TypeScript, lint, test, or build failure;
- invented product facts or unfinished public links;
- invalid nested interactive markup;
- inaccessible keyboard or focus behaviour;
- unreviewed security-sensitive code;
- visual drift that would receive a design-review comment;
- undocumented schema or data-source change;
- a slice begins implementing the next slice's scope.

## 3. Status legend

- `DONE` — squash-merged to `main`.
- `NEXT` — approved next slice.
- `PLANNED` — defined but not started.
- `BLOCKED` — requires an external decision or credential.
- `DEFERRED` — intentionally outside the current release.

## 4. Slice status

| ID | Slice | Status | Depends on |
|---|---|---|---|
| 0.1 | Research, design contract, assets, brand preview | DONE | — |
| 0.2 | Repository operating contract | NEXT | 0.1 |
| 1.1 | Next.js application scaffold and CI baseline | PLANNED | 0.2 |
| 1.2 | Fonts, tokens, grain, responsive layout lab | PLANNED | 1.1 |
| 2.1 | Global header and navigation shell | PLANNED | 1.2 |
| 2.2 | Footer and launch route integrity | PLANNED | 2.1 |
| 3.1 | Explore hero composition | PLANNED | 2.2 |
| 3.2 | Search interaction and truthful facts | PLANNED | 3.1 |
| 4.1 | Catalogue CSV-to-JSON migration and validation | PLANNED | 1.1 |
| 4.2 | Discovery URL state, category, access, and sort controls | PLANNED | 3.2, 4.1 |
| 5.1 | Resource-card pilot with media fallbacks | PLANNED | 4.1 |
| 5.2 | Responsive resource grid and complete Explore composition | PLANNED | 4.2, 5.1 |
| 6.1 | Repository-maintained collection schema and launch data | PLANNED | 4.1 |
| 6.2 | Collections page and collection detail | PLANNED | 6.1 |
| 7.1 | Full Reference desktop table/list | PLANNED | 4.1 |
| 7.2 | Full Reference tablet/mobile filters and compact rows | PLANNED | 7.1 |
| 8.1 | Browser-local save store and legacy-key migration | PLANNED | 5.1 |
| 8.2 | Saved page, empty state, clear and undo | PLANNED | 8.1 |
| 9.1 | About, curation, content policy, privacy, and terms | PLANNED | 2.2 |
| 9.2 | Phase 1 preview hardening and production replacement | PLANNED | 5.2, 6.2, 7.2, 8.2, 9.1 |
| 10.1 | Supabase project integration and auth clients | BLOCKED | Phase 1, credentials |
| 10.2 | Auth shell, password, OTP, and Google | PLANNED | 10.1 |
| 11.1 | User-data schema and RLS | PLANNED | 10.1 |
| 11.2 | Cloud saves, private collections, notes, local import | PLANNED | 10.2, 11.1 |
| 12.1 | Submit, suggest, and report forms | PLANNED | 10.2, 11.1 |
| 12.2 | Moderation state and transactional email | PLANNED | 12.1, Resend |

## 5. Slice 0.2 — Repository operating contract

### Goal

Create the documents that every later agent and contributor must read before changing Tessli.

### Deliverables

- `PRD.md`
- `build-slices.md`
- `AGENTS.md`
- `schemas/catalogue.schema.json`

### Acceptance criteria

- files are internally consistent with the merged design and architecture documents;
- JSON Schema parses successfully;
- supporting files referenced by path exist;
- no runtime files change;
- complete PR diff is reviewed;
- the branch is squash-merged and removed.

### Exclusions

- no framework scaffold;
- no catalogue migration;
- no UI change;
- no dependency installation.

## 6. Slice 1.1 — Next.js application scaffold and CI baseline

### Goal

Introduce a production-capable Next.js App Router workspace without replacing the current static public experience until the new route is verified.

### Deliverables

- Next.js App Router and TypeScript configuration;
- package scripts for development, typecheck, lint, test, and build;
- Tailwind CSS configured without a prebuilt theme;
- minimal app shell and `/lab` route;
- static legacy files preserved or explicitly moved with redirect/deployment plan;
- GitHub Actions workflow for install, typecheck, lint, tests, and build;
- `.env.example` without secrets;
- updated README commands.

### Acceptance criteria

- clean install succeeds using the committed lockfile;
- typecheck, lint, tests, and production build pass;
- `/lab` renders a minimal semantic page;
- current catalogue files remain unchanged;
- no Supabase dependency or credentials yet;
- no redesign of the public Explore page;
- build output and deployment strategy are documented.

### Exclusions

- no final fonts or tokens;
- no header, hero, cards, filters, or auth;
- no data migration.

## 7. Slice 1.2 — Fonts, tokens, grain, and responsive layout lab

### Goal

Move the approved brand specimen into production-grade application primitives.

### Deliverables

- Newsreader Variable and Instrument Sans through `next/font`;
- CSS-variable colour, typography, spacing, border, radius, shadow, and motion tokens;
- subtle grain layer with forced-colours and reduced-motion safeguards;
- page container and 12/8/4-column responsive rules;
- `/lab` specimens for type, controls, sharp surfaces, and hero proportions.

### Acceptance criteria

- reviewed at 1440, 1024, 768, and 390px;
- `h1`/hero display tracking is `-0.015em`;
- section `h2` tracking is `-0.025em`;
- editorial cards and panels are square;
- controls use only approved small radii;
- no horizontal overflow;
- no font layout shift after load;
- visual comparison recorded.

## 8. Slice 2.1 — Global header and navigation

### Goal

Build the Phase 1 public header and mobile navigation.

### Scope

- Tessli wordmark;
- Explore, Collections, Resources, About;
- Saved shortcut;
- theme control only if both themes are genuinely designed;
- mobile menu sheet;
- active-route state.

### Acceptance criteria

- no fake avatar in Phase 1;
- keyboard complete, including Escape and focus return;
- mobile menu prevents background interaction;
- all visible routes exist or are withheld;
- no font or icon shift;
- screenshots approved before footer work.

## 9. Slice 2.2 — Footer and route integrity

### Goal

Build a truthful launch footer and route placeholders that are not dead ends.

### Scope

- Explore, Contribute, About, Legal groups;
- open-source and catalogue-use language;
- responsive composition;
- route-integrity test.

### Exclusions

- no newsletter;
- no inactive social links;
- no cookie settings without optional cookies.

## 10. Slice 3.1 — Explore hero composition

### Goal

Implement the approved first viewport using real fonts, responsive composition, and the geometric hero asset.

### Acceptance criteria

- copy matches the approved product promise;
- hero asset has stable dimensions and no colour overlay;
- desktop, tablet, and mobile compositions are intentional;
- LCP media is optimized;
- no continuous animation;
- no horizontal overflow;
- visual QA against `design/reference/explore-desktop.webp`.

## 11. Slice 3.2 — Search and truthful facts

### Goal

Complete the hero's useful interaction without implementing the full catalogue grid.

### Scope

- search input shell;
- Ctrl/Cmd+K focus;
- clear action;
- result-count announcement contract;
- four truthful facts.

### Acceptance criteria

- no fake metrics;
- keyboard and screen-reader behaviour pass;
- mobile fact grid remains readable;
- search state is ready for catalogue integration.

## 12. Slice 4.1 — Catalogue migration and validation

### Goal

Convert all 295 CSV entries into typed, validated application data.

### Deliverables

- migration script;
- generated JSON or TypeScript data;
- stable IDs and slugs;
- 11 categories;
- validation report for invalid URLs, missing descriptions, duplicate URLs/domains, and unknown access labels;
- deterministic output test.

### Acceptance criteria

- exactly 295 source rows are accounted for;
- no silent row loss;
- schema validation passes;
- generated output is deterministic;
- source CSV remains traceable;
- validation failures stop the build where appropriate.

## 13. Slice 4.2 — Discovery controls and URL state

### Scope

- category rail;
- access filters;
- sorting;
- All/Saved/Full Reference route navigation;
- URL serialization and restoration;
- mobile filter sheet.

### Acceptance criteria

- back/forward navigation works;
- shared URLs restore state;
- long category labels do not break layout;
- controls are keyboard and touch complete.

## 14. Slice 5.1 — Resource-card pilot

### Pilot dataset

Test at least 12 real entries covering:

- good preview image;
- favicon only;
- no media;
- transparent logo;
- dark and light artwork;
- long title;
- long description;
- free, freemium, paid, and open-source access;
- failed external image;
- duplicate-looking domains.

### Acceptance criteria

- whole card behaves as a native external link;
- save button is independent and valid HTML;
- modifier and middle click work;
- no broken layout without images;
- all fallback states are designed;
- fixed media aspect prevents layout shift.

## 15. Slice 5.2 — Explore composition

### Scope

- search/filter result integration;
- responsive grid;
- result count;
- no-results and error states;
- pagination or load-more decision;
- footer integration.

### Stop condition

Do not proceed to Collections until the complete Explore page passes visual, accessibility, and responsive QA.

## 16. Slices 6–9 — Phase 1 completion

### Collections

- repository-maintained collection data;
- no fake curators or trends;
- featured and compact card variants;
- collection detail route.

### Full Reference

- dense desktop list/table;
- filter sidebar;
- tablet/mobile filter sheet;
- compact mobile resource rows;
- supporting curation information.

### Saved

- local storage with versioned key;
- migration from Mosaicary/Tessli legacy keys;
- empty state;
- clear and undo;
- privacy explanation.

### Content and legal

- About;
- curation process;
- privacy;
- terms;
- content, trademark, preview-image, and takedown policy.

### Phase 1 release gate

- all required routes complete;
- all 295 resources validated;
- no unfinished navigation;
- full CI passes;
- preview deployment reviewed;
- visual QA at supported widths;
- production cutover has rollback instructions.

## 17. Slices 10–12 — Accounts and community

These begin only after Phase 1 and required credentials are available.

Requirements include:

- Supabase SSR/cookie clients;
- password, OTP, and Google auth;
- Resend custom SMTP;
- RLS-tested user schema;
- cloud saves and collections;
- local import;
- submit/suggest/report workflows;
- moderation state;
- rate limiting, honeypot, URL normalization, and duplicate detection;
- transactional confirmations.

No service-role key may enter browser code or GitHub.

## 18. Required evidence in every PR

Each PR description or final comment includes:

- exact acceptance criteria;
- exclusions;
- files changed;
- focused test results;
- full CI results;
- browser viewports checked;
- accessibility notes;
- security notes when applicable;
- complete-diff self-review findings and fixes;
- intentional deviations;
- confirmation that the branch started from current `main`.
