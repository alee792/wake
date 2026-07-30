# Replay UI Lieutenant Status

## Demo-Facing Build Story — 2026-07-30 15:06 PDT

- Reworked the bottom provenance drawer from a technical manifest dump into a
  polished four-move demo story:
  1. synchronize Concept2 telemetry and reviewed video;
  2. add TwelveLabs visual context and connect evidence in Neo4j;
  3. orchestrate guarded coaching synthesis with Strands/OpenAI;
  4. package the reviewed Replay locally for instant playback.
- New drawer headline: “From a full workout to one coach-ready story.”
- Preserved the four sponsor roles as concise, presentation-ready cards and made
  the offline payoff explicit.
- Kept a secondary expandable build receipt for exact service, execution mode,
  and disposition. It truthfully distinguishes accepted TwelveLabs/Neo4j work,
  the validated Wake manual fallback, implemented Strands workflow, and the lack
  of an accepted OpenAI model output.
- Chrome verified the expanded story, receipt interaction, zero external
  resources, and clear lower-page flow.
- Screenshot: `artifacts/recording/replay-provenance-showcase.jpg`.
- `npm test` and `npm run build` pass.

## Configured Heart-Rate Track and Zones — 2026-07-30 14:57 PDT

- Added heart rate as a third Replay time-series track using all `761` recorded
  Concept2 HR samples (`85–179 BPM`).
- Added the athlete-supplied zone profile as configurable Replay surface data:
  - Z1 Very Light: `93–112 BPM`
  - Z2 Light: `112–130 BPM`
  - Z3 Moderate: `130–149 BPM`
  - Z4 Hard: `149–167 BPM`
  - Z5 Maximum: `167–186 BPM`
- Values below `93 BPM` remain visible below Z1 and are not mislabeled.
- Each band is visibly shaded and labeled; its accessible SVG title includes the
  supplied zone name and training purpose. The chart labels these as configured
  athlete zones with a configured maximum of `186 BPM`.
- Hover now includes the zone name. Chrome at Replay `8:56.2` showed `151 BPM ·
  Z4 Hard` alongside watts, SPM, and split.
- Chrome confirmed five zone bands, all exact thresholds, 761 rendered HR path
  points, completed hero opening state, and the previously fixed lower-page flow.
- Screenshot: `artifacts/recording/replay-hr-zones.jpg`.
- `npm test` and `npm run build` pass.

## Bottom Layout Flow Fix — 2026-07-30 14:49 PDT

- Removed the fixed lower-card height that allowed Work 4 and the next-session
  success criterion to paint over the provenance drawer on short viewports.
- The interval and next-session cards now share an auto-sized CSS grid row and
  push provenance down in normal document flow; no coaching content is clipped.
- Chrome at `1408 × 764`: both cards grow to `266px`; Work 4 clears the
  provenance drawer and the success criterion remains inside its card.
- Removed the permanent “Hover for split · watts · SPM · HR” instruction at the
  user’s request. Hover metadata remains available without the extra header copy.
- Production build passes after the layout correction.

## Timeline Telemetry Hover — 2026-07-30 14:42 PDT

- Confirmed Concept2 heart rate is present in every normalized telemetry sample:
  `761 / 761`, ranging from `85–179 BPM`. Replay previously discarded it before
  the UI adapter, so HR was not visible.
- Added a supplemental typed telemetry adapter without changing the frozen
  `ReplayFixture` contract. The Replay surface now receives heart rate and split
  alongside watts and stroke rate.
- Hovering anywhere over the shared timeline resolves the nearest actual
  Concept2 sample and displays Replay time, instantaneous watts, SPM, BPM, and
  split per 500 m. A compact header hint makes the interaction discoverable.
- The hover guide uses the same SVG coordinate transform as seeking and does not
  mutate Replay state. Click and granular drag seeking remain intact.
- Chrome check near Replay `8:54`: tooltip showed sample time `8:54.2`,
  `158 W`, `30.0 SPM`, `152 BPM`, and split `2:10.4 /500m`. Clicking the same
  position moved the shared Replay clock to `8:54.6`.
- `npm test` and `npm run build` pass after the telemetry metadata addition.

## D-015 Ask Wake and Athlete Marks — 2026-07-30 14:34 PDT

