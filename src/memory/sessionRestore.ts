import type { NavScreen } from "../world/types";
import { getModulesForPathway } from "../world/physicsWorld";
import type { PathwayId } from "../world/types";
import { loadMemory } from "./memoryStore";

const SESSION_STALE_MS = 7 * 24 * 60 * 60 * 1000;

/** Resume lesson screen after refresh when a recent session exists. */
export function loadInitialNavScreen(): NavScreen {
  const mem = loadMemory();
  const { session } = mem;

  if (session.navScreen) {
    // PATHWAY screen is not a live UI after removing duplicate pathway maps.
    if (session.navScreen.kind === "PATHWAY") {
      return { kind: "SUBJECT", subjectId: session.navScreen.subjectId };
    }
    return session.navScreen;
  }

  if (
    session.activeLessonId &&
    session.pathwayId &&
    Date.now() - session.lastActiveAt < SESSION_STALE_MS
  ) {
    return {
      kind: "LESSON",
      subjectId: "physics",
      pathwayId: session.pathwayId,
    };
  }

  return { kind: "HOME" };
}

export function moduleIdForLesson(pathwayId: PathwayId, lessonIndex: number): string | undefined {
  return getModulesForPathway(pathwayId).find((m) => m.lessonIndex === lessonIndex)?.id;
}
