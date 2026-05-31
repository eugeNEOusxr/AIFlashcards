import type { Lesson } from "../content/curriculumTypes";
import { getWeakConceptIds, normalizeConceptId } from "./conceptMemory";
import { loadMemory } from "./memoryStore";

function nextIndex(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current + 1) % length;
}

/**
 * Prefer unseen questions, then weak-concept reinforcement, then sequential advance.
 */
export function pickNextQuestionIndex(lesson: Lesson, currentIndex: number): number {
  const mem = loadMemory();
  const questions = lesson.questions;
  if (questions.length === 0) return 0;

  const seen = new Set(mem.performance.seenQuestionIds[lesson.id] ?? []);
  const weakConcepts = getWeakConceptIds(mem);

  const unseen = questions
    .map((q, index) => ({ q, index }))
    .filter(({ q }) => !seen.has(q.id));

  if (unseen.length > 0) {
    const ranked = unseen.sort((a, b) => weaknessScore(b.q, weakConcepts) - weaknessScore(a.q, weakConcepts));
    return ranked[0]?.index ?? nextIndex(currentIndex, questions.length);
  }

  const reinforcement = questions
    .map((q, index) => ({ q, index }))
    .filter(({ q }) => {
      const attempts = mem.performance.questionAttempts[q.id] ?? 0;
      const tags = q.conceptTags ?? [];
      return attempts > 0 && tags.some((t) => weakConcepts.has(normalizeConceptId(t)));
    });

  if (reinforcement.length > 0) {
    return reinforcement[0].index;
  }

  return nextIndex(currentIndex, questions.length);
}

function weaknessScore(
  question: { conceptTags?: string[] },
  weakConcepts: Set<string>
): number {
  const tags = question.conceptTags ?? [];
  return tags.filter((t) => weakConcepts.has(normalizeConceptId(t))).length;
}
