import { motion } from "framer-motion";
import { worldMapWidth } from "../../world/serpentineLayout";

type Props = {
  x: number;
  y: number;
  label?: string;
  mapWidth?: number;
};

export function WorldMapStartNode({ x, y, label = "Journey start", mapWidth }: Props) {
  const width = mapWidth ?? worldMapWidth("pathway");
  const leftPct = (x / width) * 100;
  return (
    <div
      className="world-start-node"
      style={{ left: `${leftPct}%`, top: y }}
      aria-label={label}
    >
      <motion.div
        className="world-start-node__orb"
        animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="world-start-node__ring" aria-hidden />
      <span className="world-start-node__label">{label}</span>
    </div>
  );
}
