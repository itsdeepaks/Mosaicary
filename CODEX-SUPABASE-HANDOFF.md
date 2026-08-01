# Codex Handoff — Tessli Supabase and Remaining Product Slices

Recorded: **2026-08-01**  
Repository: `https://github.com/itsdeepaks/tessli`  
Expected starting branch: `main`  
Expected `main` commit when this handoff was written: `6094d4afc90b64c5c0b7af61ca38de841afc5472`

This file is a pasteable handoff prompt for Codex. It is not a substitute for current repository truth. Codex must inspect the latest `main`, pull requests, issues, CI, deployments, Supabase state, repository contracts, code, and tests before changing anything.

---

## Pasteable prompt for Codex

You are taking over the next delivery track for the **Tessli** repository.

Your job is to continue the account, authentication, user-data, and community slices through Tessli's strict GitHub slice loop. Do not treat this as permission to batch all remaining work into one branch or pull request. Complete exactly one independently reviewable vertical slice, squash-merge it, refresh `main`, and only then reassess the next slice.

The immediate candidate is **Slice 10.1b — Supabase cloud project link and client smoke test**. It includes an external-cost decision. Do not create a cloud project, choose an organization or region, or incur a recurring cost until the user explicitly approves the exact values and the current quoted cost.

### 1. Establish current repository truth

Start from the latest remote `main`, not the commit recorded above if the repository has advanced.

```bash
git clone https://github.com/itsdeepaks/tessli.git
cd tessli
git checkout main
git pull --ff-only
git status
git log --oneline --decorate -20
```

Inspect and report:

- current `main` SHA;
- open pull requests and issues;
- remote branches with genuinely unmerged work;
- latest GitHub Actions runs and failures;
- current Vercel production and preview state;
- current Supabase organizations and projects through available connected tooling or the authenticated CLI;
- whether a project named for Tessli already exists;
- any discrepancy between the delivery ledger, merged PRs, code, and deployment state.

Do not reuse an unrelated Supabase project merely because it already exists. Do not infer that a stale remote branch is active without comparing it to `main`.

### 2. Mandatory reading order

Read these files completely before proposing or implementing work:

1. `AGENTS.md`
2. `PRD.md`
3. `build-slices.md`
4. `README.md`
5. `design.md` only when visible UI work is involved
6. `docs/architecture-and-auth.md`
7. `docs/quality-gates.md`
8. `docs/slices/10.1a-local-supabase-client-contract.md`
9. `docs/slices/10.1c-credential-ready-supabase-activation.md`
10. `docs/slices/10.2a-credential-ready-auth-shell.md`
11. relevant later slice documents under `docs/slices/`
12. `web/.env.example`
13. `web/lib/supabase/config.ts`
14. `web/lib/supabase/browser.ts`
15. `web/lib/supabase/server.ts`
16. `web/lib/supabase/database.types.ts`
17. `web/app/auth/` and related auth-shell components
18. `web/tests/supabase-client-contract.test.mjs`
19. auth, route, browser, release, and deployment tests
20. current package manifests and lockfile

Also confirm the public-catalogue boundary in:

- `docs/data-and-media-contract.md`;
- `schemas/catalogue.schema.json`;
- catalogue generation and drift tests.

Do not rely on this handoff, chat history, old PR descriptions, or branch names instead of reading current code and repository documents.

### 3. Product and data boundaries to preserve

Tessli is a curated design-resource index. The 295-resource public catalogue remains repository-managed and must not be duplicated into Supabase as part of the account track.

Supabase is intended for user-owned and community data only:

- profiles;
- cloud-synced saves;
- private collections;
- collection items;
- notes;
- resource submissions;
- improvement suggestions;
- resource reports;
- moderation state.

Required principles:

- public browsing and browser-local saves continue without an account;
- user-owned tables use Row Level Security;
- RLS is tested as anonymous and authenticated users;
- no service-role or secret key enters browser code, `NEXT_PUBLIC_*`, GitHub, logs, fixtures, screenshots, or PR text;
- no fake session, fake authenticated screenshot state, or mocked production-success claim;
- no public auth-email testing until custom SMTP is configured;
- no public catalogue migration into Supabase;
- no unrelated UI-intelligence, media, catalogue, or redesign work in these slices.

### 4. Current repository state to re-verify

The following was true when this handoff was written. Recheck every item against current `main`.

Completed:

