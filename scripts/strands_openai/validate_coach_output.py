from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from pipeline.strands_openai.bundle_tool import load_explanation_bundle
from pipeline.strands_openai.schemas import CoachOutput
from pipeline.strands_openai.validation import validate_coach_output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bundle", type=Path, required=True)
    parser.add_argument("--coach-output", type=Path, required=True)
    parser.add_argument("--audit-output", type=Path, required=True)
    args = parser.parse_args()

    raw_output = json.loads(args.coach_output.read_text(encoding="utf-8"))
    output = CoachOutput.model_validate(raw_output)
    insight_id = json.loads(args.bundle.read_text(encoding="utf-8"))["insight"][
        "insightId"
    ]
    bundle = load_explanation_bundle(args.bundle, insight_id)
    numeric_claims = validate_coach_output(output, bundle)
    audit = {
        "status": "passed",
        "bundlePath": str(args.bundle),
        "coachOutputPath": str(args.coach_output),
        "citedObservationIds": output.citedObservationIds,
        "numericClaims": numeric_claims,
    }
    args.audit_output.parent.mkdir(parents=True, exist_ok=True)
    args.audit_output.write_text(json.dumps(audit, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
