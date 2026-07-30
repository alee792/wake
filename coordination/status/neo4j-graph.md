# Neo4j Graph Lieutenant Status

## Canonical D-016 WorkoutPrescription — complete 2026-07-30 15:26 PDT

- Persisted `workout-build-pressure-then-rate-v1` in live Aura as
  deterministic, human-reviewed Wake coaching with
  `generationMode: manual`, `aiGenerated: false`, and
  `bedrockGenerated: false`.
- Prescription is “Build pressure, then rate” for Concept2 RowErg:
  - 8:00 easy warm-up with three 10-stroke builds;
  - 4 × 4:00 work / 3:00 easy at
    `2:12–2:15 @ 28`, `2:09–2:12 @ 28`, `2:06–2:09 @ 29`, and
    `2:03–2:06 @ 30`;
  - 5:00 easy cool-down.
- Stored all four numeric success criteria exactly, including strict
  `<135 s/500m`, Work 2 watts greater than Work 1 near 28 spm,
  nondecreasing watts, and Work 4 `<=126 s/500m` with `<=30.5 spm`.
- Added copyable ten-step ErgData
  `Create Workout → Variable Intervals` instructions with
  `deliveryMode: manual-copy-only`, `automaticTransfer: false`, and the explicit
  statement that Wake does not automatically transfer to ErgData or a PM5.
- Connected the prescription to workout `concept2-118993656` and all five
  canonical D-018 `DerivedInsight` nodes through one `FOR_WORKOUT` and five
  `SUPPORTED_BY` relationships.
- First seed created 1 node and 6 relationships. Second seed created 0 nodes and
  0 relationships.
- Exact Aura totals: 35 nodes, 52 relationships, 14 uniqueness constraints.
  New constraint: `workout_prescription_id_unique`. No provider or Jockey
  attribution relationship exists.
- Live result: `graph/results/workout-prescription-aura.json`; offline Replay
  handoff: `graph/cache/workout-prescription.json`; these differ only at
  `source`.
- Verification:
  `graph/results/workout-prescription-verification.json`. Direct live equality,
  cache equality, citations, numeric targets, manual authorship, transfer
  boundary, idempotence, all graph validators, and `npm test` passed.
- D-014, D-015, and D-018 live/cache hashes remain unchanged.
- Replay handoff: render the cached prescription as reviewed Wake coaching and
  expose the manual ErgData recipe. Do not label it Bedrock-generated and do not
  imply direct ErgData import or PM5 transfer.

## D-018 InsightCollection — complete 2026-07-30 15:15 PDT

- Built and queried live Aura collection
  `insight-collection-concept2-118993656-v1` with five independently selectable
  `DerivedInsight` nodes:
  - `insight-work2-progressive-build`
  - `insight-work3-late-surge`
  - `insight-work4-strongest-interval`
  - `insight-sub215-goal-achieved`
  - `insight-similar-rate-different-output`
- Deterministic calculations:
  - Work 2 minute watts: `150.4 → 159.6 → 160.9 → 171.7`; sample counts
    `30 / 28 / 29 / 30`; every minute strictly increased.
  - Work 3 minute 1: `138.8 W / 26.5 spm` from 29 samples; minute 4:
    `210.7 W / 30.5 spm` from 31 samples; deltas `+71.9 W / +4.0 spm`.
  - Work 4 recomputed from 123 samples and ranked first in all requested
    metrics: `179.3 W`, fastest `125.4 s/500m`, `962 m`, `30.2 spm`.
  - Post-Goal `[1316.089, 1500)` evaluation: `95/95` samples strictly below
    `135 s/500m`; sample share `1.0`; step-hold duration and under-target
    duration both `183.911s`; average/best/worst pace
    `123.9 / 113.4 / 133.1 s/500m`; average `185.3 W / 30.8 spm`; longest
    continuous run `183.911s`; `allSamplesUnderTarget: true`.
  - Cross-window comparison remains `157.3 W / 29.8 spm` versus
    `215.3 W / 30.4 spm`; Pegasus remains “visual evidence unresolved”; Jockey
    remains clip-local, hypothesis-only, occurrence `not-established`, and
    causation `rejected`.
- New minimal Aura model: one `InsightCollection`, five `DerivedInsight`,
  `CONTAINS_INSIGHT`, `FOR_WORKOUT`, and `ABOUT_SEGMENT`; two new uniqueness
  constraints only.
- Seed run 1 created 6 nodes and 12 relationships. Seed run 2 created 0 nodes
  and 0 relationships.
