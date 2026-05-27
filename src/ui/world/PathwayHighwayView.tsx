import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ModuleNode } from "../../components/ModuleNode";
import { getModulesForPathway, getPathway } from "../../world/physicsWorld";
import { getPathwayBiome } from "../../world/pathwayBiomes";
import { moduleProgressForLesson } from "../../world/moduleProgress";
import { getChapterForPathway } from "../../content/chapterRegistry";
import {
  layoutConfig,
  serpentineSlots,
  startNodeCenter,
  worldMapHeight,
  worldMapWidth,
} from "../../world/serpentineLayout";
import type { LearningEngineModel } from "../../engine/learningEngine";
import { getCompletedLessonCount, resolveEducationalTier, tierClassName } from "../../cognitive/tierResolver";
import type { PathwayId, SubjectId } from "../../world/types";
import { PathwayDepthLayers } from "./PathwayDepthLayers";
import { PathwayTunnels } from "./PathwayTunnels";
import { WorldMapStartNode } from "./WorldMapStartNode";

type Props = {
  subjectId: SubjectId;
  pathwayId: PathwayId;
  model: LearningEngineModel;
  onBack: () => void;
  onEnterModule: (lessonIndex: number, pathwayId: PathwayId) => void;
};

const MAP_PRESET = "pathway" as const;

export function PathwayHighwayView({ pathwayId, model, onBack, onEnterModule }: Props) {
  const pathway = getPathway(pathwayId);
  const modules = getModulesForPathway(pathwayId);
  const biome = getPathwayBiome(pathwayId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const mapCfg = layoutConfig(MAP_PRESET);
  const mapHeight = worldMapHeight(modules.length, MAP_PRESET);
  const mapWidth = worldMapWidth(MAP_PRESET);
  const slots = useMemo(() => serpentineSlots(modules.length, MAP_PRESET), [modules.length]);
  const start = startNodeCenter(MAP_PRESET);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const bgParallax = useTransform(scrollYProgress, [0, 1], ["0px", "-28px"]);

  const pathwaySlice = model.pathwaySliceFor(pathwayId);
  const moreLessonsSoon = getChapterForPathway(pathwayId).length <= 1;

  const moduleStates = useMemo(
    () =>
      modules.map((m) => ({
        ...m,
        progress: moduleProgressForLesson(m.lessonIndex, {
          currentLessonIndex: pathwaySlice.currentLessonIndex,
          maxUnlockedLessonIndex: pathwaySlice.maxUnlockedLessonIndex,
          chapterComplete: pathwaySlice.chapterComplete,
        }),
        slot: slots[m.depth],
      })),
    [modules, pathwaySlice, slots]
  );

  const progressStates = moduleStates.map((m) => m.progress);
  const activeIndex = moduleStates.findIndex((m) => m.progress === "active");

  useEffect(() => {
    const t = window.setTimeout(() => {
      activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 450);
    return () => window.clearTimeout(t);
  }, [activeIndex, pathwayId]);

  if (!pathway) return null;

  const gradientId = `tunnel-${pathwayId}`;
  const tierClass = tierClassName(resolveEducationalTier(getCompletedLessonCount()));

  const canvasStyle = {
    ["--map-height" as string]: `${mapHeight}px`,
    ["--map-width" as string]: `${mapWidth}px`,
    ["--map-node-width" as string]: `${mapCfg.nodeCardWidth}px`,
    ["--map-travel-y" as string]: `${mapCfg.moduleTravelY}px`,
    ["--biome-accent" as string]: biome.accent,
    ["--biome-accent-2" as string]: biome.accentSecondary,
  } as CSSProperties;

  return (
    <motion.section
      key={`pathway-${pathwayId}`}
      className={`world-highway world-highway--terrain ${biome.className} ${tierClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="world-highway__head world-highway__head--compact">
        <button type="button" className="la-secondary" onClick={onBack}>
          ← Pathways
        </button>
        <div>
          <p className="world-kicker">Curriculum terrain · {biome.label}</p>
          <h2 className="world-title">{pathway.title}</h2>
          <p className="world-subtitle">
            {moreLessonsSoon
              ? "Lesson 1 is live — additional modules will connect here soon"
              : "Galaxy view — see completed routes, your current module, and the path ahead"}
          </p>
          <p className="world-highway__scroll-hint">Scroll to travel the full pathway · completed tunnels stay visible</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="world-map-scroll world-map-scroll--pathway"
        role="region"
        aria-label={`${pathway.title} world map`}
      >
        <div className="world-map-canvas world-map-canvas--pathway" style={canvasStyle}>
          <motion.div className="world-map-canvas__bg" style={{ y: bgParallax }}>
            <PathwayDepthLayers
              biome={biome}
              parallaxX={bgParallax}
              parallaxY={bgParallax}
              parallaxMid={bgParallax}
              particleCount={12}
            />
          </motion.div>

          {/* Single terrain layer — tunnels + nodes share coordinates */}
          <div className="world-map-canvas__terrain">
            <PathwayTunnels
              moduleCount={modules.length}
              moduleStates={progressStates}
              biome={biome}
              gradientId={gradientId}
              mapHeight={mapHeight}
              layoutPreset={MAP_PRESET}
            />

            <WorldMapStartNode x={start.x} y={start.y} mapWidth={mapWidth} />

            {moduleStates.map((m) => {
              const slot = m.slot;
              const isActive = m.progress === "active";
              return (
                <div
                  key={m.id}
                  ref={isActive ? activeRef : undefined}
                  className={[
                    "world-map-node",
                    `world-map-node--${slot.side}`,
                    `world-map-node--${m.progress}`,
                  ].join(" ")}
                  role="listitem"
                  style={{
                    top: slot.y,
                    zIndex: slot.zIndex,
                    ["--node-scale" as string]: String(slot.scale),
                    ["--node-fog" as string]: String(slot.fog),
                  }}
                >
                  <ModuleNode
                    title={m.title}
                    subtitle={m.subtitle}
                    concepts={m.concepts}
                    state={m.progress}
                    depth={m.depth}
                    biomeClass={biome.className}
                    onClick={() => {
                      if (m.progress !== "locked") onEnterModule(m.lessonIndex, pathwayId);
                    }}
                  />
                </div>
              );
            })}

            <div className="world-map-canvas__depth-fog world-map-canvas__depth-fog--light" aria-hidden />
            <p className="world-map-canvas__horizon">Deeper curriculum regions fade into the fog below</p>
          </div>
        </div>
      </div>

      <div className="world-highway__legend">
        <span className="world-highway__legend-item world-highway__legend-item--done">Illuminated tunnel</span>
        <span className="world-highway__legend-item world-highway__legend-item--active">Energy flowing now</span>
        <span className="world-highway__legend-item world-highway__legend-item--future">Path ahead (locked)</span>
      </div>
    </motion.section>
  );
}
