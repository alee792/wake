CYPHER 25
MATCH (prescription:WorkoutPrescription {prescriptionId: $prescriptionId})
USING INDEX prescription:WorkoutPrescription(prescriptionId)
MATCH (prescription)-[:FOR_WORKOUT]->(workout:Workout)
MATCH (prescription)-[:SUPPORTED_BY]->(insight:DerivedInsight)
WITH prescription, workout, insight
ORDER BY insight.insightId
WITH prescription, workout, collect(insight.insightId) AS linkedInsightIds
RETURN {
  prescriptionId: prescription.prescriptionId,
  title: prescription.title,
  equipment: prescription.equipment,
  workoutId: workout.workoutId,
  reviewState: prescription.reviewState,
  generationMode: prescription.generationMode,
  authorship: apoc.convert.fromJsonMap(prescription.authorshipJson),
  warmUp: apoc.convert.fromJsonMap(prescription.warmUpJson),
  mainSet: apoc.convert.fromJsonMap(prescription.mainSetJson),
  coolDown: apoc.convert.fromJsonMap(prescription.coolDownJson),
  successCriteria: apoc.convert.fromJsonList(prescription.successCriteriaJson),
  evidence: apoc.convert.fromJsonMap(prescription.evidenceJson),
  linkedInsightIds: linkedInsightIds,
  ergDataProgramming: apoc.convert.fromJsonMap(prescription.ergDataProgrammingJson),
  limitations: prescription.limitations,
  source: 'neo4j'
} AS workoutPrescription;
