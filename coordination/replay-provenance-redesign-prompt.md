# Replay UI Handoff: Redesign “How Wake Built This Replay”

You are the Replay UI agent. Redesign the provenance experience at the bottom of
the Replay so it is compelling to hackathon judges, tells one coherent product
story, gives every sponsor/system a complete role, and preserves inspectable
technical proof without making the raw build receipt the finale.

## Read First

Before editing, read:

- `coordination/BOARD.md`
- `coordination/DECISIONS.md`
- `coordination/status/replay-ui.md`
- `coordination/DISPATCH.md`
- PR #1, “Bedrock exploration: native inference confirmed”
- `app/src/components/ReplaySupportingPanels.tsx`
- the provenance styles in `app/src/styles/replay.css`

Respect the Replay UI ownership boundary recorded in
`coordination/status/replay-ui.md`. Do not rewrite upstream evidence, model
artifacts, graph artifacts, or shared domain contracts without an explicit lease.

## Outcome

Replace the current numbered, component-to-component assembly-line story with
four connected perspectives on the same Replay.

The experience should make judges understand:

1. this is one product experience, not four sponsor demos stitched together;
2. every system deepens the same athlete-facing answer;
3. OpenAI synthesis really completed through native Amazon Bedrock in PR #1;
4. Wake validates claims and preserves limitations before showing coaching;
5. detailed execution evidence is available, but only when a judge asks for it.

The desired narrative progression is:

**compelling product story → clear system contributions → concise proof →
optional technical inspection**

## Truth Baseline

Use PR #1 as the source of truth for the successful synthesis path:

- AWS Strands used `BedrockModel`.
- The model was `openai.gpt-oss-120b-1:0`.
- Execution used native `bedrock-runtime:Converse` in `us-east-1`.
- OpenAI synthesized the final Concept2, reviewed Pegasus, and Neo4j evidence
  into coaching.
- The run completed in 24.6 seconds with `end_turn`.
- Schema validation passed.
- Citation validation passed.
- The numeric audit passed with 23 matched tokens.
- The accepted output cited four evidence IDs:
  - `candidate-work-2-concept2`
  - `candidate-work-3-concept2`
  - `pegasus-interval-2-vs-3-visual-unresolved`
  - `pegasus-interval-2-vs-4-visual-unresolved`

Do not repeat the obsolete claim that no OpenAI output was accepted. That claim
describes the earlier Bedrock Mantle attempt on the current `main` manifest, not
the successful native Bedrock run in PR #1.

Keep these distinctions accurate:

- Native Bedrock inference succeeded; Bedrock Mantle did not.
- OpenAI synthesized supplied evidence. It did not dispatch or perform the
  Pegasus investigations.
- TwelveLabs observations include unresolved visual findings and camera
  limitations. Do not turn “unresolved” into proof of identical mechanics.
- The Replay is packaged for offline playback; the model does not run when the
  athlete opens this screen.

Treat the reviewed PR #1 run as the accepted product truth even if the PR has
not yet merged. Do not let branch state block the redesign. Implement the
judge-facing experience against the verified values above, then wire it to the
final integrated artifact when that artifact lands. Do not derive the new state
from the stale manifest on `main`.

## UX Direction

### 1. Collapsed State

Keep the bottom section compact when collapsed, but make it sound like product
value rather than implementation provenance.

Use:

**Title**

> How this Replay earns trust

**Subtitle**

> One workout · four connected systems · verified OpenAI synthesis

The expand control must remain a real accessible button with correct
`aria-expanded` and `aria-controls`.

### 2. Expanded Introduction

Remove “Behind the Replay” and the current pipeline-oriented introduction.

Use:

**Eyebrow**

> Inside this Replay

**Headline**

> Every answer stays connected to the moment that earned it.

**Body**

> Wake brings performance, video, evidence, and coaching together around one
> shared workout clock. That connection lets every insight lead back to the
> numbers, footage, comparisons, and limitations behind it.

### 3. Four System Stories

Remove the `01–04` numbering. Numbers imply sequential handoffs and make the
systems feel stitched together.

Remove the separate sponsor-role strip beneath the cards. It duplicates the
cards and reinforces the “parts bin” presentation.

Present four equal stories in a polished grid. Each card should have:

- a quiet system-name eyebrow;
- a benefit-led title;
- one complete paragraph that reaches from input to athlete-facing result;
- no arrows or “then it passes to…” pipeline language.

Use this exact copy as the initial implementation:

#### TwelveLabs

**Title**

> See what the metrics can’t

**Body**

> Wake sends telemetry-selected moments to TwelveLabs on a clock aligned with
> the workout. Its reviewed observations return with exact timestamps and camera
> limitations, become connected evidence in Neo4j, and open as the right clip
> when the athlete explores the Replay.

#### Neo4j

**Title**

> Keep the whole explanation connected

**Body**

