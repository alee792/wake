# Wake — Hackathon Execution Brief

Status

Source of truth for today’s build and demo

Objective

Win by demonstrating a polished, believable end-state coaching artifact—not by proving production completeness.

## 1. The Meta Strategy

The demo is the interactive workout replay.

The processing pipeline is supporting infrastructure and should remain mostly invisible.

A judge should experience:

- a real recorded rowing session;
- synchronized Concept2 performance;
- a timeline populated with meaningful events;
- natural coxswain-style coaching;
- deep analysis of a few pivotal moments;
- clear evidence when expanded;
- personalized drills at the end.

The judge does not need to watch agents process thirty minutes of video in real time.

## 2. Central Claim

Given workout video, Concept2 data, and optional heart rate, an agentic system can reconstruct how a rowing session evolved and turn it into useful coaching.

The demo needs to make this claim believable, not production-proven.

## 3. Winning Narrative

Open with the gap:

“Concept2 tells me my power dropped. The video shows me rowing. Neither tells me why.”

Reveal the replay:

“Wake watches the entire session, aligns every signal, and reconstructs the moments that mattered.”

Open one pivotal moment:

“Here my rate rose, but power stayed flat. My recovery shortened at the same time.”

Deliver the coach:

“Settle the recovery. Don’t chase the rate.”

Show the deeper explanation and evidence only after the insight lands.

Finish with action:

“It doesn’t stop at analysis. It turns that pattern into the next workout.”

Then reveal the drill.

## 4. Hero Artifact

Build one excellent session-replay screen.

Required elements:

- video player;
- shared session timeline;
- Concept2 performance tracks;
- workout phase labels;
- event markers;
- coxswain cue markers;
- selected pivotal-moment panel;
- expandable evidence;
- final drills.

The user must be able to click a moment and seek to the relevant clip.

The interface should feel complete even if the pipeline behind it is partly curated.

## 5. Golden Session

Use the user’s full recorded workout as the primary fixture.

The short front-facing feasibility clip has already validated:

- stroke segmentation;
- cadence change;
- broad drive/recovery timing;
- rhythm consistency;
- gross frontal symmetry;
- pause and interaction events;
- useful synchronization with Concept2 data.

A full session creates the opportunity to show:

- an early baseline;
- workout phases;
- fatigue-associated transitions;
- repeated patterns;
- a water or rest break;
- recovery after a pause;
- a strong finish.

Use the side-view sample only as an optional supporting example, not the hero experience.

## 6. What May Be Precomputed or Curated

For the hackathon, it is acceptable to precompute or manually refine:

- source synchronization;
- stroke boundaries;
- observations;
- event boundaries;
- event ranking;
- graph relationships;
- interpretations;
- coaching cues;
- confidence values;
- drill recommendations;
- timeline fixture data.

This is a proof of concept for an agentic product, not a claim that every processing stage is already hardened.

The demo should remain honest if asked:

“For the hackathon, we preprocess the session to keep the experience deterministic. The same structured outputs are designed to be produced by specialized agents in a production pipeline.”

## 7. What Must Actually Work

The demo should genuinely support:

- loading the golden session;
- video playback;
- seeking from timeline events;
- synchronized telemetry display;
- selecting pivotal moments;
- switching or revealing evidence layers;
- rendering the coaching insight;
- opening deeper analysis;
- showing drills linked to findings.

One live model interaction is valuable but optional.

The best candidate is:

“Why did my power fall here?”

The selected event context is sent to a frontier model, which answers from the prepared evidence.

## 8. Agentic Proof

Do not spend the demo showing agent chatter.

Prove agentic design through the artifact:

- multiple specialist observations converge on one event;
- the interpretation changes based on workout phase;
- the coach chooses one cue instead of listing every issue;
- a drill is generated from a repeated pattern;
- evidence remains traceable to timestamps.

If there is a technical slide or short explanation, show:

Inputs

→ specialist agents

→ shared performance model

→ events

→ coach

→ replay

Keep it under thirty seconds.

## 9. Demo Data Contract

The app should be able to render one fixture package conceptually containing:

Session

- metadata;
- duration;
- workout structure.

Time series

- pace;
- watts;
- stroke rate;
- heart rate when available.

Observations

- timestamps;
- agent/source;
- description;
- structured values;
- confidence.

Events

- time range;
- title;
- coaching insight;
- evidence references;
- interpretation;
- importance.

Coaching

- short cue;
- deep dive;
- drill;
- success criterion.

The exact schema is an implementation choice. Preserve these concepts.

## 10. Recommended Pivotal Moments

Curate four or five moments that create a narrative arc:

1. Baseline  
   The athlete establishes a stable rhythm.
2. Intentional transition  
   Rate changes because the workout phase changes. This proves the system understands context.
3. Efficiency transition  
   Rate rises or remains high while power underperforms, accompanied by a visible timing or consistency change.
