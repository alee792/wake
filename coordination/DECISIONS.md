# Wake Build Decisions

Owner: Integration Captain

Record decisions newest first. Decisions here override proposals in status files.

### D-018 — Multi-insight expansion is deterministic and Aura-backed

- Time: 2026-07-30 15:09 PDT
- Requested by: Project owner
- Decision: Expand Replay from one Insight/two windows to a reviewed collection
  of five independently selectable insights derived deterministically from
  Concept2 telemetry, D-014 evidence, and D-017 athlete marks. Persist/query the
  collection through live Aura with an identical offline cache. Bedrock may
  narrate reviewed facts but is not required to discover or store them.
- Reason: The current single-bundle contract collapses a workout with multiple
  useful patterns into one story. Real insight quality comes from reproducible
  comparisons and goal evaluation, not additional prose generation.
- Files/contracts affected: New additive InsightCollection artifacts and
  validators under `graph/**`, Aura nodes/relationships, Replay insight
  navigation, provenance, and replacement recording verification.
- Required follow-up: Include Work 2 minute progression, Work 3 late surge, Work
  4 strongest interval, the post-goal sub-2:15 evaluation, and the existing
  similar-rate/different-output comparison. Preserve source windows,
  calculations, citations, limitations, and review state for each.
- Cut or fallback: Do not infer visual cause. D-014/D-015 remain immutable.
  Athlete marks remain athlete-verified with `jockeyDetected: false`.

### D-017 — Athlete Goal and Flag are distinct Replay events

- Time: 2026-07-30 14:53 PDT
- Requested by: Project owner
- Decision: Accept the athlete-authored verbal goal and one-finger attention
  marker as a new Replay event family, displayed as distinct `Goal` and `Flag`
  events. They are athlete-verified, not Jockey-detected. Each accepted event
  requires a reviewed local MP4/poster, original video-local time, calibrated
  workout-global time, provenance, and review state before it appears.
- Reason: Athlete voice notes and intentional gestures let the athlete preserve
  goals and attention bookmarks during the workout for later review.
- Files/contracts affected: Athlete-mark normalization, local media manifest,
  Replay timeline/view models, event detail/media panel, provenance, replacement
  recording, and G-005 verification.
- Required follow-up: Data/Jockey must resolve the verbal-goal clock conflict
  before clipping: reported video `21:25` maps to workout `21:56.089`, while Work
  4 begins at workout `21:00` / video `20:28.911`. Replay uses the reviewed
  canonical result only and renders Goal and Flag with different shapes, labels,
  colors, and accessible names.
- Cut or fallback: Never claim Jockey detected or transcribed either mark. A
  mark without a reviewed local clip/poster remains absent from the recording.

### D-016 — Next-session output is an executable Concept2 workout

- Time: 2026-07-30 14:40 PDT
- Requested by: Project owner
- Decision: Replace the cue-only drill handoff with an additive
  `WorkoutPrescription` artifact generated and validated by the Strands/Bedrock
  lane. It must specify RowErg workout type, exact ordered work/rest steps,
  pace/power and stroke-rate targets, warm-up/cool-down guidance, a measurable
  success criterion, evidence citations, limitations, and human review state.
  It must also include concise ErgData `Create > Variable Intervals` programming
  instructions.
- Reason: “Hold pressure before building rate” is advice, not a workout the
  athlete can take to a PM5 and execute.
- Files/contracts affected: Strands schemas/validation and cached-real output,
  BuildManifest/provenance, Replay next-session card, narration, and G-004.
- Required follow-up: Strands generates one evidence-grounded prescription with
  the final Ask Wake response. Replay renders the ordered intervals and a
  copyable ErgData setup recipe while preserving the completed hero first frame.
- Cut or fallback: Do not claim a direct ErgData/PM5 import or API transfer
  unless an official supported interface is actually implemented and verified.
  The safe delivery is an exact, copyable variable-interval recipe.

### D-015 — Autonomous Jockey cross-angle context accepted for Ask Wake

- Time: 2026-07-30 14:25 PDT
- Requested by: Project owner / Data and Jockey Intelligence
- Decision: Accept
  `artifacts/twelvelabs/runs/20260730-212016-autonomous-cross-angle/normalized-supplemental-context.json`
  as real Jockey API evidence for the Ask Wake candidate-mechanism narrative.
  The store-wide request supplied no selection, item/source name, or side-view
  hint; Jockey independently selected and cited the supplemental low-angle item.
