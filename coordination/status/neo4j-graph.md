# Neo4j Graph Lieutenant Status

Last updated: 2026-07-30 13:10 PDT
Current phase: Aura cutover verified and handed off
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
- `graph/cypher/explanation.cypher`
- `graph/cypher/explain-explanation.cypher`
- `graph/seed/golden-session.json`
- `graph/params/hero-insight.json`
- `graph/results/explanation-live.json`
- `graph/results/explanation-aura.json`
- `graph/cache/explanation-bundle.json`
- `graph/provenance.json`
- `graph/tests/validate-bundles.mjs`

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

## Blockers and Risks

- BLOCKER: no pasted Pegasus result, source video, or Jockey response exists.
  Provider nodes truthfully record `provenanceStatus: unavailable`, but no
  Pegasus/Jockey event observation is claimed or connected.
- The current second event is a comparison/counterexample connected through the
  shared pattern, not a confirmed visual recurrence.
- Aura connectivity, schema, writes, idempotence, plan acceptance, and the read
  result are now verified.
- Current insight/drill are provisional manual content pending captain/content
  review.

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

## Decision Needed From Captain

- None for Aura cutover. Existing telemetry/video limitations remain unchanged.

## Next Actions

- No further Neo4j action required unless the frozen graph content changes.

## ETA

- Complete.

## Corrected Pegasus Handoff — 13:43 PDT

- HOLD until Integration Captain finalizes D-014.
- Then import only
  `artifacts/twelvelabs/pegasus-normalized-evidence.json`, using the stable
  observation IDs and workout-global timestamps.
- Clock calibration is
  `artifacts/twelvelabs/video-concept2-alignment.json`.
- Preserve `visual evidence unresolved`, real-API provenance, citations, and
  limitations. Replace the obsolete Pegasus-unavailable/manual-video observation.
- Do not import excluded unshifted runs or rejected identical-mechanics,
  core-engagement, restart-count, or causal hydration claims.
