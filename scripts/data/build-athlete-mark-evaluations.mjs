import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

const telemetryPath = "artifacts/data/concept2-normalized.json";
const bookmarksPath = "artifacts/twelvelabs/athlete-notes-bookmarks.json";
const alignmentPath = "artifacts/twelvelabs/video-concept2-alignment.json";
const mediaManifestPath = "artifacts/media/replay-media-manifest.json";
const outputPath = "artifacts/data/athlete-mark-evaluations.json";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const [normalized, bookmarks, alignment, mediaManifest] = await Promise.all([
  readJson(telemetryPath),
  readJson(bookmarksPath),
  readJson(alignmentPath),
  readJson(mediaManifestPath),
]);

const round = (value, digits = 3) => Number(value.toFixed(digits));
const mean = (rows, key) =>
  round(rows.reduce((total, row) => total + row[key], 0) / rows.length);
const summarize = (rows) => ({
  sampleCount: rows.length,
  averageSplitSecondsPer500m: mean(rows, "paceSecondsPer500m"),
  averageWatts: mean(rows, "watts"),
  averageStrokeRate: mean(rows, "strokeRate"),
  averageHeartRate: mean(rows, "heartRate"),
});
const exactRow = (row) => ({
  sequence: row.sequence,
  csvNumber: row.sequence,
  physicalCsvLine: row.sequence + 1,
  blockIndex: row.blockIndex,
  localSeconds: row.localSeconds,
  globalSeconds: row.globalSeconds,
  localDistanceMeters: row.localDistanceMeters,
  paceSecondsPer500m: row.paceSecondsPer500m,
  watts: row.watts,
  caloriesPerHour: row.caloriesPerHour,
  strokeRate: row.strokeRate,
  heartRate: row.heartRate,
});

const goalMark = bookmarks.curated_results.verbal_goals[0];
const flagMark = bookmarks.curated_results.gesture_bookmarks[0];
const goalMedia = mediaManifest.athleteEventMedia.find(
  (event) => event.eventId === goalMark.id,
);
const flagMedia = mediaManifest.athleteEventMedia.find(
  (event) => event.eventId === flagMark.id,
);
const work4 = normalized.phases.find((phase) => phase.id === "work-4");
const flagPhase = normalized.phases.find(
  (phase) =>
    flagMark.workoutGlobalSeconds >= phase.startSeconds &&
    flagMark.workoutGlobalSeconds < phase.endSeconds,
);

assert(goalMedia && flagMedia && work4 && flagPhase);
assert.equal(goalMedia.provenance.athleteVerified, true);
assert.equal(goalMedia.provenance.jockeyDetected, false);
assert.equal(flagMedia.provenance.athleteVerified, true);
assert.equal(flagMedia.provenance.jockeyDetected, false);
assert.equal(
  round(goalMedia.sourceVideoTimeSeconds + alignment.videoToConcept2OffsetSeconds),
  goalMark.workoutGlobalSeconds,
);

const goalStart = goalMark.workoutGlobalSeconds;
const goalEnd = work4.endSeconds;
const target = goalMark.targetSplitSeconds;
const goalRows = normalized.telemetry.filter(
  (row) => row.globalSeconds >= goalStart && row.globalSeconds < goalEnd,
);
assert(goalRows.length > 0);

const support = goalRows.map((row, selectedIndex) => {
  const sourceIndex = normalized.telemetry.findIndex(
    (candidate) => candidate.sequence === row.sequence,
  );
  const previous = normalized.telemetry[sourceIndex - 1];
  const next = normalized.telemetry[sourceIndex + 1];
  const startSeconds = Math.max(
    goalStart,
    previous ? (previous.globalSeconds + row.globalSeconds) / 2 : goalStart,
  );
  const endSeconds = Math.min(
    goalEnd,
    next ? (row.globalSeconds + next.globalSeconds) / 2 : goalEnd,
  );
  return {
    selectedIndex,
    sequence: row.sequence,
    startSeconds,
    endSeconds,
    durationSeconds: endSeconds - startSeconds,
    underTarget: row.paceSecondsPer500m < target,
  };
});

const underRows = goalRows.filter(
  (row) => row.paceSecondsPer500m < target,
);
const underTargetSeconds = support
  .filter((item) => item.underTarget)
  .reduce((total, item) => total + item.durationSeconds, 0);

