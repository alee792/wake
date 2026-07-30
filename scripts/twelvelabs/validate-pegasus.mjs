#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const inputPath = resolve(
  root,
  process.argv[2] ?? "artifacts/twelvelabs/pegasus-pasted-output.json",
);
const reportPath = resolve(
  root,
  process.argv[3] ?? "artifacts/twelvelabs/pegasus-validation.json",
);
const expectedWindows = [
  "00:00-06:00",
  "06:00-14:00",
  "14:00-18:00",
  "18:00-22:00",
  "22:00-28:00",
];
const requiredMomentFields = [
  "start_time",
  "end_time",
  "direct_observation",
  "change_from_previous_strokes",
  "possible_interpretation",
  "repeated_at",
  "confidence",
  "limitations",
];

function seconds(timestamp) {
  if (!/^\d{2}:\d{2}$/.test(timestamp)) {
    throw new Error(`Invalid MM:SS timestamp: ${timestamp}`);
  }
  const [minutes, remainingSeconds] = timestamp.split(":").map(Number);
  if (remainingSeconds >= 60) throw new Error(`Invalid MM:SS timestamp: ${timestamp}`);
  return minutes * 60 + remainingSeconds;
}

function validate(envelope) {
  const errors = [];
  const result = envelope?.result ?? envelope;
  if (envelope?.result) {
    const expected = {
      provider: "twelvelabs-pegasus",
      generationMode: "real-api",
      ingestionMode: "manual-paste",
      model: "pegasus1.5",
      analysisMode: "general",
      finishReason: "stop",
    };
    for (const [field, value] of Object.entries(expected)) {
      if (envelope[field] !== value) errors.push(`${field} must equal ${value}`);
    }
    for (const field of ["assetId", "taskId", "generationId"]) {
      if (!envelope[field]) errors.push(`Missing provider identifier: ${field}`);
    }
  } else {
    errors.push("Expected the complete provider envelope, not only its result");
  }

  if (!result || typeof result !== "object") return ["Missing result object"];
  const coverage = Array.isArray(result.coverage) ? result.coverage : [];
  const windows = coverage.map((entry) => entry.window);
  if (
    coverage.length !== 5 ||
    [...windows].sort().join("|") !== [...expectedWindows].sort().join("|")
  ) {
    errors.push(`Coverage must contain each requested window exactly once: ${windows}`);
  }
  for (const entry of coverage) {
    if (!entry.direct_observation) errors.push(`Coverage ${entry.window} lacks direct_observation`);
    if (typeof entry.limitations !== "string") errors.push(`Coverage ${entry.window} lacks limitations`);
  }

  try {
    if (seconds(result.final_observed_timestamp) < 1620) {
      errors.push("final_observed_timestamp must be at least 27:00");
    }
  } catch (error) {
    errors.push(error.message);
  }

  const moments = Array.isArray(result.moments) ? result.moments : [];
  if (moments.length > 10) errors.push("moments must contain no more than 10 items");
  moments.forEach((moment, index) => {
    for (const field of requiredMomentFields) {
      if (!(field in moment)) errors.push(`Moment ${index} is missing ${field}`);
    }
    if (!["high", "medium", "low"].includes(moment.confidence)) {
      errors.push(`Moment ${index} has invalid confidence`);
    }
    if (!Array.isArray(moment.repeated_at)) {
      errors.push(`Moment ${index} repeated_at must be an array`);
    }
    try {
      const start = seconds(moment.start_time);
      const end = seconds(moment.end_time);
      if (!(start >= 0 && start < end && end <= 1680)) {
        errors.push(`Moment ${index} bounds fall outside 0:00-28:00`);
      }
      for (const repeatedAt of moment.repeated_at ?? []) {
        const repeated = seconds(repeatedAt);
        if (!(repeated >= 0 && repeated <= 1680)) {
          errors.push(`Moment ${index} repeated_at is out of range: ${repeatedAt}`);
        }
      }
    } catch (error) {
      errors.push(`Moment ${index}: ${error.message}`);
    }
  });
  return errors;
}

const raw = await readFile(inputPath, "utf8");
const envelope = JSON.parse(raw);
const errors = validate(envelope);
const report = {
  schemaVersion: "1.0",
  sourcePath: inputPath.replace(`${root}/`, ""),
  rawPreservedUnchanged: true,
  valid: errors.length === 0,
  errors,
  coverageWindows: envelope?.result?.coverage?.map((entry) => entry.window) ?? [],
  finalObservedTimestamp: envelope?.result?.final_observed_timestamp ?? null,
  momentCount: envelope?.result?.moments?.length ?? 0,
  providerIdentifiers: {
    assetId: envelope?.assetId ?? null,
    taskId: envelope?.taskId ?? null,
    generationId: envelope?.generationId ?? null,
  },
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!report.valid) process.exitCode = 1;
