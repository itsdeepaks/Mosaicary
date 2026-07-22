# Task 06 paired experiment — evidence report

## Outcome

Both implementations removed the confirmed 390px horizontal overflow, preserved the existing data flow and desktop behavior, and passed the same browser interaction checks. This is a useful **pilot**, not evidence that `ui-plan` improves visual quality or token efficiency: no independent blinded reviewer has scored the anonymous versions, and the host did not expose token or end-to-end elapsed-time metrics.

**Recommendation:** revise the harness, obtain an independent blind review, and repeat this single task in fresh isolated agent sessions before running Tasks 1–5. Do not build the MCP or broader product infrastructure yet.

## Experiment setup

| Item | Value |
|---|---|
| Starting tag / commit | `task-06-start` / `5f71b91bac79b919ab695c52f8b89271c6b8475e` |
| Baseline branch | `experiment/task06-baseline` |
| Skill branch | `experiment/task06-ui-plan` |
| Frozen prompt SHA-256 | `6bab93f3394820cc078bafd5c8bb3b9fcb6913fd62448ad10a230feb13634495` |
| Model | `GPT-5.6 session model; host variant not exposed` |
| Reasoning setting | `host default; no explicit override exposed` |
| Run allowance | one implementation run; at most two mechanical repair turns |
| Verification | in-app browser / Playwright API at 390x844, 768x1024, and 1440x1000; console, overflow, semantic checks |
| Source policy | local repository only; no external research |

The baseline branch did not invoke or read `ui-plan` or its artifacts. The Skill branch did not read baseline output. The initial implementation commits are `122730eb79e714806964c0ecc2dfd58c0dc835b0` (baseline) and `9c1f75f346fdf08a58ecd1e569dc49553e45dda1` (Skill-assisted).

## Fairness validation

- The condition prompts were byte-identical and matched the recorded SHA-256.
- Starting commits, model/host setting, reasoning setting, tool list, source/network policy, repair limit, and verification process were identical.
- The only declared difference was availability/use of `ui-plan` and its Project UI Context, UI Contract, and Source Request Plan.
- Implementation code was isolated in separate Git worktrees. Final code patches are reproducible with:

```powershell
git diff 5f71b91bac79b919ab695c52f8b89271c6b8475e 122730eb79e714806964c0ecc2dfd58c0dc835b0 -- index.html
git diff 5f71b91bac79b919ab695c52f8b89271c6b8475e 9c1f75f346fdf08a58ecd1e569dc49553e45dda1 -- index.html
```

## Mechanical comparison

| Measure | Baseline | Skill-assisted |
|---|---:|---:|
| Implementation files changed | `index.html` | `index.html` |
| Implementation lines added / deleted | 13 / 13 | 17 / 15 |
| Dependency changes | 0 | 0 |
| Planning runs | 0 | 1 |
| Mechanical repair turns | 1 | 0 |
| 390px overflow | no | no |
| 768px overflow | no | no |
| 1440px overflow | no | no |
| Browser console warnings/errors | none | none |
| Search / no-results / tab switching | passed | passed |
| Token usage | unavailable | unavailable |
| End-to-end elapsed time | unavailable | unavailable |

At 390px, baseline stacked all four controls at 333px. The Skill-assisted result made search and category 333px primary controls and grouped access/sort as 161px secondary controls; both remained within the 375px client width.

## Result evidence

- Baseline evidence: branch `experiment/task06-baseline`, evidence commit `4d3d42523fb71f4fdd1b9d95908984d65f165c3d`.
- Skill-assisted evidence: branch `experiment/task06-ui-plan`, evidence commit `acc2357a1c810ca66da17da945fe00fe44443e95`.
- Anonymous comparison screenshots: `blind-review/version-a` and `blind-review/version-b`.

Each branch stores its own prompt, manifest, transcript, metrics, browser/accessibility report, screenshots, and final implementation commit. The Skill branch additionally stores validated Project UI Context, UI Contract, Source Request Plan, and Contract-adherence artifacts at `evaluation/task-06-existing-repository-redesign/ui-plan/` on branch `experiment/task06-ui-plan`.

## Accessibility and contract evidence

Both versions have one heading, four labeled controls, a tablist with two tabs and labelled panels after repair, visible focus styling, and zero observed browser console warnings/errors. The Skill-assisted result additionally exposes result-count updates through `aria-live="polite"` and verified ArrowRight tab activation.

`axe-core` was not installed and no dependency was added. These are deterministic semantic checks, **not** a full WCAG conformance result. Neither branch fault-injected the CSV load error; the existing error handler was preserved but that state lacks runtime evidence.

The Skill Contract adherence result is: all tested layout, reuse, dependency, labeling, tab, live-feedback, and overflow requirements implemented; the CSV-load-error state is **partially implemented/verified** because it was not fault-injected.

## Blind design review

The anonymous packet is ready at [BLIND-REVIEW-PACKET.md](BLIND-REVIEW-PACKET.md). Scores and the forced choice are deliberately **pending** an evaluator who has not seen the branch mapping. Do not infer a visual winner from mechanical metrics.

## Unexpected issues and required harness changes

1. `Project UI Context v1` rejected `facts`, although the Skill requires repository facts. The schema now permits it.
2. `Evaluation Run v1` rejected start/end commits, Skill-isolation flags, source/network policy, and repair limits. The schema now permits them.
3. The current review schema cannot faithfully represent unscored dimensions without placeholder numeric values. Add nullable or explicit `not-scored` dimension values before the next task.
4. The harness needs an external timer and model-token telemetry adapter; neither was exposed by the host session.
5. Add a controlled request-failure mechanism and axe-core availability to test the CSV error path and automated accessibility consistently.
6. This run used one operator/session that already knew the project and Skill concept. File isolation was enforced, but a fresh independent builder session is needed for a stronger causal claim.

## Decision

**Revise, then repeat Task 06 once with fresh independent builders and a blinded human reviewer.** The Skill produced traceable planning artifacts and required no repair turn, but the current pilot cannot yet establish better rendered design or lower token/time cost. Tasks 1–5 remain unbound and unrun.
