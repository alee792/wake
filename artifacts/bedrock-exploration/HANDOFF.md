# Bedrock Exploration — Handoff

**Date:** 2026-07-30  
**Region:** us-east-1  
**Identity:** Participant role (account 8278****6489)

---

## Summary of Findings

### 1. Native Bedrock Runtime — WORKS

Both standard Bedrock Runtime APIs succeed against `openai.gpt-oss-120b-1:0`:

| API | Status | Notes |
|-----|--------|-------|
| `bedrock-runtime:Converse` | **Success** | Native Bedrock message format; returns reasoning + text content blocks |
| `bedrock-runtime:InvokeModel` | **Success** | Requires base64-encoded body; returns OpenAI `chat.completion` JSON |

The model is ACTIVE, supports TEXT in/out, streaming, and ON_DEMAND inference.
No inference profile required — the model ID works directly.

### 2. Mantle Responses — UNAVAILABLE THROUGH CURRENT CLI/SDK

`bedrock-mantle` is not a recognized service in the currently installed AWS CLI
(version 2.36.11). The previous `bedrock-mantle:CreateInference` denial was against
a preview/beta endpoint not present in this CLI version. This path is blocked at the
installed SDK level for this environment. It may become available in a future CLI
release or through direct HTTP request signing against the Mantle endpoint.

### 3. `bedrock:ListInferenceProfiles` — DENIED

Previously confirmed denied. Not required for native inference since the bare
model ID (`openai.gpt-oss-120b-1:0`) works with both Converse and InvokeModel.

### 4. Wake End-to-End — WORKS (Strands + Native Converse)

Successfully ran a complete Wake coaching pipeline:
- Strands `BedrockModel` (uses `bedrock-runtime:Converse` natively)
- Tool-calling: `retrieve_explanation_bundle` invoked mid-agent-loop
- Input: curated Pegasus evidence + Neo4j ExplanationBundle
- Output: validated `CoachOutput` (schema, citations, numeric audit all pass)
- Latency: 3.3s end-to-end including tool call round-trip

The existing Strands `OpenAIResponsesModel` cannot use native Converse — it
requires Mantle. Switching to `BedrockModel` is the only code change required;
the model ID, tool definitions, system prompt, and validation pipeline are identical.

---

## Commands Attempted

```bash
# Model metadata (success)
aws bedrock get-foundation-model --model-identifier "openai.gpt-oss-120b-1:0" --region us-east-1

# Converse API (success)
aws bedrock-runtime converse \
  --model-id "openai.gpt-oss-120b-1:0" \
  --region us-east-1 \
  --messages '[{"role":"user","content":[{"text":"..."}]}]' \
  --inference-config '{"maxTokens":256}'

# InvokeModel API (success — body must be base64)
echo -n '{"messages":[...],"max_completion_tokens":256}' | base64 | \
  xargs -I{} aws bedrock-runtime invoke-model \
    --model-id "openai.gpt-oss-120b-1:0" \
    --region us-east-1 \
    --content-type "application/json" \
    --accept "application/json" \
    --body {} /dev/stdout

# Strands end-to-end (success — BedrockModel with tool calling)
# See artifacts/strands-openai/request.json for reproducible command

# Mantle (not available in installed CLI 2.36.11)
aws bedrock-mantle create-inference ...  # ERROR: invalid choice
```

---

## Architecture Implications

Wake's current design (D-007) routes through OpenAI Responses via Mantle.
Native Bedrock bypasses Mantle entirely, using standard `bedrock-runtime` permissions.

| Consideration | Mantle Responses | Native Bedrock |
|---------------|-----------------|----------------|
| Permission needed | `bedrock-mantle:CreateInference` (denied; service not in installed CLI 2.36.11) | `bedrock-runtime:Converse` / `InvokeModel` (both granted) |
| Response format | OpenAI Responses API | Converse: Bedrock native; InvokeModel: OpenAI chat.completion |
| Streaming | Unknown (untestable in current environment) | Supported (`converse-stream`) |
| Model access | Same model IDs | Same model IDs |
| SDK support | Not in installed AWS CLI 2.36.11 | Full support |
| Strands integration | `OpenAIResponsesModel` (blocked) | `BedrockModel` (works, with tool calling) |

---

## Strands Compatibility

| Strands Model Class | Backend | Status | Notes |
|---------------------|---------|--------|-------|
| `OpenAIResponsesModel` | Mantle (`bedrock-mantle:CreateInference`) | **Blocked** | Service not in installed CLI; IAM also denied |
| `BedrockModel` | `bedrock-runtime:Converse` | **Works** | Native tool calling, reasoning content, structured output |

The only code change required: replace `OpenAIResponsesModel(...)` with
`BedrockModel(model_id='openai.gpt-oss-120b-1:0', region_name='us-east-1')`.
Everything else — tools, system prompt, validation, CoachOutput schema — remains identical.

---

## Recommendation

**Approve native OpenAI-on-Bedrock via `BedrockModel` as an explicit architecture change from D-007.**

Rationale:
1. It works today with existing permissions — no IAM changes needed.
2. The full Wake pipeline (Strands agent + tool calling + validation) passes end-to-end.
3. `Converse` provides a provider-neutral envelope (same API for Anthropic, Meta, OpenAI models on Bedrock).
4. Mantle Responses is not available through the currently installed CLI/SDK and the required permission is denied — unblocking it requires both an IAM change and a CLI/SDK upgrade.
5. The 120b model includes chain-of-thought reasoning (returned as `reasoningContent`) at no extra prompt engineering cost.
6. This run proves that OpenAI synthesized reviewed Pegasus and Neo4j evidence into coaching. It does not claim that OpenAI dispatched the Pegasus investigations.

### Proposed next step

Record this as an architecture change from D-007:
> **D-007 amendment:** Wake inference routes through Strands `BedrockModel` using
> native `bedrock-runtime:Converse` against `openai.gpt-oss-120b-1:0` in us-east-1,
> replacing the `OpenAIResponsesModel` / Mantle Responses path which is unavailable
> through the currently installed CLI/SDK.

The 20b model (`openai.gpt-oss-20b-1:0`) was not tested because the 120b succeeded
on the first attempt. It remains available as a cost/latency fallback.

---

## Artifacts

### `artifacts/bedrock-exploration/`
- `request.json` — sanitized request template with both API formats
- `response.json` — complete raw response from Converse + supplemental InvokeModel sample
- `HANDOFF.md` — this file

### `artifacts/strands-openai/`
- `request.json` — full Strands end-to-end request (model, tools, sources, reproducible command)
- `response.json` — raw response with CoachOutput, reasoning, validation, and Strands incompatibility documentation
