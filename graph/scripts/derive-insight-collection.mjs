import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repoRoot = new URL("../../", import.meta.url);

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, repoRoot), "utf8"));
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function summarizeSamples(samples) {
  const average = (property) =>
    samples.reduce((total, sample) => total + sample[property], 0) /
    samples.length;

  return {
    sampleCount: samples.length,
    averageWatts: round(average("watts")),
    averagePaceSecondsPer500m: round(average("paceSecondsPer500m")),
    averageStrokeRate: round(average("strokeRate")),
  };
}

function samplesInWindow(telemetry, startSeconds, endSeconds) {
  return telemetry.filter(
    (sample) =>
      sample.globalSeconds >= startSeconds &&
      sample.globalSeconds < endSeconds,
  );
}

function rankIntervals(intervals, property, direction) {
  const sorted = [...intervals].sort((left, right) =>
      direction === "ascending"
        ? left[property] - right[property]
        : right[property] - left[property],
    );
  return sorted
    .map((interval) => ({
      intervalId: interval.intervalId,
      rank:
        1 +
        sorted.filter((candidate) =>
          direction === "ascending"
            ? candidate[property] < interval[property]
            : candidate[property] > interval[property],
        ).length,
      value: interval[property],
    }));
}

function timeWeightedTargetEvaluation(
  telemetry,
  startSeconds,
  endSeconds,
  targetPaceSecondsPer500m,
) {
  const eligible = samplesInWindow(telemetry, startSeconds, endSeconds);
  const prior = [...telemetry]
    .reverse()
    .find((sample) => sample.globalSeconds < startSeconds);

  if (!prior || eligible.length === 0) {
    throw new Error("Goal evaluation requires a boundary sample and eligible samples.");
  }

  const weightedSamples = [prior, ...eligible];
  let evaluatedDurationSeconds = 0;
  let underTargetDurationSeconds = 0;
  let currentRunSeconds = 0;
  let longestRunSeconds = 0;

  for (let index = 0; index < weightedSamples.length; index += 1) {
    const sample = weightedSamples[index];
    const nextTimestamp =
      weightedSamples[index + 1]?.globalSeconds ?? endSeconds;
    const intervalStart = Math.max(startSeconds, sample.globalSeconds);
    const intervalEnd = Math.min(endSeconds, nextTimestamp);
    const durationSeconds = Math.max(0, intervalEnd - intervalStart);

    evaluatedDurationSeconds += durationSeconds;
    if (sample.paceSecondsPer500m < targetPaceSecondsPer500m) {
      underTargetDurationSeconds += durationSeconds;
      currentRunSeconds += durationSeconds;
      longestRunSeconds = Math.max(longestRunSeconds, currentRunSeconds);
    } else {
      currentRunSeconds = 0;
    }
  }

  return {
    boundaryConvention:
      "Step-hold telemetry: the latest sample before the Goal covers the partial boundary interval; each later sample holds until the next sample or Work 4 end.",
    boundarySampleGlobalSeconds: prior.globalSeconds,
    evaluatedDurationSeconds: round(evaluatedDurationSeconds, 3),
    underTargetDurationSeconds: round(underTargetDurationSeconds, 3),
    underTargetShare: round(
      underTargetDurationSeconds / evaluatedDurationSeconds,
      6,
    ),
    longestContinuousRunSeconds: round(longestRunSeconds, 3),
  };
}

