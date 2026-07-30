import ReplaySurface, { type ReplaySurfaceProps } from "./ReplaySurface";
import SelectedMoment, { type SelectedMomentProps } from "./SelectedMoment";
import ReplaySupportingPanels, {
  type ReplaySupportingPanelsProps,
} from "./ReplaySupportingPanels";

export type ReplaySessionHeader = {
  title: string;
  date: string;
  structure: string;
  duration: string;
  distance?: string;
  machine?: string;
  reviewLabel?: string;
};

export type ReplayPageProps = {
  session: ReplaySessionHeader;
  replay: ReplaySurfaceProps;
  moment: SelectedMomentProps;
  supporting: ReplaySupportingPanelsProps;
};

/**
 * The complete recording surface. The parent adapts the frozen ReplayFixture and
 * owns every mutable value; this component only establishes product hierarchy.
 */
export function ReplayPage({
  session,
  replay,
  moment,
  supporting,
}: ReplayPageProps) {
  return (
    <main className="wake-replay">
      <header className="session-header">
        <a className="wake-mark" href="/" aria-label="Wake Replay home">
          <span aria-hidden="true">W</span>
          <strong>Wake</strong>
        </a>
        <div className="session-header__identity">
          <div className="session-header__title-row">
            <p>Reviewed Replay</p>
            <h1>{session.title}</h1>
          </div>
          <dl className="session-header__facts">
            <div>
              <dt>Date</dt>
              <dd>{session.date}</dd>
            </div>
            <div>
              <dt>Session</dt>
              <dd>{session.structure}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{session.duration}</dd>
            </div>
            {session.distance && (
              <div>
                <dt>Distance</dt>
                <dd>{session.distance}</dd>
              </div>
            )}
            {session.machine && (
              <div>
                <dt>Machine</dt>
                <dd>{session.machine}</dd>
              </div>
            )}
          </dl>
        </div>
        <span className="session-header__review">
          <i aria-hidden="true" />
          {session.reviewLabel ?? "Reviewed Replay"}
        </span>
      </header>

      <ReplaySurface {...replay} />
      <SelectedMoment {...moment} />
      <ReplaySupportingPanels {...supporting} />
    </main>
  );
}

export default ReplayPage;
