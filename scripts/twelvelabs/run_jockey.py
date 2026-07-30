#!/usr/bin/env python3
"""Run one narrow Jockey comparison over already-selected highlight assets.

This intentionally does not call Pegasus. Supply two or three ready TwelveLabs
asset IDs in artifacts/twelvelabs/jockey-selected-assets.json.
"""

import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path

from twelvelabs import TextParam, TwelveLabs
from twelvelabs.types.text_param_format import TextParamFormat_JsonSchema


ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = ROOT / "artifacts/twelvelabs/jockey-selected-assets.json"
RAW_PATH = ROOT / "artifacts/twelvelabs/jockey-raw-response.json"
OBSERVATION_PATH = ROOT / "artifacts/twelvelabs/jockey-observation.json"
STATE_PATH = ROOT / "artifacts/twelvelabs/jockey-state.json"
POLL_SECONDS = 10
POLL_DEADLINE_SECONDS = 30 * 60

QUESTION = (
    "Compare only the selected rowing highlight clips. Does the directly visible "
    "pattern in the hero clip recur in another selected clip, and which selected "
    "clip is the strongest visual contrast? Cite precise clip-local MM:SS-MM:SS "
    "moments. Separate direct observation from interpretation and state camera "
    "or image-quality limitations. Do not infer power, fatigue, physiology, "
    "forces, workout intent, or joint angles."
)

SCHEMA = {
    "type": "object",
    "properties": {
        "answer": {"type": "string"},
        "hero_item_id": {"type": "string"},
        "recurrence_item_id": {"type": "string"},
        "strongest_contrast_item_id": {"type": "string"},
        "cited_moments": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "item_id": {"type": "string"},
                    "start_time": {"type": "string"},
                    "end_time": {"type": "string"},
                    "direct_observation": {"type": "string"},
                    "comparison_role": {"type": "string"},
                    "confidence": {"type": "string"},
                    "limitations": {"type": "string"},
                },
            },
        },
        "limitations": {"type": "string"},
    },
}


def dump_model(value):
    if hasattr(value, "model_dump"):
        return value.model_dump(mode="json")
    if hasattr(value, "dict"):
        return value.dict()
    return json.loads(json.dumps(value, default=lambda item: item.__dict__))


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def wait_until_ready(retrieve, label):
    deadline = time.monotonic() + POLL_DEADLINE_SECONDS
    while True:
        resource = retrieve()
        status = resource.status
        if status == "ready":
            return resource
        if status == "failed":
            raise RuntimeError(f"{label} failed")
        if time.monotonic() >= deadline:
            raise TimeoutError(f"{label} was not ready before cutoff")
        time.sleep(POLL_SECONDS)


api_key = os.environ.get("TWELVELABS_API_KEY")
if not api_key:
    raise RuntimeError("TWELVELABS_API_KEY is required and must not be committed")

config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
assets = config.get("assets", [])
if not 2 <= len(assets) <= 3:
    raise ValueError("Select exactly two or three highlight assets")
if not all(asset.get("assetId") and asset.get("replayStartSeconds") is not None for asset in assets):
    raise ValueError("Every selected asset needs assetId and replayStartSeconds")

client = TwelveLabs(api_key=api_key)
for asset in assets:
    wait_until_ready(
        lambda asset_id=asset["assetId"]: client.assets.retrieve(asset_id=asset_id),
        f"asset {asset['assetId']}",
    )

knowledge_store_id = os.environ.get("TWELVELABS_KNOWLEDGE_STORE_ID")
if knowledge_store_id:
    store = client.knowledge_stores.retrieve(knowledge_store_id=knowledge_store_id)
else:
    store = client.knowledge_stores.create(name="Wake selected rowing highlights")
    knowledge_store_id = store.id

items = []
for asset in assets:
    item_id = asset.get("knowledgeStoreItemId")
    if item_id:
        item = client.knowledge_store_items.retrieve(
            knowledge_store_id=knowledge_store_id,
            item_id=item_id,
        )
    else:
        item = client.knowledge_store_items.create(
            knowledge_store_id=knowledge_store_id,
            asset_id=asset["assetId"],
        )
    ready_item = wait_until_ready(
        lambda item_id=item.id: client.knowledge_store_items.retrieve(
            knowledge_store_id=knowledge_store_id,
            item_id=item_id,
        ),
        f"knowledge-store item {item.id}",
    )
    items.append(
        {
            "assetId": asset["assetId"],
            "itemId": ready_item.id,
            "role": asset.get("role"),
            "replayStartSeconds": asset["replayStartSeconds"],
            "replayEndSeconds": asset.get("replayEndSeconds"),
        }
    )

state = {
    "provider": "twelvelabs-jockey",
    "generationMode": "real-api",
    "knowledgeStoreId": knowledge_store_id,
    "items": items,
    "updatedAt": datetime.now(timezone.utc).isoformat(),
}
write_json(STATE_PATH, state)

response = client.responses.create(
    knowledge_store_id=knowledge_store_id,
    instructions=(
        "You are reviewing rowing video evidence. Report only directly visible "
        "content, preserve uncertainty, and use clip-local timestamps."
    ),
    input=[{"type": "message", "role": "user", "content": QUESTION}],
    text=TextParam(
        format=TextParamFormat_JsonSchema(
            name="wake_recurrence_comparison",
            schema_=SCHEMA,
        )
    ),
)
raw_response = dump_model(response)
write_json(RAW_PATH, raw_response)

structured = None
for output in response.output:
    if output.type == "message":
        for content in output.content:
            if getattr(content, "type", None) == "output_text":
                structured = json.loads(content.text)
if structured is None:
    raise RuntimeError("Jockey returned no structured output_text")

item_by_id = {item["itemId"]: item for item in items}
normalized_moments = []
for moment in structured["cited_moments"]:
    item = item_by_id.get(moment["item_id"])
    normalized_moments.append(
        {
            **moment,
            "assetId": item["assetId"] if item else None,
            "replayStartSeconds": item["replayStartSeconds"] if item else None,
            "timestampBasis": "clip-local",
        }
    )

observation = {
    "schemaVersion": "1.0",
    "provider": "twelvelabs-jockey",
    "generationMode": "real-api",
    "reviewMode": "pending-human-review",
    "knowledgeStoreId": knowledge_store_id,
    "knowledgeStoreItemIds": [item["itemId"] for item in items],
    "responseId": response.id,
    "sessionId": response.session_id,
    "question": QUESTION,
    "answer": structured["answer"],
    "citedMoments": normalized_moments,
    "limitations": [structured["limitations"]],
    "rawResponsePath": str(RAW_PATH.relative_to(ROOT)),
}
write_json(OBSERVATION_PATH, observation)
print(json.dumps(observation, indent=2))
