import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const graphRoot = new URL("../", import.meta.url);
const source = JSON.parse(
  await readFile(
    new URL(
      "../artifacts/twelvelabs/runs/20260730-212016-autonomous-cross-angle/normalized-supplemental-context.json",
      graphRoot,
    ),
  ),
);
const seed = JSON.parse(await readFile(new URL("seed/ask-wake-context.json", graphRoot)));
const live = JSON.parse(
  await readFile(new URL("results/ask-wake-context-aura.json", graphRoot)),
);
const cached = JSON.parse(
  await readFile(new URL("cache/ask-wake-context.json", graphRoot)),
);
const frozenBundle = JSON.parse(
  await readFile(new URL("cache/explanation-bundle.json", graphRoot)),
);

assert.equal(seed.supplementalObservation.responseId, source.responseId);
assert.equal(seed.supplementalObservation.sessionId, source.sessionId);
assert.equal(
  seed.supplementalObservation.sourceItemId,
  source.selectionAudit.independentlySelectedKnowledgeStoreItemId,
);
assert.equal(seed.supplementalObservation.timestampBasis, "clip-local");
assert.equal(live.supplementalObservation.timestampBasis, "clip-local");
assert.ok(
  live.supplementalObservation.citedMoments.every(
    (moment) => moment.timestampBasis === "clip-local",
  ),
);
assert.equal(live.supplementalObservation.hypothesisOnly, true);
assert.equal(
  live.supplementalObservation.occurredInSelectedWorkoutWindows,
  "not-established",
);
assert.equal(live.supplementalObservation.causalClaim, "rejected");
assert.ok(
  live.supplementalObservation.limitations.some((item) =>
    item.includes("approximately 58 W difference"),
  ),
);
assert.deepEqual(
  live.references.map((reference) => reference.id).sort(),
  [
    "candidate-work-2-concept2",
    "candidate-work-3-concept2",
    "pegasus-interval-2-vs-3-visual-unresolved",
  ],
);
assert.equal(
  frozenBundle.recurrences[0].importance,
  "comparison",
);

const normalizedLive = structuredClone(live);
normalizedLive.source = "cached-neo4j";
assert.deepEqual(cached, normalizedLive);

console.log("Ask Wake supplemental context validation passed.");
