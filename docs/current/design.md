<!-- Imported from https://docs.google.com/document/d/1RLc6cbFzn_bWLjHW26Tnxk2ryen8jNS1NwZYF8mVCqw/edit | Drive modified 2026-07-30T17:38:28.553Z -->

DESIGN.md

Wake — Canonical Product Design Specification

Status: Canonical
Product: Wake
Platform: Web
Theme: Dark-first
Scope: Hackathon demo

Purpose

This document is the source of truth for Wake’s visual language, interaction model, product vocabulary, and implementation constraints. Human designers and coding agents should follow it unless an explicit product decision supersedes it.

Wake reconstructs a performance over time and helps an athlete understand what mattered, why it mattered, and what to do next.

Brand and Product Positioning

Wake is not a fitness dashboard.
Wake is not a video-analysis tool.
Wake is a performance replay with coaching.

The experience should feel like sitting beside an attentive coach reviewing a workout together. It is observant, calm, athletic, exact, and trustworthy. It is not futuristic, gamified, clinical, corporate, or flashy.

Core Design Principles

Replay is the product

Replay is Wake’s primary interaction surface: a synchronized view of the workout combining phases, telemetry, events, coaching, evidence, and video. Every major feature should contribute to or extend the Replay.

Insight before evidence

Never require the athlete to interpret raw data before understanding the point. Present information in this order:

Insight → explanation → evidence → recommendation.

Moments first, context always

Important moments anchor the experience, but they must remain situated within the workout before and after them. Do not isolate an event from its temporal context.

One focal point

Only one element should own visual attention at a time. All other elements should support it.

Calm until meaningful

The interface remains visually quiet until something deserves emphasis. Persistent glow, saturated color, and constant animation are prohibited.

Motion follows understanding

Animation must reveal a relationship, transition, or change in attention. It is not decoration.

Technology disappears

Users should experience coaching, not agent orchestration. Do not expose internal model roles, chain-of-thought, or “AI magic” language.

Information Hierarchy

1. Coaching insight
2. Active moment in Replay
3. Supporting evidence
4. Video
5. Raw metrics

Video is supporting evidence by default. It may expand on demand, but it should not dominate the initial layout.

Desktop Scope

The hackathon product is desktop web only.

Design target:
- Primary canvas: 1440–1728 px wide
- Minimum supported desktop width: 1280 px
- No mobile-specific components or responsive redesign work unless required to prevent breakage

Primary Screen Anatomy

1. Compact application header
2. Session header and workout summary
3. Replay as the central visual region
4. Primary insight panel
5. Evidence and recommendation region
6. Secondary expandable video panel

Recommended initial viewport allocation:
- Header and session context: 12–15%
- Replay: 38–45%
- Insight and evidence: 30–35%
- Video preview: 15–22%

Brand Expression

Wake should feel modern and human, not severe or science-fictional.

Wordmark direction

Use a soft contemporary sans-serif wordmark with natural spacing. Prefer title case “Wake” over widely tracked all-caps. A subtle custom W may suggest divergence or motion, but the effect must be nearly invisible.

Avoid:
- Extended sci-fi letterforms
- Sharp aggressive geometry
- ALIEN-style spacing
- Oars, boats, waves, brains, sparkles, or obvious AI symbols
- A logo that locks the brand to rowing

Voice and Tone

The product voice is confident, economical, and coach-like.

Good:
“You’re chasing the rate here.”
“Recovery shortens late in the interval.”
“Good reset. Hold this rhythm.”
“Power rises without extra rate.”

Avoid:
“AI detected a multimodal anomaly.”
“Our agents reached consensus.”
“Efficiency score decreased by 14%.”
“The system inferred…”

Color System

Color is semantic and scarce.

Base surfaces
- Canvas / Ink: #0B0D10
- Raised / Graphite: #11151A
- Panel / Slate: #171C22
- Hairline: #27303A
- Muted text: #8E99A6
- Primary text: #F3F5F7

Active / playback
- Wake Teal: #62D6CF
- Teal soft fill: rgba(98, 214, 207, 0.12)
- Teal glow: rgba(98, 214, 207, 0.22)

Coach / pivotal insight
- Warm Amber: #F3B85C
- Amber soft fill: rgba(243, 184, 92, 0.12)
- Amber glow: rgba(243, 184, 92, 0.20)

State colors
- Success: #78C69B
- Warning: #E58A73
- Low-confidence / uncertain: #9C8DCB

