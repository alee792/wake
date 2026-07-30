# Data and Jockey Intelligence Lieutenant Status

Last updated: 2026-07-30 20:25 PDT
Current phase: Focused Jockey investigations complete (MCP)
State: active

## Completed

- Ran the focused Jockey output-gap comparison directly with TwelveLabs Python
  SDK 1.3.1 against knowledge store
  `ks_019fb490-1e6c-7362-95c9-d61e14d6a835`, explicitly selecting only
  full-workout item `ksi_019fb4aa-4dce-7690-828f-c83868674a78`.
- Preflight verified the selected item was `ready` and matched expected asset
  `6a6bb004c1ac59f5d1d0c0a8`. No store, item, or asset was created; no video was
  uploaded.
- Saved the complete request and SDK response at
  `artifacts/twelvelabs/jockey-output-gap-response.json`.
- Jockey response `resp_019fb4bf-82b5-7d80-baa3-f5b9107f370a` completed in fresh
  session `sess_019fb4bf-82ab-73c1-a8a3-c34169e4e53a`. Its only cited vref UUID
  was `019fb4aa-4dce-7690-828f-c83868674a78`, matching the selected full-workout
  item and excluding the side-view clip.
- Output-gap result: for both `08:45–09:05` and `17:05–17:30`, Jockey separately
  addressed recovery, hands-away timing, body preparation, seat-handle
  sequencing, forward reach/visible stroke length, and stroke-to-stroke rhythm.
  It found no reliable visible category difference and concluded the ~58 W gap
  was **unresolved** from the fixed frontal view. It cited depth compression,
  overlapping motion paths, absence of a side profile, and insufficient
  frame-level timing as limitations.
- Read the complete Data/Jockey role prompt, all canonical product/architecture/
  design/demo documents, Pegasus handoff, graph contract, and coordination hub.
- Claimed this status file.
- Published the exact Pegasus manual-paste target:
  `artifacts/twelvelabs/pegasus-pasted-output.json`.
- Published a contract-valid fixture stub at
  `artifacts/data/replay-fixture.stub.json` and normalized source artifact at
  `artifacts/data/concept2-normalized.json`.
- Added a raw-preserving Pegasus validator and the current Jockey lifecycle for
  selected ready assets, one knowledge store, item polling, one structured narrow
  response, and separate raw/normalized output.

## In Progress

- Both focused investigations now complete via Jockey MCP (see below). Candidate-
  events query not run per instruction — Pegasus supplies broad discovery.
- Hero recurrence query (18:10–18:36) deferred per user instruction.

### Investigation #1 (MCP): Window Comparison 08:45–09:05 vs 17:05–17:30

- Run via `mcp__jockey__jockey_query` against full-workout item
  `ksi_019fb4aa-4dce-7690-828f-c83868674a78`.
- Session: `sess_019fb4bf-23eb-7191-a24a-cb1bb0867ab2`
- Result: **UNRESOLVED**. Front-on camera cannot resolve visible difference between
  157W/29.8spm and 215W/30.4spm windows. Both appear as steady rhythmic rowing.
  High confidence in the unresolved verdict. Limitations: front-on angle weak for
  slide timing, body swing, handle arc; direct vision analysis tool failure.
- Corroborates the prior Python SDK run (`resp_019fb4bf-82b5-7d80-baa3-f5b9107f370a`).

### Investigation #2 (MCP): Interval-Start Settling (Work 1–4, focus Work 3)

- Run via `mcp__jockey__jockey_query` against same item.
- Session: `sess_019fb4bf-21ae-7650-bfa3-941b4d8fc150`
- Result: **UNRESOLVED**. Jockey cannot resolve per-stroke settling counts. Video-
  analysis tool failed repeatedly; metadata too coarse for stroke counting. Work 3
  area shows drink/watch check before resuming, but settling stroke count is not
  determinable.
- Coarse citation: `11:25–14:07` for Work 3 transition area.
- This query reached a tool-level limitation, not a camera-angle limitation.

## Files Owned

