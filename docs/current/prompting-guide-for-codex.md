<!-- Imported from undefined | Drive modified 2026-07-30T18:12:51.339Z -->

Wake — Prompting Guide for Codex

Status: Canonical for hackathon development

1. Purpose

Use this guide when asking Codex or another coding agent to build or modify Wake. The goal is a coherent, maintainable demo—not maximum code volume.

2. Required reading order

Before implementation, read:
1. Wake — Product Vision
2. Wake — PRD
3. Wake — Architecture
4. DESIGN.md
5. Wake — Frontend Implementation Guide
6. Wake — Demo Script

When documents conflict, prefer the most specific document, while preserving the Product Vision.

3. Core implementation instruction

Build Wake as a desktop-first performance coaching Replay. The Replay and selected insight are the center of the experience. Video is supporting evidence and must be expandable rather than dominant.

Do not reinterpret Wake as:
- a generic fitness dashboard;
- a video-analysis product;
- an AI-agent console;
- a pose-estimation demo;
- a mobile application.

4. Hackathon priorities

Optimize in this order:
1. A convincing end artifact.
2. Reliable demo flow.
3. Synchronized interactions.
4. Strong coaching synthesis.
5. Clean architecture seams.
6. Breadth of functionality.

It is acceptable to use curated fixtures, precomputed observations, manually selected events, and deterministic outputs.

5. Architecture constraints

Keep these boundaries explicit:
- Perception providers produce observations.
- Concept2 telemetry supplies authoritative performance measurements.
- The Shared Performance Model stores normalized evidence and events.
- Synthesis creates interpretations.
- The coach creates athlete-facing language and actions.
- The frontend renders the Replay.

Do not let provider-specific response shapes leak throughout the application. Normalize at adapters.

6. Pegasus and Jockey

Plan for both providers behind an Observation Provider interface.

Pegasus role:
- deterministic per-video indexing and timestamped description;
- known observation extraction;
- clip-level visual evidence;
- stable structured output for the hero session.

Jockey role:
- agentic investigation of ambiguous or high-value questions;
- discovery of patterns not captured by the fixed Pegasus prompt;
- comparison across multiple clips, camera angles, intervals, or sessions;
- cited answers with supporting video moments;
- second-opinion or challenge pass against candidate interpretations.

Recommended orchestration:
1. Parse Concept2 telemetry.
2. Run Pegasus baseline observation pass.
3. Generate candidate events from telemetry and observations.
4. Send targeted research questions to Jockey.
5. Normalize all returned evidence.
6. Reconcile agreement and disagreement.
7. Produce coaching insights with explicit confidence.

Do not ask Jockey to invent rowing mechanics or override telemetry. Jockey provides research evidence; Wake owns the final interpretation.

7. Jockey question design

Good targeted questions:
- During which intervals does recovery appear to shorten as rate rises?
- Does the same visual pattern occur more than once in the workout?
- Compare the athlete’s movement before and after the power drop.
- Which video moments best support or contradict the hypothesis that cadence increased without added pressure?
- Across front and side views, which observations are consistent?

Bad broad questions:
- Coach this athlete.
- Diagnose their rowing.
- Tell me everything wrong.
- Infer exact force or joint angles from this video.

Ask for timestamps, citations, uncertainty, and counterevidence.

8. Data contracts

ObservationProviderResult should support:
- provider
- query or prompt
- startTimeMs
- endTimeMs
- observationType
- description
- confidence
- evidence references
- provider-native metadata

Provider-native observations are allowed. Do not constrain frontier models to a closed ontology, but require normalized timestamps and provenance.

9. Coding conventions

- Prefer TypeScript with strict mode.
- Keep domain types independent from React components.
- Separate fixture data, domain logic, provider adapters, and presentation.
- Use pure functions for time mapping and event selection.
- Avoid global mutable state.
- Add runtime validation at external boundaries.
- Keep components small enough to understand, but do not fragment trivial markup.
- Use semantic naming from the product glossary: Replay, Event, Insight, Evidence, Observation, Recommendation.

10. UI instructions

Follow DESIGN.md exactly.

Non-negotiable:
- one full Replay timeline;
- no duplicate telemetry timeline;
- interval comparison belongs in a table;
- dark-first desktop layout;
- restrained teal selection and amber coaching accent;
- one focal point at a time;
- motion explains synchronization;
- low-quality video does not dominate.

11. Demo safety

The main demo must not depend on real-time provider processing. Provider outputs can be generated beforehand and saved as fixtures.

Include graceful fallbacks:
- Pegasus-only fixture;
- Jockey-only supplemental findings;
- fused output;
- no-video state;
- no-heart-rate state.

