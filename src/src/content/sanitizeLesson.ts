import type { Lesson, LessonQuestion } from "./curriculumTypes";
import {
  logValidationErrors,
  validateLessonQuestion,
  validateLessonQuestions,
} from "./validateQuestion";

/** Drop invalid questions; log structured errors — never render incomplete items. */
export function sanitizeLessonQuestions(lesson: Lesson): Lesson {
  const valid: LessonQuestion[] = [];

  for (const q of lesson.questions) {
    const errors = validateLessonQuestion(q);
    if (errors.length > 0) {
      logValidationErrors(`lesson ${lesson.id}`, errors);
      continue;
    }
    valid.push(q);
  }

  const dupErrors = validateLessonQuestions({ ...lesson, questions: valid }).filter((e) =>
    e.message.includes("Duplicate")
  );
  if (dupErrors.length > 0) {
    logValidationErrors(`lesson ${lesson.id}`, dupErrors);
  }

  return { ...lesson, questions: valid };
}
