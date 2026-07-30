import { useMemo, useState } from "react";
import { ReplayPage } from "./components/ReplayPage";
import { AskWakePanel } from "./components/AskWakePanel";
import { athleteMarks, type AthleteMark } from "./components/athleteMarks";
import { validatedAskWakeAnswer } from "./components/askWakeArtifact";
import { goalEvaluation } from "./components/goalEvaluation";
import { auraInsights, type AuraInsight } from "./components/insightCollection";
import type { SelectedMomentProps } from "./components/SelectedMoment";
import {
  resolveReplayMedia,
  type PackagedReplayMediaAsset,
} from "./components/replayMedia";
import {
  replayFixture,
  replayTelemetryMetadata,
} from "./generated/replayFixture";
import sideViewVideo from "./assets/replay-media/wake-sideview-candidate-mechanism.mp4";
import sideViewPoster from "./assets/replay-media/wake-sideview-candidate-mechanism.jpg";

const athleteHeartRateZones = [
  {
    id: "Z1",
    label: "Very Light",
    lowBpm: 93,
    highBpm: 112,
    purpose: "Warm-ups, cool-downs, and easy recovery movement.",
  },
  {
    id: "Z2",
    label: "Light",
    lowBpm: 112,
    highBpm: 130,
    purpose: "Aerobic base, endurance, and fat metabolism.",
  },
  {
    id: "Z3",
    label: "Moderate",
    lowBpm: 130,
    highBpm: 149,
    purpose: "Overall stamina and cardio fitness.",
  },
  {
    id: "Z4",
    label: "Hard",
    lowBpm: 149,
    highBpm: 167,
    purpose: "Lactate threshold and speed.",
  },
  {
    id: "Z5",
    label: "Maximum",
    lowBpm: 167,
    highBpm: 186,
    purpose: "Short intense bursts and peak power.",
  },
] as const;

function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function formatPreciseClock(totalSeconds: number) {
  const milliseconds = Math.max(0, Math.round(totalSeconds * 1000));
  const wholeSeconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(
    2,
    "0",
  )}.${String(milliseconds % 1000).padStart(3, "0")}`;
}

function formatPace(seconds: number) {
  return formatClock(seconds);
}

function formatPaceTenth(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds - minutes * 60).toFixed(1).padStart(4, "0")}`;
}

function intervalFor(seconds: number) {
  return replayFixture.intervals.find(
    (candidate) =>
      seconds >= candidate.startSeconds && seconds < candidate.endSeconds,
  );
}

function insightMetrics(insight: AuraInsight) {
  const metrics = insight.metrics;
  switch (insight.id) {
    case "insight-work2-progressive-build":
      return [
        { label: "Minute 1", value: "150.4 W" },
        { label: "Minute 4", value: "171.7 W" },
        { label: "Progression", value: "4 / 4 rising" },
      ];
    case "insight-work3-late-surge":
      return [
        { label: "Power change", value: `+${Number(metrics.wattsDelta).toFixed(1)} W` },
        { label: "Rate change", value: `+${Number(metrics.strokeRateDelta).toFixed(1)} spm` },
        { label: "Minute 4", value: "210.7 W" },
      ];
    case "insight-work4-strongest-interval":
      return [
        { label: "Average power", value: "179.3 W" },
        { label: "Average pace", value: "2:05.4 /500m" },
        { label: "Distance · rate", value: "962 m · 30.2 spm" },
      ];
    case "insight-sub215-goal-achieved":
      return goalEvaluation
        ? [
            {
              label: "Samples under",
              value: `${goalEvaluation.samplesUnderTarget}/${goalEvaluation.sampleCount}`,
            },
            {
              label: "Average split",
              value: `${formatPaceTenth(goalEvaluation.averageSplitSecondsPer500m)} /500m`,
            },
            {
              label: "Power · rate",
              value: `${goalEvaluation.averageWatts.toFixed(1)} W · ${goalEvaluation.averageStrokeRate.toFixed(1)} spm`,
            },
          ]
        : [];
    case "insight-similar-rate-different-output":
      return [
        { label: "Power difference", value: "58 W" },
        { label: "Rate difference", value: "0.6 spm" },
        { label: "Visual finding", value: "Unresolved" },
      ];
    default:
      return [];
  }
}

const packagedReplayMedia: PackagedReplayMediaAsset[] =
  replayFixture.mediaMappings.flatMap((mapping) => {
    if (!mapping.src) return [];
    const isHero = mapping.replayStartSeconds === 525;
    return [
      {
        assetId: mapping.assetId,
        src: mapping.src,
        poster: mapping.poster,
        label: isHero ? "Reviewed Work 2 clip" : "Reviewed Work 3 comparison clip",
        alt: isHero
          ? "Reviewed frontal video for the selected Work 2 moment"
          : "Reviewed frontal video for the Work 3 comparison moment",
      },
    ];
  });