Never fake a live provider call in a way that could fail during judging. A visible precomputed research result is acceptable when represented honestly as processed workout analysis.

12. Prompt template for a coding slice

Use this structure:

Goal:
Describe one visible outcome.

Context:
Name the canonical docs and relevant product principle.

Scope:
List the components and data involved.

Constraints:
State what must not change.

Acceptance criteria:
Define observable behavior.

Verification:
Specify tests, screenshots, or interaction checks.

Example:

Goal: Build the desktop Replay surface from the session fixture.
Context: Follow DESIGN.md and Frontend Implementation Guide. Replay is the primary interaction surface.
Scope: Phase track, four telemetry tracks, events, coach cues, shared playhead.
Constraints: Do not add video to the top of the page. Do not add a second timeline. Use one normalized time scale.
Acceptance criteria: Clicking an event updates selectedEventId and currentTimeMs; the selected window highlights; keyboard navigation works.
Verification: Unit-test time-to-x mapping and capture a 1440 px screenshot.

13. Agent self-review checklist

Before completing a slice, verify:
- Does this make the Replay clearer?
- Is the athlete receiving an insight rather than raw analysis?
- Is telemetry treated as authoritative?
- Is video secondary by default?
- Are Pegasus and Jockey hidden behind adapters?
- Is confidence proportional to evidence?
- Did the change avoid unnecessary scope?
- Does the demo path remain deterministic?

14. Stop conditions

Stop and ask for direction rather than inventing:
- a new product category;
- a new navigation system;
- mobile scope;
- new branding or colors;
- unsupported biomechanical claims;
- a different provider architecture;
- features outside the hackathon demo path.
WAKE — PROMPTING GUIDE FOR CODEX

Purpose
Use this guide when handing Wake to Codex or another coding agent. It is designed to keep implementation aligned with the product, architecture, and demo rather than producing a sprawling generic AI application.

Required reading order
1. Wake — Product Vision
2. DESIGN.md
3. Wake — PRD
4. Wake — Architecture
5. Wake — Frontend Implementation Guide
6. Wake — Demo Script

Operating principles
- Build the artifact the judge experiences first.
- Prefer the smallest coherent vertical slice.
- Preserve provider boundaries.
- Use frontier models for semantic work; use ordinary code for synchronization, validation, and rendering.
- Keep raw evidence and derived coaching distinct.
- Do not invent capabilities unsupported by the recording geometry or telemetry.

Canonical implementation framing
Wake is a completed-workout coaching Replay.

Inputs:
- workout video
- Concept2 data
- optional heart rate
- optional intent

Output:
- synchronized timeline
- timestamped events
- coach insights
- expandable evidence
- interval comparison
- next-session action

Architecture constraints
Concept2 telemetry is authoritative for pace, watts, stroke rate, distance, intervals, and recorded workout metrics.

Pegasus path:
- deterministic structured observations from an individual video
- timestamped factual descriptions
- provider-native observations allowed
- no coaching or unsupported causality

Jockey path:
- agentic video investigation
- answer broader questions over the indexed workout or video corpus
- test hypotheses and search for recurrence
- return cited, timestamped findings
- may produce novel observations beyond the fixed ontology

Wake path:
- normalize provider outputs
- reconcile them with telemetry
- form events
- produce interpretations and coaching
- preserve provenance and confidence

Do not collapse Pegasus, Jockey, and Wake into one undifferentiated prompt.

Prompt pattern for coding tasks
Every Codex task should include:

Goal
A single user-visible outcome.

Context
Relevant product and architecture principles.

Files to read
Explicit canonical documents and likely source files.

Constraints
Scope boundaries and forbidden changes.

Acceptance criteria
Observable behavior, tests, and visual results.

Out of scope
Adjacent work the agent must not begin.

Example: scaffold the Replay page
Goal
Build the desktop Replay page using the golden-session fixture.

Context
The Replay timeline and selected insight are the product. Video is secondary evidence. The main demo must load immediately without live provider processing.

Files to read
DESIGN.md
Wake — Frontend Implementation Guide
Wake — Demo Script
fixture schema

Constraints
- TypeScript
- one full-session timeline
- no mobile layout
- no upload flow
- no backend orchestration
- no new colors or visual style
- do not add a duplicate expanded timeline

Acceptance criteria
- Page renders the session header, timeline, insight, evidence, video, interval table, and next-session card.
- Selecting an event seeks the video and updates all selected states.
- Selecting an interval highlights its timeline range.
- Keyboard focus works for markers and rows.
- Tests cover time mapping and selection state.

Out of scope
Authentication, persistence, live Twelve Labs calls, responsive mobile UI.

