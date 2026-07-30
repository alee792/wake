from __future__ import annotations

import re
from collections.abc import Iterable
from typing import Any

from .schemas import CoachOutput


_NUMERIC_ATOM = re.compile(
    r"(?<![\w.])[-+]?(?:\d{1,2}:\d{2}|\d+(?:,\d{3})*(?:\.\d+)?)"
    r"(?:\s?(?:%|watts?|w|spm|m|meters?|seconds?|secs?|minutes?|mins?))?"
    r"(?!\w)",
    re.IGNORECASE,
)
_NUMBER_WORD = re.compile(
    r"\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|"
    r"twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|"
    r"twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|"
    r"million|billion)\b",
    re.IGNORECASE,
)


def _normalize(text: str) -> str:
    return (
        text.casefold()
        .replace("−", "-")
        .replace("–", "-")
        .replace("—", "-")
        .replace(",", "")
        .replace(" ", " ")
        .replace(" ", " ")
        .replace(" ", " ")
    )


def _claim_texts(bundle: dict[str, Any]) -> Iterable[str]:
    for observation in (
        bundle["supportingEvidence"] + bundle["contradictingEvidence"]
    ):
        yield str(observation.get("statement", ""))
        yield from (str(item) for item in observation.get("limitations", []))
        for time_key in ("startSeconds", "endSeconds"):
            if time_key in observation:
                yield str(int(observation[time_key]))
    drill = bundle["drill"]
    for key in ("name", "instructions", "successCriterion"):
        if key in drill:
            yield str(drill[key])
    for section in ("event", "segment"):
        if section in bundle:
            for time_key in ("startSeconds", "endSeconds", "focusSeconds"):
                if time_key in bundle[section]:
                    yield str(int(bundle[section][time_key]))
    for recurrence in bundle.get("recurrences", []):
        for time_key in ("startSeconds", "endSeconds", "focusSeconds"):
            if time_key in recurrence:
                yield str(int(recurrence[time_key]))


def validate_coach_output(
    output: CoachOutput, bundle: dict[str, Any]
) -> list[dict[str, str]]:
    evidence = bundle["supportingEvidence"] + bundle["contradictingEvidence"]
    evidence_ids = [item["id"] for item in evidence]
    if len(evidence_ids) != len(set(evidence_ids)):
        raise ValueError("ExplanationBundle contains duplicate observation IDs")

    unknown = sorted(set(output.citedObservationIds) - set(evidence_ids))
    if unknown:
        raise ValueError(f"unknown cited observation IDs: {unknown}")

    if bundle["contradictingEvidence"] and not output.limitation.strip():
        raise ValueError("contradicting evidence requires a limitation")
    if any(item.get("limitations") for item in evidence) and not output.limitation.strip():
        raise ValueError("evidence limitations must be preserved")

    corpus = "\n".join(_normalize(text) for text in _claim_texts(bundle))
    audit: list[dict[str, str]] = []
    fields = (
        "headline",
        "explanation",
        "cue",
        "drill",
        "successCriterion",
        "limitation",
    )
    for field in fields:
        value = getattr(output, field)
        normalized_value = _normalize(value)
        atoms = [match.group(0) for match in _NUMERIC_ATOM.finditer(normalized_value)]
        atoms.extend(match.group(0) for match in _NUMBER_WORD.finditer(normalized_value))
        for atom in atoms:
            normalized_atom = _normalize(atom)
            if normalized_atom in corpus:
                audit.append({"field": field, "token": atom, "status": "matched"})
                continue
            numeric_part = normalized_atom.split()[0] if " " in normalized_atom else None
            if numeric_part and numeric_part in corpus:
                audit.append({"field": field, "token": atom, "status": "matched"})
                continue
            raise ValueError(
                f"unsupported numerical statement in {field}: {atom!r}"
            )
    return audit
