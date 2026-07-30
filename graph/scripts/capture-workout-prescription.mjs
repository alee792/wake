import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repoRoot = new URL("../../", import.meta.url);
const prescriptionId = "workout-build-pressure-then-rate-v1";
const query = await readFile(
  new URL("graph/cypher/workout-prescription.cypher", repoRoot),
  "utf8",
);
const { stdout } = await execFileAsync(
  "neo4j-cli",
  [
    "query",
    "--format",
    "json",
    "--param",
    `prescriptionId=${prescriptionId}`,
    query,
  ],
  {
    cwd: new URL(".", repoRoot),
    maxBuffer: 2 * 1024 * 1024,
  },
);
const envelope = JSON.parse(stdout);
const live = envelope.rows?.[0]?.workoutPrescription;

if (!live || live.prescriptionId !== prescriptionId) {
  throw new Error("Aura did not return the canonical WorkoutPrescription.");
}

const cached = structuredClone(live);
cached.source = "cached-neo4j";

await writeFile(
  new URL("graph/results/workout-prescription-aura.json", repoRoot),
  `${JSON.stringify(live, null, 2)}\n`,
);
await writeFile(
  new URL("graph/cache/workout-prescription.json", repoRoot),
  `${JSON.stringify(cached, null, 2)}\n`,
);

console.log("Captured live Aura WorkoutPrescription and cached fallback.");
