/**
 * LOCKED curriculum graph contract — do not refactor shape without explicit approval.
 * Hierarchy: Curriculum → Module → Lesson → Questions / CuriosityNodes / Scene / MemoryHooks
 */

export type CuriosityTrigger = "why" | "what_if" | "how_change";

export type PersistentAnchorSpec = {
  objectId: "bowling_ball" | "hockey_puck";
  material: "obsidian_gloss";
  fingerHoles: {
    count: 3;
    layout: "standard_grip";
  };
  lighting: {
    rim: boolean;
    specular: "sharp" | "soft";
    bloom: "controlled" | "none";
  };
  /** Anchor must never unmount; only overlays change. */
  persistencePolicy: "immutable_core_layer";
};

export type LessonSceneGraph = {
  environment: "physics_chamber";
  backgroundScene: string;
  accentColors: [string, string];
  persistentAnchor: PersistentAnchorSpec;
  dynamicOverlayPolicy: "overlays_only";
  defaultMotifs: string[];
  visualScene?: {
    focusObject?: string;
    motionType?: string;
    effectOverlay?: string;
    animationStyle?: string;
  };
};

export type QuestionType = "MCQ" | "TRUE_FALSE" | "NUMERIC_INPUT";
export type LessonPhase = "understanding" | "application" | "mastery";

export type GraphTeachingBlock = {
  type: "TEACH";
  kind?: "concept" | "visual" | "explain";
  text: string;
  visualTag?: string;
  title?: string;
  visualEvents?: string[];
  paceHint?: string;
};

export type GraphQuestionBase = {
  id: string;
  prompt: string;
  explanation?: string;
  teachingBlocks?: GraphTeachingBlock[];
  reinforcementPrompt?: string;
  /** Internal lesson layer — drives allowed question types. */
  phase?: LessonPhase;
  questionType?: QuestionType;
  difficulty?: 1 | 2 | 3;
  conceptTags?: string[];
  visualTag?: string;
  visualBehavior?: {
    focusObject?: string;
    highlightEffect?: string;
    motionOverlay?: string;
    motifs?: string[];
  };
  reinforcement?: {
    flashcardEligible?: boolean;
    confusionTriggers?: string[];
  };
};

export type GraphQuestionMcq = GraphQuestionBase & {
  questionType?: "MCQ";
  options: [string, string, string, string];
  correctIndex: number;
};

export type GraphQuestionTrueFalse = GraphQuestionBase & {
  questionType: "TRUE_FALSE";
  correctAnswer: boolean;
};

export type GraphQuestionNumeric = GraphQuestionBase & {
  questionType: "NUMERIC_INPUT";
  correctValue: number;
  unit?: string;
  tolerance?: number;
};

export type GraphQuestion = GraphQuestionMcq | GraphQuestionTrueFalse | GraphQuestionNumeric;

export type LessonPhaseBlock = {
  phase: LessonPhase;
  questionIds: string[];
};

export type CuriosityNode = {
  id: string;
  trigger: CuriosityTrigger;
  prompt: string;
  expansion: string;
  /** Stays within lesson — no navigation */
  staysInLesson: true;
  overlayEffect?: string;
};

export type MasteryRules = {
  passThreshold: number;
  retryBehavior: "adaptive_unseen_first" | "sequential" | "reinforce_weak";
  memoryKey: string;
};

/** Structural placeholders only — persistence wired separately. */
export type MemoryHooks = {
  conceptMasteryKey: string;
  questionHistoryKey: string;
  confusionMapKey: string;
};

export type CurriculumLessonNode = {
  id: string;
  legacyLessonId: string;
  title: string;
  explanation: string;
  visualKeywords: string[];
  conceptTags: string[];
  scene: LessonSceneGraph;
  questions: GraphQuestion[];
  /** Optional explicit phase groupings — questions still carry `phase` at runtime. */
  phases?: LessonPhaseBlock[];
  curiosityNodes: CuriosityNode[];
  masteryRules: MasteryRules;
  memoryHooks: MemoryHooks;
  reinforcementFeedback: {
    correct: string;
    incorrect: string;
  };
};

export type CurriculumModuleNode = {
  id: string;
  legacyModuleId: string;
  title: string;
  pathway: string;
  tier: "beginner" | "intermediate" | "advanced";
  lessonIds: string[];
  lessons: Record<string, CurriculumLessonNode>;
};

export type CurriculumGraph = {
  id: string;
  version: string;
  subject: string;
  modules: Record<string, CurriculumModuleNode>;
};
