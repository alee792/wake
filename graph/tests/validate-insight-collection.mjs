import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { deriveInsightCollection } from "../scripts/derive-insight-collection.mjs";

const repoRoot = new URL("../../", import.meta.url);

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, repoRoot), "utf8"));
}

async function sha256(path) {
  const bytes = await readFile(new URL(path, repoRoot));
  return createHash("sha256").update(bytes).digest("hex");
}

const [derived, live, cached, verification] = await Promise.all([
  deriveInsightCollection(),
  readJson("graph/results/insight-collection-aura.json"),
  readJson("graph/cache/insight-collection.json"),
  readJson("graph/results/insight-collection-verification.json"),
]);

const expectedLive = { ...derived, source: "neo4j" };
assert.deepEqual(live, expectedLive, "Aura capture differs from deterministic math");

const expectedCache = structuredClone(live);
expectedCache.source = "cached-neo4j";
assert.deepEqual(cached, expectedCache, "cache must differ only at source");

assert.equal(live.insights.length, 5);
assert.deepEqual(
  live.insights.map((insight) => insight.insightId),
  [
    "insight-work2-progressive-build",
    "insight-work3-late-surge",
    "insight-work4-strongest-interval",
    "insight-sub215-goal-achieved",
    "insight-similar-rate-different-output",
  ],
);
assert.ok(
  live.insights.every(
    (insight) =>
      insight.generationMode === "derived" &&
      insight.startSeconds <= insight.focusSeconds &&
      insight.focusSeconds <= insight.endSeconds,
  ),
);

const work2 = live.insights[0];
assert.deepEqual(
  work2.metrics.minuteWindows.map((minute) => minute.averageWatts),
  [150.4, 159.6, 160.9, 171.7],
);
assert.equal(work2.metrics.wattsStrictlyIncreasedEveryMinute, true);

const work3 = live.insights[1];
assert.equal(work3.metrics.minute1.averageWatts, 138.8);
assert.equal(work3.metrics.minute1.averageStrokeRate, 26.5);
assert.equal(work3.metrics.minute4.averageWatts, 210.7);
assert.equal(work3.metrics.minute4.averageStrokeRate, 30.5);
assert.equal(work3.derivation.mechanismInference, "none");

const work4 = live.insights[2];
assert.deepEqual(work4.metrics.work4Ranks, {
  averageWatts: 1,
  averagePaceSecondsPer500m: 1,
  distanceMeters: 1,
  averageStrokeRate: 1,
});
assert.deepEqual(work4.metrics.work4, {
  intervalId: "work-4",
  startSeconds: 1260,
  endSeconds: 1500,
  sampleCount: 123,
  averageWatts: 179.3,
  averagePaceSecondsPer500m: 125.4,
  distanceMeters: 962,
  averageStrokeRate: 30.2,
});

const goal = live.insights[3];
assert.equal(goal.metrics.sampleCount, 95);
assert.equal(goal.metrics.samplesUnderTarget, 95);
assert.equal(goal.metrics.sampleShareUnderTarget, 1);
assert.equal(goal.metrics.timeWeighted.evaluatedDurationSeconds, 183.911);
assert.equal(goal.metrics.timeWeighted.underTargetDurationSeconds, 183.911);
assert.equal(goal.metrics.timeWeighted.underTargetShare, 1);
assert.equal(goal.metrics.timeWeighted.longestContinuousRunSeconds, 183.911);
assert.equal(goal.metrics.averagePaceSecondsPer500m, 123.9);
assert.equal(goal.metrics.bestPaceSecondsPer500m, 113.4);
assert.equal(goal.metrics.worstPaceSecondsPer500m, 133.1);
assert.equal(goal.metrics.averageWatts, 185.3);
assert.equal(goal.metrics.averageStrokeRate, 30.8);
assert.equal(goal.metrics.allSamplesUnderTarget, true);
assert.equal(goal.derivation.temporalClaim, "achievement-followed-voice-note");
assert.equal(goal.derivation.causalClaim, "rejected");
assert.equal(goal.associatedEvents[0].athleteVerified, true);
assert.equal(goal.associatedEvents[0].jockeyDetected, false);

const comparison = live.insights[4];
assert.equal(comparison.metrics.work2.averageWatts, 157.3);
assert.equal(comparison.metrics.work2.averageStrokeRate, 29.8);
assert.equal(comparison.metrics.work3.averageWatts, 215.3);
assert.equal(comparison.metrics.work3.averageStrokeRate, 30.4);
assert.equal(comparison.metrics.wattsDifference, 58);
assert.equal(comparison.metrics.pegasus.conclusion, "visual evidence unresolved");
assert.deepEqual(comparison.metrics.jockey, {
  supplementalObservationId:
    "jockey-autonomous-cross-angle-candidate-mechanism",
  timestampBasis: "clip-local",
  hypothesisOnly: true,
  occurredInSelectedWorkoutWindows: "not-established",
  causalClaim: "rejected",
});

for (const insight of live.insights) {
  assert.ok(insight.citedSourceIds.length > 0);
  assert.ok(insight.citedSourcePaths.length > 0);
  assert.ok(insight.limitations.length > 0);
  assert.ok(
    insight.citedSourcePaths.every(
      (path) => !path.startsWith("http://") && !path.startsWith("https://"),
    ),
    `${insight.insightId} contains a private or remote media URL`,
  );
}

assert.deepEqual(verification.seedRuns[1], {
  run: 2,
  nodesCreated: 0,
  relationshipsCreated: 0,
  labelsAdded: 0,
  propertiesSet: 99,
});
assert.deepEqual(verification.schemaAfter, {
  nodeCount: 34,
  relationshipCount: 46,
  constraintCount: 13,
  insightCollectionCount: 1,
  derivedInsightCount: 5,
  containsInsightCount: 5,
  aboutSegmentCount: 6,
  forWorkoutCount: 1,
  forbiddenJockeyAttributionCount: 0,
  newConstraintNames: [
    "insight_collection_id_unique",
    "derived_insight_id_unique",
  ],
});

for (const [path, expectedHash] of Object.entries(verification.inputSha256)) {
  assert.equal(await sha256(path), expectedHash, `${path} changed`);
}

console.log("InsightCollection deterministic/live/cache validation passed.");
