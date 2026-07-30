CYPHER 25
MATCH (insight:Insight {insightId: $context.insightId})
MERGE (context:AskWakeContext {contextId: $context.contextId})
SET context += $context
MERGE (context)-[:FOR_INSIGHT]->(insight)
WITH context
UNWIND $referenceObservationIds AS observationId
MATCH (observation:Observation {observationId: observationId})
MERGE (context)-[:REFERENCES]->(observation)
WITH DISTINCT context
MERGE (provider:Provider {providerId: $provider.providerId})
SET provider += $provider
MERGE (supplement:SupplementalObservation {
  supplementalObservationId: $supplementalObservation.supplementalObservationId
})
SET supplement += $supplementalObservation
MERGE (context)-[:INCLUDES_SUPPLEMENT]->(supplement)
MERGE (supplement)-[:PRODUCED_BY]->(provider)
WITH context, supplement
UNWIND $moments AS momentRow
MERGE (moment:SupplementalMoment {momentId: momentRow.momentId})
SET moment += momentRow
MERGE (supplement)-[:CITES_MOMENT]->(moment)
RETURN
  context.contextId AS contextId,
  supplement.supplementalObservationId AS supplementalObservationId,
  count(DISTINCT moment) AS momentsMerged;