Example: implement provider normalization
Goal
Normalize cached Pegasus and Jockey outputs into Wake observations.

Constraints
- Preserve original provider payloads.
- Never discard provider-native observation types.
- Validate timestamps against video duration.
- Mark source and confidence explicitly.
- Do not generate coaching in this layer.

Acceptance criteria
- Shared Observation type supports known and provider-native categories.
- Invalid ranges fail validation with useful errors.
- Duplicate findings may be linked or merged without erasing provenance.
- Unit tests cover both providers.

Example: synthesize demo events
Goal
Create a deterministic event synthesis step for the golden session.

Inputs
Normalized observations and Concept2 telemetry.

Constraints
- Telemetry facts override contradictory generated numeric claims.
- Events must reference their supporting observations.
- Interpretation is separate from the factual event record.
- Prefer 3–5 pivotal events rather than exhaustive annotation.

Acceptance criteria
Each event includes time range, category, salience, observation references, relevant telemetry window, and confidence.

Jockey usage prompts
Use Jockey for questions that benefit from autonomous investigation rather than a fixed extraction template.

Recommended golden-session investigations:
1. “Identify the three moments where the athlete’s visible rhythm changes most, describe what changes before and after each moment, and cite timestamps.”
2. “Compare the work intervals. Does the same visible technique pattern recur when output falls or stroke rate rises? Cite all supporting and contradictory moments.”
3. “Find evidence that the athlete recovers or self-corrects after a technique disruption. Explain the sequence with timestamps.”
4. “Which visually observable pattern best distinguishes the strongest interval from the weakest interval? Avoid claims requiring force measurement or exact joint angles.”
5. “Review the entire workout and propose candidate pivotal events that deserve deeper coaching review. Separate direct observations from interpretations.”

Jockey should not be asked to:
- read Concept2 numeric telemetry unless that data is explicitly provided in a supported context
- diagnose injury
- estimate precise joint angles from weak footage
- claim muscle recruitment or force production
- replace the final Wake coach

Pegasus usage prompts
Pegasus should receive a structured observation brief that requests core observations while allowing novel findings.

Prompt goals:
- segment strokes and workout phases where visible
- describe rhythm, pauses, recovery timing, handle and seat motion
- identify visible changes and anomalies
- emit timestamp ranges and confidence
- include provider-native observations not covered by the requested categories

Do not ask Pegasus to generate final coaching language.

Model output rules
All semantic outputs used by the app should be validated into typed structures.

Required common fields:
- id
- source/provider
- startMs
- endMs
- description
- confidence
- evidence references

Generated numbers must not silently override telemetry. Unsupported claims must either be removed or labeled low-confidence interpretation.

Self-turning agents
For hackathon implementation, a small number of explicit prompts is preferable to a complicated graph framework. A Jockey investigation may self-direct internally. Wake should still bound the task, validate its result, and store cited outputs.

Repository discipline
- Keep provider adapters isolated.
- Keep fixtures immutable and versioned.
- Keep UI components free of raw vendor response formats.
- Add tests with every state or normalization change.
- Avoid broad refactors during the demo build.
- Do not introduce LangChain or a workflow framework unless a concrete need appears.

Observability
Record at minimum:
- provider request ID
- prompt version
- model/provider version where available
- latency
- parse/validation outcome
- normalized observation count
- event references

Do not display these traces in the athlete experience.

When Codex should stop and ask
- A requested change conflicts with DESIGN.md.
- A task would make unsupported biomechanics claims.
- New scope affects the demo path or architecture boundaries.
- A provider capability is uncertain and cannot be verified from current documentation.
- Real credentials or irreversible external actions are required.

Definition of a good Codex change
A good change makes the golden Replay more convincing, testable, and maintainable without expanding the product surface or weakening evidence discipline.
WAKE — PROMPTING GUIDE FOR CODEX

Purpose: Give coding agents enough context to build Wake coherently without re-inventing the product, design, or architecture.

1. SOURCE-OF-TRUTH ORDER

Before changing the product, read these documents in order:
1. DESIGN.md — canonical visual and interaction specification
2. Wake — Product Vision — product intent and vocabulary
3. Wake — PRD — hackathon requirements and non-goals
4. Wake — Architecture — provider contracts and reasoning model
5. Wake — Frontend Implementation Guide — component and state guidance
6. Wake — Demo Script — exact winning path

When documents appear to conflict:
- preserve the Product Vision
- follow DESIGN.md for visual decisions
- prefer the narrower hackathon scope in the PRD
- ask before changing product terminology or architecture

2. CORE INSTRUCTION

Build a polished desktop performance Replay for one rowing workout. The Replay and selected coaching insight are primary. Video is synchronized supporting evidence. Do not turn the product into a generic dashboard, chat interface, or video-analysis console.