> Neo4j links each coaching claim to the performance window, video observation,
> relevant comparison, counterevidence, and known limitations behind it. That
> connected context shapes the coaching and lets every citation move the Replay
> to the moment it describes.

#### OpenAI

**Title**

> Turn connected evidence into coaching

**Body**

> OpenAI synthesizes the performance comparisons, reviewed video findings, and
> limitations connected by Neo4j into a concise coaching response. Every claim
> must cite the supplied evidence and pass Wake’s schema, citation, and numeric
> checks before it reaches the Replay.

#### AWS Strands

**Title**

> Carry the evidence through safely

**Body**

> Strands retrieves the bounded evidence bundle from Neo4j, gives it to the
> OpenAI model through Amazon Bedrock, and validates the result before Wake
> packages it. The workflow keeps the coaching connected to its sources from
> graph query to athlete-facing answer.

### 4. Replace the Raw Receipt Finale

Do not show the current row of raw provider/service/disposition cards in the
main expanded experience.

End the story with one compact verification bar:

> **Verified build** · OpenAI synthesis completed · 4 evidence citations · 23
> numeric checks passed · packaged for offline playback

Add a secondary action:

> View verification

This is the judge-facing proof point. It should look confident and compact, not
like a debug console.

### 5. Verification Drawer

“View verification” should open a nested drawer, dialog, or disclosure that
contains the technical evidence a judge may want to inspect.

Show:

- status: verified;
- model: `openai.gpt-oss-120b-1:0`;
- orchestration: AWS Strands `BedrockModel`;
- route: Amazon Bedrock native `bedrock-runtime:Converse`;
- region: `us-east-1`;
- run result: completed, `end_turn`, 24.6 seconds;
- schema validation: passed;
- citation validation: passed;
- numeric audit: passed, 23 matched tokens;
- four cited evidence IDs;
- build/recording mode: reviewed build-time run, packaged for offline playback;
- a concise limitations note explaining that video evidence remained unresolved
  where the camera could not support a mechanical conclusion.

Preserve exact service and execution metadata only inside this deeper
verification surface. If retaining the manifest-driven receipt is useful, place
it behind a final tertiary disclosure such as “Technical manifest”; it must not
be the first thing judges see.

Do not expose stale failed-Mantle or manual-fallback cards as the current build
state. Historical failed attempts do not belong in the primary verification
story. If history must remain inspectable, label it explicitly as superseded.

## Visual and Interaction Guidance

- Preserve the established dark Replay visual system.
- Make the section feel editorial and intentional, not like an infrastructure
  dashboard.
- Use typography, spacing, and a restrained shared accent to visually connect
  the four stories.
- Do not use large vendor logos, a pipeline diagram, sequential arrows, or
  numbered steps.
- A subtle shared rule, glow, or background field across the four cards is
  acceptable if it reinforces that they describe one Replay.
- Keep card heights visually balanced at the target recording viewport.
- Use minimal motion: a short expand/fade/translate transition is enough.
- Respect `prefers-reduced-motion`.
- Preserve visible keyboard focus, semantic headings, and accessible disclosure
  behavior.
- On narrow screens, stack the stories in the same narrative order:
  TwelveLabs, Neo4j, OpenAI, AWS Strands.

## Files Likely in Scope

- `app/src/components/ReplaySupportingPanels.tsx`
- `app/src/styles/replay.css`
- focused UI tests for the provenance interaction
- a small fixture or adapter for the verified PR #1 values if needed

Avoid broad refactors. Do not alter unrelated interval, next-session, timeline,
media, or Ask Wake behavior.

## Acceptance Criteria

1. The section no longer presents a numbered four-step pipeline.
2. The separate sponsor-role strip is removed.
3. All four system stories use the approved copy above.
4. The OpenAI story accurately reflects the successful PR #1 native Bedrock run.
5. The main expanded experience ends with the compact verified-build bar.
6. Technical details are available through “View verification,” not dumped into
   the primary story.
7. No current-state copy says OpenAI output is pending, unavailable, or
   unaccepted.
8. No copy claims OpenAI dispatched Pegasus analysis or that unresolved video
   proved identical mechanics.
9. Collapsed and expanded states are polished at the recording viewport and
   responsive at narrow widths.
10. Keyboard navigation, disclosure semantics, focus states, and reduced motion
    are verified.
11. Existing Replay behavior outside this section remains unchanged.
12. Relevant tests and the production build pass.

## Verification and Handoff

After implementation:

1. run focused tests;
2. run `npm test`;
3. run `npm run build`;
4. inspect collapsed, expanded, and verification-open states in Chrome at the
   recording viewport;
5. inspect the narrow responsive state;
6. confirm no external resources are requested at runtime;
7. capture screenshots of the expanded story and open verification surface;
8. update `coordination/status/replay-ui.md` with files changed, test results,
   screenshots, and any remaining artifact-wiring detail.

When reporting completion, lead with what judges now see and understand. Keep
implementation detail secondary.
