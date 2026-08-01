# Codex Handoff — Existing Tessli Supabase Project and Remaining Product Slices

Recorded: **2026-08-02**

Repository: `https://github.com/itsdeepaks/tessli`

This handoff records execution boundaries, not credentials or permanent truth.
Current `main`, repository contracts, code, tests, CI, deployments, and the
authorized external-project state always outrank it.

## Immediate next slice

The next account slice is **10.1b — existing Supabase project link verification
and client smoke test**.

A dedicated Tessli Supabase project already exists and its public URL and
publishable key are present in ignored local environment configuration. Do not
create another project and do not repeat the obsolete organization, region, or
recurring-cost approval flow.

The Supabase account previously visible through connected tooling is unrelated
to Tessli. Do not create, update, or delete anything in that account. Before any
management operation, prove that the authenticated CLI, MCP, or dashboard
session targets the same project represented by the local Tessli configuration.

Never print or commit the project URL, publishable key, service-role key,
database password, access token, OAuth secret, SMTP credential, or environment
file. A project URL and publishable key prove public client connectivity; they
do not provide migration or provider-management authority.

## Mandatory reading order

1. latest `main`, branch, worktree, PR, CI, and deployment state;
2. `PRD.md`;
3. `build-slices.md`;
4. `AGENTS.md`;
5. `design.md` for visible work;
6. `docs/product-scope.md`;
7. `docs/component-contracts.md`;
8. `docs/page-contracts.md`;
9. `docs/data-and-media-contract.md`;
10. `docs/resource-media-workflow.md` for media work;
11. `docs/architecture-and-auth.md`;
12. `docs/quality-gates.md`;
13. the relevant slice notes under `docs/slices/`;
14. the relevant schemas;
15. existing implementation and tests in the changed area.

Follow the GitHub slice loop exactly: one short-lived branch, one vertical
slice, one draft PR, complete diff review, exact-head checks, squash merge,
branch deletion, and refreshed `main` before the next slice.

## Slice 10.1b — allowed scope

1. Identify the existing Tessli project without exposing its configuration.
2. Establish authenticated management access to that exact project.
3. Record the project organization, region, plan, and health without billing or
   credential material.
4. Verify local browser and server/cookie-aware clients reach the selected
   project using publishable configuration only.
5. Verify the `/auth` shell reports configured-but-not-activated and leaves its
   controls disabled.
6. Inspect current Auth settings, allowed URLs, and Supabase security and
   performance advisors through authorized tooling.
7. Verify required public environment-variable names exist in local, Vercel
   preview, and Vercel production scopes without printing their values.
8. Inventory existing provider-created objects without treating them as Tessli
   application schema.
9. Add truthful Slice 10.1b evidence, focused tests, rollback instructions, and
   ledger status.
10. Run focused checks, all repository checks, browser smoke, exact-head CI, and
    a preview deployment when available.

### Exclusions

- no new Supabase project;
- no application tables, migrations, RLS policies, storage buckets, users, or
  catalogue duplication;
- no password, OTP, Google, callback, SMTP, or live-auth activation;
- no cloud saves, collections, notes, forms, moderation, or email;
- no service-role key or other secret in browser code, Git, logs, screenshots,
  fixtures, PR text, or `NEXT_PUBLIC_*`;
- no media, MCP, redesign, dependency, or unrelated cleanup work.

### Stop conditions

Stop Slice 10.1b at a truthful checkpoint when:

- authenticated tooling cannot prove it targets the existing Tessli project;
- only public configuration is available for a management-only check;
- Vercel environment placement cannot be inspected safely;
- provider settings, advisors, CI, browser smoke, or deployment cannot be
  verified honestly;
- any credential appears in tracked content or output.

## Account dependency order

```text
10.1b existing-project verification
  ├─ 10.2b password, six-digit OTP, and Google activation
  └─ 11.1 user-data schema and RLS
       ├─ 11.2 cloud saves, private collections, notes, local import
       └─ 12.1 submit, suggest, and report forms
            └─ 12.2 moderation state and transactional email
```

### 10.2b — live authentication

Use official current Supabase SSR/Auth guidance. Confirm local, preview, and
production redirect ownership; password policy; account-enumeration behavior;
six-digit email OTP; Google credentials; custom SMTP through Resend; callback
and recovery behavior; session refresh; sign-out; and rollback. Do not combine
authentication with database schema work.

### 11.1 — user schema and RLS

Use reviewed migrations. All user-owned exposed tables require RLS. Test as
anonymous, authenticated owner, and authenticated non-owner. UPDATE policies
require both `USING` and `WITH CHECK`; authorization must not rely on editable
user metadata. Run security and performance advisors after DDL changes. Do not
combine schema/RLS with the cloud workspace UI.

### 11.2 — cloud workspace

Preserve browser-local saves until import is confirmed. Deduplicate stable
repository resource IDs, never copy the public catalogue into Supabase, and do
not silently delete the local copy. Saves, private collections, collection
items, and notes remain owner-scoped through RLS.

### 12.1 — community forms

Require server-side validation, URL normalization, duplicate detection, input
limits, rate limiting, honeypot, safe errors, audit timestamps, and moderation
status. Metadata fetching is excluded until its own SSRF review.

### 12.2 — moderation and email

Keep moderation authorization server-side. Configure Resend only after sending
domain ownership, environment separation, templates, failure behavior, and
consent requirements are verified. Do not add a newsletter.

## Independent media track

The media track does not depend on Supabase, but it still runs serially through
the repository slice loop.

Current repository evidence:

- 295 catalogue resources;
- 8 approved-media rows containing 7 previews and 5 favicons;
- 5 reviewed candidates already copied to approved production media;
- 3 pending marketplace/authentication review records: Figma Community, UI8,
  and Creative Market;
- 287 resources have no approved preview or favicon and currently render the
  generated-letter fallback.

### 5.4a — coverage manifest and batch architecture

Create a deterministic, resumable manifest covering all 295 stable resource
IDs. Do not count generated-letter rendering as completed research. Preserve a
terminal research outcome for every processed resource: approved media,
no-suitable-raster, blocked, failed, or rejected. Keep batch discovery capped at
20 IDs, candidate review bounded, network activity outside build/test/CI, and
manual copy into approved production media.

### 5.4b — reviewed discovery batches

Use one branch and PR per bounded batch from refreshed `main`. Inspect candidate
images before approval. Never bypass authentication, anti-bot controls, private
access, or marketplace licensing boundaries. Full research coverage requires
all 295 IDs in the manifest with no pending result; it does not require inventing
or forcing an image for every site.

### 5.4c — screenshot policy

Screenshots remain deferred. Consider them only after metadata discovery
quantifies the unresolved set and the user approves capture authority,
licensing, cookie and authentication screens, storage, retention, freshness,
takedown, SSRF, and operational behavior. A screenshot must never be used to
bypass a blocked or private site.

## Completion evidence for every slice

Every PR must record the slice goal, base and final SHAs, acceptance criteria,
exclusions, files changed, external changes, focused checks, full checks,
browser sizes where applicable, accessibility and security review, complete
diff findings, rollback, intentional deviations, remaining blockers, and exact
CI/deployment state. Never claim an external provider, email, OAuth, RLS,
browser, CI, or deployment check passed unless it actually ran against the
reviewed head.
