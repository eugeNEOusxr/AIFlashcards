import type { Lesson } from "../content/curriculumTypes";
import { resolveVisualTheme } from "./sceneResolver";

/** Motifs that qualify as the immutable lesson anchor (core layer). */
const ANCHOR_MOTIFS = new Set(["bowling-ball", "hockey-puck"]);

const LESSON_ANCHOR: Record<string, string> = {
  "lesson-1-force": "bowling-ball",
  "lesson-2-contact-noncontact": "bowling-ball",
  "lesson-3-first-law": "hockey-puck",
};

/** Replaced by anchor + dynamic overlays — never mount as standalone scene root. */
export const COLLISION_MOTIF_PROXY = "bowling-ball-collision";

/**
 * Persistent concept anchor for a lesson.
 * Stays mounted for the full lesson lifecycle; UI state must not replace it.
 */
export function resolveConceptAnchor(lesson: Lesson): string | null {
  const graphAnchor = lesson.sceneGraph?.persistentAnchor.objectId;
  if (graphAnchor === "bowling_ball") return "bowling-ball";
  if (graphAnchor === "hockey_puck") return "hockey-puck";

  const mapped = LESSON_ANCHOR[lesson.id];
  if (mapped) return mapped;

  const focus = lesson.visualScene?.focusObject ?? lesson.sceneGraph?.visualScene?.focusObject ?? "";
  if (focus.includes("bowling")) return "bowling-ball";
  if (focus.includes("hockey") || focus.includes("puck")) return "hockey-puck";

  const theme = lesson.visualTheme ?? resolveVisualTheme(lesson);
  return theme.motifs.find((m) => ANCHOR_MOTIFS.has(m)) ?? null;
}

/** Strip anchor + collision proxy from motif lists; collision becomes overlay flag. */
export function normalizeDynamicMotifs(
  motifs: string[],
  anchorId: string | null
): { dynamicMotifs: string[]; collisionOverlay: boolean } {
  let collisionOverlay = false;
  const dynamicMotifs: string[] = [];

  for (const m of motifs) {
    if (m === anchorId) continue;
    if (m === COLLISION_MOTIF_PROXY) {
      collisionOverlay = true;
      continue;
    }
    if (!dynamicMotifs.includes(m)) dynamicMotifs.push(m);
  }

  return { dynamicMotifs, collisionOverlay };
}
