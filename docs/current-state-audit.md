# Current-state audit

> **Repository facts remain current; product disposition was updated after this audit.** The catalog is now treated as source-map seed material and a possible future workbench view. The primary product is the Codex UI Intelligence Skill/plugin, Source Hub MCP, and evaluation harness described in `ui-intelligence-research.md`.

**Audited:** 22 July 2026  
**Scope:** Repository and runtime inspection only; no product implementation or dashboard redesign

## Executive assessment

The repository is a valid static preview of a curated resource list, not yet an application platform. Its strongest reusable asset is the clean 295-row resource seed and a working browser-based directory. Its largest mismatch with the strategy is structural: it has no concept of projects, product context, patterns, screens, decisions, reviews, persistence, APIs, agent integration, or verification.

The current dashboard may later become a source-catalog view inside an optional workbench. It should not be treated as the product home and should not be redesigned before the agent workflow and evaluation harness are proven.

## What exists

```text
design-library-preview/
├── index.html
├── README.md
├── lib_data/
│   ├── design-resource-library-295.csv
│   └── design-resource-library-295.md
└── docs/
    └── design-context-engine-strategy-report.md
```

There was no `AGENTS.md`, package manifest, lockfile, source directory, database, migration, API, automated test, lint configuration, type-check configuration, or Git metadata at audit time.

## Application architecture

- **Runtime:** one static HTML file served by Python's standard HTTP server.
- **UI:** semantic HTML plus approximately 45 lines of compressed inline CSS.
- **Behavior:** vanilla JavaScript in `index.html`.
- **Data:** CSV and Markdown fetched from `lib_data/` at runtime.
- **Third-party runtime dependency:** `marked` loaded from jsDelivr to render Markdown.
- **State:** in-memory filter state only; a refresh resets everything.
- **Routes:** only `/`; Library and Markdown are client-side tab states.
- **Backend/API:** none.
- **Persistence/auth/jobs:** none.

## Current data flow

```text
lib_data/design-resource-library-295.csv
        ↓ fetch + hand-written CSV parser
in-memory array of Resource-like rows
        ↓ search / exact category filter / exact access filter / sort
295 DOM cards or a filtered subset

lib_data/design-resource-library-295.md
        ↓ fetch + marked.parse from CDN
HTML inserted into the Markdown panel
```

The CSV contains 295 complete rows across 11 categories, with no duplicate names, duplicate URLs, missing names, missing URLs, or non-HTTPS URLs. Access distribution is 130 Free, 81 Open source, 75 Freemium, 8 Paid, and 1 Free trial.

## Functional features

- Keyword search across name, URL, category, access model, and description.
- Category and access-model filters.
- Name, category, and access sorting.
- Summary statistics.
- Responsive card-grid styling.
- Direct outbound links with `noopener noreferrer`.
- Rendered Markdown view.
- Light/dark colors based on the operating-system preference.

There is no file-import UI despite the CSV/Markdown files acting as manually supplied inputs.

## Runtime and dashboard assessment

Desktop browser verification confirmed that all 295 resources load and render. Searching for `dashboard` returned one result; filtering to `Product UI, UX flows, and mobile-app inspiration` returned 25. The Markdown tab loaded and rendered its source document. No page errors or console errors were reported. The server did log a non-blocking 404 for a missing `favicon.ico`.

![Current desktop resource library](./current-dashboard-desktop.png)

At a 390 × 844 viewport, the content renders as a single-column card list but has horizontal overflow. The document width reached 545px because the search input and three selects retained 518px widths inside the one-column toolbar. This is a real mobile defect, but fixing it is outside this planning-only slice.

![Current mobile resource library](./current-dashboard-mobile.png)

Accessibility observations from browser/source inspection:

- Search relies on placeholder text instead of a persistent label.
- The three selects have no associated labels.
- The tab buttons do not expose tab roles, `aria-selected`, or controlled panels.
- All matching cards are mounted at once; acceptable for 295 rows, but not a durable scaling strategy.
- The visible heading and outbound links are represented in the accessibility tree.

## Classification against the strategy

| Classification | Current elements | Decision |
|---|---|---|
| Useful foundation | Curated CSV/Markdown corpus, category/access metadata, basic resource discovery | Preserve and import with provenance |
| Useful but needs restructuring | Search/filter/sort behavior, visual resource cards, statistics | Rebuild as the `/resources` area after the project workflow exists |
| Directory-only functionality | Markdown mirror, generic resource browsing, total/free counts | Keep available, but do not make it the product center |
| Missing core functionality | Projects, context normalization, patterns, references, screens, decisions, packs, exports, reviews, rules | Build through ordered vertical slices |
| Unnecessary or premature | None implemented | Continue excluding public accounts, billing, teams, community, scraping, and marketplace work |
| Technical debt/risk | Single-file code, no tests/tooling, CDN dependency, mobile overflow, unlabeled controls, hand-written CSV parser | Address only when touched by an approved task |

## Strong reusable parts

1. **Resource seed:** the CSV is internally consistent enough to seed a real `Resource` table.
2. **Proven discovery affordances:** search, category, access, sorting, and direct links are appropriate for a future resource view.
3. **Strategy report:** it clearly distinguishes discovery metadata from design intelligence and gives the product a defensible boundary.
4. **Low migration risk:** there is little application code to unwind, so the product can adopt a durable foundation without preserving a premature architecture.

## Gaps against the intended workflow

| Intended step | Current support |
|---|---|
| Create/select a project | Missing |
| Provide brief and repository context | Missing |
| Normalize project design context | Missing |
| Define target screen | Missing |
| Retrieve patterns and references | Only generic resource browsing exists |
| Generate a Design Decision Pack | Missing |
| Export for a coding agent | Missing |
| Verify rendered implementation | Missing |
| Remember accepted/rejected decisions | Missing |

## Technical risks

- The directory is not under Git, so changes lack safe diffs and rollback history.
- A framework migration is unavoidable before persistence, validated forms, exports, APIs, or MCP can be implemented.
- Loading `marked` from a CDN makes Markdown rendering depend on network availability; inserting parsed HTML would also need sanitization if documents ever become untrusted.
- The hand-written CSV parser is adequate for the current seed but should not become a general ingestion boundary without schema validation and error reporting.
- Access/pricing metadata is time-sensitive; the current dataset has a compilation date but no row-level verification timestamp.
- Resource categories are broad directory categories, not the task-oriented pattern taxonomy required for design decisions.
- Rendering every result eagerly will become slow when references and patterns expand.
- No licensing/provenance fields exist beyond source URLs and a document-level disclaimer.

## Dashboard disposition

Preserve the dashboard as a working legacy source-catalog preview. If the optional workbench is later justified, its data and discovery affordances can become a source-catalog view. No current program track requires dashboard migration or redesign; the first implementation work is the evaluation harness and repo-local `ui-plan` Skill.

## Evidence collected

- `python -m http.server 8000 --bind 127.0.0.1`
- Browser load, interactive snapshot, console check, page-error check, search, category filter, Markdown tab, desktop screenshot, and mobile screenshot.
- CSV integrity and distribution checks with PowerShell `Import-Csv`.
- Repository file, configuration, and placeholder search with `rg` and `Select-String`.

## Audit limitation

This audit did not re-verify the public pricing, availability, licenses, or descriptions of all 295 external sites. Those fields are seed data, not guaranteed current facts.