- Phase 1 public discovery, browser-local saves, legal/content routes, release hardening, and production cutover;
- Slice `10.1a` — local Supabase SSR clients and environment contract;
- Slice `10.1c` — credential-ready Supabase activation contract;
- Slice `10.2a` — credential-ready `/auth` shell with truthful unavailable/configured-not-activated states;
- UI-intelligence Slices `13.0` through `13.5`, including the local read-only Tessli MCP.

Not completed:

- `10.1b` — Supabase cloud project link and client smoke test: **DEFERRED pending explicit project approval**;
- `10.2b` — password, six-digit email OTP, and Google activation: **BLOCKED by 10.1b**;
- `11.1` — user-data schema and RLS: **PLANNED, dependent on 10.1b**;
- `11.2` — cloud saves, private collections, notes, and local import: **PLANNED, dependent on 10.2b and 11.1**;
- `12.1` — submit, suggest, and report forms: **PLANNED, dependent on 10.2b and 11.1**;
- `12.2` — moderation state and transactional email: **PLANNED, dependent on 12.1 and Resend**.

The public environment contract is expected to remain exactly:

```dotenv
NEXT_PUBLIC_SITE_URL=https://tessli.vercel.app
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

The Supabase values are blank in the committed example by design. Real values belong only in local, preview, and production environment settings outside Git.

### 5. Known external Supabase observation

At the time of this handoff, connected Supabase inspection found:

- one visible organization named **Online Scope Studio**;
- no project named **Tessli** or `tessli`;
- existing projects belonged to other products and must not be reused without an explicit architecture decision.

Treat this only as a dated observation. Re-list organizations and projects before making a recommendation.

Candidate values that require user approval rather than automatic use:

```text
Organization: Online Scope Studio
Project name: tessli
Region: ap-south-1
```

Do not assume these values are approved because they appear here.

### 6. First response before any cloud write

Before creating a branch or cloud resource, return a concise audit using this structure:

```text
Repository state
- current main:
- open PRs/issues:
- unmerged work:
- CI/deployment:

Supabase state
- visible organizations:
- existing projects:
- Tessli project already exists: yes/no
- available creation regions:
- exact current recurring cost:

Slice decision
- proposed slice: 10.1b
- why it is now executable or still blocked:
- exact acceptance criteria:
- exclusions:
- expected repository files:
- external settings that will change outside Git:
- focused tests:
- full checks:

Approval required
- organization:
- project name:
- region:
- cost and recurrence:
- explicit question asking the user to approve all four values
```

Stop there until the user explicitly approves the exact organization, project name, region, and cost.

A previous or generic statement such as “continue,” “use Supabase,” or “do the remaining slices” is not sufficient cost approval. Use the current cost returned by the Supabase tooling. Never invent or estimate the charge.

### 7. Slice 10.1b — allowed scope after approval

After explicit approval, perform exactly one vertical slice: **10.1b — Supabase cloud project link and client smoke test**.

The exact implementation may be improved after code and official-documentation review, but the slice should normally cover:

1. create or select the explicitly approved dedicated Tessli Supabase project;
2. wait for the project to become healthy;
3. record the approved organization, project name, region, cost confirmation, and project reference in the slice evidence without exposing secrets;
4. obtain the project URL and active publishable key through authenticated tooling;
5. place public values in `.env.local` for local testing and in Vercel preview/production environment settings outside Git;
6. keep `web/.env.example` values blank and commit no real URL or key unless repository policy explicitly changes through a separately reviewed decision;
7. verify the existing strict/non-throwing configuration contracts with real public values;
8. run a minimal browser-client connectivity smoke test;
9. run a minimal server/cookie-aware connectivity smoke test;
10. verify no database schema, public catalogue copy, storage bucket, auth provider, or user table was created implicitly;
11. inspect Supabase security and performance advisors and record the results or explicit absence of applicable findings;
12. verify Vercel preview and production environment-variable placement without printing values into logs;
13. add or update the Slice 10.1b evidence document and delivery ledger truthfully;
14. run focused tests, full repository checks, browser/release checks, and a Vercel preview;
15. review logs and diffs for secret leakage before merge.

Use official current Supabase, Next.js, and Vercel documentation for APIs or CLI behavior that may have changed. Do not rely on model memory for current commands, key formats, auth-provider settings, or pricing.

### 8. Slice 10.1b acceptance criteria

Define the final criteria from repository truth before implementation. At minimum they must prove:

- a dedicated, explicitly approved Tessli project exists and is healthy;
- organization, name, region, and actual cost approval are recorded;
- only active public project URL and publishable-key values are used by browser and SSR clients;
- no secret/service-role key is used or exposed;
- real values are absent from Git history, committed files, test fixtures, screenshots, workflow output, and PR text;
- local, preview, and production environment placement is verified outside Git;
- the existing `/auth` shell changes only from `unconfigured` to `configured but not activated`; its controls remain disabled in 10.1b;
- browser and server smoke tests reach the approved project without creating application tables or user records;
- Supabase security/performance advisors are checked;
- the public catalogue remains repository-managed;
- no auth provider, SMTP, callback, password flow, OTP, OAuth, schema, RLS, cloud save, private collection, note, form, moderation, or email feature enters this PR;
- rollback instructions explain how to remove environment values and return the application to its truthful unavailable state;
- exact-head focused tests, full CI, browser/release gates, and preview deployment pass;
- the branch is squash-merged and deleted before 10.2b or 11.1 starts.

### 9. Required exclusions for 10.1b

Do not include:

- password sign-up or sign-in;
- email OTP send or verification;
- Google OAuth;
- auth callback, session-refresh proxy, password reset, sign-out, or account menu;
- custom SMTP or Resend configuration;
- database migrations or generated application table types;
- profiles, saves, collections, notes, submissions, reports, or moderation tables;
- RLS policies;
- storage buckets;
- public catalogue duplication;
- unrelated dependency upgrades;
- redesign or UI-intelligence work;
- committed real environment values;
- service-role, secret, database password, personal access token, or Supabase access token in repository content.

When an external tool creates default objects, inventory them and state exactly what exists. Do not present provider defaults as Tessli application schema.

### 10. Tests and verification for 10.1b

Run focused tests first. Reuse and extend the existing Supabase contract tests rather than creating a second configuration model.

Expected local checks from `web/` include:

```bash
npm ci
node --test tests/supabase-client-contract.test.mjs
npm run format:check
npm run typecheck
npm run lint
npm test
npm run catalogue:check
npm run build
```

Add a safe smoke command or test only when it:

- reads public values from the process environment;
- redacts the URL/key from output;
- performs no mutation;
- fails clearly when configuration or connectivity is invalid;
- can be omitted or skipped in credential-free CI without weakening normal tests;
- does not turn CI into a secret-printing or cloud-mutating workflow.

Use the repository's existing browser and Phase 1 release workflows. Verify `/auth` at supported widths when environment configuration changes its status copy. Record current Vercel status rather than assuming a prior preview result.

### 11. Git and secret hygiene

Before every commit and before merge:

- inspect `git status`, staged paths, and the complete diff;
- scan the diff for `supabase.co`, `sb_publishable_`, legacy anon JWTs, `sb_secret_`, service-role material, database passwords, access tokens, `.env`, `.env.local`, CLI state, generated browser profiles, logs, and screenshots;
- ensure no secret or real environment file is tracked;
- ensure terminal output copied into docs or PRs is redacted;
- avoid `set -x` around environment commands;
- never echo keys to GitHub Actions logs;
- do not commit `.supabase/`, local CLI credentials, or temporary link state unless current official tooling and repository policy explicitly require a non-secret project reference file and the diff is reviewed;
- verify the GitHub PR diff, not only the local working tree.

If any credential appears in Git history or logs, stop, rotate it, remove the exposed material, and document the incident truthfully before continuing.

### 12. Mandatory GitHub slice loop

For every slice, follow exactly:

1. Read current `main`.
2. Read `PRD.md`, `build-slices.md`, `AGENTS.md`, `design.md` when relevant, and relevant schemas/contracts.
3. Create a branch from current `main`.
4. Define exact acceptance criteria and exclusions.
5. Implement one vertical slice.
6. Run focused tests.
7. Review the complete diff.
8. Fix findings.
9. Run all available CI checks.
10. Commit intentionally.
11. Open a draft PR.
12. Review the PR diff, browser output, external-resource evidence, and exact-head CI.
13. Fix every final issue.
14. Squash-merge.
15. Delete the branch.
16. Refresh/pull updated `main`.
17. Start no later slice until the previous slice is merged.

Do not create a chain of dependent unmerged branches. Do not mark external work complete because repository code compiles.

### 13. Pull-request evidence contract

Every PR must include:

- slice ID and goal;
- branch base and final head SHAs;
- exact acceptance criteria and result for each;
- exclusions;
- expected and actual files changed;
- external resources/settings created or modified;
- cost approval evidence without billing secrets;
- focused test results;
- full CI results;
- browser sizes and interactions checked;
- accessibility notes;
- security, RLS, credential, and privacy notes;
- advisor results where relevant;
- complete-diff findings and fixes;
- rollback procedure;
- intentional deviations;
- remaining blockers;
- Vercel and Supabase status without exposing credentials.

Do not claim a test, provider configuration, email, OAuth callback, RLS policy, preview, or production check passed unless it actually ran against the exact reviewed head or approved external project.

### 14. Sequence after 10.1b

Do not blindly start this sequence. After every merge, reread current `main`, the ledger, unresolved issues, and external readiness.

Expected dependency order:

```text
10.1b Supabase cloud project link and smoke test
  ├─ 10.2b password, six-digit OTP, and Google activation
  └─ 11.1 user-data schema and RLS
       ├─ 11.2 cloud saves, private collections, notes, local import
       └─ 12.1 submit, suggest, and report forms
            └─ 12.2 moderation state and transactional email
