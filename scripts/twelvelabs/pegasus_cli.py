#!/usr/bin/env python3
"""Run and iterate TwelveLabs Pegasus analyses without using the web UI."""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from twelvelabs import TwelveLabs
from twelvelabs.types import AnalyzePromptV2, AsyncResponseFormat, VideoContext_AssetId


ROOT = Path(__file__).resolve().parents[2]
RUNS_DIR = ROOT / "artifacts" / "twelvelabs" / "runs"

TIMELINE_PROMPT = """Analyze the complete rowing workout from 00:00 to 28:00 and
assemble a factual visual timeline.

Concept2 telemetry defines the authoritative workout structure:

- Work 1: 00:00-04:00
- Recovery 1: 04:00-07:00
- Work 2: 07:00-11:00
- Recovery 2: 11:00-14:00
- Work 3: 14:00-18:00
- Recovery 3: 18:00-21:00
- Work 4: 21:00-25:00
- Recovery 4: 25:00-28:00

Treat these boundaries as fixed. Do not infer or redefine the intervals from
video. For every phase, describe directly visible rowing rhythm and movement,
identify meaningful changes, inspect transitions, record pauses or
self-corrections, and report when no meaningful visual change is visible.

Focus only on stroke-to-stroke rhythm, recovery timing, hands-away timing, body
preparation, seat-handle sequencing, forward reach, visibly distinguishable
cadence changes, pauses, and workout transitions.

Do not analyze sweat, facial flushing, breathing, fatigue, physiology, force,
power, or workout intent from video.

Return 8-14 timeline events spanning the complete workout. Use precise
evidence-based timestamps. Do not manufacture an event merely to fill a phase.
Confirm the final observed timestamp reaches at least 28:00."""

PHASES = [
    "work_1",
    "recovery_1",
    "work_2",
    "recovery_2",
    "work_3",
    "recovery_3",
    "work_4",
    "recovery_4",
]

TIMELINE_SCHEMA = {
    "type": "object",
    "properties": {
        "video_summary": {"type": "string"},
        "final_observed_seconds": {"type": "number"},
        "phase_coverage": {
            "type": "array",
            "minItems": 8,
            "maxItems": 8,
            "items": {
                "type": "object",
                "properties": {
                    "phase": {"type": "string", "enum": PHASES},
                    "direct_observation": {"type": "string"},
                    "limitations": {"type": "string"},
                },
                "required": ["phase", "direct_observation", "limitations"],
                "additionalProperties": False,
            },
        },
        "moments": {
            "type": "array",
            "minItems": 1,
            "maxItems": 14,
            "items": {
                "type": "object",
                "properties": {
                    "phase": {"type": "string", "enum": PHASES},
                    "start_seconds": {"type": "number"},
                    "end_seconds": {"type": "number"},
                    "event_type": {"type": "string"},
                    "direct_observation": {"type": "string"},
                    "change_from_previous": {"type": "string"},
                    "repeated_at_seconds": {
                        "type": "array",
                        "items": {"type": "number"},
                    },
                    "confidence": {
                        "type": "string",
                        "enum": ["high", "medium", "low"],
                    },
                    "limitations": {"type": "string"},
                },
                "required": [
                    "phase",
                    "start_seconds",
                    "end_seconds",
                    "event_type",
                    "direct_observation",
                    "change_from_previous",
                    "repeated_at_seconds",
                    "confidence",
                    "limitations",
                ],
                "additionalProperties": False,
            },
        },
    },
    "required": [
        "video_summary",
        "final_observed_seconds",
        "phase_coverage",
        "moments",
    ],
    "additionalProperties": False,
}


def json_value(value):
    if hasattr(value, "model_dump"):
        return value.model_dump(mode="json")
    if hasattr(value, "dict"):
        return value.dict()
    return json.loads(json.dumps(value, default=lambda item: item.__dict__))


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def client():
    api_key = os.environ.get("TWELVELABS_API_KEY")
    if not api_key:
        raise RuntimeError("Set TWELVELABS_API_KEY; the CLI never stores it")
    return TwelveLabs(api_key=api_key)


def parse_result(response):
    if not response.result:
        raise RuntimeError("Task is ready but has no result")
    if response.result.finish_reason != "stop":
        raise RuntimeError(f"Analysis ended with {response.result.finish_reason}")
    data = response.result.data
    return json.loads(data) if isinstance(data, str) else data


def validate_timeline(payload):
    phases = [item["phase"] for item in payload["phase_coverage"]]
    if sorted(phases) != sorted(PHASES):
        raise ValueError(f"Incomplete or duplicate phase coverage: {phases}")
    if payload["final_observed_seconds"] < 1680:
        raise ValueError("Result does not demonstrate coverage through 28:00")
    for moment in payload["moments"]:
        if not 0 <= moment["start_seconds"] < moment["end_seconds"] <= 1695:
            raise ValueError(f"Moment is outside the video: {moment}")


