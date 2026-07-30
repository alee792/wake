import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repoRoot = new URL("../../", import.meta.url);

export const citedInsightIds = [
  "insight-work2-progressive-build",
  "insight-work3-late-surge",
  "insight-work4-strongest-interval",
  "insight-sub215-goal-achieved",
  "insight-similar-rate-different-output",
];

export async function buildWorkoutPrescription() {
  const insightCollection = JSON.parse(
    await readFile(
      new URL("graph/cache/insight-collection.json", repoRoot),
      "utf8",
    ),
  );
  const availableInsightIds = new Set(
    insightCollection.insights.map((insight) => insight.insightId),
  );

  if (!citedInsightIds.every((insightId) => availableInsightIds.has(insightId))) {
    throw new Error("The canonical D-018 collection is missing a cited insight.");
  }

  return {
    prescriptionId: "workout-build-pressure-then-rate-v1",
    title: "Build pressure, then rate",
    equipment: "Concept2 RowErg",
    workoutId: insightCollection.workoutId,
    reviewState: "human-reviewed",
    generationMode: "manual",
    authorship: {
      author: "Wake coaching",
      mode: "deterministic-human-reviewed",
      aiGenerated: false,
      bedrockGenerated: false,
    },
    warmUp: {
      durationSeconds: 480,
      displayDuration: "8:00",
      intensity: "easy",
      builds: {
        count: 3,
        strokesPerBuild: 10,
      },
      instructions: "Row 8:00 easy, including three 10-stroke builds.",
    },
    mainSet: {
      display: "4 × 4:00 work / 3:00 easy",
      rounds: 4,
      workSeconds: 240,
      recoverySeconds: 180,
      recoveryIntensity: "easy",
      intervals: [
        {
          position: 1,
          name: "Work 1",
          durationSeconds: 240,
          paceTarget: {
            display: "2:12–2:15/500m",
            fastestSecondsPer500m: 132,
            slowestSecondsPer500m: 135,
          },
          strokeRateTargetSpm: 28,
        },
        {
          position: 2,
          name: "Work 2",
          durationSeconds: 240,
          paceTarget: {
            display: "2:09–2:12/500m",
            fastestSecondsPer500m: 129,
            slowestSecondsPer500m: 132,
          },
          strokeRateTargetSpm: 28,
        },
        {
          position: 3,
          name: "Work 3",
          durationSeconds: 240,
          paceTarget: {
            display: "2:06–2:09/500m",
            fastestSecondsPer500m: 126,
            slowestSecondsPer500m: 129,
          },
          strokeRateTargetSpm: 29,
        },
        {
          position: 4,
          name: "Work 4",
          durationSeconds: 240,
          paceTarget: {
            display: "2:03–2:06/500m",
            fastestSecondsPer500m: 123,
            slowestSecondsPer500m: 126,
          },
          strokeRateTargetSpm: 30,
        },
      ],
    },
    coolDown: {
      durationSeconds: 300,
      displayDuration: "5:00",
      intensity: "easy",
      instructions: "Row 5:00 easy.",
    },
    successCriteria: [
      {
        criterionId: "all-work-under-215",
        statement:
          "Every work interval averages strictly under 2:15/500m.",
        metric: "averagePaceSecondsPer500m",
        scope: "all-four-work-intervals",
        comparator: "strictly-less-than",
        target: 135,
        unit: "seconds-per-500m",
      },
      {
        criterionId: "work2-more-watts-at-similar-rate",
        statement:
          "Work 2 produces higher average watts than Work 1 while both remain at approximately 28 spm.",
        metric: "averageWatts",
        comparator: "work2-greater-than-work1",
        strokeRateTargetSpm: 28,
        strokeRateQualifier: "approximately",
      },
      {
        criterionId: "watts-nondecreasing",
        statement:
          "Average watts do not decrease across the four work intervals.",
        metric: "averageWatts",
        scope: "ordered-work-intervals",
        comparator: "nondecreasing",
      },
      {
        criterionId: "work4-pace-with-rate-cap",
        statement:
          "Work 4 averages 2:06/500m or faster without exceeding 30.5 spm.",
        scope: "work-4",
        paceMetric: "averagePaceSecondsPer500m",
        paceComparator: "less-than-or-equal",
        paceTargetSecondsPer500m: 126,
        strokeRateMetric: "averageStrokeRate",
        strokeRateComparator: "less-than-or-equal",
        strokeRateCapSpm: 30.5,
      },
    ],
    evidence: {
      collectionId: insightCollection.collectionId,
      sourcePath: "graph/cache/insight-collection.json",
      citedInsightIds,
    },
    ergDataProgramming: {
      path: "Create Workout → Variable Intervals",
      deliveryMode: "manual-copy-only",
      automaticTransfer: false,
      disclaimer:
        "Wake does not automatically transfer this workout to ErgData or a PM5.",
      instructions: [
        "Open ErgData and choose Create Workout → Variable Intervals.",
        "Add interval 1: 8:00 time, easy; include three 10-stroke builds.",
        "Add interval 2: 4:00 time, Work 1, target 2:12–2:15/500m at 28 spm.",
        "Add interval 3: 3:00 time, easy.",
        "Add interval 4: 4:00 time, Work 2, target 2:09–2:12/500m at 28 spm.",
        "Add interval 5: 3:00 time, easy.",
        "Add interval 6: 4:00 time, Work 3, target 2:06–2:09/500m at 29 spm.",
        "Add interval 7: 3:00 time, easy.",
        "Add interval 8: 4:00 time, Work 4, target 2:03–2:06/500m at 30 spm.",
        "Add interval 9: 3:00 time, easy.",
        "Add interval 10: 5:00 time, easy cool-down.",
        "Review all ten intervals, save the workout as “Build pressure, then rate,” and start it manually when ready.",
      ],
    },
    limitations: [
      "This is deterministic, human-reviewed Wake coaching, not AI-generated content.",
      "Wake does not automatically transfer the workout to ErgData or a PM5.",
      "Targets are evidence-grounded coaching instructions, not a guarantee of performance.",
      "Stop or reduce intensity if technique deteriorates or the athlete feels unwell.",
    ],
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await buildWorkoutPrescription(), null, 2));
}
