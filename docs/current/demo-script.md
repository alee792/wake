<!-- Imported from https://docs.google.com/document/d/1sX3wNANytg3r1oWoib2Lh6L4eazd7fA93cBnzB702K8/edit | Drive modified 2026-07-30T17:56:14.091Z -->

WAKE — DEMO SCRIPT

Purpose
This document defines the exact hackathon demo flow. The demo should make the finished artifact feel inevitable, not expose processing complexity.

Demo thesis
Wake turns an ordinary rowing workout into a synchronized coaching review. It shows what changed, why it mattered, the evidence behind the claim, and what to do next.

Target length
3–4 minutes.

Opening state
Open directly on a completed Replay. Do not begin with upload, indexing, or agent execution. The first frame should show the full workout timeline, a selected pivotal moment, the coaching insight, supporting evidence, and the interval breakdown.

0:00–0:25 — Frame the problem
Narration:
“Rowers already have video and Concept2 data, but reviewing them means scrubbing through footage and interpreting charts yourself. Wake reconstructs the workout and turns it into coaching.”

Show:
- Full-session Replay
- Workout phases
- Concept2 telemetry
- Timestamped events and coach cues

0:25–1:15 — Reveal the key insight
Select the highlighted event near 18:10.
Narration:
“Wake identifies the moments that changed the workout. Here, rate rises, but power falls. The coach summarizes it directly: ‘You’re chasing the rate.’”

Interaction:
- Event selection moves the playhead
- Insight receives the single expressive focus glow
- Relevant telemetry window brightens
- Video seeks to the same moment

Avoid explaining model internals yet.

1:15–1:55 — Expand evidence
Open the evidence panel.
Narration:
“The conclusion is inspectable. Concept2 is authoritative for rate and power. Video adds visible timing and technique observations. Every claim carries timestamps, provenance, and confidence.”

Show:
- Telemetry evidence
- Visual observation
- Technique observation
- Confidence and source labels

1:55–2:25 — Show workout-level understanding
Select Interval 2 in the Interval Breakdown.
Narration:
“Wake does not treat this as an isolated frame. It compares the pattern across the workout. This interval held the same cadence with less power, while the final interval converted the higher rate into output.”

Interaction:
- Selected row highlights its range in the Replay
- Insight panel updates or remains anchored to the pivotal event

2:25–2:55 — Convert insight into action
Reveal the Next Session card.
Narration:
“The review ends with one focused action: hold pressure before building rate, with a short drill tied to the observed pattern.”

Show:
- One recommendation
- One drill
- No generic training plan

2:55–3:25 — Explain the agentic architecture
Narration:
“Pegasus produces structured, timestamped observations from the uploaded workout. Jockey independently investigates the session, tests broader questions, and returns cited findings. Wake reconciles both with authoritative Concept2 telemetry into one shared performance model.”

Show a compact architecture view only if available:
Video → Pegasus observations
Video or indexed workout corpus → Jockey cited investigation
Concept2 + optional HR → authoritative measurements
All paths → shared events → coach → Replay

3:25–3:40 — Close
Narration:
“The Replay is the product. Wake helps the athlete see what mattered and leave with something specific to change.”

Hackathon wow moments
1. Clicking an event synchronizes timeline, insight, evidence, and video.
2. The interface visually focuses attention without exposing AI theatrics.
3. Jockey contributes a cited investigation that goes beyond a fixed prompt.
4. The review ends in a personalized action.

Failure-safe demo plan
- Use a precomputed golden session.
- Cache Pegasus and Jockey outputs.
- Keep deterministic fixture JSON available.
- Do not depend on live processing during the main presentation.
- A separate optional button may show the generated evidence provenance.

Do not demo
- Upload latency
- Agent logs
- Chain of thought
- Pose skeletons
- Medical or injury claims
- Unsupported joint-angle precision
- Mobile screens
- Settings, billing, or account management

Definition of success
Within ten seconds, a judge understands that Wake is a coaching product organized around time, insight, and evidence—not a generic sports dashboard or video analyzer.
WAKE — HACKATHON DEMO SCRIPT

Target length: 3–4 minutes
Demo rule: Show the finished coaching experience first. Explain the agent architecture only after the value is obvious.

PRE-DEMO SETUP

- Open directly to the completed “Morning Row” Replay.
- Use the reviewed fixture so the page is fully loaded.
- Preselect no event; let the workout shape be visible.
- Keep a cached Jockey response available behind the follow-up interaction.
- Confirm video, event seeking, and interval selection work offline.

0:00–0:20 — THE PROMISE

On screen: Full Replay with interval phases, telemetry, events, and coach cues.

