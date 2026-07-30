# Wake — Shared Performance Model & Agent Architecture

Status

Canonical high-level technical guide

Purpose

Keep the system agentic, model-first, and implementation-agnostic while preserving a coherent product experience.

## 1. Architectural Thesis

Wake is not a collection of independent analysis agents. It is a coaching system whose agents collaborate to build and refine a shared understanding of an athlete’s session.

Raw inputs are not themselves the product. Individual agent reports are not the product. The interactive coaching replay is the product.

The architecture exists to transform synchronized evidence into:

- meaningful events;
- plausible interpretations;
- selective coaching;
- personalized drills;
- an inspectable session narrative.
## 2. Conceptual Flow

Raw inputs

→ temporal alignment

→ specialist observations

→ shared performance model

→ event synthesis

→ coaching interpretation

→ interactive replay

The shared performance model is the evolving internal account of what happened during the session. A graph is a useful representation, but graph technology is an implementation choice rather than the product’s identity.

## 3. Evidence Hierarchy

The system must preserve the difference between five levels of knowledge.

3.1 Measurement

A directly measured or extracted value.

Examples:

- 224 watts;
- 29 strokes per minute;
- heart rate of 172;
- a detected stroke boundary;
- a handle coordinate;
- an audio-energy peak.

3.2 Observation

A structured description supported by one source or analysis process.

Examples:

- stroke rate increased;
- recovery duration shortened;
- visible rhythm became less consistent;
- breathing intensity increased;
- the athlete stopped rowing.

3.3 Event

A meaningful occurrence or transition assembled from observations.

Examples:

- cadence transition;
- efficiency deterioration;
- technique drift;
- hydration break;
- successful correction;
- final sprint.

3.4 Interpretation

A plausible explanation of an event or relationship.

Examples:

- the athlete appears to be chasing rate rather than maintaining pressure;
- accumulating fatigue may be contributing to reduced consistency;
- the pause likely served as a reset.

3.5 Coaching action

A cue, deep explanation, or drill derived from the interpretation.

Examples:

- “Settle the recovery.”
- review the transition beginning at 12:40;
- prescribe controlled-recovery intervals.

The architecture should never collapse these levels into one untraceable model statement.

## 4. Time Model

Time is a first-class property of every meaningful object.

4.1 Canonical clock

All sources are mapped onto a canonical session clock.

Alignment may be:

- exact;
- estimated;
- segment-level;
- uncertain.

4.2 Temporal objects

The model supports:

- instants;
- intervals;
- workout segments;
- rolling windows;
- ordered sequences;
- recurring patterns.

4.3 Temporal relationships

Useful relationships include:

- occurs during;
- precedes;
- follows;
- overlaps;
- persists through;
- resolves after;
- recurs in;
- changes from;
- returns to baseline after.

Temporal precedence supports reasoning but does not by itself prove causation.

## 5. Core Shared Model

5.1 Session

The complete training activity, including video, metrics, workout intent, athlete context, and analysis state.

5.2 Segment

A meaningful workout phase such as warm-up, work interval, rest, steady-state block, sprint, pause, or cooldown.

5.3 Measurement series

A sampled stream such as watts, pace, rate, heart rate, movement amplitude, breathing intensity, or stroke-timing variance.

5.4 Observation

A timestamped, evidence-linked claim produced by an agent.

Conceptual fields:

- identifier;
- time range;
- source;
- observation type;
- description;
- structured values;
- confidence;
- evidence references;
- producing agent.

5.5 Event

A meaningful transition or occurrence that may combine multiple observations.

5.6 Session state

A time-bound representation of a relevant performance condition, such as:

- stable rhythm;
- high exertion;
- accumulating fatigue;
- loss of efficiency;
- recovery;
- high consistency.

5.7 Hypothesis

A possible explanation with supporting evidence, contradicting evidence, alternatives, temporal scope, and confidence.

5.8 Pivotal moment

A selected event worthy of user attention, including the relevant clip, insight, evidence, coaching cue, and drill connection.

5.9 Coaching cue

A concise intervention that would have been useful at a particular moment.

5.10 Drill

