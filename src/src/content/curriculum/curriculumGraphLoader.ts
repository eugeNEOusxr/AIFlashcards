import type { Lesson, LessonQuestion } from "../curriculumTypes";
import type { AccentColor } from "../../visuals/types";
import type {
  CurriculumGraph,
  CurriculumLessonNode,
  GraphQuestion,
  GraphQuestionMcq,
  GraphQuestionNumeric,
  GraphQuestionTrueFalse,
} from "./graphTypes";
import { normalizeImportQuestion } from "../import/normalize";
import type { ImportQuestionRaw } from "../import/types";
import { ensureStableQuestionId } from "../stableQuestionId";
import { physicsV1 } from "./physics_v1";
import { sortQuestionsByPhase } from "../../engine/questionTypes";

const LEGACY_QUESTION_NAMESPACE: Record<string, string> = {
  "lesson-1-force": "physics.motion.force",
  "lesson-2-contact": "physics.motion.contact",
};

function lessonQuestionNamespace(node: CurriculumLessonNode): string {
  if (node.legacyLessonId && LEGACY_QUESTION_NAMESPACE[node.legacyLessonId]) {
    return LEGACY_QUESTION_NAMESPACE[node.legacyLessonId];
  }
  const slug = node.id.replace(/^lesson\.lesson_/, "").replace(/_/g, ".");
  return `physics.motion.${slug}`;
}

function graphQuestionToImportRaw(
  q: GraphQuestion,
  namespace: string,
  index: number
): ImportQuestionRaw {
  const base: ImportQuestionRaw = {
    id: ensureStableQuestionId(namespace, index, q.id),
    prompt: q.prompt,
    explanation: q.explanation,
    phase: q.phase,
    questionType: q.questionType,
    difficulty: q.difficulty,
    conceptTags: q.conceptTags,
    visualTag: q.visualTag,
    reinforcement: q.reinforcement,
    teachingBlocks: q.teachingBlocks,
    reinforcementPrompt: q.reinforcementPrompt,
  };

  if (q.questionType === "TRUE_FALSE") {
    const tf = q as GraphQuestionTrueFalse;
    return { ...base, questionType: "TRUE_FALSE", correctAnswer: tf.correctAnswer };
  }
  if (q.questionType === "NUMERIC_INPUT") {
    const num = q as GraphQuestionNumeric;
    return {
      ...base,
      questionType: "NUMERIC_INPUT",
      correctValue: num.correctValue,
      unit: num.unit,
      tolerance: num.tolerance,
    };
  }

  const mcq = q as GraphQuestionMcq;
  return {
    ...base,
    questionType: "MCQ",
    options: mcq.options,
    correctIndex: mcq.correctIndex,
  };
}

function graphQuestionsToLesson(node: CurriculumLessonNode): LessonQuestion[] {
  const total = node.questions.length;
  const namespace = lessonQuestionNamespace(node);
  return sortQuestionsByPhase(
    node.questions.map((q, i) =>
      normalizeImportQuestion(graphQuestionToImportRaw(q, namespace, i), i, total)
    )
  );
}

/** Map graph lesson node → runtime Lesson (existing engine contract). */
export function lessonFromGraphNode(node: CurriculumLessonNode): Lesson {
  const anchorMotif =
    node.scene.persistentAnchor.objectId === "bowling_ball" ? "bowling-ball" : "hockey-puck";
  const questions = graphQuestionsToLesson(node);

  return {
    id: node.legacyLessonId,
    title: node.title,
    explanation: node.explanation,
    visualKeywords: node.visualKeywords,
    conceptTags: node.conceptTags,
    visualTheme: {
      backgroundScene: node.scene.backgroundScene,
      accentColors: node.scene.accentColors as [AccentColor, AccentColor],
      motifs: [anchorMotif, ...node.scene.defaultMotifs],
    },
    visualScene: node.scene.visualScene,
    reinforcementFeedback: node.reinforcementFeedback,
    questions,
    phases: node.phases,
    sceneGraph: node.scene,
    curiosityNodes: node.curiosityNodes,
    masteryRules: node.masteryRules,
    memoryHooks: node.memoryHooks,
    graphLessonId: node.id,
  };
}

export function getCurriculumGraph(curriculumId = "curriculum.physics_v1"): CurriculumGraph | undefined {
  if (curriculumId === physicsV1.id) return physicsV1;
  return undefined;
}

/** Ordered lessons for motion-forces from graph (Lesson 1 & 2). */
export function getGraphLessonsForMotionModule(): Lesson[] {
  const mod = physicsV1.modules["module.motion_module"];
  if (!mod) return [];
  return mod.lessonIds.map((lid) => lessonFromGraphNode(mod.lessons[lid]!));
}

export function getGraphLessonByLegacyId(legacyLessonId: string): Lesson | undefined {
  for (const mod of Object.values(physicsV1.modules)) {
    for (const node of Object.values(mod.lessons)) {
      if (node.legacyLessonId === legacyLessonId) return lessonFromGraphNode(node);
    }
  }
  return undefined;
}
