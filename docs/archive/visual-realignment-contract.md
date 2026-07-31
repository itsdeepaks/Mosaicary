# Tessli visual realignment contract

Status: **approved delivery sequence**
Recorded: 2026-07-29

## Purpose

This contract translates the annotated browser review into independently reviewable delivery slices. It reconciles the approved visual direction with the Phase 1 product rules: only working routes and truthful states may appear in production.

## Canonical evidence

Use the user-authorized original WebPs in `docs/ref-img/` as the desktop art-direction source. Their dimensions and hashes are recorded in `docs/asset-manifest.md`. The static `brand-preview/` remains a useful specimen, but its derivative assets are not the canonical references and do not enter production UI.

Visual references guide composition, spacing, typography, borders, and the hierarchy of controls. Repository catalogue data, supported routes, and Phase 1 truthfulness rules always win over tiny screenshot text or decorative placeholder UI.

## Decisions from the review

| Review finding | Contract decision | Delivery slice |
|---|---|---|
| Mac-only `⌘ K` hint | Display `Ctrl / ⌘ K`; retain actual Ctrl/Command keyboard support. | 7.1b |
| Hero feels undersized and unbalanced | Recompose the existing two-column hero around the production derivative; keep copy, search, facts, and art intentionally balanced at all required widths. | 7.1b |
| Category rail is cut off | Desktop uses primary categories plus `More` inside the page frame. Tablet/mobile retains scrolling with an explicit overflow affordance. | 7.1c |
| Resource cards feel separated | Catalogue cards form one dense, shared-border grid with zero visual gutters and no doubled joining borders. | 7.1d |
| Header lacks the reference's right-side controls | Do not add decorative account or theme controls. Add a real Saved shortcut only with Slice 8.2; add sign-in/account only with Phase 2 auth. | 8.2, 10.2 |
| Full Reference needs responsive completion | Recreate the parked 7.2 work from refreshed `main` only after the Explore realignment sequence lands. | 7.2 |

## Delivery order

1. **7.1a — this documentation slice.** Track the canonical references, correct their paths and provenance, and state the non-negotiable visual decisions.
2. **7.1b — hero and search.** Change only the Explore hero/search composition and visible shortcut language. Verify at 1440, 1024, 768, and 390px.
3. **7.1c — category rail.** Change only category containment and overflow behaviour; preserve existing URL state and accessibility.
4. **7.1d — card grid.** Change only resource-grid/card group layout; preserve external-link and media-fallback semantics.
5. **7.2 — Full Reference responsiveness.** Start from the then-current merged `main`, not the parked local branch.
6. **8.1 and 8.2 — local saves.** Deliver save controls, the Saved route, and only then a working Saved header shortcut.
7. **9.1 and 9.2 — public content/legal and Phase 1 hardening.** Complete required pages and release review before any auth work.

## Acceptance criteria for 7.1a

- all five user-authorized WebPs are tracked without pixel changes;
- every canonical reference path exists and its dimensions, byte size, and SHA-256 are documented;
- design, component, page, and asset contracts agree on reference provenance and the reviewed visual decisions;
- the slice ledger records the new execution order without claiming unimplemented work is complete;
- no runtime, catalogue, schema, dependency, or generated-data file changes.

## Exclusions

- no application UI or CSS changes;
- no new account, theme, or Saved control before its functional slice;
- no repair or replacement of `brand-preview/` derivative assets;
- no merge or continuation of the parked Full Reference responsive branch.
