# MVP roadmap

## Roadmap rules

- Execute one approved slice at a time and stop after its validation.
- Each slice must leave a usable user-visible outcome.
- Do not redesign unrelated surfaces or add post-MVP infrastructure opportunistically.
- Update this file with actual outcomes only after implementation is verified.

## Slice 1 — Project and Project Context vertical slice

**User-visible outcome:** Create a local project, enter structured product/design context, review and edit it, persist it across restarts, and export it as Markdown or YAML.

**Likely systems/files:** Next.js/TypeScript scaffold, accessible application shell, `/projects` routes, project/context forms, Zod schemas, SQLite/Drizzle schema and migrations, export services, unit tests, one Playwright flow, README commands. Preserve the current preview unchanged or accessible as a legacy artifact.

**Dependencies:** Approve the four blocking foundation decisions in `open-decisions.md`; create a recoverable Git baseline; Node and pnpm are available locally.

**Acceptance criteria:**

- A project can be created with name, summary, target users, primary jobs, brand traits, technical/content constraints, accessibility target, assumptions, and open questions.
- Required fields and validation errors are clear and keyboard accessible.
- A saved project and context survive a server restart.
- The context can be edited without losing the prior created/updated timestamps; context schema version is recorded.
- Markdown and YAML exports contain stable headings/keys and no application secrets or absolute repository contents.
- The flow works at 390px and 1440px without horizontal overflow.
- Empty, validation-error, saved, and export states are verified.
- No AI key or network service is required.

