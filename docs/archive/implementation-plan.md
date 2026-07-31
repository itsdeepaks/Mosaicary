# Tessli Pre-development and Implementation Plan

This plan intentionally prevents one large “build the screenshot” prompt.

## Slice 0 — Preparation

### 0.1 Research and design contract

Deliverables:

- `design.md`;
- product scope;
- component contracts;
- page contracts;
- data/media contract;
- architecture/auth plan;
- quality gates;
- approved reference images;
- approved hero asset.

No live UI change.

### 0.2 Content truth pass

- verify resource count;
- verify category count;
- define access labels;
- remove fictional user/activity claims;
- approve launch collections;
- approve footer destinations;
- define legal placeholders.

## Slice 1 — Application foundation

- scaffold Next.js App Router and TypeScript;
- preserve current static site until replacement route is verified;
- install Tailwind;
- establish linting, formatting, and tests;
- add font definitions;
- add design tokens;
- add page grain;
- add responsive container/grid;
- add Storybook or a lightweight component-lab route if practical.

Acceptance:

- no product page redesign yet;
- font and token specimen page reviewed at 1440, 1024, 768, and 390px.

## Slice 2 — Global shell

### 2.1 Wordmark and header

- desktop navigation;
- phase-appropriate signed-out state;
- active links;
- theme control;
- mobile menu.

### 2.2 Footer

- launch-only links;
- responsive structure;
- open-source/legal language.

Acceptance:

- keyboard complete;
- no layout shift from fonts;
- no unfinished links;
- screenshots approved before hero work.

## Slice 3 — Explore hero

### 3.1 Copy and typography

- headline;
- supporting copy;
- responsive line breaks.

### 3.2 Search field

- keyboard shortcut;
- clear;
- focus;
- result announcement.

### 3.3 Hero artwork

- desktop placement;
- tablet adjustment;
- mobile decision;
- no animation initially.

### 3.4 Truthful stats

- 295 resources;
- 11 categories;
- private browser saves;
- open community project.

Acceptance:

- visual comparison with canonical Explore reference;
- no fake data;
- LCP asset optimised;
- no horizontal overflow.

## Slice 4 — Discovery controls

- category navigation;
- All/Saved/Full Reference navigation;
- sort;
- filters;
- URL state;
- mobile filter sheet.

Acceptance:

- keyboard and touch complete;
- category names tested at long lengths;
- shareable URL restores state.

## Slice 5 — Resource card

- typed resource shape;
- media fallback;
- full-card external link;
- save control;
- long-content cases;
- image-failure cases;
- responsive grid.

Acceptance:

- tested with at least twelve varied real resources;
- no broken layout without images;
- no nested-interactive invalid markup;
- modifier and middle clicks work.

## Slice 6 — Explore page composition

- grid;
- result states;
- load-more/pagination decision;
- footer integration;
- empty and error states.

Do not proceed until the full Explore page passes visual QA.

## Slice 7 — Collections

- collection schema;
- repository-maintained launch data;
- featured card;
- compact card;
- collection page;
- collection detail;
- no fake trend/curator data.

## Slice 8 — Full Reference

- dense resource row;
- desktop sidebars;
- tablet filter sheet;
- mobile compact list;
- supporting curation panel.

## Slice 9 — Local Saved

- local-storage migration from existing Tessli/Mosaicary key;
- recent saves;
- empty state;
- clear/undo;
- privacy explanation.

## Slice 10 — Auth foundation

- Supabase project/env setup;
- SSR clients;
- auth shell;
- password;
- OTP;
- Google;
- custom SMTP through Resend;
- callback/error flows.

## Slice 11 — Cloud save and account

- profiles;
- RLS;
- saved resources;
- collections;
- local import;
- account menu;
- deletion/sign-out states.

## Slice 12 — Community forms

- submit;
- suggest;
- report;
- server validation;
- rate limiting;
- moderation state;
- transactional confirmations.

## Working rule for Codex

Every slice must contain:

1. scope and exclusions;
2. files expected to change;
3. component/page acceptance criteria;
4. desktop and mobile screenshots;
5. self-review;
6. accessibility check;
7. regression check;
8. commit only after approval.

The builder does not grade itself as the only reviewer. A fresh verification pass compares the browser output to the canonical reference and the contracts.
