# Baseline capture procedure

1. Copy `prompt.md` unchanged into the baseline Codex session.
2. Record the exact model, reasoning level, available tools, repository commit, run allowance, and start time in `run-manifest.yaml` before the response starts.
3. Save the full response as `transcript.md` without editing its content.
4. If the baseline produces a plan, convert it only into an artifact clearly labeled `baseline-derived`; do not retrofit it with `ui-plan` logic.
5. Freeze planning artifacts before any implementation phase begins.
6. During implementation, save screenshots, browser/a11y evidence, metrics, and the planning/implementation review in the paths named by the manifest.

This template is intentionally not a result.
