<!-- Imported from https://docs.google.com/document/d/17dW3y-9Kkt3Oep1aJKLC9gb5VeEGhCL39-akFuE5_Js/edit | Drive modified 2026-07-30T17:57:36.118Z -->

Wake — Frontend Implementation Guide

Status: Canonical for hackathon implementation
Platform: Desktop web

1. Purpose

This guide translates Wake’s product and design direction into a buildable frontend structure. It is implementation guidance, not a replacement for DESIGN.md.

2. Experience hierarchy

The page should communicate this order:

Replay → selected insight → evidence → expandable video → interval comparison → next session.

The Replay is the primary interaction surface. Video is synchronized evidence and remains secondary until expanded.

3. Primary screen

Desktop target: 1440 px and above.

Main regions:
- Compact left navigation rail.
- Session header with title, date, duration, distance, machine, and verification state.
- Full-width Replay with workout phases, telemetry tracks, events, coach cues, and one shared playhead.
- Insight, evidence, and video row.
- Interval Breakdown table and Next Session card.

Do not include a second full telemetry timeline. The Interval Breakdown provides comparison rather than duplication.

4. Component tree

AppShell
  NavigationRail
  ReplayPage
    SessionHeader
    ReplaySurface
      PhaseTrack
      TelemetryTracks
      EventTrack
      CoachCueTrack
      Playhead
    MomentWorkspace
      InsightPanel
      EvidencePanel
      VideoEvidence
    IntervalBreakdown
    NextSessionCard

5. State model

Canonical shared state:
- currentTimeMs
- isPlaying
- selectedEventId
- selectedIntervalId
- expandedEvidenceId
- videoMode: embedded | expanded

All time-based components read from the same currentTimeMs. Never maintain independent chart and video cursors.

Selecting an event must:
- seek the shared playhead;
- select the relevant insight;
- update evidence;
- seek video;
- highlight the containing interval.

Selecting an interval must:
- highlight its range in Replay;
- update interval selection;
- focus its highest-priority event when available.

6. Replay implementation

Use one normalized time scale across all tracks. Layers may have different sampling rates but must map to the same x coordinate.

Telemetry authority:
- Concept2 values are authoritative for pace, watts, stroke rate, distance, and intervals.
- Heart rate is authoritative when supplied by the connected sensor stream.
- Video-derived estimates must not overwrite telemetry.

Rendering guidance:
- Prefer SVG or canvas for synchronized charts.
- Keep non-selected series muted.
- Use teal for playback and selection.
- Use amber only for coaching moments.
- The selected time window may receive a restrained glow.

7. Video behavior

Default embedded video is supporting evidence.

Requirements:
- preserve aspect ratio;
- seek from shared currentTimeMs;
- show timestamp;
- expose expand control;
- avoid autoplay with sound;
- do not make the low-quality recording visually dominant.

Expanded mode may occupy the main workspace while retaining a compact Replay strip.

8. Insight panel

Required fields:
- concise coach headline;
- timestamp or range;
- short explanation;
- key metric deltas;
- confidence;
- action or recommendation.

Top-layer copy sounds like a coach. Provider names, agents, and internal chain-of-thought never appear in the default UI.

9. Evidence panel

Evidence types:
- Telemetry
- Visual
- Technique
- Heart rate
- Context

Each item includes source, time range, short factual statement, and confidence. Expanded evidence may expose provider provenance, including Pegasus or Jockey, for judges or advanced users.

10. Interval Breakdown

Columns for the hackathon:
- interval;
- time;
- meters;
- pace;
- watts;
- stroke rate;
- heart rate;
- Wake insight.

Rows are clickable and synchronized with Replay. No sorting, filtering, pagination, editing, or exports are needed for the demo.

11. Next Session card

Show one focus and one drill. It should complete the flow from observation to action.

12. Data fixtures

Use the supplied Concept2 CSV/TCX/FIT data as the canonical fixture. Precompute a normalized session JSON containing:
- metadata;
- phases and intervals;
- telemetry samples;
- events;
- insights;
- evidence;
- recommendations;
- media references.

The frontend should render from this fixture without depending on live processing during the demo.

13. Loading and failure states

Hackathon requirement:
- deterministic fixture loads instantly;
- missing video leaves Replay usable;
- missing heart rate hides that track cleanly;
- provider failures degrade to available evidence;
- never block the Replay because one modality is unavailable.

14. Accessibility

- Minimum 4.5:1 contrast for body text.
- All controls keyboard reachable.
- Visible focus states.
- Do not encode meaning through color alone.
- Respect reduced-motion preferences.
- Charts need text summaries for selected events.

