# Wake Four-Hour Build Board

Owner: Integration Captain

## Clock

- Team start: 2026-07-30 12:31 PDT
- T+0:20 contract and ownership freeze: 2026-07-30 12:51 PDT
- T+0:50 complete first screen: 2026-07-30 13:21 PDT
- T+1:40 offline vertical slice: 2026-07-30 14:11 PDT
- T+2:30 content and contract freeze: 2026-07-30 15:01 PDT
- T+3:15 recording begins: 2026-07-30 15:46 PDT
- T+3:45 successful recording cutoff: 2026-07-30 16:16 PDT
- T+4:00 upload/submission cutoff: 2026-07-30 16:31 PDT

## Overall State

- State: original recording complete; D-014 post-freeze integration released
- Current phase: Neo4j/Replay clock-aligned Pegasus integration
- Recording route: `/` (direct completed Replay, hero preselected)
- Recording viewport: 1536 × 1024 at 100% zoom; 1440 × 900 minimum
- Production build command: `npm run build`
- Local serving command: `npm run preview -- --host 127.0.0.1`
- Verification command: `npm test && npm run build`

## Frozen Contracts

- ProviderObservation: `app/src/domain/contracts.ts`; exact canonical fields from `docs/current/architecture.md`; no rename/removal after 12:51
- ExplanationBundle: `app/src/domain/contracts.ts`; exact canonical fields from `docs/neo4j-shared-evidence-graph.md`; source is `neo4j | cached-neo4j`
- ReplayFixture: `app/src/domain/contracts.ts`; schemaVersion `1.0`; one imported fixture only
- BuildManifest: `app/src/domain/contracts.ts`; steps record provider/service, execution mode, paths, response ID, timestamp, optional hash, human review
- Global time convention: integer/decimal elapsed seconds from session start, inclusive start/exclusive end, bounded `0 <= t <= 1680`; CSV block offsets `0, 420, 840, 1260`; UI labels derive from this clock only

## File Ownership

### Integration Captain

- `coordination/BOARD.md`
- `coordination/DECISIONS.md`
- `coordination/DISPATCH.md`
- `coordination/status/integration-captain.md`
- root build configuration and `app/src/domain/contracts.ts`
- final `app/src/App.tsx` composition/controller integration, verification, screenshots, recording

### Data and Jockey Intelligence Lieutenant

- `data/` (read source; do not rewrite supplied exports)
- `artifacts/data/`, `artifacts/media/`, `artifacts/twelvelabs/`
- `scripts/data/`, `scripts/twelvelabs/`
- `coordination/status/data-jockey-intelligence.md`

### Neo4j Graph Lieutenant

- `graph/` (including `graph/cache/explanation-bundle.json`)
- `coordination/status/neo4j-graph.md`

### Strands and OpenAI Lieutenant

- `pipeline/strands_openai/`
- `scripts/strands_openai/`
- `artifacts/strands-openai/`
- `artifacts/build-manifest.json`
- `coordination/status/strands-openai.md`

### Replay UI Lieutenant

- `app/src/components/`, `app/src/styles/`, `app/src/assets/`
- UI-focused tests
- `coordination/status/replay-ui.md`
- Final-integration lease beginning 14:17 PDT: exclusive temporary ownership of
  `app/src/App.tsx` and `app/src/generated/replayFixture.ts` for reviewed local
  media and Ask Wake wiring. Integration Captain will not edit these files until
  Replay reports handoff complete.

## Sponsor Feedback Points

- Every role records reproducible sponsor bugs and specific feature requests in
  `coordination/feedback/` using its README template.
- Use one uniquely named file per report; never include credentials or private
  media URLs.
- Integration Captain reviews duplicates and evidence, then submits accepted
  reports with `./give_developer_feedback.sh`.

## Current Hero Story

- Workout: 4 × 4:00 work / 3:00 recovery
- Date: July 30, 2026
- Hero window: `08:45–09:05` (Interval 2; telemetry verified)
- Comparison window: `17:05–17:30` (Interval 3; telemetry verified)
- Headline: “Rate rose without preserving power in the Work 2 candidate.”
- Next-session output: an evidence-grounded, executable Concept2 RowErg
  variable-interval workout under D-016; the old cue-only drill is provisional
  fallback text, not the final recommendation.

## Ask Wake Cross-Angle Task

- State: D-015 evidence accepted; Neo4j/Bedrock/Replay integration active
- Prepopulated question: “Why was output so different at nearly the same stroke
  rate?”
- Required story: the primary angle could not resolve a mechanism; Jockey then
  searched the available angles and cited side-view drive sequencing and finish
  timing as candidate mechanisms to investigate.
- Required boundary: the side-view footage is supplemental and clip-local, so it
  supports a coaching hypothesis rather than proving the mechanism occurred in
  the selected hero window.
- Delivery: one real Bedrock/Strands response captured and validated against the
  final graph plus approved Jockey context; UI reveals the cached real response
  instantly and may try a server-side live call with an honest fallback.
- Definition of done: local hero, comparison, and side-view media; cited
  cross-angle answer; a D-016 executable RowErg workout with copyable ErgData
  variable-interval steps; no credentials in the browser; Chrome/offline
  fallback; provenance distinguishes live, cached-real-API, and hypothesis.