- Added a compact Ask Wake trigger without changing the completed hero opening
  state. The prepopulated question is “Why was output so different at nearly the
  same stroke rate?”
- No validated real/cached-real Bedrock response exists under
  `artifacts/strands-openai/`, so the visible state is honestly “Answer pending.”
  The optional artifact adapter accepts only an `ask-wake*.json` handoff with
  OpenAI-over-Bedrock provenance, `real-api` or `cached-real-api` execution,
  passed citation validation, human review, a limitation, and cited observation
  IDs. Manual and failed-attempt artifacts cannot render as an answer.
- Packaged the reviewed side-view MP4/poster under
  `app/src/assets/replay-media/`. The copied hashes match the media manifest.
  “View cross-angle evidence” opens this source at its own clip-local clock
  (`0:00–0:43`) with native controls and an explicit non-occurrence/non-causation
  boundary. It is never added to workout-global `mediaMappings`.
- Added discriminated typed athlete `goal` and `bookmark` marks. Both require an
  ID, original video-local time, calibrated workout-global time, confidence,
  review state, and reviewed note. Goals additionally require a typed target;
  bookmarks require a finger count and default to “athlete attention bookmark”
  unless an explicit speech-established meaning is supplied.
- Added an optional artifact adapter using
  `athlete-notes-bookmarks.json`. Only accepted, fully decoded marks reach the
  timeline. Selecting one seeks the Replay-global clock, selects its interval,
  and shows the note plus original/calibrated clocks and review metadata.
- The landed athlete artifact contains zero curated goals and zero gesture
  bookmarks, so production correctly shows no athlete markers. No placeholder
  marks were fabricated.
- Verified the true missing-artifact fallback by temporarily moving
  `athlete-notes-bookmarks.json` out of the matched path: TypeScript and the
  production build still passed with zero marks. The artifact was restored and
  the final build rerun.
- Work 3 is adapted to UI kind `comparison`; Chrome exposes
  “Work 3 connected comparison” and no user-visible “recurrence” text.

## Reviewed Core Media Integration — 2026-07-30 14:23 PDT

- **Complete:** copied the four reviewed hero/comparison files into
  `app/src/assets/replay-media/`; copied hashes exactly match the approved
  manifest.
- Added the two manifest mappings to `app/src/generated/replayFixture.ts`.
  Vite packages every MP4/poster as a hashed same-origin production asset; the
  browser never references `artifacts/`, Drive, HLS, or another external URL.
- `App.tsx` now resolves media from Replay-global time. The initial hero at
  Replay `535s` loads the Work 2 source, seeks to clip-local `12.000s`, and
  remains paused. The Work 3 event at Replay `1037s` switches to the comparison
  source, seeks to clip-local `14.000s`, and remains paused. Returning to the
  hero restores the hero source at `12.000s`.
- Native controls, `playsInline`, reviewed posters, accessible labels, loading
  state, Replay-global clocks, and honest `Estimated alignment ±0.7s` labeling
  remain present.
- Production error-path test passed using a deliberately missing built media
  URL: the video cleanly changed to the reviewed poster and “Video unavailable ·
  poster shown” without changing the media-card height or breaking the hero.
  The valid source was restored and the final production build rerun.
- Opening screenshot with the real hero frame:
  `artifacts/recording/replay-opening-real-media.jpg` (`1408 × 982`, full-page
  Chrome capture).
- Side-view candidate-mechanism media and an Ask Wake answer were not added.

## Data/Jockey Media Handoff — 2026-07-30 14:12 PDT

- Ready: `artifacts/media/replay-media-manifest.json`.
- Both referenced MP4 and poster files exist, are human-reviewed, hashed, and
  validated for local playback.
- Consume the two manifest mappings for the Work 2 hero and Work 3 comparison.
- The clips are synchronized evidence media only; D-014 and the rebuilt Neo4j
  bundle remain authoritative for all claims.

## Autonomous Side-Angle Handoff — 2026-07-30 14:21 PDT

- `replay-media-manifest.json` now includes
  `wake-sideview-candidate-mechanism.mp4` under `supplementalMedia` with
  `timestampBasis: clip-local`.
- Jockey independently selected that source; normalized evidence is at
  `artifacts/twelvelabs/runs/20260730-212016-autonomous-cross-angle/normalized-supplemental-context.json`.
