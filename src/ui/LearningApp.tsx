import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AIGuideOrb } from "../components/AIGuideOrb";
import { SubjectWorldScreen } from "./world/SubjectWorldScreen";
import { clampLessonIndex } from "../world/pathwayEntry";
import { AmbientBackground } from "../effects/AmbientBackground";
import { FeedbackPulse } from "../effects/FeedbackPulse";
import type { LearningEngineModel } from "../engine/learningEngine";
import { useCognitiveLayer } from "../cognitive/useCognitiveLayer";
import { getCompletedLessonCount, resolveEducationalTier, tierClassName } from "../cognitive/tierResolver";
import { CognitiveFeedbackBar } from "../components/CognitiveFeedbackBar";
import { CuriosityNodes } from "../components/CuriosityNodes";
import { ConceptVisualChamber } from "../visuals/ConceptVisualChamber";
import type { VisualReaction } from "../visuals/LessonVisualScene";
import { persistSessionMemory } from "../memory/memoryStore";
import { loadInitialNavScreen } from "../memory/sessionRestore";
import { resolveConceptAnchor } from "../visuals/conceptAnchor";
import { resolveQuestionVisuals } from "../visuals/questionVisualResolver";
import { getPathway } from "../world/physicsWorld";
import type { NavScreen, PathwayId, SubjectId } from "../world/types";
import { entryLessonIndexForPathway } from "../world/pathwayEntry";
import { SubjectPathwayMapView } from "./world/SubjectPathwayMapView";
import { WorldBreadcrumb } from "./world/WorldBreadcrumb";
import { QuestionAnswerControls } from "./lesson/QuestionAnswerControls";
import { phaseLabel } from "../engine/questionTypes";
import { lessonLabel } from "./lessonLabels";
import { PHASE1 } from "../phase1";

function splitKeyIdea(text: string): { key: string; rest: string } {
  const parts = text.split(". ");
  const key = (parts[0] ?? text).trim();
  const rest = parts.slice(1).join(". ").trim();
  return { key: key.endsWith(".") ? key : key + ".", rest: rest ? (rest.endsWith(".") ? rest : rest + ".") : "" };
}

function pathwayTitle(pathwayId: PathwayId): string {
  return getPathway(pathwayId)?.title ?? pathwayId;
}

function shortPreview(text: string, maxChars = 140): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxChars) return normalized;
  const sentences = normalized.split(/(?<=[.!?])\s+/);
  const candidate = sentences.slice(0, 2).join(" ");
  if (candidate.length <= maxChars) return candidate;
  return candidate.slice(0, Math.max(0, maxChars - 1)) + "…";
}

function headerForNav(nav: NavScreen): { kicker: string; title: string; subline: string } {
  switch (nav.kind) {
    case "HOME":
      return {
        kicker: "Knowledge universe",
        title: "Study Worlds",
        subline: "Domain → Module → Lesson → Question",
      };
    case "SUBJECT":
      return {
        kicker: "Subject map",
        title: nav.subjectId === "physics" ? "Physics" : nav.subjectId,
        subline: "Tap a pathway to enter the learning chamber — progression lives on this map",
      };
    case "PATHWAY":
      return {
        kicker: "Pathway map",
        title: `Physics · ${pathwayTitle(nav.pathwayId)}`,
        subline: "Living knowledge map · tap a module to enter a lesson",
      };
    case "LESSON":
      return {
        kicker: "Lesson",
        title: `Physics · ${pathwayTitle(nav.pathwayId)}`,
        subline: "Teach → Ask → Feedback → Advance",
      };
  }
}

