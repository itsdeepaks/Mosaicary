# Tessli Component Contracts

Status: **V3 human-interface contract**

Each reusable component is implemented and browser-tested in its approved vertical slice before composing it into full pages. These contracts describe working public interfaces only; deferred components do not authorize public routes or calls to action.

## 1. Global header

### Anatomy

- Tessli wordmark;
- working primary navigation: Browse, Collections, For AI;
- personal utilities: Search, Saved, Boards;
- mobile menu and search shortcut.

### Behaviour

- desktop height approximately `64px`;
- active route uses a restrained orange underline, not a filled pill;
- show only working routes/utilities;
- Browse is canonical, Saved and Boards are browser-local;
- no public Sign in, account, Submit, Suggest, Lab, proof, or review control before its approved slice;
- mobile navigation opens a full-height accessible sheet;
- Escape closes sheets/menus and focus returns to their triggers.

## 2. Wordmark

- text-based Newsreader wordmark for version one;
- links to `/`;
- no icon beside the wordmark;
- desktop approximately `34–38px`; mobile approximately `30–32px`;
- remains readable in dark/forced-colour contexts.

## 3. Search field

### Anatomy

- visible label or equivalent accessible name;
- search icon, input, clear action when populated;
- optional platform-neutral keyboard hint;
- result status through an `aria-live` region.

### States and behaviour

- empty, focused, typing, loading, results, no-results, error, disabled;
- `/` or `Ctrl / ⌘ K` may focus global search;
- Escape clears first, then removes focus;
- local catalogue filtering may debounce `80–120ms` without a network call;
- a task search on Home submits to `/resources?q=...`.

## 4. Task starter

Used on Home only.

- concise task label and optional one-line context;
- links to a meaningful `/resources` query;
- three to six items maximum;
- visible focus and minimum touch target;
- never becomes a category rail, result set, or decorative pill cloud.

## 5. Browse refinement controls

Controls may include category, source type, access, and platform/framework only where canonical data supports them. Active filters have a clear summary and one clear-all action. URL state is shareable.

Desktop can use concise inline controls or a sidebar. Tablet/mobile use an accessible filter sheet. Coverage level, evidence count, human-review state, and verification/audit mechanics are not primary refinement controls.

## 6. Resource card and compact row

### Anatomy

- fixed-ratio approved preview or complete fallback;
- source identity/title linking to the internal Source Guide;
- one-line purpose;
- two or three high-value task cues;
- independent Save control;
- explicit external `Visit source` action;
- optional compact `Inspect` affordance when title/card treatment alone is not sufficient.

### Interaction

- title, identity, or whole-card profile link navigates to `/resources/[slug]`, never directly to the provider;
- Visit has a clear label and safe external-link behaviour;
- Save and Visit sit above the profile-link hit area in stacking order;
- modifier-click and text selection continue to work;
- hover and `:focus-within` communicate the same hierarchy.

### States

- default, hover, keyboard focus, saved;
- preview loading, preview failed, missing preview;
- missing description/task cues;
- long title;
- unavailable/broken provider.

Coverage level, evidence, freshness, and governance can be available in a quiet secondary treatment but are not card focal points. Cards or compact rows are the standard Browse forms; a table requires a documented research benefit and must recompose on mobile rather than horizontally scroll.

## 7. Source Guide sections

Source Guide composition follows this fixed reading hierarchy:

1. identity/purpose and preview;
2. Visit, Save, Add to Board;
3. Use it when and What to explore;
4. How to access and useful compatibility;
5. Important limitations;
6. differentiated alternatives and containing Collections;
7. quiet source details/references.

The component family must support honest Listed fallbacks and omit unsupported optional fields. It must not promote raw schema, evidence counts, review state, or verification mechanics above the source guidance.

## 8. Collection card and stage item

### Collection card

- goal;
- audience;
- stage count;
- expected decision;
- factual cover/fallback when available;
- no fake curator, contributor, usage, or trend data.

### Stage item

- stage name and intended outcome;
- source role;
- what to inspect;
- decision prompt;
- Save and Add to Board where applicable.

## 9. Saved shortlist

- browser-local privacy explanation;
- search and filtering;
- resource cards/compact rows;
- remove with undo;
- Add to Board;
- clear empty/query-recovery states.

Do not add account promotion, folders, tags, cloud sync, or a heavy management surface before their approved slices.

## 10. Board workspace

### Board index

- browser-local context;
- Board name/goal and updated context;
- create/select using the existing local data contract;
- helpful empty state without account promotion.

### Board detail

- project goal, audience, constraints;
- source intake, notes, and rationale;
- selected/rejected/undecided decision controls;
- unresolved questions;
- deterministic Markdown and compact JSON handoff;
- accessible save/remove/copy/export feedback.

Boards must never imply cloud sync, collaboration, or automatic model access to browser-local data.

## 11. Preview fallback

- fixed aspect ratio prevents layout shift;
- existing repository-managed Open Graph/manual preview and favicon/letter fallback order remains canonical;
- below-fold media loads lazily;
- preview failure still leaves identity, purpose, and actions usable;
- live framed previews are not a default component and need a later allowlisted security/performance slice.

## 12. Deferred account and form components

Authentication, account menus, Submit/Suggest/report forms, and cloud-management components remain future-only guidance. They must not cause an enabled route, navigation item, promotional callout, or placeholder success state until the approved operational slice exists.

When approved, controls require visible labels, descriptive errors, `44px` minimum touch height, focus rings independent of border colour, stable loading dimensions, and no placeholder-only labels. A future OTP UI uses one semantic input with paste support and clear errors.

## 13. Footer

- concise Tessli statement;
- footer-only links: About, Curation, Privacy, Terms, Content policy;
- responsive groups that stack simply on mobile;
- no newsletter until operational;
- no Auth, Submit, Suggest, Lab, proof, or review destination.

## 14. Toasts and announcements

Use accessible feedback for:

- saved/removed and undo;
- added to/removed from Board;
- copied/downloaded handoff;
- search/filter recovery;
- retryable errors.

Toasts never contain the only error explanation. Dynamic result, Save, Board, copy, and export status changes are announced to assistive technology.
