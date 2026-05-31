import { memo, type CSSProperties, type Ref } from "react";
import type { PhysicsModuleLandmarkId } from "../../world/physicsModuleLandmarks";
import { ModuleWorldLandmark } from "./ModuleWorldLandmark";
import type { LandmarkNodeData } from "./physicsModuleLandmarkTypes";

type Props = {
  entry: LandmarkNodeData;
  positionStyle: CSSProperties;
  zIndex: number;
  parallaxRef: (el: HTMLDivElement | null) => void;
  anchorRef?: Ref<HTMLDivElement>;
  onEnter: (id: PhysicsModuleLandmarkId) => void;
};

function PhysicsModuleLandmarkNodeInner({
  entry,
  positionStyle,
  zIndex,
  parallaxRef,
  anchorRef,
  onEnter,
}: Props) {
  const { id, slot, title, tagline, visual, biome, frameBadge, canEnter, isIgniting } = entry;

  return (
    <div
      ref={anchorRef}
      className={[
        "physics-module-world__landmark",
        `physics-module-world__landmark--${slot.align}`,
      ].join(" ")}
      style={{ ...positionStyle, zIndex }}
    >
      <div
        ref={parallaxRef}
        className="physics-module-world__landmark-shift"
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
