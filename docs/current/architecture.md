# Wake Hackathon Architecture

Status: Canonical four-hour build architecture

## 1. Architectural Thesis

Wake materializes one reviewed Replay before the recording begins.

The sponsor-backed pipeline runs at build time. The recorded application reads a
deterministic fixture and local media, so no API, database, model, or network call
can interrupt the demo.

```text
BUILD TIME

Concept2 + TwelveLabs Pegasus full-video candidates
    → selected highlight clips + Jockey recurrence
    → Neo4j evidence graph
    → AWS Strands agent using OpenAI
    → reviewed Replay fixture + build manifest

RECORDING TIME

Replay fixture + local clips/posters
    → React Replay app
```

This is a deliberately narrow hackathon architecture, not a production ingestion
platform.

## 2. System Boundary

### Build-time plane

Responsibilities:

- normalize the Concept2 workout onto one clock;
- analyze only selected video windows;
- normalize provider outputs;
- load the compact evidence graph;
- retrieve one explanation bundle;
- synthesize concise coaching;
- validate citations and numerical claims;
- emit immutable frontend artifacts.

Build-time failures may reduce sponsor coverage, but must not prevent the local
Replay from rendering.

### Recording-time plane

Responsibilities:

- render the completed session;
- maintain one shared playback clock;
- synchronize event, evidence, interval, and media selection;
- reveal cached evidence and sponsor provenance;
- remain functional with the network disabled.

The browser performs no coaching synthesis and reconstructs no graph logic.

## 3. Source Authority

Concept2 is authoritative for:

- elapsed time;
- work and recovery structure;
- pace;
- watts;
- stroke rate;
- distance;
- recorded heart rate when present.

TwelveLabs is authoritative only for timestamped descriptions of visible or audible
content it actually analyzed.

Neo4j is authoritative for the curated relationships in the evidence bundle.

OpenAI produces coaching language from validated evidence. It does not create
measurements or override Concept2.

Wake owns:

- timestamp normalization;
- manual alignment;
- evidence selection;
- event boundaries;
- confidence and limitations;
- final presentation;
- human review.

## 4. Golden-Session Time Model

The workout contains four seven-minute blocks. CSV time resets at each block.

Normalize a row with:

```text
globalSeconds = localSeconds + blockIndex × 420
```

The TCX phase boundaries are canonical:

```text
0–240       Work 1
240–420     Recovery 1
420–660     Work 2
660–840     Recovery 2
840–1080    Work 3
1080–1260   Recovery 3
1260–1500   Work 4
1500–1680   Recovery 4
```

Video uses explicit mappings rather than pretending a short clip spans the full
workout:

```text
Replay 8:45–9:05 → hero-clip.mp4 seconds 3–23
```

The final mappings depend on verified media.

## 5. Sponsor Roles

### TwelveLabs

Pegasus 1.5 is a human-operated video-discovery step. The project owner runs one
asynchronous `general` analysis against the ready 28-minute asset using
`AnalyzePromptV2` and an `AsyncResponseFormat(type="json_schema")`, then pastes the
real JSON output into the workspace. The prompt explicitly inspects five coverage
windows spanning 0:00–28:00, preserves at least one factual observation per
window, and returns no more than ten genuinely pivotal moments.

Preserve the raw task response plus:

- asset, task, and generation IDs;
- requested analysis mode, model, prompt, and schema;
- coverage observations and final observed timestamp;
- moment start and end time;
- direct visual observation;
- change from preceding strokes;
- possible interpretation kept separate from the observation;
- repeated timestamps;
- confidence and limitations.

Review the candidates against Concept2 and select two or three clips:

1. the hero insight;
2. a recurrence or comparison;
3. an optional positive/control moment.

The Data/Jockey lieutenant validates the pasted output, maps selected media times
to Replay time, and prepares only those clips or posters for the recorded app. Save
the raw Pegasus response separately from Wake's curated selection. Do not build or
run a Pegasus integration in the app. Use the handoff contract in
[TwelveLabs Pegasus Manual Handoff](../twelvelabs-pegasus-full-video-analysis.md).

Jockey is the programmatic TwelveLabs integration. Create or reuse assets, add them
to a knowledge store, wait for the items to become ready, then call the Responses
API against the selected highlights with one narrow recurrence/comparison
question. Save:

- knowledge-store and item IDs;
- response and session IDs;
- cited moments;
- raw response;
- normalized recurrence observation;
- limitations.

