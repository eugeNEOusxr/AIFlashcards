import { PHASE1 } from "../phase1";
import type { LessonQuestion } from "../content/curriculumTypes";

/**
 * Strict question lifecycle — no transitions outside this order.
 * Lesson-level TEACH / ADVANCE wrap this pipeline.
 */
export type QuestionExecutionStep =
  | "LOAD_QUESTION"
  | "DISPLAY_QUESTION"
  | "SELECT_ANSWER"
  | "LOCK_INPUT"
  | "SHOW_RESULT"
  | "SHOW_EXPLANATION"
  | "REFLECTION_CHECKPOINT"
  | "CONTINUE"
  | "ADVANCE_STATE";

export type CurrentQuestionState = {
  questionId: string | null;
  selectedAnswer: number | null;
  submittedNumeric: number | null;
  isCorrect: boolean | null;
  inputLocked: boolean;
  explanationVisible: boolean;
  reflectionComplete: boolean;
  readyToAdvance: boolean;
};

export function initialQuestionState(questionId: string | null = null): CurrentQuestionState {
  return {
    questionId,
    selectedAnswer: null,
    submittedNumeric: null,
    isCorrect: null,
    inputLocked: false,
    explanationVisible: false,
    reflectionComplete: false,
    readyToAdvance: false,
  };
}

export function bindQuestionState(
  state: CurrentQuestionState,
  question: LessonQuestion | null
): CurrentQuestionState {
  if (!question) return initialQuestionState(null);
  if (state.questionId === question.id) return state;
  return initialQuestionState(question.id);
}

function checkpointRequired(): boolean {
  return PHASE1.showCognitiveCheckpoint;
}

export function computeReadyToAdvance(state: CurrentQuestionState): boolean {
  if (!state.inputLocked || !state.explanationVisible || state.isCorrect === null) {
    return false;
  }
  if (checkpointRequired() && !state.reflectionComplete) {
    return false;
  }
  return true;
}

/** After answer submit — deterministic, no timers. */
export function stateAfterAnswerSubmit(
  _prev: CurrentQuestionState,
  question: LessonQuestion,
  isCorrect: boolean,
  selectedAnswer: number | null,
  submittedNumeric: number | null
): CurrentQuestionState {
  const reflectionComplete = !checkpointRequired();
  const next: CurrentQuestionState = {
    questionId: question.id,
    selectedAnswer,
    submittedNumeric,
    isCorrect,
    inputLocked: true,
    explanationVisible: true,
    reflectionComplete,
    readyToAdvance: false,
  };
  next.readyToAdvance = computeReadyToAdvance(next);
  return next;
}

export function stateAfterReflectionResolved(prev: CurrentQuestionState): CurrentQuestionState {
  const next: CurrentQuestionState = {
    ...prev,
    reflectionComplete: true,
  };
  next.readyToAdvance = computeReadyToAdvance(next);
  return next;
}

export function stateForDisplayQuestion(question: LessonQuestion): CurrentQuestionState {
  return initialQuestionState(question.id);
}

/** Map engine mode + question state → pipeline step (for logging / guards). */
export function resolveExecutionStep(
  lessonMode: "TEACH" | "ASK" | "FEEDBACK" | "ADVANCE",
  qs: CurrentQuestionState
): QuestionExecutionStep {
  if (lessonMode === "TEACH") return "LOAD_QUESTION";
  if (lessonMode === "ADVANCE") return "ADVANCE_STATE";
  if (lessonMode === "ASK") {
    return qs.inputLocked ? "LOCK_INPUT" : "DISPLAY_QUESTION";
  }
  if (!qs.inputLocked) return "SELECT_ANSWER";
  if (!qs.explanationVisible) return "SHOW_RESULT";
  if (checkpointRequired() && !qs.reflectionComplete) return "REFLECTION_CHECKPOINT";
  if (!qs.readyToAdvance) return "SHOW_EXPLANATION";
  return "CONTINUE";
}
