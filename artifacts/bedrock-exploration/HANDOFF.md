# Bedrock Exploration — Handoff

**Date:** 2026-07-30  
**Region:** us-east-1  
**Model:** openai.gpt-oss-120b-1:0  
**Framework:** strands-agents 1.50.2 (BedrockModel)

---

## Summary

Native `bedrock-runtime:Converse` works with existing permissions. The full Wake
coaching pipeline (Strands agent + tool calling + Pegasus evidence + Neo4j bundle →
validated CoachOutput) succeeds end-to-end.

### What this proves

OpenAI on Bedrock (`openai.gpt-oss-120b-1:0`) synthesized final Concept2, aligned
Pegasus, and Neo4j evidence into validated coaching.

This does NOT claim that OpenAI dispatched the Pegasus investigations.

---

## API Results

| Path | Status | Notes |
|------|--------|-------|
| `bedrock-runtime:Converse` | **Works** | Used by Strands `BedrockModel`; returns reasoning + text |
| `bedrock-runtime:InvokeModel` | **Works** | Base64-encoded body; returns OpenAI chat.completion |
| Mantle Responses (`bedrock-mantle`) | **Unavailable** | Not in installed AWS CLI 2.36.11; may become available in future release |
| `bedrock:ListInferenceProfiles` | **Denied** | Not required for inference |

### Strands Compatibility

| Model Class | Backend | Status |
|-------------|---------|--------|
| `BedrockModel` | `bedrock-runtime:Converse` | **Works** — tool calling, reasoning, structured output |
| `OpenAIResponsesModel` | Mantle | **Blocked** — service not in installed CLI; IAM also denied |

---

## End-to-End Run

- **Input:** D-014 Neo4j ExplanationBundle + aligned Pegasus normalized evidence
- **Observations cited:** `candidate-work-2-concept2`, `candidate-work-3-concept2`,
  `pegasus-interval-2-vs-3-visual-unresolved`, `pegasus-interval-2-vs-4-visual-unresolved`
- **Validation:** schema pass, citation pass, numeric audit pass (23 tokens)
- **Latency:** 24.6s (includes tool call round-trip + reasoning)
- **Stop reason:** end_turn

### CoachOutput

```json
{
  "headline": "Rate increased while power dropped",
  "explanation": "During Work 2 (08:25-08:45) the average stroke rate rose from 28.4 spm to 29.8 spm while average power fell from 165.5 W to 157.3 W. In the later Work 3 window (16:45-17:05) power rose to 215.3 W at 30.4 spm. Calibrated frontal video did not reveal a visible cause; Pegasus visual analysis for intervals 2 vs 3 and 2 vs 4 reported unresolved differences.",
  "citedObservationIds": ["candidate-work-2-concept2", "candidate-work-3-concept2", "pegasus-interval-2-vs-3-visual-unresolved", "pegasus-interval-2-vs-4-visual-unresolved"],
  "limitation": "The fixed frontal video cannot measure force or explain the telemetry difference; failure to resolve a difference does not mean the mechanics were identical."
}
```

---

## Recommendation

**Approve native OpenAI-on-Bedrock via Strands `BedrockModel` as D-007 amendment.**

The only code change: replace `OpenAIResponsesModel(...)` with
`BedrockModel(model_id='openai.gpt-oss-120b-1:0', region_name='us-east-1')`.
Tools, system prompt, validation, and CoachOutput schema are unchanged.

---

## Reproducible Command

```bash
.venv/bin/python scripts/strands_openai/run_e2e.py
```

Or with explicit args:
```bash
.venv/bin/python -m pipeline.strands_openai.run \
  --bundle graph/cache/explanation-bundle.json \
  --pegasus artifacts/twelvelabs/pegasus-normalized-evidence.json \
  --insight-id insight-rate-without-power \
  --output artifacts/strands-openai/coach-output.json \
  --capture artifacts/strands-openai/capture.json
```

---

## Artifacts

- `artifacts/strands-openai/coach-output.json` — validated CoachOutput from real inference
- `artifacts/strands-openai/capture.json` — full capture metadata (model, region, latency, audit, reasoning)
- `pipeline/strands_openai/run.py` — implementation (BedrockModel + tool calling)
- `pipeline/strands_openai/test_bedrock_model.py` — unit tests for native Bedrock path
- `scripts/strands_openai/run_e2e.py` — runnable end-to-end script
