CYPHER 25
EXPLAIN
MATCH (event:Event)-[:PRESENTED_AS]->(insight:Insight {insightId: $insightId})
USING INDEX insight:Insight(insightId)
MATCH (event)-[:OCCURRED_DURING]->(segment:Segment)
MATCH (event)-[:INSTANCE_OF]->(pattern:Pattern)
MATCH (insight)-[:RECOMMENDS]->(drill:Drill)
RETURN insight.insightId AS insightId, event.eventId AS eventId;
