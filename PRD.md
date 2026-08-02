# Tessli Product Requirements Document

Status: **approved for phased implementation**  
Last updated: 2026-07-28

## 1. Product summary

Tessli is a fast, carefully curated design-resource index for designers, frontend developers, product builders, and small teams. It helps people discover useful references, tools, libraries, patterns, and assets without turning research into a noisy feed.

The public catalogue begins with 295 repository-managed resources across 11 practical categories. Public catalogue changes remain reviewable through GitHub pull requests. User-owned data is introduced later through Supabase.

## 2. Product promise

> Find better design resources, faster.

Tessli should make it easy to:

- search by task, resource name, destination, category, access model, and description;
- understand why a resource may be useful before opening it;
- browse curated collections built around real design and development workflows;
- save useful resources locally without creating an account;
- revisit a complete, dense reference view;
- suggest additions and corrections through a moderated workflow.

## 3. Product principles

1. **Curated, not crowded.** Quality, explanation, and maintenance matter more than catalogue size.
2. **Search first.** Search is the fastest route to value and remains prominent.
3. **Truthful interface.** Do not invent users, ratings, trends, curators, or activity.
4. **Fast external discovery.** A resource card opens the destination; save remains a separate action.
5. **Progressive complexity.** Basic browsing stays simple; advanced filtering appears when requested.
6. **Accessible calm.** Typography, grain, colour, animation, and density must preserve legibility.
7. **Open contribution, controlled publication.** Suggestions are welcome; publication remains reviewed.
8. **Original work.** Tessli is a research index, not permission to copy or redistribute third-party work.

## 4. Non-goals

Tessli is not:

- a scraped mirror of design galleries;
- a screenshot piracy archive;
- a marketplace at launch;
- an AI-generated resource dump;
- a public contact database;
- a social network;
- a recommendation feed driven by fake popularity;
- a proxy for paid or private design libraries;
- a licence to copy another product's interface.

## 5. Audiences

Primary audiences:

1. Web designers looking for inspiration, systems, assets, and patterns.
2. Product designers researching flows, interfaces, typography, and accessibility.
3. Frontend developers looking for components, motion, icons, type, and implementation references.
4. Small teams that need a repeatable shortlist instead of scattered bookmarks.
5. Contributors who want to improve an open design-resource index.

## 6. Core user jobs

- Find a useful resource for the task I am doing now.
- Understand what the resource offers before opening it.
- Narrow the catalogue without fighting the interface.
- Save useful resources and revisit them later.
- Browse a curated bundle for a workflow.
- See all catalogue information in a compact reference view.
- Suggest a missing resource or correct outdated information.

## 7. Source-of-truth strategy

### 7.1 Public catalogue

Phase 1 catalogue data remains in the repository:

- `lib_data/design-resource-library-295.csv` remains the original release source;
- the application generates validated typed JSON from the CSV;
- accepted catalogue changes are reviewed through pull requests;
- the public catalogue is not duplicated in Supabase during Phase 1.

### 7.2 User-owned data

Supabase becomes the source of truth for:

- profiles;
- cloud-synced saves;
- private collections;
- collection items;
- notes;
- resource submissions;
- feature suggestions;
- resource reports;
- moderation state.

## 8. Release phases

### Phase 1 — Public discovery

Required:

- Explore page;
- Collections page and collection detail pages using repository-maintained data;
- Full Reference page;
- browser-local Saved page;
- search, category filtering, access filtering, and sorting;
- robust media fallbacks;
- truthful product facts;
- responsive header, mobile navigation, and footer;
- About, curation, legal, and contribution information;
- no account required to browse or save locally.

### Phase 2 — Account and sync

Required:

- email/password sign-up and sign-in;
- six-digit email OTP;
- Google authentication;
- account dropdown;
- cloud-synced saves;
- private collections and optional notes;
- local-to-cloud save import;
- sign-out, account deletion, and basic data export.

### Phase 3 — Community workflow

Required:

- submit a resource;
- suggest an improvement;
- report incorrect information;
- server-side validation and abuse protection;
- moderation status and queue;
- submission confirmation and status views;
- accepted contribution attribution.

## 9. Phase 1 routes

```text
/                         Explore
/collections              Collections
/collections/[slug]       Collection detail
/resources                Full reference
/resources/[slug]         Optional Tessli resource detail
/saved                    Browser-local saved resources
/about                    About Tessli
/curation                 Curation process
/submit                   Submit a resource shell or contribution guidance
/suggest                  Suggest an improvement shell or contribution guidance
/privacy                  Privacy policy
/terms                    Terms
/content-policy           Content, trademark, preview, and takedown policy
```

Only working destinations may appear in public navigation or the footer.

## 10. Primary interaction decisions

