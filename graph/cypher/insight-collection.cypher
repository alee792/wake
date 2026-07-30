CYPHER 25
MATCH (collection:InsightCollection {collectionId: $collectionId})
USING INDEX collection:InsightCollection(collectionId)
MATCH (collection)-[:FOR_WORKOUT]->(workout:Workout)
MATCH (collection)-[membership:CONTAINS_INSIGHT]->(insight:DerivedInsight)
WITH collection, workout, membership, insight
ORDER BY membership.position
WITH collection, workout, collect({
  insightId: insight.insightId,
  headline: insight.headline,
  explanation: insight.explanation,
  category: insight.category,
  startSeconds: insight.startSeconds,
  endSeconds: insight.endSeconds,
  focusSeconds: insight.focusSeconds,
  associatedSegments: apoc.convert.fromJsonList(insight.associatedSegmentsJson),
  associatedEvents: apoc.convert.fromJsonList(insight.associatedEventsJson),
  metrics: apoc.convert.fromJsonMap(insight.metricsJson),
  derivation: apoc.convert.fromJsonMap(insight.derivationJson),
  citedSourceIds: insight.citedSourceIds,
  citedSourcePaths: insight.citedSourcePaths,
  limitations: insight.limitations,
  confidence: insight.confidence,
  reviewState: insight.reviewState,
  generationMode: insight.generationMode
}) AS orderedInsights
RETURN {
  collectionId: collection.collectionId,
  workoutId: workout.workoutId,
  title: collection.title,
  reviewState: collection.reviewState,
  generationMode: collection.generationMode,
  derivationVersion: collection.derivationVersion,
  citedSourceIds: collection.citedSourceIds,
  citedSourcePaths: collection.citedSourcePaths,
  limitations: collection.limitations,
  insights: orderedInsights,
  source: 'neo4j'
} AS insightCollection;
