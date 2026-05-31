import { landmarkFlowForSubject, landmarkLabelsForSubject } from "./subjectLandmarks";
import { loadFrameProgress } from "../../memory/frameProgress";
import { getModule, getModuleForLandmark } from "./registry";
import { shuffleFrameAnswers } from "./shuffleFrameAnswers";
import type { SubjectId } from "../../world/types";
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

export function buildReviewDeckFromProgress(subjectId: SubjectId = "physics"): ReviewFlashcard[] {
  const store = loadFrameProgress();
  const cards: ReviewFlashcard[] = [];
  const labels = landmarkLabelsForSubject(subjectId);

  for (const landmarkId of landmarkFlowForSubject(subjectId)) {
    const mod = getModuleForLandmark(landmarkId, subjectId);
    if (!mod) continue;
    const progress = store.modules[mod.id];
    if (!progress?.completedFrameIds.length) continue;

    for (const frame of mod.frames) {
      if (!progress.completedFrameIds.includes(frame.id)) continue;
      const { answers, correctIndex } = shuffleFrameAnswers(frame.answers, frame.correctIndex);
      cards.push({
        id: `${mod.id}:${frame.id}`,
        moduleTitle: mod.title,
        landmarkLabel: labels[landmarkId] ?? landmarkId,
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
