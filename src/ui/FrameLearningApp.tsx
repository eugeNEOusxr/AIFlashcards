import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCompactTouchUI } from "../hooks/useCompactTouchUI";
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
import type { FrameSessionState } from "../engine/frameEngine";
import type { FramePhase, LearningFrame, LearningModule } from "../content/frames/types";
import type { SubjectId } from "../world/types";

type FrameModuleScreenProps = {
  nav: Extract<NavScreen, { kind: "FRAME_MODULE" }>;
  compactTouch: boolean;
  activeSubject: SubjectId;
  session: FrameSessionState | null;
  module: LearningModule | null;
  frame: LearningFrame | null;
  finished: boolean;
  frameIndex: number;
  frameTotal: number;
  phase: FramePhase;
  selectedIndex: number | null;
  isCorrect: boolean | null;
  selectAnswer: (index: number) => void;
  onReflectionYes: () => void;
  onReflectionConfused: () => void;
  onContinueAfterClarification: () => void;
  onNavigate: (screen: NavScreen) => void;
  onReturnToMap: () => void;
};

function FrameModuleScreen({
  nav,
  compactTouch,
  activeSubject,
  session,
  module,
  frame,
  finished,
  frameIndex,
  frameTotal,
  phase,
  selectedIndex,
  isCorrect,
  selectAnswer,
  onReflectionYes,
  onReflectionConfused,
  onContinueAfterClarification,
  onNavigate,
  onReturnToMap,
}: FrameModuleScreenProps) {
  const registered = getModule(nav.moduleId);
  const layerNav = (
    <MapLayerNav screen={nav} onNavigate={onNavigate} moodLabel={module?.title ?? "Lesson"} />
  );

  if (!registered) {
    return (
      <section className="la-lesson-shell la-lesson-shell--frames">
        {layerNav}
        <div className="la-frame-shell la-frame-shell__complete neural-glass">
        <h2>Module unavailable</h2>
        <p className="la-note">This frame module is not registered. Return to the map.</p>
        <button
          type="button"
          className="la-primary"
          onClick={() => onNavigate({ kind: "SUBJECT", subjectId: activeSubject })}
        >
          Back to map
        </button>
        </div>
      </section>
    );
  }

  if (!session || !module) {
    return (
      <section className="la-lesson-shell la-lesson-shell--frames">
        {layerNav}
        <div className="la-frame-shell la-frame-shell__loading neural-glass">
          <p className="la-note">Loading frames…</p>
        </div>
      </section>
    );
  }

  if (!frame && !finished) {
    return (
      <section className="la-lesson-shell la-lesson-shell--frames">
        {layerNav}
        <div className="la-frame-shell la-frame-shell__loading neural-glass">
          <p className="la-note">Preparing frame…</p>
        </div>
      </section>
    );
  }

  if (!frame && finished) {
    return (
      <section className="la-lesson-shell la-lesson-shell--frames">
        {layerNav}
        <div className="la-frame-shell la-frame-shell__complete neural-glass">
        <h2>Module complete</h2>
        <p className="la-note">
          You finished all {frameTotal} frames in {module.title}.
        </p>
        <button type="button" className="la-primary" onClick={onReturnToMap}>
          Return to map
        </button>
        </div>
      </section>
    );
  }

  if (!frame) return null;

  const shell = (
    <>
      {layerNav}
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
          reduceMotion={compactTouch}
          onSelectAnswer={selectAnswer}
          onReflectionYes={onReflectionYes}
          onReflectionConfused={onReflectionConfused}
          onContinueAfterClarification={onContinueAfterClarification}
        />
      </div>
    </>
  );

  if (compactTouch) {
    return <section className="la-lesson-shell la-lesson-shell--frames">{shell}</section>;
  }

  return (
    <motion.section
      className="la-lesson-shell la-lesson-shell--frames"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {shell}
    </motion.section>
  );
}

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
        kicker: profile.cognitiveMindKicker,
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
  const compactTouch = useCompactTouchUI();
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

      <div className="la-screen-stack" data-nav={nav.kind}>
        {nav.kind === "HOME" ? (
          compactTouch ? (
            <div key="home">
              <SubjectWorldScreen
                onEnterSubject={(subjectId) => setNav({ kind: "SUBJECT", subjectId })}
                onNavigate={handleBreadcrumb}
              />
            </div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <SubjectWorldScreen
                onEnterSubject={(subjectId) => setNav({ kind: "SUBJECT", subjectId })}
                onNavigate={handleBreadcrumb}
              />
            </motion.div>
          )
        ) : null}

        {nav.kind === "SUBJECT" ? (
          <SubjectCurriculumScrollMap
            key={`subject-${nav.subjectId}`}
            subjectId={nav.subjectId}
            nav={nav}
            mapModel={mapModel}
            onNavigate={handleBreadcrumb}
            onEnterLandmark={openFrameModule}
          />
        ) : null}

        {nav.kind === "FRAME_MODULE" ? (
          <FrameModuleScreen
            nav={nav}
            compactTouch={compactTouch}
            activeSubject={activeSubject}
            session={session}
            module={module}
            frame={frame}
            finished={finished}
            frameIndex={frameIndex}
            frameTotal={frameTotal}
            phase={phase}
            selectedIndex={selectedIndex}
            isCorrect={isCorrect}
            selectAnswer={selectAnswer}
            onReflectionYes={handleReflectionYes}
            onReflectionConfused={reflectionConfused}
            onContinueAfterClarification={handleContinueAfterClarification}
            onNavigate={handleBreadcrumb}
            onReturnToMap={() => {
              completeModule();
              setNav({ kind: "SUBJECT", subjectId: activeSubject });
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
