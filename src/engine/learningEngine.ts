import { useEffect, useMemo, useReducer, useRef } from "react";
import { getChapterForPathway } from "../content/chapterRegistry";
import type { Lesson, LessonQuestion } from "../content/curriculumTypes";
import {
  defaultPathwaySlice,
  loadMemory,
  loadSessionMemory,
  markLessonCompletedMemory,
  markPathwayCompletedMemory,
  recordAnswer,
} from "../memory/memoryStore";
import { pickNextQuestionIndex } from "../memory/questionSelector";
import type { SessionPathwaySlice } from "../memory/types";
import { emitPresenceTrail } from "../world/presenceTrail";
import type { PathwayId } from "../world/types";
import {
  checkAnswer,
  formatCorrectAnswer,
  selectedChoiceLabel,
} from "./questionTypes";

type PathwaySlice = SessionPathwaySlice;

type EngineState = {
  pathwayId: PathwayId;
  pathways: Partial<Record<PathwayId, PathwaySlice>>;
};

type EngineAction =
  | { type: "CONTINUE_FROM_TEACH" }
  | { type: "SUBMIT_ANSWER"; answerIndex: number }
  | { type: "SUBMIT_NUMERIC"; value: number }
  | { type: "CONTINUE_FROM_FEEDBACK" }
  | { type: "CONTINUE_FROM_ADVANCE" }
  | { type: "ENTER_PATHWAY"; pathwayId: PathwayId }
  | { type: "ENTER_LESSON"; lessonIndex: number; pathwayId?: PathwayId };

const DEFAULT_PASS_THRESHOLD = 2;
const DEFAULT_PATHWAY: PathwayId = "motion-forces";

function passThresholdForLesson(lesson: Lesson | undefined): number {
  return lesson?.masteryRules?.passThreshold ?? DEFAULT_PASS_THRESHOLD;
}

function clearAnswerState(slice: PathwaySlice): PathwaySlice {
  return {
    ...slice,
    selectedAnswerIndex: null,
    submittedNumericValue: null,
    lastAnswerCorrect: null,
  };
}

function createInitialEngineState(): EngineState {
  const session = loadSessionMemory();
  return {
    pathwayId: session.pathwayId ?? DEFAULT_PATHWAY,
    pathways:
      Object.keys(session.pathways).length > 0
        ? session.pathways
        : { [DEFAULT_PATHWAY]: defaultPathwaySlice() },
  };
}

function activeSlice(state: EngineState): PathwaySlice {
  return state.pathways[state.pathwayId] ?? defaultPathwaySlice();
}

function withActive(state: EngineState, slice: PathwaySlice): EngineState {
  return {
    ...state,
    pathways: { ...state.pathways, [state.pathwayId]: slice },
  };
}

function chapterFor(state: EngineState): Lesson[] {
  return getChapterForPathway(state.pathwayId);
}

function switchPathway(state: EngineState, pathwayId: PathwayId): EngineState {
  const saved = state.pathways[pathwayId] ?? defaultPathwaySlice();
  return {
    pathwayId,
    pathways: { ...state.pathways, [pathwayId]: saved },
  };
}

function evaluateAnswer(
  question: LessonQuestion,
  answerIndex: number | null,
  numericValue: number | null
): boolean {
  return checkAnswer(
    question,
    answerIndex,
    numericValue ?? undefined
  );
}

