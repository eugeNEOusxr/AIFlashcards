import { memo, type CSSProperties } from "react";
import type { PathwayBiome } from "../../world/pathwayBiomes";
import type { LandmarkVisualState } from "./physicsModuleLandmarkTypes";

type Props = {
  title: string;
  tagline: string;
  state: LandmarkVisualState;
  biome: PathwayBiome;
  frameBadge: string;
  canEnter: boolean;
  isIgniting?: boolean;
  onEnter: () => void;
};

function ModuleWorldLandmarkInner({
  title,
  tagline,
  state,
  biome,
  frameBadge,
  canEnter,
  isIgniting,
  onEnter,
}: Props) {
  const locked = state === "locked";

  return (
    <button
      type="button"
      className={[
        "module-world-landmark",
        biome.className,
        `module-world-landmark--${state}`,
        isIgniting ? "module-world-landmark--igniting" : "",
        locked ? "module-world-landmark--locked" : "",
        state === "active" && canEnter ? "module-world-landmark--pulse" : "",
        state === "next" && canEnter ? "module-world-landmark--pulse-soft" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ["--landmark-accent" as string]: biome.accent,
          ["--landmark-accent-2" as string]: biome.accentSecondary,
        } as CSSProperties
      }
      disabled={!canEnter}
      onClick={() => {
        if (!canEnter) return;
        onEnter();
      }}
    >
      <span className="module-world-landmark__halo" aria-hidden />
      <span className="module-world-landmark__rim" aria-hidden />
      <span className="module-world-landmark__panel">
        <span className="module-world-landmark__badge">{frameBadge}</span>
        <span className="module-world-landmark__title">{title}</span>
        <span className="module-world-landmark__tagline">{tagline}</span>
        <span className="module-world-landmark__status">
          {state === "mastered"
            ? "Mastered"
            : state === "active"
              ? "In progress"
              : state === "next"
                ? "Up next"
                : locked
                  ? "Locked"
                  : "Explore"}
        </span>
      </span>
      {canEnter ? <span className="module-world-landmark__cta">Enter zone →</span> : null}
    </button>
  );
}

export const ModuleWorldLandmark = memo(ModuleWorldLandmarkInner);
