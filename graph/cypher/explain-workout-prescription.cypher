CYPHER 25
EXPLAIN
MATCH (prescription:WorkoutPrescription {prescriptionId: $prescriptionId})
USING INDEX prescription:WorkoutPrescription(prescriptionId)
MATCH (prescription)-[:FOR_WORKOUT]->(workout:Workout)
MATCH (prescription)-[:SUPPORTED_BY]->(insight:DerivedInsight)
RETURN prescription.prescriptionId AS prescriptionId,
       workout.workoutId AS workoutId,
       collect(insight.insightId) AS linkedInsightIds;
