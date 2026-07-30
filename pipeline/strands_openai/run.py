from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import boto3
from strands import Agent
from strands.models.openai_responses import OpenAIResponsesModel

from .bundle_tool import configure_bundle_path, load_explanation_bundle
from .bundle_tool import retrieve_explanation_bundle
from .schemas import CoachOutput
from .validation import validate_coach_output


SYSTEM_PROMPT = """You are Wake's evidence-bound rowing coach.
Call retrieve_explanation_bundle exactly once using the requested insight ID.
Return exactly one CoachOutput. Use only the retrieved bundle. Preserve limitations
and contradicting evidence. Cite only supplied observation IDs. Repeat no number
unless it appears exactly in a claim-bearing observation or drill field. Give one
action, not a list. Do not mention providers in the headline."""


def build_agent(region: str, model_id: str) -> Agent:
    model = OpenAIResponsesModel(
        model_id=model_id,
        bedrock_mantle_config={"region": region},
        params={"store": False},
        stateful=False,
    )
    return Agent(
        model=model,
        tools=[retrieve_explanation_bundle],
        system_prompt=SYSTEM_PROMPT,
        structured_output_model=CoachOutput,
        callback_handler=None,
        name="wake-evidence-coach",
    )


def _response_id(agent: Agent) -> str | None:
    model_state: Any = getattr(agent, "model_state", None)
    if isinstance(model_state, dict):
        value = model_state.get("response_id")
        return str(value) if value else None
    return None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bundle", type=Path, required=True)
    parser.add_argument("--insight-id", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--capture", type=Path, required=True)
    args = parser.parse_args()

    region = boto3.Session().region_name
    if not region:
        raise RuntimeError("AWS region did not resolve from the existing configuration")
    model_id = os.environ.get("WAKE_OPENAI_MODEL_ID", "openai.gpt-oss-120b")

    bundle = load_explanation_bundle(args.bundle.resolve(), args.insight_id)
    configure_bundle_path(args.bundle)
    agent = build_agent(region, model_id)
    result = agent(f"Create coaching for insightId {args.insight_id!r}.")
    output = CoachOutput.model_validate(result.structured_output)
    numeric_audit = validate_coach_output(output, bundle)
    response_id = _response_id(agent)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.capture.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        output.model_dump_json(indent=2) + "\n", encoding="utf-8"
    )
    capture = {
        "capturedAt": datetime.now(timezone.utc).isoformat(),
        "executionMode": "real-api",
        "provider": "openai",
        "service": "amazon-bedrock-mantle",
        "model": model_id,
        "region": region,
        "store": False,
        "providerResponseId": response_id,
        "bundlePath": str(args.bundle),
        "outputPath": str(args.output),
        "citationValidation": "passed",
        "numericClaimAudit": numeric_audit,
        "reviewed": False,
    }
    args.capture.write_text(json.dumps(capture, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