3. NON-NEGOTIABLE PRODUCT RULES

- Use Wake, never Adaptive Cox.
- The Replay is the primary interaction surface.
- Insight comes before evidence.
- Concept2 data is authoritative for performance metrics.
- Video claims must respect recording geometry.
- Video is compact by default and expandable.
- Show a small number of high-value events.
- The interval breakdown adds interpretation rather than duplicating the timeline.
- The athlete leaves with one next-session action.
- Do not expose hidden reasoning, agent plans, or implementation details in the UI.
- Do not build mobile in the hackathon scope.

4. ENGINEERING PRINCIPLES

Thin vertical slices
Implement one complete, demonstrable path before generalizing.

Fixture first
Render the full successful experience from a reviewed Replay fixture before wiring live providers.

Explicit boundaries
Keep Concept2 parsing, Pegasus, Jockey, event synthesis, coaching, and frontend view models behind separate interfaces.

Typed domain
Represent Session, Interval, Observation, Event, Insight, Evidence, Recommendation, and Replay explicitly.

Deterministic demo
No core interaction may require a live model call.

Observability from the start
Trace provider calls, parsing, synchronization, synthesis, and coaching. Do not add tracing only after failures occur.

5. RECOMMENDED PROJECT SHAPE

src/
  app/
  components/
    replay/
    insight/
    evidence/
    intervals/
    video/
  domain/
    replay.ts
    observation.ts
    event.ts
  providers/
    concept2/
    pegasus/
    jockey/
  fixtures/
    morning-row-replay.json
  lib/
  styles/

tests/
  domain/
  integration/
  e2e/

docs/
  DESIGN.md

Adapt this structure to the chosen framework, but preserve the conceptual boundaries.

6. PROVIDER RULES

Pegasus adapter
Input: one source video plus observation instructions/schema.
Output: timestamped observations in the Observation Provider Contract.

Jockey adapter
Input: knowledge store/session plus a constrained investigation prompt.
Output: structured candidate events or an answer containing cited moments and limitations.

Concept2 adapter
Input: CSV, TCX, FIT, or fixture.
Output: normalized workout clock, phases, intervals, and measurement series.

No provider may directly generate frontend components. Normalize first, then render.

Do not let Jockey override Concept2 measurements. Jockey may propose recurrence, comparison, relevance, and cited moments. Wake validates those proposals.

7. JOCKEY IMPLEMENTATION PROMPT TEMPLATE

Use a narrow domain instruction such as:

“You are investigating completed rowing workouts for Wake. Identify visually supported performance or technique patterns. Treat supplied Concept2 telemetry as authoritative for pace, watts, rate, distance, and interval timing. Do not infer exact joint angles, injury risk, muscle recruitment, or force. Return concise findings with cited video moments, confidence, and limitations.”

Candidate-event task:

“Across the workout videos in this knowledge store, identify at most five pivotal moments that would be useful in a post-workout coaching debrief. Prefer recurring or consequential patterns over isolated visual quirks. Return structured JSON with title, start time, end time, source asset, factual visual observations, why the moment is potentially important, cited moments, confidence, and limitations.”

Recurrence task:

“The selected Wake event is: rate increased while power decreased around 18:10–18:36. Find other cited moments that visually resemble the associated rushed recovery or sequencing change. State whether each example supports, weakens, or is inconclusive for the pattern. Do not restate telemetry you cannot access.”

8. CODING TASK PROMPT TEMPLATE

Use this shape when assigning a slice:

Context
- Read the canonical Wake docs listed above.
- Current slice: [name]
- Existing implementation: [files/components]

Goal
- [one user-visible outcome]

Required behavior
- [specific interactions]
- [data contract]
- [loading/error behavior]

Constraints
- desktop only
- use existing design tokens/components
- do not alter domain vocabulary
- do not add dependencies without justification
- core path must work from fixture data

Acceptance criteria
- [observable checks]
- tests pass
- lint/typecheck pass
- visual hierarchy matches DESIGN.md

Deliverables
- implementation
- tests
- concise summary of decisions and remaining risks

9. EXAMPLE FIRST SLICE

Goal:
Render the Morning Row Replay from fixture data.

Required behavior:
- phase track and four telemetry tracks share one x-axis
- event and coach-cue tracks align to the same clock
- selecting the 18:10 event updates selectedEventId and currentTimeSeconds
- insight, evidence, and compact video render from the selected event
- no provider calls

Acceptance criteria:
- page works offline
- event selection is keyboard accessible
- no duplicated timeline
- video is not the largest page region
- screenshot at 1440px resembles the approved mockup

