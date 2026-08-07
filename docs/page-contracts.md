# Tessli Page Contracts

Status: **V3 human-interface contract**
Authoritative direction: `docs/product-direction.md`
Delivery sequence: `docs/product-realignment-v3.md`

## Shared responsive frame

### Desktop: 1280px and above

- constrained editorial frame with working primary navigation and personal utilities;
- task search and source content use clear reading hierarchy;
- research surfaces may be denser than marketing content without losing scanability.

### Tablet: 768–1279px

- navigation and controls recompose before they crowd;
- filter/refinement controls may move into a sheet;
- supporting diagnostics move below primary action and reading flow.

### Mobile: below 768px

- mobile is a recomposition, not a shrunken desktop;
- primary actions remain reachable and touch-safe;
- no duplicate complete result trees, essential hover-only information, or horizontal overflow;
- affected pages also pass a 320px overflow check.

## 1. Home `/` — task-led entry (V3.5)

### Purpose

Ask: **What are you trying to design?** Route task intent into canonical Browse; do not recreate Browse.

### Content order

1. global header;
2. short value statement;
3. task search submitting to `/resources?q=...`;
4. three to six task starters, for example SaaS homepage, accessible colour system, component library, typography, motion, and dashboard research;
5. concise three-step explanation: find sources → keep decisions → give context to an agent;
6. three to six selected Collections;
7. concise For AI pathway;
8. global footer.

### Exclusions

Do not render a source-result preview, category scroller, sorting/filter controls, More menu, coverage/verification dashboard, fake usage metrics, or unfinished action. Do not prescribe decorative hero media in this contract; any later visual addition needs a separate approved UI decision.

### Responsive rules

- task question and search appear first on narrow screens;
- task starters become a clear vertical or compact grid list;
- Collections recompose without becoming a second catalogue;
- the three-step explanation remains readable before the footer.

## 2. Browse `/resources` — canonical source browser (V3.4)

### Purpose

Ask: **Which sources fit this task?** This is the only complete public source browser.

### Content order

1. global header;
2. task-focused search and result summary;
3. refinement by category, source type, access, and platform/framework when truthful data supports it;
4. active-filter summary and clear action;
5. paginated result cards or compact list;
6. query-recovery empty state;
7. footer.

### Result contract

Every result exposes:

- source identity;
- one-line purpose;
- two or three high-value task cues;
- approved preview or complete resilient fallback;
- internal `Inspect` action;
- independent Save action;
- independent external `Visit source` action.

Source identity/card opens `/resources/[slug]`. Cards or compact list are the normal rendering; a table may appear only when it earns its complexity for a defined research task. URL state remains shareable and restoreable. Mobile and desktop use one result state and never render duplicate complete result sets.

### Exclusions

Coverage level, evidence count, verification status, human-review status, raw governance, and audit mechanics are not primary filters, summary dashboards, or result-card focal points. Comparison appears only for meaningful peer groups; Similar Sources is the default alternative-discovery mechanism.

## 3. Source Guide `/resources/[slug]` — priority proof (V3.3)

### Purpose

Ask: **Should I use this source, and what should I inspect?** Every stable source slug has a guide.

### Content order

1. breadcrumb;
2. source identity and one-line purpose;
3. approved fixed-ratio preview, with complete fallback;
4. `Visit source`, Save, and Add to Board;
5. `Use it when`;
6. `What to explore`;
7. `How to access it`;
8. `Works with`, when useful;
9. `Important limitations`;
10. `Consider instead`, where each alternative has a meaningful differentiator;
11. Collections containing the source;
12. quiet source details and references.

### Truthful degradation

Listed sources show only what canonical data supports and never simulate Profiled/Verified fields. Missing preview, compatibility, Collection, or enrichment data uses an honest compact fallback. Coverage level, evidence/freshness, human-review status, credentials, persistence/redistribution, and governance remain secondary details or references; they must not interrupt the primary guide reading path.

### Interaction and responsive rules

- Visit is external and separate from internal guide navigation;
- Save and Add to Board are independent, keyboard-complete actions;
- preview maintains its aspect ratio and has a non-media fallback;
- actions recompose to a reachable stack on narrow widths;
- alternatives and Collections never become a horizontal-scroll dependency.

