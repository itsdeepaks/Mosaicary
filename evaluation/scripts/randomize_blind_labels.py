#!/usr/bin/env python3
"""Create random anonymous labels plus a public commitment and controller-only mapping."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import secrets


def write(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--public", type=Path, required=True, help="Blind-review directory visible to reviewers")
    parser.add_argument("--controller-mapping", type=Path, required=True, help="Path outside public review directory")
    args = parser.parse_args()
    nonce = secrets.token_hex(16)
    mapping = {"version-a": "baseline", "version-b": "ui-plan"} if secrets.randbelow(2) == 0 else {"version-a": "ui-plan", "version-b": "baseline"}
    payload = json.dumps({"mapping": mapping, "nonce": nonce}, sort_keys=True, separators=(",", ":"))
    commitment = hashlib.sha256(payload.encode()).hexdigest()
    write(args.public / "mapping-commitment.json", {"version": 1, "algorithm": "SHA-256", "commitment": commitment, "labels": ["version-a", "version-b"]})
    write(args.controller_mapping, {"version": 1, "mapping": mapping, "nonce": nonce, "commitment": commitment})
    print(commitment)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
