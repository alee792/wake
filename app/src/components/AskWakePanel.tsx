import { useEffect, useRef, useState } from "react";
import type { ValidatedAskWakeAnswer } from "./askWakeArtifact";

export type AskWakeSideView = {
  src: string;
  poster: string;
  durationSeconds: number;
};

export type AskWakePanelProps = {
  question: string;
  answer?: ValidatedAskWakeAnswer;
  sideView: AskWakeSideView;
};

function formatClipClock(seconds: number) {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export function AskWakePanel({
  question,
  answer,
  sideView,
}: AskWakePanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [sideViewOpen, setSideViewOpen] = useState(false);
  const [sideViewFailed, setSideViewFailed] = useState(false);

  useEffect(() => {
    if (!sideViewOpen) videoRef.current?.pause();
  }, [sideViewOpen]);

  return (
    <div className="ask-wake">
      <button
        className="ask-wake__toggle"
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        <span>
          <strong>Ask Wake</strong>
          <small>{answer ? "Validated cached answer" : "Answer pending"}</small>
        </span>
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <section className="ask-wake__panel" aria-label="Ask Wake">
          <button
            className="ask-wake__close"
            type="button"
            aria-label="Close Ask Wake"
            onClick={() => {
              setSideViewOpen(false);
              setExpanded(false);
            }}
          >
            ×
          </button>
          <p className="ask-wake__eyebrow">Prepopulated question</p>
          <h3>{question}</h3>

          {answer ? (
            <div className="ask-wake__answer">
              <p>{answer.answer}</p>
              <small>{answer.limitation}</small>
              <span>
                {answer.executionMode === "real-api"
                  ? "Validated real Bedrock response"
                  : "Validated cached-real Bedrock response"}
              </span>
            </div>
          ) : (
            <div className="ask-wake__pending" role="status">
              <strong>Answer pending</strong>
              <p>
                Wake will show an answer only after a real Bedrock response passes
                citation review. No model answer is available yet.
              </p>
            </div>
          )}

          <button
            className="ask-wake__cross-angle"
            type="button"
            aria-expanded={sideViewOpen}
            onClick={() => setSideViewOpen((value) => !value)}
          >
            {sideViewOpen ? "Hide cross-angle evidence" : "View cross-angle evidence"}
          </button>

          {sideViewOpen && (
            <figure className="ask-wake__side-view">
              {!sideViewFailed ? (
                <video
                  ref={videoRef}
                  src={sideView.src}
                  poster={sideView.poster}
                  preload="metadata"
                  controls
                  playsInline
                  aria-label="Reviewed supplemental low-angle rowing clip"
                  onError={() => setSideViewFailed(true)}
                />
              ) : (
                <img
                  src={sideView.poster}
                  alt="Reviewed poster for the supplemental low-angle rowing clip"
                />
              )}
              <figcaption>
                <span>Supplemental candidate-mechanism context</span>
                <time>
                  Clip-local 0:00–{formatClipClock(sideView.durationSeconds)}
                </time>
              </figcaption>
              <p>
                This separate clip suggests patterns worth investigating. It is
                not mapped to workout time and does not establish occurrence or
                causation in the selected windows.
              </p>
            </figure>
          )}
        </section>
      )}
    </div>
  );
}