- Blockers:
  - side-view citations use clip-local time and must not be represented as
    workout-global Replay seconds;
  - Ask Wake supplemental Neo4j context and aligned Bedrock rerun are pending;
  - Ask Wake UI/API-or-cache interaction is not implemented.

## Athlete Goal and Flag Task

- State: D-017 reviewed media complete; Replay integration active.
- Goal: athlete-verified verbal target “Keep the split under 2:15.”
- Flag: athlete-verified right-hand one-finger attention marker.
- Required UI: separate Goal and Flag timeline events with distinct shapes,
  labels, colors, accessible names, selected details, and local video clips.
- Required boundary: neither mark was detected by Jockey; preserve
  athlete-verified provenance.
- Canonical clocks: Goal video `21:25.000` maps to Replay `21:56.089`;
  Flag video `19:07.000` maps to Replay `19:38.089`.

## Earmarked Multi-Insight Expansion

- State: D-018 live Aura collection complete; Replay insight navigation pending.
- Goal: expand from one Insight with two windows to 4–6 deterministic,
  independently selectable insights across the workout.
- Candidate set: Work 2 rate-without-power, Work 3 positive comparison, Work 4
  spoken-goal evaluation, Work 4 finish trend, Work 2 minute progression, and
  athlete Goal/Flag context.
- Intended path: deterministic Concept2/athlete-mark derivation → reviewed Aura
  insight/event nodes and cached list → Replay insight navigation. Bedrock is
  optional narration, not the source of these facts.
- Ready input: `artifacts/data/athlete-mark-evaluations.json` proves that all 95
  recorded samples after the Goal were strictly under 2:15, with reviewed
  athlete provenance and explicit sampling limitations.
- Ready graph handoff: `graph/cache/insight-collection.json` contains five
  independently selectable deterministic insights and matches the live Aura
  result after changing only `source`.

## Post-Freeze Pegasus Evidence Handoff

- Integration state: **RELEASED under final D-014**
- Canonical target:
  `artifacts/twelvelabs/pegasus-normalized-evidence.json`
- Source-clock mapping:
  `workoutSeconds = videoSeconds + 31.089` with estimated uncertainty `±0.7s`
- Clock anchors: TCX workout start `13:35:00Z`; estimated video start
  `13:35:31.089Z`.
- Video hydration markers `11:08` and `25:17` map to Replay/Concept2 times
  approximately `11:39.1` and `25:48.1`.
- Earlier Pegasus interval comparisons used unshifted timestamps and are invalid
  for integration.
- Five canonical `ProviderObservation` records validate successfully. Neo4j,
  Replay, BuildManifest, and provenance may consume only these five observations.
- Preserve `visual evidence unresolved`; reject identical mechanics, core
  engagement, exact restart-stroke count, and causal hydration claims.
- Any pressure/connection explanation must remain visibly labeled as a
  hypothesis.

## Gate Status

### T+0:20

- [x] App boots
- [x] Contracts compile
- [x] File ownership published
- [x] Timeline/source truth agreed

### T+0:50

- [x] Complete first screen
- [x] Event selection changes visible state
- [x] No blocking upload/loading flow

### T+1:40

- [x] Replay/insight/evidence/interval/media synchronize
- [x] Connected comparison citation seeks
- [x] Next-session action visible
- [x] Offline path works

### T+2:30

- [x] Content frozen
- [x] Contracts frozen
- [x] Sponsor artifacts connected truthfully
- [x] Optional unfinished integrations cut

### T+3:15

- [x] Production build running
- [x] Recording viewport verified
- [x] Opening-state and expanded-evidence fallback screenshots captured
- [x] Narration finalized
- [x] Recording completed early

### T+3:45

- [x] Complete recording reviewed
- [x] Audio verified
- [x] Visual path verified

## Active Blockers

- Jockey cannot run without selected ready assets/credentials; hide unless a real
  cited response lands by T+1:40.
- Bedrock Mantle denied `CreateInference`; do not claim OpenAI/Strands generation
  unless permission is restored and a real reviewed output lands before freeze.
- Earlier unshifted provider observations remain blocked permanently. Downstream
  integration is limited to the five validated observations in the final D-014
  artifact.
- Aura import, idempotence, provenance, live/cache comparison, and graph tests
  pass. Before Bedrock/Replay consumption, recapture the bundle after replacing
  stale `pending video review` / `provisional-telemetry-only` insight wording
  with calibrated-video-reviewed-but-unresolved wording.
- The hero bundle must also expose `candidate-work-3-concept2` as comparison/
  contradicting evidence; without it, the bundle cannot support the intended
  157.3 W versus 215.3 W cross-window story or a Bedrock citation to both sides.

## Current Cut Decisions

- Recording is offline and opens on `/` with the hero preselected.
- No uploads, loading experience, generic chat, graph explorer, agent console, authentication, or live recording-time sponsor calls.
- Jockey is invisible unless a real cited artifact is ready by T+1:40.
- Pegasus is invisible unless the supplied raw real-API artifact validates by T+2:30.
- Optional polish stops at T+2:30; recording preparation cannot slip past T+3:15.
- D-013 freezes the final truthful inventory: Concept2 derived, Neo4j live-local
  plus cache, TwelveLabs unavailable, OpenAI attempt denied, Strands implemented
  without successful inference, Wake manual coaching fallback.
- D-014 releases the five clock-aligned Pegasus observations for a post-freeze
  rebuild. The existing recorded take remains governed by D-013 until the
  replacement path passes complete verification.
