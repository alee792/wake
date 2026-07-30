# Jockey Findings Handoff — For Coordinator

## TL;DR

Jockey MCP delivered **resolved technique observations from the side-view** and
**honest "unresolved" results from the front-view** that bound what video can
contribute. Additionally, we have **two athlete-authored marks** (verbal goal +
finger bookmark) manually verified after Jockey's audio/gesture detection failed.

---

## 1. Side-View Technique Observations (RESOLVED)

Source: `ksi_019fb493-9535-7e00-905e-9e0e10563241` (43s side-view clip)

| # | Finding | Assessment | Confidence |
|---|---------|-----------|------------|
| 1 | Back opens early on drive — simultaneous with legs | Coaching opportunity | 0.75 |
| 2 | Seat starts sliding early on recovery — no crisp separation | Coaching opportunity | 0.70 |
| 3 | Handle dip at knee transition | Minor | 0.60 |
| 4 | Recovery visibly slower than drive (good ratio) | Positive | 0.80 |

**Why this matters:** Findings #1 and #2 are exactly the patterns that worsen
during rate-chasing — when telemetry shows rate rising but power dropping, the
mechanism is these patterns amplifying under fatigue.

### Demo Narrative

The "Ask Wake" answer should frame this as cross-angle investigation:

> "The front camera can't resolve the difference, but the side-view clip shows
> two patterns consistent with rate-chasing: the back opens early on the drive,
> and the seat starts sliding before the hands are fully away on recovery
> (visible at 0:04–0:08 in the side view). Under fatigue, both compress further
> — rushing the recovery to hit a higher rate at the expense of connection and
> power transfer."

### Playback Citations

- Drive sequence: `HLS#t=4,5`, `#t=7,8`, `#t=30,31`
- Recovery sequence: `HLS#t=3,4`, `#t=6,7`, `#t=31,32`
- HLS base: private provider delivery URL intentionally omitted from the public repository

---

## 2. Front-View Comparisons (UNRESOLVED — Valuable Negative)

Source: `ksi_019fb4aa-4dce-7690-828f-c83868674a78` (28-min front-view)

- Window comparison (08:45 vs 17:05): **Unresolved** — front-on camera cannot
  distinguish 157W from 215W at identical stroke rate.
- Hypothesis-driven (5 specific cues): **All unresolvable** from this angle.
- Interval-start settling: **Unresolved** — tool-level limitation on per-stroke
  analysis.

**Use in demo:** These prove that telemetry is the authoritative signal for power
changes, and that a different camera angle (side-view) was needed. This is the
"Jockey investigated, found the front angle insufficient, then searched
supplemental footage" narrative.

---

## 3. Athlete-Authored Marks (MANUALLY VERIFIED)

Jockey's audio transcription and fine gesture detection both failed on this file.
These timestamps were **manually confirmed by the athlete**:

### Verbal Goal

| Field | Value |
|-------|-------|
| Statement | "Keep the split under 2:15" |
| targetSplitSeconds | 135 |
| Attached to | Work 4 |
| Video-local | **21:25** |
| Workout-global | ~1316s (21:56) |
| Source | Athlete-verified (Jockey audio failed) |

### Finger Bookmark

| Field | Value |
|-------|-------|
| Gesture | Right hand index finger raised |
| fingerCount | 1 |
| Video-local | **19:07** |
| Workout-global | ~1178s (19:38) |
| Context | End of Work 3 / start of last rest |
| Source | Athlete-verified (Jockey visual failed) |

### How to Use in Demo

These are "athlete attention markers" — personal bookmarks the athlete dropped
during the recording. The finger gesture at 19:07 marks the end of Work 3 (where
the rate-chasing pattern occurred). The verbal goal before Work 4 shows intent
to hold 2:15 pace. Together they frame the coaching story:

> "You marked this moment yourself (19:07), then set a goal of sub-2:15 for the
> next interval (21:25). Let's see what happened..."

---

## 4. What to Wire Into the Static Fixture

### Observations (from Jockey)

```json
{
  "id": "jockey-sideview-drive-sequence-001",
  "provider": "twelvelabs-jockey",
  "kind": "technique",
  "statement": "Back opens early on drive",
  "startSeconds": 4,
  "endSeconds": 8
}
```
```json
{
  "id": "jockey-sideview-recovery-sequence-001",
  "provider": "twelvelabs-jockey",
  "kind": "technique",
  "statement": "Early slide on recovery",
  "startSeconds": 3,
  "endSeconds": 7
}
```

### Athlete Marks (manually verified)

```json
{
  "id": "goal-work4-split-target",
  "type": "goal",
  "statement": "Keep the split under 2:15",
  "targetSplitSeconds": 135,
  "attachedTo": "Work 4",
  "workoutGlobalSeconds": 1316.089,
  "videoLocalTimestamp": "21:25",
  "reviewStatus": "manually-flagged-by-athlete"
}
```
```json
{
  "id": "bookmark-work3-rest-finger1",
  "type": "bookmark",
  "fingerCount": 1,
  "hand": "right",
  "workoutGlobalSeconds": 1178.089,
  "videoLocalTimestamp": "19:07",
  "reviewStatus": "manually-flagged-by-athlete"
}
```

---

## 5. Sponsor Limitations (Filed)

- **Audio transcription**: `jockey_search` audio modality returns hits but
  `jockey_query` cannot transcribe. Filed at
  `coordination/feedback/twelvelabs-audio-analysis-limitation.md`
- **Fine gesture detection**: Cannot distinguish intentional finger gestures from
  normal rest behavior at current resolution.
- **Front-on technique comparison**: Camera angle limitation (not a Jockey bug).

---

## 6. Source Artifacts

| File | Content |
|------|---------|
| `artifacts/twelvelabs/jockey-raw-response.json` | All query responses |
| `artifacts/twelvelabs/jockey-observation.json` | Normalized ProviderObservations |
| `artifacts/twelvelabs/athlete-notes-bookmarks.json` | Curated athlete marks |
| `artifacts/twelvelabs/runs/20260730-athlete-notes-bookmarks/` | Raw investigation archive |
| `coordination/feedback/twelvelabs-audio-analysis-limitation.md` | Sponsor bug |

## 7. Caveats

- Side-view clip is from cooldown (last 43s), not the target work windows
- "These patterns worsen under rate-chasing" is coaching inference — attribute to
  Wake's coaching layer, not to Jockey
- Athlete marks are manually verified — do not claim Jockey detected them
- Offset formula: `workoutSeconds = videoSeconds + 31.089` (±0.7s)

## 8. Knowledge Store Reference

- Store: `ks_019fb490-1e6c-7362-95c9-d61e14d6a835`
- Front-view item: `ksi_019fb4aa-4dce-7690-828f-c83868674a78`
- Side-view item: `ksi_019fb493-9535-7e00-905e-9e0e10563241`
- Sessions: `sess_019fb4cf-caf8-79f0-8d2f-fde086fcf7eb` (side-view technique),
  `sess_019fb4f0-8eab-7cc3-9b5a-76f18f6083b9` (gestures),
  `sess_019fb4f5-ad81-7c61-9262-89960c870aaf` (audio)
