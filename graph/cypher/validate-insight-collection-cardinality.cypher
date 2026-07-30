CYPHER 25
MATCH (collection:InsightCollection {collectionId: $collectionId})
USING INDEX collection:InsightCollection(collectionId)
OPTIONAL MATCH (collection)-[membership:CONTAINS_INSIGHT]->(insight:DerivedInsight)
OPTIONAL MATCH (insight)-[segmentAssociation:ABOUT_SEGMENT]->(segment:Segment)
RETURN count(DISTINCT collection) AS collectionCount,
       count(DISTINCT insight) AS insightCount,
       count(DISTINCT membership) AS membershipCount,
       count(DISTINCT segmentAssociation) AS segmentAssociationCount,
       collect(DISTINCT segment.segmentId) AS segmentIds;
