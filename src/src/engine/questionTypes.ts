import type {
  LessonPhase,
  LessonQuestion,
  QuestionType,
} from "../content/curriculumTypes";

export type { LessonPhase, QuestionType };

const PHASE_ORDER: Record<LessonPhase, number> = {
  understanding: 0,
  application: 1,
  mastery: 2,
};

export function phaseOrder(phase: LessonPhase): number {
  return PHASE_ORDER[phase];
}

export function phaseLabel(phase: LessonPhase): string {
  switch (phase) {
    case "understanding":
      return "Understanding";
    case "application":
      return "Application";
    case "mastery":
      return "Mastery";
  }
}

export function allowedTypesForPhase(phase: LessonPhase): QuestionType[] {
  switch (phase) {
    case "understanding":
      return ["MCQ", "TRUE_FALSE"];
    case "application":
      return ["MCQ", "TRUE_FALSE", "NUMERIC_INPUT"];
    case "mastery":
      return ["NUMERIC_INPUT", "MCQ", "TRUE_FALSE"];
  }
}

/** Phase controls allowed types — explicit type must stay in-band. */
export function resolveQuestionType(phase: LessonPhase, explicit?: QuestionType): QuestionType {
  const allowed = allowedTypesForPhase(phase);
  if (explicit && allowed.includes(explicit)) return explicit;
  return allowed[0];
}

export function inferPhaseFromIndex(index: number, total: number): LessonPhase {
  const chunk = Math.max(1, Math.ceil(total / 3));
  if (index < chunk) return "understanding";
  if (index < chunk * 2) return "application";
  return "mastery";
}

export function sortQuestionsByPhase<T extends { phase: LessonPhase }>(questions: T[]): T[] {
  return [...questions].sort((a, b) => phaseOrder(a.phase) - phaseOrder(b.phase));
}

export function checkAnswer(
  question: LessonQuestion,
  choiceIndex: number | null,
  numericValue?: number
): boolean {
  switch (question.questionType) {
    case "MCQ":
      return choiceIndex === question.correctIndex;
    case "TRUE_FALSE":
      return choiceIndex === (question.correctAnswer ? 0 : 1);
    case "NUMERIC_INPUT": {
      if (numericValue === undefined || Number.isNaN(numericValue)) return false;
      const tol =
        question.tolerance ??
        Math.max(0.001, Math.abs(question.correctValue) * 0.02);
      return Math.abs(numericValue - question.correctValue) <= tol;
    }
  }
}

export function formatCorrectAnswer(question: LessonQuestion): string {
  switch (question.questionType) {
    case "MCQ":
      return question.options[question.correctIndex];
    case "TRUE_FALSE":
      return question.correctAnswer ? "True" : "False";
    case "NUMERIC_INPUT":
      return question.unit
        ? `${question.correctValue} ${question.unit}`
        : String(question.correctValue);
  }
}

export function selectedChoiceLabel(
  question: LessonQuestion,
  choiceIndex: number | null
): string | undefined {
  if (choiceIndex === null) return undefined;
  if (question.questionType === "MCQ") return question.options[choiceIndex];
  if (question.questionType === "TRUE_FALSE") {
    return choiceIndex === 0 ? "True" : "False";
  }
  return undefined;
}

export function isChoiceQuestion(question: LessonQuestion): boolean {
  return question.questionType === "MCQ" || question.questionType === "TRUE_FALSE";
}