- Reason: The primary full-session angle could not resolve a visible mechanism.
  Jockey's autonomous cross-angle investigation found a directly visible
  drive-sequencing pattern that is useful as a coaching hypothesis and returned
  explicit non-occurrence and non-causation boundaries.
- Files/contracts affected: Ask Wake context/query artifact, Strands/Bedrock
  prompt and validation, supplemental media manifest, Replay Ask Wake panel,
  BuildManifest, provenance, and replacement narration/recording.
- Required follow-up: Neo4j stores and queries this as supplemental
  candidate-mechanism context without attaching its clip-local seconds to the
  workout-global Replay event. Strands cites the context alongside both Concept2
  windows and the calibrated Pegasus limitation. Replay packages the reviewed
  side-view clip and keeps its clock visibly clip-local.
- Cut or fallback: Never claim the pattern occurred in the hero/comparison
  windows or caused the 58 W difference. If the Ask Wake integration misses its
  cut, preserve the artifact in provenance and omit the interactive claim.

### D-014 — Clock-aligned Pegasus evidence accepted for post-freeze integration

- Time: hold recorded 2026-07-30 13:38 PDT; finalized 2026-07-30 13:50 PDT
- Requested by: Project owner / Data and Jockey Intelligence
- Decision: Accept only the five canonical observations in
  `artifacts/twelvelabs/pegasus-normalized-evidence.json` for downstream
  integration. The TCX workout clock starts at `13:35:00Z`; video
  filename/metadata place video start at approximately `13:35:31.089Z`.
  Normalize provider timestamps with `workoutSeconds = videoSeconds + 31.089`,
  carrying estimated uncertainty `±0.7s`. Release Neo4j, Replay, BuildManifest,
  and provenance integration for these five observations only.
- Reason: Earlier Pegasus passes treated video seconds as Concept2 workout
  seconds. Their interval comparisons and markers are therefore misaligned and
  cannot support Replay claims. For example, video hydration markers `11:08` and
  `25:17` map to Replay/Concept2 times approximately `11:39.1` and `25:48.1`.
- Files/contracts affected: `artifacts/twelvelabs/pegasus-normalized-evidence.json`,
  any Jockey normalization, Neo4j provider observations and explanation
  bundle/cache, Replay fixture evidence, BuildManifest, provenance, narration,
  and any replacement recording.
- Required follow-up: Data/Jockey preserves
  `artifacts/twelvelabs/pegasus-normalized-evidence.json`, its alignment
  artifact, corrected runs, and exclusions. Neo4j imports only the five stable
  observation IDs and rebuilds its explanation bundle/cache. Replay consumes only
  that rebuilt bundle and the calibrated media mapping. BuildManifest and
  provenance record real Pegasus API execution. Re-run graph tests, fixture
  validation, `npm test`, `npm run build`, offline media verification, and
  recording review before replacing the D-013 take.
- Cut or fallback: D-013 remains authoritative for the completed recording.
  Earlier unshifted Pegasus comparisons must not be integrated. No downstream
  claim may say identical mechanics, core engagement, an exact restart-stroke
  count, or causal hydration. Pressure/connection remains a labeled hypothesis.

### D-013 — Final content and sponsor inventory frozen

- Time: 2026-07-30 12:53 PDT
- Requested by: Integration Captain
- Decision: Freeze the telemetry-only Replay and validated manual CoachOutput.
  Record Concept2 as derived numerical authority, Neo4j as a successful
  live-local explanation query with offline cache, TwelveLabs as unavailable
  inventory only, OpenAI as an authorization-denied attempt with no output, AWS
  Strands as an implemented/validated pipeline with no successful inference, and
  Wake coaching as a validated manual fallback. Do not claim Pegasus, Jockey,
  OpenAI, or Strands generated the visible coaching.
- Reason: All safe fallback artifacts are complete and verified; the missing media,
  provider result, and Mantle permission cannot improve without external state.
- Files/contracts affected: `artifacts/build-manifest.json`, Replay fixture,
  provenance drawer, narration, recording.
- Required follow-up: None for this recording. A later real provider artifact
  requires a new decision, recapture, and full re-verification.
- Cut or fallback: Current recording is final and truthful.

### D-012 — Telemetry-only comparison is the safe recorded fallback

- Time: 2026-07-30 12:40 PDT
- Requested by: Neo4j Graph Lieutenant
- Decision: The verified Work 2 window `08:45–09:05` is the provisional hero and
  Work 3 window `17:05–17:30` is a connected comparison, not a visually confirmed
  recurrence. The recording may use this fallback only with the visible
  telemetry-only limitation. Neo4j may be claimed as a successful live-local
  query with an offline cache. Pegasus, Jockey, OpenAI, and Strands success may
  not be claimed without real artifacts.
