from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from strands import tool


_bundle_path: Path | None = None


def configure_bundle_path(path: Path) -> None:
    global _bundle_path
    _bundle_path = path.resolve()


def load_explanation_bundle(path: Path, insight_id: str) -> dict[str, Any]:
    """Load exactly one local, captured Neo4j explanation bundle."""
    payload = json.loads(path.read_text(encoding="utf-8"))
    required = {
        "insight",
        "event",
        "segment",
        "supportingEvidence",
        "contradictingEvidence",
        "recurrences",
        "drill",
        "source",
    }
    if set(payload) != required:
        raise ValueError(
            f"ExplanationBundle fields differ: expected {sorted(required)}, "
            f"received {sorted(payload)}"
        )
    if payload["source"] not in {"neo4j", "cached-neo4j"}:
        raise ValueError("ExplanationBundle source must be neo4j or cached-neo4j")
    if payload["insight"].get("insightId") != insight_id:
        raise LookupError(f"bundle does not contain insightId {insight_id!r}")
    return payload


@tool
def retrieve_explanation_bundle(insightId: str) -> dict[str, Any]:
    """Retrieve the deterministic, captured Neo4j ExplanationBundle by insight ID.

    Args:
        insightId: Exact insight ID to retrieve.
    """
    if _bundle_path is None:
        raise RuntimeError("ExplanationBundle path has not been configured")
    return load_explanation_bundle(_bundle_path, insightId)
