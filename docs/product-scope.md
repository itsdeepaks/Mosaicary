# Tessli Product Scope and Decisions

Status: **active scope after the 2026-08-04 direction reset**  
Repository: `itsdeepaks/tessli`  
Product name: **Tessli**  
Authoritative direction: `docs/product-direction.md`

## 1. Product definition

Tessli is a design-research system for humans and language models.

It starts with a curated Source Index of 295 design and frontend resources. It then adds structured source intelligence, guided playbooks, local project research, model-independent exports, MCP retrieval, and later evidence-backed pattern knowledge.

The directory is the starting surface, not the finished UI-taste product.

## 2. Initial promise

> Find the right design source and research path before you build.

Tessli should help a user:

- search by task;
- inspect a source before leaving Tessli;
- understand fit and limitations;
- distinguish Listed, Profiled, and Verified sources;
- save sources from any research surface;
- organise selected and rejected references by project;
- export compact context to any LLM;
- follow a guided research playbook;
- preserve evidence and freshness.

## 3. Long-term direction

Tessli may support a stronger UI-taste claim only after it can demonstrate:

- relevant source retrieval;
- project-specific constraints;
- reviewed pattern knowledge;
- browser-verified implementations;
- human evaluation;
- retained approved and rejected outcomes;
- measurable improvement against defined review dimensions.

## 4. Product layers

### Source Index

Where should I look?

### Research Intelligence

Which source fits, why, and with what limitations?

### UI Judgment

What should the project learn, select, reject, and reuse—and did it improve the result?

## 5. Active scope

### Stage 1 — Trustworthy source research

Required:

- canonical `/resources` browser;
- pagination;
- URL-backed search/filter/sort/view/page;
- cards, compact list, and table where useful;
- Listed/Profiled/Verified coverage levels;
- `/resources/[slug]` for every source;
- internal profile as the primary route;
- separate Visit source action;
- universal browser-local Save;
- Similar Sources;
- truthful evidence and freshness.

### Stage 2 — Reusable project research

Required:

- browser-local project Boards;
- project goal and constraints;
- selected and rejected references;
- per-item notes;
- unresolved questions;
- guided playbooks;
- deterministic Markdown research-pack export.

### Stage 3 — Agent research and proof

Required:

- website and MCP using the same profile truth;
- model-independent public pages/exports;
- one real OSS proof project;
- browser verification;
- twelve-dimension human review;
- 5–10 reviewed Pattern Candidates after the proof workflow.

### Stage 4 — Persistence and scale

Deferred until local usage proves value:

- authentication;
- cloud Saved/Boards;
- local-to-cloud merge;
- submissions/reports;
- moderation;
- expanded verified profiles and patterns.

## 6. Current canonical routes

```text
/                         Curated homepage
/resources                Canonical source browser
/resources/[slug]         Internal source profile
/collections              Guided playbooks
/collections/[slug]       Staged playbook detail
/saved                    Browser-local Saved
/boards                    Browser-local project Boards
/boards/[id]               Project research workspace
/for-ai                    MCP, exports, coverage, and governance
/about                     About Tessli
/curation                  Curation and verification process
/privacy                  Privacy
/terms                    Terms
/content-policy           Content, attribution, media, and takedown policy
```

Routes appear publicly only when their functionality works.

Initial category browsing may use `/resources?category=...`. Dedicated category pages require meaningful editorial content.

## 7. Superseded product decisions

The following previous decisions are no longer authoritative:

- treating `/` Explore and `/resources` Full Reference as separate catalogue products;
- rendering the complete catalogue in a dense unpaginated reference page;
- treating `/resources/[slug]` as optional;
- making the entire resource card only an external link;
- showing Save only on Explore;
- promoting disabled Sign in;
- promoting placeholder Submit or Suggest routes;
- activating authentication before local workspace value is proven;
- requiring email OTP after every password sign-in;
- treating UI-intelligence research as unrelated to Tessli product delivery.

Existing code remains until replaced in approved slices.