- Reason: Concept2 supports the numerical relationship and Neo4j successfully
  connects the evidence, comparison, insight, and drill; no visual/provider model
  result exists yet.
- Files/contracts affected: Golden fixture, graph cache, headline, evidence,
  provenance, narration.
- Required follow-up: Replace the fallback only if Data/Jockey or Strands produces
  a valid real artifact before content freeze; repeat verification after replacement.
- Cut or fallback: At T+0:45 use the truthful no-video poster state. At T+1:40 hide
  Jockey if no cited result. At T+2:30 freeze the current honest provider inventory.

### D-011 — CoachOutput and Strands handoff frozen

- Time: 2026-07-30 12:36 PDT
- Requested by: Strands and OpenAI Lieutenant
- Decision: `CoachOutput` contains `headline`, `explanation`, `cue`, `drill`,
  `successCriterion`, `citedObservationIds`, and `limitation`; all are strings
  except `citedObservationIds: string[]`. The deterministic tool accepts
  `insightId: string` and returns exactly one validated `ExplanationBundle`.
  Ownership is `pipeline/strands_openai/`, `scripts/strands_openai/`,
  `artifacts/strands-openai/`, and `artifacts/build-manifest.json`.
- Reason: This is the minimum stable coaching and provenance handoff.
- Files/contracts affected: Shared contracts, Strands pipeline, fixture assembly,
  build manifest.
- Required follow-up: Retain `openai.gpt-oss-120b` unless runtime discovery proves
  another owner-requested model is both available and approved here.
- Cut or fallback: If live invocation misses its cut, use only truthful cached
  real output; otherwise label reviewed manual coaching honestly.

### D-010 — Four-hour clock and hard cut lines

- Time: 2026-07-30 12:31 PDT
- Requested by: Integration Captain
- Decision: Team deadlines are 12:51 contract/ownership freeze, 13:21 first
  screen, 14:11 offline vertical slice, 15:01 content freeze, 15:46 recording
  start, 16:16 reviewed-take cutoff, and 16:31 submission cutoff.
- Reason: The runbook requires fixed elapsed gates from the actual team start.
- Files/contracts affected: Board, all role schedules, recording preparation.
- Required follow-up: Lieutenants report milestones and blockers through their
  owned status file and direct message.
- Cut or fallback: Optional work never moves a later gate.

### D-009 — Frozen shared contracts, clock, and route

- Time: 2026-07-30 12:36 PDT
- Requested by: Integration Captain
- Decision: Canonical contracts live in `app/src/domain/contracts.ts` and retain
  the fields documented in `docs/current/architecture.md` and
  `docs/neo4j-shared-evidence-graph.md`. The one clock is global elapsed seconds
  from session start, bounded 0–1680; source block offsets are 0, 420, 840, and
  1260 seconds. The only recording route is `/`, opening directly with the final
  hero selected.
- Reason: Every workstream needs one stable integration boundary immediately.
- Files/contracts affected: `ProviderObservation`, `ExplanationBundle`,
  `ReplayFixture`, `BuildManifest`, fixtures, graph cache, UI.
- Required follow-up: Captain authors the contract module; roles import or emit
  its exact shape. Renames/removals require a recorded captain decision.
- Cut or fallback: Additive optional fields require approval; browser consumes
  deterministic local artifacts only.

### D-008 — Non-overlapping file ownership

- Time: 2026-07-30 12:36 PDT
- Requested by: Integration Captain
- Decision: Ownership is exactly as published in `coordination/BOARD.md`. Captain
  owns root configuration, shared contracts, final composition/controller,
  fixture integration and recording; lieutenants own their published data,
  `graph/`, `pipeline/strands_openai/` and Replay component/style paths
  respectively.
- Reason: Parallel work must integrate without conflicting edits.
- Files/contracts affected: Entire build workspace.
- Required follow-up: Each lieutenant records the claim in its owned status file
  and requests any exception before editing.
- Cut or fallback: Conflicts stop until captain assigns one temporary owner.

## Decision Template

### D-XXX — Short title

- Time:
- Requested by:
- Decision:
- Reason:
- Files/contracts affected:
- Required follow-up:
- Cut or fallback:

## Initial Decisions

### D-007 — OpenAI runs through the existing AWS Bedrock configuration

- Time: Before team start
- Requested by: Project owner
- Decision: Configure the Strands agent with `OpenAIResponsesModel`, route it
  through Amazon Bedrock Mantle, and default to `openai.gpt-oss-120b`. Use the
  existing AWS profile and region; do not require a direct OpenAI API key.
