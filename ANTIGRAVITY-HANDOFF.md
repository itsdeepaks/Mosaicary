# Antigravity Handoff — Tessli

Recorded: **2026-07-31**  
Repository: `https://github.com/itsdeepaks/tessli`  
Expected starting branch: `main`  
Expected starting commit when this handoff was written: `ef7c147c98b042dd5f7f22462dc3bc4fbdb8560e`

This file is a handoff prompt, not a replacement for repository truth. Antigravity must inspect the current repository, pull-request state, CI, deployments, documentation, schemas, and code before making decisions.

---

## Pasteable prompt for Antigravity

You are taking over development of the **Tessli** repository.

Do not begin by editing code. First establish repository truth, understand the complete product, audit the current plan, and then continue exactly one vertical slice through the repository's GitHub slice loop.

### 1. Pull and verify the latest repository

Use the latest `main`, not the commit recorded in this handoff if the repository has advanced.

```bash
git clone https://github.com/itsdeepaks/tessli.git
cd tessli
git checkout main
git pull --ff-only
git status
git log --oneline --decorate -20
```

Also inspect:

- open pull requests;
- open issues;
- remote branches;
- recent merged PRs and their review/CI evidence;
- GitHub Actions workflows and latest runs;
- Vercel project/deployment state if available;
- whether any branch contains unmerged work that is genuinely newer than `main`.

Do not assume an old remote feature branch is active merely because it still exists. Verify whether it was already squash-merged.

### 2. Mandatory reading order

Read these files completely before proposing work:

1. `AGENTS.md`
2. `PRD.md`
3. `build-slices.md`
4. `design.md`
5. `README.md`
6. `docs/product-scope.md`
7. `docs/component-contracts.md`
8. `docs/page-contracts.md`
9. `docs/data-and-media-contract.md`
10. `docs/architecture-and-auth.md`
11. `docs/quality-gates.md`
12. relevant files under `docs/slices/`
13. `schemas/catalogue.schema.json`
14. `schemas/collections.schema.json`
15. relevant Supabase/auth contracts and tests
16. current application code under `web/`

Then read the future UI-intelligence track:

17. `UI-INTELLIGENCE-ROADMAP.md`
18. `docs/research/landingfolio-product-study-2026-07-31.md`
19. `docs/contracts/ui-intelligence-provider-boundary.md`
20. `schemas/resource-intelligence-profile.schema.json`
21. `docs/slices/13.0-ui-intelligence-roadmap-contract.md`

Also inspect the original catalogue source and generated data:

- `lib_data/design-resource-library-295.csv`
- `web/data/catalogue.json`
- `web/data/catalogue-validation.json`
- catalogue generation and validation scripts/tests

Do not rely on this handoff, chat summaries, branch names, or commit messages instead of reading the files and code.

### 3. Product understanding you must confirm

Tessli is a curated design-resource index, not a scraped screenshot gallery, AI-generated resource dump, paid-library proxy, or marketplace.

The original public catalogue contains 295 repository-managed resources across 11 practical categories. Phase 1 public discovery is already implemented and production-cutover work was completed.

The product principles include:

- curated, not crowded;
- search first;
- truthful interface;
- original work;
- accessible calm;
- repository-managed public catalogue;
- no fake users, ratings, trends, curators, or popularity;
- no redistribution of paid/private design content;
- no unsafe external-image or metadata proxying.

The approved visual direction is a warm editorial system using off-white surfaces, charcoal text, restrained orange, Newsreader display typography, Instrument Sans interface typography, sharp cards/panels, fine borders, subtle grain, restrained motion, and no generic glow-heavy SaaS styling.

### 4. Known repository state at the time of handoff

Verify every item against current `main` before using it.

#### Completed public product work

- Phase 1 Explore, Collections, Full Reference, Saved, legal/content routes, responsive UI, catalogue migration, release hardening, and production cutover were completed.
- The catalogue remains repository-managed.
- Browser-local saves work without an account.
- Current CI includes formatting, typecheck, lint, tests, catalogue drift, production build, route/browser smoke checks, and responsive evidence.

