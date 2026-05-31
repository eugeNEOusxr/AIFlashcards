import type { ImportLessonRaw } from "../types";
import type { FlashcardDatasetV1 } from "../types";
import { lessonFromImportRaw } from "../normalize";
import type { Lesson } from "../../curriculumTypes";

/** Convert flashcard rows into a single lesson of TRUE_FALSE-style checks (back = explanation). */
export function lessonsFromFlashcardDataset(
  dataset: FlashcardDatasetV1,
  options?: { cardsPerLesson?: number }
): Lesson[] {
  const perLesson = options?.cardsPerLesson ?? 12;
  const lessons: Lesson[] = [];

  for (let offset = 0; offset < dataset.cards.length; offset += perLesson) {
    const slice = dataset.cards.slice(offset, offset + perLesson);
    const lessonIndex = Math.floor(offset / perLesson);

    const raw: ImportLessonRaw = {
      id: `${dataset.id}-lesson-${lessonIndex}`,
      title: dataset.title ?? `Flashcards ${lessonIndex + 1}`,
      explanation:
        "These cards check recall. Answer honestly — the system uses your reflection to pace reinforcement.",
      conceptTags: [...new Set(slice.flatMap((c) => c.tags ?? []))],
      questions: slice.map((card) => ({
        id: card.id,
        prompt: card.front,
        explanation: card.back,
        questionType: "TRUE_FALSE" as const,
        correctAnswer: true,
        conceptTags: card.tags,
        visualTag: card.visualTag,
      })),
    };

    lessons.push(lessonFromImportRaw(raw));
  }

  return lessons;
}
