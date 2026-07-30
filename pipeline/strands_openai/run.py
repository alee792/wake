from __future__ import annotations

import argparse
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import boto3
from strands import Agent
from strands.models.bedrock import BedrockModel

from .bundle_tool import configure_bundle_path, load_explanation_bundle
from .bundle_tool import retrieve_explanation_bundle
from .schemas import CoachOutput
from .validation import validate_coach_output


DEFAULT_MODEL_ID = "openai.gpt-oss-120b-1:0"
DEFAULT_REGION = "us-east-1"

SYSTEM_PROMPT = """You are Wake's evidence-bound rowing coach.
Call retrieve_explanation_bundle exactly once using the requested insight ID.
Return exactly one CoachOutput JSON object. Use only the retrieved bundle.

CONSTRAINTS:
- Cite every observation ID from supportingEvidence and contradictingEvidence
  that the explanation or limitation references. Include both Concept2 and Pegasus
  IDs when the explanation addresses their evidence.
- Repeat no number unless it appears exactly in a claim-bearing observation or
  drill field.
- Preserve limitations and contradicting evidence.
- Give one action, not a list. Do not mention providers in the headline.
- Use ONLY plain ASCII spaces between numbers and units.
- Do not claim that any external provider dispatched the Pegasus investigations.
- Represent absence of detected visual difference as unresolved, not identity.
- Do not claim identical mechanics, causal hydration, core engagement, or an
  exact restart count.
- Recovery timing or pressure/connection may only appear as coaching hypotheses.

The CoachOutput must have exactly these fields (strict JSON, no extra fields):
- headline: string (concise coaching headline, no provider names)
- explanation: string (what happened, referencing the primary event and comparison
  using exact numbers from the bundle; note unresolved visual evidence)
- cue: string (one short coaching instruction; may reference recovery timing as
  a hypothesis)
- drill: string (from the bundle drill instructions verbatim)
- successCriterion: string (from the bundle drill verbatim)
- citedObservationIds: array of strings (ALL referenced IDs from bundle evidence)
- limitation: string (preserve the limitation from contradicting evidence)

Return ONLY the JSON object with no markdown or code fences."""


def build_pegasus_context(pegasus_path: Path | None) -> str:
    if pegasus_path is None or not pegasus_path.exists():
        return ""
    pegasus = json.loads(pegasus_path.read_text(encoding="utf-8"))
    observations = pegasus.get("observations", [])
    rejected = pegasus.get("rejectedClaims", [])
    context = json.dumps(
        {"pegasusObservations": observations, "rejectedClaims": rejected},
        indent=2,
    )
    return (
        "\n\nREVIEWED PEGASUS EVIDENCE "
        "(synthesized by OpenAI from reviewed Pegasus and Neo4j evidence):\n"
        + context
    )


def build_agent(region: str, model_id: str, pegasus_context: str = "") -> Agent:
    model = BedrockModel(
        model_id=model_id,
        region_name=region,
        max_tokens=2048,
        streaming=False,
    )
    system_prompt = SYSTEM_PROMPT + pegasus_context
    return Agent(
        model=model,
        tools=[retrieve_explanation_bundle],
        system_prompt=system_prompt,
        callback_handler=None,
        name="wake-evidence-coach",
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Run Wake coaching pipeline via Strands BedrockModel"
    )
    parser.add_argument("--bundle", type=Path, required=True,
                        help="Path to Neo4j ExplanationBundle JSON")
    parser.add_argument("--pegasus", type=Path, default=None,
                        help="Path to pegasus-normalized-evidence.json")
    parser.add_argument("--insight-id", required=True)
    parser.add_argument("--output", type=Path, required=True,
                        help="Path to write CoachOutput JSON")
    parser.add_argument("--capture", type=Path, required=True,
                        help="Path to write capture/response metadata")
    args = parser.parse_args()

    region = os.environ.get("AWS_DEFAULT_REGION", DEFAULT_REGION)
    if not region:
        session = boto3.Session()
        region = session.region_name or DEFAULT_REGION
    model_id = os.environ.get("WAKE_OPENAI_MODEL_ID", DEFAULT_MODEL_ID)

    bundle = load_explanation_bundle(args.bundle.resolve(), args.insight_id)
    configure_bundle_path(args.bundle)

    pegasus_context = build_pegasus_context(args.pegasus)
    agent = build_agent(region, model_id, pegasus_context)

    capture_time = datetime.now(timezone.utc).isoformat()
    start = time.time()
    result = agent(f"Create coaching for insightId {args.insight_id!r}.")
    elapsed = time.time() - start

    content = result.message.get("content", [])
    text_output = None
    reasoning_output = None
    for block in content:
        if isinstance(block, dict):
            if "text" in block:
                text_output = block["text"]
            elif "reasoningContent" in block:
                reasoning_output = block["reasoningContent"]["reasoningText"]["text"]

    if text_output is None:
        raise RuntimeError("Model returned no text content")

    coach_data = json.loads(text_output)
    output = CoachOutput.model_validate(coach_data)
    numeric_audit = validate_coach_output(output, bundle)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.capture.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        output.model_dump_json(indent=2) + "\n", encoding="utf-8"
    )

    has_pegasus_citation = any(
        obs_id.startswith("pegasus-") for obs_id in output.citedObservationIds
    )

    capture = {
        "capturedAt": capture_time,
        "executionMode": "real-api",
        "provider": "openai",
        "service": "bedrock-runtime:Converse",
        "framework": "strands-agents (BedrockModel)",
        "model": model_id,
        "region": region,
        "store": False,
        "latencySeconds": round(elapsed, 3),
        "stopReason": result.stop_reason,
        "bundlePath": str(args.bundle),
        "pegasusPath": str(args.pegasus) if args.pegasus else None,
        "outputPath": str(args.output),
        "citationValidation": "passed",
        "numericClaimAudit": numeric_audit,
        "hasPegasusCitation": has_pegasus_citation,
        "claim": (
            "OpenAI synthesized reviewed Pegasus and Neo4j evidence into coaching"
            if has_pegasus_citation
            else "OpenAI synthesized Neo4j/Concept2 evidence into coaching"
        ),
        "reasoningContent": reasoning_output,
        "reviewed": False,
    }
    args.capture.write_text(json.dumps(capture, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
