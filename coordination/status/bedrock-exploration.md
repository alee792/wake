# Bedrock Exploration Status

Last updated: 2026-07-30 13:48 PDT
Current phase: Complete — awaiting captain decision on D-007 amendment
State: end-to-end proven; native Converse works

## Completed

- Verified AWS identity and region (us-east-1) without exposing credentials.
- Confirmed `openai.gpt-oss-120b-1:0` is ACTIVE, TEXT in/out, ON_DEMAND.
- Tested `bedrock-runtime:Converse` — success with reasoning content.
- Tested `bedrock-runtime:InvokeModel` — success with OpenAI chat.completion format.
- Confirmed `bedrock-mantle` is not available as a service in installed AWS CLI 2.36.11.
- Confirmed `bedrock:ListInferenceProfiles` is denied (not required).
- Ran full Wake end-to-end: Strands `BedrockModel` + `retrieve_explanation_bundle` tool
  + Pegasus evidence context + Neo4j ExplanationBundle → validated CoachOutput.
- CoachOutput passes: schema validation, citation validation, numeric audit (6 tokens matched).
- Documented Strands incompatibility: `OpenAIResponsesModel` requires Mantle (blocked);
  `BedrockModel` uses native Converse (works).
- Archived sanitized request, raw response, model ID, region, latency, validation
  result under `artifacts/strands-openai/` and `artifacts/bedrock-exploration/`.

## Key Results

| Test | Result | Latency |
|------|--------|---------|
| Raw Converse API | Success | 1.3s |
| Raw InvokeModel API | Success | ~1s |
| Strands BedrockModel (full pipeline) | Success + validated | 3.3s |
| Strands OpenAIResponsesModel (Mantle) | Blocked (service not in CLI) | N/A |

## Files Owned

- This status file
- `artifacts/bedrock-exploration/`
- `artifacts/strands-openai/request.json` (end-to-end run)
- `artifacts/strands-openai/response.json` (end-to-end run)

## Decision Needed From Captain

Approve D-007 amendment: replace `OpenAIResponsesModel` / Mantle Responses path
with Strands `BedrockModel` using native `bedrock-runtime:Converse`. The only code
change is the model class instantiation; all other pipeline components (tool, schema,
validation, system prompt) remain identical.

Alternatively:
- Request the missing `bedrock-mantle:CreateInference` permission AND upgrade
  the AWS CLI to a version that includes the bedrock-mantle service.
- Retain the honest manual fallback from the strands-openai lieutenant.

## Notes

- Mantle Responses is unavailable through the currently installed CLI/SDK (2.36.11).
  It may become available in a future release. The claim is environment-specific,
  not a statement about global AWS service availability.
- This run proves that OpenAI (`openai.gpt-oss-120b-1:0`) synthesized reviewed
  Pegasus and Neo4j evidence into coaching. It does NOT claim that OpenAI
  dispatched the Pegasus investigations.
- The 20b model was not tested because the 120b succeeded immediately.