const runs = [];
for (const item of support) {
  const current = runs.at(-1);
  if (item.underTarget && current?.underTarget) {
    current.endSeconds = item.endSeconds;
    current.durationSeconds += item.durationSeconds;
    current.sequenceEnd = item.sequence;
  } else {
    runs.push({
      underTarget: item.underTarget,
      startSeconds: item.startSeconds,
      endSeconds: item.endSeconds,
      durationSeconds: item.durationSeconds,
      sequenceStart: item.sequence,
      sequenceEnd: item.sequence,
    });
  }
}
const longestUnderTarget = runs
  .filter((run) => run.underTarget)
  .sort((a, b) => b.durationSeconds - a.durationSeconds)[0];

const nearestFlagRow = normalized.telemetry.reduce((nearest, row) =>
  Math.abs(row.globalSeconds - flagMark.workoutGlobalSeconds) <
  Math.abs(nearest.globalSeconds - flagMark.workoutGlobalSeconds)
    ? row
    : nearest,
);
const precedingStart = flagMark.workoutGlobalSeconds - 30;
const followingEnd = flagMark.workoutGlobalSeconds + 30;
const precedingRows = normalized.telemetry.filter(
  (row) =>
    row.globalSeconds >= precedingStart &&
    row.globalSeconds < flagMark.workoutGlobalSeconds,
);
const followingRows = normalized.telemetry.filter(
  (row) =>
    row.globalSeconds >= flagMark.workoutGlobalSeconds &&
    row.globalSeconds < followingEnd,
);

const artifact = {
  schemaVersion: "1.0",
  generatedBy: "deterministic-wake-evaluator",
  source: {
    normalizedTelemetryPath: telemetryPath,
    normalizedTelemetrySha256: normalized.source.sha256,
    athleteMarksPath: bookmarksPath,
    clockAlignmentPath: alignmentPath,
    mediaManifestPath,
    decision: "coordination/DECISIONS.md#d-017--athlete-goal-and-flag-are-distinct-replay-events",
  },
  provenance: {
    athleteVerified: true,
    jockeyDetected: false,
    note: "Both marks are athlete-authored and human-reviewed. Jockey neither detected nor transcribed them.",
  },
  evaluationRules: {
    intervalBounds: "inclusive-start-exclusive-end",
    averages: "unweighted arithmetic mean across included Concept2 rows",
    targetComparison: "paceSecondsPer500m < 135; equality does not pass",
    timeShare:
      "Each sample owns the interval between adjacent timestamp midpoints, clipped to the evaluation bounds.",
    longestConsecutivePeriod:
      "Longest contiguous run of midpoint-weighted sample support whose rows are strictly under target.",
    flagWindows: "preceding [event-30,event); following [event,event+30)",
  },
  goal: {
    eventId: goalMark.id,
    role: "goal",
    statement: goalMark.statement,
    targetSplitSecondsPer500m: target,
    reviewedVideoLocalSeconds: goalMedia.sourceVideoTimeSeconds,
    reviewedWorkoutGlobalSeconds: goalStart,
    evaluationStartSeconds: goalStart,
    evaluationEndSeconds: goalEnd,
    containingPhase: {
      id: work4.id,
      name: work4.name,
      startSeconds: work4.startSeconds,
      endSeconds: work4.endSeconds,
    },
    sampleCount: goalRows.length,
    averageSplitSecondsPer500m: mean(goalRows, "paceSecondsPer500m"),
    bestSplitSecondsPer500m: Math.min(
      ...goalRows.map((row) => row.paceSecondsPer500m),
    ),
    worstSplitSecondsPer500m: Math.max(
      ...goalRows.map((row) => row.paceSecondsPer500m),
    ),
    averageWatts: mean(goalRows, "watts"),
    averageStrokeRate: mean(goalRows, "strokeRate"),
    samplesUnderTarget: underRows.length,
    sampleShareUnderTarget: round(underRows.length / goalRows.length, 6),
    evaluatedDurationSeconds: round(goalEnd - goalStart),
    observedSampleSpanSeconds: round(
      goalRows.at(-1).globalSeconds - goalRows[0].globalSeconds,
    ),
    timeUnderTargetSeconds: round(underTargetSeconds),
    timeShareUnderTarget: round(
      underTargetSeconds / (goalEnd - goalStart),
      6,
    ),
    longestConsecutivePeriodUnderTarget: {
      startSeconds: round(longestUnderTarget.startSeconds),
      endSeconds: round(longestUnderTarget.endSeconds),
      durationSeconds: round(longestUnderTarget.durationSeconds),
      sourceSequenceStart: longestUnderTarget.sequenceStart,
      sourceSequenceEnd: longestUnderTarget.sequenceEnd,
    },
    allSamplesUnderTarget: underRows.length === goalRows.length,
    sourceRows: goalRows.map(exactRow),
    limitations: [
      "The reviewed goal occurs between telemetry samples; evaluation begins with the first Concept2 row at or after the canonical goal time.",
      "Concept2 rows are sampled at irregular intervals, so time share uses documented midpoint support rather than assuming equal sample duration.",
      "The midpoint-support model covers the 0.311-second gap before the first included row and the 0.4-second gap after the last included row; the directly observed first-to-last sample span is reported separately.",
      "A 100% modeled time share does not prove the target held continuously between samples.",
      "This evaluates recorded telemetry against the athlete's target; it does not infer why the target was or was not met.",
    ],
  },
  flag: {
    eventId: flagMark.id,
    role: "flag",
    reviewedWorkoutGlobalSeconds: flagMark.workoutGlobalSeconds,
    containingPhase: {
      id: flagPhase.id,
      name: flagPhase.name,
      type: flagPhase.type,
      startSeconds: flagPhase.startSeconds,
      endSeconds: flagPhase.endSeconds,
    },
    secondsFromPhaseStart: round(
      flagMark.workoutGlobalSeconds - flagPhase.startSeconds,
    ),
    nearestTelemetrySample: {
      ...exactRow(nearestFlagRow),
      absoluteOffsetSeconds: round(
        Math.abs(nearestFlagRow.globalSeconds - flagMark.workoutGlobalSeconds),
      ),
    },
    preceding30Seconds: {
      startSeconds: round(precedingStart),
      endSeconds: flagMark.workoutGlobalSeconds,
      validWithinContainingPhase: precedingStart >= flagPhase.startSeconds,
      ...summarize(precedingRows),
      sourceRows: precedingRows.map(exactRow),
    },
    following30Seconds: {
      startSeconds: flagMark.workoutGlobalSeconds,
      endSeconds: round(followingEnd),
      validWithinContainingPhase: followingEnd <= flagPhase.endSeconds,
      ...summarize(followingRows),
      sourceRows: followingRows.map(exactRow),
    },
    interpretation:
      "Athlete attention marker only; no meaning is inferred from the gesture or surrounding telemetry.",
    limitations: [
      "The whole-second athlete mark has approximately ±0.7 seconds clock-alignment uncertainty.",
      "Nearest-sample and 30-second summaries provide deterministic context only.",
      "No causal, coaching, fatigue, hydration, or technique meaning is assigned to the flag.",
    ],
  },
};

