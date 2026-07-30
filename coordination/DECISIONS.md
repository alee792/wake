# Wake Build Decisions

Owner: Integration Captain

Record decisions newest first. Decisions here override proposals in status files.

### D-014 — PENDING: Pegasus source-clock alignment and integration hold

- Time: hold recorded 2026-07-30 13:38 PDT; final decision pending
- Requested by: Project owner / Data and Jockey Intelligence
- Interim decision: Hold all Pegasus- or Jockey-derived Neo4j, Replay, coaching,
  provenance, narration, and recording ingestion. The TCX workout clock starts at
  `13:35:00Z`; video filename/metadata place video start at approximately
  `13:35:31.089Z`. Normalize provider timestamps with
  `workoutSeconds = videoSeconds + 31.089`, carrying estimated uncertainty
  `±0.7s`.
- Reason: Earlier Pegasus passes treated video seconds as Concept2 workout
  seconds. Their interval comparisons and markers are therefore misaligned and
  cannot support Replay claims. For example, video hydration markers `11:08` and
  `25:17` map to Replay/Concept2 times approximately `11:39.1` and `25:48.1`.
- Files/contracts affected: `artifacts/twelvelabs/pegasus-normalized-evidence.json`,
  any Jockey normalization, Neo4j provider observations and explanation
  bundle/cache, Replay fixture evidence, BuildManifest, provenance, narration,
  and any replacement recording.
- Required follow-up: Data/Jockey completes corrected aligned passes and
  regenerates `artifacts/twelvelabs/pegasus-normalized-evidence.json` with the
  mapping, uncertainty, and raw provenance. Integration Captain validates the
  regenerated artifact before finalizing D-014 and releasing any downstream
  ingestion.
- Cut or fallback: D-013 remains authoritative for the completed recording.
  Earlier unshifted Pegasus comparisons must not be integrated. No downstream
  owner begins ingestion until the captain records D-014 as final.

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
