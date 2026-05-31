import { motion, type MotionValue } from "framer-motion";
import type { PathwayBiome } from "../../world/pathwayBiomes";

type Props = {
  biome: PathwayBiome;
  parallaxX: MotionValue<string>;
  parallaxY: MotionValue<string>;
  parallaxMid: MotionValue<string>;
  /** Fewer particles when map is zoomed out for readability */
  particleCount?: number;
};

export function PathwayDepthLayers({
  biome,
  parallaxX,
  parallaxY,
  parallaxMid,
  particleCount = 14,
}: Props) {
  return (
    <>
      <div className="pathway-layer pathway-layer--deep" aria-hidden>
        <motion.div className="pathway-deep__stars" style={{ x: parallaxX }} />
        <motion.div className="pathway-deep__geometry" style={{ x: parallaxY }} />
        <div className="pathway-deep__fog" style={{ background: biome.fog }} />
      </div>

      <motion.div
        className={`pathway-layer pathway-layer--bg pathway-biome-visual ${biome.className}`}
        style={{ x: parallaxMid }}
        aria-hidden
      >
        <div className="pathway-biome-visual__core" />
        <div className="pathway-biome-visual__structures" />
      </motion.div>

      <div className="pathway-layer pathway-layer--fg pathway-layer--fg-subtle" aria-hidden>
        {Array.from({ length: particleCount }).map((_, i) => (
          <span
            key={i}
            className="pathway-fg-particle"
            style={{
              ["--i" as string]: String(i),
              ["--c" as string]: biome.particle,
              left: `${(i * 13 + 7) % 92}%`,
              top: `${(i * 19 + 3) % 98}%`,
            }}
          />
        ))}
      </div>
    </>
  );
}
