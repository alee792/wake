import NextWorkout from "./NextWorkout";
import { verifiedReplayBuild } from "./replayVerification";
import { workoutPrescription } from "./workoutPrescription";

export type ReplayWorkInterval = {
  id: string;
  label: string;
  workTime: string;
  meters: string;
  pace: string;
  watts: string;
  strokeRate: string;
  insight: string;
};

export type ReplayNextSession = {
  drill: string;
  instruction?: string;
  successCriterion: string;
};

export type ReplayBuildManifestStep = {
  stepId: string;
  role: string;
  provider: string;
  service?: string;
  executionMode: string;
  humanReviewed: boolean;
};

export type ReplayBuildManifest = {
  steps: ReplayBuildManifestStep[];
};

export type ReplaySupportingPanelsProps = {
  intervals: ReplayWorkInterval[];
  selectedIntervalId?: string;
  onSelectInterval: (intervalId: string) => void;
  onSelectInsight?: (insightId: string) => void;
  nextSession: ReplayNextSession;
  manifest: ReplayBuildManifest;
  provenanceExpanded: boolean;
  onToggleProvenance: () => void;
};

/**
 * The fixture-driven lower portion of Replay.
 *
 * The parent controller owns interval selection and provenance expansion. This
 * component renders the frozen values and emits intent callbacks only.
 */
export function ReplaySupportingPanels({
  intervals,
  selectedIntervalId,
  onSelectInterval,
  onSelectInsight,
  nextSession,
  manifest,
  provenanceExpanded,
  onToggleProvenance,
}: ReplaySupportingPanelsProps) {
  return (
    <section
      className="replay-supporting-panels"
      aria-label="Workout comparison and next session"
    >
      <div className="replay-supporting-panels__main">
        <section
          className="interval-breakdown"
          aria-labelledby="interval-breakdown-title"
        >
          <div className="interval-breakdown__heading">
            <div>
              <span>Work intervals</span>
              <h2 id="interval-breakdown-title">Interval breakdown</h2>
            </div>
            <small>Select a row to inspect it in Replay</small>
          </div>

          <div className="interval-breakdown__table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Interval</th>
                  <th scope="col">Work</th>
                  <th scope="col">Meters</th>
                  <th scope="col">Pace</th>
                  <th scope="col">Watts</th>
                  <th scope="col">Rate</th>
                  <th scope="col">Wake insight</th>
                </tr>
              </thead>
              <tbody>
                {intervals.map((interval) => {
                  const selected = interval.id === selectedIntervalId;

                  return (
                    <tr
                      key={interval.id}
                      className={selected ? "is-selected" : undefined}
                      aria-selected={selected}
                      onClick={() => onSelectInterval(interval.id)}
                    >
                      <th scope="row">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelectInterval(interval.id);
                          }}
                          aria-pressed={selected}
                        >
                          {interval.label}
                        </button>
                      </th>
                      <td>{interval.workTime}</td>
                      <td>{interval.meters}</td>
                      <td>{interval.pace}</td>
                      <td>{interval.watts}</td>
                      <td>{interval.strokeRate}</td>
                      <td>{interval.insight}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <NextWorkout
          prescription={workoutPrescription}
          fallback={nextSession}
          onSelectInsight={onSelectInsight}
        />
      </div>

      <section className="replay-provenance" aria-labelledby="provenance-title">
        <button
          type="button"
          className="replay-provenance__toggle"
          aria-expanded={provenanceExpanded}
          aria-controls="replay-provenance-detail"
          onClick={onToggleProvenance}
        >
          <span>
            <strong id="provenance-title">How this Replay earns trust</strong>
            <small>
              One workout · four connected systems · verified OpenAI synthesis
            </small>
          </span>
          <span aria-hidden="true">{provenanceExpanded ? "−" : "+"}</span>
        </button>

        <div
          id="replay-provenance-detail"
          className="replay-provenance__detail"
          hidden={!provenanceExpanded}
        >
          <div className="replay-provenance__intro">
            <span>Inside this Replay</span>
            <h3>
              Every answer stays connected to the moment that earned it.
            </h3>
            <p>
              Wake brings performance, video, evidence, and coaching together
              around one shared workout clock. That connection lets every insight
              lead back to the numbers, footage, comparisons, and limitations
              behind it.
            </p>
          </div>

          <ul className="replay-provenance__story">
            {verifiedReplayBuild.stories.map((story) => (
              <li key={story.system}>
                <span>{story.system}</span>
                <strong>{story.title}</strong>
                <p>{story.body}</p>
              </li>
            ))}
          </ul>

          <div className="replay-provenance__verification">
            <p>
              <strong>Verified build</strong>
              <span aria-hidden="true">·</span>
              <span>OpenAI synthesis completed</span>
              <span aria-hidden="true">·</span>
              <span>4 evidence citations</span>
              <span aria-hidden="true">·</span>
              <span>23 numeric checks passed</span>
              <span aria-hidden="true">·</span>
              <span>packaged for offline playback</span>
            </p>

            <details className="replay-provenance__verification-drawer">
              <summary>View verification</summary>
              <div className="replay-provenance__verification-detail">
                <div className="replay-provenance__verification-heading">
                  <span aria-hidden="true" />
                  <div>
                    <small>Status</small>
                    <strong>Verified</strong>
                  </div>
                  <p>
                    OpenAI synthesized the supplied Concept2, reviewed Pegasus,
                    and Neo4j evidence into coaching. It did not dispatch or
                    perform the Pegasus investigations.
                  </p>
                </div>

                <dl className="replay-provenance__verification-grid">
                  <div>
                    <dt>Model</dt>
                    <dd><code>{verifiedReplayBuild.model}</code></dd>
                  </div>
                  <div>
                    <dt>Orchestration</dt>
                    <dd>{verifiedReplayBuild.orchestration}</dd>
                  </div>
                  <div>
                    <dt>Route</dt>
                    <dd>{verifiedReplayBuild.route}</dd>
                  </div>
                  <div>
                    <dt>Region</dt>
                    <dd><code>{verifiedReplayBuild.region}</code></dd>
                  </div>
                  <div>
                    <dt>Run result</dt>
                    <dd>{verifiedReplayBuild.runResult}</dd>
                  </div>
                  <div>
                    <dt>Schema validation</dt>
                    <dd>{verifiedReplayBuild.schemaValidation}</dd>
                  </div>
                  <div>
                    <dt>Citation validation</dt>
                    <dd>{verifiedReplayBuild.citationValidation}</dd>
                  </div>
                  <div>
                    <dt>Numeric audit</dt>
                    <dd>{verifiedReplayBuild.numericAudit}</dd>
                  </div>
                  <div className="replay-provenance__verification-wide">
                    <dt>Build / recording mode</dt>
                    <dd>{verifiedReplayBuild.recordingMode}</dd>
                  </div>
                </dl>

                <div className="replay-provenance__evidence-ids">
                  <strong>Four cited evidence IDs</strong>
                  <ul>
                    {verifiedReplayBuild.evidenceIds.map((evidenceId) => (
                      <li key={evidenceId}><code>{evidenceId}</code></li>
                    ))}
                  </ul>
                </div>

                <p className="replay-provenance__limitation">
                  <strong>Camera limitation</strong>
                  {verifiedReplayBuild.limitation}
                </p>
                <p className="replay-provenance__mantle-note">
                  Native Bedrock inference succeeded; the superseded Bedrock
                  Mantle attempt did not.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </section>
  );
}

export default ReplaySupportingPanels;
