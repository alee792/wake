type UnknownRecord = Record<string, unknown>;

export type GoalEvaluation = {
  eventId: string;
  statement: string;
  evaluationStartSeconds: number;
  evaluationEndSeconds: number;
  sampleCount: number;
  samplesUnderTarget: number;
  averageSplitSecondsPer500m: number;
  bestSplitSecondsPer500m: number;
  worstSplitSecondsPer500m: number;
  averageWatts: number;
  averageStrokeRate: number;
  limitations: string[];
};

const modules = import.meta.glob(
  "../../../artifacts/data/athlete-mark-evaluations.json",
  { eager: true, import: "default" },
) as Record<string, unknown>;

function record(value: unknown): UnknownRecord | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : undefined;
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function decodeGoalEvaluation(value: unknown): GoalEvaluation | undefined {
  const root = record(value);
  const provenance = record(root?.provenance);
  const goal = record(root?.goal);
  if (
    provenance?.athleteVerified !== true ||
    provenance?.jockeyDetected !== false ||
    !goal ||
    typeof goal.eventId !== "string" ||
    typeof goal.statement !== "string"
  ) {
    return undefined;
  }
  const numericKeys = [
    "evaluationStartSeconds",
    "evaluationEndSeconds",
    "sampleCount",
    "samplesUnderTarget",
    "averageSplitSecondsPer500m",
    "bestSplitSecondsPer500m",
    "worstSplitSecondsPer500m",
    "averageWatts",
    "averageStrokeRate",
  ] as const;
  if (numericKeys.some((key) => !finite(goal[key]))) return undefined;
  return {
    eventId: goal.eventId,
    statement: goal.statement,
    evaluationStartSeconds: goal.evaluationStartSeconds as number,
    evaluationEndSeconds: goal.evaluationEndSeconds as number,
    sampleCount: goal.sampleCount as number,
    samplesUnderTarget: goal.samplesUnderTarget as number,
    averageSplitSecondsPer500m: goal.averageSplitSecondsPer500m as number,
    bestSplitSecondsPer500m: goal.bestSplitSecondsPer500m as number,
    worstSplitSecondsPer500m: goal.worstSplitSecondsPer500m as number,
    averageWatts: goal.averageWatts as number,
    averageStrokeRate: goal.averageStrokeRate as number,
    limitations: Array.isArray(goal.limitations)
      ? goal.limitations.filter((item): item is string => typeof item === "string")
      : [],
  };
}

export const goalEvaluation = decodeGoalEvaluation(Object.values(modules)[0]);
