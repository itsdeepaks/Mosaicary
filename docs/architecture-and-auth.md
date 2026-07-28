# Tessli Architecture and Authentication Plan

## 1. Recommended stack

- Next.js App Router
- TypeScript
- Tailwind CSS with CSS-variable design tokens
- Radix primitives or selectively restyled shadcn components
- Supabase Auth and Postgres
- Postgres Row Level Security
- Resend as production SMTP/email provider
- Vercel deployment
- repository-managed catalogue data for Phase 1

Do not import a prebuilt theme. Components must consume Tessli tokens and match the approved reference.

## 2. Why Next.js now

The current static HTML is enough for the catalogue, but Tessli's approved direction includes:

- multiple routes;
- authentication;
- server-side form validation;
- account state;
- synced saves;
- submissions;
- moderation;
- metadata enrichment;
- protected user data.

Moving to Next.js before building the new component system avoids rebuilding the UI twice.

## 3. Font architecture

Use `next/font`:

- self-host at build time;
- variable-font loading;
- CSS variables;
- `display: swap`;
- automatic fallback adjustment;
- load font definitions once in a shared file.

Planned variables:

```text
--font-display
--font-ui
```

## 4. Catalogue architecture

Phase 1:

- CSV migration script;
- typed JSON source;
- static/server-rendered public pages;
- client-side search and filtering;
- repository PRs for accepted catalogue changes.

Supabase does not duplicate the public catalogue in Phase 1.

## 5. Authentication architecture

Supabase Auth supports the required methods:

- email and password;
- six-digit email OTP;
- Google OAuth.

Use server-side/cookie-aware integration for Next.js.

### UX sequence

1. Google button.
2. Email field.
3. Continue.
4. User chooses or is routed to:
   - password;
   - one-time code.
5. Account is created only through a clearly explained flow.

### Production email

Supabase's default SMTP is development-only and rate-limited. Connect Resend as custom SMTP before public auth testing outside the team.

Required email templates:

- confirmation;
- OTP;
- password reset;
- email change;
- optional submission confirmation.

## 6. Authorization

All exposed user-data tables enable RLS.

Examples:

- user can select/insert/delete their own saves;
- user can manage their own private collections;
- user can see their own submissions;
- public cannot read private notes;
- moderation actions require server-side role checks;
- service-role keys never appear in browser code.

## 7. Local-to-cloud saves

After first successful sign-in:

1. detect browser-local saved URLs;
2. compare with cloud saves;
3. show one import prompt;
4. upsert without duplicates;
5. retain local copy until confirmed;
6. offer clear-local option;
7. record import completion per user/device only when necessary.

## 8. Forms and abuse protection

Server-side validation required for:

- submit resource;
- suggest improvement;
- report resource.

Protections:

- rate limits;
- hidden honeypot;
- optional Turnstile after abuse appears;
- URL normalization;
- duplicate detection;
- input length limits;
- safe error messages;
- audit timestamps;
- moderation status.

Do not add CAPTCHA by default if rate limiting and honeypots are sufficient.

## 9. Email responsibilities

Supabase/Resend:

- auth emails.

Application transactional emails through Resend API or Supabase Edge Function:

- submission received;
- submission accepted/rejected;
- important account notifications.

Do not launch a newsletter inside the product shell until consent, unsubscribe, and sending ownership are defined.

## 10. Security boundaries

- strict URL validation for metadata fetching;
- prevent SSRF;
- no arbitrary HTML from catalogue descriptions;
- sanitise any future rich text;
- external links use `noopener noreferrer`;
- Content Security Policy defined during scaffold;
- no secrets in client bundles;
- no service keys in GitHub;
- RLS tested with authenticated and anonymous roles.

## 11. Deployment environments

- local;
- preview per pull request;
- production.

Separate Supabase projects or careful environment separation before real users. OAuth redirect URLs must include local, preview strategy, and production destinations.

## 12. Deferred decisions

- admin/moderation UI;
- public user profiles;
- shared collections;
- screenshot service;
- object-storage image cache;
- newsletter;
- paid plans;
- recommendation ranking.
