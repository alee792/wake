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

### 2. Mantle Responses — NOT AVAILABLE

`bedrock-mantle` is not a recognized service in AWS CLI 2.36.11. The previous
`bedrock-mantle:CreateInference` denial was likely against a preview/beta endpoint
not yet in the public CLI. This path is blocked at the SDK level, not just IAM.

### 3. `bedrock:ListInferenceProfiles` — DENIED

Previously confirmed denied. Not required for native inference since the bare
model ID (`openai.gpt-oss-120b-1:0`) works with both Converse and InvokeModel.

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

# Mantle (not available — service not in CLI)
aws bedrock-mantle create-inference ...  # ERROR: invalid choice
```

---

## Architecture Implications

Wake's current design (D-007) routes through OpenAI Responses via Mantle.
Native Bedrock bypasses Mantle entirely, using standard `bedrock-runtime` permissions.

| Consideration | Mantle Responses | Native Bedrock |
|---------------|-----------------|----------------|
| Permission needed | `bedrock-mantle:CreateInference` (denied, service not in CLI) | `bedrock-runtime:Converse` / `InvokeModel` (both granted) |
| Response format | OpenAI Responses API | Converse: Bedrock native; InvokeModel: OpenAI chat.completion |
| Streaming | Unknown (untestable) | Supported (`converse-stream`) |
| Model access | Same model IDs | Same model IDs |
| SDK support | Not in AWS CLI 2.36 | Full support |

---

## Recommendation

**Approve native OpenAI-on-Bedrock as the production inference path.**

Rationale:
1. It works today with existing permissions — no IAM changes needed.
2. `Converse` provides a provider-neutral envelope (same API for Anthropic, Meta, OpenAI models on Bedrock).
3. `InvokeModel` returns the familiar OpenAI `chat.completion` format if provider-specific parsing is preferred.
4. Mantle Responses is not available in the current SDK and the required permission is denied — unblocking it requires both an IAM change and a CLI/SDK upgrade to an unreleased service.
5. The 120b model includes chain-of-thought reasoning (returned as `reasoningContent`) at no extra prompt engineering cost.

### Proposed next step

Record this as an architecture change from D-007:
> **D-007 amendment:** Wake inference routes through native `bedrock-runtime:Converse`
> (or `InvokeModel`) against `openai.gpt-oss-120b-1:0` in us-east-1, replacing the
> Mantle Responses path which is not available in the current SDK.

The 20b model (`openai.gpt-oss-20b-1:0`) was not tested because the 120b succeeded
on the first attempt. It remains available as a cost/latency fallback.

---

## Artifacts

- `request.json` — sanitized request template with both API formats
- `response.json` — complete raw response from Converse + supplemental InvokeModel sample
