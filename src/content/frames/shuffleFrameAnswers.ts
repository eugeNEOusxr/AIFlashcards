import type { FrameAnswers } from "./types";

/** Randomize answer order so the correct choice is not always in the same slot. */
export function shuffleFrameAnswers(
  answers: FrameAnswers,
  correctIndex: number
): { answers: FrameAnswers; correctIndex: number } {
  const order = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const shuffled: string[] = order.map((i) => answers[i]!);
  return {
    answers: shuffled as FrameAnswers,
    correctIndex: order.indexOf(correctIndex),
  };
}
