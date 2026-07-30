import goalVideo from "../assets/athlete-marks/wake-goal-work4-split-target.mp4";
import goalPoster from "../assets/athlete-marks/wake-goal-work4-split-target.jpg";
import flagVideo from "../assets/athlete-marks/wake-flag-work3-rest-finger1.mp4";
import flagPoster from "../assets/athlete-marks/wake-flag-work3-rest-finger1.jpg";

export type AthleteMarkReviewState = "accepted";
export type AthleteMarkConfidence = "manual-verified";

export type AthleteMarkMedia = {
  src: string;
  poster: string;
  focusOffsetSeconds: number;
  durationSeconds: number;
  sourceVideoTimestamp: string;
};

type AthleteMarkBase = {
  id: string;
  videoLocalSeconds: number;
  workoutGlobalSeconds: number;
  confidence: AthleteMarkConfidence;
  reviewState: AthleteMarkReviewState;
  note: string;
  media: AthleteMarkMedia;
  provenance: {
    athleteVerified: true;
    jockeyDetected: false;
  };
};

export type AthleteGoalMark = AthleteMarkBase & {
  kind: "goal";
  statement: string;
  target: {
    metric: "split";
    comparator: "strictly under";
    value: number;
    unit: "seconds / 500m";
  };
};

export type AthleteFlagMark = AthleteMarkBase & {
  kind: "flag";
  fingerCount: number;
  meaning: "Athlete attention marker";
};

export type AthleteMark = AthleteGoalMark | AthleteFlagMark;

type UnknownRecord = Record<string, unknown>;

const artifactModules = import.meta.glob(
  "../../../artifacts/twelvelabs/athlete-notes-bookmarks.json",
  { eager: true, import: "default" },
) as Record<string, unknown>;

const manifestModules = import.meta.glob(
  "../../../artifacts/media/replay-media-manifest.json",
  { eager: true, import: "default" },
) as Record<string, unknown>;

function record(value: unknown): UnknownRecord | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : undefined;
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function number(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function reviewedSource(source: UnknownRecord) {
  const status = text(source.reviewStatus);
  return (
    source.confidence === "manual-verified" &&
    (status === "human-reviewed" ||
      status === "manually-flagged-by-athlete")
  );
}

function decodedMedia(manifest: unknown) {
  const root = record(manifest);
  const entries = Array.isArray(root?.athleteEventMedia)
    ? root.athleteEventMedia
    : [];
  return new Map(
    entries.flatMap((entry) => {
      const source = record(entry);
      const provenance = record(source?.provenance);
      const id = text(source?.eventId);
      const role = text(source?.role);
      const sourceVideoTimestamp = text(source?.sourceVideoTimestamp);
      const sourceVideoTimeSeconds = number(source?.sourceVideoTimeSeconds);
      const replayTimeSeconds = number(source?.replayTimeSeconds);
      const focusOffsetSeconds = number(source?.mediaFocusOffsetSeconds);
      const durationSeconds = number(source?.clipDurationSeconds);
      if (
        !source ||
        !id ||
        (role !== "goal" && role !== "flag") ||
        source.reviewState !== "human-reviewed" ||
        provenance?.athleteVerified !== true ||
        provenance?.jockeyDetected !== false ||
        !sourceVideoTimestamp ||
        sourceVideoTimeSeconds === undefined ||
        replayTimeSeconds === undefined ||
        focusOffsetSeconds === undefined ||
        durationSeconds === undefined
      ) {
        return [];
      }
      return [
        [
          id,
          {
            role,
            videoLocalSeconds: sourceVideoTimeSeconds,
            workoutGlobalSeconds: replayTimeSeconds,
            media: {
              src: role === "goal" ? goalVideo : flagVideo,
              poster: role === "goal" ? goalPoster : flagPoster,
              focusOffsetSeconds,
              durationSeconds,
              sourceVideoTimestamp,
            },
          },
        ] as const,
      ];
    }),
  );
}

export function decodeAthleteMarks(
  artifact: unknown,
  manifest: unknown,
): AthleteMark[] {
  const root = record(artifact);
  const curated = record(root?.curated_results);
  if (!curated) return [];
  const mediaByEvent = decodedMedia(manifest);

  const goals = Array.isArray(curated.verbal_goals)
    ? curated.verbal_goals.flatMap((value): AthleteGoalMark[] => {
        const source = record(value);
        if (!source || !reviewedSource(source)) return [];
        const id = text(source.id);
        const statement = text(source.statement);
        const target = number(source.targetSplitSeconds);
        const note = text(source.note);
        const media = id ? mediaByEvent.get(id) : undefined;
        if (
          !id ||
          !statement ||
          target === undefined ||
          !note ||
          !media ||
          media.role !== "goal"
        ) {
          return [];
        }
        return [{
          id,
          kind: "goal",
          statement,
          target: {
            metric: "split",
            comparator: "strictly under",
            value: target,
            unit: "seconds / 500m",
          },
          note,
          confidence: "manual-verified",
          reviewState: "accepted",
          videoLocalSeconds: media.videoLocalSeconds,
          workoutGlobalSeconds: media.workoutGlobalSeconds,
          media: media.media,
          provenance: { athleteVerified: true, jockeyDetected: false },
        }];
      })
    : [];

  const flags = Array.isArray(curated.gesture_bookmarks)
    ? curated.gesture_bookmarks.flatMap((value): AthleteFlagMark[] => {
        const source = record(value);
        if (!source || !reviewedSource(source)) return [];
        const id = text(source.id);
        const note = text(source.note);
        const fingerCount = number(source.fingerCount);
        const media = id ? mediaByEvent.get(id) : undefined;
        if (
          !id ||
          !note ||
          fingerCount === undefined ||
          !Number.isInteger(fingerCount) ||
          !media ||
          media.role !== "flag"
        ) {
          return [];
        }
        return [{
          id,
          kind: "flag",
          fingerCount,
          meaning: "Athlete attention marker",
          note,
          confidence: "manual-verified",
          reviewState: "accepted",
          videoLocalSeconds: media.videoLocalSeconds,
          workoutGlobalSeconds: media.workoutGlobalSeconds,
          media: media.media,
          provenance: { athleteVerified: true, jockeyDetected: false },
        }];
      })
    : [];

  return [...goals, ...flags].sort(
    (a, b) => a.workoutGlobalSeconds - b.workoutGlobalSeconds,
  );
}

const athleteArtifact = Object.values(artifactModules)[0];
const mediaManifest = Object.values(manifestModules)[0];

export const athleteMarks = decodeAthleteMarks(athleteArtifact, mediaManifest);
