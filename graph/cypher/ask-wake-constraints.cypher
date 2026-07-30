CYPHER 25
CREATE CONSTRAINT ask_wake_context_id_unique IF NOT EXISTS
FOR (n:AskWakeContext) REQUIRE n.contextId IS UNIQUE;

CYPHER 25
CREATE CONSTRAINT supplemental_observation_id_unique IF NOT EXISTS
FOR (n:SupplementalObservation) REQUIRE n.supplementalObservationId IS UNIQUE;

CYPHER 25
CREATE CONSTRAINT supplemental_moment_id_unique IF NOT EXISTS
FOR (n:SupplementalMoment) REQUIRE n.momentId IS UNIQUE;
