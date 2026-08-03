# Tessli Product Requirements Document

Status: **approved direction reset**  
Last updated: 2026-08-04  
Authoritative strategy: `docs/product-direction.md`

## 1. Product summary

Tessli is a design-research system for humans and language models.

It begins with a curated catalogue of 295 design and frontend sources, but the catalogue is not the complete product. Tessli progressively adds structured source profiles, evidence, limitations, guided research playbooks, browser-local project boards, deterministic research-pack exports, MCP retrieval, and evaluated pattern knowledge.

The product must help a person or model answer:

1. Where should I research this task?
2. Which source best fits the current constraints?
3. Why does it fit?
4. What are its access, implementation, freshness, and governance limitations?
5. Which sources and decisions should be retained for the project?
6. Did the resulting UI improve after using Tessli context?

## 2. Product promise

Initial public promise:

> Find the right design source and research path before you build.

Long-term direction:

> Help humans and agents make better UI decisions using curated knowledge, project constraints, relevant precedents, and evaluated outcomes.

Tessli must not publicly claim that it gives AI taste until outcome evidence supports that claim.

## 3. Product layers

### 3.1 Source Index

The repository-managed catalogue of sources, tools, libraries, galleries, systems, assets, and providers.

### 3.2 Research Intelligence

Structured capabilities, task fit, content objects, platforms, frameworks, integrations, agent interfaces, limitations, governance, evidence, and verification.

### 3.3 UI Judgment

Reviewed pattern candidates, project constraints, selected and rejected references, human review outcomes, and approved precedents.

## 4. Product principles

1. **Curated, not crowded.** More URLs do not automatically create more value.
2. **Task fit over universal ranking.** Recommendations are contextual and explainable.
3. **One canonical truth.** Website pages, exports, and MCP use the same data.
4. **Evidence before claims.** Distinguish sourced facts, curator judgment, and project decisions.
5. **Profiles before outbound clicks.** Tessli should help users evaluate a source before leaving.
6. **Local value before account complexity.** Prove Saved, Boards, and export before cloud sync.
7. **Human-reviewed patterns.** Do not mass-generate taste claims from URLs or screenshots.
8. **Accessible calm.** Preserve legibility, keyboard operation, focus, responsive composition, and restrained motion.
9. **Original work.** Tessli is not permission to copy or redistribute third-party work.
10. **Measured learning.** Retain approved and rejected outcomes from real projects.

## 5. Non-goals

Tessli is not:

- only a styled bookmark directory;
- a scraped mirror of paid or private design libraries;
- a screenshot piracy archive;
- a universal aesthetic scoring engine;
- an unreviewed AI-generated pattern dump;
- a social feed;
- a marketplace at the current stage;
- a proxy for user credentials;
- a promise that every one of the 295 sources has equal intelligence depth;
- a replacement for source licences, terms, or current verification.

## 6. Primary audiences

1. Designers researching interfaces, systems, typography, accessibility, and visual direction.
2. Frontend developers looking for implementation-compatible sources and components.
3. Product builders and founders needing a repeatable shortlist instead of scattered bookmarks.
4. OSS team members researching real client and product work.
5. Language models using public Tessli pages, exported research packs, or MCP.
6. Contributors improving source metadata and evidence through reviewed workflows.

## 7. Core user jobs

### Human jobs

- Search for sources by task rather than knowing an exact provider name.
- Understand what a source offers before opening it.
- See whether a source is Listed, Profiled, or Verified.
- Save a source from any research surface.
- Organise selected and rejected references by project.
- Export compact research context to any model.
- Follow a staged research playbook.
- Return to results without losing query, page, or position.

### Model jobs

- Retrieve relevant source profiles for a task.
- Explain fit and limitations.
- Compare genuinely comparable sources.
- Build a research plan.
- Create a compact evidence-linked reference pack.
- Respect authentication, persistence, redistribution, and attribution boundaries.
- Later retrieve reviewed pattern candidates and project constraints.

## 8. Canonical data strategy

### 8.1 Public catalogue

The public source catalogue remains repository-managed during the initial proof stages.

- `lib_data/design-resource-library-295.csv` remains traceable as the original release source.
- Validated generated data remains deterministic.
- Stable IDs and slugs must not change accidentally.
- Accepted source/profile changes remain reviewable through pull requests.
- The public catalogue is not duplicated in Supabase merely to support browsing.

### 8.2 Intelligence profiles

Profiles enrich catalogue sources using structured, evidence-linked metadata.

The website and MCP must consume the same profile truth.

### 8.3 Local project data

Browser-local storage is the initial source of truth for:

