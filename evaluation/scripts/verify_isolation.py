#!/usr/bin/env python3
"""Fail if a fresh builder copy exposes Git history, old pilot outputs, or wrong Skill availability."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


FORBIDDEN = (
    "evaluation/task-06-existing-repository-redesign/EVIDENCE-REPORT.md",
    "evaluation/task-06-existing-repository-redesign/CONDITION-REVEAL-AND-ANALYSIS.md",
    "evaluation/task-06-existing-repository-redesign/blind-review",
)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--condition", choices=["baseline", "ui-plan"], required=True)
    args = parser.parse_args()
    root = args.root.resolve()
    errors: list[str] = []
    if (root / ".git").exists():
        errors.append("Builder copy contains .git metadata")
    for relative in FORBIDDEN:
        if (root / relative).exists():
            errors.append(f"Builder copy exposes prior pilot output: {relative}")
    has_skill = (root / ".agents" / "skills" / "ui-plan").exists()
    if has_skill != (args.condition == "ui-plan"):
        errors.append(f"ui-plan availability is wrong for {args.condition}")
    if errors:
        print("ISOLATION INVALID")
        print("\n".join(f"- {error}" for error in errors))
        return 1
    print("ISOLATION VALID")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
