#!/usr/bin/env python3
"""Copy only anonymous render evidence into a blind-review packet."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


SCREENSHOTS = (
    "library-390x844.png",
    "library-768x1024.png",
    "library-1440x1000.png",
    "mobile-interactions.png",
    "csv-load-error-390x844.png",
)


def copy_file(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--public", type=Path, required=True)
    parser.add_argument("--controller-mapping", type=Path, required=True)
    parser.add_argument("--baseline", type=Path, required=True)
    parser.add_argument("--ui-plan", type=Path, required=True)
    args = parser.parse_args()

    mapping = json.loads(args.controller_mapping.read_text(encoding="utf-8"))["mapping"]
    conditions = {"baseline": args.baseline, "ui-plan": args.ui_plan}
    for label, condition in mapping.items():
        destination = args.public / label
        source = conditions[condition]
        for screenshot in SCREENSHOTS:
            copy_file(source / "validation" / "screenshots" / screenshot, destination / "screenshots" / screenshot)
        evidence = json.loads((source / "validation" / "browser-evidence.json").read_text(encoding="utf-8"))
        anonymous_evidence = {
            "viewports": evidence["viewports"],
            "interactions": evidence["interactions"],
            "csv_failure": evidence["csv_failure"],
            "axe": evidence["axe"],
            "passed": evidence["passed"],
        }
        (destination / "mechanical-evidence.json").write_text(json.dumps(anonymous_evidence, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