10. REVIEW CHECKLIST FOR EVERY CHANGE

Product
□ Does this make the workout easier to understand?
…2110 tokens truncated…ontracts

ObservationProviderResult should support:
- provider
- query or prompt
- startTimeMs
- endTimeMs
- observationType
- description
- confidence
- evidence references
- provider-native metadata

Provider-native observations are allowed. Do not constrain frontier models to a closed ontology, but require normalized timestamps and provenance.

9. Coding conventions

- Prefer TypeScript with strict mode.
- Keep domain types independent from React components.
- Separate fixture data, domain logic, provider adapters, and presentation.
- Use pure functions for time mapping and event selection.
- Avoid global mutable state.
- Add runtime validation at external boundaries.
- Keep components small enough to understand, but do not fragment trivial markup.
- Use semantic naming from the product glossary: Replay, Event, Insight, Evidence, Observation, Recommendation.

10. UI instructions

Follow DESIGN.md exactly.

Non-negotiable:
- one full Replay timeline;
- no duplicate telemetry timeline;
- interval comparison belongs in a table;
- dark-first desktop layout;
- restrained teal selection and amber coaching accent;
- one focal point at a time;
- motion explains synchronization;
- low-quality video does not dominate.

11. Demo safety

The main demo must not depend on real-time provider processing. Provider outputs can be generated beforehand and saved as fixtures.

Include graceful fallbacks:
- Pegasus-only fixture;
- Jockey-only supplemental findings;
- fused output;
- no-video state;
- no-heart-rate state.

Never fake a live provider call in a way that could fail during judging. A visible precomputed research result is acceptable when represented honestly as processed workout analysis.

12. Prompt template for a coding slice

Use this structure:

Goal:
Describe one visible outcome.

Context:
Name the canonical docs and relevant product principle.

Scope:
List the components and data involved.

Constraints:
State what must not change.

Acceptance criteria:
Define observable behavior.

Verification:
Specify tests, screenshots, or interaction checks.

Example:

Goal: Build the desktop Replay surface from the session fixture.
Context: Follow DESIGN.md and Frontend Implementation Guide. Replay is the primary interaction surface.
Scope: Phase track, four telemetry tracks, events, coach cues, shared playhead.
Constraints: Do not add video to the top of the page. Do not add a second timeline. Use one normalized time scale.
Acceptance criteria: Clicking an event updates selectedEventId and currentTimeMs; the selected window highlights; keyboard navigation works.
Verification: Unit-test time-to-x mapping and capture a 1440 px screenshot.

13. Agent self-review checklist

Before completing a slice, verify:
- Does this make the Replay clearer?
- Is the athlete receiving an insight rather than raw analysis?
- Is telemetry treated as authoritative?
- Is video secondary by default?
- Are Pegasus and Jockey hidden behind adapters?
- Is confidence proportional to evidence?
- Did the change avoid unnecessary scope?
- Does the demo path remain deterministic?

14. Stop conditions

Stop and ask for direction rather than inventing:
- a new product category;
- a new navigation system;
- mobile scope;
- new branding or colors;
- unsupported biomechanical claims;
- a different provider architecture;
- features outside the hackathon demo path.
WAKE — PROMPTING GUIDE FOR CODEX

Purpose
Use this guide when handing Wake to Codex or another coding agent. It is designed to keep implementation aligned with the product, architecture, and demo rather than producing a sprawling generic AI application.

Required reading order
1. Wake — Product Vision
2. DESIGN.md
3. Wake — PRD
4. Wake — Architecture
5. Wake — Frontend Implementation Guide
6. Wake — Demo Script

Operating principles
- Build the artifact the judge experiences first.
- Prefer the smallest coherent vertical slice.
- Preserve provider boundaries.
- Use frontier models for semantic work; use ordinary code for synchronization, validation, and rendering.
- Keep raw evidence and derived coaching distinct.
- Do not invent capabilities unsupported by the recording geometry or telemetry.

Canonical implementation framing
Wake is a completed-workout coaching Replay.

Inputs:
- workout video
- Concept2 data
- optional heart rate
- optional intent

Output:
- synchronized timeline
- timestamped events
- coach insights
- expandable evidence
- interval comparison
- next-session action

Architecture constraints
Concept2 telemetry is authoritative for pace, watts, stroke rate, distance, intervals, and recorded workout metrics.

Pegasus path:
- deterministic structured observations from an individual video
- timestamped factual descriptions
- provider-native observations allowed
- no coaching or unsupported causality

Jockey path:
- agentic video investigation
- answer broader questions over the indexed workout or video corpus
- test hypotheses and search for recurrence
- return cited, timestamped findings
- may produce novel observations beyond the fixed ontology

