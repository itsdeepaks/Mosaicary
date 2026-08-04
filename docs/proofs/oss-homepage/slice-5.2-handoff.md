# Slice 5.2 Handoff — OSS Homepage Candidate

Status: **candidate-build input; no implementation completed in Slice 5.1**

## Required inputs

1. `docs/proofs/oss-homepage/brief.md`
2. `docs/proofs/oss-homepage/research-board.json`
3. `docs/proofs/oss-homepage/research-pack.md`
4. `docs/proofs/oss-homepage/baseline.md`
5. the current public OSS homepage for content provenance, not as a layout to preserve blindly

## Build target

Build one isolated, non-production homepage candidate under a dedicated proof/evaluation path in the Tessli repository. It must be browser-runnable and testable without changing `https://www.onlinescope.in/` or publishing a replacement site.

The candidate must include:

- responsive desktop, tablet, and mobile composition;
- short technical-partner hero;
- truthful service and selected-work content;
- primary consultation action and secondary work/proof action;
- restrained interaction;
- an explicit decision on whether the bounded 3D hypothesis is included or rejected;
- semantic, keyboard, focus, contrast, reduced-motion, touch, and overflow behavior.

## Research-source jobs

- Editorial and brand direction: SiteInspire and Godly.
- Section architecture: Landingfolio and Relume.
- Typography: Typewolf.
- Component implementation: shadcn/ui and 21st.dev.
- Motion: Motion.
- Accessibility: WhoCanUse.
- Bounded 3D hypothesis: Three.js.

Rejected sources remain rejected for this candidate unless new evidence is documented.

## Agent boundary

The implementation agent receives the research pack as design-research context. It may inspect cited public sources under their terms, but must not copy layouts, provider assets, paid components, screenshots, or private content.

## Required Slice 5.2 evidence

- implementation start/end timestamps;
- final handoff character count and approximate token count;
- first candidate retained before review fixes;
- complete changed-file list;
- implementation rationale linked to selected references;
- deviations from the research pack;
- browser output at 1440, 1024, 768, 390, and 320 pixels;
- accessibility and overflow checks;
- no human scores yet.

## Exclusions

- no production deployment or live OSS mutation;
- no fabricated metrics, testimonials, logos, outcomes, or client quotes;
- no authentication, CMS, backend, contact submission, analytics, or external integration;
- no Pattern Candidate publication;
- no claim that Tessli improved UI quality before Slice 5.3 review and Slice 5.4 analysis.

## Exit boundary

Slice 5.2 is complete when one bounded candidate and its implementation/browser evidence are merged. Human scoring and post-review fixes belong to Slice 5.3.
