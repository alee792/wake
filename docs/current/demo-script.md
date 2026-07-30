# Wake Recorded Demo Script

Status: Canonical recording path

Target length: 2:30–3:00

Rule: Show the completed Replay. Do not show uploads, processing, provider latency,
terminals, database consoles, or agent logs.

## 1. Freeze Before Recording

Replace these placeholders from the final verified fixture:

| Placeholder | Source |
|---|---|
| `<HERO_TIME>` | Hero event focus time |
| `<HERO_RANGE>` | Hero start–end |
| `<RATE_DELTA>` | Reproduced Concept2 change |
| `<WATTS_DELTA>` | Reproduced Concept2 change |
| `<RECURRENCE_TIME>` | Second connected event |
| `<HEADLINE>` | Reviewed coaching headline |
| `<DRILL>` | Reviewed next-session drill |

Do not improvise numbers during recording.

The primary screenshot and opening frame should match
[End-State Reference](end-state-reference.md).

## 2. Pre-Recording Setup

- Run the production build.
- Disable or disconnect the network.
- Open the completed Replay route directly.
- Preselect a calm baseline or the final hero state.
- Confirm hero, recurrence, evidence, interval, and provenance interactions.
- Seek media to a clear frame.
- Use the target recording viewport at 100% browser zoom.
- Hide notifications and unrelated applications.

## 3. Script

### 0:00–0:20 — Promise

On screen: Complete Replay.

Narration:

“Concept2 tells a rower what happened to pace, power, and rate. Video shows the
movement. Wake connects both across the whole workout and turns the moments that
mattered into coaching.”

Show:

- 28-minute workout;
- work and recovery phases;
- telemetry;
- event markers;
- selected insight.

### 0:20–0:45 — Whole-Workout Understanding

Narration:

“This was four four-minute work intervals with three minutes of recovery. Wake
normalizes the Concept2 data and video onto one session clock, then organizes the
review around a small number of meaningful events.”

Point to the complete Replay shape. Do not explain sponsors yet.

### 0:45–1:15 — Pivotal Moment

Action: Select the hero marker at `<HERO_TIME>`.

Expected response:

- playhead moves;
- containing work interval highlights;
- selected window brightens;
- insight changes;
- evidence updates;
- media seeks or swaps.

Narration:

“Here is the pivotal moment. `<HEADLINE>` During `<HERO_RANGE>`, stroke rate
changed by `<RATE_DELTA>` while power changed by `<WATTS_DELTA>`.”

Pause briefly so the synchronized movement registers.

### 1:15–1:50 — Why Wake Believes This

Action: Expand “Why Wake believes this.”

Narration:

“The coaching stays concise, but the evidence is inspectable. Concept2 is the
authority for the numerical change. Pegasus analyzed the complete workout and
identified this timestamped candidate, and Wake selected it because the visual
change aligns with the telemetry. Wake also preserves limitations instead of
pretending the camera can measure what it cannot see.”

Show:

- Concept2 evidence;
- TwelveLabs evidence when genuinely available;
- provider and execution mode;
- limitation or counterevidence.

### 1:50–2:10 — Recurrence

Action: Click the recurrence citation at `<RECURRENCE_TIME>`.

Narration:

“Neo4j connects this event to another occurrence of the same pattern. Clicking the
citation—returned by a Jockey investigation over the video knowledge store—takes us
directly to that earlier moment. This is a workout-level finding rather than an
isolated frame.”

Let Replay and media seek. Then return to the hero event if needed.

### 2:10–2:30 — Action

Point to Next Session.

Narration:

“Wake ends with one focused action: `<DRILL>`. The recommendation is tied to this
athlete’s repeated pattern, not a generic training plan.”

### 2:30–2:50 — Sponsor Provenance

Action: Open “How this Replay was created.”

Narration:

“The reviewed Replay is precomputed for reliability. TwelveLabs understands the
selected video windows: Pegasus performs the full-video scan and Jockey
investigates recurrence across the knowledge store. Neo4j connects evidence,
events, recurrence, and the drill. An OpenAI model running through Amazon Bedrock
synthesizes the retrieved evidence into coaching, and AWS Strands orchestrates that
build-time workflow.”

Show the compact provenance chain. Do not show logs.

### 2:50–3:00 — Close

Action: Close provenance and finish on the complete Replay.

Narration:

“The Replay is the product. Wake shows the athlete what mattered, why it mattered,
and what to change next.”

## 4. Lines to Remember

- “Wake reconstructs the whole performance.”
- “Concept2 is the numerical truth; video adds visible context.”
- “Insight first. Evidence on demand.”
- “The Replay is the product.”

## 5. Do Not Say

- “The agents reached consensus.”
- “The graph proves the athlete has bad form.”
- “This is live” when the result is cached or precomputed.
- “Jockey found this” without a real Jockey artifact.
- Any metric not frozen in the fixture.
- Any biomechanical, medical, or causal claim unsupported by the evidence.

## 6. Recording Fallbacks

| Failure | Response |
|---|---|
| Video does not play | Use the poster and continue |
| Hero marker misses | Select hero from the insight or event list |
| Recurrence seek fails | Show the cached cited time in expanded evidence |
| Provenance drawer fails | Narrate the four-role chain from the completed Replay |
| First take fails | Review immediately and record a second take |

Keep two still-image backups:

1. complete opening frame;
2. expanded evidence and provenance.

## 7. Success Test

The recording succeeds when a judge sees:

1. the complete workout;
2. one synchronized pivotal moment;
3. inspectable evidence;
4. recurrence across the workout;
5. one actionable drill;
6. a truthful four-sponsor architecture;
7. the completed Replay as the final frame.
