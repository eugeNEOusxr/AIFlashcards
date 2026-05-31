import { useEffect, useMemo, useRef, useState } from "react";
import type { EducationalTier } from "../../cognitive/types";
import type { ProgressionFlowPalette } from "../../world/tunnelProgressionPalette";
import { progressionFlowPalette } from "../../world/tunnelProgressionPalette";
import type { PhysicsModuleLandmarkId } from "../../world/physicsModuleLandmarks";

export type TunnelSegmentState = "completed" | "active" | "next" | "future" | "dormant";

export type ModuleTunnelSegment = {
  key: string;
  d: string;
  state: TunnelSegmentState;
  toLandmarkId: PhysicsModuleLandmarkId;
};

type Props = {
  mapWidth: number;
  mapHeight: number;
  segments: ModuleTunnelSegment[];
  tier: EducationalTier;
  masteredLandmarkCount: number;
  totalLandmarks: number;
  activatingSegmentIndex: number | null;
};

/** Low-density carriers — path-locked via animateMotion only */
const FLOW_PARTICLE_SLOTS = [
  { begin: 0, dur: 5.2, r: 2.4, trailDelay: 0.45 },
  { begin: 1.2, dur: 5.8, r: 2.1, trailDelay: 0.5 },
  { begin: 2.5, dur: 5.4, r: 2.2, trailDelay: 0.42 },
  { begin: 3.6, dur: 6.1, r: 2, trailDelay: 0.48 },
] as const;

function segmentFlows(state: TunnelSegmentState): boolean {
  return state === "completed" || state === "active" || state === "next";
}

export function ModuleTunnelProgression({
  mapWidth,
  mapHeight,
  segments,
  tier,
  masteredLandmarkCount,
  totalLandmarks,
  activatingSegmentIndex,
}: Props) {
  const palette = useMemo(
    () => progressionFlowPalette(tier, masteredLandmarkCount, totalLandmarks),
    [tier, masteredLandmarkCount, totalLandmarks]
  );

  return (
    <svg
      className="module-tunnel-progression"
      viewBox={`0 0 ${mapWidth} ${mapHeight}`}
      preserveAspectRatio="xMidYMin meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="module-tunnel-tube" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.tubePrimary} stopOpacity="0.95" />
          <stop offset="100%" stopColor={palette.tubeSecondary} stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id="module-tunnel-ghost" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748b" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0.16" />
        </linearGradient>
        <filter id="module-tunnel-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="module-particle-bloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="module-particle-halo" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {segments.map((seg, i) => (
        <TunnelSegmentGroup
          key={seg.key}
          segment={seg}
          palette={palette}
          isActivating={activatingSegmentIndex === i}
          flowIntensity={
            seg.state === "next" || activatingSegmentIndex === i
              ? 1
              : seg.state === "active"
                ? 0.88
                : 0.7
          }
        />
      ))}
    </svg>
  );
}

function PathFlowParticle({
  pathD,
  palette,
  slot,
  fast,
}: {
  pathD: string;
  palette: ProgressionFlowPalette;
  slot: (typeof FLOW_PARTICLE_SLOTS)[number];
  fast?: boolean;
}) {
  const dur = fast ? slot.dur * 0.55 : slot.dur;
  const beginMain = `${slot.begin}s`;
  const beginTrail = `${slot.begin + slot.trailDelay}s`;

  return (
    <g className="module-tunnel-seg__flow-particle">
      <circle r={slot.r * 2.2} fill={palette.particle} opacity="0.22" filter="url(#module-particle-halo)">
        <animateMotion dur={`${dur}s`} begin={beginMain} repeatCount="indefinite" path={pathD} rotate="auto" />
      </circle>
      <circle r={slot.r * 1.35} fill={palette.particle} opacity="0.38" filter="url(#module-particle-bloom)">
        <animateMotion dur={`${dur}s`} begin={beginTrail} repeatCount="indefinite" path={pathD} rotate="auto" />
      </circle>
      <circle r={slot.r} fill={palette.particleCore} filter="url(#module-particle-bloom)">
        <animateMotion dur={`${dur}s`} begin={beginMain} repeatCount="indefinite" path={pathD} rotate="auto" />
      </circle>
    </g>
  );
}