A future training action connected to one or more observed patterns.

## 6. Relationship Model

The model should support relationships such as:

Evidence

- measured by;
- observed in;
- supported by;
- contradicted by;
- derived from.

Temporal

- precedes;
- overlaps;
- persists through;
- resolves after;
- recurs in.

Interpretive

- suggests;
- may explain;
- contributes to;
- is an alternative to;
- increases confidence in;
- decreases confidence in.

Coaching

- triggers cue;
- motivates drill;
- corrected by athlete;
- followed by improvement;
- followed by no clear change.

Comparative

- differs from baseline;
- resembles a prior pattern;
- matches target;
- diverges from target;
- improves relative to a previous session.
## 7. Agent Model

Agents are responsibilities, not necessarily permanent services or one-to-one model instances.

For the hackathon, a frontier model may perform several roles through prompting and self-directed turns. The architecture should preserve the responsibilities and output contracts without forcing premature orchestration complexity.

7.1 Session coordinator

- understands available inputs;
- plans the analysis;
- delegates or self-turns through specialist roles;
- tracks missing context;
- ensures outputs conform to the shared model;
- requests deeper review of important windows.

7.2 Alignment and structure agent

- establishes the session clock;
- detects active work and rest;
- interprets workout structure;
- labels intervals and transitions;
- gives downstream agents phase-aware context.

7.3 Performance agent

- analyzes Concept2 metrics;
- identifies trends, transitions, anomalies, and efficiency patterns;
- compares performance with workout targets;
- proposes candidate pivotal windows.

7.4 Visual technique agent

- analyzes visible stroke rhythm, posture, symmetry, sequencing, exertion, and events;
- compares motion across normalized stroke phases;
- produces timestamped observations rather than a prose report.

For the hackathon, prompts may encourage ambitious but plausible synthesis. Production systems should add stricter perspective and confidence gates.

7.5 Audio agent

- detects breathing changes, speech, chain or machine rhythm, impacts, and interruptions;
- aligns sound events with strokes and workout phases;
- acts primarily as corroborating and timing evidence.

7.6 Heart-rate and exertion agent

- identifies exertion and recovery trends;
- compares physiological response with workload;
- provides context without making medical claims.

7.7 Event synthesis agent

- combines related observations;
- identifies transitions and recurring patterns;
- creates event boundaries;
- separates important events from normal variation.

7.8 Interpretation agent

- explains what changed and why it matters;
- forms and revises hypotheses;
- preserves alternatives where useful;
- turns data relationships into understandable performance insights.

7.9 Pivotal-moment curator

- ranks moments by impact, teachability, confidence, and narrative value;
- avoids redundant moments;
- includes positive patterns and successful corrections;
- creates a coherent session story.

7.10 Coxswain agent

- writes short, natural, phase-aware cues;
- prioritizes one behavior at a time;
- recognizes when silence or encouragement is best;
- avoids explaining system mechanics to the athlete.

7.11 Deep-review agent

- expands pivotal moments into readable coaching analysis;
- explains what changed before and after;
- keeps evidence available but subordinate to the insight.

7.12 Drill agent

- converts important or recurring patterns into specific training tasks;
- defines success criteria;
- connects every recommendation to session evidence.

7.13 Quality reviewer

- checks internal consistency;
- removes unsupported leaps that damage credibility;
- verifies timestamps and evidence links;
- ensures the output still sounds like coaching.
## 8. Collaborative Agent Behavior

Agents should not produce isolated essays.

They contribute to and revise a shared representation.

An agent may:

- add an observation;
- connect evidence to an event;
- challenge an interpretation;
- narrow a claim;
- raise or lower confidence;
- propose an alternative explanation;
- request analysis of a smaller time window;
- suppress a weak coaching cue;
- refine a drill.

The goal is not many agent outputs. The goal is one coherent understanding of the session.

## 9. Event-First Reasoning

Events are the central reasoning unit because they correspond to moments a coach would notice and discuss.

Example:

Measurements

- rate rises from 25 to 28;
- watts remain nearly flat;
- heart rate continues upward.

Observations

