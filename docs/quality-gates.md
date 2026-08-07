# Tessli Quality Gates

No page is complete because it “looks close” in one desktop screenshot.

## 1. Visual QA

Capture at minimum:

- 1440×900;
- 1024×768;
- 768×1024;
- 390×844;
- 320px width overflow gate where the surface can compress that far.

Check:

- font loaded and correct;
- intended headline wrapping;
- container alignment;
- artwork scale/crop;
- section rhythm;
- orange restraint;
- border consistency;
- grain subtlety;
- card heights;
- no accidental generic component defaults.

## 2. Typography QA

- Newsreader appears only in approved display roles;
- Instrument Sans used for UI;
- no faux bold/italic;
- variable weights render correctly;
- tabular numbers for counts;
- line lengths remain readable;
- fallback does not create major layout shift.

## 3. Accessibility

- normal text contrast at least 4.5:1;
- large text contrast at least 3:1;
- visible focus indicator;
- complete keyboard navigation;
- touch targets approximately 44×44px;
- labels for all fields;
- errors connected to controls;
- live regions for search/result feedback;
- decorative hero uses empty alt;
- reduced-motion preference respected;
- forced-colours mode remains usable.

## 4. Interaction

- cards open correctly with click, keyboard, modifier click, and middle click;
- save control does not trigger navigation;
- menus close on Escape and return focus;
- mobile sheets trap focus appropriately;
- URL filters restore on refresh;
- loading controls do not resize;
- destructive actions require confirmation or undo.

## 5. Data truthfulness

- counts calculated from current data;
- no fake users, ratings, curators, trends, reviews, or activity;
- prices/access models labelled as potentially changing;
- last-verified dates only shown when tracked;
- broken resources degrade clearly.

Routine source pages and agent packets foreground task fit, access action, important limitation, and differentiated alternatives. Sourced facts, curator judgment, project decisions, and unresolved questions remain distinct. Provenance, freshness, governance, and operational verification are available as secondary diagnostics; repository evidence is not live provider verification.

## 6. Machine contracts and discovery

For every data or machine slice, verify:

- deterministic output, stable IDs/slugs, and all 295 catalogue rows preserved;
- website, JSON, Markdown, and MCP consume the same canonical truth where applicable;
- task retrieval returns no more than eight explained results with stable ordering;
- recorded access routes state an action and auth boundary without invented provider capabilities;
- public static discovery (`robots.txt`, `llms.txt`, sitemap, and For AI links) advertises only implemented public interfaces;
- no remote calls during normal build/test, no secrets, and no browser-local Board exposure.

## 7. Media resilience

Test:

- valid OG image;
- portrait image;
- oversized image;
- missing image;
- favicon only;
- broken URL;
- SVG URL;
- slow image;
- hotlink-blocked image.

Cards must retain dimensions and usefulness in every case.

Approved repository-managed previews and the fallback chain are the default. A live iframe is optional only after the separately approved V3.15 pilot: allowlist, sandbox/security/performance/mobile checks, fixed-ratio fallback, and no agent dependency are mandatory.

## 8. Performance targets

Initial public route targets:

- LCP under 2.5 seconds on a reasonable mobile test;
- CLS under 0.1;
- no render-blocking third-party font request;
- hero production asset near or below 250 KB where visually acceptable;
- thumbnails lazy-loaded below fold;
- avoid large client JavaScript for static catalogue filtering;
- no Three.js for the initial hero.

## 9. Security

- no user HTML rendered unsanitised;
- no arbitrary remote SVG injection;
- metadata fetcher rejects private networks and unsafe protocols;
- RLS enabled and tested for every exposed user table;
- service keys server-only;
- auth redirect URLs restricted;
- form rate limits;
- external links protected.

The local MCP remains local and read-only. A hosted remote MCP is not implied before V3.16 and, when approved, requires origin validation, input limits, rate limits, timeouts, safe logs, monitoring, and public-data-only access.

## 10. Browser support

Minimum test:

- latest Chrome;
- latest Safari;
- latest Firefox;
- iOS Safari;
- Android Chrome.

Pay special attention to:

- variable font rendering;
- sticky header;
- horizontal category scrolling;
- viewport height in mobile sheets;
- WebP transparency;
- focus-visible behaviour.

## 11. Definition of done

A slice is done only when:

- contract acceptance criteria pass;
- screenshots reviewed;
- responsive states reviewed;
- accessibility checks pass;
- error/empty/loading states exist;
- no known regression;
- documentation updated;
- changes committed in a focused PR.
