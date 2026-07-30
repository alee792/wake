CYPHER 25
CREATE CONSTRAINT workout_prescription_id_unique IF NOT EXISTS
FOR (prescription:WorkoutPrescription)
REQUIRE prescription.prescriptionId IS UNIQUE;