Wake path:
- normalize provider outputs
- reconcile them with telemetry
- form events
- produce interpretations and coaching
- preserve provenance and confidence

Do not collapse Pegasus, Jockey, and Wake into one undifferentiated prompt.

Prompt pattern for coding tasks
Every Codex task should include:

Goal
A single user-visible outcome.

Context
Relevant product and architecture principles.

Files to read
Explicit canonical documents and likely source files.

Constraints
Scope boundaries and forbidden changes.

Acceptance criteria
Observable behavior, tests, and visual results.

Out of scope
Adjacent work the agent must not begin.

Example: scaffold the Replay page
Goal
Build the desktop Replay page using the golden-session fixture.

Context
The Replay timeline and selected insight are the product. Video is secondary evidence. The main demo must load immediately without live provider processing.

Files to read
DESIGN.md
Wake — Frontend Implementation Guide
Wake — Demo Script
fixture schema

Constraints
- TypeScript
- one full-session timeline
- no mobile layout
- no upload flow
- no backend orchestration
- no new colors or visual style
- do not add a duplicate expanded timeline

Acceptance criteria
- Page renders the session header, timeline, insight, evidence, video, interval table, and next-session card.
- Selecting an event seeks the video and updates all selected states.
- Selecting an interval highlights its timeline range.
- Keyboard focus works for markers and rows.
- Tests cover time mapping and selection state.

Out of scope
Authentication, persistence, live Twelve Labs calls, responsive mobile UI.

Example: implement provider normalization
Goal
Normalize cached Pegasus and Jockey outputs into Wake observations.

Constraints
- Preserve original provider payloads.
- Never discard provider-native observation types.
- Validate timestamps against video duration.
- Mark source and confidence explicitly.
- Do not generate coaching in this layer.

Acceptance criteria
- Shared Observation type supports known and provider-native categories.
- Invalid ranges fail validation with useful errors.
- Duplicate findings may be linked or merged without erasing provenance.
- Unit tests cover both providers.

Example: synthesize demo events
Goal
Create a deterministic event synthesis step for the golden session.

Inputs
Normalized observations and Concept2 telemetry.

Constraints
- Telemetry facts override contradictory generated numeric claims.
- Events must reference their supporting observations.
- Interpretation is separate from the factual event record.
- Prefer 3–5 pivotal events rather than exhaustive annotation.

Acceptance criteria
Each event includes time range, category, salience, observation references, relevant telemetry window, and confidence.

Jockey usage prompts
Use Jockey for questions that benefit from autonomous investigation rather than a fixed extraction template.

Recommended golden-session investigations:
1. “Identify the three moments where the athlete’s visible rhythm changes most, describe what changes before and after each moment, and cite timestamps.”
2. “Compare the work intervals. Does the same visible technique pattern recur when output falls or stroke rate rises? Cite all supporting and contradictory moments.”
3. “Find evidence that the athlete recovers or self-corrects after a technique disruption. Explain the sequence with timestamps.”
4. “Which visually observable pattern best distinguishes the strongest interval from the weakest interval? Avoid claims requiring force measurement or exact joint angles.”
5. “Review the entire workout and propose candidate pivotal events that deserve deeper coaching review. Separate direct observations from interpretations.”

Jockey should not be asked to:
- read Concept2 numeric telemetry unless that data is explicitly provided in a supported context
- diagnose injury
- estimate precise joint angles from weak footage
- claim muscle recruitment or force production
- replace the final Wake coach

Pegasus usage prompts
Pegasus should receive a structured observation brief that requests core observations while allowing novel findings.

Prompt goals:
- segment strokes and workout phases where visible
- describe rhythm, pauses, recovery timing, handle and seat motion
- identify visible changes and anomalies
- emit timestamp ranges and confidence
- include provider-native observations not covered by the requested categories

Do not ask Pegasus to generate final coaching language.

Model output rules
All semantic outputs used by the app should be validated into typed structures.

Required common fields:
- id
- source/provider
- startMs
- endMs
- description
- confidence
- evidence references

Generated numbers must not silently override telemetry. Unsupported claims must either be removed or labeled low-confidence interpretation.

Self-turning agents
For hackathon implementation, a small number of explicit prompts is preferable to a complicated graph framework. A Jockey investigation may self-direct internally. Wake should still bound the task, validate its result, and store cited outputs.

Repository discipline
- Keep provider adapters isolated.
- Keep fixtures immutable and versioned.
- Keep UI components free of raw vendor response formats.
- Add tests with every state or normalization change.
- Avoid broad refactors during the demo build.
- Do not introduce LangChain or a workflow framework unless a concrete need appears.