- Show it as the agent’s cross-angle follow-up/candidate mechanism, not as a
  workout-global seek target or proof of what occurred in the hero window.

Last updated: 2026-07-30 14:42 PDT
Current phase: timeline metadata hover verified
State: ready for Integration Captain handoff

## Completed

- Read the full Replay UI role prompt, all required canonical product/design/
  architecture documents, the end-state reference, and the entire coordination hub.
- Inspected the repository; no application scaffold or package manifest exists yet.
- Adopted the reference composition and 1536 × 1024 recording target.
- Read D-008 and claimed the captain-approved UI ownership boundary.
- Implemented controlled Replay, selected moment/evidence/media, interval/drill,
  sponsor-provenance, and page-hierarchy components.
- Added the complete 1536 × 1024 visual system and imported it through the Replay
  component so integration does not depend on a root stylesheet change.
- Verified the styled hero frame in-browser at exactly 1536 × 1024: document
  scrollHeight equals viewport height (1024), scrollWidth equals viewport width
  (1536), so the full collapsed path fits without scrolling or clipping.
- Verified evidence expand/collapse and captured clean opening and expanded-evidence
  visual checkpoints in the in-app browser session.
- Added the four-sponsor role legend while leaving actual execution inventory
  manifest-driven and truthful.
- Captain completed root integration; the production build is green.
- Read the pending D-014 hold and preserved the existing telemetry-only evidence
  narrative without adding Pegasus/Jockey claims.
- Added deterministic Replay-to-clip resolution using the frozen `MediaMapping`
  formula, including mapping selection and optional media-end clamping.
- Added video metadata seek/pause behavior, native controls, `playsInline`,
  accessible labels, loading state, poster-first rendering, playback-error
  fallback, and honest alignment-label support.
- Replaced the unreliable SVG click target with a real keyboard/click-accessible
  event button layer; Chrome now selects the comparison at exactly 17:17.
- Fixed timeline click alignment by transforming browser pointer coordinates
  through the SVG screen matrix instead of treating the letterboxed element bounds
  as the viewBox.
- Added pointer capture and continuous pointer-move seeking for granular drag
  scrubbing, with fractional tenths displayed when the playhead is between whole
  seconds.
- Replaced the approximate invisible event overlay with visible native HTML
  buttons embedded at the exact SVG event coordinates. Each icon now has a 40 px
  minimum target, selected/hover styling, an accessible name, and a visible
  keyboard focus ring.
- Located both source MP4s through connected Google Drive metadata:
  - Full session `PXL_20260730_133531089.mp4`, Drive ID
    `1-6rCEcDSkYnw-Syhvh9n20oGOANBwjeH`, 4,262,427,659 bytes.
  - Supplemental `PXL_20260730_140719642.mp4`, Drive ID
    `1LXBswHz19Ji20eOVzddP1lHxb6siZd9q`, 109,066,678 bytes.
- Read final D-014 and the Integration Captain outbox.
- Verified the graph seed imports exactly the five canonical observation IDs from
  `artifacts/twelvelabs/pegasus-normalized-evidence.json`, replaces
  Pegasus-unavailable provenance with real clock-aligned API provenance, and
  contains no Jockey observation.
- Verified the rebuilt Aura explanation and cached bundle contain only the two
  hero-relevant Pegasus observations, both explicitly labeled
  “Visual evidence unresolved”; restart and hydration context are not miscast as
  hero evidence.

## In Progress

- None.

## Files Owned

- This status file
- `app/src/components/**`
- `app/src/styles/**`
- `app/src/assets/**`
- UI-focused tests
- The temporary lease covered `app/src/App.tsx` and
  `app/src/generated/replayFixture.ts` for this handoff; it is now ready to
  return to the Integration Captain.
- Explicitly not owned: root package/build config, `app/src/domain/**`, or other
  fixture/controller content.

## Files Changed