function TunnelSegmentGroup({
  segment,
  palette,
  isActivating,
  flowIntensity,
}: {
  segment: ModuleTunnelSegment;
  palette: ProgressionFlowPalette;
  isActivating: boolean;
  flowIntensity: number;
}) {
  const { d, state } = segment;
  const live = segmentFlows(state);
  const dim = !live;
  const isForwardCorridor = state === "next" || isActivating;

  const particleCount = isForwardCorridor
    ? FLOW_PARTICLE_SLOTS.length
    : live
      ? 3
      : 0;

  return (
    <g
      className={[
        "module-tunnel-seg",
        `module-tunnel-seg--${state}`,
        isActivating ? "module-tunnel-seg--activating" : "",
        isForwardCorridor ? "module-tunnel-seg--forward" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ["--flow-intensity" as string]: String(flowIntensity) }}
    >
      <path
        className="module-tunnel-seg__tube"
        d={d}
        fill="none"
        stroke={live ? "url(#module-tunnel-tube)" : "url(#module-tunnel-ghost)"}
        strokeWidth={live ? 16 : 8}
        strokeLinecap="round"
        filter={live ? "url(#module-tunnel-soft-glow)" : undefined}
        opacity={dim ? (state === "future" ? 0.45 : 0.3) : isActivating ? undefined : 0.9}
      />

      {live ? (
        <path
          className="module-tunnel-seg__core"
          d={d}
          fill="none"
          stroke={palette.coreStroke}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      ) : null}

      {isForwardCorridor && live ? (
        <path
          className="module-tunnel-seg__flow-dash"
          d={d}
          fill="none"
          stroke={palette.pulse}
          strokeWidth={2}
          strokeLinecap="round"
          pathLength={100}
          opacity="0.5"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="100;0"
            dur={isActivating ? "2.4s" : "4.5s"}
            repeatCount={isActivating ? "1" : "indefinite"}
          />
        </path>
      ) : null}

      {isActivating ? (
        <>
          <path
            className="module-tunnel-seg__unlock-stroke"
            d={d}
            fill="none"
            stroke={palette.pulse}
            strokeWidth={3}
            strokeLinecap="round"
            pathLength={100}
          />
          <circle r="6" fill={palette.pulse} filter="url(#module-particle-bloom)" opacity="0.95">
            <animateMotion
              dur="2.4s"
              repeatCount="1"
              fill="freeze"
              path={d}
              calcMode="spline"
              keySplines="0.35 0 0.15 1"
              keyTimes="0;1"
              keyPoints="0;1"
            />
            <animate attributeName="opacity" values="0.95;0.5;0" dur="2.4s" repeatCount="1" fill="freeze" />
            <animate attributeName="r" values="6;3.5;1" dur="2.4s" repeatCount="1" fill="freeze" />
          </circle>
          {FLOW_PARTICLE_SLOTS.slice(0, 2).map((slot, pi) => (
            <PathFlowParticle key={`burst-${pi}`} pathD={d} palette={palette} slot={slot} fast />
          ))}
        </>
      ) : null}

      {live
        ? FLOW_PARTICLE_SLOTS.slice(0, particleCount).map((slot, pi) => (
            <PathFlowParticle key={pi} pathD={d} palette={palette} slot={slot} fast={isActivating} />
          ))
        : null}
    </g>
  );
}

export type UnlockPulseState = {
  segmentIndex: number | null;
  ignitingLandmarkId: PhysicsModuleLandmarkId | null;
};

export function useTunnelUnlockPulse(
  landmarkVisuals: Record<PhysicsModuleLandmarkId, string>,
  flowOrder: PhysicsModuleLandmarkId[]
): UnlockPulseState {
  const [pulse, setPulse] = useState<UnlockPulseState>({
    segmentIndex: null,
    ignitingLandmarkId: null,
  });
  const prevRef = useRef<Record<string, string>>({});
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    for (let i = 1; i < flowOrder.length; i++) {
      const id = flowOrder[i]!;
      const prev = prevRef.current[id];
      const cur = landmarkVisuals[id];
      if (prev === "locked" && (cur === "next" || cur === "unlocked" || cur === "active")) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        setPulse({ segmentIndex: i - 1, ignitingLandmarkId: id });
        timerRef.current = window.setTimeout(() => {
          setPulse({ segmentIndex: null, ignitingLandmarkId: null });
        }, 2800);
        break;
      }
    }
    prevRef.current = { ...landmarkVisuals };
  }, [landmarkVisuals, flowOrder]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    []
  );

  return pulse;
}
