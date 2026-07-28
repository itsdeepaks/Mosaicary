# Tessli Page Contracts

## Shared responsive frame

### Desktop: 1280px and above

- maximum page width `1280px`;
- 12-column grid;
- `32–48px` side gutters;
- header navigation visible;
- resource grid: four columns where card width remains at least `270px`.

### Tablet: 768–1279px

- 8-column grid;
- `24px` gutters;
- hero image reduced or moved;
- resource grid: two columns;
- filter controls wrap into two rows or move into a sheet;
- permanent secondary sidebars collapse.

### Mobile: below 768px

- 4-column grid;
- `16–20px` gutters;
- one-column cards;
- mobile menu sheet;
- category scroller;
- filter sheet;
- large tables transform to rows/cards;
- no essential hover-only behaviour.

## 1. Explore `/`

### Purpose

Help a visitor find a relevant resource quickly.

### Desktop order

1. Header
2. Two-column hero
   - headline and supporting copy
   - global search
   - geometric artwork
3. Truthful four-slot value/stat row
4. Category navigation
5. Resource-view navigation
6. result count, sort, filters
7. resource-card grid
8. pagination/load more
9. footer

### Hero

Headline direction:

> Find better design resources, faster.

Supporting copy must remain concise and factual.

Artwork:

- right side;
- decorative, empty alt;
- maximum visual width about 46% of hero;
- must not overlap search or copy;
- no continuous motion in version one.

### Tablet

- text receives 55–60% width;
- artwork 40–45%;
- statistics wrap 2×2 if needed.

### Mobile

- headline and search first;
- artwork becomes a smaller centred band after search or is hidden below 390px;
- four stats use 2×2 grid;
- category navigation follows immediately.

## 2. Collections `/collections`

### Purpose

Provide curated bundles around real design tasks.

### Desktop

1. Header
2. collection hero + search
3. collection category navigation
4. featured collection grid
5. recent/trending section only when backed by real data
6. footer

### Launch collections

Examples must be maintained in repository data:

- SaaS landing-page references;
- typography and font tools;
- motion starter pack;
- open-source UI libraries;
- accessible colour tools;
- design systems worth studying.

“Trending” is excluded until real usage data exists. Use “Recently curated” instead.

## 3. Collection detail `/collections/[slug]`

- collection title and purpose;
- item count;
- maintainers/curators only when real;
- collection description;
- resource cards;
- save collection after auth exists;
- last reviewed date;
- contribution/correction link.

## 4. Saved `/saved`

### Guest state

- title and browser-local privacy explanation;
- recent saves;
- clear saved with confirmation;
- empty state;
- no fake folders unless local folders are implemented;
- sign-in sync callout appears only after Phase 2 exists.

### Authenticated state

- sidebar at desktop;
- all saves, recent, collections, tags, trash;
- resource grid/list toggle;
- notes area;
- local import notice if local saves exist.

### Mobile

- sidebar becomes top-level view selector or drawer;
- recent saves stay first;
- collections appear as compact cards.

## 5. Full Reference `/resources`

### Purpose

Dense, research-oriented catalogue view.

### Desktop

- compact title area;
- search and real statistics;
- left category/filter sidebar;
- central resource list/table;
- right supporting panel for curation, popular tags, and contribution links.

### Tablet

- both sidebars collapse;
- filters open in sheet;
- supporting panel becomes an inline disclosure.

### Mobile

- search;
- filter/sort row;
- compact resource rows;
- no three-column layout;
- metadata shown progressively.

## 6. Resource detail `/resources/[slug]`

Optional for the first release but defined now.

- name, domain, and external CTA;
- description;
- category, access, task tags;
- favicon/preview;
- last verified;
- save;
- report incorrect information;
- related resources;
- no embedded copy of the destination site.

## 7. About `/about`

- Tessli mission;
- what is curated;
- what is not;
- open-source relationship;
- how to contribute;
- no inflated founder/team story.

## 8. Curation `/curation`

- acceptance criteria;
- metadata definitions;
- access-model definitions;
- freshness policy;
- removal/correction process;
- screenshot/logo policy;
- disclosure that availability and pricing can change.

## 9. Submit `/submit`

### Fields

- URL;
- website name;
- description/use case;
- category;
- access model;
- useful-for tags;
- reason for inclusion;
- submitter email;
- agreement to guidelines.

### Flow states

- idle;
- URL validating;
- metadata preview;
- duplicate detected;
- validation error;
- submitting;
- success;
- moderation pending.

## 10. Suggest `/suggest`

Use the label **Suggest an improvement**.

Fields:

- title;
- problem;
- proposed improvement;
- who benefits;
- optional reference;
- email.

## 11. Report `/report/[resourceId]`

Fast correction flow:

- broken link;
- wrong category;
- pricing/access changed;
- resource unavailable;
- misleading description;
- other;
- optional note.

## 12. Authentication pages

### Sign in

- Google;
- email continue;
- password or OTP selection;
- forgot password;
- legal text.

### Sign up

- Google;
- email;
- password option;
- OTP option;
- email verification;
- no unnecessary profile fields.

### Verify

- six individual visual slots but one semantic input;
- paste support;
- resend timer;
- change-email action;
- clear error state.

### Reset password

- new password;
- confirm;
- password requirements;
- session validation.

## 13. System pages

Required:

- 404;
- 500/general error;
- offline/load failure;
- empty search;
- empty saved;
- expired auth link;
- access denied;
- maintenance/data unavailable.
