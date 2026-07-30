CYPHER 25
MATCH (prescription:WorkoutPrescription {prescriptionId: $prescriptionId})
USING INDEX prescription:WorkoutPrescription(prescriptionId)
OPTIONAL MATCH (prescription)-[workoutLink:FOR_WORKOUT]->(workout:Workout)
OPTIONAL MATCH (prescription)-[support:SUPPORTED_BY]->(insight:DerivedInsight)
RETURN count(DISTINCT prescription) AS prescriptionCount,
       count(DISTINCT workoutLink) AS workoutLinkCount,
       count(DISTINCT support) AS supportCount,
       collect(DISTINCT insight.insightId) AS insightIds;