export function LearningApp({ model }: { model: LearningEngineModel }) {
  const {
    state,
    lesson,
    question,
    lessonStatuses,
    requiredCorrect,
    feedbackText,
    onContinueTeach,
    onSelectAnswer,
    onSubmitNumeric,
    onContinueFeedback,
    onContinueAdvance,
    onEnterLesson,
    fullState,
  } = model;

  const [nav, setNav] = useState<NavScreen>(() => loadInitialNavScreen());
  const answerLockRef = useRef(false);

  const teach = useMemo(() => splitKeyIdea(lesson.explanation), [lesson.explanation]);
  const [numericDraft, setNumericDraft] = useState("");
  const anchorId = useMemo(() => resolveConceptAnchor(lesson), [lesson.id, lesson.sceneGraph]);
  const [curiosityOverlay, setCuriosityOverlay] = useState<string | undefined>();

  // Two-stage feedback UX:
  // Stage 1: immediate correctness + 1–2 line preview
  // Stage 2: deep dive + fixed Continue becomes active (no scroll needed)
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);
  const [continueReady, setContinueReady] = useState(false);

  useEffect(() => {
    setCuriosityOverlay(undefined);
    setNumericDraft("");
  }, [question?.id, lesson.id]);

  const questionVisuals = useMemo(() => {
    const base = resolveQuestionVisuals(lesson, question, state.currentMode);
    const curiosityClass = curiosityOverlay
      ? `lesson-visual-scene--curiosity-${curiosityOverlay.replace(/_/g, "-")}`
      : null;
    return {
      ...base,
      overlayClasses: curiosityClass
        ? [...base.overlayClasses, curiosityClass]
        : base.overlayClasses,
    };
  }, [lesson, question, state.currentMode, curiosityOverlay]);

  useEffect(() => {
    persistSessionMemory({
      pathwayId: fullState.pathwayId,
      pathways: fullState.pathways,
      activeLessonId: lesson?.id ?? null,
      activeQuestionId: question?.id ?? null,
      visualState: {
        dynamicMotifs: questionVisuals.dynamicMotifs,
        overlayClasses: questionVisuals.overlayClasses,
        collisionOverlay: questionVisuals.collisionOverlay,
      },
      navScreen: nav,
      lastActiveAt: Date.now(),
    });
  }, [fullState.pathwayId, fullState.pathways, lesson?.id, question?.id, nav, questionVisuals]);
  const cognitive = useCognitiveLayer(lesson, question);
  const missedRecordedRef = useRef<string | null>(null);
  const globalTier = useMemo(
    () => tierClassName(resolveEducationalTier(getCompletedLessonCount())),
    [cognitive.reinforcementCount, state.currentLessonIndex]
  );

  useEffect(() => {
    if (state.currentMode === "FEEDBACK" && state.lastAnswerCorrect === false && question) {
      if (missedRecordedRef.current !== question.id) {
        missedRecordedRef.current = question.id;
        cognitive.onIncorrectAnswer(question, undefined, state.selectedAnswerIndex);
      }
    }
    if (state.currentMode !== "FEEDBACK") {
      missedRecordedRef.current = null;
    }
  }, [state.currentMode, state.lastAnswerCorrect, question, cognitive.onIncorrectAnswer]);

  const feedbackKind =
    state.currentMode === "FEEDBACK"
      ? state.lastAnswerCorrect
        ? "correct"
        : "incorrect"
      : null;

  const visualReaction: VisualReaction = useMemo(() => {
    if (state.currentMode === "FEEDBACK") {
      return state.lastAnswerCorrect ? "correct" : "incorrect";
    }
    return "idle";
  }, [state.currentMode, state.lastAnswerCorrect]);

  useEffect(() => {
    if (state.currentMode === "ASK") {
      answerLockRef.current = false;
    }
  }, [state.currentMode, question?.id]);

  const handleAnswerPick = (index: number) => {
    if (answerLockRef.current || state.currentMode !== "ASK") return;
    answerLockRef.current = true;
    onSelectAnswer(index);
  };

  const handleNumericSubmit = () => {
    if (answerLockRef.current || state.currentMode !== "ASK" || !question) return;
    const value = Number.parseFloat(numericDraft);
    if (Number.isNaN(value)) return;
    answerLockRef.current = true;
    onSubmitNumeric(value);
  };

  const header = headerForNav(nav);
  const pathwayLabel = pathwayTitle(state.pathwayId);
  const currentLessonLabel = lessonLabel(lesson.title);
  const phaseName = question ? phaseLabel(question.phase) : "Understanding";
  const lessonProgress = question
    ? `${phaseName} · Q ${state.currentQuestionIndex + 1}/${lesson.questions.length}`
    : `Understanding · Q 1/${lesson.questions.length}`;

  const goToLesson = (lessonIndex: number, pathwayId: PathwayId, subjectId: SubjectId = "physics") => {
    onEnterLesson(clampLessonIndex(pathwayId, lessonIndex), pathwayId);
    setNav({ kind: "LESSON", subjectId, pathwayId });
  };

  const enterPathwayFromMap = (pathwayId: PathwayId, subjectId: SubjectId) => {
    const lessonIndex = entryLessonIndexForPathway(pathwayId, model.pathwaySliceFor);
    goToLesson(lessonIndex, pathwayId, subjectId);
  };

  const handleContinueAdvance = () => {
    const wasLastLesson = state.currentLessonIndex >= lessonStatuses.length - 1;
    onContinueAdvance();
    if (wasLastLesson && nav.kind === "LESSON") {
      setNav({ kind: "SUBJECT", subjectId: nav.subjectId });
    }
  };

  const feedbackPreviewText = useMemo(() => shortPreview(feedbackText), [feedbackText]);

  useEffect(() => {
    if (state.currentMode !== "FEEDBACK") {
      setDeepDiveOpen(false);
      setContinueReady(false);
      return;
    }

    setDeepDiveOpen(false);
    setContinueReady(false);

    const tDeep = window.setTimeout(() => setDeepDiveOpen(true), 900);
    const tContinue = window.setTimeout(() => setContinueReady(true), 1250);

    return () => {
      window.clearTimeout(tDeep);
      window.clearTimeout(tContinue);
    };
  }, [state.currentMode, question?.id]);

  const handleBreadcrumb = (target: NavScreen) => {
    if (target.kind === "LESSON") return;
    setNav(target);
  };

  const tierClass = nav.kind === "LESSON" ? cognitive.tierClass : globalTier;
  const immersiveHome = nav.kind === "HOME";

  return (
    <div className={`la-app ${tierClass}${immersiveHome ? " la-app--immersive-home" : ""}`}>
      <AmbientBackground />
      {nav.kind === "LESSON" ? <FeedbackPulse kind={feedbackKind} /> : null}

      <header className="la-header">
        <WorldBreadcrumb screen={nav} onNavigate={handleBreadcrumb} />
        <p className="la-kicker">{header.kicker}</p>
        <h1>
          {header.title}
          {nav.kind === "LESSON" ? (
            <span className="edu-tier-badge">{cognitive.tier}</span>
          ) : null}
        </h1>
        <p className="la-subline">{header.subline}</p>
        {nav.kind === "LESSON" && PHASE1.showAIGuideOrb ? (
          <AIGuideOrb
            mode={state.currentMode}
            feedback={feedbackKind}
            cognitiveActive={cognitive.orbActive}
          />
        ) : null}
      </header>

      <AnimatePresence mode="wait">
        {nav.kind === "HOME" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SubjectWorldScreen onEnterSubject={(subjectId) => setNav({ kind: "SUBJECT", subjectId })} />
          </motion.div>
        ) : null}

        {nav.kind === "SUBJECT" ? (
          <SubjectPathwayMapView
            subjectId={nav.subjectId}
            model={model}
            onBack={() => setNav({ kind: "HOME" })}
            onEnterPathway={(pathwayId) => enterPathwayFromMap(pathwayId, nav.subjectId)}
            onEnterLesson={(lessonIndex, pathwayId) => goToLesson(lessonIndex, pathwayId, nav.subjectId)}
          />
        ) : null}

        {nav.kind === "LESSON" ? (
          <motion.section
            key="lesson"
            className={`la-lesson-shell ${tierClass}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="la-lesson-strip neural-glass">
              <span className="la-lesson-strip__title">
                Physics → {pathwayLabel}
              </span>
              <span className="la-lesson-strip__progress">
                {phaseName} · Q {lessonProgress}
              </span>
            </div>
            <div className={`la-lesson-chamber ${cognitive.moodClass}`}>
              <ConceptVisualChamber
                coreTheme={questionVisuals.coreTheme}
                lessonId={lesson.id}
                anchorId={anchorId}
                dynamicMotifs={questionVisuals.dynamicMotifs}
                collisionOverlay={questionVisuals.collisionOverlay}
                overlayClasses={questionVisuals.overlayClasses}
                reaction={visualReaction}
                conceptTags={
                  question?.conceptTags?.length ? question.conceptTags : lesson.conceptTags
                }
                tierClass={cognitive.tierClass}
                moodClass={cognitive.moodClass}
              />

              {PHASE1.showCuriosityNodes && lesson.curiosityNodes?.length ? (
                <CuriosityNodes
                  nodes={lesson.curiosityNodes}
                  onActivate={(effect) => setCuriosityOverlay(effect)}
                />
              ) : null}

              <div className="la-lesson-body">
              <div className="la-layout">
              <main className="la-center la-lesson-center">
                <AnimatePresence mode="wait">
                  {state.currentMode === "TEACH" && (
                    <motion.section
                      key="teach"
                      className="la-card neural-glass la-card--teach"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="la-card__head">
                        <span className="la-pill">Teach</span>
                        <span className="la-lesson-chip">{currentLessonLabel}</span>
                      </div>
                      <h2 className="la-h2">Build the mental model</h2>
                      {cognitive.alternateMessage ? (
                        <div className="cognitive-alt">
                          <span className="cognitive-alt__label">Alternate view</span>
                          <p className="cognitive-alt__text">{cognitive.alternateMessage}</p>
                        </div>
                      ) : null}
                      <div className="la-explain">
                        <div className="la-explain__key">
                          <span className="la-explain__label">Key idea</span>
                          <p className="la-explain__keytext">{teach.key}</p>
                        </div>
                        {teach.rest ? (
                          <div className="la-explain__rest">
                            <span className="la-explain__label">Visualization</span>
                            <p className="la-explain__resttext">{teach.rest}</p>
                          </div>
                        ) : null}
                      </div>
                      <button type="button" className="la-primary" onClick={onContinueTeach}>
                        Continue to questions
                      </button>
                    </motion.section>
                  )}

                  {(state.currentMode === "ASK" || state.currentMode === "FEEDBACK") && question && (
                    <motion.section
                      key="qa-flow"
                      className={`la-card neural-glass la-card--ask${state.currentMode === "FEEDBACK" ? " la-card--feedback-inline" : ""}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      onClick={() => {
                        if (state.currentMode !== "FEEDBACK") return;
                        if (!deepDiveOpen) {
                          setDeepDiveOpen(true);
                          return;
                        }
                        if (continueReady) onContinueFeedback();
                      }}
                    >
                      <div className="la-card__head">
                        <span className={`la-pill ${state.currentMode === "FEEDBACK" ? (state.lastAnswerCorrect ? "ok" : "no") : ""}`}>
                          {state.currentMode === "FEEDBACK" ? (state.lastAnswerCorrect ? "Correct" : "Incorrect") : "Question"}
                        </span>
                        <span className="la-lesson-chip">{currentLessonLabel}</span>
                      </div>
                      <h2 className="la-question">{question.prompt}</h2>
                      {cognitive.alternateMessage ? (
                        <div className="cognitive-alt">
                          <span className="cognitive-alt__label">Support</span>
                          <p className="cognitive-alt__text">{cognitive.alternateMessage}</p>
                        </div>
                      ) : null}
                      <p className="la-note la-note--tap">
                        Choose one answer. Gate:{" "}
                        <strong>{state.correctAnswersPerLesson}/{requiredCorrect}</strong> correct to complete this module.
                      </p>
                      <QuestionAnswerControls
                        question={question}
                        mode={state.currentMode === "FEEDBACK" ? "FEEDBACK" : "ASK"}
                        selectedAnswerIndex={state.selectedAnswerIndex}
                        submittedNumeric={
                          state.submittedNumericValue !== null
                            ? String(state.submittedNumericValue)
                            : numericDraft
                        }
                        lastAnswerCorrect={state.lastAnswerCorrect}
                        onPickChoice={handleAnswerPick}
                        onNumericChange={setNumericDraft}
                        onSubmitNumeric={handleNumericSubmit}
                      />

                      {state.currentMode === "FEEDBACK" ? (
                        <div className="la-feedback-inline">
                          <div className="la-feedback-preview" aria-live="polite">
                            {feedbackPreviewText}
                          </div>

                          {deepDiveOpen ? (
                            <div className="la-explainbox">
                              <span className="la-explainbox__label">Why</span>
                              <p className="la-explainbox__text">{feedbackText}</p>
                              <p className="la-explainbox__text la-explainbox__reinforce">
                                {state.lastAnswerCorrect
                                  ? lesson.reinforcementFeedback.correct
                                  : lesson.reinforcementFeedback.incorrect}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </motion.section>
                  )}

                  {state.currentMode === "ADVANCE" && (
                    <motion.section
                      key="advance"
                      className="la-card neural-glass la-card--advance la-card--ok"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 180, damping: 22 }}
                    >
                      <div className="la-card__head">
                        <span className="la-pill ok la-pill--pulse">Module complete</span>
                        <span className="la-lesson-chip">{currentLessonLabel}</span>
                      </div>
                      <h2 className="la-h2">Checkpoint reached</h2>
                      <p className="la-note">
                        Gate met: <strong>{requiredCorrect}/{requiredCorrect}</strong> correct. The next module on the pathway is now unlocked.
                      </p>
                      <div className="la-advance-actions">
                        <button
                          type="button"
                          className="la-primary"
                          onClick={() => {
                            cognitive.onLessonCompleted();
                            handleContinueAdvance();
                          }}
                        >
                          {state.currentLessonIndex < lessonStatuses.length - 1
                            ? "Next lesson"
                            : "Back to pathway map"}
                        </button>
                        <button
                          type="button"
                          className="la-ghost"
                          onClick={() => setNav({ kind: "SUBJECT", subjectId: nav.subjectId })}
                        >
                          Return to map
                        </button>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </main>

              </div>
              </div>
            </div>

            {state.currentMode === "FEEDBACK" && question ? (
              <div className="la-continue-float" role="region" aria-label="Continue">
                <button
                  type="button"
                  className={`la-primary la-primary--float${continueReady ? "" : " la-primary--float--disabled"}`}
                  disabled={!continueReady}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (continueReady) onContinueFeedback();
                  }}
                >
                  Continue
                </button>
              </div>
            ) : null}

            {PHASE1.showCognitiveFeedbackBar &&
            (state.currentMode === "TEACH" ||
              state.currentMode === "ASK" ||
              state.currentMode === "FEEDBACK") ? (
              <CognitiveFeedbackBar
                activeSignal={cognitive.lastSignal}
                onSignal={cognitive.submitSignal}
              />
            ) : null}
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
