import type { LearningFrame, LearningModule } from "./types";
import { shuffleFrameAnswers } from "./shuffleFrameAnswers";

/** Ensures stored correctIndex points at the intended answer text for this question. */
export function assertFrameQaAlignment(frame: LearningFrame): string[] {
  const errors: string[] = [];
  const { answers, correctIndex, question } = frame;

  if (correctIndex < 0 || correctIndex > 3) {
    errors.push(`${frame.id}: correctIndex out of range`);
    return errors;
  }

  const correct = answers[correctIndex];
  if (!correct?.trim()) {
    errors.push(`${frame.id}: correctIndex does not point to an answer`);
    return errors;
  }

  const dupes = answers.filter((a, i) => i !== correctIndex && a === correct);
  if (dupes.length > 0) {
    errors.push(`${frame.id}: duplicate answer text matches the correct option`);
  }

  const unique = new Set(answers);
  if (unique.size !== answers.length) {
    errors.push(`${frame.id}: two or more choices share the same label`);
  }

  try {
    for (let trial = 0; trial < 8; trial++) {
      const shuffled = shuffleFrameAnswers(answers, correctIndex);
      if (shuffled.answers[shuffled.correctIndex] !== correct) {
        errors.push(`${frame.id}: shuffle broke question/answer pairing`);
        break;
      }
    }
  } catch (e) {
    errors.push(`${frame.id}: shuffle failed — ${e instanceof Error ? e.message : String(e)}`);
  }

  if (!question.trim()) {
    errors.push(`${frame.id}: empty question`);
  }

  return errors;
}

export function assertModuleQaAlignment(module: LearningModule): string[] {
  return module.frames.flatMap((frame) => assertFrameQaAlignment(frame));
}
