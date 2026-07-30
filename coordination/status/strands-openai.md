# Strands and OpenAI Lieutenant Status

## Data/Jockey Evidence Ready for Bedrock — 2026-07-30 14:21 PDT

- Supplemental evidence:
  `artifacts/twelvelabs/runs/20260730-212016-autonomous-cross-angle/normalized-supplemental-context.json`.
- The autonomous Jockey query independently selected the side-view source.
- Bedrock/CoachOutput may describe drive sequencing and finish timing only as
  candidate coaching hypotheses. It must retain the clip-local timestamp basis
  and state that occurrence in the selected workout windows and causation of the
  output gap are not established.

Last updated: 2026-07-30 12:52 PDT
Current phase: Handoff with provider-permission blocker
State: implementation-complete; live generation blocked

## Completed

- Read the complete Strands/OpenAI role prompt, required canonical documents, and
  the coordination hub.
- Claimed this status file and proposed exclusive artifact/code ownership below.
- Confirmed D-007 requires `OpenAIResponsesModel` through Amazon Bedrock Mantle,
  using existing AWS configuration without a direct OpenAI API key.
- Confirmed D-011 supersedes the board path for this lane:
  `pipeline/strands_openai/`, `scripts/strands_openai/`,
  `artifacts/strands-openai/`, and `artifacts/build-manifest.json`.
- Verified a valid existing AWS session and region `us-east-1` without printing
  credentials.
- Installed the official `strands-agents[openai]` dependency into the existing
  project virtual environment; its native Mantle configuration uses the standard
  AWS credential chain and mints short-lived bearer tokens.
- Implemented exactly one Strands agent using `OpenAIResponsesModel`, exactly one
  deterministic `retrieve_explanation_bundle(insightId)` tool, strict
  `CoachOutput`, and post-generation citation/numeric validation.
- Consumed `graph/cache/explanation-bundle.json`, whose source is
  `cached-neo4j`; the corresponding successful local query result is
  `graph/results/explanation-live.json`.
- Attempted one real build-time inference with `openai.gpt-oss-120b` through
  Bedrock Mantle. Mantle returned `access_denied` for
  `bedrock-mantle:CreateInference`; no model output and no response ID exist.
- Produced an explicitly manual fallback CoachOutput, validated every citation and
  numeric token against the retrieved bundle, and preserved the telemetry-only
  limitation.
- Produced a truthful offline build manifest covering TwelveLabs availability,
  Neo4j, the failed OpenAI/Mantle attempt, Strands implementation, cached
  artifacts, and review flags.

## In Progress

- Awaiting Integration Captain/user decision on the missing Mantle permission and
  actual human review of the manual fallback.

## Files Owned

- This status file
- `pipeline/strands_openai/`
- `scripts/strands_openai/`
- `artifacts/strands-openai/`
- `artifacts/build-manifest.json`

## Files Changed

- `coordination/status/strands-openai.md`
- `pipeline/__init__.py`
- `pipeline/strands_openai/__init__.py`
- `pipeline/strands_openai/bundle_tool.py`
- `pipeline/strands_openai/run.py`
- `pipeline/strands_openai/requirements.txt`
- `pipeline/strands_openai/schemas.py`
- `pipeline/strands_openai/validation.py`
- `pipeline/strands_openai/test_validation.py`
- `scripts/strands_openai/validate_coach_output.py`
- `scripts/strands_openai/validate_build_manifest.py`
- `artifacts/strands-openai/failed-inference-attempt.json`
- `artifacts/strands-openai/coach-output.manual.json`
- `artifacts/strands-openai/coach-output.manual.validation.json`
- `artifacts/build-manifest.json`

## Verification

- Canonical execution boundary verified: all agent/model work is build-time;
  recording reads only reviewed local artifacts.
- `OpenAIResponsesModel` construction verified with model
  `openai.gpt-oss-120b`, Mantle region `us-east-1`, `stateful=False`, and
  `store=False`.
