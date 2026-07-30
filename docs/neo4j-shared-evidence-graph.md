# Wake Neo4j Evidence Graph

Status: Canonical hackathon graph slice

Purpose: Power one interaction—“Why Wake believes this.”

## 1. Required Queries

The graph must answer:

1. Which event produced the selected insight?
2. Which observations support or contradict that event?
3. Which provider produced each observation?
4. Where did the same pattern recur?
5. Which drill follows from the insight?

No other graph capability is required for the recording.

## 2. Model

```text
(Workout)-[:INCLUDES_SEGMENT]->(Segment)

(Event)-[:OCCURRED_DURING]->(Segment)
(Observation)-[:SUPPORTS]->(Event)
(Observation)-[:CONTRADICTS]->(Event)
(Observation)-[:PRODUCED_BY]->(Provider)

(Event)-[:PRESENTED_AS]->(Insight)
(Event)-[:INSTANCE_OF]->(Pattern)
(Insight)-[:RECOMMENDS]->(Drill)
```

### Nodes

| Label | Key | Required properties |
|---|---|---|
| `Workout` | `workoutId` | `name`, `durationSeconds` |
| `Segment` | `segmentId` | `name`, `segmentType`, `startSeconds`, `endSeconds` |
| `Event` | `eventId` | `title`, `startSeconds`, `endSeconds`, `importance` |
| `Observation` | `observationId` | `kind`, `description`, `confidence`, `startSeconds`, `endSeconds`, `generationMode` |
| `Provider` | `providerId` | `name` |
| `Insight` | `insightId` | `headline`, `explanation`, `confidence` |
| `Pattern` | `patternId` | `name` |
| `Drill` | `drillId` | `name`, `instructions`, `successCriterion` |

## 3. Fixture Size

Load only:

- one workout;
- eight segments;
- two events;
- three to five observations;
- providers actually used;
- one pattern shared by both events;
- one insight;
- one drill.

The graph may be manually curated. Provider attribution must remain truthful.

Do not store:

- raw telemetry arrays;
- video, audio, or images;
- full model responses;
- prompts or chain-of-thought;
- embeddings;
- agent workflow state;
- production coaching history.

## 4. Constraints

Create before loading data:

```cypher
CREATE CONSTRAINT workout_id_unique IF NOT EXISTS
FOR (n:Workout) REQUIRE n.workoutId IS UNIQUE;

CREATE CONSTRAINT segment_id_unique IF NOT EXISTS
FOR (n:Segment) REQUIRE n.segmentId IS UNIQUE;

CREATE CONSTRAINT event_id_unique IF NOT EXISTS
FOR (n:Event) REQUIRE n.eventId IS UNIQUE;

CREATE CONSTRAINT observation_id_unique IF NOT EXISTS
FOR (n:Observation) REQUIRE n.observationId IS UNIQUE;

CREATE CONSTRAINT provider_id_unique IF NOT EXISTS
FOR (n:Provider) REQUIRE n.providerId IS UNIQUE;

CREATE CONSTRAINT insight_id_unique IF NOT EXISTS
FOR (n:Insight) REQUIRE n.insightId IS UNIQUE;

CREATE CONSTRAINT pattern_id_unique IF NOT EXISTS
FOR (n:Pattern) REQUIRE n.patternId IS UNIQUE;

CREATE CONSTRAINT drill_id_unique IF NOT EXISTS
FOR (n:Drill) REQUIRE n.drillId IS UNIQUE;
```

Use parameterized, idempotent `MERGE` writes.

## 5. Explanation Read

Input:

```text
insightId
```

Output:

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

The query must:

- match the selected insight and presenting event;
- return its segment;
- collect supporting and contradicting observations with providers;
- find other events sharing the same pattern;
- return the recommended drill;
- return one bundle, not raw graph records.

Run `EXPLAIN` before the final read and verify the query uses the
`Insight.insightId` uniqueness constraint.

## 6. Cache Contract

Save one successful explanation result as JSON. The cache must have exactly the
same shape as the live query result except:

```json
{
  "source": "cached-neo4j"
}
```

The frontend must not branch on graph availability. It consumes the bundle.

## 7. Product Presentation

Reveal in this order:

1. insight;
2. Concept2 measurement;
3. visual observation;
4. limitation or counterevidence;
5. repeated event;
6. drill.

The provenance drawer may state that Neo4j connects the evidence. Do not show a
general graph explorer or database console.

## 8. Definition of Done

- Constraints can be run repeatedly.
- Seed can be run repeatedly without duplicates.
- Every observation names its real provider and generation mode.
- The explanation query returns the complete bundle.
- Supporting and contradicting evidence remain distinct.
- The second event is retrieved through the shared pattern.
- The drill is retrieved from the insight.
- The cached bundle renders when Neo4j is unavailable.
- No raw telemetry or media is stored in the graph.