#### Supabase and authentication track

The repository deliberately supports development without real Supabase credentials.

Expected public environment contract:

```dotenv
NEXT_PUBLIC_SITE_URL=https://tessli.vercel.app
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Rules:

- never put a service-role key or `sb_secret_...` key in `NEXT_PUBLIC_*`;
- never commit real credentials;
- do not invent a third Supabase secret;
- keep the application truthful when Supabase is unavailable;
- do not claim live authentication works until it has been tested against a real approved project.

Known slice state when this handoff was written:

- `10.1a` local Supabase SSR clients and environment contract: **DONE**
- `10.1b` real Supabase cloud project link and smoke test: **DEFERRED**
- `10.1c` credential-ready Supabase activation contract: **DONE**
- `10.2a` credential-ready `/auth` shell and unavailable state: **DONE**
- `10.2b` live password, six-digit OTP, and Google activation: **BLOCKED** until a real project exists
- `11.1` user-data schema and RLS: **PLANNED**, dependent on real Supabase setup
- `11.2` cloud saves/private collections/notes/local import: **PLANNED**
- `12.1` submit/suggest/report workflows: **PLANNED**
- `12.2` moderation and transactional email: **PLANNED**

The `/auth` route is a responsive, credential-ready shell. Its authentication controls remain disabled when Supabase is not configured. Do not replace this truthful state with fake sessions or mocked production behaviour.

PR #38's exact feature-branch preview was READY and its GitHub CI/release checks passed. A later Vercel status on the squash-merged commit encountered the account build-rate limit; treat that as a deployment quota condition, not evidence of a code failure. Re-verify current deployment state rather than assuming either condition still applies.

#### UI-intelligence track

Slice `13.0` was merged and records a future agent-native design-resource intelligence direction.

The goal is not screenshot volume. The goal is a source-selection and research-orchestration layer that can explain:

- which resource suits a task;
- why it suits the task;
- what it exposes;
- what may be stored;
- what requires user-owned credentials;
- what an agent should extract before original implementation.

Known future sequence:

- `13.1` capability-profile pilot for 20 high-value resources
- `13.2` validation, evidence freshness, and review tooling
- `13.3` resource intelligence UI and advanced filters
- `13.4` research-stack builder and Markdown reference-packet export
- `13.5` read-only native Tessli MCP
- `13.6` controlled Landingfolio official-MCP experiment
- `13.7` provider-adapter framework and security controls
- `13.8` baseline-versus-Tessli-assisted evaluation harness

No `13.1` implementation had been started when this handoff was created.

### 5. First deliverable: repository audit

Before editing, produce a concise evidence-backed audit containing:

1. current `main` SHA;
2. open PRs and issues;
3. branches that contain genuinely unmerged work;
4. latest successful/failed CI and why;
5. latest production and preview deployment state;
6. implemented slices versus ledger status;
7. documentation/code/schema contradictions;
8. security or correctness blockers;
9. stale assumptions in this handoff;
10. the highest-value unblocked next slice.

Use confidence labels such as `[Certain]`, `[Likely]`, and `[Unknown]` for important claims.

### 6. You may improve the plan, but not casually rewrite it

Challenge the existing roadmap when evidence supports doing so.

A plan improvement is valid when it:

- removes a false dependency;
- exposes an overlooked security or data-integrity requirement;
- splits an oversized slice into independently reviewable vertical slices;
- reorders work to avoid credentials or external blockers;
- adds missing validation, migration, rollback, accessibility, or observability work;
- reduces duplicated or dead work;
- produces a more testable product checkpoint.

A plan improvement is not valid merely because another architecture is fashionable or because you prefer a different stack.

If the active documents conflict, stop implementation and use a dedicated documentation/decision slice to reconcile them. Record the reason, acceptance criteria, exclusions, and the exact later slices affected.

Do not silently mark blocked work complete.

### 7. Choosing the next slice

After the audit, select one next slice using this order:

1. fix a real regression, security issue, broken CI, or documentation/code contradiction;
2. complete an already-started but genuinely unmerged slice;
3. continue the highest-value unblocked active product slice;
4. when Supabase credentials are still unavailable, choose a credential-free slice rather than faking backend completion;
5. the UI-intelligence track may be intentionally reprioritized, but record that decision clearly and implement only its next approved slice.

Potential credential-free candidate:

- Slice `13.1`, adding exactly 20 evidence-backed resource intelligence profiles plus deterministic validation/tests, with no public UI, provider calls, screenshots, Supabase work, or MCP implementation.

This is a candidate, not an order. Your audit may reveal a more important unblocked slice.

### 8. Mandatory GitHub slice loop

For the chosen slice, follow this exact loop:

1. Read current `main`.
2. Read `PRD.md`, `build-slices.md`, `AGENTS.md`, `design.md`, and relevant contracts/schemas.
3. Create a branch from current `main`.
4. Define exact acceptance criteria and exclusions.
5. Implement one vertical slice.
6. Run focused tests.
7. Review the complete diff.
8. Fix findings.
9. Run all available CI checks.
10. Commit intentionally.
11. Open a draft PR.
12. Review PR diff, browser evidence when relevant, and exact-head CI.
13. Fix every final issue.
14. Squash-merge.
15. Delete the branch.
16. refresh/pull updated `main`.
17. Start no later slice until the previous slice is merged.

Do not create a chain of dependent unmerged branches.

### 9. Pull-request evidence contract

Every PR must state:

- slice ID and goal;
- exact acceptance criteria;
- exclusions;
- files expected and actually changed;
- focused tests run;
- full checks run;
- browser sizes checked when UI changes;
- accessibility notes;
- security/privacy notes;
- complete-diff findings and fixes;
- intentional deviations;
- credential/external blockers;
- exact head SHA and CI/deployment evidence.

Do not claim a check passed when it was not run.

### 10. Non-negotiable engineering constraints

- Preserve all 295 catalogue resources unless a reviewed catalogue change explicitly modifies the source.
- Generated catalogue data must remain deterministic.
- Do not duplicate the public catalogue into Supabase during Phase 1.
- User-owned tables require RLS and tests as anonymous and authenticated users.
- Never expose service-role keys.
- Never commit `.env` files or real credentials.
- No arbitrary remote SVG injection.
- No unrestricted image/metadata proxy.
- Any metadata fetcher requires explicit SSRF controls.
- No paid/private provider proxying or screenshot mirroring.
- External provider output is transient by default unless rights explicitly permit persistence.
- Do not introduce fake social proof, trends, metrics, or account state.
- Mobile is a recomposition, not a scaled-down desktop.
- Preserve keyboard, focus, reduced-motion, semantic, and WCAG 2.2 AA requirements.
- Add no dependency unless it materially reduces risk or complexity.
- Do not mix product delivery, auth, catalogue, UI-intelligence, and unrelated refactors in one PR.

### 11. Expected response before implementation

Return this structure after your audit:

```text
Repository state
- current main:
- open PRs/issues:
- unmerged work:
- CI/deployment:

What has been completed
- ...

Contradictions or risks
- ...

Plan assessment
- keep/change:
- evidence:

Recommended next slice
- ID/title:
- why now:
- exact acceptance criteria:
- exclusions:
- expected files:
- focused tests:
- full checks:

Decision
- proceed with the slice, or
- first create a dedicated plan-reconciliation slice
```

Once the decision is justified, proceed through the complete slice loop. Stop at the next clean merged checkpoint and report the final `main` SHA, merged PR, tests, CI, deployment status, remaining blockers, and the next recommended slice.

---

## Handoff maintenance rule

This file captures a moment in time. Future agents should update or replace it only in a dedicated documentation slice when its state snapshot becomes materially stale. Repository code, current schemas, `build-slices.md`, merged PRs, and CI/deployment evidence always outrank this handoff.
