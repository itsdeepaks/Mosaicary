# UI Intelligence evaluation harness

This harness tests whether structured UI planning improves coding-agent output. It is intentionally separate from the product application and from any future MCP server.

## Conditions

- `baseline`: no `ui-plan` Skill is available.
- `ui-plan`: the same task runs with the repo-local `ui-plan` Skill available.

Both conditions use the same task brief, repository commit, model, reasoning level, token/run allowance, tools, and verification process. The Skill is the only permitted difference.

## Before a scored run

1. Bind the task to an isolated fixture repository or a pinned real-repository commit.
2. Record the frozen conditions in `run-manifest.yaml`.
3. Run the plan phase for both conditions before reviewing either result.
4. Run the implementation phase only after the plan artifacts are frozen.
5. Capture browser and automated verification evidence at every required state and viewport.
6. Use blind labels `A` and `B` for the human review.
7. Run `python evaluation/scripts/validate_pair.py <task-directory>` before scoring. It rejects mismatched prompts and frozen conditions.

## Layout

```text
evaluation/
├── protocol.yaml
├── schemas/
├── scripts/
├── task-01-marketing-page/
│   ├── brief.md
│   ├── task.yaml
│   ├── rubric.yaml
│   ├── baseline/
│   └── ui-plan/
├── ... task-06-existing-repository-redesign/
└── dry-runs/
```

Each condition directory eventually contains `prompt.md`, `transcript.md`, `ui-contract.yaml`, `source-request-plan.yaml`, `metrics.yaml`, `screenshots/`, `validation/`, and `review.yaml`. The initial dry run is explicitly marked non-evaluative and must not be used to claim a quality improvement.

`templates/BLIND-REVIEW.md` and `templates/review.yaml` define the human-review handoff. `scripts/validate_pair.py` checks a paired baseline and `ui-plan` run; use `--allow-placeholders` only for dry-run setup, never for a scored result.