```

#### 10.2b — live authentication

Before implementation, separately confirm:

- allowed site and redirect URLs for local, preview, and production;
- password policy and account-enumeration behavior;
- six-digit email OTP behavior;
- Google provider credentials and redirect URI ownership;
- custom SMTP through Resend before public email testing;
- callback/session-refresh architecture from official current guidance;
- rollback to the disabled truthful shell.

Do not combine 10.2b with database schema work.

#### 11.1 — user-data schema and RLS

Use migrations, not dashboard-only undocumented changes. Define the smallest approved user-owned schema. Test policies as anonymous, authenticated owner, and authenticated non-owner. Generate TypeScript types only after the reviewed schema exists. Run Supabase security and performance advisors after DDL changes.

Do not combine 11.1 with cloud-save UI.

#### 11.2 — cloud saves and private workspace

Preserve browser-local saves until import is confirmed. Deduplicate stable resource IDs. Do not delete the local copy silently. Treat private collections and notes as user-owned data under RLS.

#### 12.1 — community forms

Require server-side validation, URL normalization, duplicate detection, length limits, rate limiting, honeypot, safe errors, audit timestamps, and moderation status. Any metadata fetching requires a separate SSRF review.

#### 12.2 — moderation and transactional email

Keep moderation authorization server-side. Use Resend only after sending-domain ownership, templates, consent, error handling, and environment separation are verified. Do not introduce a newsletter.

### 15. Stop conditions

Stop and ask the user instead of guessing when:

- organization, project name, region, or cost is unapproved;
- no authorized Supabase account/tooling is available;
- creating a project would incur a cost not explicitly accepted;
- OAuth credentials, Resend domain, redirect ownership, or production environment access is unavailable;
- documents and code disagree on the active slice or security boundary;
- a service-role/secret key appears where a publishable key is expected;
- a required external setting cannot be verified;
- CI, build, browser, RLS, advisor, or smoke checks fail;
- a proposed improvement belongs to a later slice;
- the only path forward requires faking or weakening an acceptance criterion.

A truthful blocked checkpoint is preferable to invented completion.

### 16. Completion report

At the end of each merged slice, report:

```text
Merged slice
- ID/title:
- PR:
- merge commit:
- final main:

Repository changes
- files:
- behavior:
- migrations/schema:

External changes
- Supabase:
- Vercel:
- Resend/OAuth when applicable:
- secrets stored where:

Verification
- focused tests:
- full CI:
- browser/release:
- advisors/RLS:
- deployment:

Security review
- credential scan:
- data boundary:
- rollback:

Remaining blockers
- ...

Next recommended slice
- ID/title:
- why it is now unblocked:
- approvals still required:
```

Stop at the next clean merged checkpoint unless the user explicitly asks you to continue. Even then, start the next slice only from refreshed `main`.

---

## Handoff maintenance rule

This handoff captures the state on 2026-08-01. Repository code, `AGENTS.md`, `PRD.md`, `build-slices.md`, slice evidence, merged pull requests, current provider configuration, current pricing, and exact-head CI/deployment results always outrank it.

Update or replace this file only in a dedicated documentation slice when its state becomes materially stale.