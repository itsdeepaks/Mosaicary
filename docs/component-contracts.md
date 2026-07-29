# Tessli Component Contracts

Each component must be implemented, browser-tested, and approved independently before it is used to compose full pages.

## 1. Global header

### Anatomy

- Tessli wordmark;
- desktop navigation;
- Saved shortcut;
- theme control;
- sign-in or account control;
- mobile search shortcut;
- mobile menu button.

### States

- transparent/default;
- scrolled with subtle canvas backdrop;
- active route;
- keyboard focus;
- mobile sheet open;
- signed out;
- signed in;
- session loading;
- session expired.

### Behaviour

- desktop header height: approximately `64px`;
- sticky only after visual testing; no heavy blur;
- active route uses orange underline, not filled pill;
- Phase 1 shows only routes and utilities that work: the Saved shortcut appears after the browser-local Saved page is delivered; sign-in/account waits for the real auth slice; a theme control waits for two genuinely designed themes;
- mobile navigation opens a full-height sheet;
- Escape closes open menus/sheets;
- focus returns to the trigger.

## 2. Wordmark

- text-based Newsreader wordmark for version one;
- link to `/`;
- no icon beside the wordmark;
- desktop approximately `34–38px`;
- mobile approximately `30–32px`;
- must remain readable in dark mode;
- later custom lettering may replace the font rendering without changing dimensions.

## 3. Account menu

### Signed out

Show `Sign in`, not a fake avatar.

### Signed in trigger

- avatar image when available;
- generated initial fallback;
- visible focus ring;
- minimum `40×40px` target.

### Menu

- name and email;
- Saved resources;
- My collections;
- Submissions;
- Account settings;
- Theme;
- Sign out.

### Accessibility

- use a proven menu primitive;
- arrow-key navigation;
- Escape close;
- click-outside close;
- no hover-only access.

## 4. Search field

### Anatomy

- search icon;
- input;
- optional keyboard hint;
- clear button when populated;
- optional loading indicator.

### States

- empty;
- focused;
- typing;
- loading;
- results;
- no results;
- error;
- disabled.

### Behaviour

- `/` or `Ctrl/Command + K` may focus global search;
- when a visible hint is used, it must be platform-neutral (for example, `Ctrl / ⌘ K`) rather than presenting the Mac Command symbol as universal;
- Escape clears first, then removes focus;
- debounce `80–120ms` for local filtering;
- no network call for the initial 295-entry catalogue;
- visible result count updates through an `aria-live` region.

## 5. Hero statistics row

Four truthful slots:

- 295 / Curated resources
- 11 / Practical categories
- Private / Browser-local saves
- Open / Community-built project

On mobile, use a two-by-two grid. Do not create horizontal overflow for these items.

## 6. Category navigation

### Desktop

- horizontal bordered surface;
- category icon, label, and optional count;
- active item uses orange text/underline;
- primary categories stay contained within the page frame; “More” opens remaining categories only when necessary instead of clipping the rail.

### Mobile

- horizontally scrollable chips or a compact category sheet;
- first and last items receive edge padding;
- active item is always scrolled into view;
- a visible edge/overflow affordance communicates that more categories are available; scrollbar may be visually hidden only when that affordance remains;
- scrolling remains available by touch, wheel, keyboard, and assistive technology.

## 7. Tabs

Used for `All resources`, `Saved`, and `Full reference`.

- underline treatment;
- no filled segmented-control appearance;
- `role="tablist"` only when switching panels without navigation;
- use normal links when tabs represent routes;
- counts use tabular numerals.

## 8. Resource card

### Anatomy

- media area;
- image/fallback;
- save control;
- title;
- optional external arrow;
- description;
- category and useful-for tags;
- access model;
- optional details action.

### Interaction

- full card external link implemented through a stretched anchor;
- save button sits above the stretched link in stacking order;
- middle-click and modifier-click must work;
- selection of text remains possible;
- hover and focus-within share a visual treatment.

### Grouped-grid treatment

- dense catalogue grids may use a shared border and zero visual gutters so adjacent cards read as one composed reference frame;
- use collapsed interior borders or a single-pixel overlap so joining edges never double in weight;
- preserve a clear focus treatment that is visible across neighbouring cards;
- responsive column changes recompute the shared frame rather than reintroducing arbitrary card gaps.

### States

- default;
- hover;
- keyboard focus;
- saved;
- image loading;
- image failed;
- missing description;
- long title;
- long category;
- unavailable/broken resource.

### Content limits

- title: two lines maximum;
- description: two or three lines depending on density;
- no more than three visible tags;
- access model remains visible;
- use fixed media ratio to prevent layout shift.

## 9. Collection card

Variants:

- featured;
- compact/trending;
- personal/private.

Required:

- cover composition;
- title;
- description;
- item count;
- save action;
- curator attribution only when real;
- updated date only when real.

No fake avatars or contributor names.

## 10. Filters

Controls:

- category;
- access model;
- useful-for/task tags;
- sort;
- clear all.

Desktop may use inline controls or sidebars. Mobile uses a filter sheet.

State must be reflected in URL parameters so a filtered view can be shared.

## 11. Saved workspace

Guest:

- browser-local explanation;
- recent saves;
- optional locally defined groups;
- sign-in prompt appears only after auth exists.

Authenticated:

- synced resources;
- collections;
- tags;
- notes;
- local import prompt;
- trash/undo.

## 12. Full-reference row

Desktop columns:

- resource;
- category;
- access;
- last verified;
- save.

Mobile becomes a compact card row. Never force the desktop table into horizontal scrolling as the primary experience.

## 13. Form controls

Required primitives:

- text input;
- URL input;
- email input;
- password input;
- OTP input;
- textarea;
- select/combobox;
- checkbox;
- radio group;
- field message;
- submit button;
- success panel;
- error summary.

All controls:

- visible labels;
- descriptive errors;
- `44px` minimum touch height;
- focus ring independent of border colour;
- loading state does not change width;
- no placeholder-only labels.

## 14. Authentication shell

### Desktop

- left: restrained Tessli artwork and one short value statement;
- right: form area;
- no oversized marketing carousel;
- form maximum width approximately `420px`.

### Mobile

- logo;
- title and supporting copy;
- form;
- help/legal text;
- decorative image hidden or reduced.

### Sign-in hierarchy

1. Continue with Google
2. divider
3. email field
4. Continue
5. choose password or one-time code when relevant

Do not show password and OTP forms simultaneously.

## 15. Footer

- Tessli statement;
- four link groups;
- no newsletter until operational;
- responsive columns;
- mobile may use simple stacked groups, not necessarily accordions;
- legal and open-source/data licence copy must not conflict.

## 16. Toasts and feedback

Use to confirm:

- saved/removed;
- copied filter URL;
- submission received;
- local saves imported;
- error with retry.

Toasts never contain the only explanation of an error and must be screen-reader announced.