Usage rules
- Teal identifies playback, selection, and active evidence.
- Amber identifies coaching emphasis and pivotal moments.
- Most charts remain neutral until selected.
- Never use multiple saturated series simultaneously.
- Glow is an attentional tool, not a permanent visual treatment.
- Do not use decorative rainbow gradients.

Typography

Use one modern humanist or neo-grotesk sans-serif family for the interface. Use a monospaced face only for numeric telemetry when available.

Preferred characteristics:
- Soft geometry
- Open counters
- Strong readability at small sizes
- Friendly rather than institutional

Recommended fallback stack:
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, “Segoe UI”, sans-serif

Numeric fallback:
“IBM Plex Mono”, “SFMono-Regular”, Consolas, monospace

Type scale
- Display insight: 32 px / 1.18 / 600
- Page title: 24 px / 1.25 / 600
- Section heading: 18 px / 1.3 / 600
- Body: 15 px / 1.55 / 400
- Supporting body: 14 px / 1.5 / 400
- Label: 12 px / 1.3 / 600
- Telemetry numerals: 13–16 px / tabular numerals

Rules
- Use sentence case.
- Avoid all-caps except very short metadata labels.
- The coaching insight should be the largest text in its region.
- Keep line lengths between 45 and 75 characters for explanation text.

Spacing and Geometry

Base spacing unit: 4 px

Scale:
4, 8, 12, 16, 20, 24, 32, 40, 48, 64

Panel padding:
- Compact: 12 px
- Standard: 16–20 px
- Primary insight: 24–32 px

Corner radius:
- Small controls: 6 px
- Cards and panels: 10 px
- Primary insight: 12 px
- Pills: full radius

Borders:
- 1 px hairlines
- Use contrast before shadows
- No thick card outlines

Elevation and Material

Wake uses soft graphite surfaces, thin separators, and subtle depth.

Use:
- Layered neutral surfaces
- Slight tonal elevation
- Minimal soft shadow only for overlays
- Light as emphasis around one active insight

Avoid:
- Frosted glass everywhere
- Heavy blur
- Floating translucent cards
- Large drop shadows
- Glossy 3D materials

Replay

Replay is the defining component.

Replay includes:
- Workout phases
- Time ruler
- Playhead
- Telemetry tracks
- Event markers
- Coach cues
- Selected time window
- Playback controls

Rules
- All tracks align to the same horizontal time scale.
- The selected event window spans every relevant track.
- The playhead is always visible during playback.
- Context outside the selected window recedes but remains legible.
- The active insight marker should be visually linked to its evidence window.
- Do not present a stack of unrelated charts.
- Do not use a dashboard grid as the primary composition.

Attentional Motion

Wake may use a restrained expressive glow inspired by contemporary generative interfaces, but it must represent attention rather than “AI thinking.”

Signature behavior: Insight Beacon

The active insight carries a soft localized halo. When selection changes:
1. Replay window illuminates.
2. Video seeks.
3. Relevant tracks brighten.
4. Insight text settles into focus.
5. Evidence reveals in sequence.

A faint wake may extend before and after the active event to show that the moment emerged from prior context and affected what followed.

Motion timing
- Hover: 100–140 ms
- Selection: 180–240 ms
- Panel expansion: 240–320 ms
- Coordinated seek and highlight: 300–450 ms
- Ambient beacon breath: 2.8–4.0 s, extremely subtle

Motion curves
- Standard: cubic-bezier(0.2, 0.8, 0.2, 1)
- Exit: cubic-bezier(0.4, 0, 1, 1)

Motion rules
- One animated focal point at a time.
- No bouncing cards.
- No particle systems.
- No neuron meshes.
- No continuous pulsing across multiple elements.
- Respect prefers-reduced-motion.
- Motion cannot be required to understand the state.

Insight Panel

Every primary insight contains:
- Timestamp or time range
- Coach headline
- Brief explanation
- Evidence summary
- Recommendation or drill
- Confidence, when useful

The headline should be understood in under three seconds.

The panel should feel editorial, not like model output. Do not show raw reasoning traces.

Evidence

Evidence appears on demand without forcing the user to leave the Replay.

Evidence types:
- Concept2 telemetry
- Visual observation
- Heart-rate context
- Session comparison
- Video segment

Evidence rules
- State the source plainly.
- Align evidence to the active time window.
- Distinguish observation from interpretation.
- Show confidence without false precision.
- Prefer two strong pieces of evidence over a long list.