4. Interruption or reset  
   The athlete pauses, drinks water, or interacts with the device.
5. Correction or finish  
   Rhythm or power recovers, or the athlete finishes strongly.

Not every session will contain all five. Choose the strongest available moments rather than forcing the template.

## 11. User-Facing Voice

Default insight:

“You’re chasing the rate here. Slow the recovery and keep the pressure.”

Expanded explanation:

“Rate climbed from 25 to 28, but watts stayed nearly flat. Recovery timing also shortened and became less consistent.”

Evidence:

- synchronized video clip;
- rate and watts window;
- timing observation;
- optional confidence.

Do not expose phrases such as:

- multimodal fusion;
- agent consensus;
- the system believes across these signals;
- vision-agent output;
- world model.

The technology should disappear into the coach.

## 12. Scope Exclusions

Do not spend core build time on:

- authentication;
- robust uploads;
- generalized Concept2 ingestion;
- live streaming;
- production CV pipelines;
- a graph database;
- perfect automatic synchronization;
- multi-user social features;
- complete cross-workout history;
- mobile polish;
- broad camera calibration;
- full biomechanical accuracy;
- infrastructure abstractions.

These may be described as future work only after the hero artifact is complete.

## 13. Stretch Goals

Prioritize only after the golden path works:

1. Ask the coach about a selected moment.
2. Hear the coxswain cue as generated speech.
3. Toggle between front and side-view capability.
4. Show a ghost comparison against a prior session.
5. Add voice or gesture markers.
6. Show a compact agent/evidence graph for a selected event.
## 14. Sponsor Strategy

Use sponsor products where they strengthen the visible thesis:

- frontier video models for temporal review;
- context-graph tooling for shared session understanding;
- agent tooling for specialist review and synthesis;
- generative UI or frontend tooling for the replay;
- observability tooling if it helps explain agent work during judging.

Do not bolt on sponsor products solely to mention them.

The sponsor story should be:

“This product is only possible because specialized agents can review long-form temporal evidence, share context, and synthesize one coherent coaching experience.”

## 15. Build Order

1. Prepare the golden fixture.
2. Build the replay screen with static data.
3. Make timeline seeking and event selection work.
4. Add the pivotal-moment coaching panel.
5. Add evidence expansion.
6. Add drills.
7. Add one real model-powered interaction if stable.
8. Add sponsor and architecture explanation.
9. Polish the demo path.
10. Prepare fallback recordings or screenshots.
## 16. Demo Resilience

The live demo must work without requiring:

- a model call to finish;
- a new video upload;
- external synchronization;
- network-dependent processing;
- a fresh agent run.

Keep:

- the golden session loaded locally or as a deterministic fixture;
- screenshots or a video backup;
- prewritten answers for likely questions;
- a short architecture diagram;
- one-click navigation between pivotal moments.
## 17. Definition of Done

The demo is complete when a judge can:

1. understand the workout’s story;
2. click a pivotal moment;
3. see the relevant video and metrics;
4. receive a natural coaching insight;
5. inspect why the insight was made;
6. see what the athlete should practice next.

The judge should leave saying:

“This understands the session better than the video or erg data alone.”

## 18. Hackathon North Star

Show the future clearly enough that production hardening feels like engineering—not invention.

## 19. Side-View Technique Proof Point

The full front-facing workout remains the golden session and primary demo narrative because it is the user’s real thirty-minute workout with matching Concept2 data. It best proves long-form temporal synthesis, session evolution, pivotal-moment selection, and natural coaching.

The side-view sample is a secondary proof point that demonstrates deeper rowing-specific technique analysis from a single phone recording.

Use it only after the main replay has landed. The optional sequence should take approximately fifteen to twenty-five seconds:

1. State that the main workout used the natural front-facing setup.
2. Switch to the short side-view sample.
3. Show one precomputed technique moment with a slow-motion clip and simple motion traces.
4. Deliver one concise rowing-specific cue.
5. Return immediately to the broader product vision.

Strong side-view proof points include:

- seat and handle beginning the drive together;
- body opening while meaningful knee extension remains;
- hands-body-slide recovery ordering;
- recovery seat speed increasing as rate rises;
- catch or finish position changing across several strokes.

Recommended example:

Insight

“You’re opening the body before the legs have finished connecting the stroke.”

Evidence

- synchronized side-view clip;
- seat and handle onset markers;
- broad torso-timing observation;
- relevant stroke-rate or watts window when available.

Cue

“Connect the handle to the leg drive before opening the body.”

The side-view sample should not become a second full demo, require live analysis, or displace the golden-session build order.

Demo priority remains:

1. complete front-view session story;
2. interactive replay and coaching;
3. side-view technique-depth proof point only if stable.

The judge should understand the two-tier capture story without being taught camera limitations:

- ordinary capture produces an insightful session replay;
- guided side capture unlocks deeper sport-specific coaching.
