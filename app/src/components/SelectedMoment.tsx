import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AthleteMark } from "./athleteMarks";

export type SelectedMomentMetric = {
  label: string;
  value: string;
};

export type SelectedMomentEvidenceSummary = {
  label: string;
  value: string;
};

export type SelectedMomentEvidence = {
  id: string;
  group: "Telemetry" | "Visual" | "Workout pattern" | "Context or limitation";
  statement: string;
  timeRange?: string;
  provider?: string;
  generationMode?: string;
  confidenceOrLimitation?: string;
};

export type SelectedMomentRecurrence = {
  eventId: string;
  label: string;
  timestamp: string;
  description?: string;
};

export type SelectedMomentMedia = {
  label: string;
  timestamp: string;
  poster?: string;
  src?: string;
  alt?: string;
  desiredTimeSeconds?: number;
  alignmentLabel?: string;
};

export type SelectedMomentProps = {
  timestamp: string;
  eyebrow?: string;
  headline: string;
  explanation: string;
  metrics?: SelectedMomentMetric[];
  evidenceSummaries: SelectedMomentEvidenceSummary[];
  evidence: SelectedMomentEvidence[];
  evidenceExpanded: boolean;
  onToggleEvidence: () => void;
  recurrence?: SelectedMomentRecurrence;
  onSelectRecurrence?: (eventId: string) => void;
  media: SelectedMomentMedia;
  recommendation?: ReactNode;
  athleteMark?: AthleteMark;
  askWake?: ReactNode;
};

function formatMarkClock(totalSeconds: number) {
  const milliseconds = Math.max(0, Math.round(totalSeconds * 1000));
  const wholeSeconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(wholeSeconds / 60)}:${String(
    wholeSeconds % 60,
  ).padStart(2, "0")}.${String(milliseconds % 1000).padStart(3, "0")}`;
}

/**
 * A fixture-driven view of the active Replay event.
 *
 * Selection, Replay time, evidence expansion, and media synchronization remain
 * owned by the parent controller. This component only renders their current
 * values and emits intent callbacks.
 */
export function SelectedMoment({
  timestamp,
  eyebrow = "Selected moment",
  headline,
  explanation,
  metrics = [],
  evidenceSummaries,
  evidence,
  evidenceExpanded,
  onToggleEvidence,
  recurrence,
  onSelectRecurrence,
  media,
  recommendation,
  athleteMark,
  askWake,
}: SelectedMomentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => {
    setMediaReady(false);
    setMediaFailed(false);
  }, [media.src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mediaReady || media.desiredTimeSeconds === undefined) return;

    const duration = Number.isFinite(video.duration) ? video.duration : Infinity;
    const target = Math.min(
      Math.max(0, media.desiredTimeSeconds),
      Math.max(0, duration - 0.05),
    );

    video.pause();
    if (Math.abs(video.currentTime - target) > 0.03) {
      video.currentTime = target;
    }
  }, [media.src, media.desiredTimeSeconds, mediaReady]);

  const seekAndPause = () => {
    const video = videoRef.current;
    if (!video) return;
    setMediaReady(true);
    video.pause();
  };

  const renderMediaFallback = () =>
    media.poster ? (
      <img src={media.poster} alt={media.alt ?? media.label} />
    ) : (
      <div
        className="selected-moment__media-unavailable"
        role="img"
        aria-label="Media unavailable"
      >
        Media unavailable
      </div>
    );

  return (
    <section className="selected-moment" aria-labelledby="selected-moment-title">
      <div className="selected-moment__insight">
        <div className="selected-moment__kicker">
          <span>{eyebrow}</span>
          <time>{timestamp}</time>
        </div>
        <h2 id="selected-moment-title">{headline}</h2>
        <p>{explanation}</p>

        {metrics.length > 0 && (
          <dl className="selected-moment__metrics" aria-label="Moment metrics">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {recommendation && (
          <div className="selected-moment__recommendation">
            <span>Coach cue</span>
            {recommendation}
          </div>
        )}

        {athleteMark && (
          <aside
            className={`selected-moment__athlete-note selected-moment__athlete-note--${athleteMark.kind}`}
            aria-label={`Reviewed athlete ${
              athleteMark.kind === "goal" ? "Goal" : "Flag"
            }`}
          >
            <div>
              <strong>
                {athleteMark.kind === "goal"
                  ? "Goal"
                  : `Flag ${athleteMark.fingerCount}`}
              </strong>
              <time>{formatMarkClock(athleteMark.workoutGlobalSeconds)}</time>
            </div>
            {athleteMark.kind === "goal" ? (
              <small>
                Original video {athleteMark.media.sourceVideoTimestamp} · target
                strictly under 2:15/500m
              </small>
            ) : (
              <small>
                Original video {athleteMark.media.sourceVideoTimestamp} · Recovery
                3
              </small>
            )}
          </aside>
        )}
      </div>

      <div className="selected-moment__evidence">
        <div className="selected-moment__evidence-heading">
          <h3>Evidence</h3>
          <span>{evidenceSummaries.length} signals</span>
        </div>

        <dl className="selected-moment__evidence-summary">
          {evidenceSummaries.map((item) => (
            <div key={`${item.label}-${item.value}`}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <button
          className="selected-moment__why-toggle"
          type="button"
          aria-expanded={evidenceExpanded}
          aria-controls="selected-moment-evidence-detail"
          onClick={onToggleEvidence}
        >
          Why Wake believes this
          <span aria-hidden="true">{evidenceExpanded ? "−" : "+"}</span>
        </button>

        {askWake}

        <div
          id="selected-moment-evidence-detail"
          className="selected-moment__evidence-detail"
          hidden={!evidenceExpanded}
        >
          <ol>
            {evidence.map((item) => (
              <li key={item.id}>
                <div className="selected-moment__evidence-label">
                  <strong>{item.group}</strong>
                  {item.timeRange && <span>{item.timeRange}</span>}
                </div>
                <p>{item.statement}</p>
                {(item.provider ||
                  item.generationMode ||
                  item.confidenceOrLimitation) && (
                  <p className="selected-moment__evidence-meta">
                    {[item.provider, item.generationMode, item.confidenceOrLimitation]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ol>

          {recurrence && (
            <button
              className="selected-moment__recurrence"
              type="button"
              onClick={() => onSelectRecurrence?.(recurrence.eventId)}
              disabled={!onSelectRecurrence}
            >
              <span>{recurrence.label}</span>
              <strong>{recurrence.timestamp}</strong>
              {recurrence.description && <small>{recurrence.description}</small>}
            </button>
          )}
        </div>
      </div>

      <figure className="selected-moment__media">
        {media.src && !mediaFailed ? (
          <>
            <video
              key={media.src}
              ref={videoRef}
              src={media.src}
              poster={media.poster}
              preload="metadata"
              controls
              playsInline
              aria-label={media.alt ?? media.label}
              onLoadedMetadata={seekAndPause}
              onSeeked={() => videoRef.current?.pause()}
              onError={() => setMediaFailed(true)}
            />
            {!mediaReady && (
              <span className="selected-moment__media-status" role="status">
                Preparing reviewed clip…
              </span>
            )}
          </>
        ) : (
          renderMediaFallback()
        )}
        <figcaption>
          <span>
            {mediaFailed ? "Video unavailable · poster shown" : media.label}
            {media.alignmentLabel && <small>{media.alignmentLabel}</small>}
          </span>
          <time>{media.timestamp}</time>
        </figcaption>
      </figure>
    </section>
  );
}

export default SelectedMoment;
