type UnknownRecord = Record<string, unknown>;

export type AuraInsight = {
  id: string;
  headline: string;
  summary: string;
  explanation: string;
  startSeconds: number;
  endSeconds: number;
  focusSeconds: number;
  metrics: UnknownRecord;
  limitations: string[];
};

const modules = import.meta.glob(
  "../../../graph/cache/insight-collection.json",
  { eager: true, import: "default" },
) as Record<string, unknown>;

const summaries: Record<string, string> = {
  "insight-work2-progressive-build": "Work 2 built power every minute.",
  "insight-work3-late-surge":
    "Work 3 finished with a 71.9 W minute-1-to-minute-4 surge.",
  "insight-work4-strongest-interval":
    "Work 4 ranked first in watts, pace, distance, and stroke rate.",
  "insight-sub215-goal-achieved":
    "Every recorded sample after the Goal was under 2:15.",
  "insight-similar-rate-different-output":
    "Nearly equal rates produced a 58 W difference that frontal video could not explain.",
};

function record(value: unknown): UnknownRecord | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : undefined;
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function decodeInsightCollection(value: unknown): AuraInsight[] {
  const root = record(value);
  if (
    root?.source !== "cached-neo4j" ||
    root.generationMode !== "derived" ||
    !Array.isArray(root.insights)
  ) {
    return [];
  }
  return root.insights.flatMap((value): AuraInsight[] => {
    const insight = record(value);
    const id = typeof insight?.insightId === "string" ? insight.insightId : "";
    const accepted =
      insight?.reviewState === "human-reviewed" ||
      insight?.reviewState === "calibrated-video-reviewed-unresolved";
    if (
      !summaries[id] ||
      !accepted ||
      typeof insight?.headline !== "string" ||
      typeof insight.explanation !== "string" ||
      !finite(insight.startSeconds) ||
      !finite(insight.endSeconds) ||
      !finite(insight.focusSeconds)
    ) {
      return [];
    }
    return [{
      id,
      headline: insight.headline,
      summary: summaries[id],
      explanation: insight.explanation,
      startSeconds: insight.startSeconds,
      endSeconds: insight.endSeconds,
      focusSeconds: insight.focusSeconds,
      metrics: record(insight.metrics) ?? {},
      limitations: Array.isArray(insight.limitations)
        ? insight.limitations.filter(
            (item): item is string => typeof item === "string",
          )
        : [],
    }];
  });
}

export const auraInsights = decodeInsightCollection(Object.values(modules)[0]);
