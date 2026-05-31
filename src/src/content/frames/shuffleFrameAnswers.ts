import type { FrameAnswers } from "./types";

/** Randomize answer order so the correct choice is not always in the same slot. */
export function shuffleFrameAnswers(
  answers: FrameAnswers,
  correctIndex: number
): { answers: FrameAnswers; correctIndex: number } {
  const correctText = answers[correctIndex];
  if (!correctText) {
    throw new Error(`shuffleFrameAnswers: invalid correctIndex ${correctIndex}`);
  }

  const order = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const shuffled = order.map((i) => answers[i]!) as FrameAnswers;
  const newCorrectIndex = order.indexOf(correctIndex);

  if (shuffled[newCorrectIndex] !== correctText) {
    throw new Error("shuffleFrameAnswers: correct answer no longer matches question");
  }

  return { answers: shuffled, correctIndex: newCorrectIndex };
}
