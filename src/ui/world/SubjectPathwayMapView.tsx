import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { motion } from "framer-motion";

import { PathwayMapNode } from "../../components/PathwayMapNode";

import type { LearningEngineModel } from "../../engine/learningEngine";

import { getCompletedLessonCount, resolveEducationalTier, tierClassName } from "../../cognitive/tierResolver";

import { getPathwayBiome } from "../../world/pathwayBiomes";

import { getChapterForPathway } from "../../content/chapterRegistry";

import { pathwayHasContent, pathwayProgressForPathway } from "../../world/pathwayProgress";

import { getPathwaysForSubject, getSubject } from "../../world/physicsWorld";

import {
  layoutConfig,
  serpentineSlots,
  startNodeCenter,
  worldMapHeight,
  worldMapWidth,
} from "../../world/serpentineLayout";

import type { PathwayId, SubjectId } from "../../world/types";
import { PathwayTunnels } from "./PathwayTunnels";

import { WorldMapStartNode } from "./WorldMapStartNode";
import { usePresenceTrail } from "../../world/presenceTrail";
import { PathwayLessonReplay } from "./PathwayLessonReplay";
import { maxUnlockedLessonIndexForPathway } from "../../world/progressionHelpers";



const MAP_PRESET = "subject" as const;

const TRAIL_PARTICLES = Array.from({ length: 8 }, (_, i) => i);



type Props = {

  subjectId: SubjectId;

  model: LearningEngineModel;

  onBack: () => void;

  onEnterPathway: (pathwayId: PathwayId) => void;
  onEnterLesson?: (lessonIndex: number, pathwayId: PathwayId) => void;
};



