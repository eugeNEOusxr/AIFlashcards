import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AmbientBackground } from "../effects/AmbientBackground";
import { useFrameLearning } from "../engine/useFrameLearning";
import { getModule, getModuleForLandmark } from "../content/frames/registry";
import { loadFrameNav, saveFrameNav } from "../memory/frameSession";
import type { NavScreen } from "../world/types";
import { SubjectWorldScreen } from "./world/SubjectWorldScreen";
import { SubjectCurriculumScrollMap } from "./world/SubjectCurriculumScrollMap";
import { WorldBreadcrumb } from "./world/WorldBreadcrumb";
import { CognitiveFrameCard } from "./frame/CognitiveFrameCard";
import { MapLayerNav } from "./world/MapLayerNav";
import { getSubjectProfile } from "../world/subjectProfiles";
import type { BiologyModuleLandmarkId } from "../world/biologyModuleLandmarks";
import type { ChemistryModuleLandmarkId } from "../world/chemistryModuleLandmarks";
import type { PhysicsModuleLandmarkId } from "../world/physicsModuleLandmarks";

function headerForNav(nav: NavScreen): { kicker: string; title: string; subline: string } {
  switch (nav.kind) {
    case "HOME":
      return {
        kicker: "Knowledge universe",
        title: "Study Worlds",
        subline: "Choose a subject to begin",
      };
    case "SUBJECT": {
      const profile = getSubjectProfile(nav.subjectId);
      return {
        kicker: profile.mapRegionKicker,
        title: profile.mapRegionTitle,
        subline: profile.homeTagline,
      };
    }
    case "FRAME_MODULE": {
      const mod = getModule(nav.moduleId);
      return {
        kicker: mod ? `Chapter ${mod.chapterNumber}` : "Chapter",
        title: mod?.title ?? "Learning module",
        subline: mod
          ? `${mod.subtitle} · ${mod.frames.length} questions`
          : "One question at a time",
      };
    }
    default:
      return { kicker: "", title: "", subline: "" };
  }
}

function subjectFromNav(nav: NavScreen): import("../world/types").SubjectId {
  if (nav.kind === "SUBJECT" || nav.kind === "FRAME_MODULE") return nav.subjectId;
  return "physics";
}

