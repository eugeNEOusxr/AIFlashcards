import type { LessonQuestion, McqLessonQuestion } from "./curriculumTypes";
import { inferPhaseFromIndex } from "../engine/questionTypes";

type RawMcq = Omit<McqLessonQuestion, "phase" | "questionType">;

/** Attach phase + type to inline chapter questions (MCQ-only legacy content). */
export function phasedMcqQuestions(questions: RawMcq[]): LessonQuestion[] {
  const total = questions.length;
  return questions.map((q, index) => {
    const phase = inferPhaseFromIndex(index, total);
    return {
      ...q,
      phase,
      questionType: "MCQ",
    };
  });
}
