import { useMemo } from "react";
import {
  layoutConfig,
  serpentinePoints,
  tunnelPathD,
  worldMapWidth,
  type MapLayoutPreset,
} from "../../world/serpentineLayout";
import type { PathwayBiome } from "../../world/pathwayBiomes";
import type { ModuleProgressState } from "../../world/types";

export type TunnelSegmentState = "completed" | "active" | "next" | "future" | "dormant";

type Props = {
  moduleCount: number;
  moduleStates: ModuleProgressState[];
  biome: PathwayBiome;
  gradientId: string;
  mapHeight: number;
  layoutPreset?: MapLayoutPreset;
};

/** Locked destinations shut tunnels off; unlocked/active/done engage energy flow. */
function segmentState(from: ModuleProgressState, to: ModuleProgressState): TunnelSegmentState {
  if (to === "locked" || from === "locked") return "dormant";
  if (to === "active") return "active";

  if (to === "done") {
    return from === "done" || from === "active" || from === "unlocked" ? "completed" : "active";
  }

  if (to === "unlocked") {
    if (from === "done") return "completed";
    if (from === "active" || from === "unlocked") return "active";
    return "dormant";
  }

  return "dormant";
}

function strokeMode(state: TunnelSegmentState): "live" | "ghost" | "off" {
  if (state === "dormant") return "off";
  if (state === "future" || state === "next") return "ghost";
  return "live";
}

export function PathwayTunnels({
  moduleCount,
  moduleStates,
  biome,
  gradientId,
  mapHeight,
  layoutPreset = "pathway",
}: Props) {
  const mapWidth = worldMapWidth(layoutPreset);
  const cfg = layoutConfig(layoutPreset);
  const ts = cfg.tunnelStrokeScale;
  const points = useMemo(() => serpentinePoints(moduleCount, layoutPreset), [moduleCount, layoutPreset]);

  const segments = useMemo(() => {
    const activeIndex = moduleStates.findIndex((s) => s === "active");
    const out: { d: string; state: TunnelSegmentState; key: string }[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const fromState: ModuleProgressState = i === 0 ? "unlocked" : (moduleStates[i - 1] ?? "locked");
      const toState: ModuleProgressState = moduleStates[i] ?? "locked";
      // Lighting rule:
      // - behind (<= active module): always show a "live" tunnel (never fully off)
      // - ahead (> active module): dim/ghost, even if modules are unlocked
      const ahead = activeIndex !== -1 && i > activeIndex;
      const nextStep = activeIndex !== -1 && i === activeIndex + 1;
      let state: TunnelSegmentState = ahead ? (nextStep ? "next" : "future") : segmentState(fromState, toState);
      if (!ahead && state === "dormant") state = "completed";

      out.push({
        key: `seg-${i}`,
        d: tunnelPathD(points[i], points[i + 1], layoutPreset),
        state,
      });
    }
    return out;
  }, [points, moduleStates, layoutPreset]);

  const blurAmount = layoutPreset === "subject" ? 4 : 5;

  return (
    <svg
      className="pathway-tunnels"
      viewBox={`0 0 ${mapWidth} ${mapHeight}`}
      preserveAspectRatio="xMidYMin meet"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${gradientId}-tube`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={biome.accent} stopOpacity="1" />
          <stop offset="50%" stopColor={biome.accentSecondary} stopOpacity="1" />
          <stop offset="100%" stopColor={biome.accent} stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id={`${gradientId}-glow`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={biome.accent} stopOpacity="0.85" />
          <stop offset="100%" stopColor={biome.accentSecondary} stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id={`${gradientId}-ghost`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0.28" />
        </linearGradient>
        <filter id={`${gradientId}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={blurAmount} />
        </filter>
        <filter id={`${gradientId}-curve`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {segments.map((seg) => {
        const mode = strokeMode(seg.state);
        const haloStroke = mode === "live" ? `url(#${gradientId}-glow)` : `url(#${gradientId}-ghost)`;
        const bodyStroke = mode === "live" ? `url(#${gradientId}-tube)` : `url(#${gradientId}-ghost)`;
        const haloW = (mode === "off" ? 6 : mode === "ghost" ? 14 : 36) * ts;
        const bodyW = (mode === "off" ? 3 : mode === "ghost" ? 9 : 17) * ts;
        const coreStroke =
          mode === "live" ? "rgba(255,255,255,0.95)" : mode === "ghost" ? "rgba(148,163,184,0.5)" : "rgba(71,85,105,0.25)";
        const coreW = (mode === "off" ? 1 : mode === "ghost" ? 2.5 : 3.5) * Math.max(ts, 0.75);

        return (
          <g key={seg.key} className={`pathway-tunnel pathway-tunnel--${seg.state}`}>
            <path
              className="pathway-tunnel__halo"
              d={seg.d}
              fill="none"
              stroke={haloStroke}
              strokeWidth={haloW}
              strokeLinecap="round"
              filter={mode === "live" ? `url(#${gradientId}-soft)` : undefined}
            />
            <path
              className="pathway-tunnel__body"
              d={seg.d}
              fill="none"
              stroke={bodyStroke}
              strokeWidth={bodyW}
              strokeLinecap="round"
              filter={mode === "live" ? `url(#${gradientId}-curve)` : undefined}
            />
            <path
              className="pathway-tunnel__core"
              d={seg.d}
              fill="none"
              stroke={coreStroke}
              strokeWidth={coreW}
              strokeLinecap="round"
              filter={mode === "live" ? `url(#${gradientId}-curve)` : undefined}
            />
            <path
              className="pathway-tunnel__flow"
              d={seg.d}
              fill="none"
              stroke={biome.accent}
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
