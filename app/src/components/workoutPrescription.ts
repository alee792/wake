type UnknownRecord = Record<string, unknown>;

export type WorkoutTarget = {
  position: number;
  name: string;
  durationSeconds: number;
  pace: string;
  strokeRateSpm: number;
};

export type WorkoutPrescription = {
  id: string;
  title: string;
  equipment: string;
  reviewState: string;
  warmUp: {
    duration: string;
    instructions: string;
  };
  coolDown: {
    duration: string;
    instructions: string;
  };
  mainSet: {
    display: string;
    recoverySeconds: number;
    recoveryIntensity: string;
    intervals: WorkoutTarget[];
  };
  successCriteria: string[];
  insightIds: string[];
  recipePath: string;
  recipeInstructions: string[];
  transferDisclaimer: string;
  limitations: string[];
};

const modules = import.meta.glob(
  "../../../graph/cache/workout-prescription.json",
  { eager: true, import: "default" },
) as Record<string, unknown>;

function record(value: unknown): UnknownRecord | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : undefined;
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function textList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
    : [];
}

/**
 * Empty-safe boundary for the captured D-016 graph artifact.
 *
 * The UI receives only reviewed deterministic prescriptions with complete,
 * ordered targets. Any missing or provisional input returns undefined so the
 * caller can retain its existing cue-only fallback.
 */
export function decodeWorkoutPrescription(
  value: unknown,
): WorkoutPrescription | undefined {
  const root = record(value);
  const authorship = record(root?.authorship);
  const warmUp = record(root?.warmUp);
  const coolDown = record(root?.coolDown);
  const mainSet = record(root?.mainSet);
  const ergData = record(root?.ergDataProgramming);
  const evidence = record(root?.evidence);
  const rawIntervals = Array.isArray(mainSet?.intervals) ? mainSet.intervals : [];
  const intervals = rawIntervals.length
    ? rawIntervals.flatMap((value): WorkoutTarget[] => {
        const interval = record(value);
        const pace = record(interval?.paceTarget);
        const name = text(interval?.name);
        const paceDisplay = text(pace?.display);
        if (
          !finite(interval?.position) ||
          !name ||
          !finite(interval.durationSeconds) ||
          !paceDisplay ||
          !finite(interval.strokeRateTargetSpm)
        ) {
          return [];
        }

        return [{
          position: interval.position,
          name,
          durationSeconds: interval.durationSeconds,
          pace: paceDisplay,
          strokeRateSpm: interval.strokeRateTargetSpm,
        }];
      })
    : [];
  const successCriteria = Array.isArray(root?.successCriteria)
    ? root.successCriteria.flatMap((value): string[] => {
        const statement = text(record(value)?.statement);
        return statement ? [statement] : [];
      })
    : [];
  const insightIds = textList(evidence?.citedInsightIds);
  const recipeInstructions = textList(ergData?.instructions);
  const limitations = textList(root?.limitations);
  const id = text(root?.prescriptionId);
  const title = text(root?.title);
  const equipment = text(root?.equipment);
  const reviewState = text(root?.reviewState);
  const warmUpDuration = text(warmUp?.displayDuration);
  const warmUpInstructions = text(warmUp?.instructions);
  const coolDownDuration = text(coolDown?.displayDuration);
  const coolDownInstructions = text(coolDown?.instructions);
  const mainSetDisplay = text(mainSet?.display);
  const recoverySeconds = mainSet?.recoverySeconds;
  const recoveryIntensity = text(mainSet?.recoveryIntensity);
  const recipePath = text(ergData?.path);
  const transferDisclaimer = text(ergData?.disclaimer);

  if (
    root?.source !== "cached-neo4j" ||
    reviewState !== "human-reviewed" ||
    authorship?.mode !== "deterministic-human-reviewed" ||
    authorship.aiGenerated !== false ||
    authorship.bedrockGenerated !== false ||
    ergData?.automaticTransfer !== false ||
    !id ||
    !title ||
    !equipment ||
    !warmUpDuration ||
    !warmUpInstructions ||
    !coolDownDuration ||
    !coolDownInstructions ||
    !mainSetDisplay ||
    !finite(recoverySeconds) ||
    !recoveryIntensity ||
    !recipePath ||
    !transferDisclaimer ||
    intervals.length !== 4 ||
    intervals.length !== rawIntervals.length ||
    successCriteria.length !== 4 ||
    insightIds.length !== 5 ||
    recipeInstructions.length === 0
  ) {
    return undefined;
  }

  const orderedIntervals = [...intervals].sort(
    (left, right) => left.position - right.position,
  );
  if (orderedIntervals.some((interval, index) => interval.position !== index + 1)) {
    return undefined;
  }

  return {
    id,
    title,
    equipment,
    reviewState,
    warmUp: {
      duration: warmUpDuration,
      instructions: warmUpInstructions,
    },
    coolDown: {
      duration: coolDownDuration,
      instructions: coolDownInstructions,
    },
    mainSet: {
      display: mainSetDisplay,
      recoverySeconds,
      recoveryIntensity,
      intervals: orderedIntervals,
    },
    successCriteria,
    insightIds,
    recipePath,
    recipeInstructions,
    transferDisclaimer,
    limitations,
  };
}

export const workoutPrescription = decodeWorkoutPrescription(
  Object.values(modules)[0],
);
