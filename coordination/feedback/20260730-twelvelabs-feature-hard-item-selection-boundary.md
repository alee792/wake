# TwelveLabs Jockey — Hard item-scoped response selection

- Sponsor and product/API: TwelveLabs, Jockey Responses API
- Type: feature request
- Title: Add an enforceable item-isolation mode for Responses selections
- Impact: A response that must use one athlete, customer, or experiment cannot
  rely on `selections` as an access boundary. Developers must isolate stores or
  post-validate every citation, and multi-turn sessions can accumulate earlier
  selections.

## Concrete use case

Wake's knowledge store contains a full-session front-view video and a separate
side-view clip. The focused comparison had to use only the full-session item so
timestamps and camera observations could not be contaminated by the other video.
The request used an item `ResponseSelection`, referenced `{{sel:0}}` in the prompt,
repeated the restriction in instructions, and post-validated every returned vref.

## Reproduction

1. Create a knowledge store containing at least two items.
2. Call `client.responses.create` with one
   `ResponseSelection(kind="item", id="ksi_...")`.
3. Reference that selection with `{{sel:0}}`.
4. Inspect the SDK `ResponseCreateRequest.selections` contract.

## Expected behavior

An optional mode such as `selection_mode: "hard"` enforces the selected item or
collection at retrieval time. Unselected items are inaccessible for that request,
and the response records the enforced scope. Multi-turn sessions should allow
replacement, not only accumulation, of the hard scope.

## Actual behavior

The SDK contract explicitly says the restriction is applied at the prompt level,
the knowledge store does not block access to other items, and it should be treated
as a strong preference rather than a hard access boundary. Selections also persist
and are added across later session turns. The captured Wake response happened to
cite only the requested item, but the API cannot guarantee that boundary.

## Evidence

- TwelveLabs Python SDK version: `1.3.1`
- SDK contract:
  `.venv/lib/python3.14/site-packages/twelvelabs/types/response_create_request.py`
- Wake request/result:
  `artifacts/twelvelabs/jockey-output-gap-response.json`
- Selection and citation validation:
  `coordination/status/data-jockey-intelligence.md`
- Selected item: `ksi_019fb4aa-4dce-7690-828f-c83868674a78`
- Response ID: `resp_019fb4bf-82b5-7d80-baa3-f5b9107f370a`

## Workaround

Use one knowledge store per isolation boundary, reinforce the selected item in
instructions and input, start a fresh session, and reject any returned citation
whose item ID is not on the caller's allowlist.

- Author role: Feedback audit subagent
- Status: captain-reviewed
