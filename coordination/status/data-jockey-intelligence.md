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

### Investigation #3 (MCP): Hypothesis-Driven Comparison (front-on)

- Run via `mcp__jockey__jockey_query` with 5 specific visual hypotheses.
- Session: `sess_019fb4c7-e551-74a3-93bc-601629695ca9`
- Result: **ALL UNRESOLVABLE**. Layback, stroke arc, seat shooting, torso snap,
  recovery ratio all require fine frame-level motion cues the front-on view cannot
  provide. Confirms the camera-angle limitation definitively.

### Investigation #4 (MCP): Side-View Technique Analysis — RESOLVED

- Run via `mcp__jockey__jockey_query` against side-view clip
  `ksi_019fb493-9535-7e00-905e-9e0e10563241` (43s).
- Session: `sess_019fb4cf-caf8-79f0-8d2f-fde086fcf7eb`
- Result: **RESOLVED — 4 technique observations with coaching relevance.**
  1. Layback: moderate ~10-15° past vertical, consistent (good)
  2. Drive sequence: **back opens early** — simultaneous with legs (coaching opp)
  3. Recovery sequence: **seat starts sliding early** — no crisp separation (coaching opp)
  4. Catch position: good compression, shins ~vertical (good)
  5. Handle height: small dip at knee transition (minor)
  6. Rhythm: recovery visibly slower than drive (good ratio)
- Key insight: findings #2 and #3 are exactly the patterns that worsen during
  rate-chasing episodes (when rate rises but power falls). This connects the
  Jockey video observation to the Concept2 telemetry event.
- Caveat: side-view clip is from cooldown — technique under peak load may differ.

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

### Investigation #5 (MCP): Athlete Verbal Goals and Gesture Bookmarks

- Searched for verbal goal statement ("keep split under 2:15") near Work 4 start
  (video-local 20:10–20:55).
- Audio search returned ranked hits but `transcription: null` on all.
- `jockey_query` audio-analysis tool failed on this file — metadata-only fallback.
- One low-confidence possible utterance: "I'm just gonna keep this in." — does not
  match target phrasing.
- Gesture scan: no deliberate camera-directed gestures found in any rest period or
  start/end of recording. Two passes (finger-count + any acknowledgment) both
  returned zero candidates.
- **Final verdict: UNRESOLVED** — both verbal goal and gesture bookmarks.
- Sponsor limitation filed: `coordination/feedback/twelvelabs-audio-analysis-limitation.md`
- Raw archive: `artifacts/twelvelabs/runs/20260730-athlete-notes-bookmarks/`
- Curated result: `artifacts/twelvelabs/athlete-notes-bookmarks.json`

## Next Actions

- Hero recurrence query (18:10–18:36) available on demand — deferred per user
  instruction; do not run without explicit request.
- Candidate-events query skipped — Pegasus already supplies broad discovery.
- Audio transcription requires external tool (Whisper/AssemblyAI) if verbal goals
  are needed for the demo — Jockey cannot provide this currently.