- Exact Aura totals are now 34 nodes, 46 relationships, and 13 uniqueness
  constraints. D-018 slice cardinalities: collection 1, derived insights 5,
  memberships 5, segment associations 6, workout link 1.
- Live result:
  `graph/results/insight-collection-aura.json`; offline Replay handoff:
  `graph/cache/insight-collection.json`; these differ only at `source`.
- Deterministic math, schema/cardinality, provenance, frozen-hash, and
  live/cache validation passed. All `graph/tests/*.mjs` and `npm test` passed.
- D-014 SHA-256 remains
  `4fe2e783fd0978dfdbb2c3156a6d68db51c2f674046c87fdeb40fe3cda187375`;
  D-015 SHA-256 remains
  `3fa55c5fbcbe5f0b46faf15e0130c97e0e5cbf67451611bab7d68326609638ba`.
- Replay handoff: render these five in the listed stable order as independently
  selectable insights. Use the cached collection offline; do not replace or
  mutate the frozen D-014 ExplanationBundle or D-015 Ask Wake context.

## D-017 Athlete Review Context — blocked 2026-07-30 15:03 PDT

- Live Aura schema discovery completed first with
  `neo4j-cli query :schema --format toon`; database `125e2ba1` remains at 28
  nodes, 34 relationships, and 11 uniqueness constraints before this slice.
- Read D-014, D-015, D-017,
  `artifacts/twelvelabs/athlete-notes-bookmarks.json`, and
  `artifacts/media/replay-media-manifest.json`.
- Required input `artifacts/data/athlete-mark-evaluations.json` is absent. A
  workspace-wide filename/content search and a 30-second recheck found no
  equivalent artifact.
- No constraints, nodes, relationships, result/cache artifacts, or other graph
  files were written. This prevents inventing the deterministic Goal evaluation
  or deterministic Flag context.
- D-014 and D-015 remain unchanged. Resume immediately when the exact evaluation
  artifact is published.

## Data/Jockey Supplemental Context Ready — 2026-07-30 14:21 PDT

- Consume
  `artifacts/twelvelabs/runs/20260730-212016-autonomous-cross-angle/normalized-supplemental-context.json`
  as supplemental clip-local context.
- Jockey independently chose side-view item
  `ksi_019fb493-9535-7e00-905e-9e0e10563241` without a selection/source hint.
- Preserve `candidateMechanismStatus: hypothesis-only`,
  `occurredInSelectedWorkoutWindows: not-established`, and
  `causalClaim: rejected`. Do not attach its timestamps to workout-global events.

Last updated: 2026-07-30 15:26 PDT
Current phase: canonical D-016 deterministic WorkoutPrescription handoff
State: complete

## Completed

- Read the complete Neo4j Graph Lieutenant role prompt in `docs/agent-team-runbook.md`.
- Read the canonical graph slice in `docs/neo4j-shared-evidence-graph.md`.
- Read the required product documents, board, decisions, and every role status.
- Claimed this status file and the Neo4j schema, seed, explanation-query, and cache artifacts, subject to captain-published paths.
- Implemented eight idempotent uniqueness constraints and a fully parameterized
  idempotent seed in `graph/**`.
- Loaded one workout, eight phases, two events, three observations, four provider
  provenance records, one shared pattern, one insight, and one drill into local
  Neo4j Community 2026.06.0.
- Ran constraints and seed twice without duplicates.
- Ran `EXPLAIN`; the plan starts with `NodeUniqueIndexSeek` on
  `Insight(insightId)`.
- Captured one successful live-local `ExplanationBundle` and an identical cached
  fallback differing only at `source`.
- Added and passed focused bundle/cardinality validation.
- Discovered the target Aura schema before writes. Database `125e2ba1` reported
  Aura 5.27 Enterprise with no application nodes or constraints.
- Created all eight Wake uniqueness constraints in Aura using stored credential
  `wake`; no connection secret was exposed.
- Loaded the reviewed parameterized golden-session seed into Aura and ran it
  twice. The second run created zero nodes and zero relationships.
- Executed Aura `EXPLAIN` successfully with an explicit
  `USING INDEX insight:Insight(insightId)` hint backed by the ONLINE
  `insight_id_unique` range index.
- Captured the real Aura explanation result at
  `graph/results/explanation-aura.json`.
- Replaced the offline cache from the Aura result; semantic diff proves it differs
  only at `source: "cached-neo4j"`.
- Updated `graph/provenance.json` to `executionMode: live-aura` for database
  `125e2ba1`.