export function FrameLearningApp() {
  const [nav, setNav] = useState<NavScreen>(() => loadFrameNav());
  const activeSubject = subjectFromNav(nav);
  const model = useFrameLearning(activeSubject);
  const {
    session,
    module,
    frame,
    finished,
    frameIndex,
    frameTotal,
    phase,
    selectedIndex,
    isCorrect,
    enterModule,
    selectAnswer,
    reflectionYes,
    reflectionConfused,
    continueAfterClarification,
    completeModule,
    refreshMapProgress,
    mapModel,
  } = model;

  useEffect(() => {
    saveFrameNav(nav);
  }, [nav]);

  useEffect(() => {
    if (nav.kind === "SUBJECT") refreshMapProgress();
  }, [nav.kind, refreshMapProgress]);

  useEffect(() => {
    if (nav.kind !== "FRAME_MODULE") return;
    const mod = getModule(nav.moduleId);
    if (!mod) return;
    if (!session || session.moduleId !== nav.moduleId) {
      enterModule(nav.moduleId);
    }
  }, [nav, session?.moduleId, enterModule]);

  const header = headerForNav(nav);

  const openFrameModule = (
    landmarkId: PhysicsModuleLandmarkId | ChemistryModuleLandmarkId | BiologyModuleLandmarkId
  ) => {
    const mod = getModuleForLandmark(landmarkId, activeSubject);
    if (!mod) return;
    enterModule(mod.id);
    setNav({ kind: "FRAME_MODULE", subjectId: activeSubject, moduleId: mod.id });
  };

  const handleReflectionYes = () => {
    const isLast = frameIndex >= frameTotal - 1;
    reflectionYes();
    if (isLast) {
      completeModule();
      setNav({ kind: "SUBJECT", subjectId: activeSubject });
    }
  };

  const handleContinueAfterClarification = () => {
    const isLast = frameIndex >= frameTotal - 1;
    continueAfterClarification();
    if (isLast) {
      completeModule();
      setNav({ kind: "SUBJECT", subjectId: activeSubject });
    }
  };

  const handleBreadcrumb = (target: NavScreen) => {
    if (target.kind === "FRAME_MODULE") return;
    setNav(target);
  };

  return (
    <div
      className={[
        "la-app",
        "la-app--frame-flow",
        nav.kind === "HOME" ? "la-app--home" : "",
        nav.kind === "SUBJECT" ? "la-app--map-hero" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <AmbientBackground />

      <header className="la-header">
        <WorldBreadcrumb screen={nav} onNavigate={handleBreadcrumb} />
        <p className="la-kicker">{header.kicker}</p>
        <h1>{header.title}</h1>
        <p className="la-subline">{header.subline}</p>
      </header>

      <AnimatePresence mode="wait">
        {nav.kind === "HOME" ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SubjectWorldScreen
              onEnterSubject={(subjectId) => setNav({ kind: "SUBJECT", subjectId })}
              onNavigate={handleBreadcrumb}
            />
          </motion.div>
        ) : null}

        {nav.kind === "SUBJECT" ? (
          <SubjectCurriculumScrollMap
            key="subject"
            subjectId={nav.subjectId}
            nav={nav}
            mapModel={mapModel}
            onNavigate={handleBreadcrumb}
            onEnterLandmark={openFrameModule}
          />
        ) : null}

        {nav.kind === "FRAME_MODULE" && session && module && frame ? (
          <motion.section
            key={`module-${module.id}`}
            className="la-lesson-shell la-lesson-shell--frames"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MapLayerNav screen={nav} onNavigate={handleBreadcrumb} moodLabel={module.title} />

            <div className="la-frame-shell">
              <CognitiveFrameCard
                key={frame.id}
                frame={frame}
                frameIndex={frameIndex}
                frameTotal={frameTotal}
                moduleTitle={module.title}
                phase={phase}
                selectedIndex={selectedIndex}
                isCorrect={isCorrect}
                onSelectAnswer={selectAnswer}
                onReflectionYes={handleReflectionYes}
                onReflectionConfused={reflectionConfused}
                onContinueAfterClarification={handleContinueAfterClarification}
              />
            </div>
          </motion.section>
        ) : null}

        {nav.kind === "FRAME_MODULE" && !getModule(nav.moduleId) ? (
          <div className="la-frame-shell la-frame-shell__complete neural-glass">
            <h2>Module unavailable</h2>
            <p className="la-note">This frame module is not registered. Return to the map.</p>
            <button
              type="button"
              className="la-primary"
              onClick={() => setNav({ kind: "SUBJECT", subjectId: "physics" })}
            >
              Back to Physics map
            </button>
          </div>
        ) : null}

        {nav.kind === "FRAME_MODULE" &&
        getModule(nav.moduleId) &&
        (!session || !module) ? (
          <div className="la-frame-shell la-frame-shell__loading neural-glass">
            <p className="la-note">Loading frames…</p>
          </div>
        ) : null}

        {nav.kind === "FRAME_MODULE" && session && module && !frame && !finished ? (
          <div className="la-frame-shell la-frame-shell__loading neural-glass">
            <p className="la-note">Preparing frame…</p>
          </div>
        ) : null}

        {nav.kind === "FRAME_MODULE" && session && module && !frame && finished ? (
          <div className="la-frame-shell la-frame-shell__complete neural-glass">
            <h2>Module complete</h2>
            <p className="la-note">You finished all {frameTotal} frames in {module.title}.</p>
            <button
              type="button"
              className="la-primary"
              onClick={() => {
                completeModule();
                setNav({ kind: "SUBJECT", subjectId: activeSubject });
              }}
            >
              Return to map
            </button>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