- Reason: This keeps OpenAI as the reasoning model while using the already
  available Bedrock access path.
- Files/contracts affected: Strands runtime configuration, `CoachOutput`, build
  manifest, provenance, and fallback behavior.
- Required follow-up: Strands and OpenAI Lieutenant verifies the AWS identity,
  region, model access, and one structured-output invocation before integrating
  the Neo4j tool.
- Cut or fallback: If Bedrock Mantle is unavailable at the cutoff, load a
  previously captured truthful `CoachOutput` and mark the build manifest
  `executionMode: cached`.

### D-006 — Pegasus discovers candidates; Jockey investigates selected clips

- Time: Before team start
- Requested by: Project owner
- Decision: The project owner runs one Pegasus 1.5 asynchronous `general` analysis
  with the supplied full-video prompt and JSON schema, then manually pastes the
  real output into the workspace. The Data/Jockey lieutenant validates it and
  selects two or three demo highlights: the hero moment, a
  recurrence/comparison moment, and optionally a positive/control moment. Use
  Jockey for cited cross-clip investigation across those selected highlights.
- Reason: The supplied SDK request provides explicit 0:00–28:00 coverage,
  evidence/interpretation separation, recurrence hints, confidence, and
  limitations without a custom UI. Jockey remains the higher-value cross-clip
  integration.
- Files/contracts affected: Data/Jockey role, video artifacts, provenance, demo
  script.
- Required follow-up: Project owner supplies the pasted Pegasus output. Data/Jockey
  Lieutenant publishes the expected path, validates the paste, normalizes selected
  highlights, and implements Jockey without waiting on Pegasus.
- Cut or fallback: If Jockey ingestion misses cutoff, omit the Jockey claim and keep
  its integration artifacts out of the recorded provenance.

### D-005 — Split graph and orchestration ownership

- Time: Before team start
- Requested by: Project owner
- Decision: Neo4j and Strands/OpenAI have separate primary lieutenants. TwelveLabs
  moves beside source data and media.
- Reason: The graph and agent orchestration are the core architecture and each needs
  an accountable owner.
- Files/contracts affected: Coordination hub, ExplanationBundle, CoachOutput,
  build manifest.
- Required follow-up: Captain freezes handoff contracts within twenty minutes.
- Cut or fallback: Each lieutenant emits a placeholder artifact immediately so
  downstream work never waits.

### D-004 — Existing mockup defines composition, not data

- Time: Before team start
- Requested by: Project owner
- Decision: Use `docs/current/end-state-reference.md` and the v2 desktop mockup as
  the target screenshot hierarchy while replacing stale date, timestamps, metrics,
  and provider claims.
- Reason: Agents need a concrete visual destination without copying invalid fixture
  facts.
- Files/contracts affected: Replay UI, fixture, recording QA.
- Required follow-up: Capture a target-viewport screenshot before recording.
- Cut or fallback: Preserve hierarchy and density even if decorative detail is cut.

### D-001 — Recording path is offline

- Time: Before team start
- Requested by: Project owner
- Decision: The recorded Replay must not require live sponsor services.
- Reason: Reliability and the four-hour deadline.
- Files/contracts affected: Replay fixture, caches, media mappings, build manifest.
- Required follow-up: Verify with network disabled.
- Cut or fallback: Use truthful cached artifacts.

### D-002 — 18:10 is not the default hero event

- Time: Before team start
- Requested by: Source-data review
- Decision: Select a hero window from an actual work interval after checking the
  normalized Concept2 data and available video.
- Reason: 18:10 falls in Recovery 3 in the TCX workout structure.
- Files/contracts affected: Fixture, script, evidence, video mapping.
- Required follow-up: Data and Jockey Intelligence Lieutenant proposes verified
  hero and recurrence windows.
- Cut or fallback: Candidate windows include approximately 8:45–9:05 and
  17:05–17:30.

### D-003 — One runtime build agent, multiple coding agents

- Time: Before team start
- Requested by: Architecture review
- Decision: The sponsor pipeline uses one AWS Strands agent configured with OpenAI
  Responses through Bedrock Mantle and deterministic tools. The coding team may
  use scoped subagents.
- Reason: Minimum credible architecture without unnecessary runtime orchestration.
- Files/contracts affected: Sponsor pipeline and build manifest.
- Required follow-up: Strands and OpenAI Lieutenant records actual execution mode.
- Cut or fallback: No runtime swarm or generalized agent framework.