- Agent registry verified to contain only `retrieve_explanation_bundle`.
- Three focused unit tests pass: valid output, unknown citation rejection, and
  unsupported-number rejection.
- Manual CoachOutput validation passed; citations resolve to
  `candidate-work-2-concept2` and `candidate-selection-manual`. Matched numeric
  tokens are recorded in
  `artifacts/strands-openai/coach-output.manual.validation.json`.
- Neo4j bundle validation and BuildManifest validation pass.

## Blockers and Risks

- User prefers a 5.6 or 5.5 model if available. D-007 names
  `openai.gpt-oss-120b`; any provider/model change requires captain approval and
  must still be compatible with `OpenAIResponsesModel` over Bedrock Mantle.
- No provider response ID will be recorded until a successful real invocation
  returns one.
- Bedrock Mantle denied `ListModels`, so account access for GPT-5.6/5.5 cannot be
  claimed. Current Strands native Mantle support targets the `/v1` endpoint used
  by `openai.gpt-oss-120b`; retain D-007 unless captain approves a verified change.
- The current AWS role also lacks `bedrock-mantle:CreateInference`. This blocks
  the required successful Strands/OpenAI result. There is no truthful cached-real
  output in the repository, so the fallback is labeled manual and not
  human-reviewed.

## Messages to Team

- Bedrock profile/region verified: standard environment credential chain,
  `us-east-1`; no named profile and no secrets persisted.
- `openai.gpt-oss-120b` invocation verified: attempted, authorization denied;
  response ID: none; artifact:
  `artifacts/strands-openai/failed-inference-attempt.json`.
- Neo4j tool handoff received: `graph/cache/explanation-bundle.json`
  (`source: cached-neo4j`) paired with `graph/results/explanation-live.json`.
- To Integration Captain (12:39 PDT): approve proposed ownership and freeze this
  `CoachOutput` contract without renames: `headline`, `explanation`, `cue`, `drill`,
  `successCriterion`, `citedObservationIds`, `limitation` (all strings except
  `citedObservationIds: string[]`). The tool accepts `insightId: string` and
  returns exactly one validated `ExplanationBundle`.
- To Integration Captain: user prefers a 5.6/5.5 model if genuinely available
  through the existing Bedrock Mantle/OpenAI Responses route. Please approve only
  after runtime discovery; otherwise retain D-007's `openai.gpt-oss-120b`.
- To Neo4j Graph Lieutenant: publish the placeholder/live/cached
  `ExplanationBundle` path and exact observation fields; I will validate citations
  and numeric tokens strictly against that retrieved object.
- To Integration Captain (12:47 PDT): D-011 ownership adopted. Mantle model listing
  is unauthorized, so 5.6/5.5 access is unverified; I am retaining
  `openai.gpt-oss-120b`. The attempted Models API call made no inference and
  returned no provider response ID.
- To Integration Captain (12:49 PDT): real Strands inference reached Mantle but
  failed authorization for `bedrock-mantle:CreateInference` on the default
  project. No output or response ID exists. Required unblock is that permission
  for the current role; otherwise D-011 requires honest manual coaching and no
  OpenAI/Strands success claim.
- To Integration Captain / Replay UI (12:52 PDT): safe fallback output is
  `artifacts/strands-openai/coach-output.manual.json`; validation audit is adjacent.
  It may be shown only as manual coaching until a successful provider run replaces
  it. Do not claim OpenAI synthesis or successful Strands orchestration from this
  build. Manifest path: `artifacts/build-manifest.json`.

## Decision Needed From Captain

- Grant `bedrock-mantle:CreateInference` to the current role/default project or
  provide a previously captured truthful output; otherwise accept the honest
  manual fallback and omit OpenAI/Strands success claims.

## Next Actions

- If permission changes, rerun the single build-time command, validate and review
  the result, record the real response ID, replace the manual fixture artifact,
  and update the manifest. Otherwise hand off the validated manual fallback.

## ETA

- Implementation and honest fallback handoff complete.
- Successful real result: under 10 minutes after Mantle permission is granted.