Narration:
“Most workout tools give you a result and a pile of charts. Wake reconstructs the whole performance and turns the moments that mattered into coaching.”

Do not explain providers yet. Let the judge recognize that this is a coherent workout, not a video player.

0:20–0:50 — THE WORKOUT AS A WHOLE

Point to:
- interval structure
- synchronized pace, power, rate, and heart rate
- event markers
- coach cues

Narration:
“This was a variable-interval Concept2 workout. The machine data gives us the performance truth. Wake aligns video and model observations to the same workout clock, then organizes the session around a small number of meaningful events.”

0:50–1:25 — SELECT THE PIVOTAL EVENT

Click the amber event near 18:10.

Expected behavior:
- playhead glides to 18:10
- Interval 2 becomes subtly illuminated
- insight gains the attentional glow
- evidence and video seek together

Narration:
“Here’s the pivotal moment. Wake’s coaching conclusion is simple: ‘You’re chasing the rate.’ From 18:10 to 18:36, stroke rate increases while power drops, and pace gets worse.”

Pause briefly so the synchronized movement registers.

1:25–1:55 — PROVE IT

Point to the evidence panel and compact video.

Narration:
“The top layer sounds like a coach. The evidence is there when you want it. Concept2 confirms the rate and power change. The video contributes visible timing evidence, but it does not pretend to measure biomechanics the camera cannot see.”

Optionally click “Show all evidence” or expand the video for two seconds, then collapse it. This proves video is available without making low-quality footage the hero.

1:55–2:20 — COMPARE INTERVALS

Click the affected interval in the Interval Breakdown.

Narration:
“The table preserves the metrics Concept2 athletes already use, but Wake adds the interpretation. Here the same rate produced less power. Later, output recovered, and the final interval was the strongest finish.”

The selected row should highlight the matching Replay range. Do not introduce a second chart.

2:20–2:55 — JOCKEY MOMENT

Open the small “Ask Wake” follow-up and use the prepared question:
“Where else does this rate-chasing pattern occur?”

Expected response:
- concise answer
- one or more cited moments
- optional reference to the side-view clip
- no visible chain-of-thought

Narration:
“This is where we use Twelve Labs Jockey as an actual video agent. Pegasus gives Wake dependable timestamped observations from each video. Jockey investigates across the workout and the side-view clip, finds recurrence, and returns cited moments. Wake then checks those findings against the telemetry before coaching.”

Suggested answer:
“The pattern begins briefly late in Interval 1 and returns more clearly at 18:10 in Interval 2. The side view shows the recovery becoming more hurried during the stronger recurrence.”

If the live call is fast, let it complete. Otherwise return the cached result with the same UI.

2:55–3:20 — ACTION

Point to Next Session.

Narration:
“Wake ends with one thing to do—not twenty observations. Hold pressure before building rate. The recommended drill is three sets of ten strokes where rate only rises after power stabilizes.”

Click “Add to my plan” only if it is implemented cleanly. Otherwise leave it visual.

3:20–3:45 — ARCHITECTURE CLOSE

Narration:
“Underneath, specialist providers contribute measurements and observations to one shared performance model. Events become insights, and insights become coaching. For this demo the Replay is precomputed for reliability, but the architecture supports both deterministic Pegasus analysis and agentic Jockey investigation.”

Finish on the complete Replay, not an architecture diagram.

KEY LINES TO REMEMBER

“Wake reconstructs the whole performance.”
“The Replay is the product.”
“Concept2 is the performance truth; video adds context.”
“Pegasus observes. Jockey investigates. Wake coaches.”
“Insight first. Evidence on demand.”

WHAT NOT TO SAY

Avoid:
- “Our multimodal agents achieved consensus.”
- “The AI detected bad form.”
- “This model diagnoses your rowing mechanics.”
- lengthy sponsor descriptions before the product moment
- apologies for cached or precomputed data

JOCKEY FALLBACK

If Jockey is unavailable:
- click the same question
- return the cached cited response
- describe it as a previously completed agent investigation, not as a live call
- continue immediately to the next-session recommendation

GENERAL FALLBACK

If video fails, the Replay and evidence remain convincing.
If chart interaction fails, select the event from the insight list.
If seeking fails, narrate from the already selected 18:10 state.
If network fails, every essential part of the core demo must still work.

DEFINITION OF A WINNING DEMO

Within ten seconds, judges understand that Wake interprets a complete workout.

Within ninety seconds, they see one insight synchronize telemetry, evidence, and video.

Before the close, they see Jockey provide cited agentic value across moments or assets.

The final screen leaves them with a concrete coaching action.
