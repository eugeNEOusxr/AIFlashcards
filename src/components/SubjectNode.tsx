import { motion } from "framer-motion";
import type { SubjectId } from "../world/types";
import { SubjectTileVisual } from "./subject-tiles/SubjectTileVisual";
import { useSubjectTileParallax } from "./subject-tiles/useSubjectTileParallax";

type Props = {
  subjectId: SubjectId;
  label: "Physics" | "Chemistry" | "Biology";
  active?: boolean;
  locked?: boolean;
  onClick: () => void;
};

export function SubjectNode({ subjectId, label, active, locked, onClick }: Props) {
  const enabled = Boolean(active) && !locked;
  const { ref, visualStyle, onPointerMove, onPointerLeave } = useSubjectTileParallax(enabled);

  return (
    <motion.button
      ref={ref}
      type="button"
      className={[
        "subject-node",
        `subject-node--${subjectId}`,
        active ? "subject-node--active" : "",
        locked ? "subject-node--locked" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      whileHover={locked ? undefined : { scale: 1.02, y: -3 }}
      whileTap={locked ? undefined : { scale: 0.99 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      disabled={locked}
    >
      <span className="subject-node__shadow" aria-hidden />
      <span className="subject-node__glow" aria-hidden />
      <span className="subject-node__motion" aria-hidden />

      <span className="subject-node__visual-stage" style={visualStyle}>
        <SubjectTileVisual subjectId={subjectId} />
      </span>

      <span className="subject-node__content">
        <span className="subject-node__label">{label}</span>
        {locked ? <small>Soon</small> : null}
      </span>
    </motion.button>
  );
}
