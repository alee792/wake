# Wake Frontend Implementation Guide

Status: Canonical implementation reference

Target: Desktop recording build

## 1. Implementation Goal

Render one completed workout from a deterministic `ReplayFixture`. The browser
must work offline and must not reconstruct coaching, graph relationships, or
provider logic.

Priority:

1. complete first frame;
2. synchronized hero selection;
3. evidence and recurrence;
4. next-session action;
5. sponsor provenance;
6. decorative polish.

Before implementing layout, inspect
[End-State Reference](end-state-reference.md). It is the visual acceptance target
for the opening frame.

## 2. Suggested Stack

- Vite
- React
- TypeScript
- plain CSS or CSS modules
- lightweight SVG telemetry
- native HTML video

Avoid a router, charting framework, state framework, or UI kit unless already
present and working. One route is sufficient.

## 3. Component Structure

```text
ReplayPage
├── SessionHeader
├── ReplaySurface
│   ├── PhaseTrack
│   ├── TelemetryTracks
│   ├── EventTrack
│   └── ReplayPlayhead
├── SelectedMoment
│   ├── InsightPanel
│   ├── EvidencePanel
│   └── VideoEvidence
├── IntervalBreakdown
├── NextSessionCard
└── ProvenanceDrawer
```

Name components for the product, not generic dashboard primitives.

## 4. Shared State

One controller owns:

```ts
type ReplayState = {
  currentTimeSeconds: number
  selectedEventId: string
  selectedIntervalId?: string
  evidenceExpanded: boolean
  provenanceExpanded: boolean
  videoExpanded?: boolean
}
```

Rules:

- every time-based component reads the same `currentTimeSeconds`;
- video playback may update the shared clock;
- no component owns an independent chart or media cursor;
- components receive state and callbacks rather than importing separate fixture
  copies.

## 5. Fixture Shape

```ts
type ReplayFixture = {
  schemaVersion: "1.0"
  session: Session
  phases: Phase[]
  intervals: Interval[]
  telemetry: TelemetrySample[]
  events: ReplayEvent[]
  explanations: Record<string, ExplanationBundle>
  recommendations: Recommendation[]
  mediaMappings: MediaMapping[]
  initialState: ReplayState
  buildManifest: BuildManifest
}
```

All time fields use global elapsed seconds in the range 0–1680.

The UI may derive coordinates, interpolation, and hover values. It must not derive
event meaning or coaching conclusions.

## 6. Event Selection Contract

Selecting an event:

1. sets `selectedEventId`;
2. sets the shared time to the event focus;
3. selects its containing work interval;
4. updates the explanation bundle;
5. highlights the event window across all tracks;
6. resolves the matching media mapping;
7. moves visual focus to the insight.

Selecting a recurrence citation runs the same event-selection path for the cited
event.

Selecting an interval highlights its range and may select its primary event.

If a third Pegasus highlight is available, expose it as another event marker or
cited-moment chip. Do not add a separate clip browser.

## 7. Replay Rendering

Use one x-scale:

```text
x = plotLeft + (seconds / sessionDurationSeconds) × plotWidth
```

Required tracks:

- watts;
- stroke rate;
- work/recovery phases;
- events;
- shared playhead.

Downsample for display before rendering. Avoid recalculating entire SVG paths on
every playback frame.

The selected event window spans all relevant tracks. Use teal for selection and
amber for the pivotal marker.

## 8. Evidence and Explanation

The panel consumes one `ExplanationBundle`.

Collapsed:

- insight;
- short explanation;
- two evidence summaries;
- “Why Wake believes this.”

Expanded:

- supporting evidence;
- contradicting or limiting evidence;
- real provider and generation mode;
- recurrence citation;
- drill.

The live and cached Neo4j result have identical shapes. The component does not
branch on database availability.

## 9. Media Mapping

```ts
type MediaMapping = {
  replayStartSeconds: number
  replayEndSeconds: number
  assetId: string
  mediaStartSeconds: number
  poster?: string
}
```

To seek:

```text
mediaTime =
  mediaStartSeconds + (currentTimeSeconds - replayStartSeconds)
```

Clamp to the valid media range. If the asset is missing, render its poster and the
Replay timestamp without breaking selection.

## 10. Interval Breakdown

Use work intervals only unless recovery values are essential.

Recommended columns:

- interval;
- work time;
- meters;
- pace;
- watts;
- stroke rate;
- Wake insight.

Rows select their Replay ranges. Do not add sorting, filtering, pagination, or
editing.

## 11. Provenance Drawer

Render from `buildManifest`.

For each sponsor show:

- role;
- provider/service;
- execution mode;
- reviewed state.

Do not display secrets, raw prompts, logs, or invented provider IDs.

## 12. Loading and Failure States

The golden fixture is bundled with the app, so the normal recorded path has no
loading screen.

Failures:

- missing video → poster;
- missing heart rate → omit track;
- malformed optional evidence → hide item and retain insight;
- unavailable network → no effect;
- unavailable provider → already represented through manifest and cache.

## 13. Accessibility and Recording QA

- Primary controls are keyboard reachable.
- Charts include a selected-event text summary.
- Focus states are visible.
- Reduced motion simplifies the coordinated transition.
- Target viewport contains the hero path without horizontal overflow.
- Avoid hover-only facts in the narration.

## 14. Verification

Before recording:

- production build succeeds;
- direct route reload succeeds;
- app works with network disabled;
- hero click synchronizes every visible layer;
- recurrence click seeks correctly;
- interval selection works;
- evidence and provenance expand and collapse;
- all timestamps and deltas match the fixture;
- local media or poster loads;
- no console-breaking error remains;
- first useful render is under two seconds.
- a target-viewport screenshot matches the reference hierarchy: header, dominant
  Replay, selected moment row, interval comparison, and next-session action.

## 15. Scope Cuts

Cut first:

1. free-form Ask Wake;
2. Jockey-specific UI;
3. full-session video;
4. video expansion;
5. heart-rate track;
6. extra events and telemetry;
7. decorative motion;
8. nonessential navigation.

Never cut:

- full-session Replay context;
- one shared clock;
- hero selection;
- inspectable evidence;
- recurrence seek;
- next-session drill;
- sponsor provenance;
- offline reliability.
