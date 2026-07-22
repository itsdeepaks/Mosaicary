#!/usr/bin/env python3
"""Validate that a baseline/ui-plan evaluation pair is fair before scoring."""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
import sys

import yaml


FROZEN_FIELDS = (
    "repository_commit",
    "model",
    "reasoning_level",
    "prompt_sha256",
    "run_allowance",
    "tools",
    "verification_process",
)


def load_yaml(path: Path) -> dict:
    with path.open(encoding="utf-8") as source:
        data = yaml.safe_load(source)
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a YAML object")
    return data


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("task_directory", type=Path)
    parser.add_argument(
        "--allow-placeholders",
        action="store_true",
        help="Allow RECORD_BEFORE_RUN and dry-run values; use only before a scored run.",
    )
    args = parser.parse_args()

    task_directory = args.task_directory.resolve()
    baseline = task_directory / "baseline"
    assisted = task_directory / "ui-plan"
    errors: list[str] = []

    baseline_prompt = baseline / "prompt.md"
    assisted_prompt = assisted / "prompt.md"
    baseline_manifest_path = baseline / "run-manifest.yaml"
    assisted_manifest_path = assisted / "run-manifest.yaml"

    for required in (baseline_prompt, assisted_prompt, baseline_manifest_path, assisted_manifest_path):
        if not required.is_file():
            errors.append(f"Missing required artifact: {required}")

    if errors:
        print("PAIR INVALID")
        print("\n".join(f"- {error}" for error in errors))
        return 1

    baseline_manifest = load_yaml(baseline_manifest_path)
    assisted_manifest = load_yaml(assisted_manifest_path)
    baseline_sha = sha256(baseline_prompt)
    assisted_sha = sha256(assisted_prompt)

    if baseline_sha != assisted_sha:
        errors.append("baseline/prompt.md and ui-plan/prompt.md are not byte-identical")

    for manifest, expected_condition in ((baseline_manifest, "baseline"), (assisted_manifest, "ui-plan")):
        if manifest.get("condition") != expected_condition:
            errors.append(f"{expected_condition} manifest has the wrong condition value")

    baseline_frozen = baseline_manifest.get("frozen_conditions", {})
    assisted_frozen = assisted_manifest.get("frozen_conditions", {})
    for field in FROZEN_FIELDS:
        left = baseline_frozen.get(field)
        right = assisted_frozen.get(field)
        if left != right:
            errors.append(f"Frozen condition differs for {field}: baseline={left!r}, ui-plan={right!r}")
        if not args.allow_placeholders and (left is None or left == "RECORD_BEFORE_RUN"):
            errors.append(f"Frozen condition {field} is not recorded")

    for condition, frozen in (("baseline", baseline_frozen), ("ui-plan", assisted_frozen)):
        recorded_sha = frozen.get("prompt_sha256")
        if recorded_sha != baseline_sha:
            errors.append(
                f"{condition} manifest prompt_sha256 does not match the prompt bytes: "
                f"recorded={recorded_sha!r}, actual={baseline_sha!r}"
            )

    if not args.allow_placeholders:
        for manifest in (baseline_manifest, assisted_manifest):
            if manifest.get("status") in {"ready", "non-evaluative"}:
                errors.append("A scored pair cannot have ready or non-evaluative status")

    if errors:
        print("PAIR INVALID")
        print("\n".join(f"- {error}" for error in errors))
        return 1

    print("PAIR VALID")
    print(f"Task: {task_directory.name}")
    print(f"Prompt SHA-256: {baseline_sha}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
