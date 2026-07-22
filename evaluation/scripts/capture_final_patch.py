#!/usr/bin/env python3
"""Capture a reproducible archive-builder patch against a pinned source commit."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from difflib import unified_diff
from pathlib import Path


def digest(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repository", type=Path, required=True)
    parser.add_argument("--commit", required=True)
    parser.add_argument("--condition-root", type=Path, required=True)
    parser.add_argument("--artifact-directory", type=Path, required=True)
    args = parser.parse_args()

    before = subprocess.check_output(["git", "-C", str(args.repository), "show", f"{args.commit}:index.html"])
    after_path = args.condition_root / "index.html"
    after = after_path.read_bytes()
    patch = "".join(
        unified_diff(
            before.decode("utf-8").splitlines(keepends=True),
            after.decode("utf-8").splitlines(keepends=True),
            fromfile="a/index.html",
            tofile="b/index.html",
        )
    )
    args.artifact_directory.mkdir(parents=True, exist_ok=True)
    (args.artifact_directory / "final.patch").write_text(patch, encoding="utf-8")
    manifest = {
        "starting_commit": args.commit,
        "changed_files": ["index.html"] if before != after else [],
        "dependencies_changed": False,
        "index_html_start_sha256": digest(before),
        "index_html_end_sha256": digest(after),
    }
    (args.artifact_directory / "final-patch-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    raise SystemExit(main())
