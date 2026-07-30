# Wake showcase talking points

## The agentic evidence loop

Wake does not ask a video model to “coach this athlete” in one broad prompt.
OpenAI orchestrates an iterative evidence loop:

1. Concept2 telemetry establishes authoritative workout facts and identifies
   candidate moments.
2. OpenAI turns a candidate into a bounded research question.
3. TwelveLabs Pegasus inspects the relevant video evidence and returns structured,
   timestamped observations with confidence and limitations.
4. OpenAI compares the response with telemetry, rejects unsupported claims, and
   classifies the visual evidence as supporting, weakening, or not resolving the
   hypothesis.
5. When evidence is incomplete, OpenAI dispatches a narrower follow-up question
   to Pegasus.
6. Wake preserves the complete request/result trail and promotes only reviewed
   observations into athlete-facing insights.

This back-and-forth is the product story: OpenAI directs the investigation,
Pegasus observes the video, Concept2 anchors the measurements, and Wake turns
reviewed evidence into coaching.

## Concrete example from the hero workout

The first full-video request produced broad coverage but only generic phase
descriptions. OpenAI used that result to dispatch focused comparisons:

- Which visible pattern distinguishes the lowest-output interval from the
  strongest?
- Does recovery behavior recur at the two hydration events?
- How many strokes does each interval restart take to settle?
- Can video explain a roughly 58 W difference between two windows with nearly
  identical stroke rates?

Pegasus found useful recurrence and restart candidates, but it could not visually
explain the large output difference from the fixed frontal camera. Wake records
that result as **unresolved**, rather than inventing a technique diagnosis.

## Suggested spoken framing

> This is not a one-shot AI analysis. OpenAI acts as the investigator: it reads
> the Concept2 evidence, asks Pegasus a targeted video question, evaluates the
> answer, rejects claims the camera cannot support, and asks a better follow-up.
> The final Replay contains only the evidence that survives that loop.

## What to show on screen

1. Select a telemetry event in the Replay.
2. Show its Concept2 measurements and exact time window.
3. Reveal the Pegasus observation and cited video moment.
4. Show whether Wake classified the video as support, counterevidence, or
   unresolved.
5. Briefly reveal the archived request/result trail to demonstrate that the
   finding came from an iterative, reproducible investigation.

Do not describe hidden chain-of-thought. Show observable orchestration artifacts:
prompts, task IDs, timestamps, structured results, validation decisions, and
provenance.
