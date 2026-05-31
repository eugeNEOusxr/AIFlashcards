import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLessonAnchor } from "../learning-world";
import { BowlingBallMotif } from "./BowlingBallMotif";
import { getSceneDefinition } from "./sceneCatalog";
import { TeachingOverlayLayer } from "./TeachingOverlayLayer";
import {
  hasForceArrowEvents,
  questionLayerOpacity,
  teachLayerOpacity,
  type SceneLayerPhase,
  type VisualReaction,
} from "./sceneLayers";
import type { LessonVisualTheme } from "./types";

export type { VisualReaction };

export type LessonVisualCoreTheme = Pick<LessonVisualTheme, "backgroundScene" | "accentColors">;

type Props = {
  coreTheme: LessonVisualCoreTheme;
  lessonId: string;
  anchorId: string | null;
  layerPhase: SceneLayerPhase;
  teachVisualEvents?: string[];
  teachOverlayClasses?: string[];
  questionDynamicMotifs?: string[];
  questionOverlayClasses?: string[];
  questionVisualEvents?: string[];
  collisionOverlay?: boolean;
  reaction?: VisualReaction;
};

function Motif({ id }: { id: string }) {
  return <div className={`lesson-motif lesson-motif--${id}`} aria-hidden />;
}

function ConceptAnchor({ anchorId }: { anchorId: string }) {
  if (anchorId === "bowling-ball") {
    return <BowlingBallMotif focus />;
  }
  if (anchorId === "hockey-puck") {
    return <Motif id="hockey-puck" />;
  }
  return <Motif id={anchorId} />;
}

const PersistentAnchor = memo(function PersistentAnchor({ anchorId }: { anchorId: string }) {
  const anchorRef = useLessonAnchor(anchorId);
  return (
    <div
      ref={anchorRef}
      className="lesson-visual-scene__anchor lesson-visual-scene__anchor--persistent"
      data-anchor={anchorId}
      data-world-anchor="true"
    >
      <ConceptAnchor anchorId={anchorId} />
    </div>
  );
});

/**
 * Layered chamber: CORE + ANCHOR (persistent) + TEACH overlay + QUESTION overlay + FEEDBACK reaction.
 * Root mounts once per lessonId — never keyed by question or UI card mode.
 */
export function LessonVisualScene({
  coreTheme,
  lessonId,
  anchorId,
  layerPhase,
  teachVisualEvents = [],
  teachOverlayClasses = [],
  questionDynamicMotifs = [],
  questionOverlayClasses = [],
  questionVisualEvents = [],
  collisionOverlay = false,
  reaction = "idle",
}: Props) {
  const scene = getSceneDefinition(coreTheme.backgroundScene);
  const [bgFailed, setBgFailed] = useState(false);
  const [midFailed, setMidFailed] = useState(false);

  const accentVars = useMemo(
    () => ({
      ["--scene-a" as string]: `var(--accent-${coreTheme.accentColors[0]}, #22d3ee)`,
      ["--scene-b" as string]: `var(--accent-${coreTheme.accentColors[1]}, #8b5cf6)`,
    }),
    [coreTheme.accentColors]
  );

  const bgUrl = scene.assets?.background;
  const midUrl = scene.assets?.midground;

  const teachOpacity = teachLayerOpacity(layerPhase);
  const questionOpacity = questionLayerOpacity(layerPhase);

  const showQuestionForceOverlays =
    anchorId === "bowling-ball" &&
    layerPhase === "feedback" &&
    (collisionOverlay || hasForceArrowEvents(questionVisualEvents));

  return (
    <div
      key={lessonId}
      className={[
        "lesson-visual-scene",
        scene.chamberClass,
        `lesson-visual-scene--layer-${layerPhase}`,
        `lesson-visual-scene--react-${reaction}`,
      ]
        .filter(Boolean)
        .join(" ")}
      style={accentVars}
      aria-hidden
    >
      <div className="lesson-visual-scene__core">
        <div className="lesson-visual-scene__bg">
          {bgUrl && !bgFailed ? (
            <img
              className="lesson-visual-scene__img lesson-visual-scene__img--bg"
              src={bgUrl}
              alt=""
              onError={() => setBgFailed(true)}
            />
          ) : null}
          <div className="lesson-visual-scene__chamber-gradient" />
          <div className="lesson-visual-scene__grid" />
        </div>

        <div className="lesson-visual-scene__mid lesson-visual-scene__mid--motifs">
          {midUrl && !midFailed ? (
            <img
              className="lesson-visual-scene__img lesson-visual-scene__img--mid"
              src={midUrl}
              alt=""
              onError={() => setMidFailed(true)}
            />
          ) : null}

          {anchorId ? <PersistentAnchor anchorId={anchorId} /> : null}

          <motion.div
            className="lesson-visual-scene__layer lesson-visual-scene__layer--teach"
            animate={{ opacity: teachOpacity }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            <TeachingOverlayLayer
              visualEvents={teachVisualEvents}
              overlayClasses={teachOverlayClasses}
              visible={teachOpacity > 0}
            />
          </motion.div>

          <motion.div
            className={[
              "lesson-visual-scene__layer",
              "lesson-visual-scene__layer--question",
              ...questionOverlayClasses,
            ]
              .filter(Boolean)
              .join(" ")}
            animate={{ opacity: questionOpacity }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            <div className="lesson-visual-scene__dynamic">
              <AnimatePresence initial={false}>
                {questionDynamicMotifs.map((m) => (
                  <motion.div
                    key={m}
                    className="lesson-visual-scene__dynamic-item"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Motif id={m} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {showQuestionForceOverlays ? (
              <div className="lesson-visual-scene__force-overlays lesson-visual-scene__force-overlays--question">
                <div className="lesson-force-overlay lesson-force-overlay--arrow" />
                <div className="lesson-force-overlay lesson-force-overlay--vector" />
                {collisionOverlay ? (
                  <div className="lesson-force-overlay lesson-force-overlay--shockwave" />
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </div>

        <div className="lesson-visual-scene__fg">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="lesson-visual-scene__particle" style={{ ["--i" as string]: String(i) }} />
          ))}
          <div className="lesson-visual-scene__glass-sheen" />
        </div>

        <div className="lesson-visual-scene__fx">
          <div className="lesson-visual-scene__pulse-ring" />
        </div>

        <div className="lesson-visual-scene__vignette" />
      </div>
    </div>
  );
}