- Read final D-014 and the Integration Captain outbox.
- Validated `artifacts/twelvelabs/pegasus-normalized-evidence.json`: exactly five
  canonical observation IDs, all clock-aligned through
  `artifacts/twelvelabs/video-concept2-alignment.json`.
- Reconciled Aura by removing the obsolete manual video observation and the
  unavailable `manual` / `twelvelabs-jockey` provider records.
- Imported only the five D-014 Pegasus observations with unchanged provider
  statements, timestamps, confidence, citations, limitations, generation mode,
  and raw-response paths.
- Ran the D-014 seed twice; the second run created zero nodes and zero
  relationships.
- Re-executed Aura EXPLAIN and the parameterized explanation read, then rebuilt
  `graph/results/explanation-aura.json` and
  `graph/cache/explanation-bundle.json`.
- Updated graph provenance with real Pegasus API execution, asset ID, calibrated
  clock mapping, ±0.7-second uncertainty, and rejected-claim boundaries.
- Added `candidate-work-3-concept2` to the hero bundle as comparison/contradicting
  evidence through the shared-pattern event, while leaving
  `candidate-work-3.importance: comparison`.
- Replaced insight `pending video review` / `provisional-telemetry-only` wording
  with `calibrated-video-reviewed-unresolved` and an explicit statement that
  calibrated frontal video did not resolve a visible cause.
- Updated the Work 3 Concept2 limitation to: “This is a comparison rather than a
  recurrence; calibrated frontal video did not resolve a visible cause.”
- Recaptured Aura result/cache after two idempotent seed runs.
- Executed D-015 / G-003 by importing the autonomous Jockey cross-angle result
  as a separate supplemental Ask Wake context, not as a workout event
  observation.
- Added a stable context keyed by
  `ask-wake-output-gap-cross-angle`, referencing both Concept2 windows and
  Pegasus's unresolved calibrated primary-camera result.
- Preserved Jockey timestamps as clip-local strings on supplemental moments.
  No supplemental node or moment has an `OCCURRED_DURING` relationship.
- Captured the live Aura Ask Wake query result and a cache-identical fallback
  differing only at `source`.
- Added `graph/scripts/derive-insight-collection.mjs` as the independent,
  deterministic D-018 computation authority.
- Added parameterized Aura constraints, seed, collection read, EXPLAIN, and
  cardinality queries for the additive D-018 slice.
- Captured the five-insight live Aura result and identical cached fallback,
  differing only at `source`.
- Added focused deterministic-math, schema, cardinality, provenance,
  frozen-artifact, and equality validation.

## In Progress

- None for Aura cutover.

## Files Owned

- This status file
- Captain-approved exclusive ownership: `graph/**` (constraints,
  seed, query, parameters, captured/cache results, provenance, and focused tests).
- No UI, source-data, shared-contract, board, decisions, or other status files.

## Files Changed

- `coordination/status/neo4j-graph.md`
- `graph/cypher/constraints.cypher`
- `graph/cypher/seed.cypher`
- `graph/cypher/reconcile-d014.cypher`
- `graph/cypher/explanation.cypher`
- `graph/cypher/explain-explanation.cypher`
- `graph/seed/golden-session.json`
- `graph/params/hero-insight.json`
- `graph/results/explanation-live.json`
- `graph/results/explanation-aura.json`
- `graph/cache/explanation-bundle.json`
- `graph/provenance.json`
- `graph/tests/validate-bundles.mjs`
- `graph/cypher/ask-wake-constraints.cypher`
- `graph/cypher/ask-wake-seed.cypher`
- `graph/cypher/ask-wake-context.cypher`
- `graph/cypher/explain-ask-wake-context.cypher`
- `graph/params/ask-wake-context.json`
- `graph/seed/ask-wake-context.json`
- `graph/results/ask-wake-context-aura.json`
- `graph/cache/ask-wake-context.json`
- `graph/tests/validate-ask-wake-context.mjs`
- `graph/scripts/derive-insight-collection.mjs`
- `graph/scripts/capture-insight-collection.mjs`
- `graph/cypher/insight-collection-constraints.cypher`
- `graph/cypher/insight-collection-seed.cypher`
- `graph/cypher/insight-collection.cypher`
- `graph/cypher/explain-insight-collection.cypher`
- `graph/cypher/validate-insight-collection-cardinality.cypher`
- `graph/params/insight-collection.json`
- `graph/results/insight-collection-aura.json`
- `graph/results/insight-collection-verification.json`
- `graph/cache/insight-collection.json`
- `graph/tests/validate-insight-collection.mjs`
- `graph/scripts/build-workout-prescription.mjs`
- `graph/scripts/capture-workout-prescription.mjs`
- `graph/cypher/workout-prescription-constraints.cypher`
- `graph/cypher/workout-prescription-seed.cypher`
- `graph/cypher/workout-prescription.cypher`
- `graph/cypher/explain-workout-prescription.cypher`
- `graph/cypher/validate-workout-prescription-cardinality.cypher`
- `graph/params/workout-prescription.json`
- `graph/results/workout-prescription-aura.json`
- `graph/results/workout-prescription-verification.json`
- `graph/cache/workout-prescription.json`
- `graph/tests/validate-workout-prescription.mjs`