function reducer(state: EngineState, action: EngineAction): EngineState {
  let stateAfterSwitch = state;
  if (action.type === "ENTER_PATHWAY") {
    stateAfterSwitch = switchPathway(state, action.pathwayId);
  } else if (action.type === "ENTER_LESSON" && action.pathwayId && action.pathwayId !== state.pathwayId) {
    stateAfterSwitch = switchPathway(state, action.pathwayId);
  }

  const chapter = chapterFor(stateAfterSwitch);
  const slice = activeSlice(stateAfterSwitch);

  const lesson = chapter[slice.currentLessonIndex];
  const question = lesson?.questions[slice.currentQuestionIndex];

  switch (action.type) {
    case "ENTER_PATHWAY":
      return stateAfterSwitch;

    case "ENTER_LESSON": {
      const idx = action.lessonIndex;
      if (idx < 0 || idx >= chapter.length) return stateAfterSwitch;
      const s = activeSlice(stateAfterSwitch);
      const maxAllowed = Math.min(
        chapter.length - 1,
        Math.max(s.maxUnlockedLessonIndex, s.chapterComplete ? chapter.length - 1 : 0)
      );
      if (idx > maxAllowed) return stateAfterSwitch;
      return withActive(stateAfterSwitch, {
        ...clearAnswerState(s),
        currentLessonIndex: idx,
        currentQuestionIndex: 0,
        correctAnswersPerLesson: 0,
        currentMode: "TEACH",
        chapterComplete: false,
      });
    }

    case "CONTINUE_FROM_TEACH": {
      if (slice.currentMode !== "TEACH") return stateAfterSwitch;
      return withActive(stateAfterSwitch, { ...slice, currentMode: "ASK" });
    }

    case "SUBMIT_ANSWER": {
      if (slice.currentMode !== "ASK" || !question) return stateAfterSwitch;
      const isCorrect = evaluateAnswer(question, action.answerIndex, null);
      return withActive(stateAfterSwitch, {
        ...slice,
        currentMode: "FEEDBACK",
        selectedAnswerIndex: action.answerIndex,
        submittedNumericValue: null,
        lastAnswerCorrect: isCorrect,
        correctAnswersPerLesson: isCorrect ? slice.correctAnswersPerLesson + 1 : slice.correctAnswersPerLesson,
      });
    }

    case "SUBMIT_NUMERIC": {
      if (slice.currentMode !== "ASK" || !question) return stateAfterSwitch;
      const isCorrect = evaluateAnswer(question, null, action.value);
      return withActive(stateAfterSwitch, {
        ...slice,
        currentMode: "FEEDBACK",
        selectedAnswerIndex: null,
        submittedNumericValue: action.value,
        lastAnswerCorrect: isCorrect,
        correctAnswersPerLesson: isCorrect ? slice.correctAnswersPerLesson + 1 : slice.correctAnswersPerLesson,
      });
    }

    case "CONTINUE_FROM_FEEDBACK": {
      if (slice.currentMode !== "FEEDBACK" || !lesson) return stateAfterSwitch;
      const reachedGate = slice.correctAnswersPerLesson >= passThresholdForLesson(lesson);
      if (reachedGate) {
        return withActive(stateAfterSwitch, {
          ...clearAnswerState(slice),
          currentMode: "ADVANCE",
        });
      }
      return withActive(stateAfterSwitch, {
        ...clearAnswerState(slice),
        currentMode: "ASK",
        currentQuestionIndex: pickNextQuestionIndex(lesson, slice.currentQuestionIndex),
      });
    }

    case "CONTINUE_FROM_ADVANCE": {
      if (slice.currentMode !== "ADVANCE") return stateAfterSwitch;
      if (lesson) {
        markLessonCompletedMemory(lesson.id, stateAfterSwitch.pathwayId, slice.currentLessonIndex);
      }
      const nextLessonIndex = slice.currentLessonIndex + 1;
      if (nextLessonIndex >= chapter.length) {
        markPathwayCompletedMemory(stateAfterSwitch.pathwayId, chapter.length);
        return withActive(stateAfterSwitch, {
          ...slice,
          chapterComplete: true,
          maxUnlockedLessonIndex: Math.max(slice.maxUnlockedLessonIndex, chapter.length - 1),
        });
      }
      return withActive(stateAfterSwitch, {
        ...clearAnswerState(slice),
        currentLessonIndex: nextLessonIndex,
        currentQuestionIndex: 0,
        correctAnswersPerLesson: 0,
        currentMode: "TEACH",
        maxUnlockedLessonIndex: Math.max(slice.maxUnlockedLessonIndex, nextLessonIndex),
      });
    }

    default:
      return stateAfterSwitch;
  }
}

export function pathwaySliceFor(state: EngineState, pathwayId: PathwayId): PathwaySlice {
  return state.pathways[pathwayId] ?? defaultPathwaySlice();
}

