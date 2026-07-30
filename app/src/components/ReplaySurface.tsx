import { useMemo, useRef, useState, type PointerEvent } from "react";
import "../styles/replay.css";
import type { AthleteMark } from "./athleteMarks";

export type ReplayPhase = {
  id: string;
  label: string;
  kind: "work" | "recovery";
  startSeconds: number;
  endSeconds: number;
};

export type ReplayTelemetrySample = {
  elapsedSeconds: number;
  watts: number;
  strokeRate: number;
  heartRate?: number;
  paceSecondsPer500m?: number;
};

export type ReplayHeartRateZone = {
  id: "Z1" | "Z2" | "Z3" | "Z4" | "Z5";
  label: string;
  lowBpm: number;
  highBpm: number;
  purpose: string;
};

export type ReplayMarker = {
  id: string;
  label: string;
  startSeconds: number;
  endSeconds: number;
  focusSeconds: number;
  kind: "hero" | "comparison" | "moment";
};

export type ReplaySurfaceProps = {
  durationSeconds: number;
  currentTimeSeconds: number;
  selectedEventId?: string;
  phases: ReplayPhase[];
  telemetry: ReplayTelemetrySample[];
  heartRateZones?: ReplayHeartRateZone[];
  events: ReplayMarker[];
  athleteMarks?: AthleteMark[];
  selectedAthleteMarkId?: string;
  insights?: { id: string; label: string; focusSeconds: number }[];
  selectedInsightId?: string;
  onSeek: (elapsedSeconds: number) => void;
  onEventSelect: (eventId: string, focusSeconds: number) => void;
  onAthleteMarkSelect?: (mark: AthleteMark) => void;
  onInsightSelect?: (insightId: string) => void;
};

const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 336;
const PLOT_LEFT = 86;
const PLOT_RIGHT = 22;
const PLOT_WIDTH = VIEW_WIDTH - PLOT_LEFT - PLOT_RIGHT;
const PHASE_TOP = 20;
const PHASE_HEIGHT = 28;
const WATTS_TOP = 74;
const WATTS_BOTTOM = 132;
const RATE_TOP = 158;
const RATE_BOTTOM = 216;
const HEART_RATE_TOP = 242;
const HEART_RATE_BOTTOM = 308;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatClock(totalSeconds: number) {
  const safeTenths = Math.max(0, Math.round(totalSeconds * 10));
  const wholeSeconds = Math.floor(safeTenths / 10);
  const minutes = Math.floor(wholeSeconds / 60);
  const seconds = wholeSeconds % 60;
  const tenths = safeTenths % 10;
  return `${minutes}:${seconds.toString().padStart(2, "0")}${
    tenths ? `.${tenths}` : ""
  }`;
}

