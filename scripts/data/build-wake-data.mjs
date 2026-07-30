#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const csvPath = resolve(
  root,
  "data/concept2/118993656/concept2-result-118993656.csv",
);
const normalizedPath = resolve(root, "artifacts/data/concept2-normalized.json");
const fixturePath = resolve(root, "artifacts/data/replay-fixture.stub.json");

const phaseDefinitions = [
  ["work-1", "Work 1", "work", 0, 240],
  ["recovery-1", "Recovery 1", "recovery", 240, 420],
  ["work-2", "Work 2", "work", 420, 660],
  ["recovery-2", "Recovery 2", "recovery", 660, 840],
  ["work-3", "Work 3", "work", 840, 1080],
  ["recovery-3", "Recovery 3", "recovery", 1080, 1260],
  ["work-4", "Work 4", "work", 1260, 1500],
  ["recovery-4", "Recovery 4", "recovery", 1500, 1680],
];

const candidateDefinitions = [
  ["candidate-work-2", 525, 545, 535, "Work 2 telemetry review candidate"],
  ["candidate-work-3", 1025, 1050, 1037, "Work 3 telemetry review candidate"],
];
const workDistancesMeters = [953, 932, 952, 962];

const round = (value, places = 1) => Number(value.toFixed(places));
const mean = (values) =>
  values.length ? values.reduce((total, value) => total + value, 0) / values.length : null;
const hash = (value) => createHash("sha256").update(value).digest("hex");

function parseCsv(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const rows = [];
  let blockIndex = 0;
  let priorLocalSeconds = -1;

  for (const line of lines.slice(1)) {
    const fields = line.split(",");
    const localSeconds = Number(fields[1]);
    if (localSeconds < priorLocalSeconds) blockIndex += 1;
    priorLocalSeconds = localSeconds;

    rows.push({
      sequence: Number(fields[0]),
      blockIndex,
      localSeconds,
      globalSeconds: round(localSeconds + blockIndex * 420),
      localDistanceMeters: Number(fields[2]),
      paceSecondsPer500m: Number(fields[3]),
      watts: Number(fields[4]),
      caloriesPerHour: Number(fields[5]),
      strokeRate: Number(fields[6]),
      heartRate: Number(fields[7]),
    });
  }
  // A few local samples extend fractionally past a canonical 7:00 boundary
  // (for example 420.7), while the next reset block begins at exactly 420.0
  // global seconds. Preserve every source row and sort only after applying the
  // mandated block offset so downstream consumers receive one monotonic clock.
  return rows.sort(
    (left, right) =>
      left.globalSeconds - right.globalSeconds || left.blockIndex - right.blockIndex,
  );
}

function samplesIn(rows, startSeconds, endSeconds) {
  return rows.filter(
    (row) => row.globalSeconds >= startSeconds && row.globalSeconds < endSeconds,
  );
}

function summary(rows, startSeconds, endSeconds) {
  const selected = samplesIn(rows, startSeconds, endSeconds);
  return {
    sampleCount: selected.length,
    averageWatts: round(mean(selected.map((row) => row.watts))),
    averageStrokeRate: round(mean(selected.map((row) => row.strokeRate))),
    averagePaceSecondsPer500m: round(
      mean(selected.map((row) => row.paceSecondsPer500m)),
    ),
    averageHeartRate: round(mean(selected.map((row) => row.heartRate))),
  };
}

function containingPhase(startSeconds, endSeconds) {
  const phase = phaseDefinitions.find(
    ([, , , phaseStart, phaseEnd]) =>
      startSeconds >= phaseStart && endSeconds <= phaseEnd,
  );
  if (!phase) throw new Error(`Window ${startSeconds}-${endSeconds} crosses phases`);
  return phase[0];
}

function validate(rows, fixture) {
  if (rows.length !== 761) throw new Error(`Expected 761 samples, received ${rows.length}`);
  if (new Set(rows.map((row) => row.blockIndex)).size !== 4) {
    throw new Error("Expected four reset blocks");
  }
  for (let index = 1; index < rows.length; index += 1) {
    if (rows[index].globalSeconds < rows[index - 1].globalSeconds) {
      throw new Error(`Telemetry is not globally sorted at sample ${index}`);
    }
  }
  if (fixture.phases[0].startSeconds !== 0) throw new Error("Phase coverage must start at 0");
  for (let index = 1; index < fixture.phases.length; index += 1) {
    if (fixture.phases[index - 1].endSeconds !== fixture.phases[index].startSeconds) {
      throw new Error("Phase coverage has a gap or overlap");
    }
  }
  if (fixture.phases.at(-1).endSeconds !== 1680) {
    throw new Error("Phase coverage must end at 1680");
  }
  for (const event of fixture.events) {
    if (!(event.startSeconds >= 0 && event.startSeconds < event.endSeconds && event.endSeconds <= 1680)) {
      throw new Error(`Invalid event bounds: ${event.id}`);
    }
    containingPhase(event.startSeconds, event.endSeconds);
  }
}

