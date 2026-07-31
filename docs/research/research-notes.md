# Tessli Research Notes

Date: 2026-07-28

## Font candidates evaluated

### Instrument Serif

Strengths:

- strong visual similarity to the generated direction;
- designed for large sizes;
- open under SIL OFL.

Concern:

- the pairing with Inter has become an obvious recent template/AI-site pattern;
- single regular display weight provides less hierarchy control than a variable family.

Decision: not selected as Tessli's primary display face.

### Fraunces

Strengths:

- highly distinctive;
- variable optical size, weight, softness, and “wonky” axes;
- capable of a memorable custom brand voice.

Concern:

- its expressive forms can make the directory feel playful or retro;
- easy to over-style and reduce the calm editorial quality.

Decision: reserve as a future alternate brand exploration, not the initial system.

### Newsreader

Strengths:

- designed for content-rich on-screen environments;
- variable family;
- editorial warmth;
- works at display and reading sizes;
- open under SIL OFL.

Decision: selected for wordmark and display typography.

### Instrument Sans

Strengths:

- variable width and weight;
- subtle personality;
- twelve stylistic sets;
- supports dense product UI;
- open under SIL OFL.

Decision: selected for interface typography.

### Figtree

Strengths:

- friendly and highly usable;
- broad weights;
- suitable for product UI.

Concern:

- more geometric and generic than the chosen editorial direction.

Decision: fallback candidate if Instrument Sans fails browser testing.

## Chosen pairing

- Display: Newsreader Variable
- Interface: Instrument Sans Variable

This pairing must still pass an in-browser specimen checkpoint before page development. The checkpoint should render:

- `Tessli`;
- hero headline;
- navigation;
- card title and description;
- category labels;
- numerals `295`, `11`, and dates;
- password/OTP form copy;
- long resource names.

## Technology conclusions

- `next/font` is preferred because Next.js self-hosts Google/local fonts, avoids runtime Google requests, and reduces layout shift.
- Next.js remote images should use strict patterns; arbitrary catalogue domains should not be placed behind a broad image optimiser wildcard.
- Supabase supports password, OTP, and Google auth.
- Supabase RLS is mandatory for user-owned tables exposed through the public schema.
- Supabase's default email service is not production-ready; Resend custom SMTP is the approved production path.
- WCAG contrast and reduced-motion requirements are part of the visual contract, not later polish.

## Statistics decision

Generated statistics are replaced with truthful product properties:

- 295 curated resources;
- 11 practical categories;
- private browser-local saves;
- open/community-built project.

## Open visual checkpoint

Before implementation begins, render one browser-based typography/token specimen and compare it with the canonical Explore reference. If Newsreader's wordmark or hero texture does not feel right, test Fraunces as the only alternate; do not restart an unbounded font search.
