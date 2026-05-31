import type {
  ProgressionSnapshot,
  ReinforcementSource,
  UnderstandingSignal,
} from "./types";
import {
  getAverageMastery,
  loadMemory,
  markLessonCompletedMemory,
  recordMissedQuestionMemory,
  recordUnderstandingSignalMemory,
  toProgressionSnapshot,
  updateMemory,
} from "../memory/memoryStore";

/** @deprecated Use loadMemory() — kept for cognitive UI compatibility. */
export function getProgressionSnapshot(): ProgressionSnapshot {
  return toProgressionSnapshot();
}

export function recordUnderstandingSignal(params: {
  lessonId: string;
  questionId?: string;
  conceptTags: string[];
  signal: UnderstandingSignal;
}): ProgressionSnapshot {
  recordUnderstandingSignalMemory(params);
  return toProgressionSnapshot();
}

export function addReinforcementCandidate(
  _snap: ProgressionSnapshot,
  params: {
    lessonId: string;
    questionId?: string;
    conceptTags: string[];
    source: ReinforcementSource;
    front: string;
    back: string;
  }
): void {
  updateMemory((mem) => {
    const exists = mem.reinforcementQueue.some(
      (c) =>
        c.lessonId === params.lessonId &&
        c.questionId === params.questionId &&
        c.source === params.source
    );
    if (exists) return;
    mem.reinforcementQueue.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      lessonId: params.lessonId,
      questionId: params.questionId,
      conceptTags: params.conceptTags,
      front: params.front,
      back: params.back,
      source: params.source,
      createdAt: Date.now(),
    });
    mem.reinforcementQueue = mem.reinforcementQueue.slice(-80);
  });
}

export function recordMissedQuestion(params: {
  lessonId: string;
  questionId: string;
  conceptTags: string[];
  prompt: string;
  correctAnswer: string;
  wrongAnswerText?: string;
  confusionTriggers?: string[];
}): ProgressionSnapshot {
  recordMissedQuestionMemory(params);
  return toProgressionSnapshot();
}

export function markLessonCompleted(lessonId: string): ProgressionSnapshot {
  const mem = loadMemory();
  markLessonCompletedMemory(lessonId, mem.session.pathwayId);
  return toProgressionSnapshot();
}

export function getReinforcementQueue() {
  return loadMemory().reinforcementQueue;
}

export function averageMasteryScore(): number {
  return getAverageMastery();
}