const csv = await readFile(csvPath, "utf8");
const rows = parseCsv(csv);
const phases = phaseDefinitions.map(([id, name, type, startSeconds, endSeconds]) => ({
  id,
  name,
  type,
  startSeconds,
  endSeconds,
}));
const workIntervals = phases
  .filter((phase) => phase.type === "work")
  .map((phase, index) => ({
    id: phase.id,
    name: phase.name,
    startSeconds: phase.startSeconds,
    endSeconds: phase.endSeconds,
    workSeconds: phase.endSeconds - phase.startSeconds,
    distanceMeters: workDistancesMeters[index],
    averagePaceSecondsPer500m: summary(rows, phase.startSeconds, phase.endSeconds)
      .averagePaceSecondsPer500m,
    averageWatts: summary(rows, phase.startSeconds, phase.endSeconds).averageWatts,
    averageStrokeRate: summary(rows, phase.startSeconds, phase.endSeconds)
      .averageStrokeRate,
    insight: "Pending reviewed video evidence.",
  }));

const events = candidateDefinitions.map(
  ([id, startSeconds, endSeconds, focusSeconds, title]) => ({
    id,
    title,
    startSeconds,
    endSeconds,
    focusSeconds,
    intervalId: containingPhase(startSeconds, endSeconds),
    importance: "candidate",
    reviewState: "telemetry-only",
    selectionMode: "manual-candidate",
    providerObservationIds: [`${id}-concept2`],
  }),
);

const observations = candidateDefinitions.map(
  ([id, startSeconds, endSeconds]) => {
    const measured = summary(rows, startSeconds, endSeconds);
    return {
      id: `${id}-concept2`,
      provider: "concept2",
      startSeconds,
      endSeconds,
      kind: "measurement",
      statement:
        `Concept2 samples in this candidate window average ${measured.averageWatts} W ` +
        `and ${measured.averageStrokeRate} spm (${measured.sampleCount} samples).`,
      confidence: 1,
      citations: [csvPath.replace(`${root}/`, "")],
      limitations: [
        "Telemetry alone does not establish a visible technique change or its cause.",
        "Candidate has not yet been verified against local video.",
      ],
      generationMode: "derived",
      measurements: measured,
    };
  },
);

const normalized = {
  schemaVersion: "1.0",
  workoutId: "concept2-118993656",
  sessionDate: "2026-07-30",
  durationSeconds: 1680,
  timeConvention: {
    basis: "elapsed-seconds-from-workout-start",
    intervalBounds: "inclusive-start-exclusive-end",
    normalization: "globalSeconds = localSeconds + blockIndex * 420",
  },
  source: {
    path: csvPath.replace(`${root}/`, ""),
    sha256: hash(csv),
    recordCount: rows.length,
    resetBlockCount: 4,
  },
  phases,
  workIntervals,
  candidateWindows: candidateDefinitions.map(
    ([id, startSeconds, endSeconds, focusSeconds]) => ({
      id,
      startSeconds,
      endSeconds,
      focusSeconds,
      intervalId: containingPhase(startSeconds, endSeconds),
      summary: summary(rows, startSeconds, endSeconds),
    }),
  ),
  telemetry: rows,
};

const fixture = {
  schemaVersion: "1.0",
  session: {
    id: "concept2-118993656",
    title: "4 × 4:00 / 3:00 Recovery",
    date: "2026-07-30",
    durationSeconds: 1680,
    status: "Reviewed Replay",
    distanceMeters: 5941,
  },
  phases,
  intervals: workIntervals,
  telemetry: rows.map((row) => ({
    timeSeconds: row.globalSeconds,
    watts: row.watts,
    strokeRate: row.strokeRate,
    paceSecondsPer500m: row.paceSecondsPer500m,
  })),
  // Candidate windows remain in the normalized artifact until video review.
  // Emitting no Replay events avoids implying an unsupported insight.
  events: [],
  explanations: {},
  recommendations: [],
  mediaMappings: [],
  initialState: {
    currentTimeSeconds: 0,
    selectedEventId: "",
    evidenceExpanded: false,
    provenanceExpanded: false,
    videoExpanded: false,
  },
  buildManifest: {
    schemaVersion: "1.0",
    generatedAt: new Date().toISOString(),
    recordingMode: "offline",
    steps: [
      {
        id: "normalize-concept2-csv",
        role: "source-normalization",
        provider: "concept2",
        modelOrService: "csv-export",
        executionMode: "derived",
        inputPaths: [csvPath.replace(`${root}/`, "")],
        outputPaths: [
          normalizedPath.replace(`${root}/`, ""),
          fixturePath.replace(`${root}/`, ""),
        ],
        timestamp: new Date().toISOString(),
        contentHash: hash(csv),
        humanReviewed: false,
      },
      {
        id: "identify-telemetry-review-candidates",
        role: "candidate-selection",
        provider: "manual",
        modelOrService: "Wake source review",
        executionMode: "manual",
        inputPaths: [],
        outputPaths: [normalizedPath.replace(`${root}/`, "")],
        timestamp: new Date().toISOString(),
        humanReviewed: false,
      },
    ],
  },
};

validate(rows, fixture);
await mkdir(dirname(normalizedPath), { recursive: true });
await writeFile(normalizedPath, `${JSON.stringify(normalized, null, 2)}\n`);
await writeFile(fixturePath, `${JSON.stringify(fixture, null, 2)}\n`);
console.log(JSON.stringify({
  normalizedPath,
  fixturePath,
  sampleCount: rows.length,
  blockCount: 4,
  candidateWindows: normalized.candidateWindows,
}, null, 2));
