#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const artifactPath = resolve(
  root,
  process.argv[2] ?? "artifacts/twelvelabs/pegasus-normalized-evidence.json",
);
const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
const required = [
  "id",
  "provider",
  "startSeconds",
  "endSeconds",
  "kind",
  "statement",
  "citations",
  "limitations",
  "generationMode",
  "rawResponsePath",
];
const allowedKinds = new Set(["measurement", "visual", "technique", "context"]);
const ids = new Set();
const errors = [];

for (const observation of artifact.observations ?? []) {
  for (const field of required) {
    if (!(field in observation)) errors.push(`${observation.id ?? "unknown"} missing ${field}`);
  }
  if (ids.has(observation.id)) errors.push(`Duplicate observation ID: ${observation.id}`);
  ids.add(observation.id);
  if (observation.provider !== "twelvelabs-pegasus") {
    errors.push(`${observation.id} has incorrect provider`);
  }
  if (!allowedKinds.has(observation.kind)) errors.push(`${observation.id} has invalid kind`);
  if (!(0 <= observation.startSeconds && observation.startSeconds < observation.endSeconds)) {
    errors.push(`${observation.id} has invalid bounds`);
  }
  if (observation.endSeconds > 1680) errors.push(`${observation.id} exceeds workout duration`);
  if (observation.generationMode !== "api") {
    errors.push(`${observation.id} must use generationMode api`);
  }
  if (!Array.isArray(observation.citations) || observation.citations.length === 0) {
    errors.push(`${observation.id} has no citations`);
  }
  if (!Array.isArray(observation.limitations) || observation.limitations.length === 0) {
    errors.push(`${observation.id} has no limitations`);
  }
  await access(resolve(root, observation.rawResponsePath)).catch(() => {
    errors.push(`${observation.id} raw response does not exist`);
  });
}

const serialized = artifact.observations
  .map((observation) => observation.statement)
  .join(" ")
  .toLowerCase();
for (const forbidden of ["identical mechanics", "core engagement lagged", "to maintain performance"]) {
  if (serialized.includes(forbidden)) errors.push(`Forbidden accepted claim present: ${forbidden}`);
}

for (const id of [
  "pegasus-interval-2-vs-4-visual-unresolved",
  "pegasus-interval-2-vs-3-visual-unresolved",
]) {
  const observation = artifact.observations.find((item) => item.id === id);
  if (!observation?.statement.toLowerCase().includes("visual evidence unresolved")) {
    errors.push(`${id} must preserve visual evidence unresolved`);
  }
}

const hydration = Object.fromEntries(
  artifact.observations
    .filter((item) => item.id.startsWith("pegasus-hydration"))
    .map((item) => [item.id, item.startSeconds]),
);
if (hydration["pegasus-hydration-recovery-2"] !== 699.089) {
  errors.push("Recovery 2 hydration must start at workout-global second 699.089");
}
if (hydration["pegasus-hydration-recovery-4"] !== 1548.089) {
  errors.push("Recovery 4 hydration must start at workout-global second 1548.089");
}

console.log(
  JSON.stringify(
    {
      valid: errors.length === 0,
      observationCount: artifact.observations?.length ?? 0,
      observationIds: [...ids],
      errors,
    },
    null,
    2,
  ),
);
if (errors.length) process.exitCode = 1;
