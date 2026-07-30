CYPHER 25
MATCH (context:AskWakeContext {contextId: $contextId})-[:FOR_INSIGHT]->(insight:Insight)
USING INDEX context:AskWakeContext(contextId)
MATCH (context)-[:INCLUDES_SUPPLEMENT]->(supplement:SupplementalObservation)
MATCH (supplement)-[:PRODUCED_BY]->(supplementProvider:Provider)
CALL (context) {
  MATCH (context)-[:REFERENCES]->(observation:Observation)-[:PRODUCED_BY]->(provider:Provider)
  RETURN collect({
    id: observation.observationId,
    provider: provider.providerId,
    generationMode: observation.generationMode,
    timestampBasis: 'workout-global',
    startSeconds: observation.startSeconds,
    endSeconds: observation.endSeconds,
    statement: observation.description,
    limitations: observation.limitations,
    citations: observation.citations,
    rawResponsePath: observation.rawResponsePath
  }) AS references
}
CALL (supplement) {
  MATCH (supplement)-[:CITES_MOMENT]->(moment:SupplementalMoment)
  RETURN collect({
    momentId: moment.momentId,
    startTime: moment.startTime,
    endTime: moment.endTime,
    timestampBasis: moment.timestampBasis,
    directObservation: moment.directObservation,
    confidence: moment.confidence,
    limitations: moment.limitations,
    knowledgeStoreItemId: moment.knowledgeStoreItemId,
    providerCitationReferenceId: moment.providerCitationReferenceId
  }) AS citedMoments
}
RETURN {
  contextId: context.contextId,
  insightId: insight.insightId,
  scope: context.scope,
  status: context.status,
  question: context.question,
  references: references,
  supplementalObservation: {
    id: supplement.supplementalObservationId,
    provider: supplementProvider.providerId,
    generationMode: supplement.generationMode,
    responseId: supplement.responseId,
    sessionId: supplement.sessionId,
    knowledgeStoreId: supplement.knowledgeStoreId,
    sourceItemId: supplement.sourceItemId,
    providerCitationReferenceId: supplement.providerCitationReferenceId,
    timestampBasis: supplement.timestampBasis,
    directObservation: supplement.directObservation,
    coachingInterpretation: supplement.coachingInterpretation,
    limitations: supplement.limitations,
    hypothesisOnly: supplement.hypothesisOnly,
    occurredInSelectedWorkoutWindows: supplement.occurredInSelectedWorkoutWindows,
    causalClaim: supplement.causalClaim,
    requestPath: supplement.requestPath,
    rawResponsePath: supplement.rawResponsePath,
    structuredResultPath: supplement.structuredResultPath,
    citedMoments: citedMoments
  },
  source: 'neo4j'
} AS askWakeContext;
