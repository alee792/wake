<!-- Imported from https://docs.google.com/document/d/1J5bBlh3L2Oxpcgiu0ZGiu3hTuAhxf4vegaFfjYa5NOA/edit | Drive modified 2026-07-30T17:53:07.039Z -->

WAKE — PRODUCT VISION

Status: Canonical product direction
Platform: Desktop web for the hackathon

NORTH STAR

Wake reconstructs a performance over time and turns it into coaching.

An athlete uploads a workout video and Concept2 data. Wake organizes the session into a synchronized Replay, identifies the moments that mattered, explains why they mattered, and gives the athlete a focused action for the next session.

Wake is not a video-analysis dashboard. It is not a collection of AI detections. It is the experience of reviewing a workout with an exceptionally attentive coach.

PRODUCT THESIS

Most training tools either record results or expose raw metrics. The athlete is left to interpret charts, remember what happened, and decide what to change. Wake closes that gap.

Continuous workout evidence becomes:
Measurements → Observations → Events → Interpretations → Coaching.

The primary product artifact is the Replay: a synchronized, navigable understanding of the whole workout, combining telemetry, meaningful events, coach cues, evidence, and optional video.

CORE PRINCIPLES

1. Coaching first
The default surface speaks like a coach. Technical provenance and model evidence are available on demand, but the athlete first sees a clear statement such as “You’re chasing the rate here.”

2. Time first
Performance unfolds over time. Every observation, event, insight, video moment, and metric is anchored to the same clock.

3. Events first
Wake elevates a small number of pivotal moments rather than flooding the athlete with detections. Events are the bridge between raw evidence and coaching.

4. Insight before evidence
Tell the athlete what mattered, then show why. Evidence should build trust without forcing the user to perform the analysis.

5. One shared performance understanding
Video, Concept2 telemetry, heart rate, audio, and agent outputs contribute to one evolving model of the session. The coach reasons over that shared understanding rather than over disconnected modality outputs.

6. Progressive coaching depth
A normal front-facing phone recording should produce useful rhythm, timing, broad symmetry, and event coaching. A guided side recording can unlock deeper sequencing and slide-timing analysis. The product should become more technically specific only when capture quality supports it.

7. Video is evidence, not the centerpiece
Consumer footage may be visually poor while still analytically useful. The Replay and insight remain primary. Video is compact by default and expandable by the athlete.

8. Technology disappears
Users should experience coaching, not agents. Wake does not foreground model names, chains of thought, consensus mechanics, or sponsor plumbing.

THE REPLAY

Replay is Wake’s primary interaction surface. It contains:
- workout phases and intervals
- synchronized pace, power, stroke rate, and optional heart rate
- timestamped events
- coach cues
- a shared playhead
- the selected insight and its evidence
- expandable synchronized video
- interval comparison
- a next-session action

The Replay answers four questions:
- Where am I in the workout?
- What changed?
- Why did it matter?
- What should I do next?

PRODUCT VOCABULARY

Replay — the synchronized view of the workout and Wake’s primary product artifact.
Observation — a factual, timestamped finding from telemetry, video, audio, or another provider.
Event — a meaningful time window formed from one or more observations.
Insight — the coaching interpretation of an event.
Evidence — the observations and measurements supporting an insight.
Recommendation — the action the athlete should take in a future session.

USER EXPERIENCE

The athlete opens a completed session and immediately sees the workout’s shape. A small number of event markers signal where Wake found something meaningful. Selecting an event seeks every synchronized layer to the same moment. The insight becomes the focal point, the relevant telemetry brightens, and the video seeks to supporting evidence. The athlete can compare intervals and finish with one specific drill or intention for the next workout.

The experience should feel calm by default and decisive when something matters.

SUPPORTED CLAIMS

Wake should confidently coach patterns visible in the available evidence, including:
- rate rising without corresponding power
- pace or power decay across intervals
- rhythm instability and pauses
- recovery shortening or rushing when visibly supported
- broad seat-handle sequencing from an adequate side view
- repeated patterns across moments or sessions

Wake should not claim precise joint angles, injury diagnosis, muscle recruitment, force attribution, or invisible biomechanics.

ROWING FIRST, NOT ROWING BOUND

Rowing is the first domain because it combines continuous movement, high-quality machine telemetry, repeatable technique, and a strong coaching culture. The architecture should generalize to other time-based performance domains, but the hackathon product should remain unapologetically focused on rowing.

HACKATHON THESIS

The winning artifact is the finished Replay, not a processing console. Precomputed observations, curated events, and fixture data are acceptable when they demonstrate a coherent architecture that could run robustly with more time and resources.

The demo should prove three things:
- Wake understands the workout as a whole.
- Wake connects a pivotal moment to grounded evidence.
- Wake turns that understanding into useful coaching.

NORTH-STAR STATEMENT

Wake reveals the shape of a performance—and shows the athlete what to change next.
