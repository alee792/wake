#!/usr/bin/env python3
"""End-to-end Wake coaching pipeline: Strands BedrockModel + Neo4j + Pegasus.

Reproducible command (from repo root):
    .venv/bin/python -m scripts.strands_openai.run_e2e

Or directly:
    .venv/bin/python scripts/strands_openai/run_e2e.py
"""
from __future__ import annotations

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO_ROOT))

from pipeline.strands_openai.run import main  # noqa: E402

if __name__ == "__main__":
    # Default arguments for the standard Wake end-to-end run
    default_args = [
        "--bundle", str(REPO_ROOT / "graph" / "cache" / "explanation-bundle.json"),
        "--pegasus", str(REPO_ROOT / "artifacts" / "twelvelabs" / "pegasus-normalized-evidence.json"),
        "--insight-id", "insight-rate-without-power",
        "--output", str(REPO_ROOT / "artifacts" / "strands-openai" / "coach-output.json"),
        "--capture", str(REPO_ROOT / "artifacts" / "strands-openai" / "capture.json"),
    ]

    if len(sys.argv) == 1:
        sys.argv.extend(default_args)

    main()
