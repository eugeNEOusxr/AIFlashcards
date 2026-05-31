import { LANDMARK_FLOW_ORDER } from "../../world/physicsModuleLandmarks";
import { loadFrameProgress } from "../../memory/frameProgress";
import { getModule, getModuleForLandmark } from "./registry";
import { shuffleFrameAnswers } from "./shuffleFrameAnswers";
import type { LearningFrame } from "./types";

export type ReviewFlashcard = {
  id: string;
  moduleTitle: string;
  landmarkLabel: string;
  frameTitle: string;
  fact: string;
  question: string;
  answers: LearningFrame["answers"];
  correctIndex: number;
  feedbackCorrect: string;
  feedbackIncorrect: string;
};

const LANDMARK_LABELS: Record<string, string> = {
  motion: "Motion & Forces",
  forces: "Forces",
  energy: "Energy",
  waves: "Waves",
  electricity: "Electricity",
};

export function buildReviewDeckFromProgress(): ReviewFlashcard[] {
  const store = loadFrameProgress();
  const cards: ReviewFlashcard[] = [];

  for (const landmarkId of LANDMARK_FLOW_ORDER) {
    const mod = getModuleForLandmark(landmarkId);
    if (!mod) continue;
    const progress = store.modules[mod.id];
    if (!progress?.completedFrameIds.length) continue;

    for (const frame of mod.frames) {
      if (!progress.completedFrameIds.includes(frame.id)) continue;
      const { answers, correctIndex } = shuffleFrameAnswers(frame.answers, frame.correctIndex);
      cards.push({
        id: `${mod.id}:${frame.id}`,
        moduleTitle: mod.title,
        landmarkLabel: LANDMARK_LABELS[landmarkId] ?? landmarkId,
        frameTitle: frame.title,
        fact: frame.fact,
        question: frame.question,
        answers,
        correctIndex,
        feedbackCorrect: frame.feedback.correct,
        feedbackIncorrect: frame.feedback.incorrect,
      });
    }
  }

  return cards;
}

/** Fresh shuffle for one card (e.g. when revisiting in the sidebar). */
export function reshuffleReviewCard(card: ReviewFlashcard, sourceFrame: LearningFrame): ReviewFlashcard {
  const { answers, correctIndex } = shuffleFrameAnswers(sourceFrame.answers, sourceFrame.correctIndex);
  return { ...card, answers, correctIndex };
}

export function sourceFrameForReviewCard(cardId: string): LearningFrame | null {
  const sep = cardId.indexOf(":");
  if (sep < 0) return null;
  const moduleId = cardId.slice(0, sep);
  const frameId = cardId.slice(sep + 1);
  const module = getModule(moduleId);
  return module?.frames.find((f) => f.id === frameId) ?? null;
}
