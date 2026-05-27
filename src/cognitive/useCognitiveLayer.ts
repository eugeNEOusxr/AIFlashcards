import { useCallback, useMemo, useState } from "react";
import type { Lesson, LessonQuestion } from "../content/curriculumTypes";
import { formatCorrectAnswer, selectedChoiceLabel } from "../engine/questionTypes";
import { getAlternatePack } from "./alternateContent";
import { moodClassName, signalToMood } from "./chamberMood";
import {
  getProgressionSnapshot,
  getReinforcementQueue,
  markLessonCompleted,
  recordMissedQuestion,
  recordUnderstandingSignal,
} from "./progressionStore";
import { resolveEducationalTier, tierClassName } from "./tierResolver";
import type { ProgressionSnapshot, UnderstandingSignal } from "./types";

export function useCognitiveLayer(lesson: Lesson, question: LessonQuestion | null) {
  const [snapshot, setSnapshot] = useState<ProgressionSnapshot>(() => getProgressionSnapshot());
  const [lastSignal, setLastSignal] = useState<UnderstandingSignal | null>(null);
  const [orbActive, setOrbActive] = useState(false);

  const alternate = useMemo(() => getAlternatePack(lesson.id), [lesson.id]);

  const completedCount = snapshot.completedLessonIds.length;
  const tier = useMemo(() => resolveEducationalTier(completedCount), [completedCount]);
  const mood = useMemo(() => signalToMood(lastSignal), [lastSignal]);
  const reinforcementCount = snapshot.reinforcementQueue.length;

  const submitSignal = useCallback(
    (signal: UnderstandingSignal) => {
      setLastSignal(signal);
      const next = recordUnderstandingSignal({
        lessonId: lesson.id,
        questionId: question?.id,
        conceptTags: lesson.conceptTags,
        signal,
      });
      setSnapshot(next);
      setOrbActive(signal === "confusing" || signal === "need_visual" || signal === "repeat");

      if (signal === "understand") {
        window.setTimeout(() => setOrbActive(false), 1200);
      }
    },
    [lesson.id, lesson.conceptTags, question?.id]
  );

  const onIncorrectAnswer = useCallback(
    (q: LessonQuestion, wrongAnswerText?: string, choiceIndex?: number | null) => {
      const tags = q.conceptTags?.length ? q.conceptTags : lesson.conceptTags;
      const next = recordMissedQuestion({
        lessonId: lesson.id,
        questionId: q.id,
        conceptTags: tags,
        prompt: q.prompt,
        correctAnswer: formatCorrectAnswer(q),
        wrongAnswerText: wrongAnswerText ?? selectedChoiceLabel(q, choiceIndex ?? null),
        confusionTriggers: q.reinforcement?.confusionTriggers,
      });
      setSnapshot(next);
    },
    [lesson.id, lesson.conceptTags]
  );

  const onLessonCompleted = useCallback(() => {
    const next = markLessonCompleted(lesson.id);
    setSnapshot(next);
  }, [lesson.id]);

  const alternateMessage = useMemo(() => {
    if (!lastSignal) return null;
    if (lastSignal === "confusing" || lastSignal === "repeat") return alternate.simpler;
    if (lastSignal === "need_visual") return alternate.visualHint;
    if (lastSignal === "partial") return alternate.analogy;
    return null;
  }, [lastSignal, alternate]);

  return {
    tier,
    tierClass: tierClassName(tier),
    mood,
    moodClass: moodClassName(mood),
    lastSignal,
    orbActive,
    alternateMessage,
    reinforcementQueue: getReinforcementQueue(),
    reinforcementCount,
    submitSignal,
    onIncorrectAnswer,
    onLessonCompleted,
    refreshSnapshot: () => setSnapshot(getProgressionSnapshot()),
  };
}
