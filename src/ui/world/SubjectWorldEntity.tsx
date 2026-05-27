import { motion } from "framer-motion";
import type { SubjectId } from "../../world/types";
import { SubjectTileVisual } from "../../components/subject-tiles/SubjectTileVisual";
import { useSubjectTileParallax } from "../../components/subject-tiles/useSubjectTileParallax";

export type SubjectEntitySlot = {
  left: string;
  top: string;
  /** Stacking order on canvas */
  z: number;
  /** Perspective depth in px (negative = farther, positive = nearer) */
  depthZ: number;
  scale: number;
  driftClass: string;
};

type Props = {
  subjectId: SubjectId;
  label: string;
  tagline: string;
  slot: SubjectEntitySlot;
  available: boolean;
  onEnter: () => void;
};

export function SubjectWorldEntity({
  subjectId,
  label,
  tagline,
  slot,
  available,
  onEnter,
}: Props) {
  const { ref, visualStyle, onPointerMove, onPointerLeave } = useSubjectTileParallax(available);

  return (
    <motion.div
      className={[
        "world-entity",
        `world-entity--${subjectId}`,
        slot.driftClass,
        available ? "world-entity--live" : "world-entity--dormant",
      ].join(" ")}
      style={{
        left: slot.left,
        top: slot.top,
        zIndex: slot.z,
        ["--entity-scale" as string]: String(slot.scale),
        ["--entity-depth-z" as string]: `${slot.depthZ}px`,
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <button
        ref={ref}
        type="button"
        className="world-entity__hit"
        disabled={!available}
        onClick={onEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        aria-label={available ? `Enter ${label}` : `${label} — coming soon`}
      >
        <span className="world-entity__shadow" aria-hidden />
        <span className="world-entity__glow" aria-hidden />
        <span className="world-entity__motion" aria-hidden />

        <span className="world-entity__visual" style={visualStyle}>
          <SubjectTileVisual subjectId={subjectId} />
        </span>

        <span className="world-entity__label-wrap">
          <span className="world-entity__label">{label}</span>
          <span className="world-entity__tagline">{available ? tagline : "Coming soon"}</span>
        </span>
      </button>
    </motion.div>
  );
}
