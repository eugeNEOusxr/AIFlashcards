import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from "react";
import type { FrameMapModel } from "../../engine/frameMapModel";
import { getModuleForLandmark } from "../../content/frames/registry";
import { completedFrameCount } from "../../memory/frameProgress";
import { getSubjectProfile } from "../../world/subjectProfiles";
import { SubjectReviewSidebar } from "./SubjectReviewSidebar";
import { resolveEducationalTier } from "../../cognitive/tierResolver";
import { getPathwayBiome } from "../../world/pathwayBiomes";
import {
  landmarkById,
  LANDMARK_FLOW_ORDER,
  LANDMARK_SLOTS,
  PHYSICS_MODULE_LANDMARKS,
  physicsModuleMapHeight,
  physicsModuleMapWidth,
  START_SLOT,
  startPixelPosition,
  startToMotionTunnelD,
  landmarkTunnelEntry,
  landmarkTunnelExit,
  motionToForcesTunnelEndpoints,
  type LandmarkSlot,
  type PhysicsModuleLandmarkId,
} from "../../world/physicsModuleLandmarks";
import { tunnelPathD } from "../../world/serpentineLayout";
import { progressionFlowPalette, progressionPaletteStyle } from "../../world/tunnelProgressionPalette";
import { useScrollMotionVars } from "../../hooks/useScrollMotionVars";
import type { TunnelSegmentState } from "./ModuleTunnelProgression";
import type { NavScreen, SubjectId } from "../../world/types";
import { MapLayerNav } from "./MapLayerNav";
import { PhysicsModuleWorldEnvironment } from "./PhysicsModuleWorldEnvironment";
import { ModuleWorldStart } from "./ModuleWorldStart";
import { PhysicsModuleLandmarkNode } from "./PhysicsModuleLandmarkNode";
import type { LandmarkNodeData } from "./physicsModuleLandmarkTypes";
import {
  ModuleTunnelProgression,
  useTunnelUnlockPulse,
  type ModuleTunnelSegment,
} from "./ModuleTunnelProgression";

type Props = {
  subjectId: SubjectId;
  nav: NavScreen;
  mapModel: FrameMapModel;
  onNavigate: (screen: NavScreen) => void;
  onEnterLandmark: (landmarkId: PhysicsModuleLandmarkId) => void;
};

function tunnelStateBetween(
  from: ReturnType<FrameMapModel["landmarkVisualState"]>,
  to: ReturnType<FrameMapModel["landmarkVisualState"]>
): TunnelSegmentState {
  if (to === "locked" || from === "locked") return "dormant";
  if (from === "mastered" && (to === "mastered" || to === "active" || to === "next" || to === "unlocked")) {
    return "completed";
  }
  if (from === "mastered" || from === "active") return to === "next" ? "next" : "active";
  if (to === "next") return "next";
  return "future";
}

/** Slot cx/cy are map-center anchors — nodes and tunnels share the same point */
function landmarkPositionStyle(slot: LandmarkSlot): CSSProperties {
  return {
    top: slot.cy * physicsModuleMapHeight(),
    left: `${slot.cx * 100}%`,
  };
}

function parallaxRateForSlot(slot: LandmarkSlot): number {
  return 0.04 + slot.depth * 0.012;
}

