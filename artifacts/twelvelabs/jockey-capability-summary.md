# Jockey MCP Capability Summary

## What It Is

TwelveLabs Jockey is an agentic video understanding system accessed via MCP tools.
It answers natural-language questions grounded in actual video content, returning
cited clips with timestamps. Unlike Pegasus (fixed-prompt per-video analysis),
Jockey investigates across multiple videos and can do multi-turn follow-ups.

## Available Tools

| Tool | Purpose |
|------|---------|
| `jockey_list_knowledge_stores` | List or fetch stores (with readiness summary) |
| `jockey_create_knowledge_store` | Create a new empty store |
| `jockey_add_media` | Add videos/images by URL or asset_id |
| `jockey_request_upload_link` | Get browser upload link for local files |
| `jockey_list_knowledge_store_items` | List items, poll status until `ready` |
| `jockey_query` | Ask a question, get grounded prose + cited clips |
| `jockey_search` | Quick semantic retrieval (ranked clips, no synthesis) |

## What Jockey Returns

A `jockey_query` response includes:
- **Prose answer** — concise, grounded in what's visible
- **Inline citations** — `<vref id="..." start="MM:SS" end="MM:SS">` pointing to exact clip windows
- **Playback URLs** — HLS stream and thumbnail per cited item
- **Session ID** — for multi-turn follow-ups without resending context

## Current State (Wake Project)

- Knowledge store: `ks_019fb490-1e6c-7362-95c9-d61e14d6a835`
- Session: `sess_019fb4a8-c3b7-77a0-9eb0-33c55467a6da`
- Indexed: side-view clip (43s) — ready
- Pending: front-view full session (28 min) — uploading
- Hero queries (recurrence + candidate events) blocked on front-view indexing

## How to Use for Wake Demo

1. **Recurrence query** (the "Ask Wake" hero moment): ask Jockey where a specific
   technique pattern recurs across the workout. Returns cited timestamps that the
   Replay UI can seek to.

2. **Candidate events**: ask for pivotal moments worth coaching. Use as input to
   the evidence graph — each becomes a node with grounded video provenance.

3. **Multi-turn follow-up**: pass the session_id to dig deeper on a finding
   without re-explaining context.

## Constraints

- Videos must be in a knowledge store and `ready` before querying
- Only sees what's visually/audibly present — cannot read Concept2 telemetry
- Supply telemetry context in the `instructions` field if Jockey needs it
- Google Drive `/view` links don't work as sources — use upload link or direct URLs
- Large videos (4+ GB) take time to index after upload
