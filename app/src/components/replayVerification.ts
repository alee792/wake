export type ReplaySystemStory = {
  system: string;
  title: string;
  body: string;
};

/**
 * Reviewed native-Bedrock run from PR #1.
 *
 * This deliberately does not adapt the stale main-branch build manifest, whose
 * failed Mantle attempt predates the accepted native Converse run.
 */
export const verifiedReplayBuild = {
  stories: [
    {
      system: "TwelveLabs",
      title: "See what the metrics can’t",
      body:
        "Wake sends telemetry-selected moments to TwelveLabs on a clock aligned with the workout. Its reviewed observations return with exact timestamps and camera limitations, become connected evidence in Neo4j, and open as the right clip when the athlete explores the Replay.",
    },
    {
      system: "Neo4j",
      title: "Keep the whole explanation connected",
      body:
        "Neo4j links each coaching claim to the performance window, video observation, relevant comparison, counterevidence, and known limitations behind it. That connected context shapes the coaching and lets every citation move the Replay to the moment it describes.",
    },
    {
      system: "OpenAI",
      title: "Turn connected evidence into coaching",
      body:
        "OpenAI synthesizes the performance comparisons, reviewed video findings, and limitations connected by Neo4j into a concise coaching response. Every claim must cite the supplied evidence and pass Wake’s schema, citation, and numeric checks before it reaches the Replay.",
    },
    {
      system: "AWS Strands",
      title: "Carry the evidence through safely",
      body:
        "Strands retrieves the bounded evidence bundle from Neo4j, gives it to the OpenAI model through Amazon Bedrock, and validates the result before Wake packages it. The workflow keeps the coaching connected to its sources from graph query to athlete-facing answer.",
    },
  ] satisfies ReplaySystemStory[],
  model: "openai.gpt-oss-120b-1:0",
  orchestration: "AWS Strands BedrockModel",
  route: "Amazon Bedrock native bedrock-runtime:Converse",
  region: "us-east-1",
  runResult: "Completed · end_turn · 24.6 seconds",
  schemaValidation: "Passed",
  citationValidation: "Passed",
  numericAudit: "Passed · 23 matched tokens",
  evidenceIds: [
    "candidate-work-2-concept2",
    "candidate-work-3-concept2",
    "pegasus-interval-2-vs-3-visual-unresolved",
    "pegasus-interval-2-vs-4-visual-unresolved",
  ],
  recordingMode:
    "Reviewed build-time run · packaged for offline playback",
  limitation:
    "Video findings remain unresolved wherever the available camera angle could not support a mechanical conclusion.",
} as const;