export function useLearningEngine() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialEngineState);
  const slice = activeSlice(state);
  const chapter = chapterFor(state);
  const lesson = chapter[slice.currentLessonIndex];
  const question = lesson?.questions[slice.currentQuestionIndex] ?? null;
  const answerRecordedRef = useRef<string | null>(null);
  const presenceEmittedRef = useRef<string | null>(null);

  useEffect(() => {
    if (slice.currentMode !== "FEEDBACK" || !question || !lesson || slice.lastAnswerCorrect === null) {
      return;
    }

    const hasChoice = slice.selectedAnswerIndex !== null;
    const hasNumeric = slice.submittedNumericValue !== null;
    if (!hasChoice && !hasNumeric) return;

    const key = `${question.id}:${slice.selectedAnswerIndex ?? "n"}:${slice.submittedNumericValue ?? ""}`;
    if (answerRecordedRef.current === key) return;
    answerRecordedRef.current = key;

    recordAnswer({
      pathwayId: state.pathwayId,
      lessonId: lesson.id,
      questionId: question.id,
      correct: slice.lastAnswerCorrect,
      selectedIndex: slice.selectedAnswerIndex,
      numericValue: slice.submittedNumericValue ?? undefined,
      conceptTags: question.conceptTags?.length ? question.conceptTags : lesson.conceptTags,
    });

    if (presenceEmittedRef.current !== key) {
      presenceEmittedRef.current = key;
      emitPresenceTrail(slice.lastAnswerCorrect ? "correct" : "incorrect");
    }
  }, [
    slice.currentMode,
    slice.selectedAnswerIndex,
    slice.submittedNumericValue,
    slice.lastAnswerCorrect,
    question,
    lesson,
    state.pathwayId,
  ]);

  useEffect(() => {
    if (slice.currentMode === "ADVANCE") {
      emitPresenceTrail("mastery");
    }
  }, [slice.currentMode]);

  useEffect(() => {
    if (slice.currentMode === "ASK" || slice.currentMode === "TEACH") {
      answerRecordedRef.current = null;
      presenceEmittedRef.current = null;
    }
  }, [slice.currentMode, question?.id]);

  const lessonStatuses = useMemo(() => {
    const completedIds = new Set(loadMemory().curriculum.completedLessonIds);
    return chapter.map((l, index) => ({
      id: l.id,
      title: l.title,
      isCurrent: index === slice.currentLessonIndex && !slice.chapterComplete,
      isDone:
        completedIds.has(l.id) ||
        index < slice.currentLessonIndex ||
        (slice.chapterComplete && index <= slice.currentLessonIndex),
      isUnlocked: index <= slice.maxUnlockedLessonIndex,
    }));
  }, [chapter, slice.chapterComplete, slice.currentLessonIndex, slice.maxUnlockedLessonIndex]);

  const feedbackText = useMemo(() => {
    if (slice.currentMode !== "FEEDBACK" || !question || !lesson) return "";
    const detail = question.explanation ?? lesson.explanation;
    if (slice.lastAnswerCorrect) {
      return `Correct. ${detail}`;
    }
    const correct = formatCorrectAnswer(question);
    const picked = selectedChoiceLabel(question, slice.selectedAnswerIndex);
    if (picked) {
      return `Incorrect. The correct answer is ${correct}. You chose ${picked}. ${detail}`;
    }
    if (slice.submittedNumericValue !== null) {
      return `Incorrect. The correct answer is ${correct}. ${detail}`;
    }
    return `Incorrect. The correct answer is ${correct}. ${detail}`;
  }, [
    slice.currentMode,
    slice.lastAnswerCorrect,
    slice.selectedAnswerIndex,
    slice.submittedNumericValue,
    question,
    lesson,
  ]);

  const engineState = useMemo(
    () => ({
      pathwayId: state.pathwayId,
      chapterComplete: slice.chapterComplete,
      maxUnlockedLessonIndex: slice.maxUnlockedLessonIndex,
      currentLessonIndex: slice.currentLessonIndex,
      currentMode: slice.currentMode,
      correctAnswersPerLesson: slice.correctAnswersPerLesson,
      currentQuestionIndex: slice.currentQuestionIndex,
      selectedAnswerIndex: slice.selectedAnswerIndex,
      submittedNumericValue: slice.submittedNumericValue,
      lastAnswerCorrect: slice.lastAnswerCorrect,
    }),
    [state.pathwayId, slice]
  );

  return {
    state: engineState,
    fullState: state,
    pathwaySliceFor: (pathwayId: PathwayId) => pathwaySliceFor(state, pathwayId),
    lesson,
    question,
    lessonStatuses,
    requiredCorrect: passThresholdForLesson(lesson),
    feedbackText,
    onContinueTeach: () => dispatch({ type: "CONTINUE_FROM_TEACH" }),
    onSelectAnswer: (index: number) => dispatch({ type: "SUBMIT_ANSWER", answerIndex: index }),
    onSubmitNumeric: (value: number) => dispatch({ type: "SUBMIT_NUMERIC", value }),
    onContinueFeedback: () => dispatch({ type: "CONTINUE_FROM_FEEDBACK" }),
    onContinueAdvance: () => dispatch({ type: "CONTINUE_FROM_ADVANCE" }),
    onEnterPathway: (pathwayId: PathwayId) => dispatch({ type: "ENTER_PATHWAY", pathwayId }),
    onEnterLesson: (lessonIndex: number, pathwayId?: PathwayId) =>
      dispatch({ type: "ENTER_LESSON", lessonIndex, pathwayId }),
  };
}

export type LearningEngineModel = ReturnType<typeof useLearningEngine>;
