import { useMemo } from "react";
import type { PathwayBiome } from "../../world/pathwayBiomes";
import type { EmotionZone } from "../../world/buildEmotionZones";

export type { EmotionZone };

type PixelSeed = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  square: boolean;
};

const PIXEL_SEEDS: PixelSeed[] = [
  { left: 4, top: 6, size: 2, delay: 0, duration: 38, square: true },
  { left: 11, top: 14, size: 3, delay: -4, duration: 44, square: false },
  { left: 18, top: 22, size: 2, delay: -9, duration: 52, square: true },
  { left: 26, top: 9, size: 2, delay: -2, duration: 41, square: true },
  { left: 33, top: 31, size: 3, delay: -14, duration: 48, square: false },
  { left: 41, top: 18, size: 2, delay: -7, duration: 55, square: true },
  { left: 48, top: 42, size: 2, delay: -11, duration: 46, square: true },
  { left: 55, top: 27, size: 3, delay: -5, duration: 50, square: false },
  { left: 62, top: 52, size: 2, delay: -18, duration: 58, square: true },
  { left: 69, top: 38, size: 2, delay: -3, duration: 43, square: true },
  { left: 76, top: 61, size: 3, delay: -12, duration: 47, square: false },
  { left: 83, top: 45, size: 2, delay: -8, duration: 53, square: true },
  { left: 90, top: 72, size: 2, delay: -16, duration: 49, square: true },
  { left: 7, top: 58, size: 3, delay: -6, duration: 45, square: false },
  { left: 14, top: 78, size: 2, delay: -20, duration: 56, square: true },
  { left: 22, top: 66, size: 2, delay: -10, duration: 42, square: true },
  { left: 36, top: 84, size: 3, delay: -13, duration: 51, square: false },
  { left: 44, top: 71, size: 2, delay: -1, duration: 39, square: true },
  { left: 58, top: 88, size: 2, delay: -15, duration: 54, square: true },
  { left: 71, top: 79, size: 3, delay: -9, duration: 48, square: false },
  { left: 86, top: 92, size: 2, delay: -17, duration: 57, square: true },
  { left: 52, top: 12, size: 2, delay: -22, duration: 60, square: true },
  { left: 64, top: 8, size: 2, delay: -4, duration: 40, square: true },
  { left: 3, top: 35, size: 3, delay: -11, duration: 46, square: false },
  { left: 96, top: 24, size: 2, delay: -7, duration: 44, square: true },
  { left: 28, top: 48, size: 2, delay: -19, duration: 52, square: true },
  { left: 79, top: 55, size: 3, delay: -5, duration: 47, square: false },
  { left: 12, top: 92, size: 2, delay: -14, duration: 50, square: true },
  { left: 45, top: 58, size: 2, delay: -8, duration: 43, square: true },
  { left: 88, top: 8, size: 2, delay: -21, duration: 55, square: true },
  { left: 38, top: 95, size: 3, delay: -3, duration: 41, square: false },
];

type Props = {
  mapHeight: number;
  zones: EmotionZone[];
  activeBiome: PathwayBiome;
  pointerX?: number;
  pointerY?: number;
};

/** Scroll-tall living field — biome emotion bands + pixel motion. */
export function CurriculumMapEnvironment({ mapHeight, zones, activeBiome, pointerX = 50, pointerY = 50 }: Props) {
  const particles = useMemo(() => PIXEL_SEEDS, []);

  return (
    <div
      className={`cmap-env ${activeBiome.className}`}
      style={{
        height: mapHeight,
        ["--env-accent" as string]: activeBiome.accent,
        ["--env-accent-2" as string]: activeBiome.accentSecondary,
        ["--pointer-x" as string]: `${pointerX}%`,
        ["--pointer-y" as string]: `${pointerY}%`,
      }}
      aria-hidden
    >
      <div className="cmap-env__void" />

      {zones.map((z) => (
        <div
          key={`${z.className}-${z.topPct}`}
          className={`cmap-env__emotion-band ${z.className}`}
          style={{
            top: `${z.topPct}%`,
            height: `${z.heightPct}%`,
            ["--band-accent" as string]: z.accent,
            ["--band-accent-2" as string]: z.accentSecondary,
          }}
        >
          <span className="cmap-env__emotion-label">{z.label}</span>
        </div>
      ))}

      <div className="cmap-env__pixel-grid" />
      <div className="cmap-env__scanlines" />
      <div className="cmap-env__neural-veins" />

      <div className="cmap-env__diffusion cmap-env__diffusion--a" />
      <div className="cmap-env__diffusion cmap-env__diffusion--b" />
      <div className="cmap-env__diffusion cmap-env__diffusion--c" />

      <div className="cmap-env__particles">
        {particles.map((p, i) => (
          <span
            key={i}
            className={p.square ? "cmap-env__pixel" : "cmap-env__spark"}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="cmap-env__interactive-glow" />
    </div>
  );
}
