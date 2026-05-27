import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
  available: boolean;
  active?: boolean;
  biomeClass?: string;
  progressLabel?: string;
  onClick: () => void;
};

export function PathwayNode({ title, description, available, active, biomeClass, progressLabel, onClick }: Props) {
  return (
    <motion.button
      type="button"
      className={[
        "pathway-node",
        "neural-glass",
        available ? "pathway-node--available" : "pathway-node--locked",
        active ? "pathway-node--active" : "",
        biomeClass ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      whileHover={available ? { scale: 1.03, y: -6 } : undefined}
      whileTap={available ? { scale: 0.98 } : undefined}
      animate={available ? { y: [0, -3, 0] } : undefined}
      transition={{ y: { duration: 12, repeat: Infinity, ease: "easeInOut" } }}
      onClick={onClick}
      disabled={!available}
    >
      <span className="pathway-node__glow" aria-hidden />
      <span className="pathway-node__trail" aria-hidden />
      <span className="pathway-node__content">
        <span className="pathway-node__title">{title}</span>
        <span className="pathway-node__desc">{description}</span>
        {progressLabel ? <span className="pathway-node__progress">{progressLabel}</span> : null}
        {!available ? <span className="pathway-node__badge">Locked</span> : null}
      </span>
    </motion.button>
  );
}
