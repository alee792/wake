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

- State: original recording complete; post-freeze evidence integration on hold
- Current phase: Pegasus source-clock realignment pending
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

## Current Hero Story

- Workout: 4 × 4:00 work / 3:00 recovery
- Date: July 30, 2026
- Hero window: `08:45–09:05` (Interval 2; telemetry verified)
- Comparison window: `17:05–17:30` (Interval 3; telemetry verified)
- Headline: “Rate rose without preserving power in the Work 2 candidate.”
- Drill: “Hold pressure before building rate” (manual, provisional)

## Post-Freeze Pegasus Evidence Handoff

- Integration state: **HOLD — no downstream ingestion**
- Canonical target:
  `artifacts/twelvelabs/pegasus-normalized-evidence.json` (being regenerated)
- Source-clock mapping:
  `workoutSeconds = videoSeconds + 31.089` with estimated uncertainty `±0.7s`
- Clock anchors: TCX workout start `13:35:00Z`; estimated video start
  `13:35:31.089Z`.
- Video hydration markers `11:08` and `25:17` map to Replay/Concept2 times
  approximately `11:39.1` and `25:48.1`.
- Earlier Pegasus interval comparisons used unshifted timestamps and are invalid
  for integration.
- Corrected aligned passes are processing. Neo4j, Replay, coaching, provenance,
  narration, and recording owners must wait for the regenerated artifact and
  final D-014.

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
- Pegasus/Jockey source-clock alignment is unresolved. Earlier unshifted provider
  observations must not enter the graph, fixture, coaching, provenance, or
  narration. Await the regenerated normalized artifact and final D-014.

## Current Cut Decisions

- Recording is offline and opens on `/` with the hero preselected.
- No uploads, loading experience, generic chat, graph explorer, agent console, authentication, or live recording-time sponsor calls.
- Jockey is invisible unless a real cited artifact is ready by T+1:40.
- Pegasus is invisible unless the supplied raw real-API artifact validates by T+2:30.
- Optional polish stops at T+2:30; recording preparation cannot slip past T+3:15.
- D-013 freezes the final truthful inventory: Concept2 derived, Neo4j live-local
  plus cache, TwelveLabs unavailable, OpenAI attempt denied, Strands implemented
  without successful inference, Wake manual coaching fallback.
- D-014 is pending and enforces a downstream integration hold. The existing
  recorded take remains governed by D-013.
