import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from "react";
import type { FrameMapModel } from "../../engine/frameMapModel";
import { getModuleForLandmark } from "../../content/frames/registry";
import { completedFrameCount } from "../../memory/frameProgress";
import { getQuestionBankStats } from "../../content/curriculum/questionBank";
import { getSubjectProfile } from "../../world/subjectProfiles";
import { CognitiveMindBadge } from "./CognitiveMindBadge";
import { SubjectReviewSidebar } from "./SubjectReviewSidebar";
import { resolveEducationalTier } from "../../cognitive/tierResolver";
import { getPathwayBiome } from "../../world/pathwayBiomes";
import {
  biologyLandmarkById,
  BIOLOGY_LANDMARK_FLOW_ORDER,
  BIOLOGY_LANDMARK_SLOTS,
  BIOLOGY_MODULE_LANDMARKS,
  biologyModuleMapHeight,
  biologyModuleMapWidth,
  BIOLOGY_START_SLOT,
  biologyStartPixelPosition,
  startToCellsTunnelD,
  biologyLandmarkTunnelEntry,
  biologyLandmarkTunnelExit,
  cellsToOrganismsTunnelEndpoints,
  type BiologyLandmarkSlot,
  type BiologyModuleLandmarkId,
} from "../../world/biologyModuleLandmarks";
import { tunnelPathD } from "../../world/serpentineLayout";
import { progressionFlowPalette, progressionPaletteStyle } from "../../world/tunnelProgressionPalette";
import { useCompactTouchUI } from "../../hooks/useCompactTouchUI";
import { useScrollMotionVars } from "../../hooks/useScrollMotionVars";
import type { TunnelSegmentState } from "./ModuleTunnelProgression";
import type { NavScreen } from "../../world/types";
import { MapLayerNav } from "./MapLayerNav";
import { PhysicsModuleWorldEnvironment } from "./PhysicsModuleWorldEnvironment";
import { ModuleWorldStart } from "./ModuleWorldStart";
import { PhysicsModuleLandmarkNode } from "./PhysicsModuleLandmarkNode";
import type { BiologyLandmarkNodeData } from "./biologyModuleLandmarkTypes";
import {
  ModuleTunnelProgression,
  useTunnelUnlockPulse,
  type ModuleTunnelSegment,
} from "./ModuleTunnelProgression";