- `coordination/status/replay-ui.md`
- `app/src/App.tsx` (temporary Integration Captain lease)
- `app/src/generated/replayFixture.ts` (temporary Integration Captain lease)
- `app/src/vite-env.d.ts`
- `app/src/assets/replay-media/wake-hero-work2.mp4`
- `app/src/assets/replay-media/wake-hero-work2.jpg`
- `app/src/assets/replay-media/wake-comparison-work3.mp4`
- `app/src/assets/replay-media/wake-comparison-work3.jpg`
- `app/src/assets/replay-media/wake-sideview-candidate-mechanism.mp4`
- `app/src/assets/replay-media/wake-sideview-candidate-mechanism.jpg`
- `app/src/components/AskWakePanel.tsx`
- `app/src/components/askWakeArtifact.ts`
- `app/src/components/athleteMarks.ts`
- `app/src/components/ReplayPage.tsx`
- `app/src/components/ReplaySurface.tsx`
- `app/src/components/SelectedMoment.tsx`
- `app/src/components/ReplaySupportingPanels.tsx`
- `app/src/components/index.ts`
- `app/src/components/replayMedia.ts`
- `app/src/styles/replay.css`
- `graph/tests/validate-bundles.mjs`

## Verification

- `npm test`: completed; repository currently contains zero discovered tests.
- `npm run build`: passed; production output emitted to `dist/`.
- Production viewport verified at 1536 × 1024 with no horizontal or vertical
  overflow.
- Recurrence citation verified: shared clock and media timestamp seek to 17:17,
  selected interval changes to Work 3, and event window changes to 17:05–17:30.
- Evidence expand/collapse, provenance open, four sponsor roles, and interval
  selection were verified in the production build.
- `npm install`: passed; 0 vulnerabilities.
- `npm test`: Neo4j bundle validation and all three Strands validation tests pass.
- `npm run build`: passed after media infrastructure changes.
- Launched only through
  `npm run preview -- --host 127.0.0.1 --port 4173`; Chrome tested at
  `http://127.0.0.1:4173/`, never via `file://`.
- Chrome direct reload opens hero at 8:55 with Work 2 selected.
- Chrome hero/comparison marker switching verified: comparison selects Work 3,
  moves Replay/media display clocks to 17:17, and updates the insight.
- Production DOM resource inventory contains only same-origin bundled JS/CSS and
  `/`; no external or remote media URL is present, and Chrome reports no console
  warnings/errors.
- Captured the earlier 1536 × 1024 fallback checkpoint before the reviewed media
  handoff.
- Chrome scrub verification at the rendered letterboxed chart:
  - click at the visual 14:00 midpoint selected `14:00.2`;
  - continuous drag to the visual 15:30 position selected `15:29.8`.
  This confirms the previous rightward offset is removed and dragging preserves
  sub-second state.
- Chrome event-icon verification: clicking the visible Work 3 event icon selects
  Work 3, seeks the shared clock to exactly 17:17, updates the insight, and changes
  the selected interval. No keyboard workaround is required.
- Aura readback: provider `twelvelabs-pegasus` has exactly five observations with
  the five canonical IDs; no noncanonical Pegasus ID remains and the query returns
  no Jockey observation row.
- `graph/results/explanation-aura.json` and
  `graph/cache/explanation-bundle.json` match after the required source-field
  change.
- Strengthened graph validation to compare seeded Pegasus IDs directly with the
  canonical artifact and reject any seeded Jockey observation.
- `node graph/tests/validate-bundles.mjs`: passed.
- `npm test`: graph bundle validation and all three Strands validation tests pass.
- Final `npm test`: passed after restoring the valid media build.
- Final `npm run build`: passed; output contains both hashed local MP4s, both
  hashed posters, JS, and CSS.
- Chrome direct `/` reload at `http://127.0.0.1:4173/`: hero selected at Replay
  `8:55`, hero video ready with no error, paused at clip-local `12.000s`.
- Chrome hero → comparison → hero:
  - comparison Replay clock `17:17`, local comparison source, paused at
    `14.000s`;
  - return Replay clock `8:55`, local hero source, paused at `12.000s`.
- Local H.264 playback advanced from `12.000s` to `12.345s` with no media error
  and paused cleanly afterward.
- Browser resource audit found zero cross-origin `src`/`href` values. All visible
  application and media resources are served from `127.0.0.1:4173`; there is no
  live sponsor or remote media request.
- The available Chrome-control surface does not expose network emulation, so a
  literal DevTools “Offline” toggle was not automated. The verified production
  path has no external network dependency; localhost remains required to serve
  the built app and local media.
- D-015 final `npm test`: passed (Neo4j bundle validation and three Strands
  validation tests).
- D-015 final `npm run build`: passed with hashed local hero, comparison, and
  side-view MP4/poster output.
