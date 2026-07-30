export type ValidatedAskWakeAnswer = {
  answer: string;
  limitation: string;
  citedObservationIds: string[];
  executionMode: "real-api" | "cached-real-api";
  providerResponseId?: string;
};

type UnknownRecord = Record<string, unknown>;

const artifactModules = import.meta.glob(
  "../../../artifacts/strands-openai/ask-wake*.json",
  { eager: true, import: "default" },
) as Record<string, unknown>;

function record(value: unknown): UnknownRecord | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : undefined;
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function stringList(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : undefined;
}

function executionMode(
  source: UnknownRecord,
): "real-api" | "cached-real-api" | undefined {
  const value = text(source.executionMode ?? source.execution_mode);
  return value === "real-api" || value === "cached-real-api" ? value : undefined;
}

function isPassed(value: unknown) {
  return value === "passed" || value === true;
}

function findOutput(path: string | undefined): UnknownRecord | undefined {
  if (!path) return undefined;
  const normalized = path.replace(/^\.?\//, "");
  const entry = Object.entries(artifactModules).find(([key]) =>
    key.endsWith(normalized.replace(/^artifacts\/strands-openai\//, "")),
  );
  return record(entry?.[1]);
}

function decodeAnswer(
  source: UnknownRecord,
  provenance: UnknownRecord,
): ValidatedAskWakeAnswer | undefined {
  const output = record(source.output) ?? record(source.response) ?? source;
  const answer =
    text(output.answer) ??
    text(output.explanation) ??
    text(output.responseText ?? output.response_text);
  const limitation = text(output.limitation);
  const citedObservationIds = stringList(
    output.citedObservationIds ?? output.cited_observation_ids,
  );
  const mode = executionMode(provenance) ?? executionMode(output);
  const provider = text(provenance.provider ?? output.provider)?.toLowerCase();
  const service = text(
    provenance.service ?? provenance.modelOrService ?? output.service,
  )?.toLowerCase();
  const validationPassed =
    isPassed(provenance.citationValidation) ||
    isPassed(provenance.validationStatus) ||
    isPassed(record(provenance.validation)?.status) ||
    isPassed(output.citationValidation);
  const reviewed =
    provenance.reviewed === true ||
    provenance.humanReviewed === true ||
    output.reviewed === true ||
    output.humanReviewed === true;

  if (
    !answer ||
    !limitation ||
    !citedObservationIds ||
    citedObservationIds.length === 0 ||
    !mode ||
    provider !== "openai" ||
    !service?.includes("bedrock") ||
    !validationPassed ||
    !reviewed
  ) {
    return undefined;
  }
  return {
    answer,
    limitation,
    citedObservationIds,
    executionMode: mode,
    providerResponseId: text(
      provenance.providerResponseId ?? provenance.provider_response_id,
    ),
  };
}

function loadValidatedAnswer(): ValidatedAskWakeAnswer | undefined {
  for (const [path, artifact] of Object.entries(artifactModules)) {
    if (!path.toLowerCase().includes("ask-wake")) continue;
    const provenance = record(artifact);
    if (!provenance) continue;
    const linked = findOutput(
      text(provenance.outputPath ?? provenance.output_path),
    );
    const answer = decodeAnswer(linked ?? provenance, provenance);
    if (answer) return answer;
  }
  return undefined;
}

export const validatedAskWakeAnswer = loadValidatedAnswer();
