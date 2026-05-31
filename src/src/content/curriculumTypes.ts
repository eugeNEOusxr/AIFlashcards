import type { LessonSceneGraph, CuriosityNode, MasteryRules, MemoryHooks } from "./curriculum/graphTypes";
import type { LessonVisualTheme } from "../visuals/types";

export type PhaseMode = "TEACH" | "REINFORCE" | "ASK" | "FEEDBACK" | "ADVANCE";

export type TeachBlockKind = "concept" | "visual" | "explain";

export type TeachingBlock = {
  type: "TEACH";
  kind?: TeachBlockKind;
  text: string;
  visualTag?: string;
  title?: string;
  /** Scripted overlay activations — renderer fades these in without remounting anchor */
  visualEvents?: string[];
  /** Optional short hint shown only when visualEvents are active */
  paceHint?: string;
};

export type LessonPhase = "understanding" | "application" | "mastery";
export type QuestionType = "MCQ" | "TRUE_FALSE" | "NUMERIC_INPUT";

export type OptionId = "A" | "B" | "C" | "D";

export type QuestionVisualBehavior = {
  focusObject?: string;
  highlightEffect?: string;
  motionOverlay?: string;
  motifs?: string[];
};

export type QuestionReinforcement = {
  flashcardEligible?: boolean;
  confusionTriggers?: string[];
};

export type QuestionCommon = {
  id: string;
  prompt: string;
  explanation?: string;
  phase: LessonPhase;
  questionType: QuestionType;
  difficulty?: 1 | 2 | 3;
  conceptTags?: string[];
  /** Dataset / graph hint for visuals — resolved to visualBehavior at import time */
  visualTag?: string;
  visualBehavior?: QuestionVisualBehavior;
  reinforcement?: QuestionReinforcement;
  /** Learn Mode — shown before this question (not used in Practice Mode) */
  teachingBlocks?: TeachingBlock[];
  /** Short bridge from teaching → question */
  reinforcementPrompt?: string;
};

export type McqLessonQuestion = QuestionCommon & {
  questionType: "MCQ";
  options: [string, string, string, string];
  correctIndex: number;
};

export type TrueFalseLessonQuestion = QuestionCommon & {
  questionType: "TRUE_FALSE";
  correctAnswer: boolean;
};

export type NumericLessonQuestion = QuestionCommon & {
  questionType: "NUMERIC_INPUT";
  correctValue: number;
  unit?: string;
  tolerance?: number;
};

export type LessonQuestion = McqLessonQuestion | TrueFalseLessonQuestion | NumericLessonQuestion;

/** @deprecated Use LessonQuestion — kept for imports that expect MCQ-only naming. */
export type MCQQuestion = McqLessonQuestion;

export type LessonVisualScene = {
  focusObject?: string;
  motionType?: string;
  effectOverlay?: string;
  animationStyle?: string;
};

export type Lesson = {
  id: string;
  title: string;
  explanation: string;
  visualKeywords: string[];
  conceptTags: string[];
  visualTheme?: LessonVisualTheme;
  visualScene?: LessonVisualScene;
  reinforcementFeedback: {
    correct: string;
    incorrect: string;
  };
  questions: LessonQuestion[];
  phases?: { phase: LessonPhase; questionIds: string[] }[];
  /** Data graph fields — Lesson 1 & 2 from curriculum.physics_v1 */
  graphLessonId?: string;
  sceneGraph?: LessonSceneGraph;
  curiosityNodes?: CuriosityNode[];
  masteryRules?: MasteryRules;
  memoryHooks?: MemoryHooks;
};

export type ModuleEnvironment = {
  theme: string;
  primaryColors: string[];
  backgroundStyle: string;
  particleStyle: string;
};

export type CurriculumModule = {
  moduleId: string;
  title: string;
  pathway: string;
  tier: "beginner" | "intermediate" | "advanced";
  environment: ModuleEnvironment;
  visualMotifs: string[];
  lessonId: string;
};