## Verification

- `node graph/tests/validate-bundles.mjs` passed.
- Live-local node counts: Workout 1, Segment 8, Event 2, Observation 3,
  Provider 4, Pattern 1, Insight 1, Drill 1.
- `SHOW CONSTRAINTS` returned all eight uniqueness constraints.
- Two seed runs each reported 3 observations / 2 event links; cardinalities
  remained unchanged.
- Explanation query returned the selected event, Work 2 segment, separate
  supporting/contradicting evidence, Work 3 comparison through the shared
  pattern, and the drill.
- Aura exact node counts after both seed runs: Workout 1, Segment 8, Event 2,
  Observation 3, Provider 4, Pattern 1, Insight 1, Drill 1 (21 total).
- Aura exact relationship counts after both seed runs: INCLUDES_SEGMENT 8,
  OCCURRED_DURING 2, INSTANCE_OF 2, PRESENTED_AS 1, RECOMMENDS 1,
  PRODUCED_BY 3, SUPPORTS 1, CONTRADICTS 2 (20 total).
- Aura constraints: `workout_id_unique`, `segment_id_unique`,
  `event_id_unique`, `observation_id_unique`, `provider_id_unique`,
  `insight_id_unique`, `pattern_id_unique`, `drill_id_unique`; all associated
  range indexes are ONLINE.
- Direct comparison of the Aura query payload to
  `graph/results/explanation-aura.json` passed.
- Direct comparison of the Aura query payload with only `source` changed to the
  offline cache passed.
- Final `node graph/tests/validate-bundles.mjs` passed.
- D-014 exact Aura node counts: Workout 1, Segment 8, Event 2, Observation 7,
  Provider 2, Pattern 1, Insight 1, Drill 1 (23 total).
- D-014 exact Aura relationship counts: INCLUDES_SEGMENT 8, OCCURRED_DURING 2,
  INSTANCE_OF 2, PRESENTED_AS 1, RECOMMENDS 1, PRODUCED_BY 7, SUPPORTS 1,
  CONTRADICTS 4 (26 total).
- Aura provider inventory is now exactly Concept2 (2 observations) and
  TwelveLabs Pegasus (5 observations).
- The rebuilt hero bundle contains one Concept2 supporting measurement and two
  clock-aligned Pegasus API observations as unresolved/contradicting visual
  evidence. No obsolete manual-video observation remains.
- Live Aura/result diff passed; Aura/cache diff passed after changing only
  `source`; final graph test passed.
- Final content recapture exact bundle evidence:
  - supporting: `candidate-work-2-concept2` (157.3 W, 29.8 spm);
  - contradicting/comparison: `candidate-work-3-concept2` (215.3 W, 30.4 spm);
  - contradicting/visual: the two calibrated unresolved Pegasus observations.
- Both final seed runs created zero nodes and zero relationships; Aura remains 23
  nodes and 26 relationships.
- Final live Aura/result equality passed; live Aura/cache equality passed after
  changing only `source`; `node graph/tests/validate-bundles.mjs` passed.
- D-015 first seed created exactly 5 nodes and 8 relationships. The second seed
  created 0 nodes and 0 relationships (property refresh only), proving stable
  cardinalities.
- D-015 exact Aura totals after both seed runs: 28 nodes and 34 relationships.
  New labels are AskWakeContext 1, SupplementalObservation 1, and
  SupplementalMoment 2; Provider increased to 3.
- D-015 relationship totals include REFERENCES 3, FOR_INSIGHT 1,
  INCLUDES_SUPPLEMENT 1, CITES_MOMENT 2, and PRODUCED_BY 8 overall. There is no
  event link from the supplemental observation or its moments.
