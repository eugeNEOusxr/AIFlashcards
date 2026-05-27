import type { Lesson, LessonQuestion } from "../curriculumTypes";
import type { AccentColor } from "../../visuals/types";
import type {
  CurriculumGraph,
  CurriculumLessonNode,
  GraphQuestion,
  GraphQuestionMcq,
  GraphQuestionNumeric,
  GraphQuestionTrueFalse,
  LessonPhase,
} from "./graphTypes";
import { physicsV1 } from "./physics_v1";
import {
  inferPhaseFromIndex,
  resolveQuestionType,
  sortQuestionsByPhase,
} from "../../engine/questionTypes";

function isTrueFalse(q: GraphQuestion): q is GraphQuestionTrueFalse {
  return q.questionType === "TRUE_FALSE";
}

function isNumeric(q: GraphQuestion): q is GraphQuestionNumeric {
  return q.questionType === "NUMERIC_INPUT";
}

function visualBehaviorFromTag(
  tag?: string
): LessonQuestion["visualBehavior"] | undefined {
  if (!tag) return undefined;
  if (tag.includes("collision") || tag.includes("bowling")) {
    return {
      focusObject: tag,
      highlightEffect: "impact_pulse",
      motionOverlay: "collision_lines",
      motifs: ["contact-ripple", "push-force-arrows"],
    };
  }
  if (tag.includes("magnet")) {
    return { focusObject: tag, motifs: ["magnet-arcs", "field-lines"] };
  }
  if (tag.includes("gravity")) {
    return { focusObject: tag, motifs: ["gravity-pull", "gravity-field"] };
  }
  return { focusObject: tag, motifs: ["force-arrows", "motion-lines"] };
}

function detectGraphKind(q: GraphQuestion): "MCQ" | "TRUE_FALSE" | "NUMERIC_INPUT" {
  if (isTrueFalse(q)) return "TRUE_FALSE";
  if (isNumeric(q)) return "NUMERIC_INPUT";
  return "MCQ";
}

function graphQuestionToLesson(
  q: GraphQuestion,
  index: number,
  total: number
): LessonQuestion {
  const phase: LessonPhase = q.phase ?? inferPhaseFromIndex(index, total);
  const detected = detectGraphKind(q);
  const questionType = q.questionType
    ? resolveQuestionType(phase, q.questionType)
    : detected;
  const base = {
    id: q.id,
    prompt: q.prompt,
    explanation: q.explanation,
    phase,
    questionType,
    difficulty: q.difficulty,
    conceptTags: q.conceptTags,
    visualBehavior: q.visualBehavior ?? visualBehaviorFromTag(q.visualTag),
    reinforcement: q.reinforcement,
  };

  if (questionType === "TRUE_FALSE" && isTrueFalse(q)) {
    return { ...base, questionType: "TRUE_FALSE", correctAnswer: q.correctAnswer };
  }

  if (questionType === "NUMERIC_INPUT" && isNumeric(q)) {
    return {
      ...base,
      questionType: "NUMERIC_INPUT",
      correctValue: q.correctValue,
      unit: q.unit,
      tolerance: q.tolerance,
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

/** Map graph lesson node → runtime Lesson (existing engine contract). */
export function lessonFromGraphNode(node: CurriculumLessonNode): Lesson {
  const anchorMotif =
    node.scene.persistentAnchor.objectId === "bowling_ball" ? "bowling-ball" : "hockey-puck";
  const total = node.questions.length;
  const questions = sortQuestionsByPhase(
    node.questions.map((q, i) => graphQuestionToLesson(q, i, total))
  );

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
