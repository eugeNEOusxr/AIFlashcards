import type { NavScreen } from "../../world/types";
import { WorldBreadcrumb } from "./WorldBreadcrumb";

type Props = {
  screen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  onJumpToCurrent?: () => void;
  moodLabel?: string;
};

function parentScreen(screen: NavScreen): NavScreen | null {
  if (screen.kind === "SUBJECT") return { kind: "HOME" };
  if (screen.kind === "FRAME_MODULE" || screen.kind === "LESSON") {
    return { kind: "SUBJECT", subjectId: screen.subjectId };
  }
  return null;
}

function parentBackLabel(screen: NavScreen): string | null {
  if (screen.kind === "SUBJECT") return "← Worlds";
  if (screen.kind === "FRAME_MODULE" || screen.kind === "LESSON") return "← Map";
  return null;
}

/** In-field layer navigation — back buttons + breadcrumb trail. */
export function MapLayerNav({ screen, onNavigate, onJumpToCurrent, moodLabel }: Props) {
  const parent = parentScreen(screen);
  const parentLabel = parentBackLabel(screen);

  return (
    <div className="map-layer-nav" role="navigation" aria-label="Layer navigation">
      <div className="map-layer-nav__actions">
        {parent && parentLabel ? (
          <button
            type="button"
            className="map-layer-nav__back"
            onClick={() => onNavigate(parent)}
          >
            {parentLabel}
          </button>
        ) : null}
        {screen.kind === "FRAME_MODULE" || screen.kind === "LESSON" ? (
          <button
            type="button"
            className="map-layer-nav__back map-layer-nav__back--secondary"
            onClick={() => onNavigate({ kind: "HOME" })}
          >
            ← Worlds
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