export function PhysicsModuleWorldMap({
  nav,
  mapModel,
  onNavigate,
  onEnterLandmark,
}: Props) {
  const profile = getSubjectProfile("physics");
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const parallaxMapRef = useRef<Map<string, HTMLElement>>(new Map());
  const landmarkNodesRef = useRef<LandmarkNodeData[]>([]);

  const mapWidth = physicsModuleMapWidth();
  const mapHeight = physicsModuleMapHeight();
  const activeId = mapModel.activeLandmarkId();
  const startBiome = getPathwayBiome(profile.defaultPathwayId);
  const activeBiome = getPathwayBiome(
    activeId ? landmarkById(activeId as PhysicsModuleLandmarkId).biomeId : profile.defaultPathwayId
  );

  const landmarkNodes = useMemo((): LandmarkNodeData[] => {
    return PHYSICS_MODULE_LANDMARKS.map((lm) => {
      const slot = LANDMARK_SLOTS.find((s) => s.id === lm.id)!;
      const visual = mapModel.landmarkVisualState(lm.id);
      const frameCount = mapModel.frameCountForLandmark(lm.id);
      return {
        id: lm.id,
        title: lm.title,
        tagline: lm.tagline,
        slot,
        visual,
        biome: getPathwayBiome(lm.biomeId),
        frameBadge:
          frameCount > 0
            ? `${frameCount} learning frame${frameCount === 1 ? "" : "s"}`
            : "Coming soon",
        canEnter: mapModel.canEnterLandmark(lm.id) && getModuleForLandmark(lm.id, "physics") !== null,
        isIgniting: false,
      };
    });
  }, [mapModel]);

  landmarkNodesRef.current = landmarkNodes;

  const landmarkVisuals = useMemo(() => {
    const v = {} as Record<PhysicsModuleLandmarkId, string>;
    for (const entry of landmarkNodes) {
      v[entry.id] = entry.visual;
    }
    return v;
  }, [landmarkNodes]);

  const unlockPulse = useTunnelUnlockPulse(landmarkVisuals, LANDMARK_FLOW_ORDER);

  const landmarkNodesWithPulse = useMemo(
    () =>
      landmarkNodes.map((n) => ({
        ...n,
        isIgniting: unlockPulse.ignitingLandmarkId === n.id,
      })),
    [landmarkNodes, unlockPulse.ignitingLandmarkId]
  );

  const masteredLandmarkCount = landmarkNodes.filter((l) => l.visual === "mastered").length;
  const tier = resolveEducationalTier(masteredLandmarkCount);

  const tunnelSegments: ModuleTunnelSegment[] = useMemo(() => {
    const segs: ModuleTunnelSegment[] = [];
    const motionSlot = LANDMARK_SLOTS.find((s) => s.id === "motion")!;
    const motionVisual = mapModel.landmarkVisualState("motion");
    segs.push({
      key: "start-motion",
      d: startToMotionTunnelD(motionSlot),
      state:
        motionVisual === "locked"
          ? "dormant"
          : motionVisual === "mastered"
            ? "completed"
            : motionVisual === "next"
              ? "next"
              : "active",
      toLandmarkId: "motion",
    });

    for (let i = 0; i < LANDMARK_FLOW_ORDER.length - 1; i++) {
      const fromId = LANDMARK_FLOW_ORDER[i]!;
      const toId = LANDMARK_FLOW_ORDER[i + 1]!;
      const fromSlot = LANDMARK_SLOTS.find((s) => s.id === fromId)!;
      const toSlot = LANDMARK_SLOTS.find((s) => s.id === toId)!;
      const { from: fromPos, to: toPos } =
        fromId === "motion" && toId === "forces"
          ? motionToForcesTunnelEndpoints(fromSlot, toSlot)
          : {
              from: landmarkTunnelExit(fromSlot),
              to: landmarkTunnelEntry(toSlot),
            };
      segs.push({
        key: `${fromId}-${toId}`,
        d: tunnelPathD(
          { x: fromPos.cx, y: fromPos.cy },
          { x: toPos.cx, y: toPos.cy },
          "subject"
        ),
        state: tunnelStateBetween(
          mapModel.landmarkVisualState(fromId),
          mapModel.landmarkVisualState(toId)
        ),
        toLandmarkId: toId,
      });
    }
    return segs;
  }, [mapModel]);

  const flowPalette = useMemo(
    () => progressionFlowPalette(tier, masteredLandmarkCount, PHYSICS_MODULE_LANDMARKS.length),
    [tier, masteredLandmarkCount]
  );

  const envLandmarks = useMemo(
    () =>
      landmarkNodes.map((entry) => ({
        id: entry.id,
        topPct: entry.slot.cy * 100,
        biome: entry.biome,
      })),
    [landmarkNodes]
  );

  const parallaxTransform = useCallback((id: string, scrollTop: number) => {
    const entry = landmarkNodesRef.current.find((n) => n.id === id);
    if (!entry) return null;
    const y = -scrollTop * parallaxRateForSlot(entry.slot);
    return `translate3d(0, ${y}px, 0)`;
  }, []);

  useScrollMotionVars(scrollRef, canvasRef, {
    parallaxTargets: parallaxMapRef,
    parallaxTransform,
    trackPointer: true,
  });

  const setParallaxRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) parallaxMapRef.current.set(id, el);
      else parallaxMapRef.current.delete(id);
    },
    []
  );

  useEffect(() => {
    const el = activeRef.current;
    const root = scrollRef.current;
    if (!el || !root) return;
    const top = el.offsetTop - root.clientHeight * 0.32;
    root.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [activeId]);

  const startPos = startPixelPosition();

  const reviewRefreshKey = useMemo(() => {
    let count = 0;
    for (const id of LANDMARK_FLOW_ORDER) {
      const mod = getModuleForLandmark(id, "physics");
      if (mod) count += completedFrameCount(mod.id);
    }
    return count;
  }, [landmarkNodes]);

  return (
    <div className="physics-module-world">
      <MapLayerNav screen={nav} onNavigate={onNavigate} moodLabel="Knowledge universe" />

      <div className="physics-module-world__body">
        <div ref={scrollRef} className="physics-module-world__scroll">
        <div
          ref={canvasRef}
          className="physics-module-world__canvas"
          style={
            {
              ["--map-width" as string]: `${mapWidth}px`,
              ["--map-height" as string]: `${mapHeight}px`,
              ...progressionPaletteStyle(flowPalette),
            } as CSSProperties
          }
        >
          <PhysicsModuleWorldEnvironment
            mapWidth={mapWidth}
            mapHeight={mapHeight}
            activeBiome={activeBiome}
            landmarks={envLandmarks}
            envClassPrefix={profile.envClassPrefix}
          />

          <div className="physics-module-world__region-label">
            <span className="physics-module-world__region-kicker">{profile.mapRegionKicker}</span>
            <span className="physics-module-world__region-title">{profile.mapRegionTitle}</span>
          </div>

          <ModuleTunnelProgression
            mapWidth={mapWidth}
            mapHeight={mapHeight}
            segments={tunnelSegments}
            tier={tier}
            masteredLandmarkCount={masteredLandmarkCount}
            totalLandmarks={PHYSICS_MODULE_LANDMARKS.length}
            activatingSegmentIndex={unlockPulse.segmentIndex}
          />

          <div
            className="physics-module-world__start"
            style={{
              top: startPos.cy,
              left: `${START_SLOT.cx * 100}%`,
            }}
          >
            <div className="physics-module-world__start-shift">
              <ModuleWorldStart
                accent={startBiome.accent}
                accentSecondary={startBiome.accentSecondary}
                kicker={profile.startOrb.kicker}
                title={profile.startOrb.title}
                subtitle={profile.startOrb.subtitle}
                ariaLabel={profile.startOrb.ariaLabel}
              />
            </div>
          </div>

          {landmarkNodesWithPulse.map((entry) => (
            <PhysicsModuleLandmarkNode
              key={entry.id}
              entry={entry}
              positionStyle={landmarkPositionStyle(entry.slot)}
              zIndex={14 + entry.slot.depth}
              parallaxRef={setParallaxRef(entry.id)}
              anchorRef={entry.id === activeId ? activeRef : undefined}
              onEnter={(id) => onEnterLandmark(id as PhysicsModuleLandmarkId)}
            />
          ))}
        </div>
        </div>

        <SubjectReviewSidebar subjectId="physics" refreshKey={reviewRefreshKey} />
      </div>

      <footer className="physics-module-world__legend" aria-label="Map legend">
        <span className="physics-module-world__legend-item physics-module-world__legend-item--done">
          Illuminated path
        </span>
        <span className="physics-module-world__legend-item physics-module-world__legend-item--active">
          Active zone
        </span>
        <span className="physics-module-world__legend-item physics-module-world__legend-item--future">
          Ahead
        </span>
      </footer>
    </div>
  );
}