- recovery duration shortens;
- stroke timing becomes more variable.

Event

- efficiency deteriorates during the later portion of the interval.

Interpretation

- the athlete appears to be achieving cadence through a faster return without a proportional increase in effective pressure.

Coaching

- “Settle the recovery. Make each stroke count.”

Drill

- controlled-recovery intervals with watts and rate targets.
## 10. Confidence and Uncertainty

Confidence belongs to claims, not to the session as a whole.

Confidence should account for:

- source quality;
- temporal alignment;
- agreement across evidence;
- recurrence;
- workout context;
- contradictory observations;
- model uncertainty.

For the user-facing experience:

- the coach should speak naturally;
- uncertainty should modify wording when material;
- detailed confidence belongs in expandable evidence.

The UI should not burden the athlete with constant caveats.

## 11. Coaching Projection

The shared model is not the interface.

The interactive timeline is a projection that answers, for any selected moment:

- what was happening;
- what changed;
- why it mattered;
- what a coach would have said;
- what happened afterward;
- what to practice next;
- what evidence supports the conclusion.

The default hierarchy is:

Insight

→ explanation

→ evidence

→ underlying agent observations

## 12. Cross-Session Extension

The same model should eventually support:

- recurring-pattern detection;
- comparison with personal bests;
- drill effectiveness;
- athlete-specific thresholds;
- ghost sessions;
- friend or reference comparison;
- coach feedback;
- longitudinal coaching memory.

Cross-session reasoning should normalize for workout type, intensity, duration, drag factor, and available evidence.

## 13. Implementation Freedom

This document does not prescribe:

- programming language;
- agent framework;
- graph database;
- model vendor;
- queueing system;
- API design;
- deployment topology.

For the hackathon, system prompts, frontier models, deterministic fixtures, and precomputed outputs are all acceptable.

Implementation is good when it preserves:

- timestamped structured observations;
- event-first synthesis;
- shared context;
- traceable coaching;
- a polished replay.
## 14. Architectural Guardrails

1. Raw streams must share a session clock.
2. Agents should write structured outputs, not only prose.
3. Measurements, observations, events, interpretations, and coaching remain distinct.
4. Events are the primary unit of synthesis.
5. The user experiences one coach, not many agents.
6. Evidence is inspectable but not intrusive.
7. Coaching must reflect workout intent and timing.
8. Drills trace back to observed patterns.
9. The architecture should favor frontier-model reasoning over brittle hand-coded classifiers.
10. Hackathon shortcuts must preserve the future output contracts.
## 15. Architectural North Star

The agents exist to build and refine a shared understanding of the athlete’s session. Every cue, explanation, and drill should emerge naturally from that understanding.

## 16. Perspective-Conditioned Visual Analysis

Recording geometry is part of session context. The visual technique agent should interpret motion according to the view that is available rather than applying one generic technique rubric.

For front-facing recordings, visual analysis should emphasize:

- stroke segmentation and cadence;
- broad drive/recovery timing;
- frontal rhythm consistency;
- gross handle and shoulder symmetry;
- head movement and visible exertion;
- pauses, gestures, hydration, and other discrete events.

For side-facing recordings, visual analysis should emphasize:

- seat and handle position and velocity;
- knee extension timing;
- drive sequence;
- hands-body-slide recovery sequence;
- slide velocity;
- broad torso timing;
- catch and finish consistency;
- relative changes in stroke excursion.

The view should be represented as ordinary session context, for example:

view: side

analysis focus: seat-handle timing, recovery sequence, slide velocity, catch consistency

This does not require a complex capture-analysis subsystem for the hackathon. A fixture field or prompt instruction is sufficient.

The important architectural property is that downstream events and coaching concepts remain stable even when their visual evidence differs by view. For example, rhythm deterioration may be supported by frontal torso and handle timing in one session and by seat velocity and recovery ordering in another.

The shared performance model should preserve:

- the recording view;
- the visual features used;
- the temporal observations produced;
- the coaching concept those observations support.

This allows ordinary front recordings and guided side recordings to contribute to one coherent coaching model while preserving a path toward stricter production confidence controls.
