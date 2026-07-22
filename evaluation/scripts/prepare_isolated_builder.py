#!/usr/bin/env python3
"""Create a no-Git builder copy from a pinned commit and exclude prior pilot evidence."""

from __future__ import annotations

import argparse
import io
import json
from pathlib import Path
import shutil
import subprocess
import tarfile


PILOT_PATHS = (
    "evaluation/task-06-existing-repository-redesign/EVIDENCE-REPORT.md",
    "evaluation/task-06-existing-repository-redesign/CONDITION-REVEAL-AND-ANALYSIS.md",
    "evaluation/task-06-existing-repository-redesign/blind-review",
)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repository", type=Path, required=True)
    parser.add_argument("--commit", required=True)
    parser.add_argument("--condition", choices=["baseline", "ui-plan"], required=True)
    parser.add_argument("--target", type=Path, required=True)
    args = parser.parse_args()

    repository = args.repository.resolve()
    target = args.target.resolve()
    if target.exists() and any(target.iterdir()):
        parser.error(f"Target must be absent or empty: {target}")
    if target == repository or repository in target.parents:
        parser.error("Target must be outside the repository so builders cannot walk to its Git history")
    target.mkdir(parents=True, exist_ok=True)
    archive = subprocess.run(["git", "-C", str(repository), "archive", "--format=tar", args.commit], check=True, capture_output=True).stdout
    with tarfile.open(fileobj=io.BytesIO(archive)) as bundle:
        bundle.extractall(target, filter="data")
    for relative in PILOT_PATHS:
        candidate = target / relative
        if candidate.is_dir():
            shutil.rmtree(candidate)
        elif candidate.exists():
            candidate.unlink()
    if args.condition == "baseline":
        skill = target / ".agents" / "skills" / "ui-plan"
        if skill.exists():
            shutil.rmtree(skill)
    manifest = {
        "version": 1,
        "source_commit": args.commit,
        "condition": args.condition,
        "git_metadata_present": (target / ".git").exists(),
        "excluded_prior_pilot_paths": list(PILOT_PATHS),
        "ui_plan_skill_present": (target / ".agents" / "skills" / "ui-plan").exists(),
    }
    (target / "BUILDER-ISOLATION.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
