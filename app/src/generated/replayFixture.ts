import normalized from "../../../artifacts/data/concept2-normalized.json";
import manifestArtifact from "../../../artifacts/build-manifest.json";
import coachOutput from "../../../artifacts/strands-openai/coach-output.manual.json";
import pegasusEvidence from "../../../artifacts/twelvelabs/pegasus-normalized-evidence.json";
import heroVideo from "../assets/replay-media/wake-hero-work2.mp4";
import heroPoster from "../assets/replay-media/wake-hero-work2.jpg";
import comparisonVideo from "../assets/replay-media/wake-comparison-work3.mp4";
import comparisonPoster from "../assets/replay-media/wake-comparison-work3.jpg";
import type {
  BuildManifest,
  Event,
  ExplanationBundle,
  Interval,
  Phase,
  ProviderObservation,
  ReplayFixture,
  TelemetrySample,
} from "../domain/contracts";

const phases = normalized.phases as Phase[];

const intervals: Interval[] = normalized.workIntervals.map((interval, index) => ({
  ...interval,
  insight:
    index === 1
      ? "Rate rose while power softened"
      : index === 2
        ? "Rate rise retained power"
        : "Stable work",
}));

const telemetry: TelemetrySample[] = normalized.telemetry.map((sample) => ({
  timeSeconds: sample.globalSeconds,
  watts: sample.watts,
  strokeRate: sample.strokeRate,
  paceSecondsPer500m: sample.paceSecondsPer500m,
}));

export const replayTelemetryMetadata = normalized.telemetry.map((sample) => ({
  elapsedSeconds: sample.globalSeconds,
  heartRate: sample.heartRate,
  paceSecondsPer500m: sample.paceSecondsPer500m,
}));

const heroEvent: Event = {
  id: "candidate-work-2",
  title: "Work 2 rate rose as power fell",
  startSeconds: 525,
  endSeconds: 545,
  focusSeconds: 535,
  intervalId: "work-2",
  importance: "hero",
  insightId: "insight-rate-without-power",
};

const recurrenceEvent: Event = {
  id: "candidate-work-3",
  title: "Work 3 connected comparison",
  startSeconds: 1025,
  endSeconds: 1050,
  focusSeconds: 1037,
  intervalId: "work-3",
  importance: "recurrence",
  insightId: "insight-rate-without-power",
};

const heroMeasurement: ProviderObservation = {
  id: "candidate-work-2-concept2",
  provider: "concept2",
  startSeconds: 525,
  endSeconds: 545,
  kind: "measurement",
  statement:
    "Compared with the preceding 20 seconds, average stroke rate rose 1.4 spm while average power fell 8.2 W.",
  confidence: 1,
  citations: ["data/concept2/118993656/concept2-result-118993656.csv"],
  limitations: ["The comparison describes measured output, not its cause."],
  generationMode: "derived",
};

const recurrenceMeasurement: ProviderObservation = {
  id: "candidate-work-3-concept2",
  provider: "concept2",
  startSeconds: 1025,
  endSeconds: 1050,
  kind: "measurement",
  statement:
    "In the later comparison window, stroke rate rose 1.3 spm and average power rose 15.1 W versus the preceding 20 seconds.",
  confidence: 1,
  citations: ["data/concept2/118993656/concept2-result-118993656.csv"],
  limitations: ["This later window is a contrast, not proof of a technique change."],
  generationMode: "derived",
};

const heroVisualEvidence = pegasusEvidence.observations.find(
  (observation) => observation.id === "pegasus-interval-2-vs-3-visual-unresolved",
) as ProviderObservation;

const explanation: ExplanationBundle = {
  insight: {
    id: "insight-rate-without-power",
    headline: coachOutput.headline,
    explanation: coachOutput.explanation,
    confidence: 0.75,
  },
  event: heroEvent,
  segment: phases[2],
  supportingEvidence: [heroMeasurement, heroVisualEvidence],
  contradictingEvidence: [recurrenceMeasurement],
  recurrences: [recurrenceEvent],
  drill: {
    id: "drill-hold-pressure-before-rate",
    name: coachOutput.cue,
    instructions: coachOutput.drill,
    successCriterion: coachOutput.successCriterion,
  },
  source: "cached-neo4j",
};

const buildManifest = manifestArtifact as BuildManifest;

export const replayFixture: ReplayFixture = {
  schemaVersion: "1.0",
  session: {
    id: "concept2-118993656",
    title: "4 × 4:00 / 3:00 recovery",
    date: "2026-07-30",
    durationSeconds: 1680,
    status: "Reviewed Replay",
    distanceMeters: 5941,
  },
  phases,
  intervals,
  telemetry,
  events: [heroEvent, recurrenceEvent],
  explanations: {
    [heroEvent.id]: explanation,
    [recurrenceEvent.id]: {
      ...explanation,
      insight: {
        ...explanation.insight,
        headline: "Here, the rate increase carried power with it.",
        explanation:
          "Work 3 provides the contrast: rate rose by a similar amount while average watts also climbed.",
      },
      event: recurrenceEvent,
      segment: phases[4],
      supportingEvidence: [recurrenceMeasurement, heroVisualEvidence],
      contradictingEvidence: [heroMeasurement],
      recurrences: [heroEvent],
    },
  },
  recommendations: [
    {
      id: "recommendation-rate-lock",
      insightId: "insight-rate-without-power",
      focus: coachOutput.cue,
      drill: coachOutput.drill,
      successCriterion: coachOutput.successCriterion,
    },
  ],
  mediaMappings: [
    {
      assetId: "6a6bb004c1ac59f5d1d0c0a8",
      replayStartSeconds: 525,
      replayEndSeconds: 545,
      mediaStartSeconds: 2,
      mediaEndSeconds: 22,
      src: heroVideo,
      poster: heroPoster,
    },
    {
      assetId: "6a6bb004c1ac59f5d1d0c0a8",
      replayStartSeconds: 1025,
      replayEndSeconds: 1050,
      mediaStartSeconds: 2,
      mediaEndSeconds: 27,
      src: comparisonVideo,
      poster: comparisonPoster,
    },
  ],
  initialState: {
    currentTimeSeconds: heroEvent.focusSeconds,
    selectedEventId: heroEvent.id,
    selectedIntervalId: heroEvent.intervalId,
    evidenceExpanded: false,
    provenanceExpanded: false,
    videoExpanded: false,
  },
  buildManifest,
};
