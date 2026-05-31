import { getModule, listModulesForSubject } from "../frames/registry";
import type { SubjectId } from "../../world/types";
import physicsBank from "./physics_v1/physics_question_bank.manifest.json";

export type QuestionBankStats = {
  live: number;
  bookTarget: number;
  visionTarget: number;
  chapterLive?: { chapterId: number; title: string; live: number; target: number }[];
};

function countFramesForSubject(subjectId: SubjectId): number {
  return listModulesForSubject(subjectId).reduce((n, m) => n + m.frames.length, 0);
}

function countFramesForModuleIds(moduleIds: string[]): number {
  return moduleIds.reduce((n, id) => {
    const mod = getModule(id);
    return n + (mod?.frames.length ?? 0);
  }, 0);
}

/** Live frame count + committed targets from JSON (500 book / 10k vision for physics). */
export function getQuestionBankStats(subjectId: SubjectId): QuestionBankStats | null {
  if (subjectId === "physics") {
    const live = countFramesForSubject("physics");
    const chapterLive = physicsBank.chapters.map((ch) => ({
      chapterId: ch.chapterId,
      title: ch.title,
      live: countFramesForModuleIds(ch.liveFrameModuleIds),
      target: ch.targetQuestions,
    }));
    return {
      live,
      bookTarget: physicsBank.bookTarget,
      visionTarget: physicsBank.visionTarget,
      chapterLive,
    };
  }

  if (subjectId === "chemistry") {
    const matter = physicsBank.matterMind;
    const live = countFramesForSubject("chemistry");
    return {
      live,
      bookTarget: matter.bookTarget,
      visionTarget: matter.visionTarget,
    };
  }

  if (subjectId === "biology") {
    const live = countFramesForSubject("biology");
    return {
      live,
      bookTarget: 100,
      visionTarget: 10000,
    };
  }

  return null;
}

export function formatQuestionBankLabel(stats: QuestionBankStats): string {
  return `${stats.live} / ${stats.bookTarget}`;
}

export function formatVisionHint(stats: QuestionBankStats): string {
  const k = stats.visionTarget >= 1000 ? `${Math.round(stats.visionTarget / 1000)}k` : String(stats.visionTarget);
  return `${k} mind path`;
}
