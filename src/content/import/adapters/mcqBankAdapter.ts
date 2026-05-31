import type { ImportLessonRaw, McqBankDatasetV1 } from "../types";
import { lessonFromImportRaw } from "../normalize";
import type { Lesson } from "../../curriculumTypes";

function coerceChoices(
  choices: McqBankDatasetV1["items"][0]["choices"]
): [string, string, string, string] {
  const padded = [...choices];
  while (padded.length < 4) padded.push("—");
  return [padded[0]!, padded[1]!, padded[2]!, padded[3]!];
}

/** MCQ bank → one lesson per import (engine handles phased flow). */
export function lessonFromMcqBank(dataset: McqBankDatasetV1): Lesson {
  const raw: ImportLessonRaw = {
    id: dataset.id,
    title: dataset.title ?? "Imported MCQ set",
    explanation:
      "Work through this question set. Each item targets a specific idea — use the reflection checkpoint to mark what still needs work.",
    conceptTags: [...new Set(dataset.items.flatMap((i) => i.conceptTags ?? []))],
    questions: dataset.items.map((item) => ({
      id: item.id,
      prompt: item.stem,
      explanation: item.explanation,
      phase: item.phase,
      questionType: "MCQ" as const,
      options: coerceChoices(item.choices),
      correctIndex: item.answerIndex,
      conceptTags: item.conceptTags,
      visualTag: item.visualTag,
    })),
  };

  return lessonFromImportRaw(raw);
}
