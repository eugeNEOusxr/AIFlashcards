import type { ProgressionSnapshot } from "../cognitive/types";
import type { PathwayId } from "../world/types";
import {
  applyAnswerToConcepts,
  applySignalToConcepts,
  averageMasteryScore,
  normalizeConceptId,
} from "./conceptMemory";
import { getChapterForPathway } from "../content/chapterRegistry";
import { getGraphLessonByLegacyId } from "../content/curriculum/curriculumGraphLoader";
import type { Lesson } from "../content/curriculumTypes";
import { dispatchMemoryUpdated } from "./memoryEvents";
import type {
  LearningMemory,
  SessionMemory,
  SessionPathwaySlice,
  SessionVisualState,
  AnswerRecord,
  PathwayCurriculumState,
} from "./types";
import { moduleIdForLesson } from "./sessionRestore";
import type { UnderstandingSignal } from "../cognitive/types";

const MEMORY_KEY = "cls:learning-memory:v1";
const LEGACY_PROGRESSION_KEY = "cls:progression:v1";
const LEGACY_PATHWAY_KEY = "cls:pathway-complete:v1";

const DEFAULT_PATHWAY: PathwayId = "motion-forces";

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultPathwaySlice(): SessionPathwaySlice {
  return {
    currentLessonIndex: 0,
    currentQuestionIndex: 0,
    correctAnswersPerLesson: 0,
    currentMode: "TEACH",
    selectedAnswerIndex: null,
    submittedNumericValue: null,
    lastAnswerCorrect: null,
    chapterComplete: false,
    maxUnlockedLessonIndex: 0,
  };
}

function emptyMemory(): LearningMemory {
  return {
    version: 1,
    session: {
      pathwayId: DEFAULT_PATHWAY,
      pathways: { [DEFAULT_PATHWAY]: defaultPathwaySlice() },
      activeLessonId: null,
      activeQuestionId: null,
      visualState: null,
      navScreen: null,
      lastActiveAt: Date.now(),
    },
    performance: {
      answers: [],
      seenQuestionIds: {},
      questionAttempts: {},
    },
    concept: { concepts: {} },
    curriculum: {
      completedLessonIds: [],
      completedPathwayIds: [],
      pathwayProgress: {},
    },
    graphMemory: {
      conceptMastery: {},
      questionHistory: {},
      confusionMap: {},
    },
    signals: [],
    reinforcementQueue: [],
    updatedAt: Date.now(),
  };
}

function migrateLegacy(): LearningMemory | null {
  try {
    const progRaw = localStorage.getItem(LEGACY_PROGRESSION_KEY);
    const pathRaw = localStorage.getItem(LEGACY_PATHWAY_KEY);
    if (!progRaw && !pathRaw) return null;

    const mem = emptyMemory();
    if (progRaw) {
      const parsed = JSON.parse(progRaw) as ProgressionSnapshot;
      mem.signals = parsed.signals ?? [];
      mem.reinforcementQueue = (parsed.reinforcementQueue ?? []) as LearningMemory["reinforcementQueue"];
      mem.curriculum.completedLessonIds = parsed.completedLessonIds ?? [];

      for (const [key, record] of Object.entries(parsed.concepts ?? {})) {
        const conceptId = key.includes("::") ? key.split("::")[1]! : record.conceptId;
        const normalized = conceptId.toLowerCase().replace(/\s+/g, "_");
        mem.concept.concepts[normalized] = {
          conceptId: normalized,
          tier: record.masteryScore >= 85 ? "mastered" : record.masteryScore >= 65 ? "strong" : record.masteryScore >= 35 ? "learning" : "weak",
          masteryScore: record.masteryScore,
          confusionCount: record.confusionCount,
          correctCount: record.positiveCount,
          incorrectCount: 0,
          positiveSignals: record.positiveCount,
          lastSignal: record.lastSignal,
          needsReinforcement: record.needsReinforcement,
          lessonIds: [record.lessonId],
          lastSeenAt: Date.now(),
        };
      }
    }

    if (pathRaw) {
      const pathways = JSON.parse(pathRaw) as PathwayId[];
      if (Array.isArray(pathways)) {
        mem.curriculum.completedPathwayIds = pathways;
        for (const pid of pathways) {
          mem.curriculum.pathwayProgress[pid] = {
            maxUnlockedLessonIndex: 99,
            chapterComplete: true,
            completedModuleIds: [],
          };
        }
      }
    }

    return mem;
  } catch {
    return null;
  }
}

export function loadMemory(): LearningMemory {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LearningMemory;
      return normalizeMemory(parsed);
    }
    const migrated = migrateLegacy();
    if (migrated) {
      saveMemory(migrated);
      return migrated;
    }
  } catch {
    /* corrupt */
  }
  return emptyMemory();
}

