# Dry-run comparison demonstration

The baseline and `ui-plan` directories contain byte-identical task prompts. Their SHA-256 value is recorded in both manifests and checked against the prompt bytes by `evaluation/scripts/validate_pair.py`.

The future scored comparison works as follows:

1. Pin a clean repository commit and write identical model, reasoning, tools, allowance, and verification details into both manifests.
2. Run the baseline plan without the Skill; save raw transcript and derived plan artifacts without adding Skill reasoning.
3. Run the same prompt with `ui-plan` available; save the generated Project UI Context, UI Contract, Source Request Plan, and raw transcript.
4. Freeze both plan outputs.
5. Run separate implementation attempts under the same frozen conditions.
6. Save screenshots, browser/a11y evidence, metrics, and repair turns per condition.
7. Blind the condition names to `A` and `B` before human review.
8. Score planning quality and rendered implementation quality separately using the task rubric and `review.schema.json`.

This dry run demonstrates files and schema flow only. It deliberately does not invent a baseline or claim that `ui-plan` produced a better implementation.