Jockey remains a research-preview dependency. If ingestion is not ready by the
integration cutoff, retain the code and omit unsupported Jockey claims from the
recording.

Minimal lifecycle:

```text
asset
  → knowledge store
  → knowledge-store item
  → poll until ready
  → POST /v1.3/responses
  → cited recurrence observation
```

### Neo4j

Store only the relationships needed to explain the hero insight:

- workout and phases;
- two events;
- supporting and contradicting observations;
- providers;
- one repeated pattern;
- one insight;
- one drill.

Expose one parameterized read by `insightId`. The cached fallback must use the same
`ExplanationBundle` shape.

See [Neo4j Evidence Graph](../neo4j-shared-evidence-graph.md).

### OpenAI

OpenAI consumes the Neo4j explanation bundle and returns structured coaching. Use
the OpenAI Responses provider routed through Amazon Bedrock Mantle:

```text
Strands OpenAIResponsesModel
    model: openai.gpt-oss-120b
    transport: Amazon Bedrock Mantle
    authentication: existing AWS configuration
```

Do not require a direct OpenAI API key. Keep model ID, AWS profile, and region
configurable through environment or the existing AWS config.

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

Validate every citation and numerical statement against the input bundle before
the output enters the Replay fixture.

### AWS Strands

Use one Strands agent configured with `OpenAIResponsesModel` through Bedrock Mantle
and a small set of deterministic tools:

- retrieve the explanation bundle;
- validate evidence references;
- emit the structured coaching result.

The Strands run is precomputed. Record it in the build manifest; do not run it
during the recording.

## 6. Contracts

### ProviderObservation

```ts
type ProviderObservation = {
  id: string
  provider:
    | "concept2"
    | "twelvelabs-pegasus"
    | "twelvelabs-jockey"
    | "manual"
  startSeconds: number
  endSeconds: number
  kind: "measurement" | "visual" | "technique" | "context"
  statement: string
  confidence?: number
  citations: string[]
  limitations: string[]
  generationMode: "api" | "cached-api" | "derived" | "manual"
  rawResponsePath?: string
}
```

### ExplanationBundle

```ts
type ExplanationBundle = {
  insight: Insight
  event: Event
  segment: Segment
  supportingEvidence: ProviderObservation[]
  contradictingEvidence: ProviderObservation[]
  recurrences: Event[]
  drill: Drill
  source: "neo4j" | "cached-neo4j"
}
```

### ReplayFixture

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

### BuildManifest

Each step records:

- step ID;
- provider and model/service;
- execution mode;
- input and output paths;
- provider response ID when real;
- timestamp;
- optional content hash;
- human-reviewed flag.

Secrets never enter the manifest.

## 7. Validation Gates

Before fixture emission:

- phase bounds cover 0–1680 seconds;
- all telemetry samples are globally sorted;
- all event and evidence timestamps are in range;
- every referenced ID resolves;
- metric deltas can be reproduced;
- provider attribution matches stored artifacts;
- OpenAI citations exist in the explanation bundle;
- media mappings resolve to valid local assets;
- unsupported biomechanical claims are rejected.

## 8. Suggested Repository Shape

```text
app/
  src/
    domain/
    generated/
    replay/
    moment/
    provenance/
  public/media/

pipeline/
  concept2/
  twelvelabs/
  neo4j/
  strands/
  openai/
  build/

artifacts/
  raw/
  normalized/
  cached/
  manifests/

coordination/
docs/
```

The Integration Captain freezes exact paths before parallel implementation begins.

## 9. Failure Modes

| Failure | Recorded-path response |
|---|---|
| Pegasus analysis unavailable | Hand-select clips, label selection manual, and do not claim Pegasus analysis |
| Jockey unavailable | Omit Jockey; use the imported Pegasus observation and a manually curated recurrence labeled manual |
| Neo4j unavailable | Use the captured query result marked `cached-neo4j` |
| OpenAI unavailable | Use a captured real output; otherwise label reviewed coaching manual |
| Strands unavailable | Do not claim Strands orchestration |
| Video missing | Render the mapped poster and Replay timestamp |
| Network unavailable | No effect on the recording |

## 10. Explicitly Deferred

- upload and processing UI;
- generalized ingestion;
- live provider calls;
- runtime agent swarm;
- graph visualization;
- GraphRAG, embeddings, and GDS;
- cross-session history;
- automatic synchronization;
- production deployment architecture;
- authentication and multi-user state.

## 11. Architectural North Star

Sponsor tools create and connect evidence at build time. The athlete experiences
one calm, coherent Replay at recording time.
