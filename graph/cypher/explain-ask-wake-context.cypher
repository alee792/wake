CYPHER 25
EXPLAIN
MATCH (context:AskWakeContext {contextId: $contextId})-[:FOR_INSIGHT]->(insight:Insight)
USING INDEX context:AskWakeContext(contextId)
RETURN context.contextId AS contextId, insight.insightId AS insightId;
