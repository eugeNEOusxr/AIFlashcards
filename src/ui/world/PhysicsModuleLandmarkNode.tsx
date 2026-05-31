import { memo, type CSSProperties, type Ref } from "react";
import { ModuleWorldLandmark } from "./ModuleWorldLandmark";
import type { LandmarkNodeData } from "./physicsModuleLandmarkTypes";

type Props = {
  entry: LandmarkNodeData;
  positionStyle: CSSProperties;
  zIndex: number;
  parallaxRef: (el: HTMLDivElement | null) => void;
  anchorRef?: Ref<HTMLDivElement>;
  onEnter: (id: string) => void;
  /** Root BEM prefix — physics-module-world or chemistry-module-world */
  mapClassPrefix?: string;
};

function PhysicsModuleLandmarkNodeInner({
  entry,
  positionStyle,
  zIndex,
  parallaxRef,
  anchorRef,
  onEnter,
  mapClassPrefix = "physics-module-world",
}: Props) {
  const { id, slot, title, tagline, visual, biome, frameBadge, canEnter, isIgniting } = entry;

  return (
    <div
      ref={anchorRef}
      className={[
        `${mapClassPrefix}__landmark`,
        `${mapClassPrefix}__landmark--${slot.align}`,
      ].join(" ")}
      style={{ ...positionStyle, zIndex }}
    >
      <div
        ref={parallaxRef}
        className={`${mapClassPrefix}__landmark-shift`}
        data-landmark-id={id}
      >
        <ModuleWorldLandmark
          title={title}
          tagline={tagline}
          state={visual}
          biome={biome}
          frameBadge={frameBadge}
          canEnter={canEnter}
          isIgniting={isIgniting}
          onEnter={() => onEnter(id)}
        />
      </div>
    </div>
  );
}

export const PhysicsModuleLandmarkNode = memo(PhysicsModuleLandmarkNodeInner);
