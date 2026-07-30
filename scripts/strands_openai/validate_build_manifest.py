from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


ALLOWED_MODES = {"real-api", "cached-real-api", "derived", "manual"}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    args = parser.parse_args()
    payload = json.loads(args.manifest.read_text(encoding="utf-8"))
    assert payload["schemaVersion"] == "1.0"
    assert payload["recordingMode"] == "offline"
    assert payload["steps"]
    ids = [step["id"] for step in payload["steps"]]
    assert len(ids) == len(set(ids)), "step IDs must be unique"

    coverage = " ".join(
        f"{step['provider']} {step['modelOrService']}".casefold()
        for step in payload["steps"]
    )
    for required in ("twelvelabs", "neo4j", "openai", "strands", "manual"):
        assert required in coverage, f"manifest does not cover {required}"

    for step in payload["steps"]:
        assert step["executionMode"] in ALLOWED_MODES
        if step["executionMode"] != "real-api":
            assert "providerResponseId" not in step
        for path_text in step["inputPaths"] + step["outputPaths"]:
            path = Path(path_text)
            assert not path.is_absolute()
            assert path.exists(), f"manifest path does not exist: {path}"
        content_hash = step.get("contentHash")
        if content_hash:
            algorithm, expected = content_hash.split(":", 1)
            assert algorithm == "sha256"
            first_output = Path(step["outputPaths"][0])
            actual = hashlib.sha256(first_output.read_bytes()).hexdigest()
            assert actual == expected, f"content hash mismatch: {first_output}"

    print("BuildManifest validation passed.")


if __name__ == "__main__":
    main()