- This status file
- Proposed non-overlapping ownership pending captain approval:
  - `artifacts/data/**` — normalized telemetry, interval summaries, insight input.
  - `artifacts/media/**` — local posters/clips and Replay-to-media mappings.
  - `artifacts/twelvelabs/**` — raw Pegasus paste, separate curation, Jockey raw
    and normalized artifacts.
  - `scripts/data/**` and `scripts/twelvelabs/**` — builders and validators.

## Files Changed

- `coordination/status/data-jockey-intelligence.md`
- `scripts/data/build-wake-data.mjs`
- `scripts/twelvelabs/validate-pegasus.mjs`
- `scripts/twelvelabs/run_jockey.py`
- `artifacts/data/concept2-normalized.json`
- `artifacts/data/replay-fixture.stub.json`
- `artifacts/media/source-inventory.json`
- `artifacts/twelvelabs/README.md`
- `artifacts/twelvelabs/jockey-selected-assets.example.json`
- `artifacts/twelvelabs/pegasus-curation.example.json`
- `artifacts/twelvelabs/jockey-raw-response.json` (updated — MCP queries)
- `artifacts/twelvelabs/jockey-observation.json` (new — normalized observations)
- `artifacts/twelvelabs/jockey-capability-summary.md` (new)
- `artifacts/twelvelabs/jockey-handoff-prompt.md` (new)
- `.claude/settings.json` (new — auto-allow all jockey MCP tools)

## Verification

- SDK selection used
  `ResponseSelection(kind="item", id="ksi_019fb4aa-4dce-7690-828f-c83868674a78")`
  and referenced `{{sel:0}}` in both instructions and the user message.
- Saved response status is `completed`; its two vrefs cite `08:45–09:05` and
  `17:05–17:30` on only the selected full-workout item UUID.
- Required canonical documents and all role status files read.
- Source files discovered: one Concept2 CSV, TCX, FIT; no local video file is
  currently present.
- Normalizer verified 761 records, four reset blocks, globally sorted telemetry,
  eight contiguous phases covering `0..1680`, and candidate bounds wholly inside
  Work 2 and Work 3.
- Fixture stub shape checked with `jq`; JavaScript syntax checks and Python compile
  checks pass.
- Candidate window summaries:
  - `08:45..09:05` (Work 2): 10 samples, 157.3 W, 29.8 spm.
  - `17:05..17:30` (Work 3): 12 samples, 215.3 W, 30.4 spm.
- Drive metadata confirms the 4.26 GB full-session source exists, but connector
  download is not viable. The accessible 109,066,678-byte clip exceeds the
  connector's 100 MiB download cap by 4,209,078 bytes; the other linked short-file
  IDs currently return not found.

## Blockers and Risks

- Investigation #2 cannot be run faithfully because its task specification was
  absent from the received message. Do not infer or substitute a different
  investigation.
- TwelveLabs documents item selections as a strong prompt-level restriction, not
  a hard access boundary. This run mitigated that limitation through repeated
  selected-item instructions and post-run citation validation; all returned
  vrefs matched the selected full-workout item.
- No pasted Pegasus result exists yet; no Pegasus claims will be emitted.
- No local source video exists yet. Poster fallback becomes critical if no usable
  clip is available by T+0:45.
- Jockey requires selected media assets and credentials; implementation proceeds,
  but visible provenance will be cut unless a real cited response is captured.
- The candidate averages above locate review windows only; they are not evidence
  of a technique pattern or causal claim.

## Messages to Team

- To project owner / Integration Captain (13:41 PDT): focused full-workout Jockey
  output-gap run completed with full-workout-only citations. Result is
  **unresolved**; do not claim a visible mechanism for the ~58 W difference.
  Raw request/response and provenance are in
  `artifacts/twelvelabs/jockey-output-gap-response.json`.
- To project owner: resend the omitted specification for focused investigation
  #2. The received prompt stopped within investigation #1 and contained no second
  query definition.
- To Integration Captain (12:31:37 PDT): approve the proposed directory ownership
  above and freeze global time as integer/decimal elapsed seconds from workout
  start, inclusive start/exclusive end, valid range `0..1680`; TCX phase bounds are
  canonical and CSV reset rows normalize as
  `globalSeconds = localSeconds + blockIndex * 420`.
