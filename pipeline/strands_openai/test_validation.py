from __future__ import annotations

import unittest

from pipeline.strands_openai.schemas import CoachOutput
from pipeline.strands_openai.validation import validate_coach_output


BUNDLE = {
    "insight": {"insightId": "real-insight-id"},
    "event": {},
    "segment": {},
    "supportingEvidence": [
        {
            "id": "real-observation-id",
            "statement": "Power changed by 12 watts.",
            "limitations": [],
        }
    ],
    "contradictingEvidence": [
        {
            "id": "pegasus-visual-unresolved",
            "statement": "Visual evidence unresolved: no reliable visible explanation.",
            "limitations": ["The fixed frontal video cannot measure force."],
        }
    ],
    "recurrences": [],
    "drill": {
        "name": "Rate ladder",
        "instructions": "Hold the cue.",
        "successCriterion": "Stay within 12 watts.",
    },
    "source": "cached-neo4j",
}


def output(**overrides: object) -> CoachOutput:
    payload = {
        "headline": "Preserve power as rate changes",
        "explanation": "Power changed by 12 watts.",
        "cue": "Send, then recover.",
        "drill": "Use the rate ladder.",
        "successCriterion": "Stay within 12 watts.",
        "citedObservationIds": ["real-observation-id"],
        "limitation": "The fixed frontal video cannot measure force.",
    }
    payload.update(overrides)
    return CoachOutput.model_validate(payload)


class ValidationTests(unittest.TestCase):
    def test_valid_output_passes(self) -> None:
        audit = validate_coach_output(output(), BUNDLE)
        self.assertEqual([item["token"] for item in audit], ["12 watts", "12 watts"])

    def test_unknown_citation_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "unknown cited"):
            validate_coach_output(
                output(citedObservationIds=["not-in-bundle"]), BUNDLE
            )

    def test_unsupported_number_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "unsupported numerical"):
            validate_coach_output(
                output(explanation="Power changed by 13 watts."), BUNDLE
            )

    def test_pegasus_citation_accepted(self) -> None:
        audit = validate_coach_output(
            output(citedObservationIds=["real-observation-id", "pegasus-visual-unresolved"]),
            BUNDLE,
        )
        self.assertTrue(len(audit) > 0)

    def test_missing_limitation_with_contradicting_evidence_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "contradicting evidence requires"):
            validate_coach_output(output(limitation=" "), BUNDLE)


if __name__ == "__main__":
    unittest.main()