assert.equal(artifact.goal.allSamplesUnderTarget, artifact.goal.samplesUnderTarget === artifact.goal.sampleCount);
assert.equal(artifact.flag.containingPhase.id, "recovery-3");
assert.equal(artifact.provenance.jockeyDetected, false);
assert.equal(
  artifact.goal.sourceRows.length,
  artifact.goal.sampleCount,
);
assert.equal(
  artifact.flag.preceding30Seconds.sourceRows.length,
  artifact.flag.preceding30Seconds.sampleCount,
);
assert.equal(
  artifact.flag.following30Seconds.sourceRows.length,
  artifact.flag.following30Seconds.sampleCount,
);
assert.equal(artifact.goal.sampleCount, 95);
assert.equal(artifact.goal.sourceRows[0].csvNumber, 598);
assert.equal(artifact.goal.sourceRows.at(-1).csvNumber, 692);
assert.equal(artifact.goal.averageSplitSecondsPer500m, 123.896);
assert.equal(artifact.goal.bestSplitSecondsPer500m, 113.4);
assert.equal(artifact.goal.worstSplitSecondsPer500m, 133.1);
assert.equal(artifact.goal.samplesUnderTarget, 95);
assert.equal(artifact.goal.allSamplesUnderTarget, true);
assert.equal(artifact.flag.nearestTelemetrySample.csvNumber, 532);
assert.equal(artifact.flag.preceding30Seconds.sampleCount, 14);
assert.equal(artifact.flag.following30Seconds.sampleCount, 13);

await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outputPath,
      goalSampleCount: artifact.goal.sampleCount,
      flagNearestSequence: artifact.flag.nearestTelemetrySample.sequence,
      validated: true,
    },
    null,
    2,
  ),
);
