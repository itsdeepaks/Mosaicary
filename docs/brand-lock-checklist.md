# Tessli Brand Lock Checklist

Status: **active pre-development review**  
Last updated: 2026-07-28

This file records the final visual decisions that must be approved before application development begins.

## Approved decisions

### Typography tracking

- Large multi-word display headings: `letter-spacing: -0.015em`.
- Section-level `h2` headings: `letter-spacing: -0.025em`.
- The single-word Tessli wordmark may remain tighter because it functions as a compact brand signature rather than paragraph-like display copy.
- Newsreader remains the display family; Instrument Sans remains the interface family.

### Surface geometry

Tessli uses a sharp editorial surface language.

Keep square or nearly square:

- resource cards;
- collection cards;
- token and specimen panels;
- table/list containers;
- reference-image frames;
- filter rails and grouped grids;
- large content sections.

Small radii are permitted only where they improve interaction clarity:

- buttons and inputs: `4–6px`;
- dropdowns, sheets, and menus: `6–8px`;
- keyboard hints and compact status labels: `3–5px`;
- avatars and true pills: circular / `999px`.

Do not introduce rounded card grids, oversized `16–24px` radii, glass panels, or soft floating SaaS containers.

### Borders and elevation

- Fine borders define structure before shadows.
- Cards remain flat and use background change, border emphasis, or a maximum `1–2px` movement on hover.
- Shadows are reserved for floating menus, sheets, modals, and elevated search/command surfaces.

## Remaining locks before Slice 1

### 1. Wordmark and compact mark

Confirm:

- final Newsreader weight for `Tessli` (`700` is the current candidate);
- final wordmark tracking;
- whether the compact mark is a plain typographic `T` or a custom mark;
- favicon and social-preview treatment.

### 2. Icon language

Recommended lock:

- Phosphor Regular for interface icons;
- consistent optical size around `18–20px` in standard controls;
- avoid mixing Lucide, Phosphor, filled emoji-like symbols, and custom icon styles without a documented exception.

### 3. Light-mode scope

Recommended lock:

- launch the first redesigned public experience in the approved warm light theme;
- retain token readiness for dark mode but do not design and ship an unreviewed dark theme during the first visual implementation slice.

### 4. Responsive hero artwork

Required:

- desktop crop;
- tablet crop;
- simplified/tighter mobile crop after the real Newsreader headline wraps are verified;
- decorative images use empty alt text and fixed dimensions to prevent layout shift.

### 5. Resource-card media pilot

Before building all 295 cards, test 12–16 representative real resources covering:

- strong Open Graph image;
- favicon only;
- broken image;
- transparent logo;
- dark image;
- light image;
- unusually long name;
- unusually long description;
- free, freemium, paid, and open-source labels.

Approve the card using this pilot before catalogue-wide rendering.

### 6. Launch navigation and content

Lock the initial visible routes and remove links to unfinished pages. Current candidate:

- Explore;
- Collections;
- Resources / Full reference;
- Saved;
- About;
- Submit a resource;
- Suggest an improvement.

### 7. Legal and open-source identity

Before public submissions or accounts:

- choose code and catalogue-data licences;
- add third-party trademark and preview-image notice;
- publish submission guidelines;
- prepare privacy and terms pages for authentication and email workflows.

## Approval gate

The brand is ready for application development only after the specimen is reviewed at:

- `1440px`;
- `1024px`;
- `768px`;
- `390px`.

At that gate, confirm typography wrapping, spacing, grain, colour, border geometry, focus states, and media fallbacks. Development then begins with the token/typography specimen—not with a full-page generation prompt.
