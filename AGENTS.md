# AGENTS.md — Tessli Repository Rules

This file is mandatory reading for every agent, contributor, and automated coding session working in this repository.

## 1. Active repository direction

The active delivery track is **Tessli**, a curated design-resource index evolving from the current static catalogue into a phased Next.js product.

The repository also contains older `ui-intelligence` research, evaluation, Skill/plugin, and Source Hub MCP material. Preserve that work, but do not treat it as the active product direction unless a future slice explicitly targets that research track.

Do not delete or rewrite unrelated research artifacts during Tessli product slices.

## 2. Read before changing code

Always read, in order:

1. current `main` state;
2. `PRD.md`;
3. `build-slices.md`;
4. this `AGENTS.md`;
5. `design.md` for any visible UI work;
6. the relevant files under `docs/`;
7. the relevant file under `schemas/`;
8. existing code and tests in the area being changed.

For an explicitly approved UI-intelligence research slice, also read the older research/program documents named by that slice.

Do not rely on a previous session summary instead of rereading repository truth.

## 3. One-slice rule

Implement exactly one vertical slice per branch and pull request.

Do not mix:

- framework setup with page redesign;
- catalogue migration with card implementation;
- header work with hero work;
- public discovery work with authentication;
- schema changes with unrelated visual polish;
- Tessli product delivery with UI-intelligence experiments;
- refactors not required by the slice.

When a useful improvement belongs to a later slice, record it and leave it out.

## 4. Required slice loop

Every slice follows this sequence:

1. Read current `main`.
2. Read `PRD.md`, `build-slices.md`, `AGENTS.md`, and relevant schema/contracts.
3. Create a branch from current `main`.
4. Define exact acceptance criteria and exclusions.
5. Implement one vertical slice.
6. Run focused tests.
7. Review the complete diff.
8. Fix findings.
9. Run all available CI checks.
10. Commit intentionally.
11. Open a draft PR.
12. Review PR diff, browser output, and CI.
13. Fix final issues.
14. Squash-merge.
15. Delete the branch.
16. Refresh from updated `main`.
17. Start the next slice.

Never start a later slice from an unmerged feature branch.

## 5. Branch and commit conventions

Branch examples:

```text
chore/app-scaffold
feat/design-foundation
feat/global-header
feat/explore-hero
feat/catalogue-migration
feat/resource-card-pilot
fix/mobile-filter-overflow
docs/repository-operating-contract
```

Commit prefixes:

```text
chore:
feat:
fix:
test:
docs:
refactor:
```

Commits should describe an intentional unit of work. Do not use messages such as `update`, `changes`, `fix stuff`, or generated timestamps.

Squash-merge PRs unless a future repository policy explicitly changes this.

## 6. Pull request contract

Every PR must state:

- slice ID and goal;
- exact acceptance criteria;
- exclusions;
- files expected to change;
- focused tests run;
- full CI checks run;
- browser sizes checked;
- accessibility notes;
- security notes when applicable;
- complete-diff review findings;
- intentional deviations;
- whether credentials or external setup remain blocked.

Open as draft until implementation, focused tests, and first diff review are complete.

## 7. Tessli design rules

`design.md` is the visual source of truth.

Non-negotiable rules:

- Newsreader Variable is the wordmark/display family.
- Instrument Sans Variable is the interface family.
- Multi-word display headings use approximately `letter-spacing: -0.015em`.
- Section-level `h2` uses approximately `letter-spacing: -0.025em`.
- The single-word Tessli wordmark may remain tighter.
- Page canvas is warm off-white, not pure white.
- Text is charcoal, not large pure-black surfaces.
- Orange is a restrained signal, not a background theme.
- Cards, panels, grouped grids, and reference frames are sharp/square.
- Buttons, inputs, menus, and small controls may use approved 4–8px radii.
- Avatars and true pills may be circular.
- Borders carry hierarchy; shadows are reserved for elevation.
- Grain applies only to the page atmosphere and stays subtle.
- No glassmorphism, blue/purple glow gradients, cursor-follow effects, scroll-jacking, or continuous floating hero animation.
- Do not import a prebuilt shadcn theme.
- Do not use generic AI filler copy, fake metrics, fake curators, fake trends, or fake social proof.

A visually plausible implementation that ignores these rules is not acceptable.

## 8. Visual implementation workflow

For every visible slice:

1. identify the canonical reference image and relevant component/page contract;
2. list allowed visible copy;
3. implement only the selected slice;
4. render in a real browser;
5. check at required widths;
6. compare layout, typography, colour, asset treatment, borders, spacing, and interaction states;
7. record mismatches and fixes;
8. repeat until no material design-review issue remains.

Required widths unless the slice says otherwise:

```text
1440px
1024px
768px
390px
```

Mobile is a recomposition, not a shrunken desktop page.

## 9. Accessibility rules

Required:

