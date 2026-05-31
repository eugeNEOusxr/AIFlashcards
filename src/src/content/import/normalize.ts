import type { Lesson, LessonQuestion, LessonPhase } from "../curriculumTypes";
import {
  inferPhaseFromIndex,
  resolveQuestionType,
  sortQuestionsByPhase,
} from "../../engine/questionTypes";
import type { ImportLessonRaw, ImportQuestionRaw } from "./types";

function coerceOptions(
  options: ImportQuestionRaw["options"]
): [string, string, string, string] | null {
  if (!options || options.length < 4) return null;
  return [options[0]!, options[1]!, options[2]!, options[3]!];
}

function detectKind(q: ImportQuestionRaw): "MCQ" | "TRUE_FALSE" | "NUMERIC_INPUT" {
  if (q.questionType) return q.questionType;
  if (typeof q.correctAnswer === "boolean") return "TRUE_FALSE";
  if (typeof q.correctValue === "number") return "NUMERIC_INPUT";
  return "MCQ";
}

function visualBehaviorFromTag(tag?: string): LessonQuestion["visualBehavior"] | undefined {
  if (!tag) return undefined;
  return { focusObject: tag, motifs: ["force-arrows", "motion-lines"] };
}

/** Normalize one external/import question → engine `LessonQuestion`. */
export function normalizeImportQuestion(
  q: ImportQuestionRaw,
  index: number,
  total: number
): LessonQuestion {
  const phase: LessonPhase = q.phase ?? inferPhaseFromIndex(index, total);
  const detected = detectKind(q);
  const questionType = q.questionType ? resolveQuestionType(phase, q.questionType) : detected;

  const explanation =
    q.explanation?.trim() ||
    (detected === "MCQ" && q.options?.[q.correctIndex ?? 0]
      ? `The correct answer is: ${q.options[q.correctIndex ?? 0]}.`
      : detected === "TRUE_FALSE"
        ? `The correct answer is ${q.correctAnswer ? "True" : "False"}.`
        : typeof q.correctValue === "number"
          ? `The correct value is ${q.correctValue}${q.unit ? ` ${q.unit}` : ""}.`
          : "");

  const base = {
    id: q.id,
    prompt: q.prompt,
    explanation,
    phase,
    questionType,
    difficulty: q.difficulty,
    conceptTags: q.conceptTags,
    visualTag: q.visualTag,
    visualBehavior: visualBehaviorFromTag(q.visualTag),
    reinforcement: q.reinforcement,
    teachingBlocks: q.teachingBlocks,
    reinforcementPrompt: q.reinforcementPrompt,
  };

  if (questionType === "TRUE_FALSE") {
    return {
      ...base,
      questionType: "TRUE_FALSE",
      correctAnswer: q.correctAnswer ?? false,
    };
  }

  if (questionType === "NUMERIC_INPUT") {
    return {
      ...base,
      questionType: "NUMERIC_INPUT",
      correctValue: q.correctValue ?? 0,
      unit: q.unit,
      tolerance: q.tolerance,
    };
  }

  const options = coerceOptions(q.options);
  if (!options) {
    return {
      ...base,
      questionType: "TRUE_FALSE",
      correctAnswer: true,
    };
  }

  return {
    ...base,
    questionType: "MCQ",
    options,
    correctIndex: Math.max(0, Math.min(3, q.correctIndex ?? 0)),
  };
}

/** Normalize imported lesson JSON → runtime `Lesson` (rendering layer consumes this only). */
export function lessonFromImportRaw(raw: ImportLessonRaw): Lesson {
  const total = raw.questions.length;
  const questions = sortQuestionsByPhase(
    raw.questions.map((q, i) => normalizeImportQuestion(q, i, total))
  );

  return {
    id: raw.id,
    title: raw.title,
    explanation: raw.explanation,
    visualKeywords: raw.visualKeywords ?? [],
    conceptTags: raw.conceptTags ?? [],
    reinforcementFeedback: raw.reinforcementFeedback ?? {
      correct: "Concept integrated.",
      incorrect: "Revisit the key idea and try again.",
    },
    questions,
  };
}
