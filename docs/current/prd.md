<!-- Imported from https://docs.google.com/document/d/1JsW4-suSFqEXT2CAEtJtQZtbDK74042PZtzKox9eh_k/edit | Drive modified 2026-07-30T17:54:01.817Z -->

WAKE — PRODUCT REQUIREMENTS DOCUMENT

Status: Hackathon MVP
Primary platform: Desktop web
Primary user: Concept2 athlete reviewing a completed workout

1. PRODUCT SUMMARY

Wake accepts a workout video, Concept2 performance data, and optional heart-rate data. It produces an interactive Replay that synchronizes the workout’s structure, telemetry, meaningful events, coaching insights, evidence, interval comparison, and a next-session recommendation.

2. PROBLEM

Concept2 and fitness tools provide accurate measurements but leave athletes to interpret them. Video-analysis products often over-focus on isolated frames or questionable biomechanics. Athletes need a coherent explanation of how the workout evolved, where performance changed, and what to practice next.

3. MVP GOAL

Demonstrate one convincing completed workout review in which Wake:
- reconstructs the whole session
- identifies three to five meaningful events
- explains one pivotal event with synchronized evidence
- compares intervals using real Concept2 values
- answers a follow-up question about recurrence using Jockey
- produces one focused next-session recommendation

4. INPUTS

Required:
- one workout video
- Concept2 CSV, TCX, FIT, or normalized fixture data

Optional:
- heart-rate series
- workout intent
- additional video angles or technique clips
- previous sessions

5. CORE EXPERIENCE

5.1 Session header
Show workout name, date, duration, distance, machine, verification status, and share/expand actions. Keep metadata compact.

5.2 Replay
The Replay is the primary surface. It must display:
- workout phases and interval boundaries
- synchronized pace, power, stroke rate, and optional heart rate
- one shared playhead
- event markers
- coach-cue markers
- selection highlighting

Selecting any event or interval updates all synchronized content.

5.3 Insight panel
The selected event displays:
- one coach-style headline
- a short explanation
- two or three supporting metric deltas
- confidence
- a concise implication

Example: “You’re chasing the rate around 18:10. Rate rose while power fell, costing pace.”

5.4 Evidence panel
Show grouped evidence from telemetry, visual observation, and technique. Each item includes a short factual statement, source/provider, timestamp window, and optional thumbnail. Evidence expands on demand.

5.5 Video evidence
Video remains secondary by default. It seeks to the selected moment and may be expanded to occupy more screen. Playback stays synchronized with the Replay.

5.6 Interval breakdown
Show one row per work interval plus rest summary where useful. Include no more than six quantitative columns and one Wake-insight column. Selecting a row highlights its Replay range and opens its most important event.

5.7 Next session
Show one focus statement and one drill. The recommendation must be traceable to the selected or recurring pattern.

5.8 Ask Wake
Provide a small follow-up surface powered by Jockey for corpus/session questions such as:
- Where else does this pattern occur?
- Did the same issue appear in another interval?
- What changed after the athlete corrected it?
- Does the side view support the same conclusion?

The answer must cite concrete video moments and should not reveal hidden chain-of-thought.

6. PERCEPTION AND REASONING REQUIREMENTS

6.1 Pegasus path
Pegasus produces structured, timestamped per-video observations. It is the dependable observation path for the primary video.

6.2 Jockey path
Jockey proposes pivotal moments, finds recurrence across videos or clips, supports multi-turn follow-ups, and returns cited structured findings. It should contribute genuine reasoning value rather than functioning as a decorative sponsor integration.

6.3 Fusion
Concept2 telemetry is authoritative for pace, power, rate, distance, and interval structure. Wake normalizes provider outputs, forms events, evaluates evidence, and writes coaching. Provider outputs are proposals, not unquestioned truth.

7. USER STORIES

As an athlete, I can open a completed workout and understand its shape without reading a dense report.

As an athlete, I can select a meaningful event and see every modality seek to the same moment.

As an athlete, I can understand why an insight is credible by expanding evidence.

As an athlete, I can compare intervals and see the coaching meaning of the differences.

As an athlete, I can ask where a pattern repeats and receive cited moments.

As an athlete, I can leave with one actionable drill rather than a long checklist.

8. ACCEPTANCE CRITERIA

Replay
- phase boundaries and interval structure match the source data
- all visual layers use one normalized workout clock
- selecting an event updates the playhead, insight, evidence, and video

Insights
- three to five curated events are available
- every insight has at least two supporting evidence items
- unsupported biomechanics are not stated as fact

Interval breakdown
- values match the provided Concept2 data or an explicitly labeled fixture
- selected row synchronizes with the Replay

Jockey
- at least one demo action uses agentic reasoning across more than one moment or asset
- response contains cited timestamps or moment references
- a cached response is available if the live call fails

Performance
- the hero Replay loads without waiting for live analysis
- core interactions feel immediate
- no API latency is exposed during the main demo path

9. HACKATHON SCOPE

Build:
- one polished desktop Replay
- one real or carefully normalized workout fixture
- three to five events
- one strong selected insight
- interval table
- expandable video
- one Jockey follow-up interaction
- one next-session drill

Do not build:
- mobile application
- live coaching
- user accounts beyond a visual shell
- editing, sorting, or complex filtering
- social feed
- precise pose estimation
- injury or medical guidance
- generalized multi-sport support

10. RELIABILITY AND FALLBACK

The Replay must remain fully demonstrable if either Twelve Labs path is unavailable.

Preferred live mode:
Pegasus observations + Jockey reasoning + Concept2 telemetry.

Fallback A:
Pegasus observations + cached Jockey candidate events.

Fallback B:
Curated observations and events + real Concept2 telemetry.

The user-facing product should not visibly change architecture between modes.

11. SUCCESS CRITERIA

A judge understands within ten seconds that Wake explains a complete workout rather than merely analyzing video.

A judge can see one insight move coherently across timeline, telemetry, evidence, and video.

The sponsor integration is substantive: Pegasus observes; Jockey investigates recurrence and reasons across the video corpus.

The final action feels like coaching, not a model summary.
