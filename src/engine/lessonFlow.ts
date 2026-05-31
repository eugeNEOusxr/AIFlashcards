import type { Lesson, LessonQuestion, PhaseMode } from "../content/curriculumTypes";
import {
  getTeachingBlocks,
  hasReinforcementStep,
  shouldRunTeachSequence,
  type SessionMode,
} from "../content/lessonTeachFlow";

export function initialLessonFlowForQuestion(
  question: LessonQuestion | undefined,
  lesson: Lesson | undefined,
  sessionMode: SessionMode
): { mode: PhaseMode; teachStepIndex: number } {
  if (!question || !lesson) {
    return { mode: "TEACH", teachStepIndex: 0 };
  }
  if (shouldRunTeachSequence(sessionMode, question, lesson)) {
    return { mode: "TEACH", teachStepIndex: 0 };
  }
  return { mode: "ASK", teachStepIndex: 0 };
}

export function advanceFromTeachStep(
  teachStepIndex: number,
  question: LessonQuestion,
  lesson: Lesson,
  sessionMode: SessionMode
): { mode: PhaseMode; teachStepIndex: number } {
  const blocks = getTeachingBlocks(question, lesson);
  const next = teachStepIndex + 1;
  if (next < blocks.length) {
    return { mode: "TEACH", teachStepIndex: next };
  }
  if (hasReinforcementStep(question, lesson, sessionMode)) {
    return { mode: "REINFORCE", teachStepIndex: 0 };
  }
  return { mode: "ASK", teachStepIndex: 0 };
}
