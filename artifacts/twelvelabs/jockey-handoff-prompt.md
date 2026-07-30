# Jockey Integration Handoff

## Status

Jockey MCP is authenticated and operational. A knowledge store exists with one
side-view clip indexed and ready. The 28-minute front-view video is being uploaded
and will need indexing before the hero queries can run.

## What's Done

- Knowledge store created: `ks_019fb490-1e6c-7362-95c9-d61e14d6a835`
- Side-view clip indexed: `PXL_20260730_140719642.mp4` (43s, item `ksi_019fb493-9535-7e00-905e-9e0e10563241`)
- Test query validated — Jockey returns grounded prose with `<vref>` timestamped citations
- All `mcp__jockey__*` tools auto-allowed in `.claude/settings.json`
- Raw response saved: `artifacts/twelvelabs/jockey-raw-response.json`
- Capability docs: `artifacts/twelvelabs/jockey-capability-summary.md`

## What's Needed Next

### 1. Confirm front-view video is indexed

```
jockey_list_knowledge_store_items(
  knowledge_store_id="ks_019fb490-1e6c-7362-95c9-d61e14d6a835"
)
```

Wait until you see the 28-min front-view item with status `ready`.

### 2. Run hero recurrence query

```
jockey_query(
  knowledge_store_id="ks_019fb490-1e6c-7362-95c9-d61e14d6a835",
  query="The selected Wake event is: rate increased while power decreased around 18:10-18:36. Find other cited moments that visually resemble the associated rushed recovery or sequencing change. State whether each example supports, weakens, or is inconclusive for the pattern. Do not restate telemetry you cannot access.",
  instructions="You are investigating a completed rowing workout for Wake. Identify visually supported performance or technique patterns. Treat supplied Concept2 telemetry as authoritative for pace, watts, rate, distance, and interval timing. Do not infer exact joint angles, injury risk, muscle recruitment, or force. Return concise findings with cited video moments, confidence, and limitations."
)
```

This produces the "Ask Wake" demo answer — a grounded recurrence finding with cited timestamps.

### 3. Run candidate events query

```
jockey_query(
  knowledge_store_id="ks_019fb490-1e6c-7362-95c9-d61e14d6a835",
  query="Across the workout videos in this knowledge store, identify at most five pivotal moments that would be useful in a post-workout coaching debrief. Prefer recurring or consequential patterns over isolated visual quirks.",
  instructions="You are investigating a completed rowing workout for Wake. Identify visually supported performance or technique patterns. Do not infer exact joint angles, injury risk, muscle recruitment, or force. Return concise findings with cited video moments, confidence, and limitations."
)
```

### 4. Save outputs

Write both responses to `artifacts/twelvelabs/jockey-raw-response.json` (update the existing file — replace `pending_queries` with actual responses).

### 5. Normalize for downstream

Each Jockey citation becomes a `ProviderObservation`:
```json
{
  "id": "jockey-recurrence-001",
  "provider": "twelvelabs-jockey",
  "startSeconds": <from vref start>,
  "endSeconds": <from vref end>,
  "kind": "technique",
  "statement": "<observation text>",
  "confidence": <0-1>,
  "citations": ["<hls_url>#t=<start>,<end>"],
  "limitations": ["..."],
  "generationMode": "api",
  "rawResponsePath": "artifacts/twelvelabs/jockey-raw-response.json"
}
```

Write normalized observations to `artifacts/twelvelabs/jockey-observation.json`.

## Key Facts for the Coordinator

- Jockey can only see what's in the video — it cannot read Concept2 data unless you supply it in the `instructions` field
- Multi-turn: pass `session_id="sess_019fb4a8-c3b7-77a0-9eb0-33c55467a6da"` to continue the conversation without re-explaining
- The demo caches the "Ask Wake" answer as a fixture — the live app doesn't call Jockey at runtime
- If the front-view video isn't indexed by T+1:40, fall back to Pegasus observations connected by Neo4j (no Jockey claim)
- `jockey_search` is cheaper than `jockey_query` — use it for quick clip retrieval without synthesis