Video

Default role: synchronized supporting evidence.

Default presentation:
- Small or medium preview panel
- Clear timestamp
- Expand affordance
- Minimal playback chrome
- Synchronized to Replay selection

Expanded presentation:
- User initiated
- May occupy a large portion of the screen
- Replay and active insight remain accessible or easy to restore

Rules
- Never use low-quality video as the opening hero.
- Avoid large decorative crops.
- Do not place overlays that imply biomechanical precision beyond what the footage supports.
- Video should prove or clarify an insight, not merely fill space.

Charts and Telemetry

Charts are contextual instruments, not standalone analytics.

Rules
- Neutral lines by default.
- Active evidence brightens within the selected window.
- Directly label important changes when possible.
- Keep axes minimal.
- Use tabular numerals.
- Do not use legends when direct labels suffice.
- Avoid more than three simultaneous active colors.
- Preserve the full-session shape while emphasizing the local event.

Core Components

Application Header
Session Header
Replay
Time Ruler
Phase Band
Telemetry Track
Event Marker
Coach Cue
Playback Controls
Insight Panel
Evidence Row
Recommendation Block
Video Evidence Panel
Metric Badge
Confidence Indicator
Expandable Detail
Tooltip
Empty State
Loading State

Component rules
- Components must reinforce the Replay hierarchy.
- Avoid reusable components that encourage generic dashboard layouts.
- Insight, time, and evidence must remain connected visually and behaviorally.
- Use native-feeling controls with generous hit areas.

States

Loading
- Show the session shell and Replay structure.
- Use restrained track skeletons.
- Never show fake agent activity.

Empty
- Explain what is missing and what the user should provide.
- Preserve the primary screen hierarchy.

Low confidence
- Reduce certainty in language.
- Use a quiet uncertainty treatment.
- Do not convert low confidence into an alarming warning state.

Error
- State what failed.
- Preserve any successful evidence already available.
- Offer a direct recovery action.

Accessibility

- Minimum body contrast: WCAG AA.
- Focus rings must be visible on dark surfaces.
- All interactive targets: at least 40 × 40 px.
- Never encode meaning through color alone.
- Charts require accessible labels or summaries.
- Keyboard control must support play/pause, event navigation, and expansion.
- Reduced motion disables breathing glow and simplifies coordinated transitions.
- Video requires captions when audio is part of the evidence.

Product Vocabulary

Replay
The primary Wake experience: a synchronized, navigable view of an entire workout.

Event
A timestamped moment or span identified as meaningful.

Observation
A grounded measurement or visible finding.

Insight
A coaching interpretation explaining what mattered.

Evidence
The observations, telemetry, or video supporting an insight.

Recommendation
A concrete action or drill for a future workout.

Coach cue
A concise instruction tied to a specific moment.

Phase
A meaningful workout segment such as warmup, interval, recovery, or cooldown.

Copy Conventions

Use:
- “Replay”
- “Insight”
- “Evidence”
- “What happened”
- “What to do next”
- “Visual evidence”
- “Concept2 data”

Avoid:
- “Multimodal analysis”
- “Agent output”
- “AI observation”
- “World model”
- “Chain of thought”
- “Consensus”

Hackathon Demo Constraints

The opening screen must communicate the product within ten seconds.

The first viewport should show:
- Session identity
- Full-workout Replay shape
- One selected pivotal event
- One decisive coaching insight
- Enough supporting evidence to establish trust
- A small expandable video preview

The signature interaction is:
Select event → synchronized Replay highlight → video seek → insight beacon → evidence reveal.

Do not build:
- Mobile layouts
- Social feed
- Generic dashboard home
- Settings suite
- Complex onboarding
- Live processing visualization
- Full design-system showcase
- Unnecessary secondary pages

Do

- Keep the Replay central.
- Present one strong insight at a time.
- Use light and motion to guide attention.
- Keep video secondary but accessible.
- Preserve full-workout context.
- Make the coaching language human.
- Ground claims in visible evidence.

Do Not

- Lead with a large low-quality video.
- Build a grid of metric cards.
- Use sci-fi typography.
- Add decorative AI glows.
- Animate every panel.
- Expose agents or internal reasoning.
- Claim precise biomechanics the recording cannot support.
- Overload the demo with features.

North Star

Wake should feel like an attentive coach using a precise creative instrument.

Less like Strava.
Less like Tableau.
Less like ChatGPT.
More like a focused editing suite for understanding human performance.