export default function App() {
  const [replayState, setReplayState] = useState(replayFixture.initialState);
  const [selectedAthleteMarkId, setSelectedAthleteMarkId] = useState<
    string | undefined
  >();
  const [selectedInsightId, setSelectedInsightId] = useState<string>();
  const acceptedAthleteMarks = athleteMarks.filter(
    (mark) => mark.reviewState === "accepted",
  );
  const selectedAthleteMark = acceptedAthleteMarks.find(
    (mark) => mark.id === selectedAthleteMarkId,
  );
  const selectedInsight = auraInsights.find(
    (insight) => insight.id === selectedInsightId,
  );

  const selectedEvent = useMemo(
    () =>
      replayFixture.events.find(
        (event) => event.id === replayState.selectedEventId,
      ) ?? replayFixture.events[0],
    [replayState.selectedEventId],
  );
  const explanation = replayFixture.explanations[selectedEvent.id];
  const selectedRecommendation = replayFixture.recommendations.find(
    (recommendation) =>
      recommendation.insightId === explanation.insight.id,
  )!;
  const selectedMedia = useMemo(
    () =>
      resolveReplayMedia(
        replayState.currentTimeSeconds,
        replayFixture.mediaMappings,
        packagedReplayMedia,
      ),
    [replayState.currentTimeSeconds],
  );

  const selectEvent = (eventId: string) => {
    const event = replayFixture.events.find((candidate) => candidate.id === eventId);
    if (!event) return;
    setSelectedAthleteMarkId(undefined);
    setSelectedInsightId(undefined);
    setReplayState((state) => ({
      ...state,
      currentTimeSeconds: event.focusSeconds,
      selectedEventId: event.id,
      selectedIntervalId: event.intervalId,
    }));
  };

  const selectInterval = (intervalId: string) => {
    const interval = replayFixture.intervals.find(
      (candidate) => candidate.id === intervalId,
    );
    if (!interval) return;
    setSelectedAthleteMarkId(undefined);
    setSelectedInsightId(undefined);
    const primaryEvent = replayFixture.events.find(
      (event) => event.intervalId === interval.id,
    );
    setReplayState((state) => ({
      ...state,
      currentTimeSeconds: primaryEvent?.focusSeconds ?? interval.startSeconds,
      selectedEventId: primaryEvent?.id ?? state.selectedEventId,
      selectedIntervalId: interval.id,
    }));
  };

  const selectAthleteMark = (mark: AthleteMark) => {
    if (mark.reviewState !== "accepted") return;
    const interval = mark.kind === "goal" ? intervalFor(mark.workoutGlobalSeconds) : undefined;
    setSelectedAthleteMarkId(mark.id);
    setSelectedInsightId(undefined);
    setReplayState((state) => ({
      ...state,
      currentTimeSeconds: mark.workoutGlobalSeconds,
      selectedIntervalId: interval?.id,
    }));
  };

  const selectInsight = (insightId: string) => {
    const insight = auraInsights.find((candidate) => candidate.id === insightId);
    if (!insight) return;
    setSelectedAthleteMarkId(undefined);
    setSelectedInsightId(insight.id);
    setReplayState((state) => ({
      ...state,
      currentTimeSeconds: insight.focusSeconds,
      selectedIntervalId: intervalFor(insight.focusSeconds)?.id,
    }));
  };

  const activeMedia = selectedAthleteMark
    ? {
        label:
          selectedAthleteMark.kind === "goal"
            ? "Reviewed athlete Goal clip"
            : "Reviewed athlete Flag clip",
        timestamp: formatPreciseClock(selectedAthleteMark.workoutGlobalSeconds),
        src: selectedAthleteMark.media.src,
        poster: selectedAthleteMark.media.poster,
        alt:
          selectedAthleteMark.kind === "goal"
            ? "Reviewed local video for the athlete Goal at Replay 21:56.089"
            : "Reviewed local video for Flag 1 in Recovery 3 at Replay 19:38.089",
        desiredTimeSeconds: selectedAthleteMark.media.focusOffsetSeconds,
        alignmentLabel: "Estimated alignment ±0.7s",
      }
    : selectedInsight?.id === "insight-sub215-goal-achieved"
      ? (() => {
          const goal = acceptedAthleteMarks.find((mark) => mark.kind === "goal");
          return goal
            ? {
                label: "Reviewed athlete Goal clip",
                timestamp: formatPreciseClock(goal.workoutGlobalSeconds),
                src: goal.media.src,
                poster: goal.media.poster,
                alt: "Reviewed local video for the athlete Goal at Replay 21:56.089",
                desiredTimeSeconds: goal.media.focusOffsetSeconds,
                alignmentLabel: "Estimated alignment ±0.7s",
              }
            : {
                label: "Video unavailable for this Replay moment",
                timestamp: formatPreciseClock(replayState.currentTimeSeconds),
                alt: "No reviewed local video is mapped to this Replay moment.",
              };
        })()
      : selectedMedia
        ? {
            label: selectedMedia.label,
            timestamp: formatClock(replayState.currentTimeSeconds),
            src: selectedMedia.src,
            poster: selectedMedia.poster,
            alt: selectedMedia.alt,
            desiredTimeSeconds: selectedMedia.desiredTimeSeconds,
            alignmentLabel: "Estimated alignment ±0.7s",
          }
        : {
            label: "Video unavailable for this Replay moment",
            timestamp: selectedInsight
              ? formatClock(selectedInsight.focusSeconds)
              : formatClock(replayState.currentTimeSeconds),
            alt: "No reviewed local video is mapped to this Replay moment.",
          };

  const athleteMoment: SelectedMomentProps | undefined = selectedAthleteMark
    ? selectedAthleteMark.kind === "goal" && goalEvaluation
      ? {
          eyebrow: "GOAL",
          timestamp: formatPreciseClock(selectedAthleteMark.workoutGlobalSeconds),
          headline: "Goal achieved",
          explanation: selectedAthleteMark.statement,
          metrics: [
            {
              label: "Samples under target",
              value: `${goalEvaluation.samplesUnderTarget}/${goalEvaluation.sampleCount}`,
            },
            {
              label: "Average split",
              value: `${formatPaceTenth(goalEvaluation.averageSplitSecondsPer500m)} /500m`,
            },
            {
              label: "Power · rate",
              value: `${goalEvaluation.averageWatts.toFixed(1)} W · ${goalEvaluation.averageStrokeRate.toFixed(1)} spm`,
            },
          ],
          evidenceSummaries: [
            {
              label: "Best / worst",
              value: `${formatPaceTenth(goalEvaluation.bestSplitSecondsPer500m)} / ${formatPaceTenth(goalEvaluation.worstSplitSecondsPer500m)}`,
            },
            {
              label: "Evaluated window",
              value: `${formatPreciseClock(goalEvaluation.evaluationStartSeconds)}–${formatClock(goalEvaluation.evaluationEndSeconds)}`,
            },
          ],
          evidence: [
            {
              id: "goal-recorded-samples",
              group: "Telemetry",
              statement:
                "95 of 95 recorded Concept2 samples were strictly under 2:15/500m.",
              timeRange: "21:56.089–25:00",
              provider: "Concept2",
              generationMode: "deterministic",
            },
            {
              id: "goal-midpoint-limitation",
              group: "Context or limitation",
              statement:
                "100% applies to recorded samples and midpoint-modeled sample support; telemetry is not continuous between samples.",
              provider: "Wake",
              generationMode: "deterministic",
            },
            {
              id: "goal-causation-limitation",
              group: "Context or limitation",
              statement:
                "The Goal preceded the result. Wake does not claim the voice note caused it.",
              provider: "Wake",
              generationMode: "human-reviewed",
            },
          ],
          evidenceExpanded: replayState.evidenceExpanded,
          onToggleEvidence: () =>
            setReplayState((state) => ({
              ...state,
              evidenceExpanded: !state.evidenceExpanded,
            })),
          media: activeMedia,
          athleteMark: selectedAthleteMark,
        }
      : {
          eyebrow: "FLAG",
          timestamp: formatPreciseClock(selectedAthleteMark.workoutGlobalSeconds),
          headline: "Athlete attention marker",
          explanation:
            "Recovery 3 · no meaning is inferred from the gesture or surrounding telemetry.",
          evidenceSummaries: [
            { label: "Phase", value: "Recovery 3" },
            { label: "Original video", value: "19:07.000" },
          ],
          evidence: [
            {
              id: "flag-provenance",
              group: "Context or limitation",
              statement: "Athlete attention marker in Recovery 3.",
              timeRange: "Replay 19:38.089",
              provider: "Athlete",
            },
            {
              id: "flag-meaning-boundary",
              group: "Context or limitation",
              statement:
                "No causal, coaching, fatigue, hydration, or technique meaning is assigned to the Flag.",
              provider: "Wake",
              generationMode: "deterministic",
            },
          ],
          evidenceExpanded: replayState.evidenceExpanded,
          onToggleEvidence: () =>
            setReplayState((state) => ({
              ...state,
              evidenceExpanded: !state.evidenceExpanded,
            })),
          media: activeMedia,
          athleteMark: selectedAthleteMark,
        }
    : undefined;

  const insightMoment: SelectedMomentProps | undefined = selectedInsight
    ? {
        eyebrow: "Aura insight",
        timestamp: `${formatClock(selectedInsight.startSeconds)}–${formatClock(
          selectedInsight.endSeconds,
        )}`,
        headline: selectedInsight.summary,
        explanation:
          selectedInsight.id === "insight-sub215-goal-achieved" && goalEvaluation
            ? "All 95 recorded samples after the athlete-verified Goal were strictly under 2:15/500m. This establishes target attainment after the note, not causation."
            : selectedInsight.explanation,
        metrics: insightMetrics(selectedInsight),
        evidenceSummaries: [
          { label: "Source", value: "Live Aura · equal offline cache" },
          {
            label: "Containing interval",
            value: intervalFor(selectedInsight.focusSeconds)?.name ?? "Cross-interval",
          },
        ],
        evidence: [
          {
            id: `${selectedInsight.id}-calculation`,
            group: "Telemetry",
            statement: selectedInsight.summary,
            timeRange: `${formatClock(selectedInsight.startSeconds)}–${formatClock(
              selectedInsight.endSeconds,
            )}`,
            provider: "Neo4j Aura",
            generationMode: "deterministic",
          },
          ...(selectedInsight.id === "insight-sub215-goal-achieved"
            ? [
                {
                  id: `${selectedInsight.id}-midpoint`,
                  group: "Context or limitation" as const,
                  statement:
                    "100% applies to recorded samples and midpoint-modeled sample support; telemetry is not continuous between samples.",
                  provider: "Wake",
                  generationMode: "deterministic",
                },
                {
                  id: `${selectedInsight.id}-causation`,
                  group: "Context or limitation" as const,
                  statement:
                    "The Goal preceded the result. Wake does not claim the voice note caused it.",
                  provider: "Wake",
                  generationMode: "human-reviewed",
                },
              ]
            : selectedInsight.limitations.map((limitation, index) => ({
                id: `${selectedInsight.id}-limitation-${index}`,
                group: "Context or limitation" as const,
                statement: limitation,
                provider: "Neo4j Aura",
                generationMode: "derived",
              }))),
        ],
        evidenceExpanded: replayState.evidenceExpanded,
        onToggleEvidence: () =>
          setReplayState((state) => ({
            ...state,
            evidenceExpanded: !state.evidenceExpanded,
          })),
        media: activeMedia,
        askWake:
          selectedInsight.id === "insight-similar-rate-different-output" ? (
            <AskWakePanel
              question="Why was output so different at nearly the same stroke rate?"
              answer={validatedAskWakeAnswer}
              sideView={{
                src: sideViewVideo,
                poster: sideViewPoster,
                durationSeconds: 43.281683,
              }}
            />
          ) : undefined,
      }
    : undefined;

  const defaultMoment: SelectedMomentProps = {
    timestamp: `${formatClock(selectedEvent.startSeconds)}–${formatClock(selectedEvent.endSeconds)}`,
    headline: explanation.insight.headline,
    explanation: explanation.insight.explanation,
    metrics:
      selectedEvent.importance === "hero"
        ? [
            { label: "Stroke rate", value: "+1.4 spm" },
            { label: "Power", value: "−8.2 W" },
            { label: "Pace", value: "+2.2 s / 500m" },
          ]
        : [
            { label: "Stroke rate", value: "+1.3 spm" },
            { label: "Power", value: "+15.1 W" },
          ],
    evidenceSummaries: explanation.supportingEvidence.slice(0, 2).map(
      (evidence) => ({
        label: evidence.provider === "concept2" ? "Concept2" : "Workout context",
        value: evidence.statement,
      }),
    ),
    evidence: [
      ...explanation.supportingEvidence,
      ...explanation.contradictingEvidence,
    ].map((evidence) => ({
      id: evidence.id,
      group:
        evidence.kind === "measurement"
          ? "Telemetry"
          : evidence.kind === "visual"
            ? "Visual"
            : "Context or limitation",
      statement: evidence.statement,
      timeRange: `${formatClock(evidence.startSeconds)}–${formatClock(evidence.endSeconds)}`,
      provider: evidence.provider,
      generationMode: evidence.generationMode,
      confidenceOrLimitation: evidence.limitations[0],
    })),
    evidenceExpanded: replayState.evidenceExpanded,
    onToggleEvidence: () =>
      setReplayState((state) => ({
        ...state,
        evidenceExpanded: !state.evidenceExpanded,
      })),
    recurrence: explanation.recurrences[0]
      ? {
          eventId: explanation.recurrences[0].id,
          label: "Inspect the connected comparison",
          timestamp: formatClock(explanation.recurrences[0].focusSeconds),
          description: explanation.recurrences[0].title,
        }
      : undefined,
    onSelectRecurrence: selectEvent,
    media: activeMedia,
    recommendation: <p>{selectedRecommendation.focus}</p>,
    askWake: (
      <AskWakePanel
        question="Why was output so different at nearly the same stroke rate?"
        answer={validatedAskWakeAnswer}
        sideView={{
          src: sideViewVideo,
          poster: sideViewPoster,
          durationSeconds: 43.281683,
        }}
      />
    ),
  };

  const moment = athleteMoment ?? insightMoment ?? defaultMoment;

  return (
    <ReplayPage
      session={{
        title: "Morning 4 × 4",
        date: "July 30, 2026",
        structure: "4 × 4:00 / 3:00 recovery",
        duration: "28:00",
        distance: `${replayFixture.session.distanceMeters.toLocaleString()} m`,
        machine: "Concept2",
        reviewLabel: replayFixture.session.status,
      }}
      replay={{
        durationSeconds: replayFixture.session.durationSeconds,
        currentTimeSeconds: replayState.currentTimeSeconds,
        selectedEventId:
          selectedAthleteMark || selectedInsight ? undefined : selectedEvent.id,
        phases: replayFixture.phases.map((phase) => ({
          ...phase,
          label: phase.name,
          kind: phase.type,
        })),
        telemetry: replayFixture.telemetry.map((sample, index) => ({
          elapsedSeconds: sample.timeSeconds,
          watts: sample.watts,
          strokeRate: sample.strokeRate,
          paceSecondsPer500m: sample.paceSecondsPer500m,
          heartRate: replayTelemetryMetadata[index]?.heartRate,
        })),
        heartRateZones: athleteHeartRateZones.map((zone) => ({ ...zone })),
        events: replayFixture.events.map((event) => ({
          ...event,
          label: event.title,
          kind:
            event.importance === "context"
              ? "moment"
              : event.importance === "recurrence"
                ? "comparison"
                : event.importance,
        })),
        athleteMarks: acceptedAthleteMarks,
        selectedAthleteMarkId,
        insights: auraInsights.map((insight) => ({
          id: insight.id,
          label: insight.summary,
          focusSeconds: insight.focusSeconds,
        })),
        selectedInsightId,
        onSeek: (currentTimeSeconds) =>
          {
            setSelectedAthleteMarkId(undefined);
            setSelectedInsightId(undefined);
            setReplayState((state) => ({ ...state, currentTimeSeconds }));
          },
        onEventSelect: (eventId) => selectEvent(eventId),
        onAthleteMarkSelect: selectAthleteMark,
        onInsightSelect: selectInsight,
      }}
      moment={moment}
      supporting={{
        intervals: replayFixture.intervals.map((interval) => ({
          id: interval.id,
          label: interval.name,
          workTime: formatClock(interval.workSeconds),
          meters: `${interval.distanceMeters} m`,
          pace: `${formatPace(interval.averagePaceSecondsPer500m)} /500m`,
          watts: `${interval.averageWatts.toFixed(1)} W`,
          strokeRate: `${interval.averageStrokeRate.toFixed(1)} spm`,
          insight: interval.insight ?? "—",
        })),
        selectedIntervalId: replayState.selectedIntervalId,
        onSelectInterval: selectInterval,
        onSelectInsight: selectInsight,
        nextSession: {
          drill: explanation.drill.name,
          instruction: explanation.drill.instructions,
          successCriterion: explanation.drill.successCriterion,
        },
        manifest: {
          steps: replayFixture.buildManifest.steps.map((step) => ({
            stepId: step.id,
            role: step.role,
            provider: step.provider,
            service: step.modelOrService,
            executionMode: step.executionMode,
            humanReviewed: step.humanReviewed,
          })),
        },
        provenanceExpanded: replayState.provenanceExpanded,
        onToggleProvenance: () =>
          setReplayState((state) => ({
            ...state,
            provenanceExpanded: !state.provenanceExpanded,
          })),
      }}
    />
  );
}
