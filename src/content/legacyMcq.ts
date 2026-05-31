import type { LessonQuestion, McqLessonQuestion } from "./curriculumTypes";
import { ensureStableQuestionId } from "./stableQuestionId";
import { inferPhaseFromIndex } from "../engine/questionTypes";

type RawMcq = {
  id?: string;
  prompt: string;
  /** If omitted, a deterministic explanation is derived from the correct option at import time. */
  explanation?: string;
  options: [string, string, string, string];
  correctIndex: number;
  conceptTags?: string[];
  visualTag?: string;
};

function resolveExplanation(_namespace: string, q: RawMcq, _index: number): string {
  const trimmed = q.explanation?.trim();
  if (trimmed) return trimmed;
  const correct = q.options[q.correctIndex] ?? "the correct option";
  return `The correct answer is: ${correct}.`;
}

/** Attach phase, type, and stable ids — content-time only. */
export function phasedMcqQuestions(namespace: string, questions: RawMcq[]): LessonQuestion[] {
  const total = questions.length;
  return questions.map((q, index) => {
    const phase = inferPhaseFromIndex(index, total);
    const id = ensureStableQuestionId(namespace, index, q.id);
    const base: Omit<McqLessonQuestion, "phase" | "questionType"> = {
      id,
      prompt: q.prompt,
      explanation: resolveExplanation(namespace, q, index),
      options: q.options,
      correctIndex: q.correctIndex,
      conceptTags: q.conceptTags,
      visualTag: q.visualTag,
    };
    return {
      ...base,
      phase,
      questionType: "MCQ",
    };
  });
}