function normalizeMemory(parsed: Partial<LearningMemory>): LearningMemory {
  const base = emptyMemory();
  return {
    version: 1,
    session: {
      ...base.session,
      ...parsed.session,
      visualState: parsed.session?.visualState ?? null,
      navScreen: parsed.session?.navScreen ?? null,
    },
    performance: { ...base.performance, ...parsed.performance },
    concept: { concepts: parsed.concept?.concepts ?? {} },
    curriculum: {
      completedLessonIds: parsed.curriculum?.completedLessonIds ?? [],
      completedPathwayIds: parsed.curriculum?.completedPathwayIds ?? [],
      pathwayProgress: parsed.curriculum?.pathwayProgress ?? {},
    },
    graphMemory: {
      conceptMastery: parsed.graphMemory?.conceptMastery ?? {},
      questionHistory: parsed.graphMemory?.questionHistory ?? {},
      confusionMap: parsed.graphMemory?.confusionMap ?? {},
    },
    signals: parsed.signals ?? [],
    reinforcementQueue: parsed.reinforcementQueue ?? [],
    updatedAt: parsed.updatedAt ?? Date.now(),
  };
}

export function saveMemory(mem: LearningMemory): void {
  mem.updatedAt = Date.now();
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(mem));
    dispatchMemoryUpdated();
  } catch {
    /* quota */
  }
}

export function updateMemory(mutator: (mem: LearningMemory) => void): LearningMemory {
  const mem = loadMemory();
  mutator(mem);
  saveMemory(mem);
  return mem;
}

/** Hydrate engine pathways — curriculum unlocks are floor, session is source of truth for position. */
export function hydrateSessionPathways(
  pathways: SessionMemory["pathways"]
): SessionMemory["pathways"] {
  const mem = loadMemory();
  const merged = { ...pathways };

  for (const [pid, cur] of Object.entries(mem.curriculum.pathwayProgress) as [PathwayId, PathwayCurriculumState][]) {
    const existing = merged[pid] ?? defaultPathwaySlice();
    merged[pid] = {
      ...existing,
      submittedNumericValue: existing.submittedNumericValue ?? null,
      maxUnlockedLessonIndex: Math.max(existing.maxUnlockedLessonIndex, cur.maxUnlockedLessonIndex),
      /** Session never hard-locks — curriculum tracks completion separately */
      chapterComplete: false,
    };
  }

  for (const pid of Object.keys(merged) as PathwayId[]) {
    const slice = merged[pid];
    if (!slice) continue;
    const chapterLen = getChapterForPathway(pid).length;
    const lastIdx = Math.max(0, chapterLen - 1);
    let maxUnlocked = slice.maxUnlockedLessonIndex;
    if (chapterLen > 0 && maxUnlocked > lastIdx) {
      maxUnlocked = lastIdx;
    }
    merged[pid] = {
      ...slice,
      submittedNumericValue: slice.submittedNumericValue ?? null,
      maxUnlockedLessonIndex: maxUnlocked,
      /** Completion is tracked in curriculum; session never hard-locks replay. */
      chapterComplete: false,
    };
  }

  return merged;
}

export function loadSessionMemory(): SessionMemory {
  const mem = loadMemory();
  return {
    ...mem.session,
    pathways: hydrateSessionPathways(mem.session.pathways),
  };
}

export function persistSessionMemory(session: SessionMemory): void {
  updateMemory((mem) => {
    mem.session = {
      ...session,
      lastActiveAt: Date.now(),
    };

    for (const [pid, slice] of Object.entries(session.pathways) as [PathwayId, SessionPathwaySlice][]) {
      const prev = mem.curriculum.pathwayProgress[pid] ?? {
        maxUnlockedLessonIndex: 0,
        chapterComplete: false,
        completedModuleIds: [],
      };
      mem.curriculum.pathwayProgress[pid] = {
        maxUnlockedLessonIndex: Math.max(prev.maxUnlockedLessonIndex, slice.maxUnlockedLessonIndex),
        chapterComplete: prev.chapterComplete || slice.chapterComplete,
        completedModuleIds: prev.completedModuleIds,
      };
    }
  });
}

/** Ensure graph memory hook keys exist — no scoring persistence yet. */
function touchGraphMemoryPlaceholders(mem: LearningMemory, lesson: Lesson | undefined): void {
  const hooks = lesson?.memoryHooks;
  if (!hooks) return;

  if (!(hooks.conceptMasteryKey in mem.graphMemory.conceptMastery)) {
    mem.graphMemory.conceptMastery[hooks.conceptMasteryKey] = { masteryScore: null, tier: null };
  }
  if (!(hooks.questionHistoryKey in mem.graphMemory.questionHistory)) {
    mem.graphMemory.questionHistory[hooks.questionHistoryKey] = [];
  }
  if (!(hooks.confusionMapKey in mem.graphMemory.confusionMap)) {
    mem.graphMemory.confusionMap[hooks.confusionMapKey] = {};
  }
}

