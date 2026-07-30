# Wake Product Vision

Status: Canonical product direction

Platform: Desktop web for the hackathon

## North Star

Wake reconstructs a performance over time and turns it into coaching.

An athlete records a rowing workout and exports Concept2 data. Wake turns those
inputs into a synchronized Replay that shows what changed, why it mattered, and
what to practice next.

The product is not a video analyzer, metric dashboard, or agent console. It should
feel like reviewing the session with an attentive coach.

## Product Thesis

Concept2 measures performance accurately, but the athlete must interpret the
charts. Video preserves context, but reviewing an entire session is slow and
subjective. Wake connects both on one clock and elevates only the moments worth
coaching.

The transformation is:

```text
Measurements → observations → events → insights → coaching action
```

The primary artifact is the Replay: a navigable view of the complete workout with
telemetry, events, concise coaching, inspectable evidence, synchronized media, and
one next-session action.

## Product Principles

### Coaching first

Lead with a direct statement such as “You added rate without preserving power.”
Provider names and technical provenance appear only when the athlete or judge asks
why.

### Time first

Every phase, metric, observation, event, clip, and cue uses one session clock.

### Events, not detections

Wake selects a small number of meaningful windows. Raw observations support events;
they are not the interface.

### Insight before evidence

Present:

```text
Insight → explanation → evidence → action
```

### Evidence with boundaries

Concept2 is authoritative for pace, watts, stroke rate, distance, and interval
structure. Video supports only claims visible from the recording. Wake does not
infer invisible forces, physiology, injury, or precise joint mechanics.

### Selective action

The review ends with one focused cue or drill tied to the observed session—not a
generic training plan.

### Technology on demand

The athlete experiences one coach. Judges can expand provenance to see how
TwelveLabs, Neo4j, OpenAI, and AWS Strands contributed.

## The Replay

The Replay answers four questions:

1. Where am I in the workout?
2. What changed?
3. Why did it matter?
4. What should I do next?

It contains:

- workout phases and intervals;
- synchronized watts, pace, rate, and optional heart rate;
- event and coach-cue markers;
- one shared playhead;
- selected insight and evidence;
- compact synchronized video;
- interval comparison;
- one next-session recommendation.

## Hackathon Thesis

The winning artifact is the finished Replay, not the processing pipeline.
Precomputed sponsor outputs and manually reviewed fixtures are acceptable when
their provenance is honest and the resulting product demonstrates a coherent
architecture.

The recording must prove:

- Wake understands the session as a whole.
- One pivotal moment is grounded in real evidence.
- A repeated pattern can be inspected and revisited.
- The evidence becomes a specific coaching action.

## North-Star Statement

Wake reveals the shape of a performance—and shows the athlete what to change next.
