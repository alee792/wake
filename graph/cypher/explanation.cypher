CYPHER 25
MATCH (event:Event)-[:PRESENTED_AS]->(insight:Insight {insightId: $insightId})
USING INDEX insight:Insight(insightId)
MATCH (event)-[:OCCURRED_DURING]->(segment:Segment)
MATCH (event)-[:INSTANCE_OF]->(pattern:Pattern)
MATCH (insight)-[:RECOMMENDS]->(drill:Drill)
CALL (event) {
  OPTIONAL MATCH (observation:Observation)-[:SUPPORTS]->(event)
  OPTIONAL MATCH (observation)-[:PRODUCED_BY]->(provider:Provider)
  RETURN collect(
    CASE WHEN observation IS NULL THEN null ELSE {
      id: observation.observationId,
      provider: provider.providerId,
      startSeconds: observation.startSeconds,
      endSeconds: observation.endSeconds,
      kind: observation.kind,
      statement: observation.description,
      confidence: observation.confidence,
      citations: observation.citations,
      limitations: observation.limitations,
      generationMode: observation.generationMode,
      rawResponsePath: observation.rawResponsePath
    } END
  ) AS supportingEvidenceRaw
}
CALL (event, pattern) {
  OPTIONAL MATCH (observation:Observation)-[:CONTRADICTS]->(evidenceEvent:Event)-[:INSTANCE_OF]->(pattern)
  WHERE evidenceEvent = event
     OR (evidenceEvent <> event AND observation.kind = 'measurement')
  OPTIONAL MATCH (observation)-[:PRODUCED_BY]->(provider:Provider)
  RETURN collect(
    CASE WHEN observation IS NULL THEN null ELSE {
      id: observation.observationId,
      provider: provider.providerId,
      startSeconds: observation.startSeconds,
      endSeconds: observation.endSeconds,
      kind: observation.kind,
      statement: observation.description,
      confidence: observation.confidence,
      citations: observation.citations,
      limitations: observation.limitations,
      generationMode: observation.generationMode,
      rawResponsePath: observation.rawResponsePath
    } END
  ) AS contradictingEvidenceRaw
}
CALL (event, pattern) {
  OPTIONAL MATCH (recurrence:Event)-[:INSTANCE_OF]->(pattern)
  WHERE recurrence <> event
  RETURN collect(
    CASE WHEN recurrence IS NULL THEN null ELSE recurrence{.*} END
  ) AS recurrencesRaw
}
RETURN {
  insight: insight{.*},
  event: event{.*},
  segment: segment{.*},
  supportingEvidence: [item IN supportingEvidenceRaw WHERE item IS NOT NULL],
  contradictingEvidence: [item IN contradictingEvidenceRaw WHERE item IS NOT NULL],
  recurrences: [item IN recurrencesRaw WHERE item IS NOT NULL],
  drill: drill{.*},
  source: 'neo4j'
} AS explanationBundle;
