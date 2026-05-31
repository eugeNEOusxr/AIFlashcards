import type { FramePhase, LearningFrame } from "./types";

/** UI may only render these sections — derived from phase, never from overlay state */
export type FrameDisplay = {
  frame: LearningFrame;
  phase: FramePhase;
  selectedIndex: number | null;
  isCorrect: boolean | null;
  showFact: boolean;
  showVisualAid: boolean;
  showQuestion: boolean;
  showAnswers: boolean;
  /** User can click choices */
  answersInteractive: boolean;
  /** Green/red on choices — only after feedback phase */
  revealAnswerStyles: boolean;
  showFeedback: boolean;
  feedbackText: string | null;
  showReflection: boolean;
  showClarification: boolean;
};

export function composeFrameDisplay(
  frame: LearningFrame,
  phase: FramePhase,
  selectedIndex: number | null,
  isCorrect: boolean | null
): FrameDisplay {
  const showFeedback =
    phase === "reflection" || phase === "clarification" || phase === "done";
  const revealAnswerStyles = showFeedback && selectedIndex !== null;

  let feedbackText: string | null = null;
  if (showFeedback && isCorrect !== null) {
    feedbackText = isCorrect ? frame.feedback.correct : frame.feedback.incorrect;
  }

  return {
    frame,
    phase,
    selectedIndex,
    isCorrect,
    showFact: true,
    showVisualAid: true,
    showQuestion: true,
    showAnswers: true,
    answersInteractive: phase === "answering",
    revealAnswerStyles,
    showFeedback,
    feedbackText,
    showReflection: phase === "reflection",
    showClarification: phase === "clarification",
  };
}
