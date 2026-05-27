import { motion } from "framer-motion";
import { PathwayNode } from "../../components/PathwayNode";
import { getPathwaysForSubject, getSubject } from "../../world/physicsWorld";
import { getPathwayBiome } from "../../world/pathwayBiomes";
import type { SubjectId, PathwayId } from "../../world/types";

type Props = {
  subjectId: SubjectId;
  onBack: () => void;
  onSelectPathway: (pathwayId: PathwayId) => void;
};

export function SubjectWorldView({ subjectId, onBack, onSelectPathway }: Props) {
  const subject = getSubject(subjectId);
  const pathways = getPathwaysForSubject(subjectId);

  return (
    <motion.section
      key={`subject-${subjectId}`}
      className="world-subject"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="world-subject__head">
        <button type="button" className="la-secondary" onClick={onBack}>
          ← Worlds
        </button>
        <div>
          <p className="world-kicker">Subject world</p>
          <h2 className="world-title">{subject?.label ?? subjectId}</h2>
          <p className="world-subtitle">{subject?.tagline ?? "Choose a pathway"}</p>
        </div>
      </div>

      <div className="world-pathway-rail" role="list" aria-label="Physics pathways">
        <div className="world-pathway-rail__track" aria-hidden />
        {pathways.map((p, i) => (
          <motion.div
            key={p.id}
            className="world-pathway-rail__item"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <PathwayNode
              title={p.title}
              description={p.description}
              available={p.available}
              active={p.id === "motion-forces"}
              biomeClass={getPathwayBiome(p.id).className}
              progressLabel={p.available ? (p.id === "motion-forces" ? "In progress" : undefined) : undefined}
              onClick={() => p.available && onSelectPathway(p.id)}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
