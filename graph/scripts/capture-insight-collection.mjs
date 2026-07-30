import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repoRoot = new URL("../../", import.meta.url);
const queryPath = new URL(
  "graph/cypher/insight-collection.cypher",
  repoRoot,
);
const resultPath = new URL(
  "graph/results/insight-collection-aura.json",
  repoRoot,
);
const cachePath = new URL("graph/cache/insight-collection.json", repoRoot);
const collectionId = "insight-collection-concept2-118993656-v1";

const query = await readFile(queryPath, "utf8");
const { stdout } = await execFileAsync(
  "neo4j-cli",
  [
    "query",
    "--format",
    "json",
    "--param",
    `collectionId=${collectionId}`,
    query,
  ],
  {
    cwd: new URL(".", repoRoot),
    maxBuffer: 4 * 1024 * 1024,
  },
);
const envelope = JSON.parse(stdout);
const live = envelope.rows?.[0]?.insightCollection;

if (!live || live.collectionId !== collectionId) {
  throw new Error("Aura did not return the requested InsightCollection.");
}

const cached = structuredClone(live);
cached.source = "cached-neo4j";

await writeFile(resultPath, `${JSON.stringify(live, null, 2)}\n`);
await writeFile(cachePath, `${JSON.stringify(cached, null, 2)}\n`);

console.log(`Captured ${live.insights.length} Aura insights and cached fallback.`);