export function recordAnswer(params: {
  pathwayId: PathwayId;
  lessonId: string;
  questionId: string;
  correct: boolean;
  selectedIndex: number | null;
  numericValue?: number;
  conceptTags: string[];
}): LearningMemory {
  return updateMemory((mem) => {
    const record: AnswerRecord = {
      id: uid(),
      pathwayId: params.pathwayId,
      lessonId: params.lessonId,
      questionId: params.questionId,
      correct: params.correct,
      selectedIndex: params.selectedIndex,
      numericValue: params.numericValue,
      conceptTags: params.conceptTags,
      timestamp: Date.now(),
    };
    mem.performance.answers = [...mem.performance.answers, record].slice(-400);

    const seen = new Set(mem.performance.seenQuestionIds[params.lessonId] ?? []);
    seen.add(params.questionId);
    mem.performance.seenQuestionIds[params.lessonId] = [...seen];

    mem.performance.questionAttempts[params.questionId] =
      (mem.performance.questionAttempts[params.questionId] ?? 0) + 1;

    applyAnswerToConcepts(mem, {
      lessonId: params.lessonId,
      conceptTags: params.conceptTags,
      correct: params.correct,
    });

    mem.session.activeLessonId = params.lessonId;
    mem.session.activeQuestionId = params.questionId;

    const graphLesson = getGraphLessonByLegacyId(params.lessonId);
    touchGraphMemoryPlaceholders(mem, graphLesson);
    const historyKey = graphLesson?.memoryHooks?.questionHistoryKey;
    if (historyKey) {
      const history = mem.graphMemory.questionHistory[historyKey] ?? [];
      if (!history.includes(params.questionId)) {
        mem.graphMemory.questionHistory[historyKey] = [...history, params.questionId];
      }
    }
  });
}

export function recordUnderstandingSignalMemory(params: {
  lessonId: string;
  questionId?: string;
  conceptTags: string[];
  signal: UnderstandingSignal;
}): LearningMemory {
  return updateMemory((mem) => {
    mem.signals = [
      ...mem.signals,
      {
        id: uid(),
        lessonId: params.lessonId,
        questionId: params.questionId,
        conceptTags: params.conceptTags,
        signal: params.signal,
        timestamp: Date.now(),
      },
    ].slice(-200);

    applySignalToConcepts(mem, params);
  });
}

export function recordMissedQuestionMemory(params: {
  lessonId: string;
  questionId: string;
  conceptTags: string[];
  prompt: string;
  correctAnswer: string;
  wrongAnswerText?: string;
  confusionTriggers?: string[];
}): LearningMemory {
  return updateMemory((mem) => {
    const exists = mem.reinforcementQueue.some(
      (c) => c.lessonId === params.lessonId && c.questionId === params.questionId && c.source === "missed"
    );
    if (!exists) {
      mem.reinforcementQueue.push({
        id: uid(),
        lessonId: params.lessonId,
        questionId: params.questionId,
        conceptTags: params.conceptTags,
        front: params.prompt,
        back: params.correctAnswer,
        source: "missed",
        createdAt: Date.now(),
      });
      mem.reinforcementQueue = mem.reinforcementQueue.slice(-80);
    }

    if (params.wrongAnswerText && params.confusionTriggers?.length) {
      const lower = params.wrongAnswerText.toLowerCase();
      const hit = params.confusionTriggers.some((t) => lower.includes(t.toLowerCase()));
      if (hit) {
        mem.reinforcementQueue.push({
          id: uid(),
          lessonId: params.lessonId,
          questionId: params.questionId,
          conceptTags: params.conceptTags,
          front: `Confusion check: ${params.prompt}`,
          back: `You picked "${params.wrongAnswerText}" — remember: ${params.correctAnswer}`,
          source: "confusion",
          createdAt: Date.now(),
        });
        mem.reinforcementQueue = mem.reinforcementQueue.slice(-80);
      }
    }
  });
}