- To project owner / Integration Captain: paste the unchanged real Pegasus envelope
  at `artifacts/twelvelabs/pegasus-pasted-output.json`. Expected envelope and
  validation are exactly those in
  `docs/twelvelabs-pegasus-full-video-analysis.md`: five unique coverage windows,
  `finalObservedTimestamp >= 27:00`, finish reason `stop`, and every moment within
  `0..1680`.
- Pegasus pasted-output path: `artifacts/twelvelabs/pegasus-pasted-output.json`
- Pegasus task/generation IDs when supplied:
- Selected highlight windows: pending measured telemetry verification and video.
- Selected highlight windows: provisional `08:45..09:05` (Work 2) and
  `17:05..17:30` (Work 3), both telemetry-verified and still video-pending. The
  second includes a directly measured transition around `17:14.5..17:22.2` where
  recorded rate moves from 29 to 32 spm while watts move from 225 to 199–216 W;
  do not narrate until video review and comparison windows are frozen.
- Jockey knowledge-store state: integration ready but not executed; no selected
  local/ready clip asset IDs or API credential available.
- To Integration Captain: ownership is now confirmed on the board. Please consume
  `artifacts/data/replay-fixture.stub.json` as the immediate data stub. Keep all
  Jockey UI/provenance hidden unless `jockey-observation.json` comes from a real
  completed call.
- To Replay UI: the contract-valid stub intentionally contains zero events because
  video review is pending. Candidate IDs and measurements are in
  `artifacts/data/concept2-normalized.json`; do not turn them into a visual or
  technique claim. `artifacts/media/source-inventory.json` truthfully exposes an
  empty mapping list and the poster/video blocker.
- To project owner: provide either local selected clips under `artifacts/media/`
  or two/three ready TwelveLabs selected-clip asset IDs in
  `artifacts/twelvelabs/jockey-selected-assets.json`; do not send credentials in
  coordination files.

## Decision Needed From Captain

- None. Captain has confirmed directory ownership and global-time convention.

## Next Actions

- Hero recurrence query (18:10–18:36) available on demand — deferred per user
  instruction; do not run without explicit request.
- Candidate-events query skipped — Pegasus already supplies broad discovery.
- Side-view clip (`ksi_019fb493-9535-7e00-905e-9e0e10563241`, 43s) is indexed and
  could be queried for the specific angle limitations identified above.

## ETA

- Both focused investigations complete. No pending work unless new queries are
  specified or hero recurrence is unblocked.

## Corrected Pegasus Handoff — 13:43 PDT

- Canonical evidence is regenerated and ready:
  `artifacts/twelvelabs/pegasus-normalized-evidence.json`.
- Clock calibration:
  `artifacts/twelvelabs/video-concept2-alignment.json`.
- Mapping: `workoutSeconds = videoSeconds + 31.089`, estimated uncertainty ±0.7 s.
- Three corrected aligned runs are preserved under
  `artifacts/twelvelabs/runs/20260730-1335*/`.
- Earlier unshifted comparisons remain archived but are explicitly excluded from
  canonical evidence.
- Five canonical `ProviderObservation` records are ready: three unresolved visual
  or restart-count observations and two athlete-confirmed hydration markers.
- Hydration video times `11:08–11:16` and `25:17–25:27` map to workout-global
  `11:39.1–11:47.1` and `25:48.1–25:58.1`.
- Hero synthesis lead: Concept2 shows about 157 W at 29.8 spm versus 215 W at
  30.4 spm; aligned Pegasus cannot resolve a visible difference. Any
  pressure/connection explanation remains a labeled hypothesis.
- Rejected: identical mechanics, core engagement, exact restart-stroke count,
  causal hydration language, and cross-modal claims from unshifted runs.
- Validation command:
  `node scripts/twelvelabs/validate-normalized-evidence.mjs`.
- Captain action: validate the artifact, finalize D-014, then release Neo4j and
  Replay/Integration ingestion.