- Chrome direct reload: completed hero remains first at Replay `8:55`; hero media
  is paused at clip-local `12.000s`; Ask Wake reads “Answer pending”; athlete
  marker count is zero.
- Chrome Ask Wake: pending copy states that no model answer is available until a
  real response passes citation review.
- Chrome cross-angle: local 43.281683-second side-view source loaded with no
  error, remained paused initially, then advanced from `0.051s` to `0.408s`
  during playback. The label remained `Clip-local 0:00–0:43`, the workout clock
  remained `8:55`, and the visible limitation rejected occurrence and causation.
- Chrome Work 3: selected at Replay `17:17`, comparison video paused at
  clip-local `14.000s`, and the accessible label is “Work 3 connected
  comparison.” No visible “recurrence” text exists.
- Final DOM resource audit found zero cross-origin `src`, `href`, or `poster`
  values.

## Blockers and Risks

- No blocker for the reviewed hero/comparison media handoff.
- A literal Chrome DevTools network-offline toggle remains unexecuted because
  network emulation is unavailable through the connected Chrome-control surface.
  Same-origin resource inspection and local decode/playback pass.
- Timeline mark selection cannot be exercised against production evidence yet:
  the reviewed athlete artifact contains zero accepted marks. The typed
  selection path is implemented, but no synthetic marker was added for the sake
  of a demo.
- Bedrock is still pending; Replay correctly exposes only the pending state.

## Messages to Team

- Integration Captain: Replay UI is ready for recording. Keep the stylesheet import
  in `ReplaySurface.tsx`; it is the production style entry.
- Integration Captain: D-014 graph handoff verified. Live Aura contains only the
  five accepted Pegasus IDs and no Jockey observations; rebuilt live/cache bundle
  validation passes.
- Screenshot handoff: the current Chrome opening capture shows the real paused
  hero frame, full Replay, headline, evidence summaries, all work rows, next
  session criterion, and collapsed provenance affordance.
- Integration Captain: reviewed core media is now fully connected under the
  temporary lease. Exact hero/comparison seeks, source switching, local playback,
  error fallback, production packaging, direct reload, and screenshot capture
  pass. The lease can return after this handoff.
- Integration Captain: D-015 Replay wiring is ready. Side-view playback and
  clip-local/non-causal boundaries pass; Ask Wake is pending because no validated
  Bedrock artifact exists; the reviewed athlete artifact contains no accepted
  marks, so no marker is shown or fabricated.

## Decision Needed From Captain

- None for the D-015 surface. A validated Bedrock handoff or accepted athlete mark
  artifact will activate their existing adapters without component redesign.

## Next Actions

- Integration Captain may resume ownership of `App.tsx` and
  `generated/replayFixture.ts`.

## ETA

- Core reviewed Replay media integration complete.

## D-017 / D-018 Completed Handoff — 2026-07-30

- Replay now consumes the canonical athlete artifact at
  `curated_results.verbal_goals` and
  `curated_results.gesture_bookmarks`, including
  `confidence: manual-verified`, source `reviewStatus`,
  `targetSplitSeconds`, and the manifest's reviewed `athleteEventMedia`.
- The four Goal/Flag files are packaged under
  `app/src/assets/athlete-marks/`. Their SHA-256 values exactly match the
  reviewed manifest:
  - Goal MP4 `9bed74497e76c2612f739edfaaaeef2d9e5c8e1af7e84343a65d2ff3ce0cbeb3`
  - Goal poster `f15bef9f6b6e1ebc08b357a5b178e04565fa27f96c1cdb72e9203f3e3e9ee736`
  - Flag MP4 `0691912e2c99ac2979fb3b3bb3a89298058de12009766f1b72b9bdce619fef1e`
  - Flag poster `91d9897e4593e12834610e1c91912ca40ad4ca998214fe6a7424a772f78bd766`
- Goal and Flag are visibly and semantically distinct: a compact violet target
  diamond with visible `GOAL`, and a compact amber pennant with a `1` badge and
  visible `FLAG`. Their transparent 44 px controls retain accessible hit areas
  without competing with the HR track.