- Aura now has 11 uniqueness constraints: the existing eight plus
  `ask_wake_context_id_unique`, `supplemental_observation_id_unique`, and
  `supplemental_moment_id_unique`.
- Live Aura query/result structural equality passed. The cached artifact is
  structurally identical after changing only `source` from `neo4j` to
  `cached-neo4j`.
- `node graph/tests/validate-bundles.mjs` and
  `node graph/tests/validate-ask-wake-context.mjs` both passed.
- Frozen D-014 ExplanationBundle SHA-256 remains
  `4fe2e783fd0978dfdbb2c3156a6d68db51c2f674046c87fdeb40fe3cda187375`.
  The five-observation Pegasus normalization SHA-256 remains
  `17cb63269517441ef8c927752581814ef17fe441ce2a27414c2ba9137628351f`.
- D-018 Aura exact node counts: InsightCollection 1, DerivedInsight 5, Workout
  1, Segment 8, Event 2, Observation 7, Provider 3, Insight 1, Pattern 1,
  Drill 1, AskWakeContext 1, SupplementalObservation 1, SupplementalMoment 2
  (34 total).
- D-018 Aura exact relationship counts: ABOUT_SEGMENT 6, CONTAINS_INSIGHT 5,
  FOR_WORKOUT 1, plus the unchanged prior 34 relationships (46 total).
- New constraints `insight_collection_id_unique` and
  `derived_insight_id_unique` are ONLINE; 13 total constraints.
- Forbidden `DerivedInsight-[:PRODUCED_BY]->twelvelabs-jockey` count is zero.
- Direct live Aura/result equality and live/cache equality after changing only
  `source` passed.
- WorkoutPrescription exact slice: 1 node, 1 `FOR_WORKOUT`, 5 `SUPPORTED_BY`,
  and 1 uniqueness constraint. Aura totals are 35 nodes, 52 relationships, and
  14 constraints.
- WorkoutPrescription seed run 2 created zero nodes and zero relationships.
- `WorkoutPrescription-[:PRODUCED_BY]->Provider` count is zero.
- The live Aura prescription cites exactly the five D-018 insight IDs; the
  live/cache semantic diff is only `source`.
- Numeric-target, authorship, ErgData disclaimer, citations, cardinality,
  frozen-hash, and full graph validation passed.

## Blockers and Risks

- Jockey evidence is imported only into the D-015 supplemental Ask Wake slice;
  the frozen D-014 ExplanationBundle and its five canonical Pegasus observations
  are unchanged.
- The current second event is a comparison/counterexample connected through the
  shared pattern, not a confirmed visual recurrence.
- Aura connectivity, schema, writes, idempotence, plan acceptance, and the read
  result are now verified.
- Drive sequencing and finish timing remain candidate mechanisms only. The graph
  does not establish their occurrence in either selected Concept2 window or
  causation of the approximately 58 W difference.

## Messages to Team

- Integration Captain: approve exclusive `graph/**` ownership and freeze fields
  `insight`, `event`, `segment`, `supportingEvidence`,
  `contradictingEvidence`, `recurrences`, `drill`, and
  `source: "neo4j" | "cached-neo4j"`.
- Strands/OpenAI: consume the bundle as one object and do not depend on live
  Neo4j. Proposed cache path: `graph/cache/explanation-bundle.json`.
- Data/Jockey: publish stable hero/recurrence event IDs, segment IDs and bounds,
  normalized observations with stable observation/provider IDs, `generationMode`,
  support-vs-contradict classification, and truthful provenance.
- Integration Captain: verified graph artifacts are ready at `graph/**`.
  Approve these paths and the unchanged canonical bundle. The successful result
  is `graph/results/explanation-live.json`; offline handoff is
  `graph/cache/explanation-bundle.json`.
- Strands/OpenAI: consume `graph/cache/explanation-bundle.json` now. It matches
  the live result exactly after changing only `source`.
- Replay UI: use recurrence `candidate-work-3` through the standard event-select
  callback, but label it comparison/provisional unless Data/Jockey supplies real
  recurrence evidence.
- Data/Jockey: replace or supplement the provisional seed only with real normalized
  Pegasus/Jockey observations and artifact paths. Required keys are stable:
  `observationId`, `eventId`, `providerId`, `stance`, and `properties` containing
  bundle observation fields.
- Integration Captain: AURA BUNDLE READY. Use
  `graph/results/explanation-aura.json` as the successful live result and
  `graph/cache/explanation-bundle.json` as the identical offline result. Aura
  database ID is `125e2ba1`; validation passed.