15. Definition of done

The build is ready when a judge can:
- understand the workout structure immediately;
- click an event and see all surfaces synchronize;
- understand one strong coaching insight;
- inspect supporting evidence;
- compare intervals;
- leave with one concrete next-session action.
WAKE — FRONTEND IMPLEMENTATION GUIDE

Status
Canonical implementation guidance for the hackathon web demo. DESIGN.md remains the authority for visual decisions.

Scope
Desktop web only. Build one excellent completed-workout Replay. Do not spend hackathon time on mobile, onboarding, billing, social features, or generalized dashboard navigation.

Primary page hierarchy
1. Session header
2. Replay timeline
3. Selected insight, evidence, and synchronized video
4. Interval Breakdown
5. Next Session action

The Replay is the primary interaction surface. The timeline is its temporal backbone. Video is supporting evidence and can be expanded on demand.

Recommended stack
- React or Next.js with TypeScript
- Tailwind CSS or CSS variables driven by DESIGN.md tokens
- Recharts, Visx, or lightweight SVG for telemetry
- Native HTML video element
- Framer Motion only for a few meaningful transitions
- Static fixture JSON for the golden session

Do not introduce a complex workflow framework into the frontend.

Route
/replays/:replayId

Core state
ReplayState
- currentTimeMs
- durationMs
- isPlaying
- selectedEventId
- selectedIntervalId
- expandedEvidence
- videoExpanded

Data objects
Replay
- id
- title
- startTime
- duration
- source assets
- phases[]
- telemetry series
- intervals[]
- observations[]
- events[]
- insights[]
- recommendation

Observation
- id
- provider: pegasus | jockey | telemetry | hr | manual
- type
- startMs
- endMs
- description
- confidence
- evidenceRefs[]
- providerNativePayload optional

Event
- id
- startMs
- endMs
- category
- salience
- observationRefs[]
- telemetryWindow

Insight
- id
- headline
- explanation
- eventRefs[]
- evidenceRefs[]
- confidence
- recommendationRef

Component tree
ReplayPage
├── AppRail
├── SessionHeader
├── ReplayTimeline
│   ├── PhaseTrack
│   ├── TelemetryTrack × 4
│   ├── EventTrack
│   ├── CoachCueTrack
│   └── Playhead
├── ReviewWorkspace
│   ├── InsightPanel
│   ├── EvidencePanel
│   └── VideoEvidence
├── IntervalBreakdown
└── NextSessionCard

Replay synchronization contract
A single currentTimeMs value controls:
- timeline playhead
- HTML video currentTime
- active telemetry values
- event activation
- selected evidence window

Selecting an event must:
1. set selectedEventId
2. seek currentTimeMs to the event anchor
3. update insight and evidence panels
4. highlight the event window across telemetry
5. move visual focus to the insight

Selecting an interval must:
1. set selectedIntervalId
2. highlight its timeline range
3. update interval comparison context
4. optionally seek to its first meaningful event

Timeline rules
- Render one full-session timeline only.
- Align all tracks to the same x-scale.
- Use phase bands at the top.
- Keep unselected telemetry subdued.
- Selected windows brighten; do not redraw into a duplicate chart.
- Event markers remain clickable at normal desktop widths.
- Scrubbing should update video continuously when performant, otherwise on pointer release.

Insight panel
Always lead with the coach statement. Structure:
Headline
Explanation
Key metric deltas
Context across the workout
Action or drill link

Do not show raw model output, internal agents, or chain of thought.

Evidence panel
Evidence items should include:
- source label
- concise factual statement
- timestamp or range
- confidence
- optional thumbnail or micro-chart

Evidence provider labels may include Pegasus and Jockey inside expanded provenance, but top-level user language should remain Telemetry, Visual, Technique, and Workout Pattern.

Video behavior
- Default size is secondary to the Replay and insight.
- Maintain aspect ratio without forcing a cinematic crop.
- Use the real low-quality consumer capture honestly.
- Expand video through a clear button.
- Expanded state may use a modal or rearranged split view.
- Seeking from timeline or evidence must remain synchronized.

Interval Breakdown
Columns for hackathon fixture:
Interval, time, meters, pace, watts, stroke rate, heart rate, Wake insight.

Requirements:
- one selected row
- click-to-sync
- no sort, filter, pagination, export, or editing
- concise interpretation in final column

Motion
Implement only:
- playhead glide
- selected event focus glow
- telemetry window illumination
- evidence expansion
- video expansion

