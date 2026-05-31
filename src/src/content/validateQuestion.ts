import type { Lesson, LessonQuestion } from "./curriculumTypes";

/** Permanent id: physics.motion.force.q001 */
export const STABLE_QUESTION_ID_PATTERN = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+\.q\d{3}$/;

export type QuestionValidationError = {
  questionId: string;
  field: string;
  message: string;
};

function err(questionId: string, field: string, message: string): QuestionValidationError {
  return { questionId, field, message };
}

function answersForQuestion(q: LessonQuestion): string[] {
  switch (q.questionType) {
    case "MCQ":
      return [...q.options];
    case "TRUE_FALSE":
      return ["True", "False"];
    case "NUMERIC_INPUT":
      return [];
  }
}

function correctAnswerForQuestion(q: LessonQuestion): string {
  switch (q.questionType) {
    case "MCQ":
      return q.options[q.correctIndex] ?? "";
    case "TRUE_FALSE":
      return q.correctAnswer ? "True" : "False";
    case "NUMERIC_INPUT":
      return q.unit ? `${q.correctValue} ${q.unit}` : String(q.correctValue);
  }
}

/** Validate one runtime question before render. */
export function validateLessonQuestion(q: LessonQuestion): QuestionValidationError[] {
  const errors: QuestionValidationError[] = [];
  const id = q.id?.trim() ?? "";

  if (!id) {
    errors.push(err("(missing)", "id", "Question id is required"));
  } else if (!STABLE_QUESTION_ID_PATTERN.test(id)) {
    errors.push(
      err(
        id,
        "id",
        `Question id must match physics.topic.lesson.qNNN — got "${id}"`
      )
    );
  }

  if (!q.prompt?.trim()) {
    errors.push(err(id || "(missing)", "prompt", "prompt is required"));
  }

  if (!q.explanation?.trim()) {
    errors.push(err(id || "(missing)", "explanation", "explanation is required"));
  }

  const type = q.questionType;
  if (!type) {
    errors.push(err(id || "(missing)", "type", "questionType is required"));
    return errors;
  }

  const answers = answersForQuestion(q);
  if ((type === "MCQ" || type === "TRUE_FALSE") && answers.length < 2) {
    errors.push(err(id || "(missing)", "answers", "At least two answers are required"));
  }

  if (type === "MCQ") {
    if (q.correctIndex < 0 || q.correctIndex > 3 || !q.options[q.correctIndex]) {
      errors.push(err(id || "(missing)", "correctAnswer", "correctIndex must point to a valid option"));
    }
  }

  if (type === "TRUE_FALSE" && typeof q.correctAnswer !== "boolean") {
    errors.push(err(id || "(missing)", "correctAnswer", "correctAnswer boolean is required"));
  }

  if (type === "NUMERIC_INPUT") {
    if (typeof q.correctValue !== "number" || Number.isNaN(q.correctValue)) {
      errors.push(err(id || "(missing)", "correctAnswer", "correctValue number is required"));
    }
  }

  const correct = correctAnswerForQuestion(q);
  if (!correct && type !== "NUMERIC_INPUT") {
    errors.push(err(id || "(missing)", "correctAnswer", "correctAnswer could not be resolved"));
  }

  return errors;
}

export function validateLessonQuestions(lesson: Lesson): QuestionValidationError[] {
  const seen = new Set<string>();
  const all: QuestionValidationError[] = [];

  for (const q of lesson.questions) {
    const fieldErrors = validateLessonQuestion(q);
    all.push(...fieldErrors);

    if (q.id) {
      if (seen.has(q.id)) {
        all.push(err(q.id, "id", `Duplicate question id "${q.id}" in lesson ${lesson.id}`));
      }
      seen.add(q.id);
    }
  }

  return all;
}

export function logValidationErrors(context: string, errors: QuestionValidationError[]): void {
  if (errors.length === 0) return;
  console.error(`[curriculum-validation] ${context}`, {
    count: errors.length,
    errors: errors.map((e) => ({ questionId: e.questionId, field: e.field, message: e.message })),
  });
}
