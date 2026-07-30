# Wake Coding-Agent Guide

Status: Short routing guide

The full primary-agent prompts live in
[Agent Team Runbook](../agent-team-runbook.md). This document contains only shared
implementation rules and a compact task template.

## 1. Required Context

Read:

1. [Product Vision](product-vision.md)
2. [PRD](prd.md)
3. [Architecture](architecture.md)
4. [Design](design.md)
5. [End-State Reference](end-state-reference.md)
6. [Frontend Guide](frontend-implementation-guide.md)
7. [Demo Script](demo-script.md)
8. [Coordination Hub](../../coordination/README.md)

Historical documents under `docs/drive/` are context, not current build
instructions.

## 2. Shared Implementation Rules

- Optimize for the recorded end artifact.
- Render from the reviewed fixture before wiring provider outputs.
- Keep one global elapsed-session clock.
- Concept2 owns numerical truth.
- Provider observations remain distinct from Wake interpretation.
- Every provider artifact records its execution mode.
- Video is compact supporting evidence.
- The browser performs no coaching or graph synthesis.
- Recorded path works offline.
- Do not expose chain-of-thought, tool logs, or fake live activity.
- Do not add product scope outside the PRD.

## 3. Task Prompt Template

```text
Goal:
One observable outcome.

Context:
Canonical documents and relevant product principle.

Owned files:
Exact paths this task may edit.

Inputs:
Fixture, contract, or artifact paths.

Required behavior:
Specific interactions or outputs.

Constraints:
What must remain unchanged and what is out of scope.

Acceptance criteria:
Observable pass/fail conditions.

Verification:
Commands, screenshots, or interaction path.

Coordination:
Status file, required handoff, and decisions needed from the captain.
```

## 4. Provider Prompt Pattern

Use targeted video questions, not broad coaching requests.

```text
You are reviewing a selected rowing-video window.

Authoritative telemetry context:
<small verified context object>

For the supplied window:
1. State only what is directly visible or audible.
2. State whether it supports, weakens, or does not resolve the telemetry
   hypothesis.
3. Cite timestamps.
4. Include ambiguity or counterevidence.
5. Do not infer force, physiology, injury, or precise joint mechanics.

Return structured JSON.
```

Wake—not the video provider—writes the coaching conclusion.

## 5. Coaching Prompt Pattern

Input: One validated Neo4j `ExplanationBundle`.

Return:

```text
headline
explanation
cue
drill
successCriterion
citedObservationIds
limitation
```

Rules:

- use ordinary rowing language;
- cite only supplied observation IDs;
- preserve uncertainty;
- do not invent numbers;
- produce one action, not a list;
- do not mention providers in the athlete-facing headline.

## 6. Self-Review

Before handoff:

- Does this strengthen the recorded path?
- Does it match the end-state screenshot hierarchy?
- Are timestamps global and in range?
- Are visible numbers source-derived?
- Is provider attribution truthful?
- Does the offline path still work?
- Did you stay inside owned files?
- Did you update your coordination status?

## 7. Stop Rule

Do not generalize after the acceptance criteria pass. Report remaining limitations
and hand the work to the Integration Captain.
