# Tessli remaining-phase plan — domain-free first

Status: **active planning addendum — 2026-08-02**

This plan reconciles the completed public catalogue, media, Supabase, and MCP
work with the current delivery constraint: Tessli has a working Vercel URL but
does not yet have a custom domain or production email sender. It supplements
the authoritative status table in `build-slices.md`; it does not mark a
blocked slice complete.

## Current foundation

- the public catalogue remains repository-managed: 295 resources, 11
  categories, and 6 published collections;
- reviewed media coverage is at 112 approved records, 107 pending resources,
  and 76 reviewed terminal outcomes;
- the dedicated Supabase project has the eight user-owned tables, generated
  types, grants, and verified RLS isolation from Slice 11.1;
- local, preview, and production hold only the public Supabase URL and
  publishable key; no secret or service-role key is used by the application;
- the Vercel production URL is `https://tessli.vercel.app`; it is the temporary
  public URL until a custom domain is intentionally introduced.

## Work that continues without a domain

### Track A — media coverage

Continue Slice 5.4b as bounded, deterministic twenty-resource discovery and
review batches. Each batch is independently committed after safe discovery,
manual browser inspection, coverage reconciliation, and the normal local gate.
Do not use screenshots as a substitute for permissioned preview media; Slice
5.4c remains deferred until separately approved.

The immediate next item is **5.4b-10**. It does not depend on authentication,
Supabase Auth settings, a custom domain, or SMTP.

### Track B — domain-independent account preparation

Keep Slice 10.2b marked **BLOCKED** until the provider configuration below is
complete. The existing `/auth` route stays an honest inactive shell; no
partially wired authentication controls should be published.

Before any live-auth code is activated, configure Supabase Auth URL settings
for the temporary Vercel address:

| Setting                 | Value                                         |
| ----------------------- | --------------------------------------------- |
| Site URL                | `https://tessli.vercel.app`                   |
| Local redirect          | `http://localhost:3000/**`                    |
| Stable Vercel redirect  | `https://tessli.vercel.app/auth/**`           |
| Vercel preview redirect | `https://*-itsdeepaks-projects.vercel.app/**` |

The stable production URL is deliberately exact; the wildcard is limited to
the known Vercel team namespace and is only for previews. These settings are
managed in Supabase Auth and cannot currently be changed through the connected
database plugin, so they remain a small dashboard prerequisite rather than a
repository change.

**10.2b-1** may establish the cookie-aware server transport and a safe callback
boundary without activating any sign-in method. It uses only the existing
public Supabase configuration, keeps the `/auth` shell disabled, and makes no
Supabase dashboard change.

Google is intentionally deferred; it is not a prerequisite for the next
account-data work. Password and six-digit email OTP remain behind the final
email sender work. The Supabase default sender is suitable only for restricted
development validation, not public Tessli authentication. No public invitation
or broad email testing happens before custom SMTP is configured.

## Dependent product order

1. **5.4b-06 and later media batches** — continue in parallel while accounts
   are unavailable. GPT owns the current Open Graph/Twitter media run.
2. **10.2b-1 session transport** — establish the safe cookie/callback boundary
   without enabling a provider.
3. **Password and email-code activation** — only after the URL allowlist,
   custom SMTP, and restricted end-to-end testing are ready; Google stays
   deferred.
4. **11.2 cloud saves, private collections, notes, and import** — only after a
   real authenticated session is proven. Keep Phase 1 browser-local saves until
   an import completes successfully.
5. **12.1 submit, suggest, and report forms** — add server validation,
   normalization, duplicate detection, honeypot, rate limits, safe errors, and
   moderation status on the existing RLS foundation.
6. **12.2 moderation state and transactional email** — follows the forms and
   requires Resend for user-facing email.

## Final custom-domain and email slice

Do this only after the application flows above are otherwise ready:

1. add and verify the custom domain in Vercel;
2. change Supabase Site URL to the exact custom-domain origin and add its exact
   `/auth/**` redirect path while retaining localhost and reviewed preview
   redirects;
3. authenticate the custom sending domain with Resend and configure Supabase
   custom SMTP without committing SMTP credentials;
4. review confirmation, six-digit OTP, password-reset, email-change, and
   transactional-email templates, using `{{ .RedirectTo }}` wherever a flow
   supplies an explicit redirect;
5. run restricted end-to-end auth/email tests on the custom domain, then set
   the Vercel production environment's `NEXT_PUBLIC_SITE_URL` to that origin;
6. record rollback instructions before inviting non-team users.

## Guardrails

- Keep public catalogue data out of Supabase.
- Keep `NEXT_PUBLIC_SUPABASE_*` limited to the URL and publishable key.
- Never commit secrets, SMTP credentials, OAuth client secrets, generated
  browser profiles, or temporary discovery artifacts.
- Do not treat a configured environment variable as proof that Auth works.
- Preserve the normal local workflow: branch, focused implementation,
  verification, local commit, fast-forward merge to `main`, then direct push.

## Revisit trigger

Update this plan when one of these external facts changes: a custom domain is
available, a verified Resend sender exists, password/email-code activation is
approved, Google OAuth credentials are deliberately revisited, or the Supabase
plugin gains Auth URL/provider configuration capabilities.