**Validation commands to establish in this slice:**

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright test tests/e2e/project-context.spec.ts
```

Also inspect the running flow in a browser at 390 × 844 and 1440 × 1000, including console/page errors.

**Out of scope:** Resource-dashboard redesign, resource import, pattern retrieval, AI generation, repository scanning, MCP, visual review, accounts, cloud sync.

## Slice 2 — Resource library migration and provenance

**User-visible outcome:** Browse the existing 295 resources inside the application with accessible search/filter/sort, freshness/provenance details, and a repeatable seed import.

**Likely systems/files:** `Resource` schema, CSV importer, seed command, `/resources`, filters, pagination or incremental rendering, import report, tests; archive plan for `index.html`.

**Dependencies:** Slice 1 persistence and application shell.

**Acceptance criteria:** 295 rows import once without duplicates; counts match the source; import is idempotent; invalid rows produce a report; filters match category/access data; controls have labels; 390px has no overflow; source and verification date are visible.

**Validation:** Slice 1 checks plus importer unit/integration tests and browser tests for search, filters, empty results, and mobile layout.

**Out of scope:** Automated link crawling, screenshots, pricing re-verification, pattern creation, visual redesign beyond fitting the app shell.

## Slice 3 — Curated Pattern Library

**User-visible outcome:** Browse and inspect 30–50 manually authored UI/UX patterns with when-to-use, when-not-to-use, content, responsive, accessibility, failure, and reference guidance.

**Likely systems/files:** `Pattern`, `Reference`, and provenance schemas; curated seed format; pattern list/detail routes; task-oriented filters; authoring validation.

**Dependencies:** Agreed taxonomy and rights/provenance policy; Slice 2 resources can be linked but are not required for every pattern.

**Acceptance criteria:** At least 30 reviewed patterns cover common marketing, SaaS, form, onboarding, dashboard, settings, billing, empty/error, and destructive-action problems; each passes schema/content checks; references are attributed; search explains matches.

**Validation:** Schema tests, seed validation, route/browser tests, broken internal-reference check, mobile/desktop inspection.

**Out of scope:** Embeddings, automated screenshot capture, public submissions, bulk scraping.

## Slice 4 — Screen planning and Design Decision Packs

**User-visible outcome:** Define a target Screen, retrieve a small compatible pattern set, record choices, assemble an editable Design Decision Pack, and export Markdown/YAML.

**Likely systems/files:** `Screen`, `DesignDecision`, and `DesignDecisionPack` schemas/services/routes; rule-based retrieval; pack editor; exporters; version history.

**Dependencies:** Project Context and Pattern Library.

**Acceptance criteria:** Retrieval returns no more than five candidates with relevance, risks, and missing context; rejected alternatives can be recorded; packs cover hierarchy, components, states, responsive, interaction, accessibility, references, avoid rules, and verification criteria; exports are deterministic and compact.

**Validation:** Ranking/service tests, export snapshots, create/edit/version browser flow, accessibility and responsive inspection.

**Out of scope:** LLM synthesis, MCP, implementation generation, automatic review.

**Private MVP milestone:** Slices 1–4 prove the core value without requiring an AI subscription.

## Slice 5 — Repository and component context

**User-visible outcome:** Attach an approved local repository path, inspect a safe bounded inventory, and map existing tokens/components into Project Context.

**Likely systems/files:** Path allowlist, repository scanner, component/token adapters, scan report, context-version diff UI.

**Dependencies:** Stable context schema and explicit path/security policy.

**Acceptance criteria:** Scanner respects the approved root and ignores secrets/build artifacts; results cite files; user reviews changes before approving a new context version; unsupported stacks fail clearly.

**Validation:** Fixture repositories, path traversal/secret exclusion tests, context diff browser flow.

**Out of scope:** Arbitrary code execution, package installation in scanned repos, every framework, remote repository cloning.

## Slice 6 — Compact MCP and CLI exports

**User-visible outcome:** Codex or another local MCP client can request a compact approved Project Context, find patterns, and fetch a specific Design Decision Pack.

**Likely systems/files:** Local stdio MCP entry, three read-oriented tools initially, shared domain services, setup docs, fixture client tests.

**Dependencies:** Stable schemas from real use of Slices 1–5.

**Acceptance criteria:** Tool schemas are narrow and documented; no arbitrary filesystem access; default responses remain within defined size budgets; selected records include IDs and versions; setup works locally from clean instructions.

**Validation:** MCP protocol tests, output-size tests, client smoke test, permission/path tests.

**Out of scope:** Public remote MCP, write tools, `review_ui`, authentication, hosted service.

## Slice 7 — Browser Review

**User-visible outcome:** Review an allowed local URL against a selected Pack at required viewports/states and receive evidence-backed findings.

**Likely systems/files:** Playwright worker, axe-core, capture storage, `Review` schema/routes, criteria evaluator, screenshot viewer.

**Dependencies:** Stable Pack verification criteria and safe host/path rules.

**Acceptance criteria:** Captures required viewports; records console/network errors, overflow, accessibility results, and screenshots; distinguishes pass/fail/not-tested; findings cite criteria and evidence; reruns are traceable to Pack version.

**Validation:** Purpose-built good/bad fixture pages, browser tests, blocked-host tests, deterministic evaluator tests.

**Out of scope:** Automatic repair, a single visual-quality score, unapproved production URLs, vision-model judgment.

## Slice 8 — Project Rules and learning loop

**User-visible outcome:** Promote accepted/rejected decisions and review corrections into editable project-wide rules that affect later retrieval and packs.

**Likely systems/files:** `ProjectRule` schema/routes, rule provenance, retrieval compatibility layer, conflict UI.

**Dependencies:** Decisions, Packs, and Reviews used on real projects.

**Acceptance criteria:** Rules cite their source; conflicts are visible; disabled/revised rules remain auditable; retrieval shows which rules affected ranking or exclusion.

**Validation:** Rule precedence/conflict tests and end-to-end retrieval scenario.

**Out of scope:** Cross-user learning, hidden personalization, model fine-tuning.

## Slice 9 — Optional AI assistance and benchmark

**User-visible outcome:** Opt into provider-backed context suggestions and pack drafting, review a structured diff, and compare engine-assisted tasks against a baseline.

**Likely systems/files:** Provider adapter, prompt/version registry, structured-output validation, cost/usage log, benchmark fixtures and report.

**Dependencies:** Manual workflow is already useful; explicit provider/privacy decision.

**Acceptance criteria:** Manual mode still works; model outputs are validated; user approves changes; prompts and model versions are traceable; benchmark reports tokens, iterations, failures, and human ratings.

**Validation:** Mock-provider tests, malformed-output tests, opt-in/privacy checks, benchmark run.

**Out of scope:** Custom training, automatic autonomous implementation, public product launch.

## Recommended next action

Approve or revise Slice 1 only. Do not begin dashboard polish. Before implementation, initialize Git and resolve the blocking decisions documented in `open-decisions.md`.
