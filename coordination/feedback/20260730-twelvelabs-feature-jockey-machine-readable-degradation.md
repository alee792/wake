# TwelveLabs Jockey — Machine-readable vision-tool degradation

- Sponsor and product/API: TwelveLabs, Jockey Responses API and Jockey MCP
- Type: feature request
- Title: Expose direct video-analysis degradation in otherwise completed responses
- Impact: Automation sees a successful response status even when Jockey could not
  inspect the requested frames. The only failure signal is natural-language text,
  so applications cannot reliably distinguish a camera limitation from an internal
  tool failure or select an automatic fallback.

## Reproduction

1. Use TwelveLabs Python SDK `1.3.1`.
2. Query ready knowledge-store item
   `ksi_019fb4aa-4dce-7690-828f-c83868674a78` in store
   `ks_019fb490-1e6c-7362-95c9-d61e14d6a835`.
3. Request a focused comparison of `08:45–09:05` and `17:05–17:30`, including
   frame-sensitive recovery and stroke-sequencing observations.
4. Observe response `resp_019fb4bf-82b5-7d80-baa3-f5b9107f370a` returns
   `status: completed`, while its output says frame-level inspection could not be
   obtained.
5. Repeat through Jockey MCP with the output-gap and interval-start questions.
   Sessions `sess_019fb4bf-23eb-7191-a24a-cb1bb0867ab2` and
   `sess_019fb4bf-21ae-7650-bfa3-941b4d8fc150` report that direct video analysis
   failed on the tool side; the latter reports repeated failures.

## Requested behavior

If an internal vision tool fails, the response should expose a machine-readable
degraded or failed step with an error code, affected item/window, retryability,
and request or trace ID. A final answer may still be returned, but its top-level
status should make the degradation programmatically visible.

## Actual behavior

The Responses API result is marked completed. The direct-analysis failure appears
only in prose, alongside genuine camera-angle limitations and a metadata-derived
fallback answer. No structured tool error or retry signal is present in the
captured response.

## Evidence

- `artifacts/twelvelabs/jockey-output-gap-response.json`
- `artifacts/twelvelabs/jockey-raw-response.json`
- `artifacts/twelvelabs/jockey-observation.json`
- `coordination/status/data-jockey-intelligence.md`
- Response ID: `resp_019fb4bf-82b5-7d80-baa3-f5b9107f370a`
- Session IDs: `sess_019fb4bf-82ab-73c1-a8a3-c34169e4e53a`,
  `sess_019fb4bf-23eb-7191-a24a-cb1bb0867ab2`, and
  `sess_019fb4bf-21ae-7650-bfa3-941b4d8fc150`
- TwelveLabs Python SDK version: `1.3.1`

## Workaround

Search the answer text for degradation language, classify the result as unresolved,
preserve the limitations, and use Pegasus or human review instead of treating the
completed status as proof that frame-level analysis ran.

- Author role: Feedback audit subagent
- Status: captain-reviewed