- Side-view clip (`ksi_019fb493-9535-7e00-905e-9e0e10563241`, 43s) is indexed and
  has been queried for technique observations (Investigation #4).

## ETA

- All requested investigations complete. No pending work unless new queries are
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
- Captain action: D-014 is final; Neo4j and Replay/Integration ingestion are
  released for the five canonical observations.

## Replay Technique Integration — 14:05 PDT

- The generated Replay fixture now consumes the approved
  `pegasus-interval-2-vs-3-visual-unresolved` observation directly from
  `pegasus-normalized-evidence.json`.
- The hero evidence drawer now pairs the Concept2 rate/power measurement with
  the clock-aligned Pegasus limitation. No component or style files changed.
- Reviewed Wake coaching now uses the cue “Protect the recovery sequence before
  adding rate” and the observable sequence “hands away, body over, then slide.”
- Recovery timing is explicitly a Wake coaching hypothesis, not a Pegasus
  diagnosis. Wrist position, pressure/connection, and causal mechanics remain
  unmeasured.
- The separate 43-second Jockey side-view cooldown observations remain in
  `jockey-observation.json` but are not attached to the 28-minute Replay clock.
- Verification passed: graph tests, Strands validation tests, CoachOutput
  evidence validation, TypeScript compilation, and production build.

## Reviewed Local Media Handoff — 14:12 PDT

- Ready for Replay UI:
  `artifacts/media/replay-media-manifest.json`.
- Created `wake-hero-work2.mp4` and `.jpg`: 24.021333 s, 1280×720,
  H.264/yuv420p with AAC, 15,014,786 bytes. MP4 SHA-256
  `c0f751c2963daf9cbdbba75cbf1065d4a587860eeb404735dc4d03372ae621a4`;
  poster SHA-256
  `17b2edfb41dbb9c3363ec509d695da4b5efdc257a0bd5b5e55756758be46caf5`.
- Created `wake-comparison-work3.mp4` and `.jpg`: 29.021333 s, 1280×720,
  H.264/yuv420p with AAC, 19,152,073 bytes. MP4 SHA-256
  `d6936dba1caccb7ca44155121cb565fe7104a12be417faa794f6a3500fad13f2`;
  poster SHA-256
  `c0d2d4c2d007192f0bb46b46c6ee984bf0be4a3e203a68919176f00f83cef85c`.
- FFprobe durations are within 0.022 s of target. Both files decode completely
  using only the local-file protocol; no malformed timestamp errors were found.
- Human visual review passed at each clip beginning, approved evidence start,
  focus, approved evidence end, and clip ending. Both clips show the intended
  continuous rowing windows; both posters are suitable.
- Clock conversion and bounds validate against
  `workoutSeconds = videoSeconds + 31.089 (±0.7 s)`.
- Limitation: clips are synchronized evidence media only. D-014 and the rebuilt
  Neo4j bundle remain authoritative for claims.
- **Replay UI: the reviewed local media handoff is ready.** Consume only the two
  mappings in `replay-media-manifest.json`; no signed HLS URL is persisted.

## Autonomous Cross-Angle Pivot — 14:21 PDT

- Fresh Jockey response completed against the entire knowledge store
  `ks_019fb490-1e6c-7362-95c9-d61e14d6a835`.
- The request supplied no `selections` parameter, source name, item ID, or
  side-view hint. Jockey independently selected and cited
  `ksi_019fb493-9535-7e00-905e-9e0e10563241`.
- Response `resp_019fb4e6-42c4-7d31-8351-d8104c465ad5`; session
  `sess_019fb4e6-42c0-7373-85f3-f25d560007ef`.
- Accepted clip-local citations: `00:00–00:13` and `00:13–00:43`.
- Direct observation: leg-led drive with torso opening while the legs are still
  extending and a later arm draw; near-vertical shins, mostly level handle path
  with a slight recovery dip, and a brief finish pause were also visible.
- Interpretation is hypothesis-only: drive sequencing and finish timing are
  candidate mechanisms worth investigating. Jockey explicitly returned that
  this does not prove the pattern occurred in the hero/comparison windows and
  does not prove causation for the approximately 58 W gap.
- Complete archive:
  `artifacts/twelvelabs/runs/20260730-212016-autonomous-cross-angle/`.
- Canonical handoff:
  `normalized-supplemental-context.json`; timestamp basis is `clip-local`.

## Side-View Local Media — 14:21 PDT

- Added the complete side-view source to
  `artifacts/media/replay-media-manifest.json` under `supplementalMedia`, never
  workout-global `mediaMappings`.
- `wake-sideview-candidate-mechanism.mp4`: 43.281683 s, 1280×720,
  H.264/yuv420p with AAC, 26,051,155 bytes, SHA-256
  `22de1dd28bfecdbfefde113fbc4146aa589e46ea8c45a334f9024734334e2eca`.
- Poster SHA-256:
  `0bf091256f67ea6dfa8b7d22eebc3f903bcf17a0176b6270b19fb222fb9d2e0a`.
- Full local decode and five-frame visual review passed. The final frames show
  rowing ending and the athlete reaching toward the camera, consistent with a
  complete source rather than a truncated clip.
- **Captain, Neo4j, Bedrock, and Replay:** both the reviewed local-media package
  and autonomous Jockey supplemental-context artifact are ready. Cross-reference
  the side angle as independently selected supporting context; preserve its
  clip-local clock and the explicit non-causal/non-occurrence limitation.

## D-017 Goal and Flag Media Handoff — 15:07 PDT

- Added two `human-reviewed` records under `athleteEventMedia` in
  `artifacts/media/replay-media-manifest.json`.
- Goal clock conflict resolved by reviewing both requested source windows. The
  canonical athlete-verified statement is in the later window at video-local
  `21:25.000` (`1285s`), calibrated to Replay `21:56.089`
  (`1316.089s`). The Work 4 start candidate around video `20:28.911` was not
  selected.
- Goal package:
  `artifacts/media/athlete-marks/wake-goal-work4-split-target.mp4` and `.jpg`;
  source cut `1279–1291s`, focus offset `6s`, duration `12.021333s`,
  1280×720 H.264/yuv420p with AAC. MP4 SHA-256
  `9bed74497e76c2612f739edfaaaeef2d9e5c8e1af7e84343a65d2ff3ce0cbeb3`;
  poster SHA-256
  `f15bef9f6b6e1ebc08b357a5b178e04565fa27f96c1cdb72e9203f3e3e9ee736`.
- Flag package:
  `artifacts/media/athlete-marks/wake-flag-work3-rest-finger1.mp4` and `.jpg`;
  source cut `1143–1152s`, event time video `19:07.000` / Replay
  `19:38.089`, poster focus offset `4.7s`, duration `9.021333s`,
  1280×720 H.264/yuv420p with AAC. MP4 SHA-256
  `0691912e2c99ac2979fb3b3bb3a89298058de12009766f1b72b9bdce619fef1e`;
  poster SHA-256
  `91d9897e4593e12834610e1c91912ca40ad4ca998214fe6a7424a772f78bd766`.
- Visual review passed across each clip start, focus, and end. The Flag poster
  clearly shows the raised right index finger; the Goal poster shows the athlete
  speaking. Both audio tracks are present and non-silent.
- Jockey and local system transcription remained unavailable. The Goal wording
  “Keep the split under 2:15” retains athlete-verified manual transcription
  provenance. Both events explicitly record `jockeyDetected: false`.
- Both MP4s decode completely using only the local-file protocol. Hash, clock,
  bounds, codec, dimensions, duration, poster, JSON, and manifest validation
  passed.
- **Replay UI:** D-017’s reviewed Goal and Flag media handoff is ready. No UI
  files were modified.

## D-018 Five-Insight Media Handoff — 15:24 PDT

- Added a reviewed `insightMedia` section to
  `artifacts/media/replay-media-manifest.json` covering all five exact D-018
  insight IDs. All prior media mappings, supplemental media, Goal/Flag records,
  evidence boundaries, and hashes are preserved.
- New Work 2 opening context:
  `artifacts/media/insights/wake-insight-work2-progressive-opening.mp4` and
  `.jpg`; Replay `420–450`, source `388.911–418.911`; MP4 SHA-256
  `378932a01d60d52b77ccf83eb168af75477508f17f98e50e10303ad2651b2eb5`;
  poster SHA-256
  `7dbca824cfd4004ae5296267c92156294a07f86fc0b20eb2bc362b9ded32c8ef`.
- New Work 2 closing context:
  `artifacts/media/insights/wake-insight-work2-progressive-closing.mp4` and
  `.jpg`; Replay `630–660`, source `598.911–628.911`; MP4 SHA-256
  `c4c8a47032bae431c6fba37971bbfd39fb22ca104636512bd65b209a7e16a7de`;
  poster SHA-256
  `4d2ae448437f3478db37a343b26fc7b517f79a799a02d14feffdf7f6e4c72e00`.
- New Work 3 opening baseline:
  `artifacts/media/insights/wake-insight-work3-surge-baseline.mp4` and `.jpg`;
  Replay `840–870`, source `808.911–838.911`; MP4 SHA-256
  `2c8c564254bc06e85e0709dcfd90e52ce54b1a9c6630de303d9b3f1d1bcb4299`;
  poster SHA-256
  `186b142913b29dbaf835a8e37d86e6064927bda501eaa4b5565d9fe201a01f48`.
- New Work 4 finish context:
  `artifacts/media/insights/wake-insight-work4-finish-context.mp4` and `.jpg`;
  Replay `1455–1485`, source `1423.911–1453.911`; MP4 SHA-256
  `f841e745e6181e9498e5797edabc9d14e56f0911b4ab53f2639e4f9905ef6ab5`;
  poster SHA-256
  `6b18c3c6ef7b0b3199584af46ea44825eb41b496c3d29ba2bb65d6e44184bebb`.
- Every new clip is `30.021333s`, 1280×720 H.264/yuv420p with AAC. Beginning,
  midpoint/poster, and ending frames were visually reviewed and show continuous
  rowing in the intended windows. Full local-only decode passed.
- Reuse mappings:
  `insight-work3-late-surge` reuses `media-work3-comparison` for its late
  window; `insight-sub215-goal-achieved` reuses
  `goal-work4-split-target`; `insight-similar-rate-different-output` reuses
  `media-work2-hero` and `media-work3-comparison`. No duplicate MP4s were made.
- Validator:
  `node scripts/data/validate-insight-media.mjs`.
  Result: five insight IDs exactly match `graph/cache/insight-collection.json`;
  four new clips and posters pass path, size, SHA-256, alignment, duration,
  codec, audio, dimensions, reference resolution, and offline-decode checks.
- Source-quality limitation: the fixed front view is synchronized visual context
  only. It does not prove the deterministic telemetry classifications or their
  causes. The Work 3 reused late clip covers Replay `1025–1050`, not the entire
  fourth minute. Alignment uncertainty remains ±0.7s.
- **Integration Captain and Replay UI:** the complete reviewed D-018 local-media
  package is ready through `insightMedia`. No Neo4j, D-014/D-015, or Replay UI
  files were modified.
