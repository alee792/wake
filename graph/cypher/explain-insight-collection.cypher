CYPHER 25
EXPLAIN
MATCH (collection:InsightCollection {collectionId: $collectionId})
USING INDEX collection:InsightCollection(collectionId)
MATCH (collection)-[:FOR_WORKOUT]->(workout:Workout)
MATCH (collection)-[membership:CONTAINS_INSIGHT]->(insight:DerivedInsight)
WITH collection, workout, membership, insight
ORDER BY membership.position
RETURN collection.collectionId AS collectionId,
       workout.workoutId AS workoutId,
       collect(insight.insightId) AS insightIds;
