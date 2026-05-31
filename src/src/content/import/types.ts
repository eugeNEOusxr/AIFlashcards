/**
 * External dataset shapes — decoupled from UI and render engine.
 * Importers normalize into runtime `Lesson` / `LessonQuestion` via normalize.ts.
 */

import type { LessonPhase, QuestionType, TeachingBlock } from "../curriculumTypes";

/** Portable question payload (JSON, MCQ bank row, derived flashcard). */
export type ImportQuestionRaw = {
  id: string;
  prompt: string;
  explanation?: string;
  phase?: LessonPhase;
  questionType?: QuestionType;
  conceptTags?: string[];
  visualTag?: string;
  difficulty?: 1 | 2 | 3;
  /** MCQ */
  options?: [string, string, string, string] | string[];
  correctIndex?: number;
  /** True / false */
  correctAnswer?: boolean;
  /** Numeric */
  correctValue?: number;
  unit?: string;
  tolerance?: number;
  reinforcement?: {
    flashcardEligible?: boolean;
    confusionTriggers?: string[];
  };
  teachingBlocks?: TeachingBlock[];
  reinforcementPrompt?: string;
};

export type ImportLessonRaw = {
  id: string;
  title: string;
  explanation: string;
  visualKeywords?: string[];
  conceptTags?: string[];
  questions: ImportQuestionRaw[];
  reinforcementFeedback?: {
    correct: string;
    incorrect: string;
  };
};

export type ImportModuleRaw = {
  moduleId: string;
  title: string;
  pathwayId: string;
  lessons: ImportLessonRaw[];
};

export type ImportCurriculumBundle = {
  id: string;
  label: string;
  version?: string;
  modules: ImportModuleRaw[];
};

/** Flashcard-style external pack */
export type FlashcardDatasetV1 = {
  format: "flashcard_v1";
  id: string;
  title?: string;
  cards: {
    id: string;
    front: string;
    back: string;
    tags?: string[];
    visualTag?: string;
  }[];
};

/** MCQ bank external pack */
export type McqBankDatasetV1 = {
  format: "mcq_bank_v1";
  id: string;
  title?: string;
  items: {
    id: string;
    stem: string;
    choices: [string, string, string, string] | string[];
    answerIndex: number;
    explanation?: string;
    phase?: LessonPhase;
    conceptTags?: string[];
    visualTag?: string;
  }[];
};

export type ExternalDataset = ImportCurriculumBundle | FlashcardDatasetV1 | McqBankDatasetV1;
