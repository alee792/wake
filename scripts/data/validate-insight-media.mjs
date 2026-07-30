import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const manifestPath = "artifacts/media/replay-media-manifest.json";
const collectionPath = "graph/cache/insight-collection.json";
const manifestText = await readFile(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const collection = JSON.parse(await readFile(collectionPath, "utf8"));

assert.equal(/https?:\/\/|\.m3u8/i.test(manifestText), false);
assert.deepEqual(
  manifest.insightMedia.map((entry) => entry.insightId).sort(),
  collection.insights.map((insight) => insight.insightId).sort(),
);

const mappings = new Map(
  manifest.mediaMappings.map((mapping) => [mapping.id, mapping]),
);
const athleteEvents = new Map(
  manifest.athleteEventMedia.map((event) => [event.eventId, event]),
);
const newMedia = manifest.insightMedia.flatMap((entry) =>
  entry.mediaItems.filter((item) => item.src),
);
assert.equal(newMedia.length, 4);

for (const entry of manifest.insightMedia) {
  assert.equal(entry.reviewState, "human-reviewed");
  assert.ok(
    entry.limitations.some(
      (limitation) =>
        limitation.includes("does not prove") ||
        limitation.includes("do not prove") ||
        limitation.includes("not proved") ||
        limitation.includes("not establish"),
    ),
  );
  for (const item of entry.mediaItems) {
    if (item.referenceType === "mediaMapping") {
      assert.ok(mappings.has(item.mediaId));
      assert.equal(item.reuse, true);
    }
    if (item.referenceType === "athleteEventMedia") {
      assert.ok(athleteEvents.has(item.eventId));
      assert.equal(item.reuse, true);
    }
  }
}

for (const item of newMedia) {
  assert.equal(item.reviewState, "human-reviewed");
  assert.equal(
    Number((item.sourceVideoStartSeconds + manifest.clockAlignment.offsetSeconds).toFixed(3)),
    item.replayStartSeconds,
  );
  assert.equal(
    Number((item.sourceVideoEndSeconds + manifest.clockAlignment.offsetSeconds).toFixed(3)),
    item.replayEndSeconds,
  );
  assert.ok(item.mediaStartSeconds < item.mediaEndSeconds);
  assert.ok(item.mediaFocusOffsetSeconds >= item.mediaStartSeconds);
  assert.ok(item.mediaFocusOffsetSeconds <= item.mediaEndSeconds);

  for (const [path, expectedSize, expectedHash] of [
    [item.src, item.fileSizeBytes, item.sha256],
    [item.poster, item.posterFileSizeBytes, item.posterSha256],
  ]) {
    const bytes = await readFile(path);
    assert.equal((await stat(path)).size, expectedSize);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expectedHash);
  }

  const probe = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=codec_type,codec_name,pix_fmt,width,height",
      "-of",
      "json",
      item.src,
    ],
    { encoding: "utf8" },
  );
  assert.equal(probe.status, 0, probe.stderr);
  const metadata = JSON.parse(probe.stdout);
  const video = metadata.streams.find((stream) => stream.codec_type === "video");
  const audio = metadata.streams.find((stream) => stream.codec_type === "audio");
  assert.equal(video.codec_name, "h264");
  assert.equal(video.pix_fmt, "yuv420p");
  assert.equal(video.width, item.width);
  assert.equal(video.height, item.height);
  assert.equal(audio.codec_name, "aac");
  assert.ok(Math.abs(Number(metadata.format.duration) - 30) <= 0.5);

  const decode = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-protocol_whitelist",
      "file,pipe",
      "-i",
      item.src,
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf8" },
  );
  assert.equal(decode.status, 0, decode.stderr);
}

const work3 = manifest.insightMedia.find(
  (entry) => entry.insightId === "insight-work3-late-surge",
);
assert.ok(
  work3.mediaItems.some(
    (item) =>
      item.referenceType === "mediaMapping" &&
      item.mediaId === "media-work3-comparison",
  ),
);
const work4 = manifest.insightMedia.find(
  (entry) => entry.insightId === "insight-work4-strongest-interval",
);
assert.ok(
  work4.limitations.some((limitation) =>
    limitation.includes("Concept2"),
  ),
);

console.log(
  `D-018 insight media validation passed: ${manifest.insightMedia.length} insights, ${newMedia.length} new clips.`,
);