## 8. Public catalogue truth

The repository remains the source of truth for the public source catalogue during the proof stages.

- all 295 source rows remain preserved;
- stable IDs/slugs remain stable;
- generated output remains deterministic;
- accepted changes remain reviewable through pull requests;
- source/profile evidence retains provenance;
- the catalogue is not duplicated in Supabase merely for browsing.

## 9. Coverage levels

### Listed

Identity, category, type, access, concise sourced description, and status.

### Profiled

Capabilities, best-for, content objects, platforms/frameworks, discovery, integrations, workflow fit, and limitations.

### Verified

Evidence, verification date, confidence, agent-interface details, credential rules, persistence/redistribution rules, human review, and freshness.

Do not imply equal research depth across all 295 sources.

## 10. User-owned data direction

Initial user-owned data remains browser-local:

- Saved;
- Boards;
- notes;
- selected/rejected state;
- constraints;
- research-pack drafts.

Supabase becomes authoritative only after cloud persistence is approved for:

- profiles;
- cloud Saved/Boards;
- Board items/notes/constraints;
- local import state;
- submissions/reports;
- moderation;
- export/deletion records.

## 11. Resource navigation decision

Primary interaction:

- selecting the source identity/card opens the Tessli source profile;
- Visit source is an explicit external action;
- Save is independent and universal;
- Add to board appears when Boards exist;
- Compare appears only for meaningful peer groups;
- Similar Sources is the general alternative-discovery action.

External links continue to open safely in a new tab.

## 12. Header direction

Before accounts:

```text
Logo | Browse | Collections | For AI | Search | Saved
```

After cloud workspace value and complete auth exist:

```text
Logo | Browse | Collections | For AI | Search | Saved | Account
```

Do not show a public Sign in action while the flow is disabled or while there is no cloud-workspace benefit.

## 13. Homepage direction

The homepage is curated rather than exhaustive.

It should eventually contain:

- task-based hero search;
- real coverage facts;
- research-goal entry points;
- featured playbooks;
- recently verified profiles;
- human/MCP demonstration;
- research-pack explanation;
- 8–12 source examples at most.

Homepage redesign follows the working Browse → Profile → Board → Export loop.

## 14. Collections direction

Collections become guided playbooks.

Each playbook explains:

- goal;
- audience;
- stages;
- why a source is included;
- what to inspect;
- what decision it supports;
- optional checklist;
- exportable research context.

## 15. Model access

Without MCP:

- semantic public pages;
- stable URLs;
- sitemap;
- Markdown/JSON exports where approved;
- downloadable research packs.

With MCP:

- source search;
- source profiles;
- peer comparison;
- collections;
- research plans;
- reference packets;
- verification state.

Future pattern/project tools require stable reviewed data first.

## 16. Authentication direction

Authentication is deferred until local Boards and export prove repeated value.

Future signup:

```text
Google OAuth
or
first name + last name + email + password
→ email verification OTP
→ optional local-data merge
```

Future standard sign in:

```text
Google OAuth
or
email + password
```

Do not require email OTP after every normal password sign-in. Optional MFA uses authenticator TOTP.

## 17. Explicit non-goals for current stages

- mass screenshot scraping;
- a mirror of Mobbin, Refero, or paid/private libraries;
- unreviewed mass-generated profiles or patterns;
- universal aesthetic scoring;
- vector search as a substitute for curation;
- cloud/auth complexity before local value;
- a full Styles product;
- payments or teams;
- Figma/browser extensions;
- more MCP tools without underlying data;
- a homepage-led redesign before core research works.

## 18. Immediate proof milestone

Use Tessli to research one real OSS page, recommended as the Online Scope Studio homepage:

```text
brief
→ source selection
→ local Board
→ selected/rejected notes
→ Markdown research pack
→ Codex implementation
→ browser verification
→ human review
→ outcome comparison
```

The milestone succeeds when Tessli demonstrably improves context relevance, reduces wasted loops, or improves review outcomes—not when the architecture document is merely complete.