Observability
Record at minimum:
- provider request ID
- prompt version
- model/provider version where available
- latency
- parse/validation outcome
- normalized observation count
- event references

Do not display these traces in the athlete experience.

When Codex should stop and ask
- A requested change conflicts with DESIGN.md.
- A task would make unsupported biomechanics claims.
- New scope affects the demo path or architecture boundaries.
- A provider capability is uncertain and cannot be verified from current documentation.
- Real credentials or irreversible external actions are required.

Definition of a good Codex change
A good change makes the golden Replay more convincing, testable, and maintainable without expanding the product surface or weakening evidence discipline.
WAKE — PROMPTING GUIDE FOR CODEX

Purpose: Give coding agents enough context to build Wake coherently without re-inventing the product, design, or architecture.

1. SOURCE-OF-TRUTH ORDER

Before changing the product, read these documents in order:
1. DESIGN.md — canonical visual and interaction specification
2. Wake — Product Vision — product intent and vocabulary
3. Wake — PRD — hackathon requirements and non-goals
4. Wake — Architecture — provider contracts and reasoning model
5. Wake — Frontend Implementation Guide — component and state guidance
6. Wake — Demo Script — exact winning path

When documents appear to conflict:
- preserve the Product Vision
- follow DESIGN.md for visual decisions
- prefer the narrower hackathon scope in the PRD
- ask before changing product terminology or architecture

2. CORE INSTRUCTION

Build a polished desktop performance Replay for one rowing workout. The Replay and selected coaching insight are primary. Video is synchronized supporting evidence. Do not turn the product into a generic dashboard, chat interface, or video-analysis console.

3. NON-NEGOTIABLE PRODUCT RULES

- Use Wake, never Adaptive Cox.
- The Replay is the primary interaction surface.
- Insight comes before evidence.
- Concept2 data is authoritative for performance metrics.
- Video claims must respect recording geometry.
- Video is compact by default and expandable.
- Show a small number of high-value events.
- The interval breakdown adds interpretation rather than duplicating the timeline.
- The athlete leaves with one next-session action.
- Do not expose hidden reasoning, agent plans, or implementation details in the UI.
- Do not build mobile in the hackathon scope.

4. ENGINEERING PRINCIPLES

Thin vertical slices
Implement one complete, demonstrable path before generalizing.

Fixture first
Render the full successful experience from a reviewed Replay fixture before wiring live providers.

Explicit boundaries
Keep Concept2 parsing, Pegasus, Jockey, event synthesis, coaching, and frontend view models behind separate interfaces.

Typed domain
Represent Session, Interval, Observation, Event, Insight, Evidence, Recommendation, and Replay explicitly.

Deterministic demo
No core interaction may require a live model call.

Observability from the start
Trace provider calls, parsing, synchronization, synthesis, and coaching. Do not add tracing only after failures occur.

5. RECOMMENDED PROJECT SHAPE

src/
  app/
  components/
    replay/
    insight/
    evidence/
    intervals/
    video/
  domain/
    replay.ts
    observation.ts
    event.ts
  providers/
    concept2/
    pegasus/
    jockey/
  fixtures/
    morning-row-replay.json
  lib/
  styles/

tests/
  domain/
  integration/
  e2e/

docs/
  DESIGN.md

Adapt this structure to the chosen framework, but preserve the conceptual boundaries.

6. PROVIDER RULES

Pegasus adapter
Input: one source video plus observation instructions/schema.
Output: timestamped observations in the Observation Provider Contract.

Jockey adapter
Input: knowledge store/session plus a constrained investigation prompt.
Output: structured candidate events or an answer containing cited moments and limitations.

Concept2 adapter
Input: CSV, TCX, FIT, or fixture.
Output: normalized workout clock, phases, intervals, and measurement series.

No provider may directly generate frontend components. Normalize first, then render.

Do not let Jockey override Concept2 measurements. Jockey may propose recurrence, comparison, relevance, and cited moments. Wake validates those proposals.

7. JOCKEY IMPLEMENTATION PROMPT TEMPLATE

Use a narrow domain instruction such as:

“You are investigating completed rowing workouts for Wake. Identify visually supported performance or technique patterns. Treat supplied Concept2 telemetry as authoritative for pace, watts, rate, distance, and interval timing. Do not infer exact joint angles, injury risk, muscle recruitment, or force. Return concise findings with cited video moments, confidence, and limitations.”

Candidate-event task:

“Across the workout videos in this knowledge store, identify at most five pivotal moments that would be useful in a post-workout coaching debrief. Prefer recurring or consequential patterns over isolated visual quirks. Return structured JSON with title, start time, end time, source asset, factual visual observations, why the moment is potentially important, cited moments, confidence, and limitations.”