export function SubjectPathwayMapView({
  subjectId,
  model,
  onBack,
  onEnterPathway,
  onEnterLesson,
}: Props) {
  const presence = usePresenceTrail();
  const [replayPathwayId, setReplayPathwayId] = useState<PathwayId | null>(null);

  const subject = getSubject(subjectId);

  const pathways = getPathwaysForSubject(subjectId);

  const scrollRef = useRef<HTMLDivElement>(null);

  const activeRef = useRef<HTMLDivElement>(null);



  const mapCfg = layoutConfig(MAP_PRESET);
  const mapHeight = worldMapHeight(pathways.length, MAP_PRESET);
  const mapWidth = worldMapWidth(MAP_PRESET);

  const slots = useMemo(() => serpentineSlots(pathways.length, MAP_PRESET), [pathways.length]);

  const start = startNodeCenter(MAP_PRESET);



  const pathwayStates = useMemo(

    () =>

      pathways.map((p, i) => ({

        ...p,

        progress: pathwayProgressForPathway(p.id, model.state, model.pathwaySliceFor),

        slot: slots[i],

        biome: getPathwayBiome(p.id),

      })),

    [pathways, model.state, model.pathwaySliceFor, slots]

  );



  const progressStates = pathwayStates.map((p) => p.progress);

  const activeIndex = pathwayStates.findIndex((p) => p.progress === "active");
  const nextIndex = pathwayStates.findIndex((p, i) => i > activeIndex && p.progress !== "locked");
  const activePath = activeIndex >= 0 ? pathwayStates[activeIndex] : null;
  const nextPath = nextIndex >= 0 ? pathwayStates[nextIndex] : null;



  useEffect(() => {

    const t = window.setTimeout(() => {

      activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });

    }, 450);

    return () => window.clearTimeout(t);

  }, [activeIndex]);



  const tierClass = tierClassName(resolveEducationalTier(getCompletedLessonCount()));

  const subjectBiome = getPathwayBiome("motion-forces");



  const canvasStyle = {

    ["--map-height" as string]: `${mapHeight}px`,

    ["--map-width" as string]: `${mapWidth}px`,
    ["--map-node-width" as string]: `${mapCfg.nodeCardWidth}px`,
    ["--map-travel-y" as string]: `${mapCfg.moduleTravelY}px`,
    ["--biome-accent" as string]: subjectBiome.accent,

    ["--biome-accent-2" as string]: subjectBiome.accentSecondary,

  } as CSSProperties;



  return (

    <motion.section

      key={`subject-map-${subjectId}`}

      className={`world-highway world-highway--terrain world-highway--subject-map ${tierClass}`}

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      exit={{ opacity: 0 }}

    >

      <div className="world-highway__head world-highway__head--compact">

        <button type="button" className="la-secondary" onClick={onBack}>

          ← Worlds

        </button>

        <div>

          <p className="world-kicker">Domain map</p>

          <h2 className="world-title">{subject?.label ?? subjectId}</h2>

          <div className="world-living-header">
            <div className="world-living-header__current">
              <span className="world-living-header__label">Current module</span>
              <strong>{activePath?.title ?? "Explore modules"}</strong>
            </div>
            <div className="world-living-header__bridge" aria-hidden />
            <div className="world-living-header__next">
              <span className="world-living-header__label">Next up</span>
              <strong>{nextPath?.title ?? "More ahead"}</strong>
            </div>
          </div>
          <p className="world-highway__scroll-hint">
            One step ahead is hinted · future modules stay fogged
          </p>
        </div>

      </div>

      <div ref={scrollRef} className="world-map-scroll world-map-scroll--subject" role="region" aria-label="Physics pathway map">

        <div className="world-map-canvas world-map-canvas--subject" style={canvasStyle}>

          <div className="world-map-canvas__terrain">

            <PathwayTunnels

              moduleCount={pathways.length}

              moduleStates={progressStates}

              biome={subjectBiome}

              gradientId="subject-physics-pathways"

              mapHeight={mapHeight}

              layoutPreset={MAP_PRESET}

            />



            <WorldMapStartNode x={start.x} y={start.y} mapWidth={mapWidth} label="Physics core" />



            {pathwayStates.map((p) => {

              const isActive = p.progress === "active";

              const canEnter = p.progress !== "locked" && pathwayHasContent(p.id);

              const nodeState = !pathwayHasContent(p.id) && p.progress === "unlocked" ? "locked" : p.progress;
              const visualState =
                nodeState === "done"
                  ? "mastered"
                  : isActive
                    ? "active"
                    : nextPath?.id === p.id
                      ? "next"
                      : nodeState;



              return (

                <div

                  key={p.id}

                  ref={isActive ? activeRef : undefined}

                  className={[

                    "world-map-node",

                    "world-map-node--pathway",

                    `world-map-node--${p.slot.side}`,

                    `world-map-node--${visualState}`,

                  ].join(" ")}

                  role="listitem"

                  style={{

                    top: p.slot.y,

                    zIndex: p.slot.zIndex,

                    ["--node-scale" as string]: String(p.slot.scale),

                    ["--node-fog" as string]: String(p.slot.fog),

                  }}

                >

                  <PathwayMapNode

                    title={p.title}

                    description={p.description}

                    state={visualState as "active" | "next" | "mastered" | "unlocked" | "locked"}

                    biomeClass={p.biome.className}

                    lessonBadge={

                      pathwayHasContent(p.id) && getChapterForPathway(p.id).length === 1

                        ? "Lesson 1"

                        : undefined

                    }

                    onClick={() => {
                      if (!canEnter) return;
                      const lessonCount = getChapterForPathway(p.id).length;
                      if (lessonCount > 1 && onEnterLesson) {
                        setReplayPathwayId(p.id);
                        return;
                      }
                      onEnterPathway(p.id);
                    }}

                  />

                </div>

              );

            })}

            {activePath ? (
              <motion.div
                className={[
                  "world-progress-entity",
                  `world-progress-entity--${presence.pulse}`,
                ].join(" ")}
                initial={false}
                animate={{ top: activePath.slot.y - 18 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  left: "50%",
                  ["--trail-intensity" as string]: String(presence.intensity),
                }}
                aria-hidden
              >
                <span className="world-progress-entity__orb" />
                <span className="world-progress-entity__trail">
                  {TRAIL_PARTICLES.map((i) => (
                    <span
                      key={i}
                      className="world-progress-entity__particle"
                      style={{ ["--p" as string]: String(i) }}
                    />
                  ))}
                </span>
              </motion.div>
            ) : null}



            <div
              className="world-map-canvas__depth-fog world-map-canvas__depth-fog--subject world-map-canvas__depth-fog--light"
              aria-hidden
            />

            <p className="world-map-canvas__horizon">Thermodynamics and beyond fade into the distance</p>

          </div>

        </div>

      </div>



      <div className="world-highway__legend">

        <span className="world-highway__legend-item world-highway__legend-item--done">Energy flowing</span>

        <span className="world-highway__legend-item world-highway__legend-item--active">Current pathway</span>

        <span className="world-highway__legend-item world-highway__legend-item--future">Locked — power off</span>

      </div>

      {replayPathwayId && onEnterLesson ? (
        <PathwayLessonReplay
          pathwayId={replayPathwayId}
          maxUnlocked={maxUnlockedLessonIndexForPathway(
            replayPathwayId,
            model.pathwaySliceFor(replayPathwayId).maxUnlockedLessonIndex
          )}
          onSelectLesson={(index) => onEnterLesson(index, replayPathwayId)}
          onClose={() => setReplayPathwayId(null)}
        />
      ) : null}

    </motion.section>

  );

}


