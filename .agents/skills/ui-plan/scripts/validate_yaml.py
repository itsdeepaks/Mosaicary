#!/usr/bin/env python3
"""Validate a YAML artifact against one of the evaluation JSON Schemas."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import jsonschema
import yaml


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("artifact", help="YAML artifact to validate")
    parser.add_argument("--schema", required=True, help="JSON Schema file")
    args = parser.parse_args()

    artifact_path = Path(args.artifact)
    schema_path = Path(args.schema)
    try:
        artifact = yaml.safe_load(artifact_path.read_text(encoding="utf-8"))
        schema = json.loads(schema_path.read_text(encoding="utf-8"))
        jsonschema.Draft202012Validator(schema).validate(artifact)
    except (OSError, json.JSONDecodeError, yaml.YAMLError, jsonschema.ValidationError) as error:
        print(f"INVALID: {artifact_path}: {error}")
        return 1

    print(f"VALID: {artifact_path} matches {schema_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
