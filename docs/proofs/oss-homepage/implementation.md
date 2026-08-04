# OSS Homepage Candidate — Implementation Evidence

Status: **Slice 5.2 implementation complete; human review pending**

## Identity

- Proof: `oss-homepage-2026-08-04`
- Slice: `5.2`
- Route: `/proofs/oss-homepage`
- Implementation started: `2026-08-04T16:14:30+05:30`
- Implementation ended: `2026-08-04T17:14:43+05:30`
- Elapsed implementation and automated-review window: **1 hour, 0 minutes, 13 seconds**
- First candidate head: `8577e3e6c3dbdd8d629bc8752b2f23060fb8643d`
- Browser-reviewed candidate head: `54c7bbd7d9805292c7c0ade2092b2a2d027ac5fd`

## Inputs

The measured repository handoff contains:

1. `docs/proofs/oss-homepage/brief.md`
2. `docs/proofs/oss-homepage/research-board.json`
3. `docs/proofs/oss-homepage/research-pack.md`
4. `docs/proofs/oss-homepage/baseline.md`
5. `docs/proofs/oss-homepage/slice-5.2-handoff.md`

Deterministic handoff metrics:

- characters: **35,079 Unicode code points**
- UTF-8 bytes: **35,113**
- approximate tokens: **8,770**
- estimate method: `ceil(Unicode code points / 4)`
- metrics contract: `tessli.oss-proof-handoff-metrics.v1`
- generator: `web/scripts/measure-oss-proof-handoff.mjs`

The current public OSS homepage was observed separately for content provenance. It is not included in the repository-character total.

## First-candidate decisions

- Positioning headline: `Your business needs a technical partner, not another hand-off.`
- Accent: restrained electric blue on black, warm white, and grey.
- Pricing: omitted because the homepage pricing decision remains unresolved.
- 3D: rejected for the first candidate. A CSS system map communicates connected services with lower performance and accessibility risk.
- Primary action: in-page consultation path only; no form submission or external contact request.
- Secondary action: in-page selected-work navigation.
- Portfolio evidence: ScopeQR, Daddy Official, and BrandScope names and build types only; no invented outcomes or metrics.
- Typography: interface-led sans hierarchy with restrained display scale; no copied provider typography or assets.

## Research traceability

- SiteInspire and Godly informed the editorial hierarchy, spacing, project presentation, and restraint boundary.
- Landingfolio and Relume informed section sequencing and outcome-oriented service grouping.
- Typewolf informed readable display/body contrast and line-length discipline.
- shadcn/ui and 21st.dev informed implementable interaction and component boundaries without importing their default visual identity.
- Motion informed short functional transitions and reduced-motion support without adding a dependency.
- WhoCanUse informed the high-contrast neutral/blue palette review boundary.
- Three.js remained a research hypothesis and was explicitly rejected for the first candidate.

## Rejected directions preserved

- v0 is not used as the candidate's taste authority.
- Ant Design is not used as the visual system for this editorial marketing page.
- Mobbin and Page Flows are not used as primary homepage-direction sources.
- No selected-source layout, screenshot, code sample, or paid/private provider asset is copied.

## Candidate structure

1. Proof-only notice and isolated OSS navigation.
2. Short technical-partner hero and CSS system map.
3. Positioning statement.
4. Four outcome-oriented service paths.
5. Three truthful selected-work entries.
6. Four-step partnership process.
7. Capability depth.
8. Technical-partner objection handling.
9. Proof-only final consultation path.

## Browser and automated evidence

The dedicated browser harness verifies the candidate at:

- `1440 × 900`
- `1024 × 768`
- `768 × 1024`
- `390 × 844`
- `320 × 800`

It checks the route response, `noindex` boundary, main landmark, accessibility heading tree, route isolation, in-page links, touch targets, horizontal overflow, absence of forms/images/canvas, console errors, and screenshot capture.

Evidence runs for the browser-reviewed candidate head:

- Web CI run `30905307235`: **passed**
- Phase 1 Release Gate run `30905307264`: **passed**
- release evidence artifact `8890806360`

Visual inspection of the five screenshots found:

- no clipped or overlapping hero content;
- a balanced desktop split between the positioning copy and CSS system map;
- clean recomposition to a single-column hero at 768 pixels;
- readable 390- and 320-pixel type, copy, and full-width actions;
- no visible horizontal overflow or public Tessli-shell leakage.

## Findings and corrections

- Material direction rebuilds: **0**
- Automated browser findings: **1**
- Corrections after the first candidate: **1**

The browser gate found that the sticky-header `Start a project` link was visually present but its interactive box was below the 44-pixel touch-target contract. The link received a `44px` minimum height and the complete five-viewport browser matrix then passed.

A test false-positive that matched the ordinary phrase `Three different kinds of build` as a Three.js implementation was narrowed to actual technical markers. This changed the test, not the candidate direction.

## Deviations from the handoff

- Three.js was selected as a bounded research hypothesis, then deliberately rejected for the first candidate after applying the handoff's performance, accessibility, and comprehension test.
- No live contact action was included because Slice 5.2 explicitly prohibits external submission and production integration.
- Pricing and final accent approval remain unresolved for human review.

## Evidence boundary

The first candidate remains retained in Git history before browser-review fixes. Slice 5.2 records implementation and automated browser evidence only.

Human scores, generic-design judgments, final accent approval, post-review corrections, and claims that Tessli improved the homepage remain unmeasured until Slices 5.3 and 5.4.
