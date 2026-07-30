import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const live = JSON.parse(await readFile(new URL("results/explanation-aura.json", root)));
const cached = JSON.parse(await readFile(new URL("cache/explanation-bundle.json", root)));
const seed = JSON.parse(await readFile(new URL("seed/golden-session.json", root)));
const canonical = JSON.parse(
  await readFile(
    new URL("../artifacts/twelvelabs/pegasus-normalized-evidence.json", root),
  ),
);

assert.equal(seed.segments.length, 8);
assert.equal(seed.events.length, 2);
assert.equal(seed.observations.length, 7);
const seededPegasus = seed.observations.filter(
  (observation) => observation.providerId === "twelvelabs-pegasus",
);
assert.deepEqual(
  seededPegasus.map((observation) => observation.observationId).sort(),
  canonical.observations.map((observation) => observation.id).sort(),
);
assert.equal(
  seed.observations.some(
    (observation) => observation.providerId === "twelvelabs-jockey",
  ),
  false,
);
assert.ok(
  seededPegasus.every((observation) =>
      observation.properties.citations.includes(
        "artifacts/twelvelabs/video-concept2-alignment.json",
      ),
  ),
);
assert.equal(live.insight.insightId, "insight-rate-without-power");
assert.equal(live.event.eventId, "candidate-work-2");
assert.equal(live.recurrences.length, 1);
assert.equal(live.recurrences[0].eventId, "candidate-work-3");
assert.ok(live.supportingEvidence.length > 0);
assert.ok(live.contradictingEvidence.length > 0);
assert.equal(live.contradictingEvidence.length, 3);
assert.deepEqual(
  live.contradictingEvidence.map((observation) => observation.id).sort(),
  [
    "candidate-work-3-concept2",
    "pegasus-interval-2-vs-3-visual-unresolved",
    "pegasus-interval-2-vs-4-visual-unresolved",
  ],
);
assert.ok(
  live.contradictingEvidence
    .filter((observation) => observation.provider === "twelvelabs-pegasus")
    .every(
    (observation) =>
      observation.generationMode === "api" &&
      observation.citations.includes(
        "artifacts/twelvelabs/video-concept2-alignment.json",
      ),
    ),
);
assert.ok(
  live.contradictingEvidence
    .filter((observation) => observation.provider === "twelvelabs-pegasus")
    .every((observation) =>
      observation.statement.startsWith("Visual evidence unresolved:"),
    ),
);
assert.ok(
  live.contradictingEvidence.some(
    (observation) =>
      observation.id === "candidate-work-3-concept2" &&
      observation.provider === "concept2" &&
      observation.statement.includes("215.3 W") &&
      observation.limitations.includes(
        "This is a comparison rather than a recurrence; calibrated frontal video did not resolve a visible cause.",
      ),
  ),
);
assert.equal(live.insight.reviewState, "calibrated-video-reviewed-unresolved");
assert.ok(!live.insight.explanation.includes("pending video review"));
assert.equal(live.drill.drillId, "drill-hold-pressure-before-rate");

const normalizedLive = structuredClone(live);
normalizedLive.source = "cached-neo4j";
assert.deepEqual(cached, normalizedLive);

console.log("Neo4j ExplanationBundle validation passed.");
