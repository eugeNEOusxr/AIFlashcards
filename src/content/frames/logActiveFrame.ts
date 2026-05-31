import type { LearningFrame } from "./types";

/** Dev-only: verify renderer source is frame data, not legacy lessons */
export function logActiveFrame(frame: LearningFrame | null, context: string): void {
  if (!import.meta.env.DEV || !frame) return;
  console.log(`[frame] ${context}`, {
    id: frame.id,
    conceptTag: frame.conceptTag,
    fact: frame.fact,
    visualAid: frame.visualAid,
    question: frame.question,
    answers: frame.answers,
    feedback: frame.feedback,
  });
}
