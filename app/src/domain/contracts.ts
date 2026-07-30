export type GenerationMode = "api" | "cached-api" | "derived" | "manual";

export type ProviderObservation = {
  id: string;
  provider:
    | "concept2"
    | "twelvelabs-pegasus"
    | "twelvelabs-jockey"
    | "manual";
  startSeconds: number;
  endSeconds: number;
  kind: "measurement" | "visual" | "technique" | "context";
  statement: string;
  confidence?: number;
  citations: string[];
  limitations: string[];
  generationMode: GenerationMode;
  rawResponsePath?: string;
};

export type Session = {
  id: string;
  title: string;
  date: "2026-07-30";
  durationSeconds: 1680;
  status: "Reviewed Replay";
  distanceMeters: number;
};

export type Phase = {
  id: string;
  name: string;
  type: "work" | "recovery";
  startSeconds: number;
  endSeconds: number;
};

export type Segment = Phase;

export type Interval = {
  id: string;
  name: string;
  startSeconds: number;
  endSeconds: number;
  workSeconds: number;
  distanceMeters: number;
  averagePaceSecondsPer500m: number;
  averageWatts: number;
  averageStrokeRate: number;
  insight?: string;
};

export type TelemetrySample = {
  timeSeconds: number;
  watts: number;
  strokeRate: number;
  paceSecondsPer500m?: number;
  distanceMeters?: number;
};

export type Event = {
  id: string;
  title: string;
  startSeconds: number;
  endSeconds: number;
  focusSeconds: number;
  intervalId: string;
  importance: "hero" | "recurrence" | "context";
  insightId: string;
};

export type ReplayEvent = Event;

export type Insight = {
  id: string;
  headline: string;
  explanation: string;
  confidence: number;
};

export type Drill = {
  id: string;
  name: string;
  instructions: string;
  successCriterion: string;
};

export type ExplanationBundle = {
  insight: Insight;
  event: Event;
  segment: Segment;
  supportingEvidence: ProviderObservation[];
  contradictingEvidence: ProviderObservation[];
  recurrences: Event[];
  drill: Drill;
  source: "neo4j" | "cached-neo4j";
};

export type Recommendation = {
  id: string;
  insightId: string;
  focus: string;
  drill: string;
  successCriterion: string;
};

export type MediaMapping = {
  replayStartSeconds: number;
  replayEndSeconds: number;
  assetId: string;
  mediaStartSeconds: number;
  mediaEndSeconds?: number;
  src?: string;
  poster?: string;
};

export type ReplayState = {
  currentTimeSeconds: number;
  selectedEventId: string;
  selectedIntervalId?: string;
  evidenceExpanded: boolean;
  provenanceExpanded: boolean;
  videoExpanded?: boolean;
};

export type BuildStep = {
  id: string;
  role: string;
  provider: string;
  modelOrService: string;
  executionMode:
    | "real-api"
    | "cached-real-api"
    | "live-local"
    | "derived"
    | "manual";
  inputPaths: string[];
  outputPaths: string[];
  providerResponseId?: string;
  timestamp: string;
  contentHash?: string;
  humanReviewed: boolean;
};

export type BuildManifest = {
  schemaVersion: "1.0";
  generatedAt: string;
  recordingMode: "offline";
  steps: BuildStep[];
};

export type CoachOutput = {
  headline: string;
  explanation: string;
  cue: string;
  drill: string;
  successCriterion: string;
  citedObservationIds: string[];
  limitation: string;
};

export type ReplayFixture = {
  schemaVersion: "1.0";
  session: Session;
  phases: Phase[];
  intervals: Interval[];
  telemetry: TelemetrySample[];
  events: ReplayEvent[];
  explanations: Record<string, ExplanationBundle>;
  recommendations: Recommendation[];
  mediaMappings: MediaMapping[];
  initialState: ReplayState;
  buildManifest: BuildManifest;
};
