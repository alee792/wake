# TwelveLabs Pegasus Manual Output Handoff

Status: Human-operated provider request and manual-paste import contract

Purpose: The project owner uses Pegasus 1.5 to inspect the entire 28-minute
workout, then pastes the real structured output into the workspace. The
Data/Jockey lieutenant validates and curates that output; the lieutenant does not
need to implement or run the Pegasus request.

This is an asynchronous `general` analysis with a JSON-schema response. It is not
the `time_based_metadata` segmentation mode. In product provenance, describe it as
“Pegasus full-video analysis” or “Pegasus video understanding.”

## Why the response has two collections

- `coverage` proves that all five requested windows were inspected, including
  windows with no meaningful visible change.
- `moments` contains no more than ten genuinely pivotal candidates.

This avoids turning a required coverage observation into a false pivotal event.

## Handoff workflow

1. The Data/Jockey lieutenant publishes a target path such as
   `artifacts/twelvelabs/pegasus-pasted-output.json`.
2. The project owner runs the request below outside the agent critical path.
3. The project owner pastes the raw result into the target path without rewriting
   it.
4. If available, record the task ID and generation ID beside the raw result.
5. The lieutenant validates coverage and timestamps, then records a separate Wake
   curation artifact.

Use this provenance:

```text
provider: twelvelabs-pegasus
generationMode: real-api
ingestionMode: manual-paste
reviewMode: human-reviewed
```

## Optional operator request reference

The coding agents do not need to run this. It is retained so the manually generated
artifact has a stable prompt and schema.

### Configuration

Set:

```text
TWELVELABS_API_KEY=<secret>
TWELVELABS_ASSET_ID=6a6b961bb9dc44a9051ef6f3
TWELVELABS_OUTPUT_DIR=<optional output directory>
```

Never commit the API key. The asset must already have status `ready`.

### Request

