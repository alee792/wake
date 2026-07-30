CYPHER 25
MERGE (workout:Workout {workoutId: $workout.workoutId})
SET workout += $workout
WITH workout
UNWIND $segments AS segmentRow
MERGE (segment:Segment {segmentId: segmentRow.segmentId})
SET segment += segmentRow
MERGE (workout)-[:INCLUDES_SEGMENT]->(segment)
WITH DISTINCT workout
UNWIND $providers AS providerRow
MERGE (provider:Provider {providerId: providerRow.providerId})
SET provider += providerRow
WITH DISTINCT workout
MERGE (pattern:Pattern {patternId: $pattern.patternId})
SET pattern += $pattern
WITH DISTINCT workout
UNWIND $events AS eventRow
MERGE (event:Event {eventId: eventRow.eventId})
SET event += eventRow.properties
WITH workout, event, eventRow
MATCH (segment:Segment {segmentId: eventRow.segmentId})
MATCH (pattern:Pattern {patternId: $pattern.patternId})
MERGE (event)-[:OCCURRED_DURING]->(segment)
MERGE (event)-[:INSTANCE_OF]->(pattern)
FOREACH (_ IN CASE WHEN eventRow.presentsInsight THEN [1] ELSE [] END |
  MERGE (insight:Insight {insightId: $insight.insightId})
  SET insight += $insight
  MERGE (event)-[:PRESENTED_AS]->(insight)
)
WITH DISTINCT workout
MATCH (insight:Insight {insightId: $insight.insightId})
MERGE (drill:Drill {drillId: $drill.drillId})
SET drill += $drill
MERGE (insight)-[:RECOMMENDS]->(drill)
WITH DISTINCT workout
UNWIND $observations AS observationRow
MERGE (observation:Observation {observationId: observationRow.observationId})
SET observation += observationRow.properties
WITH observation, observationRow
MATCH (provider:Provider {providerId: observationRow.providerId})
MERGE (observation)-[:PRODUCED_BY]->(provider)
WITH observation, observationRow
OPTIONAL MATCH (event:Event {eventId: observationRow.eventId})
FOREACH (_ IN CASE WHEN event IS NOT NULL AND observationRow.stance = 'supporting' THEN [1] ELSE [] END |
  MERGE (observation)-[:SUPPORTS]->(event)
)
FOREACH (_ IN CASE WHEN event IS NOT NULL AND observationRow.stance = 'contradicting' THEN [1] ELSE [] END |
  MERGE (observation)-[:CONTRADICTS]->(event)
)
RETURN
  count(DISTINCT observation) AS observationsMerged,
  count(DISTINCT event) AS eventsLinked;
