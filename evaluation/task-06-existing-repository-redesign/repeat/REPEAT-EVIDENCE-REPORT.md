# Task 06 fresh paired repeat — evidence report

## Outcome

The `ui-plan` condition is the only condition that passed the complete Task 06 verification gate. It also won the sealed anonymous delegated review as Version B. The baseline condition passed the 390px target but retained a 7px horizontal overflow at 768px after both permitted mechanical repairs, so it is not ship-ready.

This is evidence that the evaluated planning workflow can improve this specific repository-aware repair. It is not yet a general claim about all UI tasks, blind human preference, or token efficiency.

## Setup and fairness validation

| Item | Frozen value |
|---|---|
| Starting point | `task-06-start` / `5f71b91bac79b919ab695c52f8b89271c6b8475e` |
| Task prompt | byte-identical `prompt.md` in both archive-only copies |
| Model | host-default GPT-5.6 |
| Reasoning setting | host default |
| Network/source policy | no external research; repository-local evidence only |
| Primary implementation allowance | one per condition |
| Repair allowance | two per condition; mechanical evidence only |
| Browser verifier | pinned Playwright + axe-core controller script |
| Viewports | 390x844, 768x1024, 1440x1000 |

The copies were created from the pinned commit with `prepare_isolated_builder.py` and passed `verify_isolation.py`. The baseline copy physically excluded `.agents/skills/ui-plan`; the assisted copy retained it. Neither builder was permitted to inspect the other condition or prior pilot material.

## Mechanical comparison

| Measure | Baseline | `ui-plan` |
|---|---:|---:|
| Changed implementation files | `index.html` | `index.html` |
| Dependency changes | 0 | 0 |
| Planning runs | 0 | 1 |
| Repair turns used | 2 | 1 |
| 390px overflow | no | no |
| 768px overflow | **yes: 775 / 768px** | no |
| 1440px overflow | no | no |
| Console/page errors | none | none |
| Search / no-results / Markdown | passed | passed |
| Deterministic CSV failure UI | passed | passed |
| axe critical/other violations | 0 | 0 |
| axe incomplete checks | `color-contrast` | `color-contrast` |
| Final verification gate | **failed** | **passed** |

The baseline's remaining overflow came from the Markdown switch button extending beyond its 168px parent at tablet width. The controller identified the cause only after the repair allowance was exhausted; that diagnosis was not sent to the builder.

## Time, tokens, and repair evidence

| Measure | Baseline | `ui-plan` |
|---|---:|---:|
| Exact controller condition window | 602.9999993 seconds | 603.0635956 seconds |
| Host per-run token usage | unavailable | unavailable |
| Reason tokens unavailable | host did not expose per-run usage | host did not expose per-run usage |
| Repair outcome | two overflow repairs did not clear the 768px failure | tab-semantics repair cleared the failure |

The timers are exact controller windows for concurrently started conditions, including controller verification and repair coordination. They do **not** measure independent builder-only duration, so they are unsuitable for a speed claim. This remains a harness limitation.

## Anonymous review

The sealed packet and scorecard are in [`blind-review`](blind-review). Its committed mapping commitment was created before review; the subsequent reveal maps Version A to baseline and Version B to `ui-plan`.

The anonymous delegated reviewer chose **Version B** to ship. It scored B 5/5 for task fit, information hierarchy, mobile usability, control discoverability, accessibility, restraint, desktop regression risk, and ship readiness. Version A's 768px overflow drove its ship-readiness score to 2/5.

The reviewer was AI-delegated, not human. A human blind review is still required before claiming human preference.

## UI Contract review

The Skill produced schema-valid Project UI Context, UI Contract, and Source Request Plan before implementation. The Contract review classified 17 requirements as implemented and 2 as partially implemented:

- **Material and followed:** search-first mobile hierarchy; visible associated mobile labels; reuse of native controls, tokens, and existing data paths; explicit mobile/tablet/desktop behavior; avoidance of new dependencies; required functional states; viewport checks.
- **Useful but only partially evidenced:** visible focus treatment and keyboard reachability. Native controls remain focusable and existing focus styling remains, but the verifier did not yet automate keyboard traversal or focus-state screenshots.
- **Mostly prompt restatements:** preserving data/desktop behavior and avoiding dependencies. They are still useful guardrails but did not add much novel direction.

The first assisted implementation missed the Contract's intended tab semantics, then corrected that gap with the allowed mechanical repair. This is a clear distinction between Contract quality and implementation adherence.

## Final patches and artifact locations

The archive-isolated condition artifacts retain the exact prompts, manifests, telemetry, repair logs, browser evidence, screenshots, final patches, and final patch manifests:

- Baseline: `E:\Boom-Bam\ui-intelligence-task06-repeat-baseline\evaluation\task-06-existing-repository-redesign\repeat\baseline`
- Assisted: `E:\Boom-Bam\ui-intelligence-task06-repeat-ui-plan\evaluation\task-06-existing-repository-redesign\repeat\ui-plan`

Both final patch manifests record the pinned start commit and one changed file, `index.html`; neither records dependency changes.

## Unexpected issues and harness changes

1. The standardized tab interaction check initially failed on the assisted copy because the builder retained buttons without tab roles. A mechanical repair resolved it.
2. The baseline copied broad mobile overflow fixes but failed to identify the tablet switch-control overflow. The current verifier exposes the symptom; a future diagnostic may report the offending element without changing repair-evidence rules.
3. Exact controller-window timing is available, but host token and builder-only timing are not. Keep their status explicitly unavailable rather than inferring efficiency.
4. `axe-core` found no violations under the configured tags, but `color-contrast` remained incomplete. Automation does not establish complete WCAG conformance.

## Decision

**Continue cautiously, with one Skill revision before binding the next task.** Keep Tracks C onward blocked. The revision should make existing view-switch semantics and every required breakpoint's overflow budget explicit in the planning checklist, while the harness should add deterministic keyboard traversal and optional offending-element diagnostics. Then bind one different task type—not all Tasks 1–5 at once—and retain the human-blind-review requirement for any broad quality claim.