def save_ready_response(response, run_dir, profile):
    payload = parse_result(response)
    if profile == "timeline":
        validate_timeline(payload)
    envelope = {
        "provider": "twelvelabs-pegasus",
        "generationMode": "real-api",
        "model": "pegasus1.5",
        "assetId": response.video_context.asset_id
        if getattr(response, "video_context", None)
        else None,
        "taskId": response.task_id,
        "generationId": response.result.generation_id,
        "finishReason": response.result.finish_reason,
        "capturedAt": datetime.now(timezone.utc).isoformat(),
        "result": payload,
    }
    output = run_dir / "result.json"
    write_json(output, envelope)
    print(output)


def wait_for_task(api, task_id, run_dir, profile, timeout, poll_seconds):
    deadline = time.monotonic() + timeout
    while True:
        response = api.analyze_async.tasks.retrieve(task_id)
        print(f"{task_id}: {response.status}", file=sys.stderr)
        if response.status == "ready":
            save_ready_response(response, run_dir, profile)
            return
        if response.status == "failed":
            message = response.error.message if response.error else "Unknown error"
            raise RuntimeError(f"Analysis failed: {message}")
        if time.monotonic() >= deadline:
            raise TimeoutError(f"Task did not finish before timeout: {task_id}")
        time.sleep(poll_seconds)


def run(args):
    prompt = TIMELINE_PROMPT if args.profile == "timeline" else Path(args.prompt_file).read_text()
    schema = (
        TIMELINE_SCHEMA
        if args.profile == "timeline" and not args.schema_file
        else json.loads(Path(args.schema_file).read_text())
    )
    asset_id = args.asset_id or os.environ.get("TWELVELABS_ASSET_ID")
    if not asset_id:
        raise RuntimeError("Pass --asset-id or set TWELVELABS_ASSET_ID")

    kwargs = {
        "custom_id": args.name,
        "model_name": "pegasus1.5",
        "video": VideoContext_AssetId(asset_id=asset_id),
        "analysis_mode": "general",
        "prompt_v_2": AnalyzePromptV2(input_text=prompt),
        "response_format": AsyncResponseFormat(
            type="json_schema",
            json_schema=schema,
        ),
        "temperature": args.temperature,
        "max_tokens": args.max_tokens,
    }
    if args.start is not None:
        kwargs["start_time"] = args.start
    if args.end is not None:
        kwargs["end_time"] = args.end

    api = client()
    task = api.analyze_async.tasks.create(**kwargs)
    run_dir = RUNS_DIR / f"{datetime.now().strftime('%Y%m%d-%H%M%S')}-{args.name}-{task.task_id}"
    write_json(
        run_dir / "request.json",
        {
            "taskId": task.task_id,
            "assetId": asset_id,
            "profile": args.profile,
            "prompt": prompt,
            "schema": schema,
            "temperature": args.temperature,
            "maxTokens": args.max_tokens,
            "startTime": args.start,
            "endTime": args.end,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        },
    )
    print(f"task: {task.task_id}", file=sys.stderr)
    print(f"request: {run_dir / 'request.json'}", file=sys.stderr)
    if args.no_wait:
        print(task.task_id)
        return
    wait_for_task(api, task.task_id, run_dir, args.profile, args.timeout, args.poll)


def retrieve(args):
    api = client()
    response = api.analyze_async.tasks.retrieve(args.task_id)
    print(json.dumps(json_value(response), indent=2))


def build_parser():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)

    run_parser = commands.add_parser("run", help="Create an analysis task")
    run_parser.add_argument("--profile", choices=["timeline", "custom"], default="timeline")
    run_parser.add_argument("--prompt-file", help="Required for the custom profile")
    run_parser.add_argument("--schema-file", help="Custom JSON schema")
    run_parser.add_argument("--asset-id")
    run_parser.add_argument("--name", default="wake-timeline-v1")
    run_parser.add_argument("--start", type=float)
    run_parser.add_argument("--end", type=float)
    run_parser.add_argument("--temperature", type=float, default=0.2)
    run_parser.add_argument("--max-tokens", type=int, default=6000)
    run_parser.add_argument("--poll", type=float, default=5)
    run_parser.add_argument("--timeout", type=float, default=30 * 60)
    run_parser.add_argument("--no-wait", action="store_true")
    run_parser.set_defaults(handler=run)

    retrieve_parser = commands.add_parser("retrieve", help="Inspect a task")
    retrieve_parser.add_argument("task_id")
    retrieve_parser.set_defaults(handler=retrieve)
    return parser


def main():
    args = build_parser().parse_args()
    if args.command == "run" and args.profile == "custom" and not args.prompt_file:
        raise SystemExit("--prompt-file is required with --profile custom")
    if args.command == "run" and args.profile == "custom" and not args.schema_file:
        raise SystemExit("--schema-file is required with --profile custom")
    args.handler(args)


if __name__ == "__main__":
    main()
