# AWS Strands — Bedrock route preflight and native fallback guidance

- Sponsor and product/API: AWS, Strands Agents `OpenAIResponsesModel` and Amazon Bedrock
- Type: feature request
- Title: Preflight Mantle availability and guide developers to the native Bedrock route
- Impact: Wake had valid AWS credentials and access to the requested OpenAI model
  through native Bedrock Runtime, but its Strands `OpenAIResponsesModel` path failed
  on the separate Mantle permission. The build fell back to manual coaching even
  though the same model was callable through `Converse` and `InvokeModel`.

## Concrete use case

A Strands application is configured with `OpenAIResponsesModel` and
`bedrock_mantle_config` because it needs OpenAI Responses semantics. Before the
agent run, it should be possible to detect whether Mantle token minting and
`CreateInference` are authorized and to receive actionable guidance about the
available native `BedrockModel` route, feature differences, and route-specific
model ID.

## Reproduction

1. Use Strands Agents `1.50.2`, boto3/botocore `1.43.59`, region `us-east-1`.
2. Configure `OpenAIResponsesModel` with model
   `openai.gpt-oss-120b`, `bedrock_mantle_config={"region": "us-east-1"}`,
   `stateful=False`, and `store=False`.
3. Invoke the agent with valid AWS credentials that do not include
   `bedrock-mantle:CreateInference`.
4. Observe Mantle returns `access_denied` and no provider response ID.
5. Invoke native `bedrock-runtime:Converse` and
   `bedrock-runtime:InvokeModel` with `openai.gpt-oss-120b-1:0`.
   Both calls succeed with the same identity and region.

## Expected behavior

Strands exposes a documented capability/preflight call, or enhances the exception,
to identify the unavailable Mantle route before an agent run. For a model also
available through native Bedrock Runtime, the diagnostic should point to a tested
`BedrockModel` configuration and clearly list lost or changed Responses features,
tool/structured-output compatibility, and the correct native model ID. An explicit
opt-in fallback adapter would be even better.

## Actual behavior

The developer discovers the route-specific permission only during inference and
must independently test another API, translate the model identifier, and determine
whether tools and structured output remain compatible. The Mantle denial itself is
an environment/IAM condition, not claimed as a product bug.

## Evidence

- `artifacts/strands-openai/failed-inference-attempt.json`
- `pipeline/strands_openai/run.py`
- `coordination/status/strands-openai.md`
- GitHub PR #1: `https://github.com/alee792/wake/pull/1` (native Bedrock proof
  artifacts remain on the draft PR branch)
- Region: `us-east-1`
- Mantle error code: `access_denied`
- Missing permission: `bedrock-mantle:CreateInference`
- Mantle provider response ID: unavailable because no response was created
- Native model: `openai.gpt-oss-120b-1:0`
- Strands Agents: `1.50.2`
- boto3/botocore: `1.43.59`
- AWS CLI used for native proof: `2.36.11`

## Workaround

Perform separate Bedrock model/runtime discovery, use native `Converse` or
`InvokeModel`, and build or validate a different Strands model adapter. If that
cannot be completed safely, preserve an honestly labeled manual fallback.

- Author role: Feedback audit subagent
- Status: captain-reviewed