- Strands/OpenAI Lieutenant: AURA BUNDLE READY. Consume
  `graph/cache/explanation-bundle.json`; it was recaptured from the verified Aura
  query and differs from `graph/results/explanation-aura.json` only at `source`.
- Integration Captain: D-014 NEO4J HANDOFF READY. Rebuilt live Aura result:
  `graph/results/explanation-aura.json`. Rebuilt offline result:
  `graph/cache/explanation-bundle.json`. Provenance:
  `graph/provenance.json`. All five canonical Pegasus observations are present in
  Aura; bundle/cache and graph tests pass.
- Replay/Integration: the hero bundle now exposes the calibrated unresolved
  Pegasus visual evidence. Preserve the hypothesis-only pressure/connection
  boundary and do not reintroduce identical-mechanics, core-engagement,
  restart-count, or causal-hydration claims.
- Integration Captain: FINAL D-014 CONTENT RECAPTURE READY at
  `graph/results/explanation-aura.json` and
  `graph/cache/explanation-bundle.json`. Both Concept2 windows are now cited;
  equality, idempotence, and graph validation passed.
- Bedrock/Strands: FINAL D-014 BUNDLE READY. Re-consume
  `graph/cache/explanation-bundle.json`; it now supplies both Concept2
  observations and calibrated-video-reviewed-unresolved insight wording.
- Replay: FINAL D-014 BUNDLE READY. Render Work 3 as a comparison, not a
  recurrence, and preserve all rejected-claim boundaries from D-014.
- Integration Captain: D-015 HANDOFF READY. Live Aura result:
  `graph/results/ask-wake-context-aura.json`; stable offline context:
  `graph/cache/ask-wake-context.json`. Aura has 28 nodes, 34 relationships, and
  11 uniqueness constraints. Both graph validations, idempotence, and
  live/cache equality passed.
- Bedrock/Strands: D-015 ASK WAKE CONTEXT READY. Consume
  `graph/cache/ask-wake-context.json` as supplemental hypothesis-only context.
  Cite both Concept2 observations and Pegasus's unresolved result; keep every
  Jockey timestamp clip-local and do not assert occurrence or causation.
- Replay: D-015 SUPPLEMENTAL CONTEXT READY. The D-014 ExplanationBundle is
  frozen and unchanged. If the supplemental context is surfaced, label it
  hypothesis-only; Work 3 remains a comparison, not a recurrence.
- Integration Captain: D-018 INSIGHT COLLECTION READY. Live Aura result:
  `graph/results/insight-collection-aura.json`; deterministic verification:
  `graph/results/insight-collection-verification.json`; cached Replay contract:
  `graph/cache/insight-collection.json`. Idempotence, equality, all graph
  validators, and `npm test` passed.
- Replay: consume `graph/cache/insight-collection.json` and expose its five
  stable IDs as independently selectable insights. Preserve collection order,
  workout-global times, associated segments/events, exact metrics, limitations,
  and review states. Goal achievement follows the voice note but is not caused
  by it; no athlete mark is Jockey-attributed.
- Integration Captain: CANONICAL D-016 READY. Live Aura:
  `graph/results/workout-prescription-aura.json`; cached Replay contract:
  `graph/cache/workout-prescription.json`; verification:
  `graph/results/workout-prescription-verification.json`. Bedrock is not a
  dependency for this handoff.
- Replay: consume `graph/cache/workout-prescription.json` as deterministic,
  human-reviewed Wake coaching. Render all ordered targets, four success
  criteria, and the manual ErgData recipe. Preserve
  `automaticTransfer: false`; never present an automatic ErgData import or PM5
  transfer.

## Decision Needed From Captain

- None.

## Next Actions

- Integration Captain, Bedrock/Strands, and Replay may consume the D-015 cached
  context while continuing to use the unchanged D-014 ExplanationBundle.

## ETA

- Complete.

## Corrected Pegasus Handoff — finalized 14:01 PDT

- D-014 finalized; imported only
  `artifacts/twelvelabs/pegasus-normalized-evidence.json`, using its five stable
  observation IDs and workout-global timestamps.
- Clock calibration is
  `artifacts/twelvelabs/video-concept2-alignment.json`.
- Preserved `visual evidence unresolved`, real-API provenance, citations, and
  limitations. Replaced the obsolete Pegasus-unavailable/manual-video evidence.
- Do not import excluded unshifted runs or rejected identical-mechanics,
  core-engagement, restart-count, or causal hydration claims.