type Props = {
  nav: NavScreen;
  mapModel: FrameMapModel;
  onNavigate: (screen: NavScreen) => void;
  onEnterLandmark: (landmarkId: BiologyModuleLandmarkId) => void;
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

function landmarkPositionStyle(slot: BiologyLandmarkSlot): CSSProperties {
  return {
    top: slot.cy * biologyModuleMapHeight(),
    left: `${slot.cx * 100}%`,
  };
}

function parallaxRateForSlot(slot: BiologyLandmarkSlot): number {
  return 0.04 + slot.depth * 0.012;
}

export function BiologyModuleWorldMap({
  nav,
  mapModel,
  onNavigate,
  onEnterLandmark,
}: Props) {
  const profile = getSubjectProfile("biology");
  const questionBank = getQuestionBankStats("biology");
  const compactTouch = useCompactTouchUI();
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const parallaxMapRef = useRef<Map<string, HTMLElement>>(new Map());
  const landmarkNodesRef = useRef<BiologyLandmarkNodeData[]>([]);

  const mapWidth = biologyModuleMapWidth();
  const mapHeight = biologyModuleMapHeight();
  const activeId = mapModel.activeLandmarkId();
  const startBiome = getPathwayBiome(profile.defaultPathwayId);
  const activeBiome = getPathwayBiome(
    activeId
      ? biologyLandmarkById(activeId as BiologyModuleLandmarkId).biomeId
      : profile.defaultPathwayId
  );

  const landmarkNodes = useMemo((): BiologyLandmarkNodeData[] => {
    return BIOLOGY_MODULE_LANDMARKS.map((lm) => {
      const slot = BIOLOGY_LANDMARK_SLOTS.find((s) => s.id === lm.id)!;
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
        canEnter: mapModel.canEnterLandmark(lm.id) && getModuleForLandmark(lm.id, "biology") !== null,
        isIgniting: false,
      };
    });
  }, [mapModel]);

  landmarkNodesRef.current = landmarkNodes;

  const landmarkVisuals = useMemo(() => {
    const v = {} as Record<BiologyModuleLandmarkId, string>;
    for (const entry of landmarkNodes) {
      v[entry.id] = entry.visual;
    }
    return v;
  }, [landmarkNodes]);

  const unlockPulse = useTunnelUnlockPulse(landmarkVisuals, BIOLOGY_LANDMARK_FLOW_ORDER);

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
    const cellsSlot = BIOLOGY_LANDMARK_SLOTS.find((s) => s.id === "cells")!;
    const cellsVisual = mapModel.landmarkVisualState("cells");
    segs.push({
      key: "start-cells",
      d: startToCellsTunnelD(cellsSlot),
      state:
        cellsVisual === "locked"
          ? "dormant"
          : cellsVisual === "mastered"
            ? "completed"
            : cellsVisual === "next"
              ? "next"
              : "active",
      toLandmarkId: "cells",
    });

    for (let i = 0; i < BIOLOGY_LANDMARK_FLOW_ORDER.length - 1; i++) {
      const fromId = BIOLOGY_LANDMARK_FLOW_ORDER[i]!;
      const toId = BIOLOGY_LANDMARK_FLOW_ORDER[i + 1]!;
      const fromSlot = BIOLOGY_LANDMARK_SLOTS.find((s) => s.id === fromId)!;
      const toSlot = BIOLOGY_LANDMARK_SLOTS.find((s) => s.id === toId)!;
      const { from: fromPos, to: toPos } =
        fromId === "cells" && toId === "organisms"
          ? cellsToOrganismsTunnelEndpoints(fromSlot, toSlot)
          : {
              from: biologyLandmarkTunnelExit(fromSlot),
              to: biologyLandmarkTunnelEntry(toSlot),
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
    () => progressionFlowPalette(tier, masteredLandmarkCount, BIOLOGY_MODULE_LANDMARKS.length),
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
    enabled: !compactTouch,
    parallaxTargets: parallaxMapRef,
    parallaxTransform,
    trackPointer: !compactTouch,
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
    root.scrollTo({ top: Math.max(0, top), behavior: compactTouch ? "instant" : "smooth" });
  }, [activeId, compactTouch]);

  const startPos = biologyStartPixelPosition();

  const reviewRefreshKey = useMemo(() => {
    let count = 0;
    for (const id of BIOLOGY_LANDMARK_FLOW_ORDER) {
      const mod = getModuleForLandmark(id, "biology");
      if (mod) count += completedFrameCount(mod.id);
    }
    return count;
  }, [landmarkNodes]);

  return (
    <div className="biology-module-world">
      <MapLayerNav screen={nav} onNavigate={onNavigate} moodLabel="Cognitive mind" />

      <div className="biology-module-world__body">
        <div ref={scrollRef} className="biology-module-world__scroll">
          <div
            ref={canvasRef}
            className="biology-module-world__canvas"
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

            <div className="biology-module-world__region-label">
              <span className="biology-module-world__region-kicker">{profile.mapRegionKicker}</span>
              <span className="biology-module-world__region-title">{profile.mapRegionTitle}</span>
            </div>

            <ModuleTunnelProgression
              mapWidth={mapWidth}
              mapHeight={mapHeight}
              segments={tunnelSegments}
              tier={tier}
              masteredLandmarkCount={masteredLandmarkCount}
              totalLandmarks={BIOLOGY_MODULE_LANDMARKS.length}
              activatingSegmentIndex={unlockPulse.segmentIndex}
            />

            <div
              className="biology-module-world__start"
              style={{
                top: startPos.cy,
                left: `${BIOLOGY_START_SLOT.cx * 100}%`,
              }}
            >
              <div className="biology-module-world__start-shift">
                <ModuleWorldStart
                  accent={startBiome.accent}
                  accentSecondary={startBiome.accentSecondary}
                  kicker={profile.cognitiveMindKicker}
                  title={profile.startOrb.title}
                  subtitle={profile.startOrb.subtitle}
                  ariaLabel={profile.startOrb.ariaLabel}
                  mindBadge={
                    questionBank ? <CognitiveMindBadge stats={questionBank} size="sm" /> : undefined
                  }
                />
              </div>
            </div>

            {landmarkNodesWithPulse.map((entry) => (
              <PhysicsModuleLandmarkNode
                key={entry.id}
                entry={entry as unknown as import("./physicsModuleLandmarkTypes").LandmarkNodeData}
                mapClassPrefix="biology-module-world"
                positionStyle={landmarkPositionStyle(entry.slot)}
                zIndex={14 + entry.slot.depth}
                parallaxRef={setParallaxRef(entry.id)}
                anchorRef={entry.id === activeId ? activeRef : undefined}
                onEnter={(id) => onEnterLandmark(id as BiologyModuleLandmarkId)}
              />
            ))}
          </div>
        </div>

        <SubjectReviewSidebar subjectId="biology" refreshKey={reviewRefreshKey} />
      </div>

      <footer className="biology-module-world__legend" aria-label="Map legend">
        <span className="biology-module-world__legend-item biology-module-world__legend-item--done">
          Illuminated path
        </span>
        <span className="biology-module-world__legend-item biology-module-world__legend-item--active">
          Active zone
        </span>
        <span className="biology-module-world__legend-item biology-module-world__legend-item--future">
          Ahead
        </span>
      </footer>
    </div>
  );
}