export function markLessonCompletedMemory(
  lessonId: string,
  pathwayId: PathwayId,
  lessonIndex?: number
): LearningMemory {
  const moduleId =
    lessonIndex !== undefined ? moduleIdForLesson(pathwayId, lessonIndex) : undefined;

  return updateMemory((mem) => {
    if (!mem.curriculum.completedLessonIds.includes(lessonId)) {
      mem.curriculum.completedLessonIds = [...mem.curriculum.completedLessonIds, lessonId];
    }
    const path = mem.curriculum.pathwayProgress[pathwayId] ?? {
      maxUnlockedLessonIndex: 0,
      chapterComplete: false,
      completedModuleIds: [],
    };
    if (moduleId && !path.completedModuleIds.includes(moduleId)) {
      path.completedModuleIds = [...path.completedModuleIds, moduleId];
    }
    if (lessonIndex !== undefined) {
      path.maxUnlockedLessonIndex = Math.max(path.maxUnlockedLessonIndex, lessonIndex + 1);
    }
    mem.curriculum.pathwayProgress[pathwayId] = path;
  });
}

export function persistSessionVisualState(visual: SessionVisualState): void {
  updateMemory((mem) => {
    mem.session.visualState = visual;
  });
}

export function loadSessionVisualState(): SessionVisualState | null {
  return loadMemory().session.visualState;
}

export function markPathwayCompletedMemory(
  pathwayId: PathwayId,
  lessonCount: number
): LearningMemory {
  const lastIndex = Math.max(0, lessonCount - 1);
  return updateMemory((mem) => {
    if (!mem.curriculum.completedPathwayIds.includes(pathwayId)) {
      mem.curriculum.completedPathwayIds = [...mem.curriculum.completedPathwayIds, pathwayId];
    }
    const path = mem.curriculum.pathwayProgress[pathwayId] ?? {
      maxUnlockedLessonIndex: 0,
      chapterComplete: false,
      completedModuleIds: [],
    };
    mem.curriculum.pathwayProgress[pathwayId] = {
      ...path,
      chapterComplete: true,
      maxUnlockedLessonIndex: Math.max(path.maxUnlockedLessonIndex, lastIndex),
    };
    const slice = mem.session.pathways[pathwayId];
    if (slice) {
      slice.chapterComplete = true;
      slice.maxUnlockedLessonIndex = Math.max(slice.maxUnlockedLessonIndex, lastIndex);
    }
  });
}

/** Unlock replay — keeps completion history but removes session lock. */
export function reopenPathwayForReview(pathwayId: PathwayId, lessonCount: number): LearningMemory {
  const lastIndex = Math.max(0, lessonCount - 1);
  return updateMemory((mem) => {
    const path = mem.curriculum.pathwayProgress[pathwayId] ?? {
      maxUnlockedLessonIndex: lastIndex,
      chapterComplete: false,
      completedModuleIds: [],
    };
    mem.curriculum.pathwayProgress[pathwayId] = {
      ...path,
      chapterComplete: false,
      maxUnlockedLessonIndex: Math.max(path.maxUnlockedLessonIndex, lastIndex),
    };
    const slice = mem.session.pathways[pathwayId] ?? defaultPathwaySlice();
    mem.session.pathways[pathwayId] = {
      ...slice,
      chapterComplete: false,
      maxUnlockedLessonIndex: Math.max(slice.maxUnlockedLessonIndex, lastIndex),
    };
  });
}

/** Full local reset — for dev and "start over" in settings. */
export function resetAllLearningProgress(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(MEMORY_KEY);
  localStorage.removeItem(LEGACY_PROGRESSION_KEY);
  localStorage.removeItem(LEGACY_PATHWAY_KEY);
}

export function isPathwayCompletedMemory(pathwayId: PathwayId): boolean {
  const mem = loadMemory();
  return mem.curriculum.completedPathwayIds.includes(pathwayId);
}

export function toProgressionSnapshot(mem: LearningMemory = loadMemory()): ProgressionSnapshot {
  const concepts: ProgressionSnapshot["concepts"] = {};
  for (const record of Object.values(mem.concept.concepts)) {
    for (const lessonId of record.lessonIds.length ? record.lessonIds : ["global"]) {
      const key = `${lessonId}::${record.conceptId}`;
      concepts[key] = {
        conceptId: record.conceptId,
        lessonId,
        masteryScore: record.masteryScore,
        confusionCount: record.confusionCount,
        positiveCount: record.positiveSignals,
        lastSignal: record.lastSignal,
        needsReinforcement: record.needsReinforcement,
      };
    }
  }

  return {
    signals: mem.signals,
    concepts,
    reinforcementQueue: mem.reinforcementQueue,
    completedLessonIds: mem.curriculum.completedLessonIds,
  };
}

export function getAverageMastery(): number {
  return averageMasteryScore(loadMemory());
}

export function getConceptTier(conceptId: string) {
  return loadMemory().concept.concepts[normalizeConceptId(conceptId)]?.tier ?? "unknown";
}
