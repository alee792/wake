CYPHER 25
UNWIND $obsoleteObservationIds AS observationId
OPTIONAL MATCH (observation:Observation {observationId: observationId})
DETACH DELETE observation
WITH count(observation) AS observationsRemoved
UNWIND $obsoleteProviderIds AS providerId
OPTIONAL MATCH (provider:Provider {providerId: providerId})
DETACH DELETE provider
RETURN observationsRemoved, count(provider) AS providersRemoved;