export async function deriveInsightCollection() {
  const [concept2, athleteMarks, mediaManifest, explanationBundle, askWakeContext] =
    await Promise.all([
      readJson("artifacts/data/concept2-normalized.json"),
      readJson("artifacts/twelvelabs/athlete-notes-bookmarks.json"),
      readJson("artifacts/media/replay-media-manifest.json"),
      readJson("graph/cache/explanation-bundle.json"),
      readJson("graph/cache/ask-wake-context.json"),
    ]);

  const sourcePath = "artifacts/data/concept2-normalized.json";
  const sourceId = concept2.workoutId;
  const telemetry = concept2.telemetry;
  const work2MinuteBounds = [
    [420, 480],
    [480, 540],
    [540, 600],
    [600, 660],
  ];
  const work2Minutes = work2MinuteBounds.map(([startSeconds, endSeconds], index) => ({
    minute: index + 1,
    startSeconds,
    endSeconds,
    ...summarizeSamples(
      samplesInWindow(telemetry, startSeconds, endSeconds),
    ),
  }));
  const work2WattsStrictlyIncreased = work2Minutes
    .slice(1)
    .every(
      (minute, index) =>
        minute.averageWatts > work2Minutes[index].averageWatts,
    );

  if (!work2WattsStrictlyIncreased) {
    throw new Error("D-018 Work 2 progressive-build acceptance check failed.");
  }

  const work3Minute1 = {
    startSeconds: 840,
    endSeconds: 900,
    ...summarizeSamples(samplesInWindow(telemetry, 840, 900)),
  };
  const work3Minute4 = {
    startSeconds: 1020,
    endSeconds: 1080,
    ...summarizeSamples(samplesInWindow(telemetry, 1020, 1080)),
  };

  const intervalComparison = concept2.workIntervals.map((interval) => {
    const recomputed = summarizeSamples(
      samplesInWindow(telemetry, interval.startSeconds, interval.endSeconds),
    );
    return {
      intervalId: interval.id,
      startSeconds: interval.startSeconds,
      endSeconds: interval.endSeconds,
      sampleCount: recomputed.sampleCount,
      averageWatts: recomputed.averageWatts,
      averagePaceSecondsPer500m: recomputed.averagePaceSecondsPer500m,
      distanceMeters: interval.distanceMeters,
      averageStrokeRate: recomputed.averageStrokeRate,
    };
  });
  const work4 = intervalComparison.find(
    (interval) => interval.intervalId === "work-4",
  );
  const rankings = {
    averageWatts: rankIntervals(
      intervalComparison,
      "averageWatts",
      "descending",
    ),
    averagePaceSecondsPer500m: rankIntervals(
      intervalComparison,
      "averagePaceSecondsPer500m",
      "ascending",
    ),
    distanceMeters: rankIntervals(
      intervalComparison,
      "distanceMeters",
      "descending",
    ),
    averageStrokeRate: rankIntervals(
      intervalComparison,
      "averageStrokeRate",
      "descending",
    ),
  };
  const work4Ranks = Object.fromEntries(
    Object.entries(rankings).map(([metric, values]) => [
      metric,
      values.find((value) => value.intervalId === "work-4").rank,
    ]),
  );
  const firstPlaceMetrics = Object.entries(work4Ranks)
    .filter(([, rank]) => rank === 1)
    .map(([metric]) => metric);

  const goal = athleteMarks.curated_results.verbal_goals.find(
    (candidate) => candidate.id === "goal-work4-split-target",
  );
  const goalMedia = mediaManifest.athleteEventMedia.find(
    (candidate) => candidate.eventId === goal.id,
  );
  if (
    !goal ||
    !goalMedia ||
    goalMedia.provenance.athleteVerified !== true ||
    goalMedia.provenance.jockeyDetected !== false
  ) {
    throw new Error("Reviewed athlete-verified Goal provenance is required.");
  }

  const goalSamples = samplesInWindow(
    telemetry,
    goal.workoutGlobalSeconds,
    1500,
  );
  const samplesUnderTarget = goalSamples.filter(
    (sample) => sample.paceSecondsPer500m < goal.targetSplitSeconds,
  );
  const goalAverage = (property) =>
    goalSamples.reduce((total, sample) => total + sample[property], 0) /
    goalSamples.length;
  const timeWeighted = timeWeightedTargetEvaluation(
    telemetry,
    goal.workoutGlobalSeconds,
    1500,
    goal.targetSplitSeconds,
  );

  const work2Comparison = explanationBundle.supportingEvidence.find(
    (evidence) => evidence.id === "candidate-work-2-concept2",
  );
  const work3Comparison = explanationBundle.contradictingEvidence.find(
    (evidence) => evidence.id === "candidate-work-3-concept2",
  );
  const pegasusUnresolved = explanationBundle.contradictingEvidence.find(
    (evidence) =>
      evidence.id === "pegasus-interval-2-vs-3-visual-unresolved",
  );
  const jockeySupplement = askWakeContext.supplementalObservation;

  if (
    !work2Comparison ||
    !work3Comparison ||
    !pegasusUnresolved ||
    jockeySupplement.timestampBasis !== "clip-local" ||
    jockeySupplement.hypothesisOnly !== true ||
    jockeySupplement.occurredInSelectedWorkoutWindows !== "not-established" ||
    jockeySupplement.causalClaim !== "rejected"
  ) {
    throw new Error("Frozen D-014/D-015 evidence boundaries are incomplete.");
  }

  const common = {
    confidence: 1,
    reviewState: "human-reviewed",
    generationMode: "derived",
  };
  const insights = [
    {
      insightId: "insight-work2-progressive-build",
      headline: "Work 2 built power every minute",
      explanation:
        "Across four inclusive-start/exclusive-end minute windows, average power rose from 150.4 to 159.6 to 160.9 to 171.7 W. Every minute exceeded the previous minute, supporting a deterministic progressive-build classification.",
      category: "interval-progression",
      startSeconds: 420,
      endSeconds: 660,
      focusSeconds: 630,
      associatedSegments: [{ segmentId: "work-2", role: "primary" }],
      associatedEvents: [],
      metrics: {
        minuteWindows: work2Minutes,
        wattsStrictlyIncreasedEveryMinute: work2WattsStrictlyIncreased,
        minuteToMinuteWattsDelta: work2Minutes
          .slice(1)
          .map((minute, index) =>
            round(minute.averageWatts - work2Minutes[index].averageWatts),
          ),
      },
      derivation: {
        method: "arithmetic mean of telemetry samples per minute window",
        intervalBounds: "inclusive-start-exclusive-end",
        acceptanceRule:
          "Accept progressive build only when each minute averageWatts is strictly greater than the previous minute.",
      },
      citedSourceIds: [sourceId],
      citedSourcePaths: [sourcePath],
      limitations: [
        "Minute means summarize recorded Concept2 samples and do not identify a visual or causal mechanism.",
      ],
      ...common,
    },
    {
      insightId: "insight-work3-late-surge",
      headline: "Work 3 finished with a large output surge",
      explanation:
        "Work 3 minute 1 averaged 138.8 W at 26.5 spm, while minute 4 averaged 210.7 W at 30.5 spm: a 71.9 W and 4.0 spm increase. This describes telemetry only and does not assign a visual or causal mechanism.",
      category: "late-interval-surge",
      startSeconds: 840,
      endSeconds: 1080,
      focusSeconds: 1050,
      associatedSegments: [{ segmentId: "work-3", role: "primary" }],
      associatedEvents: [
        { eventId: "candidate-work-3", role: "overlapping-reviewed-window" },
      ],
      metrics: {
        minute1: work3Minute1,
        minute4: work3Minute4,
        wattsDelta: round(
          work3Minute4.averageWatts - work3Minute1.averageWatts,
        ),
        strokeRateDelta: round(
          work3Minute4.averageStrokeRate - work3Minute1.averageStrokeRate,
        ),
      },
      derivation: {
        method:
          "arithmetic mean of telemetry samples in Work 3 minute 1 and minute 4",
        intervalBounds: "inclusive-start-exclusive-end",
        mechanismInference: "none",
      },
      citedSourceIds: [sourceId],
      citedSourcePaths: [sourcePath],
      limitations: [
        "The calculation establishes an output/rate change but not why it occurred.",
        "No visual mechanism is inferred.",
      ],
      ...common,
    },
    {
      insightId: "insight-work4-strongest-interval",
      headline: "Work 4 ranked strongest across all four interval metrics",
      explanation:
        "Against all four work intervals, Work 4 ranked first for average watts (179.3 W), fastest average pace (125.4 s/500m), distance (962 m), and average stroke rate (30.2 spm). “Strongest” is limited to these measured first-place metrics.",
      category: "interval-ranking",
      startSeconds: 1260,
      endSeconds: 1500,
      focusSeconds: 1380,
      associatedSegments: [{ segmentId: "work-4", role: "primary" }],
      associatedEvents: [],
      metrics: {
        comparedIntervals: intervalComparison,
        work4,
        rankings,
        work4Ranks,
        firstPlaceMetrics,
      },
      derivation: {
        method:
          "recomputed arithmetic telemetry means plus normalized Concept2 interval distance",
        rankingRules: {
          averageWatts: "descending",
          averagePaceSecondsPer500m: "ascending (lower is faster)",
          distanceMeters: "descending",
          averageStrokeRate: "descending",
        },
        acceptanceRule:
          "Call a metric strongest only when Work 4 rank equals 1 for that metric.",
      },
      citedSourceIds: [sourceId],
      citedSourcePaths: [sourcePath],
      limitations: [
        "“Strongest” applies only to the four requested telemetry metrics and does not imply a visual or causal explanation.",
        "Distance is the normalized Concept2 interval total; other interval metrics are independently recomputed from samples.",
      ],
      ...common,
    },
    {
      insightId: "insight-sub215-goal-achieved",
      headline: "The athlete held sub-2:15 pace after the Goal",
      explanation:
        "After the athlete-verified Goal at workout 21:56.089, all 95 recorded samples through Work 4 end were strictly below 135 s/500m. Average pace was 123.9 s/500m, and the time-weighted under-target share was 100%. Achievement followed the voice note; the graph does not claim the note caused it.",
      category: "goal-evaluation",
      startSeconds: goal.workoutGlobalSeconds,
      endSeconds: 1500,
      focusSeconds: goal.workoutGlobalSeconds,
      associatedSegments: [{ segmentId: "work-4", role: "evaluation-window" }],
      associatedEvents: [
        {
          eventId: goal.id,
          eventType: "Goal",
          role: "athlete-authored-trigger",
          videoLocalSeconds: goal.videoLocalSeconds,
          workoutGlobalSeconds: goal.workoutGlobalSeconds,
          athleteVerified: true,
          jockeyDetected: false,
        },
      ],
      metrics: {
        targetPaceSecondsPer500m: goal.targetSplitSeconds,
        targetComparator: "strictly-less-than",
        evaluationStartSeconds: goal.workoutGlobalSeconds,
        evaluationEndSeconds: 1500,
        sampleCount: goalSamples.length,
        samplesUnderTarget: samplesUnderTarget.length,
        sampleShareUnderTarget: round(
          samplesUnderTarget.length / goalSamples.length,
          6,
        ),
        timeWeighted,
        averagePaceSecondsPer500m: round(
          goalAverage("paceSecondsPer500m"),
        ),
        bestPaceSecondsPer500m: Math.min(
          ...goalSamples.map((sample) => sample.paceSecondsPer500m),
        ),
        worstPaceSecondsPer500m: Math.max(
          ...goalSamples.map((sample) => sample.paceSecondsPer500m),
        ),
        averageWatts: round(goalAverage("watts")),
        averageStrokeRate: round(goalAverage("strokeRate")),
        allSamplesUnderTarget:
          samplesUnderTarget.length === goalSamples.length,
      },
      derivation: {
        method:
          "sample filter plus step-hold time weighting from canonical Goal time through Work 4 end",
        intervalBounds: "inclusive-start-exclusive-end",
        causalClaim: "rejected",
        temporalClaim: "achievement-followed-voice-note",
      },
      citedSourceIds: [
        sourceId,
        goal.id,
        goalMedia.eventId,
        goalMedia.sha256,
      ],
      citedSourcePaths: [
        sourcePath,
        "artifacts/twelvelabs/athlete-notes-bookmarks.json",
        "artifacts/media/replay-media-manifest.json",
      ],
      limitations: [
        "The Goal wording and timestamp are athlete-verified manual provenance; Jockey did not detect or transcribe it.",
        "The result establishes temporal order and target attainment, not that the voice note caused the performance.",
        "Time weighting uses a documented step-hold convention at the evaluation boundaries.",
      ],
      ...common,
    },
    {
      insightId: "insight-similar-rate-different-output",
      headline: "Similar rate produced very different output",
      explanation:
        "The selected Work 2 window averaged 157.3 W at 29.8 spm versus 215.3 W at 30.4 spm in Work 3. Pegasus left the visible explanation unresolved. Jockey’s separate side-view observation remains a clip-local, hypothesis-only mechanism candidate whose occurrence in these windows is not established and whose causal claim is rejected.",
      category: "cross-window-comparison",
      startSeconds: 525,
      endSeconds: 1050,
      focusSeconds: 1037,
      associatedSegments: [
        { segmentId: "work-2", role: "lower-output-window" },
        { segmentId: "work-3", role: "higher-output-window" },
      ],
      associatedEvents: [
        { eventId: "candidate-work-2", role: "hero-window" },
        { eventId: "candidate-work-3", role: "comparison-window" },
      ],
      metrics: {
        work2: {
          startSeconds: work2Comparison.startSeconds,
          endSeconds: work2Comparison.endSeconds,
          averageWatts: 157.3,
          averageStrokeRate: 29.8,
          evidenceId: work2Comparison.id,
        },
        work3: {
          startSeconds: work3Comparison.startSeconds,
          endSeconds: work3Comparison.endSeconds,
          averageWatts: 215.3,
          averageStrokeRate: 30.4,
          evidenceId: work3Comparison.id,
        },
        wattsDifference: 58,
        strokeRateDifference: 0.6,
        pegasus: {
          evidenceId: pegasusUnresolved.id,
          conclusion: "visual evidence unresolved",
        },
        jockey: {
          supplementalObservationId: jockeySupplement.id,
          timestampBasis: jockeySupplement.timestampBasis,
          hypothesisOnly: jockeySupplement.hypothesisOnly,
          occurredInSelectedWorkoutWindows:
            jockeySupplement.occurredInSelectedWorkoutWindows,
          causalClaim: jockeySupplement.causalClaim,
        },
      },
      derivation: {
        method:
          "frozen D-014 Concept2 comparison with frozen D-014 Pegasus limitation and D-015 supplemental boundaries",
        comparisonClassification: "comparison-not-recurrence",
        mechanismInference: "hypothesis-only",
      },
      citedSourceIds: [
        work2Comparison.id,
        work3Comparison.id,
        pegasusUnresolved.id,
        jockeySupplement.id,
      ],
      citedSourcePaths: [
        "graph/cache/explanation-bundle.json",
        "graph/cache/ask-wake-context.json",
        ...pegasusUnresolved.citations,
      ],
      limitations: [
        ...pegasusUnresolved.limitations,
        "The Jockey side-view source is a separate clip with clip-local timestamps.",
        "The side-view pattern is not established in either selected Concept2 window and is not established as the cause of the 58 W difference.",
      ],
      confidence: 0.75,
      reviewState: "calibrated-video-reviewed-unresolved",
      generationMode: "derived",
    },
  ];

  return {
    collectionId: "insight-collection-concept2-118993656-v1",
    workoutId: concept2.workoutId,
    title: "Wake reviewed workout insights",
    reviewState: "human-reviewed",
    generationMode: "derived",
    derivationVersion: "d018-v1",
    citedSourceIds: [
      concept2.workoutId,
      explanationBundle.insight.insightId,
      askWakeContext.contextId,
      goal.id,
    ],
    citedSourcePaths: [
      sourcePath,
      "artifacts/twelvelabs/athlete-notes-bookmarks.json",
      "artifacts/media/replay-media-manifest.json",
      "graph/cache/explanation-bundle.json",
      "graph/cache/ask-wake-context.json",
    ],
    limitations: [
      "The collection is deterministic and evidence-bound; it does not infer visual causes.",
      "D-014 ExplanationBundle and D-015 Ask Wake context are cited but not modified.",
      "Athlete-authored marks retain athlete-verified manual provenance and are not attributed to Jockey.",
    ],
    insights,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await deriveInsightCollection(), null, 2));
}
