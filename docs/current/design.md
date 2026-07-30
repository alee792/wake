# Wake Design Specification

Status: Canonical visual and interaction direction

Platform: Desktop web

## 1. Product Character

Wake is a performance Replay with coaching.

It should feel:

- observant;
- calm;
- athletic;
- precise;
- trustworthy.

It should not feel:

- like a generic analytics dashboard;
- futuristic or theatrical;
- clinical;
- gamified;
- like a chat application;
- like an agent console.

## 2. Information Hierarchy

The interface communicates:

1. coaching insight;
2. active moment in the Replay;
3. supporting evidence;
4. synchronized video;
5. raw metrics;
6. next-session action.

Present information as:

```text
Insight → explanation → evidence → action
```

Only one element owns visual attention at a time.

## 3. Primary Screen

The first frame contains:

1. compact Wake and session header;
2. full-width Replay;
3. selected insight, evidence summary, and compact video;
4. interval breakdown;
5. next-session card;
6. collapsed provenance affordance.

Desktop target:

- intended recording width: 1440–1728 px;
- minimum graceful width: approximately 1100 px;
- no mobile navigation or mobile-specific components.

Replay remains the widest and most important region. Do not compose the page as a
grid of interchangeable metric cards.

The visual target is documented in
[End-State Reference](end-state-reference.md). Use its reference screenshot for
composition, density, and hierarchy while replacing its stale workout facts.

## 4. Color

Color is semantic and scarce.

### Surfaces

| Token | Value |
|---|---|
| Canvas | `#0B0D10` |
| Raised | `#11151A` |
| Panel | `#171C22` |
| Hairline | `#27303A` |
| Primary text | `#F3F5F7` |
| Muted text | `#8E99A6` |

### Accents

| Meaning | Value |
|---|---|
| Playback and selection | `#62D6CF` |
| Coaching and pivotal moments | `#F3B85C` |
| Success | `#78C69B` |
| Warning | `#E58A73` |
| Uncertainty | `#9C8DCB` |

Rules:

- neutral telemetry by default;
- teal for playback and selected evidence;
- amber for the pivotal coaching moment;
- no rainbow palettes;
- no persistent glow across several elements.

## 5. Typography

Use a modern humanist or neo-grotesk sans-serif.

Fallback:

```text
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
"Segoe UI", sans-serif
```

Use tabular numerals for telemetry.

Suggested scale:

| Role | Size |
|---|---:|
| Primary insight | 30–34 px |
| Page title | 24 px |
| Section title | 18 px |
| Body | 15 px |
| Supporting body | 14 px |
| Label | 12 px |
| Telemetry | 13–16 px |

Use sentence case. The coaching headline should be understood in under three
seconds.

## 6. Geometry

Spacing scale:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

Use:

- 10–12 px panel radii;
- 16–24 px panel padding;
- thin separators;
- tonal elevation before shadows;
- generous hit targets.

Avoid:

- frosted glass;
- heavy blur;
- thick outlines;
- large floating shadows;
- glossy materials.

## 7. Replay

The Replay contains:

- work and recovery phase bands;
- shared time ruler;
- watts track;
- stroke-rate track;
- optional pace or heart rate only if reliable;
- event markers;
- coach cues when useful;
- selected time window;
- shared playhead.

Rules:

- all layers use the same horizontal time scale;
- selected context remains visible before and after the event;
- non-selected data recedes but stays legible;
- labels and hover values are direct and minimal;
- do not duplicate the timeline elsewhere on the page.

## 8. Selected Moment

The selected moment contains:

- timestamp;
- coach headline;
- one-sentence explanation;
- up to three metric deltas;
- concise evidence summary;
- “Why Wake believes this” expansion;
- one recommendation.

Provider names stay out of the headline. Expanded evidence may name providers and
execution mode.

## 9. Evidence

Evidence is grouped by meaning:

- Telemetry
- Visual
- Context or limitation
- Workout pattern

Each item contains:

- factual statement;
- time range;
- provider in expanded state;
- confidence or limitation when useful;
- citation action when it points to another moment.

Prefer two strong evidence items over a long list.

## 10. Video

Video is supporting evidence.

Default:

- compact;
- correctly proportioned;
- mapped to Replay time;
- minimal controls;
- visible timestamp;
- poster fallback.

Do not:

- make low-quality footage the opening hero;
- imply unsupported pose precision;
- depend on a full-session video;
- autoplay with sound.

## 11. Motion

Motion explains synchronization.

Event selection sequence:

1. playhead moves;
2. selected window illuminates;
3. telemetry brightens;
4. insight settles into focus;
5. evidence updates;
6. video seeks or swaps.

Target duration: 220–350 ms.

Use a soft localized insight beacon only on the active pivotal moment. Respect
reduced-motion preferences.

Avoid particles, neural meshes, bouncing cards, and “AI thinking” animation.

## 12. Product Voice

Good:

- “You added rate without preserving power.”
- “The same pattern appeared earlier in the workout.”
- “Hold pressure before building rate.”
- “The video does not clearly resolve the cause.”

Avoid:

- “The agents reached consensus.”
- “AI detected bad form.”
- “The graph proves…”
- “The model diagnosed…”
- unsupported certainty.

## 13. Sponsor Provenance

Sponsor plumbing is hidden by default and inspectable for judges.

The provenance drawer should say:

```text
Video understanding       TwelveLabs
Evidence relationships    Neo4j
Coaching synthesis        OpenAI
Pipeline orchestration    AWS Strands

Reviewed precomputed run
```

Do not show logs, prompts, chain-of-thought, or fake live progress.

## 14. Accessibility

- WCAG AA body-text contrast.
- Visible focus states.
- Primary targets at least 40 × 40 px.
- Meaning is not conveyed by color alone.
- Replay charts have accessible summaries.
- Primary interactions are keyboard reachable.
- Reduced motion preserves state changes without animation.

## 15. Design Definition of Done

- Product is recognizable within ten seconds.
- Replay remains the visual center.
- Hero selection has one clear focal point.
- Evidence is inspectable without becoming a debug view.
- Video supports rather than dominates.
- The complete recorded path fits the chosen viewport.
- Sponsor provenance is understandable in under twenty seconds.
- A screenshot at the target viewport visibly resembles the approved end-state
  reference in hierarchy and density.
