import type { NavScreen } from "../../world/types";
import { WorldBreadcrumb } from "./WorldBreadcrumb";

type Props = {
  screen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  onJumpToCurrent?: () => void;
  moodLabel?: string;
};

/** In-field layer navigation — stays over the scroll map / lesson chamber. */
export function MapLayerNav({ screen, onNavigate, onJumpToCurrent, moodLabel }: Props) {
  const onWorlds = () => onNavigate({ kind: "HOME" });
  const onMap =
    screen.kind === "LESSON"
      ? () => onNavigate({ kind: "SUBJECT", subjectId: screen.subjectId })
      : screen.kind === "SUBJECT"
        ? undefined
        : undefined;

  return (
    <div className="map-layer-nav" role="navigation" aria-label="Layer navigation">
      <div className="map-layer-nav__actions">
        <button type="button" className="map-layer-nav__back" onClick={onWorlds}>
          ← Worlds
        </button>
        {onMap ? (
          <button type="button" className="map-layer-nav__back map-layer-nav__back--secondary" onClick={onMap}>
            ← Study path
          </button>
        ) : null}
        {onJumpToCurrent ? (
          <button type="button" className="map-layer-nav__jump" onClick={onJumpToCurrent}>
            Current stop
          </button>
        ) : null}
      </div>
      <WorldBreadcrumb screen={screen} onNavigate={onNavigate} />
      {moodLabel ? <span className="map-layer-nav__mood">{moodLabel}</span> : null}
    </div>
  );
}
