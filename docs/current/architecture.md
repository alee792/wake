<!-- Imported from https://docs.google.com/document/d/1JC7q3Y91WLZw_BBLJTNxBOi1-NnsVgh1U6qZh0wz3Vs/edit | Drive modified 2026-07-30T18:12:30.427Z -->

WAKE — ARCHITECTURE

Status: High-level product and agent architecture
Purpose: Preserve the reasoning model while allowing implementation choices to change

1. ARCHITECTURAL THESIS

Wake builds one Shared Performance Model of a completed workout. Specialized providers contribute measurements and observations; event synthesis organizes them into meaningful time windows; interpretation explains what changed; the coach produces concise, actionable guidance.

The system should lean on frontier models while retaining explicit contracts, evidence, timestamps, and fallbacks.

2. SYSTEM OVERVIEW

Inputs
- workout video or videos
- Concept2 CSV, TCX, FIT, or API-derived data
- optional heart rate
- optional workout intent

Processing
Concept2 normalization
+ Pegasus observation path
+ Jockey agentic reasoning path
+ optional audio/HR specialists
↓
Observation Provider Contract
↓
Shared Performance Model
↓
Event synthesis and ranking
↓
Interpretation
↓
Coach
↓
Replay view model

3. AUTHORITY BY DATA TYPE

Concept2 is authoritative for:
- pace
- power/watts
- stroke rate
- distance
- interval structure
- elapsed time after synchronization

Heart-rate source is authoritative for measured HR.

Video providers are authoritative only for what is visibly observable. They must not override machine telemetry or infer invisible forces and physiology.

Wake owns:
- synchronization
- normalization
- event formation
- evidence evaluation
- confidence
- coaching interpretation
- product presentation

4. OBSERVATION PROVIDER CONTRACT

All providers emit a minimum shared interface while retaining provider-native observations.

Required fields:
- id
- provider
- source asset
- start time
- end time
- observation type
- factual description
- confidence
- evidence references
- recording geometry when relevant

Optional fields:
- structured measurements
- entities
- recurrence group
- parent/child observations
- provider-native payload
- limitations

The contract is deliberately open. Wake should not constrain frontier models to today’s ontology. Novel observations may flow downstream, where synthesis agents accept, merge, reject, or ignore them.

5. PEGASUS PATH — PER-VIDEO OBSERVATION

Pegasus is the dependable observation engine for individual videos.

Responsibilities:
- segment visually meaningful windows
- describe visible actions and changes
- produce timestamps
- identify rhythm, pauses, stroke-cycle changes, broad sequencing, and visible events supported by the camera angle
- return structured observations

Pegasus does not own:
- telemetry truth
- causal attribution
- coaching
- cross-modal conclusions

Recommended contract:
Video → Pegasus prompt/schema → timestamped observations → provider adapter → Shared Performance Model.

6. JOCKEY PATH — AGENTIC VIDEO INVESTIGATION

Jockey is a second, genuinely useful reasoning path rather than a duplicate of Pegasus.

Recommended roles:

6.1 Pivotal-moment discovery
Ask Jockey to investigate the full workout corpus and propose the three to five moments most relevant to performance or technique. This is useful for discovering candidates not anticipated by a fixed ontology.

6.2 Recurrence analysis
Given a selected Wake event, ask:
“Where else does this pattern occur, and what changes before and after it?”
Jockey searches across moments, intervals, angles, or sessions and returns cited evidence.

6.3 Cross-angle reasoning
Place the normal front-view workout and a short guided side-view clip in the same knowledge store. Ask whether the side view supports, contradicts, or refines a pattern seen in the front view.

6.4 Multi-turn debrief
Use an agent session for follow-up questions without forcing Wake to predefine every query. Examples:
- Was this isolated or recurring?
- Which interval handled the same rate most efficiently?
- What changed after the athlete reset?
- Show the clearest visual examples.

6.5 Structured event proposals
Request a schema containing ranked candidate events, time windows, descriptions, cited moments, confidence, and limitations. Wake validates and fuses these proposals with telemetry.

6.6 Highlight/debrief assembly
Optionally use Jockey to propose a short set of clips for the final debrief. Wake controls final ordering and coaching language.

7. WHY BOTH PATHS

Pegasus and Jockey solve different problems.

Pegasus:
- predictable per-video observation
- efficient extraction
- explicit structured outputs
- stable basis for deterministic Replay generation

Jockey:
- corpus-level investigation
- open-ended discovery
- recurrence and comparison
- multi-turn questions
- cited agentic answers

Wake should not force every session through both paths. A provider router may choose:
- Pegasus only for a simple single-video upload
- Pegasus + Jockey for a richer debrief
- Jockey over multiple sessions or angles
- curated/cached fixtures for the demo

8. SHARED PERFORMANCE MODEL

The model is a time-indexed graph or structured document containing:
- session metadata
- synchronized measurements
- observations
- events
- interpretations
- evidence links
- recommendations
- provenance and confidence