function formatPreciseClock(totalSeconds: number) {
  const safeMilliseconds = Math.max(0, Math.round(totalSeconds * 1000));
  const wholeSeconds = Math.floor(safeMilliseconds / 1000);
  const minutes = Math.floor(wholeSeconds / 60);
  const seconds = wholeSeconds % 60;
  const milliseconds = safeMilliseconds % 1000;
  return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
    .toString()
    .padStart(3, "0")}`;
}

function makePath(
  samples: ReplayTelemetrySample[],
  value: (sample: ReplayTelemetrySample) => number,
  x: (seconds: number) => number,
  top: number,
  bottom: number,
) {
  if (samples.length === 0) return "";

  const values = samples.map(value);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const spread = high - low || 1;

  return samples
    .map((sample, index) => {
      const y = bottom - ((value(sample) - low) / spread) * (bottom - top);
      return `${index === 0 ? "M" : "L"}${x(sample.elapsedSeconds).toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function makeScaledPath(
  samples: ReplayTelemetrySample[],
  value: (sample: ReplayTelemetrySample) => number | undefined,
  x: (seconds: number) => number,
  top: number,
  bottom: number,
  low: number,
  high: number,
) {
  const spread = high - low || 1;
  return samples
    .filter((sample) => value(sample) !== undefined)
    .map((sample, index) => {
      const sampleValue = value(sample) as number;
      const y =
        bottom -
        ((clamp(sampleValue, low, high) - low) / spread) * (bottom - top);
      return `${index === 0 ? "M" : "L"}${x(sample.elapsedSeconds).toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function ReplaySurface({
  durationSeconds,
  currentTimeSeconds,
  selectedEventId,
  phases,
  telemetry,
  heartRateZones = [],
  events,
  athleteMarks = [],
  selectedAthleteMarkId,
  insights = [],
  selectedInsightId,
  onSeek,
  onEventSelect,
  onAthleteMarkSelect,
  onInsightSelect,
}: ReplaySurfaceProps) {
  const draggingRef = useRef(false);
  const [hoveredTelemetry, setHoveredTelemetry] = useState<{
    sample: ReplayTelemetrySample;
    viewX: number;
  }>();
  const safeDuration = Math.max(1, durationSeconds);
  const x = (seconds: number) =>
    PLOT_LEFT + (clamp(seconds, 0, safeDuration) / safeDuration) * PLOT_WIDTH;

  const wattsPath = useMemo(
    () => makePath(telemetry, (sample) => sample.watts, x, WATTS_TOP, WATTS_BOTTOM),
    [telemetry, safeDuration],
  );
  const ratePath = useMemo(
    () => makePath(telemetry, (sample) => sample.strokeRate, x, RATE_TOP, RATE_BOTTOM),
    [telemetry, safeDuration],
  );
  const observedHeartRatePeak = useMemo(
    () =>
      Math.max(
        0,
        ...telemetry.flatMap((sample) =>
          sample.heartRate === undefined ? [] : [sample.heartRate],
        ),
      ),
    [telemetry],
  );
  const observedHeartRateFloor = useMemo(
    () =>
      Math.min(
        Infinity,
        ...telemetry.flatMap((sample) =>
          sample.heartRate === undefined ? [] : [sample.heartRate],
        ),
      ),
    [telemetry],
  );
  const heartRateFloor = Math.min(
    Number.isFinite(observedHeartRateFloor) ? observedHeartRateFloor : 0,
    heartRateZones[0]?.lowBpm ?? observedHeartRateFloor,
  );
  const heartRateCeiling = Math.max(
    observedHeartRatePeak,
    heartRateZones.at(-1)?.highBpm ?? observedHeartRatePeak,
  );
  const heartRateY = (heartRate: number) =>
    HEART_RATE_BOTTOM -
    ((clamp(heartRate, heartRateFloor, heartRateCeiling) -
      heartRateFloor) /
      Math.max(1, heartRateCeiling - heartRateFloor)) *
      (HEART_RATE_BOTTOM - HEART_RATE_TOP);
  const heartRatePath = useMemo(
    () =>
      makeScaledPath(
        telemetry,
        (sample) => sample.heartRate,
        x,
        HEART_RATE_TOP,
        HEART_RATE_BOTTOM,
        heartRateFloor,
        heartRateCeiling,
      ),
    [telemetry, safeDuration, heartRateFloor, heartRateCeiling],
  );

  const selectedEvent = events.find((event) => event.id === selectedEventId);
  const playheadX = x(currentTimeSeconds);
  const tickCount = Math.max(1, Math.round(safeDuration / 420));
  const ticks = Array.from({ length: tickCount + 1 }, (_, index) => {
    const seconds = (safeDuration * index) / tickCount;
    return { seconds, x: x(seconds) };
  });
  const heartRateZoneFor = (heartRate: number | undefined) => {
    if (heartRate === undefined || observedHeartRatePeak <= 0) return undefined;
    const zone = heartRateZones.find(
      (zone, index) =>
        heartRate >= zone.lowBpm &&
        (heartRate < zone.highBpm ||
          (index === heartRateZones.length - 1 &&
            heartRate <= zone.highBpm)),
    );
    return zone ? `${zone.id} ${zone.label}` : "Below Z1";
  };

  const positionFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const screenMatrix = svg.getScreenCTM();
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const viewX = screenMatrix
      ? point.matrixTransform(screenMatrix.inverse()).x
      : ((event.clientX - svg.getBoundingClientRect().left) /
          svg.getBoundingClientRect().width) *
        VIEW_WIDTH;
    const seconds = ((viewX - PLOT_LEFT) / PLOT_WIDTH) * safeDuration;
    return {
      viewX: clamp(viewX, PLOT_LEFT, VIEW_WIDTH - PLOT_RIGHT),
      seconds: clamp(seconds, 0, safeDuration),
    };
  };

  const nearestSample = (seconds: number) => {
    if (telemetry.length === 0) return undefined;
    let low = 0;
    let high = telemetry.length - 1;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (telemetry[middle].elapsedSeconds < seconds) low = middle + 1;
      else high = middle;
    }
    const after = telemetry[low];
    const before = telemetry[Math.max(0, low - 1)];
    return Math.abs(before.elapsedSeconds - seconds) <=
      Math.abs(after.elapsedSeconds - seconds)
      ? before
      : after;
  };

  const updateHover = (event: PointerEvent<SVGSVGElement>) => {
    const position = positionFromPointer(event);
    const sample = nearestSample(position.seconds);
    if (sample) setHoveredTelemetry({ sample, viewX: position.viewX });
    return position.seconds;
  };

  const startDragging = (event: PointerEvent<SVGSVGElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    onSeek(updateHover(event));
  };

  const dragPlayhead = (event: PointerEvent<SVGSVGElement>) => {
    const seconds = updateHover(event);
    if (draggingRef.current) onSeek(seconds);
  };

  const stopDragging = (event: PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    onSeek(updateHover(event));
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const selectMarker = (marker: ReplayMarker) => {
    onEventSelect(marker.id, marker.focusSeconds);
  };

  return (
    <section className="replay-surface" aria-labelledby="replay-heading">
      <div className="replay-surface__header">
        <div>
          <p className="replay-surface__eyebrow">Replay</p>
          <h2 id="replay-heading">One workout clock</h2>
        </div>
        <output className="replay-surface__clock" aria-label="Current replay time">
          {formatClock(currentTimeSeconds)}
          <span> / {formatClock(safeDuration)}</span>
        </output>
      </div>

      <svg
        className="replay-surface__chart"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="group"
        aria-label={`Workout Replay from 0:00 to ${formatClock(safeDuration)}. ${
          selectedEvent ? `Selected moment: ${selectedEvent.label}.` : ""
        } Includes a heart-rate track with configured athlete zones from ${
          heartRateZones[0]?.lowBpm ?? "—"
        } to ${heartRateZones.at(-1)?.highBpm ?? "—"} BPM.`}
        onPointerDown={startDragging}
        onPointerMove={dragPlayhead}
        onPointerUp={stopDragging}
        onPointerCancel={() => {
          draggingRef.current = false;
          setHoveredTelemetry(undefined);
        }}
        onPointerLeave={() => {
          if (!draggingRef.current) setHoveredTelemetry(undefined);
        }}
      >
        <g className="replay-surface__grid" aria-hidden="true">
          {ticks.map((tick) => (
            <g key={tick.seconds} transform={`translate(${tick.x},0)`}>
              <line x1="0" y1={PHASE_TOP} x2="0" y2={HEART_RATE_BOTTOM} />
              <text x="0" y="330" textAnchor="middle">
                {formatClock(tick.seconds)}
              </text>
            </g>
          ))}
        </g>

        <text className="replay-surface__axis-label" x="0" y="38">
          PHASE
        </text>
        <text className="replay-surface__axis-label" x="0" y="110">
          WATTS
        </text>
        <text className="replay-surface__axis-label" x="0" y="208">
          RATE
        </text>
        <text className="replay-surface__axis-label" x="0" y="276">
          HR
        </text>
        <text className="replay-surface__axis-note" x="0" y="290">
          ATHLETE ZONES
        </text>

        <g className="replay-surface__phases" aria-label="Workout phases">
          {phases.map((phase) => {
            const phaseX = x(phase.startSeconds);
            const width = Math.max(1, x(phase.endSeconds) - phaseX);
            return (
              <g
                key={phase.id}
                className={`replay-phase replay-phase--${phase.kind}`}
              >
                <rect
                  x={phaseX}
                  y={PHASE_TOP}
                  width={width}
                  height={PHASE_HEIGHT}
                  rx="3"
                />
                <text
                  x={phaseX + width / 2}
                  y={PHASE_TOP + 18}
                  textAnchor="middle"
                >
                  {phase.label}
                </text>
              </g>
            );
          })}
        </g>

        <line
          className="replay-surface__track-baseline"
          x1={PLOT_LEFT}
          y1={WATTS_BOTTOM}
          x2={VIEW_WIDTH - PLOT_RIGHT}
          y2={WATTS_BOTTOM}
        />
        <line
          className="replay-surface__track-baseline"
          x1={PLOT_LEFT}
          y1={RATE_BOTTOM}
          x2={VIEW_WIDTH - PLOT_RIGHT}
          y2={RATE_BOTTOM}
        />
        <line
          className="replay-surface__track-baseline"
          x1={PLOT_LEFT}
          y1={HEART_RATE_BOTTOM}
          x2={VIEW_WIDTH - PLOT_RIGHT}
          y2={HEART_RATE_BOTTOM}
        />

        {selectedEvent && (
          <rect
            className="replay-surface__selected-window"
            x={x(selectedEvent.startSeconds)}
            y={PHASE_TOP}
            width={Math.max(
              3,
              x(selectedEvent.endSeconds) - x(selectedEvent.startSeconds),
            )}
            height={HEART_RATE_BOTTOM - PHASE_TOP}
            aria-hidden="true"
          />
        )}

        <path className="replay-telemetry replay-telemetry--watts" d={wattsPath} />
        <path className="replay-telemetry replay-telemetry--rate" d={ratePath} />
        {heartRateZones.length > 0 && (
          <g className="replay-heart-rate-zones" aria-hidden="true">
            {heartRateZones.map((zone) => {
              const top = heartRateY(zone.highBpm);
              const bottom = heartRateY(zone.lowBpm);
              return (
                <g
                  key={zone.id}
                  className={`replay-heart-zone replay-heart-zone--${zone.id.toLowerCase()}`}
                >
                  <title>
                    {zone.id} {zone.label}: {zone.lowBpm}–{zone.highBpm} BPM.{" "}
                    {zone.purpose}
                  </title>
                  <rect
                    x={PLOT_LEFT}
                    y={top}
                    width={PLOT_WIDTH}
                    height={Math.max(1, bottom - top)}
                  />
                  <text
                    x={VIEW_WIDTH - PLOT_RIGHT - 5}
                    y={top + Math.max(9, (bottom - top) / 2 + 3)}
                    textAnchor="end"
                  >
                    {zone.id} {zone.lowBpm}–{zone.highBpm}
                  </text>
                </g>
              );
            })}
            <text
              className="replay-heart-rate-zones__basis"
              x={PLOT_LEFT + 6}
              y={HEART_RATE_TOP + 10}
            >
              Athlete HR zones · configured maximum 186 BPM
            </text>
          </g>
        )}
        <path
          className="replay-telemetry replay-telemetry--heart-rate"
          d={heartRatePath}
        />

        <g className="replay-surface__events" aria-hidden="true">
          {events.map((marker) => {
            const markerX = x(marker.focusSeconds);
            const isSelected = marker.id === selectedEventId;
            return (
              <g
                key={marker.id}
                className={`replay-marker replay-marker--${marker.kind}${
                  isSelected ? " replay-marker--selected" : ""
                }`}
                transform={`translate(${markerX},0)`}
              >
                <line x1="0" y1={PHASE_TOP} x2="0" y2={HEART_RATE_BOTTOM} />
              </g>
            );
          })}
        </g>

        <g className="replay-surface__athlete-marks" aria-hidden="true">
          {athleteMarks.map((mark) => (
            <line
              key={mark.id}
              className={`is-${mark.kind}${
                mark.id === selectedAthleteMarkId ? " is-selected" : ""
              }`}
              x1={x(mark.workoutGlobalSeconds)}
              y1={PHASE_TOP}
              x2={x(mark.workoutGlobalSeconds)}
              y2={HEART_RATE_BOTTOM}
            />
          ))}
        </g>

        <g className="replay-surface__insight-marks" aria-hidden="true">
          {insights.map((insight) => (
            <line
              key={insight.id}
              className={
                insight.id === selectedInsightId ? "is-selected" : undefined
              }
              x1={x(insight.focusSeconds)}
              y1={PHASE_TOP}
              x2={x(insight.focusSeconds)}
              y2={HEART_RATE_BOTTOM}
            />
          ))}
        </g>

        <g className="replay-surface__event-controls" aria-label="Replay moments">
          {events.map((marker) => {
            const markerX = x(marker.focusSeconds);
            const isSelected = marker.id === selectedEventId;
            return (
              <foreignObject
                key={marker.id}
                x={markerX - 22}
                y="45"
                width="240"
                height="44"
                overflow="visible"
              >
                <button
                  type="button"
                  className={`replay-event-button replay-event-button--${marker.kind}${
                    isSelected ? " is-selected" : ""
                  }`}
                  aria-label={`${marker.label}, ${formatClock(marker.focusSeconds)}`}
                  aria-pressed={isSelected}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => selectMarker(marker)}
                >
                  <span className="replay-event-button__icon" aria-hidden="true">
                    {marker.kind === "hero" ? "★" : "●"}
                  </span>
                  <span>
                    {marker.kind === "hero" ? "Pivotal" : marker.label}
                  </span>
                </button>
              </foreignObject>
            );
          })}
        </g>

        <g
          className="replay-surface__insight-controls"
          aria-label="Replay insights"
        >
          {insights.map((insight, index) => {
            const markerX = x(insight.focusSeconds);
            const isSelected = insight.id === selectedInsightId;
            return (
              <foreignObject
                key={insight.id}
                x={markerX - 7}
                y="1"
                width="14"
                height="17"
                overflow="visible"
              >
                <button
                  type="button"
                  className={`replay-insight-button${
                    isSelected ? " is-selected" : ""
                  }`}
                  aria-label={`Insight ${index + 1}: ${
                    insight.label
                  }, Replay ${formatClock(insight.focusSeconds)}`}
                  aria-pressed={isSelected}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => onInsightSelect?.(insight.id)}
                >
                  <span aria-hidden="true">★</span>
                </button>
              </foreignObject>
            );
          })}
        </g>

        <g
          className="replay-surface__athlete-controls"
          aria-label="Reviewed athlete marks"
        >
          {athleteMarks.map((mark) => {
            const markerX = x(mark.workoutGlobalSeconds);
            const isSelected = mark.id === selectedAthleteMarkId;
            const markerLabel =
              mark.kind === "goal"
                ? "Goal: Keep the split under 2:15"
                : `Flag ${mark.fingerCount}: Athlete attention marker`;
            const exactClock = formatPreciseClock(mark.workoutGlobalSeconds);
            const labelOnLeft = mark.kind === "flag";
            return (
              <foreignObject
                key={mark.id}
                x={labelOnLeft ? markerX - 68 : markerX - 12}
                y={mark.kind === "goal" ? "274" : "296"}
                width="80"
                height="44"
                overflow="visible"
              >
                <button
                  type="button"
                  className={`replay-athlete-button replay-athlete-button--${mark.kind}${
                    isSelected ? " is-selected" : ""
                  }${labelOnLeft ? " label-left" : ""}`}
                  aria-label={`${markerLabel}, Replay ${exactClock}`}
                  aria-pressed={isSelected}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => onAthleteMarkSelect?.(mark)}
                >
                  <span className="replay-athlete-button__icon" aria-hidden="true">
                    {mark.kind === "goal" ? (
                      <i>◎</i>
                    ) : (
                      <>
                        <i>⚑</i>
                        <b>{mark.fingerCount}</b>
                      </>
                    )}
                  </span>
                  <small>{mark.kind === "goal" ? "GOAL" : "FLAG"}</small>
                </button>
              </foreignObject>
            );
          })}
        </g>

        {hoveredTelemetry && (
          <g className="replay-hover" pointerEvents="none">
            <line
              x1={hoveredTelemetry.viewX}
              y1={PHASE_TOP}
              x2={hoveredTelemetry.viewX}
              y2={HEART_RATE_BOTTOM}
            />
            <g
              transform={`translate(${clamp(
                hoveredTelemetry.viewX - 116,
                PLOT_LEFT,
                VIEW_WIDTH - PLOT_RIGHT - 232,
              )},58)`}
            >
              <rect width="232" height="67" rx="7" />
              <text className="replay-hover__time" x="11" y="17">
                {formatClock(hoveredTelemetry.sample.elapsedSeconds)}
              </text>
              <text x="11" y="38">
                {Math.round(hoveredTelemetry.sample.watts)} W
              </text>
              <text x="68" y="38">
                {hoveredTelemetry.sample.strokeRate.toFixed(1)} SPM
              </text>
              <text x="149" y="38">
                {hoveredTelemetry.sample.heartRate === undefined
                  ? "HR —"
                  : `${Math.round(hoveredTelemetry.sample.heartRate)} BPM · ${heartRateZoneFor(
                      hoveredTelemetry.sample.heartRate,
                    )}`}
              </text>
              <text className="replay-hover__pace" x="11" y="57">
                Split{" "}
                {hoveredTelemetry.sample.paceSecondsPer500m === undefined
                  ? "—"
                  : `${formatClock(
                      hoveredTelemetry.sample.paceSecondsPer500m,
                    )} /500m`}
              </text>
            </g>
          </g>
        )}

        <g
          className="replay-playhead"
          transform={`translate(${playheadX},0)`}
          aria-hidden="true"
        >
          <line
            x1="0"
            y1={PHASE_TOP - 5}
            x2="0"
            y2={HEART_RATE_BOTTOM + 3}
          />
          <path d={`M-5,${PHASE_TOP - 6} L5,${PHASE_TOP - 6} L0,${PHASE_TOP} Z`} />
        </g>
      </svg>
    </section>
  );
}

export default ReplaySurface;
