CYPHER 25
CREATE CONSTRAINT insight_collection_id_unique IF NOT EXISTS
FOR (collection:InsightCollection)
REQUIRE collection.collectionId IS UNIQUE;

CYPHER 25
CREATE CONSTRAINT derived_insight_id_unique IF NOT EXISTS
FOR (insight:DerivedInsight)
REQUIRE insight.insightId IS UNIQUE;
