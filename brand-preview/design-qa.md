# Tessli brand preview — design QA

Final result: **passed for static preview implementation**

## Source visual

- Primary art-direction reference: `assets/explore-desktop.webp`
- Supporting references: `collections-desktop.webp`, `saved-desktop.webp`, `full-reference-desktop.webp`
- Brand contract: `/design.md` and `/docs/*`

## Render and verification method

- Playwright Chromium using an in-memory HTML render with local CSS, JS, and raster assets inlined.
- Desktop viewport: 1440 × 1000.
- Mobile viewport: 390 × 844.
- Full-page screenshots inspected visually.
- Remote font and icon requests were blocked in the QA environment, so screenshots used system fallbacks. The committed page requests Newsreader Variable, Instrument Sans Variable, and Phosphor Icons from their CDNs; exact font personality remains the user-review purpose of this specimen.

## Comparison ledger

1. **Palette and atmosphere**
   - Reference: warm cream canvas, charcoal text, restrained orange.
   - Render: matched with `#fcf8f3`, `#151412`, and `#f05217`; subtle grain is independently toggleable.

2. **Editorial hierarchy**
   - Reference: oversized serif page and hero headings with compact line-height.
   - Render: same hierarchy and rhythm, controlled by variable font weights 600/650/700.

3. **Hero artwork treatment**
   - Reference: isolated stone arch, dark sphere, orange steps, soft grain and shadow.
   - Render: approved transparent WebP asset is used without an additional color overlay.

4. **Truthful product facts**
   - Reference concepts contain invented metrics.
   - Render: replaced with 295 curated resources, 11 categories, private browser-local saves, and open community-built status.

5. **Component language**
   - Reference: quiet borders, restrained shadows, small orange signals.
   - Render: buttons, fields, tabs, tags, feedback, account menu, and resource cards use the same token system and visible focus states.

6. **Responsive behavior**
   - Desktop: two-column introduction and responsive hero.
   - Mobile: single-column sections, one-column cards, compact controls, two-by-two fact grid, and art-first hero arrangement.

## Interaction verification

Passed:

- grain on/off toggle;
- account menu open, click-outside close, and Escape close;
- display and interface weight controls;
- desktop/tablet/mobile hero preview controls;
- save/unsave card state;
- specimen tab selection;
- Command/Ctrl + K search focus;
- no JavaScript page errors during automated verification.

## Intentional deviations

- This is a brand and component specimen, not the production Explore page.
- Authentication, persistence, filters, submissions, and routing are not implemented.
- CDN fonts and icons are not vendored into the repository.
- The mobile hero asset is still the desktop transparent composition placed responsively; a dedicated mobile crop remains a later approval item.

## Approval gate

Before application development, review the page in a network-enabled browser and approve:

- Newsreader wordmark and hero weight;
- Instrument Sans interface weight and width;
- grain intensity;
- orange intensity;
- mobile hero crop;
- resource-card density.
