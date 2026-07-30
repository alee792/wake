import { useId, useState } from "react";
import { auraInsights } from "./insightCollection";
import type { WorkoutPrescription } from "./workoutPrescription";
import "./next-workout.css";

export type NextWorkoutFallback = {
  drill: string;
  instruction?: string;
  successCriterion: string;
};

export type NextWorkoutProps = {
  prescription?: WorkoutPrescription;
  fallback: NextWorkoutFallback;
  onSelectInsight?: (insightId: string) => void;
};

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function NextWorkout({
  prescription,
  fallback,
  onSelectInsight,
}: NextWorkoutProps) {
  const detailId = useId();
  const [expanded, setExpanded] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  if (!prescription) {
    return (
      <aside className="next-session" aria-labelledby="next-session-title">
        <span>Next session</span>
        <h2 id="next-session-title">{fallback.drill}</h2>
        {fallback.instruction && <p>{fallback.instruction}</p>}
        <div className="next-session__criterion">
          <span>Success criterion</span>
          <strong>{fallback.successCriterion}</strong>
        </div>
      </aside>
    );
  }

  const citedInsights = prescription.insightIds.flatMap((id) => {
    const insight = auraInsights.find((candidate) => candidate.id === id);
    return insight ? [insight] : [];
  });
  const recipe = prescription.recipeInstructions.join("\n");

  async function copyRecipe() {
    try {
      await navigator.clipboard.writeText(recipe);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <aside className="next-workout" aria-labelledby="next-workout-title">
      <div className="next-workout__heading">
        <div>
          <span>Next workout</span>
          <h2 id="next-workout-title">{prescription.title}</h2>
        </div>
        <span className="next-workout__reviewed">Reviewed</span>
      </div>
      <p className="next-workout__summary">
        {prescription.mainSet.display} · {prescription.equipment}
      </p>
      <button
        type="button"
        className="next-workout__toggle"
        aria-expanded={expanded}
        aria-controls={detailId}
        onClick={() => setExpanded((value) => !value)}
      >
        <span>{expanded ? "Hide workout" : "View workout"}</span>
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>

      <div id={detailId} className="next-workout__detail" hidden={!expanded}>
        <section className="next-workout__bookends" aria-label="Warm-up and cool-down">
          <div>
            <span>Warm-up · {prescription.warmUp.duration}</span>
            <p>{prescription.warmUp.instructions}</p>
          </div>
          <div>
            <span>Cool-down · {prescription.coolDown.duration}</span>
            <p>{prescription.coolDown.instructions}</p>
          </div>
        </section>

        <section aria-labelledby={`${detailId}-targets`}>
          <h3 id={`${detailId}-targets`}>Ordered work targets</h3>
          <ol className="next-workout__targets">
            {prescription.mainSet.intervals.map((interval, index) => (
              <li key={`${interval.position}-${interval.name}`}>
                <span>{interval.position.toString().padStart(2, "0")}</span>
                <div>
                  <strong>
                    {interval.name} · {formatDuration(interval.durationSeconds)}
                  </strong>
                  <small>
                    {interval.pace} · {interval.strokeRateSpm} spm
                  </small>
                </div>
                {index < prescription.mainSet.intervals.length - 1 && (
                  <p>
                    {formatDuration(prescription.mainSet.recoverySeconds)}{" "}
                    {prescription.mainSet.recoveryIntensity} recovery
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby={`${detailId}-success`}>
          <h3 id={`${detailId}-success`}>Measurable success</h3>
          <ul className="next-workout__criteria">
            {prescription.successCriteria.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby={`${detailId}-rationale`}>
          <div className="next-workout__section-heading">
            <h3 id={`${detailId}-rationale`}>Why this workout</h3>
            <small>Five reviewed Replay insights</small>
          </div>
          <div className="next-workout__insights">
            {citedInsights.map((insight, index) =>
              onSelectInsight ? (
                <button
                  key={insight.id}
                  type="button"
                  onClick={() => onSelectInsight(insight.id)}
                  aria-label={`Open supporting insight ${index + 1}: ${insight.summary}`}
                >
                  <span>{index + 1}</span>
                  {insight.summary}
                </button>
              ) : (
                <div key={insight.id}>
                  <span>{index + 1}</span>
                  {insight.summary}
                </div>
              ),
            )}
          </div>
        </section>

        <section className="next-workout__recipe" aria-labelledby={`${detailId}-recipe`}>
          <div className="next-workout__section-heading">
            <div>
              <h3 id={`${detailId}-recipe`}>ErgData recipe</h3>
              <small>{prescription.recipePath}</small>
            </div>
            <button type="button" onClick={copyRecipe}>
              {copyState === "copied"
                ? "Copied"
                : copyState === "failed"
                  ? "Select recipe to copy"
                  : "Copy recipe"}
            </button>
          </div>
          <textarea
            readOnly
            rows={7}
            value={recipe}
            aria-label="Copyable ErgData variable intervals recipe"
            onFocus={(event) => event.currentTarget.select()}
          />
          <p>{prescription.transferDisclaimer}</p>
        </section>

        <p className="next-workout__honesty">
          Reviewed deterministic prescription · no Bedrock-generation claim ·
          manual setup only
        </p>
      </div>
    </aside>
  );
}

export default NextWorkout;