### Resource card

- The whole card is a valid external link.
- It opens in a new tab with `noopener noreferrer`.
- The save button remains an independent control.
- Modifier click and middle click must retain browser-native behaviour.
- A secondary detail action may open a Tessli page where richer metadata exists.

### Saved resources

Phase 1 saves are:

- browser-local;
- private to that browser/device;
- available without an account;
- migrated from the existing Mosaicary/Tessli storage keys;
- explained honestly in the interface.

### Search and filters

- Search is client-side at 295 resources.
- One normalized searchable string is precomputed per resource.
- Search and filters are represented in URL state where practical.
- A shared URL restores the visible search/filter state.

## 11. Visual direction

The canonical visual contract is `design.md` and the approved reference images.

Core characteristics:

- warm off-white canvas;
- charcoal rather than pure black;
- restrained orange accents;
- Newsreader Variable for wordmark and display headings;
- Instrument Sans Variable for product UI;
- subtle grain on the page canvas only;
- sharp editorial cards, panels, grids, and reference frames;
- small radii only for controls, menus, avatars, and true pills;
- borders do more hierarchy work than shadows;
- no glassmorphism, glow gradients, cursor-follow effects, or floating 3D animation.

## 12. Truthful hero facts

Phase 1 uses:

1. `295` — Curated resources
2. `11` — Practical categories
3. `Private` — Browser-local saves
4. `Open` — Community-built project

Do not show unmeasured user counts, weekly additions, ratings, or trending claims.

## 13. Media requirements

Fallback chain:

1. approved manual preview;
2. official Open Graph image URL;
3. official Twitter image URL;
4. favicon in a designed tile;
5. generated letter mark.

The UI must remain complete when all external images fail.

Initial media rules:

- store metadata URLs, not arbitrary binary files in the database;
- fixed aspect-ratio media boxes;
- lazy loading below the fold;
- no remote SVG injection;
- `referrerPolicy="no-referrer"` for arbitrary external images;
- no unrestricted image proxy or wildcard optimisation endpoint.

## 14. Technology direction

- Next.js App Router
- TypeScript
- Tailwind CSS using Tessli CSS variables
- selectively restyled Radix/shadcn primitives
- Supabase Auth and Postgres for Phase 2+
- Row Level Security for all user-owned data
- Resend as production SMTP/email provider
- Vercel for preview and production deployment
- repository-managed public catalogue during Phase 1

## 15. Accessibility requirements

- WCAG 2.2 AA contrast targets;
- full keyboard operation;
- visible focus states;
- semantic landmarks and heading order;
- touch targets appropriate for mobile;
- reduced-motion support;
- no interaction requiring hover alone;
- no invalid nested interactive markup;
- meaningful empty, loading, error, and image-failure states;
- screen-reader announcements for search result count and save state changes.

## 16. Performance requirements

Phase 1 targets:

- optimized hero image with stable dimensions;
- no font-driven layout shift;
- no horizontal overflow at supported widths;
- catalogue parsing/generation at build time;
- client-side search appropriate for 295 items;
- lazy-loaded resource media;
- minimal client JavaScript outside interactive discovery controls;
- Lighthouse performance and accessibility regression checks before launch.

## 17. Security requirements

- validate and normalize every external URL;
- prevent SSRF in future metadata fetching;
- never expose service-role keys to browser code;
- no arbitrary HTML from catalogue descriptions;
- sanitize future rich text;
- strict external-link attributes;
- Content Security Policy reviewed during scaffold;
- Supabase RLS tested for anonymous and authenticated users;
- server-side validation and rate limiting for community forms.

## 18. Phase 1 success criteria

Phase 1 is ready when:

- all 295 catalogue entries are preserved and validated;
- duplicate/invalid records are reported;
- Explore, Collections, Full Reference, and Saved are responsive and usable;
- search/filter state works and restores from the URL where specified;
- resource cards survive missing media and long content;
- local saves migrate without data loss;
- navigation contains no unfinished links;
- desktop and mobile screenshots pass visual QA against the canonical references;
- accessibility, type, lint, test, and build checks pass;
- preview deployment is reviewed before production replacement.

## 19. Deferred decisions

- final production domain;
- public user profiles;
- shareable user collections;
- moderation owner and response expectations;
- analytics provider and consent requirements;
- screenshot service and object-storage cache;
- newsletter;
- paid plans;
- recommendation ranking.

## 20. Supporting documents

- `design.md`
- `build-slices.md`
- `AGENTS.md`
- `schemas/catalogue.schema.json`
- `docs/component-contracts.md`
- `docs/page-contracts.md`
- `docs/data-and-media-contract.md`
- `docs/architecture-and-auth.md`
- `docs/quality-gates.md`
