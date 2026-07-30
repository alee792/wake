CYPHER 25
MATCH (workout:Workout {workoutId: $collection.workoutId})
MERGE (collection:InsightCollection {collectionId: $collection.collectionId})
SET collection.workoutId = $collection.workoutId,
    collection.title = $collection.title,
    collection.reviewState = $collection.reviewState,
    collection.generationMode = $collection.generationMode,
    collection.derivationVersion = $collection.derivationVersion,
    collection.citedSourceIds = $collection.citedSourceIds,
    collection.citedSourcePaths = $collection.citedSourcePaths,
    collection.limitations = $collection.limitations
MERGE (collection)-[:FOR_WORKOUT]->(workout)
WITH collection
UNWIND $insights AS row
MERGE (insight:DerivedInsight {insightId: row.insightId})
SET insight.headline = row.headline,
    insight.explanation = row.explanation,
    insight.category = row.category,
    insight.startSeconds = row.startSeconds,
    insight.endSeconds = row.endSeconds,
    insight.focusSeconds = row.focusSeconds,
    insight.associatedSegmentsJson = apoc.convert.toJson(row.associatedSegments),
    insight.associatedEventsJson = apoc.convert.toJson(row.associatedEvents),
    insight.metricsJson = apoc.convert.toJson(row.metrics),
    insight.derivationJson = apoc.convert.toJson(row.derivation),
    insight.citedSourceIds = row.citedSourceIds,
    insight.citedSourcePaths = row.citedSourcePaths,
    insight.limitations = row.limitations,
    insight.confidence = row.confidence,
    insight.reviewState = row.reviewState,
    insight.generationMode = row.generationMode
MERGE (collection)-[membership:CONTAINS_INSIGHT]->(insight)
SET membership.position = row.position
CALL (insight, row) {
  UNWIND row.associatedSegments AS segmentReference
  MATCH (segment:Segment {segmentId: segmentReference.segmentId})
  MERGE (insight)-[association:ABOUT_SEGMENT]->(segment)
  SET association.role = segmentReference.role
  RETURN count(*) AS associatedSegmentCount
}
RETURN collection.collectionId AS collectionId,
       count(DISTINCT insight) AS insightCount,
       sum(associatedSegmentCount) AS associatedSegmentCount;
