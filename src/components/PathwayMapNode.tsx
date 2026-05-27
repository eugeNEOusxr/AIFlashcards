import { motion } from "framer-motion";
type Props = {
  title: string;
  description: string;
  state: "active" | "next" | "mastered" | "unlocked" | "locked";
  biomeClass: string;
  lessonBadge?: string;
  onClick: () => void;
};

export function PathwayMapNode({ title, description, state, biomeClass, lessonBadge, onClick }: Props) {
  const locked = state === "locked";

  return (
    <motion.button
      type="button"
      className={[
        "pathway-map-node",
        "neural-glass",
        biomeClass,
        `pathway-map-node--${state}`,
      ].join(" ")}
      whileHover={!locked ? { scale: 1.03, y: -5 } : undefined}
      whileTap={!locked ? { scale: 0.98 } : undefined}
      animate={locked ? undefined : { y: [0, -3, 0] }}
      transition={{ y: { duration: 11, repeat: Infinity, ease: "easeInOut" } }}
      onClick={onClick}
      disabled={locked}
    >
      <span className="pathway-map-node__glow" aria-hidden />
      <span className="pathway-map-node__content">
        {lessonBadge ? <span className="pathway-map-node__badge">{lessonBadge}</span> : null}
        <span className="pathway-map-node__title">{title}</span>
        <span className="pathway-map-node__desc">{description}</span>
        <span className="pathway-map-node__state">
          {state === "mastered" ? "mastered" : state === "next" ? "next up" : state}
        </span>
      </span>
    </motion.button>
  );
}