Recurrence task:

“The selected Wake event is: rate increased while power decreased around 18:10–18:36. Find other cited moments that visually resemble the associated rushed recovery or sequencing change. State whether each example supports, weakens, or is inconclusive for the pattern. Do not restate telemetry you cannot access.”

8. CODING TASK PROMPT TEMPLATE

Use this shape when assigning a slice:

Context
- Read the canonical Wake docs listed above.
- Current slice: [name]
- Existing implementation: [files/components]

Goal
- [one user-visible outcome]

Required behavior
- [specific interactions]
- [data contract]
- [loading/error behavior]

Constraints
- desktop only
- use existing design tokens/components
- do not alter domain vocabulary
- do not add dependencies without justification
- core path must work from fixture data

Acceptance criteria
- [observable checks]
- tests pass
- lint/typecheck pass
- visual hierarchy matches DESIGN.md

Deliverables
- implementation
- tests
- concise summary of decisions and remaining risks

9. EXAMPLE FIRST SLICE

Goal:
Render the Morning Row Replay from fixture data.

Required behavior:
- phase track and four telemetry tracks share one x-axis
- event and coach-cue tracks align to the same clock
- selecting the 18:10 event updates selectedEventId and currentTimeSeconds
- insight, evidence, and compact video render from the selected event
- no provider calls

Acceptance criteria:
- page works offline
- event selection is keyboard accessible
- no duplicated timeline
- video is not the largest page region
- screenshot at 1440px resembles the approved mockup

10. REVIEW CHECKLIST FOR EVERY CHANGE

Product
□ Does this make the workout easier to understand?
□ Does it preserve coaching-first language?
□ Is the event or action grounded in evidence?

Design
□ Is there one focal point?
□ Is the Replay still primary?
□ Is color used semantically?
□ Is motion explaining a relationship?
□ Is the video subordinate unless expanded?

Architecture
□ Is provider-specific logic behind an adapter?
□ Is Concept2 telemetry treated as authoritative?
□ Are timestamps normalized?
□ Can the fixture path still run offline?

Code quality
□ Are types explicit?
□ Are components focused?
□ Are state and time controlled centrally?
□ Are tests included for domain behavior?
□ Were unnecessary abstractions avoided?

11. PROHIBITED AGENT BEHAVIOR

Do not:
- replace the design with a familiar SaaS dashboard template
- add mobile layouts, onboarding, auth, or social features without request
- invent fake scientific precision
- label model output as fact without evidence
- add a generic chatbot as the primary interface
- create multiple independent playback clocks
- expose raw chain-of-thought
- redesign the wordmark or palette casually
- add a second redundant telemetry timeline
- perform a broad rewrite when a narrow change is requested

12. CHANGE DISCIPLINE

Before coding:
- inspect the relevant files
- state the minimal plan
- identify the source-of-truth document

While coding:
- preserve working demo behavior
- make small commits or logically separable changes
- prefer adapting existing patterns to introducing new ones

After coding:
- run tests, typecheck, and lint
- capture a desktop screenshot when visual work changed
- compare against DESIGN.md and the mockup
- report what remains mocked, cached, or unverified

13. DEFINITION OF SUCCESS

A new coding agent can enter the repository, read the docs, implement a narrow slice, and produce a result that still unmistakably feels like Wake.

Jockey Prompt Pattern with Concept2 Context

Use this only after Wake has parsed and summarized the Concept2 data. Do not attach or paste the complete raw time series unless a specific experiment proves it necessary.

Prompt template:

You are investigating a rowing workout video using supplied Concept2 telemetry as authoritative numerical context.

Workout context:
{{compact_workout_summary_json}}

Research task:
Inspect only the supplied candidate windows. For each window:
1. State what is directly visible.
2. State whether the visible pattern supports, weakens, or does not resolve the telemetry-based hypothesis.
3. Cite precise video timestamps.
4. Include counterevidence or ambiguity.
5. Do not infer force, joint angles, injury risk, or physiology that cannot be seen.

Return structured JSON containing:
- window_start_s
- window_end_s
- visible_observations
- interpretation_support: supports | weakens | unresolved
- cited_moments
- counterevidence
- confidence

Wake must generate the coaching language after reconciling Jockey's output with Concept2 telemetry and any Pegasus observations. Jockey is an investigator and evidence provider, not the final coach.

Hackathon operating rule:
Run this pattern for three to six curated windows in the hero workout. Prefer focused questions such as "what visibly changes when rate rises but watts fall?" over broad requests such as "analyze the entire workout." Preserve a fixture or cached result so the demo is reliable even if the live Jockey request is slow or unavailable.
