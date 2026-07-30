import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  buildWorkoutPrescription,
  citedInsightIds,
} from "../scripts/build-workout-prescription.mjs";

const repoRoot = new URL("../../", import.meta.url);

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, repoRoot), "utf8"));
}

async function sha256(path) {
  const bytes = await readFile(new URL(path, repoRoot));
  return createHash("sha256").update(bytes).digest("hex");
}

const [built, live, cached, verification] = await Promise.all([
  buildWorkoutPrescription(),
  readJson("graph/results/workout-prescription-aura.json"),
  readJson("graph/cache/workout-prescription.json"),
  readJson("graph/results/workout-prescription-verification.json"),
]);

const expectedLive = {
  ...built,
  linkedInsightIds: [...citedInsightIds].sort(),
  source: "neo4j",
};
assert.deepEqual(live, expectedLive, "Aura result differs from canonical builder");

const expectedCache = structuredClone(live);
expectedCache.source = "cached-neo4j";
assert.deepEqual(cached, expectedCache, "cache must differ only at source");

assert.equal(live.prescriptionId, "workout-build-pressure-then-rate-v1");
assert.equal(live.title, "Build pressure, then rate");
assert.equal(live.equipment, "Concept2 RowErg");
assert.equal(live.reviewState, "human-reviewed");
assert.equal(live.generationMode, "manual");
assert.deepEqual(live.authorship, {
  author: "Wake coaching",
  mode: "deterministic-human-reviewed",
  aiGenerated: false,
  bedrockGenerated: false,
});

assert.equal(live.warmUp.durationSeconds, 480);
assert.equal(live.warmUp.builds.count, 3);
assert.equal(live.warmUp.builds.strokesPerBuild, 10);
assert.equal(live.mainSet.rounds, 4);
assert.equal(live.mainSet.workSeconds, 240);
assert.equal(live.mainSet.recoverySeconds, 180);
assert.deepEqual(
  live.mainSet.intervals.map((interval) => ({
    pace: [
      interval.paceTarget.fastestSecondsPer500m,
      interval.paceTarget.slowestSecondsPer500m,
    ],
    spm: interval.strokeRateTargetSpm,
  })),
  [
    { pace: [132, 135], spm: 28 },
    { pace: [129, 132], spm: 28 },
    { pace: [126, 129], spm: 29 },
    { pace: [123, 126], spm: 30 },
  ],
);
assert.equal(live.coolDown.durationSeconds, 300);

assert.equal(live.successCriteria.length, 4);
assert.deepEqual(
  live.successCriteria.map((criterion) => criterion.criterionId),
  [
    "all-work-under-215",
    "work2-more-watts-at-similar-rate",
    "watts-nondecreasing",
    "work4-pace-with-rate-cap",
  ],
);
assert.equal(live.successCriteria[0].comparator, "strictly-less-than");
assert.equal(live.successCriteria[0].target, 135);
assert.equal(live.successCriteria[1].strokeRateTargetSpm, 28);
assert.equal(live.successCriteria[2].comparator, "nondecreasing");
assert.equal(live.successCriteria[3].paceTargetSecondsPer500m, 126);
assert.equal(live.successCriteria[3].strokeRateCapSpm, 30.5);

assert.equal(live.evidence.sourcePath, "graph/cache/insight-collection.json");
assert.deepEqual(live.evidence.citedInsightIds, citedInsightIds);
assert.deepEqual(live.linkedInsightIds, [...citedInsightIds].sort());

assert.equal(
  live.ergDataProgramming.path,
  "Create Workout → Variable Intervals",
);
assert.equal(live.ergDataProgramming.deliveryMode, "manual-copy-only");
assert.equal(live.ergDataProgramming.automaticTransfer, false);
assert.match(
  live.ergDataProgramming.disclaimer,
  /does not automatically transfer.*ErgData.*PM5/i,
);
assert.equal(live.ergDataProgramming.instructions.length, 12);
assert.ok(
  live.ergDataProgramming.instructions.some((instruction) =>
    instruction.includes("Add interval 10: 5:00 time, easy cool-down."),
  ),
);
assert.ok(
  live.limitations.some((limitation) =>
    limitation.includes("not AI-generated content"),
  ),
);
assert.ok(
  live.limitations.some((limitation) =>
    limitation.includes("does not automatically transfer"),
  ),
);

const serialized = JSON.stringify(live);
assert.doesNotMatch(serialized, /https?:\/\//);
assert.doesNotMatch(serialized, /direct ErgData import/i);
assert.doesNotMatch(serialized, /PM5 transfer/i);

assert.deepEqual(verification.seedRuns[1], {
  run: 2,
  nodesCreated: 0,
  relationshipsCreated: 0,
  labelsAdded: 0,
  propertiesSet: 13,
});
assert.deepEqual(verification.schemaAfter, {
  nodeCount: 35,
  relationshipCount: 52,
  constraintCount: 14,
  workoutPrescriptionCount: 1,
  forWorkoutCount: 1,
  supportedByCount: 5,
  forbiddenProviderAttributionCount: 0,
  newConstraintName: "workout_prescription_id_unique",
});

for (const [path, expectedHash] of Object.entries(
  verification.frozenArtifactSha256,
)) {
  assert.equal(await sha256(path), expectedHash, `${path} changed`);
}

console.log("WorkoutPrescription deterministic/live/cache validation passed.");