## 4. Collections `/collections` — guided research paths (V3.11)

### Purpose

Ask: **Which guided research path matches my goal?**

### Content order

1. header;
2. concise page introduction;
3. Collection cards showing goal, audience, stage count, and expected decision;
4. footer.

There is no speculative trending/recent usage surface. Category navigation, search, and other discovery controls appear only when they solve a demonstrated Collection discovery need without duplicating Browse.

## 5. Collection detail `/collections/[slug]` — ordered checklist (V3.11)

### Purpose

Ask: **What should I inspect in what order?**

### Required content

- goal, audience, and expected decision;
- ordered stages/checklist;
- per-source role, what to inspect, and decision prompt;
- Save and Add to Board on applicable sources/stages;
- optional quiet machine-access links to canonical JSON/Markdown;
- honest empty/missing-source treatment.

Counts, curator names, dates, and evidence appear only when real and secondary to the research path.

## 6. Saved `/saved` — local shortlist (V3.12)

### Purpose

Ask: **What should I revisit?**

### Required content

- browser-local privacy explanation;
- search and filters for saved items;
- saved source cards/compact rows;
- remove with undo;
- Add to Board;
- useful empty state and query recovery.

No account promotion, fake folders, or heavy management workspace appears before an approved cloud-persistence slice.

## 7. Boards `/boards` and `/boards/[id]` — project decisions (V3.12–V3.13)

### Purpose

Ask: **What have I selected, rejected, and decided?**

### Index requirements

- local Board list with goal/updated context;
- create/select a Board using existing local patterns;
- empty and browser-local privacy states;
- no account or cloud-sync promotion.

### Detail requirements

- project goal, audience, and constraints;
- source intake, notes, and rationale;
- selected, rejected, and undecided decisions;
- unresolved questions;
- compact agent handoff in deterministic Markdown and compact JSON;
- accessible confirmation for save/remove/export/copy actions.

Boards remain browser-local. The page must not imply remote collaboration, cloud persistence, or model access to local state before the user copies or downloads an export.

## 8. For AI `/for-ai` — human-to-agent workflow (V3.14)

### Purpose

Explain how an agent can use Tessli truth without overstating transport availability or design taste.

### Content order

1. header and outcome-led introduction;
2. what Tessli gives an agent;
3. one example task and compact result;
4. access without MCP: semantic pages, JSON, Markdown, and Board export;
5. local MCP setup while it is the available transport;
6. remote MCP setup only after it exists;
7. access-route vocabulary;
8. concise privacy and provider boundaries;
9. optional secondary diagnostics, setup detail, and coverage/governance material;
10. footer.

### Required behavior

- static, indexable, semantic server-rendered content before client JavaScript;
- no hosted endpoint, client support, live-provider verification, crawling, credentials, account access, project-code ingestion, or write capability is implied unless shipped;
- examples link to real canonical representations;
- retrieval is never described as automated taste or an outcome guarantee;
- code blocks scroll internally without widening the document.

## 9. About `/about`, Curation `/curation`, and legal pages

### About

- human-curated AI-native definition;
- what Tessli is and is not;
- source and provider boundaries;
- no invented founder, team, usage, or impact claims.

### Curation

- selection principles;
- update and correction route when operational;
- quiet provenance and maintenance policy;
- no public-facing verification bureaucracy or false live-status promise.

### Legal

Privacy, Terms, and Content policy are footer-only, concise, factual policy pages without product promotion.

## 10. Unpublished and internal routes

`/auth`, `/submit`, `/suggest`, and report routes are not public page contracts until their complete approved workflows exist. Do not render disabled shells, sign-in calls to action, or placeholder forms.

`/lab/*`, `/proofs/*`, Pattern Candidate, and human-review surfaces are internal and unlinked. They require `noindex` and must not appear in public navigation, sitemap discovery, or marketing copy.

## 11. System states

All public surfaces need truthful 404, general error, offline/load-failure, empty-search, empty-Saved, empty-Board, and data-unavailable states. Auth-specific states are deferred with auth itself. Toasts cannot be the only explanation of an error and dynamic results, Save, Board, export, and copy outcomes need accessible announcements.
