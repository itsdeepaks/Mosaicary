# Tessli Product Scope and Decisions

Status: pre-development  
Repository: `itsdeepaks/tessli`  
Product name: **Tessli**

## 1. Product promise

Tessli helps designers and developers discover useful design resources faster through a carefully curated, searchable, and understandable index.

Tessli is not:

- a scraped mirror of other design libraries;
- a public contact database;
- a marketplace at launch;
- an AI-generated resource dump;
- a social network;
- a screenshot piracy archive.

## 2. Source-of-truth strategy

### Public catalogue

The curated resource catalogue remains version-controlled in the repository for the initial product:

- open-source contributions are reviewable through pull requests;
- accepted changes have history and attribution;
- the public site can build from typed JSON generated from the existing CSV;
- the catalogue does not require a database to serve 295 entries.

### User-generated data

Supabase becomes the source of truth for:

- profiles;
- cloud-synced saves;
- private collections;
- notes;
- submissions;
- feature suggestions;
- resource reports;
- moderation state.

This avoids maintaining two competing resource catalogues during the first release.

## 3. Release phases

### Phase 1 — Public discovery

Required:

- Explore page;
- Collections page using repository-maintained collection data;
- Full Reference page;
- local/browser Saved page;
- resource search, category, access, and sorting;
- resource cards with robust image fallbacks;
- About and curation-process pages;
- GitHub contribution links;
- truthful statistics;
- responsive navigation and footer.

No account is required to browse or save locally.

### Phase 2 — Account and sync

Required:

- email/password sign-up and sign-in;
- six-digit email OTP;
- Google sign-in;
- account dropdown;
- cloud-synced saves;
- private collections;
- optional notes;
- import of existing local saves after sign-in;
- account deletion and data export basics.

### Phase 3 — Community workflow

Required:

- submit a resource;
- suggest an improvement;
- report incorrect information;
- moderation queue;
- submission status;
- accepted contribution attribution;
- optional public curated collections only after moderation rules exist.

## 4. Primary audiences

1. Web designers looking for inspiration or assets.
2. Product designers researching flows, systems, and patterns.
3. Frontend developers looking for components, motion, icons, type, and implementation references.
4. Small teams that need a repeatable shortlist instead of scattered bookmarks.
5. Contributors who want to improve an open resource index.

## 5. Core user jobs

- “Find a useful resource for the design task I am doing now.”
- “Understand what a resource is useful for before opening it.”
- “Narrow a large collection without fighting the interface.”
- “Save useful resources and revisit them.”
- “Browse a curated bundle for a workflow.”
- “Suggest a missing resource or correct bad information.”

## 6. Route inventory

### Public

```text
/                         Explore
/collections              Collections
/collections/[slug]       Collection detail
/resources                Full reference
/resources/[slug]         Optional Tessli detail page
/saved                    Saved resources
/about                    About Tessli
/curation                 Curation process
/submit                   Submit a resource
/suggest                  Suggest an improvement
/report/[resourceId]      Report a resource
/privacy                  Privacy
/terms                    Terms
/content-policy           Content, trademark, and takedown policy
```

### Authentication

```text
/sign-in
/sign-up
/verify
/forgot-password
/reset-password
/auth/callback
/account
/account/submissions
```

## 7. Card navigation decision

Default interaction:

- selecting the resource card opens the external website in a new tab;
- save/bookmark remains an independent button;
- a secondary “Details” affordance may open a Tessli detail page where richer metadata exists.

This preserves the product's speed while allowing later research detail.

## 8. Header states

### Phase 1, signed-out-only product

```text
Logo | Explore | Collections | Resources | About | Saved | Theme
```

Do not show a fake avatar.

### Phase 2, signed out

```text
Logo | navigation | Saved | Theme | Sign in
```

### Phase 2, signed in

```text
Logo | navigation | Saved | Theme | Avatar menu
```

## 9. Footer launch content

Show only working destinations:

- Explore: Resources, Collections, Full Reference
- Contribute: Submit a resource, Suggest an improvement, GitHub
- About: About Tessli, Curation process, Changelog
- Legal: Privacy, Terms, Content policy

Newsletter is excluded until a working subscription and consent flow exists.

## 10. Open decisions before Phase 2

- final domain;
- public profile names versus private-only accounts;
- whether notes remain private forever;
- whether collections can be shared;
- submission moderation owner and response expectation;
- deletion/export process;
- analytics provider and consent requirements.