All related elements should settle within roughly 250–450 ms. Respect prefers-reduced-motion.

Attention model
Only one element owns expressive emphasis. Normally this is the selected insight. The active timeline window may glow softly, but should not compete with the insight headline.

Loading and errors
For the demo, load a fixture immediately. Preserve states for future implementation:
- processing
- ready
- partial evidence
- unavailable provider

If Jockey is unavailable, display the cached or Pegasus-backed Replay without breaking the experience. Provider status belongs in provenance, not in the coaching headline.

Fixture strategy
Store a complete golden-session fixture in version control. Include:
- real Concept2 interval values
- sampled telemetry arrays
- selected video asset path
- Pegasus observations
- Jockey cited findings
- synthesized events
- coach insights

Keep provider raw responses separately from normalized fixture data.

Accessibility
- Full keyboard access to event markers and interval rows
- Visible focus states
- Text alternatives for chart insights
- Do not rely on color alone
- Minimum readable contrast in dark theme
- Reduced motion support

Performance targets
- First meaningful render under 2 seconds with local fixtures
- Timeline interactions under 100 ms
- Smooth playhead at common desktop frame rates
- Avoid rerendering the full chart tree on every video timeupdate; throttle or use animation frames

Hard constraints for coding agents
- Read DESIGN.md before changing UI.
- Do not make video the hero.
- Do not add a second telemetry timeline.
- Do not invent new accent colors.
- Do not add generic AI gradients or particles.
- Do not expose agents in the default experience.
- Do not add features outside the golden demo path without explicit approval.

Definition of done
A user can open the Replay, select a meaningful event, understand the coaching insight, inspect synchronized evidence, compare intervals, and leave with one next-session action.
WAKE — FRONTEND IMPLEMENTATION GUIDE

Status: Hackathon implementation reference
Canonical visual source: DESIGN.md
Target: Desktop web, 1440px-first

1. IMPLEMENTATION PRIORITIES

Build the artifact judges will experience, not a processing dashboard.

Priority order:
1. Coherent Replay layout
2. Perfect synchronization and selection behavior
3. One excellent insight and evidence state
4. Interval breakdown
5. Expandable video
6. Jockey follow-up
7. Decorative polish

Do not build mobile for the hackathon.

2. PAGE STRUCTURE

App shell
- compact left navigation rail
- main content area
- no persistent right sidebar

Replay page
- SessionHeader
- ReplayTimeline
- SelectedMomentRow
  – InsightPanel
  – EvidencePanel
  – VideoEvidence
- BottomRow
  – IntervalBreakdown
  – NextSessionCard
- optional AskWakePopover or AskWakeDrawer

The Replay occupies the top and widest region. The lower section must not repeat the same telemetry chart.

3. COMPONENT TREE

ReplayPage
├─ AppRail
├─ SessionHeader
├─ Replay
│  ├─ PhaseTrack
│  ├─ TelemetryTracks
│  ├─ EventTrack
│  ├─ CoachCueTrack
│  └─ ReplayPlayhead
├─ SelectedMoment
│  ├─ InsightCard
│  ├─ EvidenceList
│  └─ VideoEvidence
├─ IntervalBreakdown
├─ NextSessionCard
└─ AskWake

Keep chart primitives reusable, but do not abstract the product vocabulary away. Components should be named for the experience, not generic dashboard widgets.

4. REPLAY DATA CONTRACT

The page should render from one denormalized Replay JSON payload.

Suggested top-level shape:
- session
- sources
- phases
- intervals
- telemetry
- events
- coachCues
- selectedEventId
- recommendations
- videoMappings
- agentAnswers

The frontend must not synthesize coaching conclusions or recompute event logic. It may derive display coordinates, interpolation, and hover values.

5. STATE MODEL

Core state:
- currentTimeSeconds
- isPlaying
- selectedEventId
- selectedIntervalId
- hoveredTimeSeconds
- videoExpanded
- evidenceExpanded
- askWakeOpen
- askWakeSessionId
- askWakeStatus

Selection rules:
- selecting an event sets selectedEventId and seeks currentTime to its focus time
- selecting an interval highlights its range and chooses its primary event when available
- scrubbing the Replay updates video and metric readouts
- video playback updates the shared current time
- opening expanded video does not create a second clock

Use a single Replay controller/context or state machine so components cannot drift.

6. TIMELINE AND CHARTS

Render phase regions and telemetry tracks against the same x-scale.

Required tracks:
- pace
- power
- stroke rate
- optional heart rate
- events
- coach cues

