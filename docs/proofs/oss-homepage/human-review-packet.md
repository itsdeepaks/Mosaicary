# Online Scope Studio Homepage — Human Review Packet

Status: **awaiting genuine reviewer input**  
Proof: `oss-homepage-2026-08-04`  
Candidate route: `/proofs/oss-homepage`  
Review route: `/proofs/oss-homepage/review`

## Purpose

Review the retained OSS homepage candidate against its real brief. The review must record human judgment separately from automated browser evidence.

Do not score Tessli as a product, the current live OSS website, or the quality of the selected research providers. Score the retained candidate shown at the candidate route.

## Before scoring

1. Read `docs/proofs/oss-homepage/brief.md`.
2. Open the candidate at desktop and mobile widths where possible.
3. Inspect the full page, not only the hero.
4. Use the review route to score all twelve dimensions.
5. Add an evidence note for every score.
6. Choose `ship`, `revise`, or `reject` as the overall direction decision.
7. Copy or download the generated JSON artifact and return that exact artifact for repository recording.

## Evidence already available

Automated checks have already verified:

- route isolation and `noindex` behavior;
- semantic main and heading structure;
- 1440, 1024, 768, 390, and 320 pixel layouts;
- horizontal overflow;
- in-page link boundaries;
- minimum consultation-action touch targets;
- absence of forms, external images, and canvas/WebGL;
- console errors;
- screenshot capture.

Automated checks are not human approval. They do not score visual quality, positioning clarity, originality, taste, or ship readiness.

## Score scale

Use whole numbers only:

- **1 — serious failure:** the direction misses the requirement and likely needs a rebuild;
- **2 — weak:** the requirement is partly present but material correction is needed;
- **3 — acceptable:** the requirement works but has clear limitations;
- **4 — strong:** the requirement is handled well with bounded improvements remaining;
- **5 — exceptional for this brief:** the requirement is fully convincing and needs no meaningful direction change.

A score of `5` is not “perfect design.” It means exceptionally strong for this specific brief and proof boundary.

## Canonical review dimensions

### 1. Task fit

Does the candidate communicate the intended technical-partner position to the target business audience?

### 2. Hierarchy

Can a visitor quickly understand the offer, proof, service paths, and next action?

### 3. Mobile usability

Does the composition remain readable, usable, and appropriately recomposed on narrow screens?

### 4. Discoverability

Are navigation, service paths, selected work, and consultation actions easy to find and understand?

### 5. Density

Is the amount of content appropriate for a homepage without feeling sparse, repetitive, or overloaded?

### 6. Coherence

Do the sections, visual language, copy, and interactions feel like one intentional system?

### 7. Consistency

Are typography, spacing, borders, actions, labels, and repeated patterns applied consistently?

### 8. Component reuse

Does the implementation reuse clear patterns without turning every section into the same card or layout?

### 9. Accessibility

Do contrast, type, focus, keyboard use, semantics, motion, and touch targets support broad use?

### 10. Restraint

Does the design avoid unnecessary effects, imitation, decorative complexity, and competing calls to action?

### 11. Regression risk

How safely could this direction be adapted without introducing fragile layout, performance, or maintenance problems?

### 12. Ship readiness

Ignoring intentionally excluded production integrations, how close is the visual and interaction direction to approval?

## Overall decision

Choose exactly one:

- `ship` — approve the visual/interaction direction for bounded production adaptation;
- `revise` — keep the direction but require documented corrections;
- `reject` — the direction is unsuitable and requires a material rebuild.

## Blind-review boundary

Blind review is not used here. This proof contains one retained candidate rather than two anonymous alternatives, so claiming blindness would create false evidence.

## Privacy and integrity

- Draft review data stays in the current browser.
- Copy/Download exports the same JSON bytes.
- No review is uploaded automatically.
- Do not edit the exported artifact merely to improve scores or remove criticism.
- The reviewer may revise their own draft before final export.
- The first completed artifact should be retained even when later corrections are approved.

## Completion boundary

Slice 5.3 cannot be completed by automated checks alone. A genuine reviewer must return a valid `tessli.oss-homepage-human-review.v1` artifact with twelve scores, twelve evidence notes, one decision, and overall notes.