- Goal selection lands at Replay `21:56.089`, selects Work 4, opens the reviewed
  Goal clip paused at `6.000s`, and renders the authoritative midpoint-modeled
  result: `95/95`, `2:03.9/500m`, best/worst `1:53.4 / 2:13.1`, `185.3W`,
  `30.8spm`, and `21:56.089–25:00`. The UI explicitly says telemetry is not
  continuous between samples and makes no voice-note causation claim.
- Flag selection lands at Replay `19:38.089`, clears every Work-row selection,
  identifies Recovery 3, opens the reviewed clip paused at `4.700s`, and shows
  only “Athlete attention marker.” No surrounding telemetry meaning is inferred.
- Both event surfaces preserve `athleteVerified: true`,
  `jockeyDetected: false`, video-local timestamps, calibrated Replay timestamps,
  reviewed provenance, native controls, `playsInline`, and estimated `±0.7s`
  alignment.
- The five validated Aura insights are exposed through one compact native
  selector. Each independently updates the Replay clock, containing interval,
  athlete-facing headline, explanation, deterministic metrics, evidence,
  limitations, and any local reviewed media available at that selected time.
- The Goal insight uses the authoritative D-018 midpoint-support evaluation
  rather than the older step-hold wording in the cache. The side-view Jockey
  candidate remains clip-local, hypothesis-only, and non-causal.
- Provenance now states that five deterministic insights were queried from live
  Aura and that an equal validated offline cache is packaged. Ask Wake remains
  honestly pending and does not block the five reviewed insights.

### D-017 / D-018 verification

- `graph/results/insight-collection-verification.json` reports five
  `DerivedInsight` nodes, five `CONTAINS_INSIGHT` relationships, live-query
  parity, cache parity except for source, and zero forbidden Jockey attribution.
- `npm test`: passed Neo4j bundle validation and all three Strands validation
  tests.
- `npm run build`: passed; Vite emitted hashed local Goal/Flag MP4s and posters.
- Missing-cache check: temporarily removing
  `graph/cache/insight-collection.json` still produced a successful production
  build with no fabricated navigator; restoring the cache rebuilt all five.
- Direct Chrome `/` reload still opens the original Work 2 hero at Replay
  `8:55`, Work 2 selected, with the local hero video paused at `12.000s`.
- Chrome five-insight results:
  - Work 2 progressive build → Replay `10:30`, Work 2.
  - Work 3 late surge → Replay `17:30`, Work 3, comparison clip `27.000s`.
  - Work 4 strongest interval → Replay `23:00`, Work 4.
  - post-Goal result → Replay `21:56.089`, Work 4, Goal clip `6.000s`.
  - similar-rate/different-output → Replay `17:17`, Work 3, comparison clip
    `14.000s`.
- Goal and Flag MP4s loaded with AAC audio available, `muted: false`,
  `volume: 1`, and advanced during native-control playback before pausing.
- Error fallback was exercised by temporarily withholding the built Flag MP4:
  the video element was replaced by the reviewed poster, the caption changed to
  `Video unavailable · poster shown`, and the layout remained intact. The asset
  was restored and the final build rerun.
- Accessibility snapshot exposes the native insight combobox plus exact marker
  names `Goal: Keep the split under 2:15, Replay 21:56.089` and
  `Flag 1: Athlete attention marker, Replay 19:38.089`. Enter-key activation of
  the Goal control passed and retained focus.
- Production media sources and posters are same-origin hashed assets. Static
  audit found no Drive, Google-hosted media, HLS playlist, or external media URL.
  Literal Chrome network emulation remains unavailable through the connected
  Chrome surface; the production graph has no live sponsor/media dependency.
- Chrome opening-state capture was reviewed at the connected `1408 × 764`
  viewport: no horizontal overflow, hero/video remain stable, and the slim
  Goal/Flag controls do not overlap each other. Existing `1536 × 1024`
  recording-viewport rules remain in force.

### D-017 / D-018 blockers

- None. Bedrock is not required for this deterministic collection and remains
  independently pending in Ask Wake.

## D-016 + Trust Story + Timeline Navigation Handoff — 2026-07-30

- Added an empty-safe adapter for the canonical
  `graph/cache/workout-prescription.json`. It accepts only the cached Neo4j,
  deterministic-human-reviewed artifact with exactly four ordered work
  intervals, four success criteria, five cited insight IDs, and manual ErgData
  delivery.
- Replaced the provisional cue card with a collapsed-by-default `Next workout`
  experience titled `Build pressure, then rate`.