- semantic landmarks and heading order;
- keyboard-complete interaction;
- visible `:focus-visible` states;
- Escape closes menus, sheets, and dialogs where expected;
- focus returns to the invoking control;
- appropriate touch targets;
- reduced-motion support;
- no hover-only information;
- no nested buttons/links or invalid interactive markup;
- screen-reader announcements for dynamic result and save states;
- meaningful labels and error messages;
- WCAG 2.2 AA contrast targets.

Do not treat an automated accessibility scan as the only accessibility review.

## 10. Data rules

Phase 1 public catalogue truth remains repository-managed.

- Preserve all source rows during migration.
- Never silently drop invalid rows.
- Generate a validation report for invalid URLs, missing descriptions, unknown labels, and duplicates.
- Generated data must be deterministic.
- Stable IDs and slugs must not change accidentally.
- Do not duplicate the public catalogue in Supabase during Phase 1.
- Do not invent missing media, pricing, status, or curation facts.

Relevant schema: `schemas/catalogue.schema.json`.

## 11. External media rules

Fallback order:

1. approved manual preview;
2. Open Graph image;
3. favicon in a designed tile;
4. generated letter mark.

Requirements:

- fixed aspect-ratio media containers;
- layout remains complete when all media fails;
- lazy loading below the fold;
- arbitrary external images use safe referrer behaviour;
- never inject remote SVG markup;
- do not add an unrestricted image proxy or wildcard optimizer;
- future metadata fetching must block private networks, unsafe protocols, excessive redirects, and oversized responses.

## 12. Authentication and database rules

Authentication begins only in its approved slice.

- Supabase Auth handles password, six-digit email OTP, and Google OAuth.
- Use server/cookie-aware Next.js clients.
- User-owned tables require Row Level Security.
- Test RLS as anonymous and authenticated users.
- Service-role keys never appear in browser code, logs, screenshots, fixtures, or GitHub.
- Resend/custom SMTP is required before public auth email testing.
- Do not create fake auth state solely to make screenshots look complete.

## 13. Forms and security

Community forms require:

- server-side validation;
- URL normalization;
- duplicate detection;
- input length limits;
- rate limiting;
- honeypot before adding CAPTCHA;
- safe error messages;
- moderation status;
- audit timestamps.

Any metadata-fetching feature requires an explicit SSRF review.

## 14. Testing expectations

Use repository scripts once they exist:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Focused tests should run before full checks.

Examples:

- schema parse and fixture validation for data work;
- component interaction tests for controls;
- route tests for navigation;
- browser checks for responsive UI;
- RLS policy tests for database work;
- migration count/determinism tests for catalogue work.

Do not claim CI passed when no CI workflow exists. State exactly what was and was not available.

## 15. Diff review checklist

Before opening or merging a PR, review the full diff for:

- scope creep;
- copied or duplicated implementation;
- accidental generated files;
- secrets and personal data;
- incorrect product claims;
- dead routes or links;
- unhandled loading/error/empty states;
- mobile overflow;
- invalid interactive HTML;
- missing tests;
- accessibility regressions;
- schema drift;
- unnecessary dependencies;
- unsafe external URL or image handling;
- visual drift from Tessli's contract.

Fix findings before requesting merge.

## 16. Dependency policy

- Prefer platform and existing dependency capabilities.
- Add a dependency only when it materially reduces risk or complexity.
- Use official documentation for current APIs.
- Commit a lockfile.
- Avoid abandoned packages and broad component/theme kits.
- Do not add analytics, cookies, tracking, auth, or email dependencies before their approved slice.

## 17. Generated and binary files

- Keep approved visual references and production assets in documented locations.
- Optimize assets without overwriting original approved sources.
- Record dimensions and intended usage.
- Do not commit temporary screenshots, QA traces, browser profiles, build directories, environment files, or downloaded font binaries.
- Never share or commit font files unless licensing and repository policy explicitly require it.

## 18. UI-intelligence research preservation

For a future explicitly approved UI-intelligence research slice:

- preserve baseline artifacts and evaluation conditions;
- keep planning and implementation phases distinct;
- retain provenance when importing source material;
- do not proxy or cache paid/private source content without licensed authorization;
- keep generated evaluation artifacts separate from curated catalogue data;
- record model/agent, tools, timing, and comparison conditions where required.

These rules do not override the active Tessli PRD for normal product-delivery slices.

## 19. Current source documents

Always reconcile Tessli work with:

- `PRD.md`
- `build-slices.md`
- `design.md`
- `docs/product-scope.md`
- `docs/component-contracts.md`
- `docs/page-contracts.md`
- `docs/data-and-media-contract.md`
- `docs/architecture-and-auth.md`
- `docs/quality-gates.md`
- `schemas/catalogue.schema.json`

When documents conflict, stop and resolve the conflict in a dedicated documentation slice instead of guessing.
