import { memo, useMemo } from "react";
import type { PathwayBiome } from "../../world/pathwayBiomes";
type LandmarkZone = {
  id: string;
  topPct: number;
  biome: PathwayBiome;
};

type Props = {
  mapHeight: number;
  mapWidth: number;
  activeBiome: PathwayBiome;
  landmarks: LandmarkZone[];
  envClassPrefix?: string;
};

const AMBIENT_SHAPES = [
  { left: "8%", top: "12%", w: 120, h: 120, rot: 12, delay: 0 },
  { left: "72%", top: "22%", w: 90, h: 90, rot: -18, delay: 1.2 },
  { left: "18%", top: "48%", w: 140, h: 60, rot: 8, delay: 0.6 },
  { left: "65%", top: "58%", w: 100, h: 100, rot: -10, delay: 2 },
  { left: "42%", top: "72%", w: 160, h: 50, rot: 4, delay: 1.8 },
  { left: "12%", top: "78%", w: 80, h: 80, rot: 22, delay: 2.4 },
];

function PhysicsModuleWorldEnvironmentInner({
  mapHeight,
  mapWidth,
  activeBiome,
  landmarks,
  envClassPrefix = "physics-module-env",
}: Props) {
  const e = envClassPrefix;
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 11) % 94}%`,
        top: `${(i * 23 + 7) % 92}%`,
        size: 2 + (i % 3),
        delay: (i % 7) * 0.7,
        dur: 14 + (i % 5) * 2,
      })),
    []
  );

  return (
    <div
      className={`${e} ${activeBiome.className}`}
      style={{
        height: mapHeight,
        width: mapWidth,
        ["--env-accent" as string]: activeBiome.accent,
        ["--env-accent-2" as string]: activeBiome.accentSecondary,
      }}
      aria-hidden
    >
      <div className={`${e}__sky`} />
      <div className={`${e}__grid ${e}__grid--far`} />
      <div className={`${e}__grid ${e}__grid--near`} />
      <div className={`${e}__aurora ${e}__aurora--a`} />
      <div className={`${e}__aurora ${e}__aurora--b`} />
      <div className={`${e}__haze ${e}__haze--far`} />
      <div className={`${e}__haze ${e}__haze--mid`} />

      <div className={`${e}__shapes`}>
        {AMBIENT_SHAPES.map((s) => (
          <span
            key={`${s.left}-${s.top}`}
            className={`${e}__shape`}
            style={{
              left: s.left,
              top: s.top,
              width: s.w,
              height: s.h,
              ["--shape-rot" as string]: `${s.rot}deg`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {landmarks.map((lm) => (
        <div
          key={lm.id}
          className={`${e}__glow-pool ${lm.biome.className}`}
          style={{
            top: `${lm.topPct}%`,
            left: ["energy", "change", "electricity", "cycles", "bonds"].includes(lm.id)
              ? lm.id === "energy" || lm.id === "change"
                ? "38%"
                : "58%"
              : "14%",
            ["--pool-accent" as string]: lm.biome.accent,
          }}
        />
      ))}

      <div className={`${e}__particles`}>
        {particles.map((p) => (
          <span
            key={p.id}
            className={`${e}__particle`}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      <div className={`${e}__horizon`} />
      <div className={`${e}__vignette`} />
    </div>
  );
}

export const PhysicsModuleWorldEnvironment = memo(PhysicsModuleWorldEnvironmentInner);
