# Wake Hackathon PRD

Status: Four-hour MVP

Primary platform: Desktop web

Primary user: A Concept2 athlete reviewing a completed workout

## 1. Goal

Ship and record one polished completed-workout Replay. The recorded path must work
offline and demonstrate one sponsor-backed insight from telemetry and video through
evidence, recurrence, and a next-session drill.

## 2. Golden Session

Source workout:

- Date: July 30, 2026
- Structure: `4 × (4:00 work / 3:00 recovery)`
- Duration: 28:00
- Source formats: Concept2 CSV, TCX, and FIT
- Video: one or two short local clips mapped to Replay time

Canonical phases:

| Phase | Session time |
|---|---:|
| Work 1 | 0:00–4:00 |
| Recovery 1 | 4:00–7:00 |
| Work 2 | 7:00–11:00 |
| Recovery 2 | 11:00–14:00 |
| Work 3 | 14:00–18:00 |
| Recovery 3 | 18:00–21:00 |
| Work 4 | 21:00–25:00 |
| Recovery 4 | 25:00–28:00 |

The CSV resets its local time at each seven-minute block. The fixture builder must
normalize all rows to the session clock before analysis or display.

The old 18:10 work-event claim is invalid because 18:10 is in Recovery 3. The final
hero and recurrence windows must be chosen from actual work intervals and verified
against available video.

## 3. Required Experience

### Opening frame

Show:

- session identity and reviewed status;
- full 28-minute Replay;
- work/recovery structure;
- watts and stroke-rate tracks;
- event markers;
- selected coaching insight;
- evidence summary;
- compact video or poster;
- interval comparison;
- next-session action.

### Hero selection

Selecting the pivotal event must update:

- shared playhead;
- highlighted time window;
- telemetry emphasis;
- insight;
- evidence;
- containing interval;
- mapped video or poster.

### Evidence

“Why Wake believes this” reveals:

1. authoritative Concept2 measurement;
2. timestamped visual observation;
3. supporting or limiting evidence;
4. another event connected to the same pattern;
5. the resulting drill.

Each item identifies its real provider and execution mode in expanded provenance.

### Recurrence

Clicking the recurrence citation seeks the Replay and media to the second event.
This replaces a generic chat surface for the critical path.

The fixture may include a third Pegasus highlight as a positive or contrasting
example. It is optional in the narration.

### Sponsor provenance

A compact “How this Replay was created” drawer explains:

- TwelveLabs — video understanding;
- Neo4j — evidence and recurrence relationships;
- OpenAI — coaching synthesis;
- AWS Strands — build-time orchestration;
- reviewed, precomputed execution.

### Next session

Show one focus, one drill, and one success criterion traceable to the selected or
recurring pattern.

## 4. Sponsor Requirements

Minimum credible implementation:

- one real Pegasus 1.5 asynchronous full-video result pasted into the workspace and
  validated;
- two or three reviewed highlight segments mapped to Replay time;
- one programmatic Jockey knowledge-store response with cited moments when
  ingestion completes before cutoff;
- one successful Neo4j explanation query and identical cached result;
- one AWS Strands run using the OpenAI Responses provider through Amazon Bedrock
  Mantle;
- one build manifest recording real, cached, derived, and manual steps;
- no live sponsor dependency during recording.

Jockey is the primary engineered TwelveLabs integration, but it is shown only when
a real cited response is available. The project owner runs Pegasus manually and
pastes its real structured result for import into the fixture.

## 5. Data and Safety Requirements

- Concept2 values remain authoritative.
- Every timed object uses global elapsed seconds.
- All visible deltas match the fixture and narration.
- Manual content is labeled manual or reviewed.
- Cached provider output must originate from a real provider run.
- Video claims respect camera geometry.
- No injury, physiology, force, or precise joint-angle claims.
- No hidden reasoning or tool logs appear in the product.

## 6. Performance and Reliability

- First useful render in under two seconds on the recording machine.
- Production build supports direct route reload.
- Recorded path works with network disabled.
- Missing video degrades to a poster without breaking the Replay.
- No loading spinner or model latency appears in the main path.

## 7. Scope

Build:

- one desktop Replay route;
- one normalized golden fixture;
- watts and stroke-rate tracks;
- two or three Pegasus highlight events, including one hero and one recurrence;
- one evidence expansion;
- one interval table;
- one drill;
- one provenance drawer;
- local media mapping;
- sponsor preprocessing artifacts and caches.

Do not build:

- upload or processing UI;
- authentication;
- mobile navigation;
- generalized ingestion;
- generic chat;
- full-session video delivery;
- graph explorer;
- GraphRAG, embeddings, or GDS;
- live coaching;
- cross-session history;
- social, billing, settings, or planning workflows.

## 8. Definition of Done

The project is done when:

1. The production Replay loads offline.
2. The first frame communicates the product within ten seconds.
3. Hero selection synchronizes all visible time-based surfaces.
4. The evidence expansion contains truthful sponsor provenance.
5. Recurrence seeks to a second event.
6. A traceable drill completes the story.
7. The provenance drawer explains all four sponsors.
8. At least one complete narrated recording has been reviewed successfully.
