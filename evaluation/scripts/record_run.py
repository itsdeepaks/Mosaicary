#!/usr/bin/env python3
"""Record exact wall-clock elapsed time and optional host token telemetry for one condition."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import time


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def read(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["start", "finish"])
    parser.add_argument("artifact", type=Path, help="Path to run-telemetry.json")
    parser.add_argument("--condition", choices=["baseline", "ui-plan"])
    parser.add_argument("--input-tokens", type=int)
    parser.add_argument("--output-tokens", type=int)
    parser.add_argument("--token-reason", default="Host did not expose per-run token usage.")
    args = parser.parse_args()

    if args.action == "start":
        if not args.condition:
            parser.error("--condition is required for start")
        if args.artifact.exists():
            parser.error(f"Refusing to overwrite existing telemetry: {args.artifact}")
        write(args.artifact, {
            "version": 1,
            "condition": args.condition,
            "started_at": utc_now(),
            "started_at_ns": time.time_ns(),
        })
        return 0

    data = read(args.artifact)
    if "started_at_ns" not in data:
        parser.error("Telemetry is missing started_at_ns; run start first")
    ended_ns = time.time_ns()
    elapsed_ns = max(0, ended_ns - int(data["started_at_ns"]))
    if args.input_tokens is None or args.output_tokens is None:
        token_usage = {"status": "unavailable", "input_tokens": None, "output_tokens": None, "total_tokens": None, "reason": args.token_reason}
    else:
        token_usage = {"status": "available", "input_tokens": args.input_tokens, "output_tokens": args.output_tokens, "total_tokens": args.input_tokens + args.output_tokens, "reason": "Recorded from host-provided telemetry."}
    data.update({"ended_at": utc_now(), "elapsed_ns": elapsed_ns, "elapsed_seconds": elapsed_ns / 1_000_000_000, "token_usage": token_usage})
    data.pop("started_at_ns", None)
    write(args.artifact, data)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
