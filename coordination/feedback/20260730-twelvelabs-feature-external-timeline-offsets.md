# TwelveLabs API — External timeline offsets for video evidence

- Sponsor and product/API: TwelveLabs, Pegasus Analyze API and Jockey Responses API
- Type: feature request
- Title: Support caller-defined external timeline offsets in analysis results and citations
- Impact: Applications that align video with telemetry, sensors, or event clocks must
  manually translate every provider timestamp. In Wake, treating source-video seconds
  as workout seconds invalidated four Pegasus runs and forced a downstream integration
  hold and three corrected passes.

## Concrete use case

Wake combines Concept2 telemetry with a workout video that began approximately
31.089 seconds after the telemetry clock. Pegasus and Jockey correctly use the
source video's local time, but the application needs every observation in the
Concept2 workout clock. A request-level timebase such as
`external_time_offset_seconds: 31.089`, plus an optional uncertainty and timebase
label, would let the API return both source-local and external timestamps without
discarding the original citation basis.

## Reproduction

1. Analyze a video whose recording begins after an independently timestamped
   telemetry session.
2. Ask Pegasus or Jockey about windows defined in the telemetry clock.
3. Observe that returned moments and citations are expressed only in source-video
   time.
4. Apply the offset manually and rerun any question whose requested windows were
   originally supplied in the external clock.

## Expected behavior

The caller can optionally declare an external timebase and offset. Structured
moments and citations then preserve source-video time and also return the mapped
external time, offset, and uncertainty. Requests with external windows can be
translated deterministically by the service.

## Actual behavior

The application must perform and audit the translation itself. Wake's original
unshifted requests used Concept2 windows as source-video windows; the corrected
mapping is `workoutSeconds = videoSeconds + 31.089` with estimated uncertainty
`±0.7s`.

## Evidence

- `artifacts/twelvelabs/video-concept2-alignment.json`
- `artifacts/twelvelabs/pegasus-normalized-evidence.json`
- `coordination/DECISIONS.md`, D-014
- Excluded unshifted Pegasus task IDs:
  `6a6bab37eb0afeafecfa8fe5`, `6a6bac3223f9bfaddae568ca`,
  `6a6bacd0c1ac59f5d1d08d3d`, and `6a6bae5eb9dc44a905207bcf`
- Corrected task IDs:
  `6a6bb59639bf4592836cd793`, `6a6bb59cc1ac59f5d1d119b7`,
  and `6a6bb5a80d774e7cec6cd373`
- TwelveLabs Python SDK version: `1.3.1`

## Workaround

Preserve raw provider timestamps, maintain a separate clock-calibration artifact,
translate during normalization, carry uncertainty into every observation, and
post-validate all aligned windows before downstream ingestion.

- Author role: Feedback audit subagent
- Status: captain-reviewed
