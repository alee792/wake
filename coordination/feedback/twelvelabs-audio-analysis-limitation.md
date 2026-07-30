# TwelveLabs Jockey — Audio Analysis Limitation

## Summary

Jockey's audio-analysis tool fails repeatedly on the 28-minute front-view
recording (`PXL_20260730_133531089.mp4`, 4.26 GB, item
`ksi_019fb4aa-4dce-7690-828f-c83868674a78`). The `jockey_search` modality
`audio` returns ranked hits (suggesting embeddings exist), but `jockey_query`
cannot transcribe or confirm speech content at those timestamps.

## Reproducible Steps

1. Knowledge store: `ks_019fb490-1e6c-7362-95c9-d61e14d6a835`
2. Run `jockey_search` with `modalities: ["audio"]` and query "athlete speaking
   about split time" — returns 10 ranked hits with `transcription: null`
3. Run `jockey_query` asking to transcribe speech at the top-hit timestamps —
   response says "audio-analysis tool failed on this file"

## Observed Behavior

- `jockey_search` audio modality returns hits with start/end but no transcription
- `jockey_query` reports "audio-analysis tool failed" and falls back to metadata
- The initial `jockey_query` attempt (broad window 20:10–20:55) timed out at 300s
- Narrower follow-up queries complete but state they cannot directly listen

## Expected Behavior

- If audio embeddings exist (search works), query should be able to transcribe or
  at least confirm/deny speech presence at specific timestamps
- If transcription is not supported for this file type/duration, the search
  modality should indicate that transcription is unavailable

## Impact on Our Use Case

We need to detect quiet athlete self-talk (goal statements) during a noisy
flywheel recording. The semantic search suggests audio content was indexed, but
we cannot access the actual transcription. This blocks our "athlete-authored
verbal goal" feature.

## Workaround

None available within Jockey. Would require external transcription (Whisper,
AssemblyAI) applied to extracted audio, then correlated with Jockey video
timestamps.

## Environment

- MCP server: jockey
- File: 4.26 GB MP4, 28:15 duration, front-facing camera with Concept2 flywheel
  noise
- Date: 2026-07-30
