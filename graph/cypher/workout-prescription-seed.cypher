CYPHER 25
MATCH (workout:Workout {workoutId: $prescription.workoutId})
MERGE (prescription:WorkoutPrescription {
  prescriptionId: $prescription.prescriptionId
})
SET prescription.title = $prescription.title,
    prescription.equipment = $prescription.equipment,
    prescription.workoutId = $prescription.workoutId,
    prescription.reviewState = $prescription.reviewState,
    prescription.generationMode = $prescription.generationMode,
    prescription.authorshipJson = apoc.convert.toJson($prescription.authorship),
    prescription.warmUpJson = apoc.convert.toJson($prescription.warmUp),
    prescription.mainSetJson = apoc.convert.toJson($prescription.mainSet),
    prescription.coolDownJson = apoc.convert.toJson($prescription.coolDown),
    prescription.successCriteriaJson = apoc.convert.toJson($prescription.successCriteria),
    prescription.evidenceJson = apoc.convert.toJson($prescription.evidence),
    prescription.ergDataProgrammingJson = apoc.convert.toJson($prescription.ergDataProgramming),
    prescription.limitations = $prescription.limitations
MERGE (prescription)-[:FOR_WORKOUT]->(workout)
WITH prescription
UNWIND $prescription.evidence.citedInsightIds AS insightId
MATCH (insight:DerivedInsight {insightId: insightId})
MERGE (prescription)-[:SUPPORTED_BY]->(insight)
RETURN prescription.prescriptionId AS prescriptionId,
       count(DISTINCT insight) AS citedInsightCount;
