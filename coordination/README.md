# Wake Agent Coordination Hub

This directory is the durable communication layer for the four-hour build.

## Chain of Command

- Integration Captain makes final scope, contract, ownership, and cut-line
  decisions.
- Data and Jockey Intelligence Lieutenant owns source truth, fixtures, media
  mappings, Pegasus full-video analysis artifacts, highlight selection, and
  Jockey API integration.
- Neo4j Graph Lieutenant owns the evidence graph, explanation query, and cache.
- Strands and OpenAI Lieutenant owns OpenAI Responses through Bedrock Mantle,
  Strands orchestration, coaching generation, validation, and the build manifest.
- Replay UI Lieutenant owns the recorded product surface and interactions.

Each primary agent may spawn subagents within its scope. The primary agent reviews
and reports all delegated work.

## Files

- `BOARD.md`: current plan, deadlines, file ownership, gates, and overall state.
  Integration Captain only.
- `DECISIONS.md`: authoritative decisions and contract changes. Integration Captain
  only.
- `status/integration-captain.md`: captain's detailed status and outbox.
- `status/data-jockey-intelligence.md`: Data and Jockey Intelligence Lieutenant's
  status and outbox.
- `status/neo4j-graph.md`: Neo4j Graph Lieutenant's status and outbox.
- `status/strands-openai.md`: Strands and OpenAI Lieutenant's status and outbox.
- `status/replay-ui.md`: Replay UI Lieutenant's status and outbox.

## Communication Rules

1. Read the board, decisions, and all role status files when starting.
2. Edit only your owned status file unless you are the Integration Captain.
3. Update status at milestones, handoffs, and any blocker lasting over five minutes.
4. Put directed messages in your own "Messages to team" section.
5. Check all other status files at least every ten minutes.
6. Use direct agent messaging tools for speed when available, but duplicate durable
   facts in the files.
7. Do not change a frozen shared contract until the captain records approval in
   `DECISIONS.md`.
8. Do not place credentials, tokens, passwords, or secret values anywhere in this
   directory.

## Conflict Rule

When two agents need the same file:

1. stop editing it;
2. report the conflict in both relevant status files;
3. ask the captain to assign a single temporary owner;
4. resume only after the decision is recorded.

## Blocker Rule

No agent waits silently. After five minutes:

- describe the blocker;
- state what was attempted;
- propose the safest fallback;
- continue useful work that does not depend on the blocker;
- notify the captain.

## Time Rule

The recording begins at T+3:15. Optional integrations and visual polish cannot
move that deadline.