```python
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path

from twelvelabs import TwelveLabs
from twelvelabs.types import (
    AnalyzePromptV2,
    AsyncResponseFormat,
    VideoContext_AssetId,
)


WINDOWS = [
    "00:00-06:00",
    "06:00-14:00",
    "14:00-18:00",
    "18:00-22:00",
    "22:00-28:00",
]

PROMPT = """Re-analyze the complete video from 00:00 through 28:00.
An earlier response stopped at 11:15 and did not demonstrate full-video coverage.

Inspect every one of these windows:

- 00:00-06:00
- 06:00-14:00
- 14:00-18:00
- 18:00-22:00
- 22:00-28:00

For `coverage`, return exactly one factual direct observation for every requested
window, even when the observation is "no meaningful visible change."

For `moments`, return up to 10 genuinely pivotal changes across the complete
workout.

Requirements:

- Use precise evidence-based timestamps rather than defaulting to round-minute or
  15-second ranges.
- Compare later moments with earlier moments and populate `repeated_at`.
- Keep direct visual observations separate from possible interpretations.
- Do not attribute a change to fatigue, power, workout intent, or physiology unless
  independently supported.
- State when camera angle or video quality prevents a conclusion.
- Include the final observed timestamp.
- Do not omit the final six minutes.
"""

MOMENT_SCHEMA = {
    "type": "object",
    "properties": {
        "start_time": {
            "type": "string",
            "description": "Timestamp formatted MM:SS",
        },
        "end_time": {
            "type": "string",
            "description": "Timestamp formatted MM:SS",
        },
        "direct_observation": {"type": "string"},
        "change_from_previous_strokes": {"type": "string"},
        "possible_interpretation": {"type": "string"},
        "repeated_at": {
            "type": "array",
            "items": {"type": "string"},
        },
        "confidence": {
            "type": "string",
            "enum": ["high", "medium", "low"],
        },
        "limitations": {"type": "string"},
    },
    "required": [
        "start_time",
        "end_time",
        "direct_observation",
        "change_from_previous_strokes",
        "possible_interpretation",
        "repeated_at",
        "confidence",
        "limitations",
    ],
    "additionalProperties": False,
}

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "video_summary": {"type": "string"},
        "coverage": {
            "type": "array",
            "minItems": 5,
            "maxItems": 5,
            "items": {
                "type": "object",
                "properties": {
                    "window": {
                        "type": "string",
                        "enum": WINDOWS,
                    },
                    "direct_observation": {"type": "string"},
                    "limitations": {"type": "string"},
                },
                "required": [
                    "window",
                    "direct_observation",
                    "limitations",
                ],
                "additionalProperties": False,
            },
        },
        "final_observed_timestamp": {
            "type": "string",
            "description": "Latest timestamp actually inspected, formatted MM:SS",
        },
        "moments": {
            "type": "array",
            "maxItems": 10,
            "items": MOMENT_SCHEMA,
        },
    },
    "required": [
        "video_summary",
        "coverage",
        "final_observed_timestamp",
        "moments",
    ],
    "additionalProperties": False,
}


def seconds(timestamp: str) -> int:
    minutes, remaining_seconds = timestamp.split(":")
    return int(minutes) * 60 + int(remaining_seconds)


def validate(payload: dict) -> None:
    returned_windows = [item["window"] for item in payload["coverage"]]
    if sorted(returned_windows) != sorted(WINDOWS):
        raise ValueError(f"Incomplete or duplicate coverage: {returned_windows}")

    if seconds(payload["final_observed_timestamp"]) < 27 * 60:
        raise ValueError("Final observed timestamp does not demonstrate full coverage")

    for moment in payload["moments"]:
        start = seconds(moment["start_time"])
        end = seconds(moment["end_time"])
        if not 0 <= start < end <= 28 * 60:
            raise ValueError(f"Invalid moment bounds: {moment}")

        for repeated_at in moment["repeated_at"]:
            repeated_seconds = seconds(repeated_at)
            if not 0 <= repeated_seconds <= 28 * 60:
                raise ValueError(f"Invalid repeated_at timestamp: {repeated_at}")


client = TwelveLabs(api_key=os.environ["TWELVELABS_API_KEY"])
asset_id = os.environ.get(
    "TWELVELABS_ASSET_ID",
    "6a6b961bb9dc44a9051ef6f3",
)

asset = client.assets.retrieve(asset_id)
if asset.status != "ready":
    raise RuntimeError(f"TwelveLabs asset is not ready: {asset.status}")

task = client.analyze_async.tasks.create(
    custom_id="wake-full-video-review-v1",
    model_name="pegasus1.5",
    video=VideoContext_AssetId(asset_id=asset_id),
    analysis_mode="general",
    prompt_v_2=AnalyzePromptV2(input_text=PROMPT),
    response_format=AsyncResponseFormat(
        type="json_schema",
        json_schema=RESPONSE_SCHEMA,
    ),
    temperature=0.2,
    max_tokens=6000,
)

deadline = time.monotonic() + 20 * 60
while True:
    response = client.analyze_async.tasks.retrieve(task.task_id)

    if response.status == "ready":
        break
    if response.status == "failed":
        message = response.error.message if response.error else "Unknown error"
        raise RuntimeError(f"Pegasus analysis failed: {message}")
    if time.monotonic() >= deadline:
        raise TimeoutError(f"Pegasus task did not finish: {task.task_id}")

    time.sleep(5)

if response.result.finish_reason != "stop":
    message = response.error.message if response.error else "Output was truncated"
    raise RuntimeError(message)

payload = json.loads(response.result.data)
validate(payload)

envelope = {
    "provider": "twelvelabs-pegasus",
    "generationMode": "real-api",
    "ingestionMode": "manual-paste",
    "model": "pegasus1.5",
    "analysisMode": "general",
    "responseFormat": "json_schema",
    "assetId": asset_id,
    "taskId": response.task_id,
    "generationId": response.result.generation_id,
    "finishReason": response.result.finish_reason,
    "capturedAt": datetime.now(timezone.utc).isoformat(),
    "result": payload,
}

output_dir = Path(
    os.environ.get("TWELVELABS_OUTPUT_DIR", "artifacts/twelvelabs")
)
output_dir.mkdir(parents=True, exist_ok=True)
output_path = output_dir / f"pegasus-{response.task_id}.json"
output_path.write_text(
    json.dumps(envelope, indent=2),
    encoding="utf-8",
)
print(output_path)
```

## Lieutenant validation and review

Do not pass all returned moments into the product automatically.

1. Verify that each candidate overlaps the expected 0:00–28:00 session clock.
2. Compare its timestamp with Concept2 work/recovery phases.
3. Reject unsupported causal language.
4. Reject moments obscured by camera angle or video quality.
5. Select one hero, one recurrence/comparison, and optionally one positive/control.
6. Preserve the original direct observation, confidence, and limitations.
7. Record manual selection separately from the raw provider response.

## Jockey handoff

Give Jockey only the two or three selected highlight assets. Ask it where the hero
pattern recurs and which selected clip is the strongest contrast. Preserve its
cited moments separately from Pegasus `repeated_at` suggestions; the two sources
may support, weaken, or contradict each other.

## Recorded-path rule

The project owner runs this before the content cutoff and pastes the result. The
dashboard must never wait on the task or require the TwelveLabs API during the
narrated recording.
