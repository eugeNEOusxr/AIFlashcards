import { motion } from "framer-motion";
import type { ModuleProgressState } from "../world/types";

type Props = {
  title: string;
  subtitle: string;
  concepts: string[];
  state: ModuleProgressState;
  depth: number;
  biomeClass?: string;
  onClick: () => void;
};

export function ModuleNode({ title, subtitle, concepts, state, depth, biomeClass, onClick }: Props) {
  const locked = state === "locked";

  return (
    <motion.button
      type="button"
      className={[
        "module-node",
        "neural-glass",
        biomeClass ?? "",
        `module-node--${state}`,
        `module-node--depth-${Math.min(depth, 4)}`,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ["--depth" as string]: String(depth),
        scale: "var(--node-scale, 1)",
      }}
      whileHover={!locked ? { scale: 1.04, y: -6 } : undefined}
      whileTap={!locked ? { scale: 0.98 } : undefined}
      animate={
        locked
          ? undefined
          : {
              y: [0, -2 - depth * 0.3, 0],
            }
      }
      transition={{ y: { duration: 9 + depth, repeat: Infinity, ease: "easeInOut" } }}
      onClick={onClick}
      disabled={locked}
    >
      <span className="module-node__field" aria-hidden />
      <span className="module-node__ring" aria-hidden />
      <span className="module-node__content">
        <span className="module-node__index">{depth + 1}</span>
        <span className="module-node__title">{title}</span>
        <span className="module-node__subtitle">{subtitle}</span>
        <span className="module-node__concepts">
          {concepts.slice(0, 3).map((c) => (
            <em key={c}>{c}</em>
          ))}
        </span>
        <span className="module-node__state">{state}</span>
      </span>
    </motion.button>
  );
}
