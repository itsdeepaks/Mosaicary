#!/usr/bin/env python3
"""Create a compact, deterministic inventory of UI-relevant repository files."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


IGNORED_DIRS = {".git", "node_modules", "dist", "build", ".next", "coverage", "evaluation"}
UI_EXTENSIONS = {".html", ".css", ".scss", ".sass", ".less", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte"}


def is_ignored(path: Path, root: Path) -> bool:
    return any(part in IGNORED_DIRS for part in path.relative_to(root).parts)


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return ""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".", help="Repository root to inspect")
    parser.add_argument("--max-files", type=int, default=40, help="Maximum UI-relevant files to return")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.is_dir():
        raise SystemExit(f"Repository root does not exist: {root}")

    files = [path for path in root.rglob("*") if path.is_file() and not is_ignored(path, root)]
    ui_files = [path for path in files if path.suffix.lower() in UI_EXTENSIONS]
    ui_files.sort(key=lambda path: (len(path.relative_to(root).parts), str(path).lower()))

    package_json = root / "package.json"
    package = {}
    if package_json.exists():
        try:
            package = json.loads(read_text(package_json))
        except json.JSONDecodeError:
            package = {"parse_error": True}

    css_variables: set[str] = set()
    html_ids: set[str] = set()
    class_names: set[str] = set()
    for path in ui_files[: args.max_files]:
        text = read_text(path)
        css_variables.update(re.findall(r"--([A-Za-z0-9_-]+)\s*:", text))
        html_ids.update(re.findall(r'\bid=["\']([^"\']+)["\']', text))
        class_names.update(re.findall(r'\bclass=["\']([^"\']+)["\']', text))

    flattened_classes = sorted({name for value in class_names for name in value.split()})
    docs = sorted(str(path.relative_to(root)).replace("\\", "/") for path in files if path.suffix.lower() == ".md")
    output = {
        "root": str(root),
        "framework": package.get("dependencies", {}) if package else {},
        "package_scripts": package.get("scripts", {}) if package else {},
        "ui_files": [str(path.relative_to(root)).replace("\\", "/") for path in ui_files[: args.max_files]],
        "documentation": docs[:20],
        "css_variables": sorted(css_variables)[:80],
        "html_ids": sorted(html_ids)[:80],
        "class_names": flattened_classes[:120],
        "notes": [
            "Inventory excludes .git, node_modules, build output, coverage, and evaluation artifacts.",
            "Read relevant files directly before treating an inventory item as reusable project truth."
        ]
    }
    print(json.dumps(output, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