- Saved items;
- project Boards;
- notes;
- selected/rejected state;
- project constraints;
- research-pack drafts.

### 8.4 Future cloud data

Supabase becomes the source of truth only after local workspace value is proven, for:

- user profiles;
- cloud Saved;
- cloud Boards and items;
- notes and constraints;
- local-to-cloud import state;
- submissions/reports;
- moderation state;
- account export/deletion records.

## 9. Source coverage levels

### Listed

Required:

- stable ID and slug;
- name;
- URL/domain;
- category;
- source type;
- access model;
- concise sourced description;
- availability status.

### Profiled

Adds:

- best for;
- capabilities;
- content objects;
- platforms/frameworks;
- discovery model;
- integrations;
- workflow fit;
- limitations.

### Verified

Adds:

- evidence;
- verification date;
- confidence;
- agent-interface details;
- credential requirements;
- persistence/redistribution rules;
- human review;
- freshness status.

The UI and MCP must clearly expose the coverage level.

## 10. Initial product loop

The first workflow to prove is:

```text
Search
→ inspect source profile
→ save to local project board
→ record why it matters
→ export research pack
→ give pack to an LLM
→ build
→ review the result
```

No later platform feature may replace proving this loop.

## 11. Active route direction

```text
/                         Curated homepage
/resources                Canonical Browse
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
/content-policy           Source, media, attribution, and takedown policy
```

Future routes appear only with working functionality.

`/resources?category=...` may serve initial category browsing. Dedicated category pages require original editorial value.

## 12. Canonical Browse requirements

`/resources` replaces the competing Explore and Full Reference product models.

Required:

- URL-backed query, filters, sorting, page, and view;
- pagination rather than rendering all 295 results;
- cards, compact list, and table where appropriate;
- one responsive rendering path;
- no duplicate complete mobile and desktop result trees;
- source detail as primary navigation;
- separate Visit source action;
- Save from every view;
- Similar Sources;
- comparison only within meaningful peer groups;
- truthful verification sorting using real dates only;
- empty, error, loading, and no-JavaScript-safe content where practical;
- back/forward and shared URLs restore state.

Recommended initial page sizes:

- 24 cards;
- 50 compact/table rows.

## 13. Source-detail requirements

`/resources/[slug]` is required, not optional.

Minimum page content:

- identity, URL, and summary;
- coverage/verification level;
- best for / not ideal for;
- access model;
- capabilities;
- content objects;
- discovery/search model;
- platforms/frameworks;
- integrations and agent interfaces;
- workflow fit;
- limitations and governance;
- evidence and freshness;
- Similar Sources;
- collection memberships;
- Save, Add to board, and Visit source actions;
- contextual report action once reporting works.

The entire card must not be only an external link.

## 14. Collections/playbooks

Collections become outcome-oriented staged research paths.

Each playbook records:

- goal and audience;
- stages;
- source memberships;
- why each source is included;
- what to inspect;
- what decision it supports;
- optional checklist;
- last reviewed date;
- deterministic Markdown export.

## 15. Saved and Boards

### Saved

- browser-local;
- private to the current browser/device;
- available without an account;
- usable from Browse, source details, and playbooks;
- searchable/filterable as the list grows.

### Boards

A local Board records:

- project goal;
- audience/product constraints;
- selected sources;
- rejected sources/directions;
- per-item notes;
- decisions;
- unresolved questions;
- deterministic Markdown research-pack export.

Boards must be tested locally before authentication and cloud sync.

## 16. Research-pack requirements

The export must distinguish:

- sourced facts;
- curator judgment;
- project decisions;
- rejected directions;
- unresolved questions.

Minimum sections:

- task;
- audience;
- product constraints;
- selected sources;
- selection rationale;
- capabilities;
- limitations;
- evidence/source URLs;
- rejected directions;
- pattern candidates;
- implementation reminders;
- open decisions.

## 17. MCP and model access

Existing read-only native tools remain supported:

- search resources;
- get resource profile;
- compare resources;
- get collection;
- build research plan;
- create reference packet;
- verify resource.

Machine access without MCP should be supported through semantic public pages and model-independent Markdown/JSON exports.

Future pattern/project tools require approved data contracts and reviewed content before implementation.

## 18. Pattern requirements

Start with 5–10 manually reviewed Pattern Candidates used in real OSS projects.

A candidate must define:

- problem;
- when to use;
- when not to use;
- key rules;
- common failures;
- example sources;
- project usage;
- review state/date.

A candidate is promoted only after human review, multiple examples, documented limitations, and real implementation/evaluation evidence.

## 19. Evaluation requirements

