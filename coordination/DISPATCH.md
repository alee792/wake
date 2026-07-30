# Wake Dispatch Gates

Owner: Integration Captain

The captain monitors these gates and gives the project owner an exact
copy-paste prompt plus destination as soon as a gate becomes ready. Never send a
generic “read the board” handoff, and never dispatch the same gate twice.

## G-001 — Core Replay media to Replay UI

- State: dispatched 2026-07-30 14:17 PDT
- Ready when:
  - `artifacts/media/replay-media-manifest.json` exists;
  - every referenced hero and comparison MP4/poster exists;
  - Data/Jockey status records FFprobe and visual review passing.
- Destination: Replay UI session
- Readiness evidence:
  - human-reviewed manifest contains exact zero-delta clock conversions;
  - hero and comparison MP4/poster files exist;
  - durations are 24.021s and 29.021s;
  - both clips are 1280×720 H.264/yuv420p with AAC;
  - hashes, local decoding, visual review, and manifest validation passed.
- Dispatch result: exact local-media integration prompt issued to project owner
  for delivery to Replay UI.

## G-002 — Neo4j bundle to Bedrock PR #1

- State: dispatched 2026-07-30 14:15 PDT
- Ready when:
  - `graph/cache/explanation-bundle.json` contains
    `candidate-work-3-concept2`;
  - the insight no longer says `pending video review` or
    `provisional-telemetry-only`;
  - Aura/cache parity and graph validation pass in Neo4j status.
- Destination: Claude Code / PR #1 session
- Readiness evidence:
  - cache contains `candidate-work-2-concept2` and
    `candidate-work-3-concept2`;
  - insight state is `calibrated-video-reviewed-unresolved`;
  - Work 3 importance is `comparison`;
  - Aura/result and Aura/cache equality passed;
  - two seed runs created no nodes or relationships;
  - `npm test` passed.
- Dispatch result: exact PR #1 rerun/implementation prompt issued to project
  owner for delivery to Claude Code.

## G-003 — Autonomous Jockey pivot to Ask Wake integration

- State: dispatched 2026-07-30 14:25 PDT
- Ready when:
  - a new store-wide Jockey request starts from the unresolved primary angle
    without explicitly selecting the side-view item;
  - the raw result independently selects and cites the side-view item;
  - the result calls the findings a candidate mechanism and preserves the
    supplemental/cooldown limitation.
  - local side-view MP4/poster files exist and are recorded as supplemental
    clip-local media rather than workout-global media.
- Destination: Neo4j and Strands/Bedrock sessions
- Readiness evidence:
  - request contains no `selections`, source/item name, or side-view hint;
  - Jockey independently selected/cited
    `ksi_019fb493-9535-7e00-905e-9e0e10563241`;
  - response and normalization classify the mechanism as hypothesis-only and
    explicitly reject occurrence/causation in selected workout windows;
  - complete request/raw/structured/normalized archive exists;
  - reviewed 43.282s side-view MP4/poster exist as supplemental clip-local media.
- Dispatch result: D-015 finalized and exact Neo4j plus Strands/Bedrock prompts
  issued to the project owner.

## G-004 — Final Bedrock response to Replay UI

- State: blocked
- Ready when:
  - PR #1 uses final D-014 evidence and the corrected Neo4j bundle;
  - the runnable Strands `BedrockModel` implementation is included;
  - the captured response cites both Concept2 comparison observations and the
    approved cross-angle Jockey context;
  - the captured response includes a validated D-016 `WorkoutPrescription` with
    exact RowErg work/rest steps, targets, success criteria, and copyable ErgData
    variable-interval programming instructions;
  - schema, citation, numeric, and pipeline tests pass.
- Destination: Replay UI session
- Dispatch result: pending

## G-005 — Replacement recording

- State: blocked
- Ready when:
  - G-001 through G-004 are dispatched and consumed;
  - D-017 Goal and Flag events have reviewed local MP4/poster assets, canonical
    calibrated clocks, distinct timeline rendering, and athlete-verified
    provenance;
  - D-018 provides five validated Aura-backed insights, an equal offline cache,
    and independently selectable Replay insight navigation;
  - `npm test` and `npm run build` pass;
  - Chrome, offline media, Ask Wake fallback, first-frame hero, and provenance
    verification pass.
- Destination: Integration Captain / recording path
- Dispatch result: pending