Conceptual entities:
Session
Phase
Interval
MeasurementSeries
Observation
Event
Insight
Evidence
Recommendation
SourceAsset
ProviderRun

Events are the primary reasoning object. An event may combine several observations, such as:
- rate increases
- power decreases
- pace worsens
- recovery visibly rushes

The resulting interpretation may be:
“The athlete chased cadence without preserving pressure.”

9. EVENT SYNTHESIS

Event synthesis should:
- cluster observations by overlapping time and semantic relationship
- compare changes against nearby baselines and other intervals
- distinguish isolated anomalies from recurring patterns
- rank by coaching value, evidence quality, and demo clarity
- preserve conflicting evidence
- generate concise limitations

For the hackathon, events may be precomputed and manually reviewed. The data structure must still reflect the production architecture.

10. COACH LAYER

The coach consumes validated events, not raw provider output.

It produces:
- headline
- explanation
- supporting deltas
- evidence summary
- confidence statement
- recommendation or drill

The coach should use ordinary rowing language. It must never expose hidden chain-of-thought, claim provider consensus as proof, or diagnose injury.

11. REPLAY VIEW MODEL

The frontend should receive one denormalized Replay payload containing:
- session and interval metadata
- aligned telemetry samples
- event markers
- coach cues
- selected-event details
- evidence references
- video mappings
- interval summaries
- next-session plan

This keeps the browser simple and prevents UI components from reconstructing reasoning.

12. SYNCHRONIZATION

Normalize all timestamps to elapsed workout seconds.

Maintain mappings between:
- source video time
- Concept2 workout time
- agent-cited source time
- Replay time

Store alignment confidence and manual offsets. For the hackathon, manually verified synchronization is acceptable and preferable to an unreliable automated alignment.

13. QUALITY AND SAFETY GATES

Before an insight is user-visible:
- telemetry claims must match normalized source data
- timestamps must resolve to valid media windows
- visible claims must be possible from the recording geometry
- causal language must be softened unless strongly supported
- confidence must reflect evidence quality, not model eloquence
- conflicting evidence must be retained or the claim withheld

14. FAILURE MODES AND FALLBACKS

Jockey is an agentic enhancement, not a single point of failure.

Mode A — full:
Pegasus + Jockey + Concept2 + coach.

Mode B — Jockey unavailable:
Pegasus + cached recurrence results + Concept2 + coach.

Mode C — provider unavailable:
Curated observation fixture + real telemetry + coach.

Mode D — partial capture:
Telemetry-led Replay with reduced visual specificity.

The Replay schema and frontend remain identical across modes.

15. HACKATHON IMPLEMENTATION RECOMMENDATION

Use a fixture-first pipeline:
1. Parse and normalize the supplied Concept2 workout.
2. Upload the front and side video assets to Twelve Labs.
3. Run Pegasus for timestamped per-video observations.
4. Put both assets into a Jockey knowledge store.
5. Ask Jockey for ranked pivotal moments in structured form.
6. Select one strong event and ask a recurrence follow-up.
7. Fuse the chosen findings with telemetry in a reviewed Replay JSON fixture.
8. Build the demo against the fixture.
9. Keep live provider calls behind adapters and show one controlled live/cached Jockey interaction.

This proves an agentic architecture without risking the product demo on latency or research-preview behavior.

16. GUIDING RULE

Providers describe and investigate. Wake decides what the evidence means and how to coach it.

Jockey Telemetry Context Pattern

For the hackathon, Wake should not ask Jockey to ingest raw FIT, TCX, CSV, or full stroke-by-stroke telemetry. Wake owns deterministic parsing and numerical analysis. It should derive interval boundaries, anomalies, candidate windows, and concise comparisons before invoking Jockey.

Wake sends Jockey a compact context object containing:
- workout structure and duration;
- relevant interval summaries;
- one or more candidate video windows;
- the telemetry change that motivated each window;
- a narrow visual research question.

Example context:
{
  "workout": {"type": "4 x 4:00 / 3:00 rest", "duration_s": 2321},
  "candidate_windows": [
    {
      "start_s": 1082,
      "end_s": 1102,
      "reason": "stroke rate rises from 29 to 32 while watts fall from 178 to 162",
      "question": "What visible changes, if any, coincide with this telemetry change?"
    }
  ]
}

Jockey treats Concept2 numbers as authoritative context, inspects the indexed video, and returns timestamped visual findings, counterevidence, and confidence. It must distinguish visible observation from interpretation and must not infer force, joint loading, or physiology from video alone.

The final coaching conclusion remains Wake's responsibility:
Concept2 telemetry -> deterministic candidate event -> compact Jockey context -> cited visual findings -> Wake reconciliation -> coaching insight.

Hackathon constraint: limit this to three to six high-value windows in the hero workout. Do not build generalized raw-file ingestion, unrestricted agent loops, or a telemetry-analysis engine inside Jockey.