The first proof project should use Tessli to research and guide one real OSS page.

Retain where approved:

- project brief;
- constraints;
- selected and rejected sources;
- exported research pack;
- implementation screenshots;
- browser-verification findings;
- human scores and notes;
- final decision;
- changes after review.

Review dimensions:

- task fit;
- hierarchy;
- mobile usability;
- discoverability;
- density;
- coherence;
- consistency;
- component reuse;
- accessibility;
- restraint;
- regression risk;
- ship readiness.

## 20. Delivery stages

### Stage 1 — Trustworthy directory

- consolidate Browse;
- paginate;
- add coverage levels;
- add source details;
- make local Save universal.

### Stage 2 — Reusable research

- local Boards;
- notes;
- staged playbooks;
- research-pack export;
- Similar Sources;
- limited peer comparison.

### Stage 3 — Agent research

- shared website/MCP truth;
- project-specific packs;
- evidence and limitations;
- initial pattern candidates;
- first OSS proof project.

### Stage 4 — Taste evidence

- browser verification;
- human review;
- outcome comparison;
- approved/rejected precedent retention;
- pattern promotion.

### Stage 5 — Persistence and scale

- authentication;
- cloud Saved/Boards;
- local-to-cloud merge;
- submissions/reports;
- expanded verified corpus and patterns.

## 21. Authentication direction

Authentication does not block the local research loop.

When cloud persistence is approved:

### Sign up

- Google OAuth; or
- first name, last name, email, password;
- Terms and Privacy acceptance;
- six-digit email verification OTP;
- optional local-data merge after verification.

### Standard sign in

- Google OAuth; or
- email and password.

Do not require email OTP after every normal password sign-in.

Optional MFA should use authenticator TOTP. Production auth requires custom SMTP, abuse controls, cookie-aware SSR clients, RLS, session/security review, recovery, export, and deletion.

## 22. Visual direction

`design.md` remains the visual contract.

Preserve:

- warm off-white canvas;
- charcoal text;
- restrained orange;
- Newsreader display typography;
- Instrument Sans interface typography;
- subtle grain;
- border-led hierarchy;
- restrained motion;
- real Tessli UI as primary product imagery.

Avoid generic AI-purple branding, glassmorphism, meaningless 3D, continuous animation, oversized rounded wrappers, fake metrics, fake trends, and fake social proof.

Research/database views may be denser than marketing surfaces.

## 23. Accessibility and quality

Required:

- WCAG 2.2 AA targets;
- semantic landmarks/headings;
- full keyboard operation;
- visible focus;
- touch targets appropriate for mobile;
- reduced-motion support;
- no hover-only information;
- valid interactive HTML;
- screen-reader announcements for dynamic results and saves;
- accessible dialogs and OTP controls;
- responsive browser review at required widths;
- no horizontal overflow;
- deterministic data/build outputs;
- complete diff review before merge.

## 24. Security and governance

- validate every external URL;
- block SSRF/private-network access in operator fetchers;
- never expose service-role keys;
- do not inject arbitrary HTML or remote SVG;
- preserve source attribution and evidence;
- respect paid/private-source terms;
- require user-owned credentials for external authenticated providers;
- distinguish transient and persistent data;
- do not redistribute content without permission;
- use RLS for future user-owned cloud data;
- apply server-side validation and abuse protection to future forms.

## 25. Explicit deferrals

Do not build yet:

- public auth activation;
- cloud Saved/Boards;
- a large Pattern catalogue;
- a Styles marketplace or generator;
- payments;
- team workspaces;
- mass screenshot scraping;
- automatic aesthetic scores;
- a Figma plugin;
- a browser extension;
- extra MCP tools without stable data;
- a homepage redesign before Browse, Source Detail, Save, Boards, and export work.

## 26. Initial success criteria

The next product milestone is ready when:

- `/resources` is the one canonical, paginated browser;
- query/filter/view/page state is shareable and restorable;
- every source has an internal detail route;
- coverage levels are truthful;
- Save works across research surfaces;
- a local project Board can retain selected/rejected references and notes;
- a deterministic research pack can be exported;
- one real OSS page is researched and built using that pack;
- browser and human review evidence is recorded;
- no unfinished public links or false product claims remain;
- type, lint, tests, build, accessibility, responsive, security, and complete-diff checks pass.

## 27. Supporting documents

Read in this order:

1. `docs/product-direction.md`
2. `PRD.md`
3. `build-slices.md`
4. `AGENTS.md`
5. `design.md`
6. `docs/product-scope.md`
7. `docs/architecture-and-auth.md`
8. relevant contracts/schemas/slice evidence