- Expanded state renders the artifact's 8:00 warm-up, 5:00 cool-down, all four
  ordered 4:00 work targets, three between-effort 3:00 easy recoveries, exact
  pace/rate targets, all four measurable criteria, and the canonical 12-line
  ErgData `Create Workout → Variable Intervals` recipe.
- The recipe is selectable/copyable and states that Wake does not automatically
  transfer the workout to ErgData or a PM5. The UI identifies this as a reviewed
  deterministic prescription with no Bedrock-generation claim.
- Five rationale controls are sourced from the prescription's cited insight IDs
  and invoke the same Replay insight selection path. Chrome verified rationale
  5 seeks Replay `17:17`, selects Work 3, and opens the 58 W unresolved insight.
- Missing-prescription fallback passed: temporarily removing the canonical cache
  still built successfully and retained the existing cue-only card. The cache
  was restored and the final production build rerun.
- The five insight choices no longer live in a dropdown. They are five tiny,
  unlabeled stars anchored at their exact Replay focus times. Each keeps a full
  accessible name and `aria-pressed` state; selecting a star updates the clock,
  interval, headline, evidence, limitations, metrics, and available media.
- Chrome verified all five star controls are present, no Replay dropdown remains,
  and star 3 selects Work 4 at Replay `23:00` with one selected marker.
- Goal and Flag retain distinct compact symbols/visible event labels, but the
  athlete-facing detail no longer displays human-review or Jockey-detection
  workflow annotations. Those provenance fields remain intact in the adapter.

### Trust/provenance redesign

- Collapsed copy is now `How this Replay earns trust` with
  `One workout · four connected systems · verified OpenAI synthesis`.
- Expanded copy tells one connected product story through equal TwelveLabs,
  Neo4j, OpenAI, and AWS Strands perspectives; the old numbered pipeline,
  duplicate sponsor strip, and stale manifest receipt are removed.
- The primary proof bar reads:
  `Verified build · OpenAI synthesis completed · 4 evidence citations · 23
  numeric checks passed · packaged for offline playback`.
- `View verification` exposes the reviewed PR #1 facts: model
  `openai.gpt-oss-120b-1:0`, AWS Strands `BedrockModel`, native
  `bedrock-runtime:Converse`, `us-east-1`, completed `end_turn` in 24.6 seconds,
  schema/citation validation passed, 23 matched numeric tokens, and the four
  accepted evidence IDs.
- The drawer explicitly distinguishes successful native Bedrock inference from
  the superseded failed Mantle attempt and preserves the unresolved camera
  limitation. OpenAI is described as synthesizing supplied evidence, not
  dispatching Pegasus investigations.

### Combined verification

- Final `npm test`: passed Neo4j bundle validation and all three Strands
  validation tests.
- Final `npm run build`: passed with the canonical prescription restored.
- Chrome direct `/` reload remains the original Work 2 hero at Replay `8:55`,
  hero video paused at `12.000s`, five timeline stars present, Next workout
  collapsed, and trust story collapsed.
- Chrome expanded workout check found four 4:00 targets, exact pace/rate ranges,
  three visible 3:00 between-effort recoveries, four criteria, five rationale
  links, the ErgData path, and the complete 12-line recipe.
- Chrome expanded trust check found four system stories and the exact proof bar.
  Nested verification exposed all required model, route, region, completion,
  validation, evidence-ID, offline, and camera-limitation facts.
- Production continues to use only packaged same-origin media; neither the
  prescription nor provenance surface adds a runtime sponsor dependency.

## Corrected Pegasus Handoff — 13:43 PDT

- HOLD until Integration Captain finalizes D-014 and the graph/fixture is rebuilt.
- Canonical evidence:
  `artifacts/twelvelabs/pegasus-normalized-evidence.json`.
- Media alignment:
  `artifacts/twelvelabs/video-concept2-alignment.json`.
- Seek mapping: `videoSeconds = workoutSeconds - 31.089`, uncertainty ±0.7 s.
- Hydration displays at workout `11:39.1` and `25:48.1`, seeking video `11:08`
  and `25:17`.
- Preserve the 58 W comparison as `visual evidence unresolved`; a
  pressure/connection explanation may appear only as a labeled Wake hypothesis.
- No component or style edit is requested by Data/Jockey.
