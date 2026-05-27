import { memo, useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useLessonAnchor } from "../learning-world";
import { BowlingBallMotif } from "./BowlingBallMotif";

import { getSceneDefinition } from "./sceneCatalog";

import type { LessonVisualTheme } from "./types";



export type VisualReaction = "idle" | "correct" | "incorrect";



export type LessonVisualCoreTheme = Pick<LessonVisualTheme, "backgroundScene" | "accentColors">;



type Props = {

  coreTheme: LessonVisualCoreTheme;

  lessonId: string;

  anchorId: string | null;

  dynamicMotifs: string[];

  collisionOverlay?: boolean;

  overlayClasses?: string[];

  reaction?: VisualReaction;

  focusMode?: boolean;

};



function Motif({ id }: { id: string }) {

  return <div className={`lesson-motif lesson-motif--${id}`} aria-hidden />;

}



function ConceptAnchor({ anchorId, focusMode }: { anchorId: string; focusMode: boolean }) {

  if (anchorId === "bowling-ball") {

    return <BowlingBallMotif focus={focusMode} />;

  }

  if (anchorId === "hockey-puck") {

    return <Motif id="hockey-puck" />;

  }

  return <Motif id={anchorId} />;

}



const PersistentAnchor = memo(function PersistentAnchor({

  anchorId,

  focusMode,

}: {

  anchorId: string;

  focusMode: boolean;

}) {

  const anchorRef = useLessonAnchor(anchorId);

  return (

    <div
      ref={anchorRef}
      className="lesson-visual-scene__anchor lesson-visual-scene__anchor--persistent"
      data-anchor={anchorId}
      data-world-anchor="true"
    >

      <ConceptAnchor anchorId={anchorId} focusMode={focusMode} />

    </div>

  );

});



/**

 * Three-layer chamber: CORE (env) + ANCHOR (immutable) + DYNAMIC (overlays).

 * Root mounts once per lessonId — never keyed by question or UI mode.

 */

export function LessonVisualScene({

  coreTheme,

  lessonId,

  anchorId,

  dynamicMotifs,

  collisionOverlay = false,

  overlayClasses = [],

  reaction = "idle",

  focusMode = false,

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

  const showForceOverlays = focusMode && anchorId === "bowling-ball";



  return (

    <div

      key={lessonId}

      className={[

        "lesson-visual-scene",

        scene.chamberClass,

        focusMode ? "lesson-visual-scene--focus" : "",

        `lesson-visual-scene--react-${reaction}`,

        ...overlayClasses,

      ]

        .filter(Boolean)

        .join(" ")}

      style={accentVars}

      aria-hidden

    >

      {/* CORE — environment, lighting, grid (immutable after lesson mount) */}

      <div className="lesson-visual-scene__core">

        <div className={`lesson-visual-scene__bg${focusMode ? " lesson-visual-scene__bg--defocus" : ""}`}>

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

          {focusMode ? <div className="lesson-visual-scene__focal-bloom" aria-hidden /> : null}



          {/* ANCHOR — persistent concept object; never unmounted during lesson */}

          {anchorId ? <PersistentAnchor anchorId={anchorId} focusMode={focusMode} /> : null}



          {/* DYNAMIC — question/curiosity overlays only */}

          <div className="lesson-visual-scene__dynamic" aria-hidden>

            <AnimatePresence initial={false}>

              {dynamicMotifs.map((m) => (

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



          {showForceOverlays ? (

            <div className="lesson-visual-scene__force-overlays" aria-hidden>

              <div className="lesson-force-overlay lesson-force-overlay--arrow" />

              <div className="lesson-force-overlay lesson-force-overlay--vector" />

              <div className="lesson-force-overlay lesson-force-overlay--ring" />

              {collisionOverlay ? (

                <div className="lesson-force-overlay lesson-force-overlay--shockwave" />

              ) : null}

            </div>

          ) : null}

        </div>



        <div className="lesson-visual-scene__fg">

          {Array.from({ length: focusMode ? 8 : 12 }).map((_, i) => (

            <span key={i} className="lesson-visual-scene__particle" style={{ ["--i" as string]: String(i) }} />

          ))}

          <div className="lesson-visual-scene__glass-sheen" />

        </div>



        <div className="lesson-visual-scene__fx">

          <div className="lesson-visual-scene__pulse-ring" />

          <div className="lesson-visual-scene__energy-sweep" />

        </div>



        <div className="lesson-visual-scene__vignette" />

      </div>

    </div>

  );

}