Rules:
- selected event window receives subtle teal luminance
- selected pivotal event may use amber marker treatment
- nonselected data is subdued
- avoid multiple y-axis labels and chart-library chrome
- make exact values available on hover or selection rather than labeling every point
- keep gridlines quiet
- use the supplied Concept2 data values rather than fabricated chart shapes

For the fixture, precompute display-ready samples at an appropriate resolution.

7. ATTENTIONAL MOTION

Motion directs attention; it never depicts AI thinking.

Event selection sequence:
1. playhead glides to the event
2. event window illuminates
3. relevant telemetry brightens
4. insight gains a soft beacon
5. evidence settles into place
6. video seeks

All parts should feel like one disturbance propagating through a connected system.

Timing guidance:
- hover: 120–160ms
- selection transitions: 220–320ms
- panel expansion: 240–360ms
- use reduced-motion alternatives

Never use particles, neural meshes, bouncing cards, or continuous pulsing.

8. INSIGHT PANEL

Hierarchy:
- small “Key insight” label
- large coach headline
- one-sentence explanation
- up to three metric deltas
- brief context
- one action to expand

The headline is the primary text object. Do not show provider names or confidence jargon in the default state.

9. EVIDENCE PANEL

Group by evidence type:
- Telemetry
- Visual
- Technique
- optional Context

Each evidence item contains:
- icon
- label
- factual one-line statement
- timestamp or sparkline/thumbnail where useful
- source/provenance in expanded state

The panel should prove the insight without becoming a debug log.

10. VIDEO EVIDENCE

Default video is compact and visually secondary.

Requirements:
- synchronized playhead
- seek on event selection
- visible timestamp
- play/pause
- expand/collapse
- optional playback speed

Expanded video may take more screen but should preserve access to the selected insight and timeline context.

Never stretch low-quality source footage into the hero background.

11. INTERVAL BREAKDOWN

Columns for the demo:
- interval
- time
- meters
- pace
- watts
- stroke rate
- heart rate when available
- Wake insight

Use no more quantitative columns than fit comfortably. Selecting a row highlights the corresponding Replay phase.

The Wake insight column is essential. It converts a Concept2-style split table from data into coaching context.

12. NEXT SESSION CARD

Show:
- one focus statement
- one short explanation
- one recommended drill
- optional “Add to plan” affordance

Do not build full planning behavior unless all core Replay interactions are finished.

13. ASK WAKE / JOCKEY UI

Keep the agent surface small and contextual.

Recommended pattern:
- “Ask about this workout” button near evidence or selected insight
- popover or drawer with two suggested prompts
- one concise answer with cited moment chips
- clicking a citation seeks the Replay

Suggested prompt:
“Where else does this pattern occur?”

Suggested answer structure:
- direct conclusion
- two cited moments
- one limitation

Never display chain-of-thought, tool calls, agent plans, or a generic chat homepage.

14. FIXTURE-FIRST IMPLEMENTATION

Create a committed Replay fixture containing the full successful demo state. Provider adapters may generate the same schema, but the page should not depend on live analysis.

Suggested structure:
/src/fixtures/morning-row-replay.json
/src/providers/pegasus.ts
/src/providers/jockey.ts
/src/domain/replay.ts
/src/components/replay/*

The fixture must include cached Jockey answers and citations.

15. RESPONSIVE BEHAVIOR

Hackathon target is desktop. Support graceful narrowing to approximately 1100px, but do not design a mobile navigation or mobile Replay.

At narrower desktop widths:
- reduce rail width
- stack evidence beneath insight/video only if needed
- preserve the timeline width
- never hide the selected insight

16. ACCESSIBILITY

- Meet contrast requirements for text and controls
- Do not communicate state by color alone
- Provide keyboard event selection and playback controls
- Add visible focus styles
- Honor prefers-reduced-motion
- Give charts accessible summaries
- Label metric units explicitly

17. PERFORMANCE

- Load the fixture immediately
- Lazy-load the video
- Avoid rerendering all chart paths on every playback frame
- Update the playhead with requestAnimationFrame or a lightweight external store
- Cache mapped x-coordinates and downsampled series
- Preload the selected event thumbnail

18. DEFINITION OF DONE

The page matches DESIGN.md and the approved desktop mockup.

Selecting the 18:10 event synchronizes every visible layer.

The interval table selects the corresponding Replay range.

Video expands and collapses without losing context.

The Jockey follow-up returns cited moments and those citations seek the Replay.

The complete demo works with the network disabled except for an optional live Jockey call.
