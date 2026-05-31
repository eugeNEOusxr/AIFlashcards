import type { Lesson, LessonQuestion, PhaseMode, TeachingBlock } from "../content/curriculumTypes";
import type { LessonVisualTheme } from "./types";
import { COLLISION_MOTIF_PROXY, normalizeDynamicMotifs, resolveConceptAnchor } from "./conceptAnchor";
import { resolveVisualTheme } from "./sceneResolver";
export type VisualReaction = "idle" | "correct" | "incorrect";

/** Stable for entire lesson session — never keyed by question or mode. */
export type PersistentSceneState = {
  coreTheme: Pick<LessonVisualTheme, "backgroundScene" | "accentColors">;
  anchorId: string | null;
};

/** Teaching overlay layer — fades in/out; does not remount anchor. */
export type TeachingOverlayState = {
  visualEvents: string[];
  overlayClasses: string[];
};

/** Question / feedback overlays — motifs tied to the active checkpoint. */
export type QuestionOverlayState = {
  dynamicMotifs: string[];
  overlayClasses: string[];
  collisionOverlay: boolean;
  visualEvents: string[];
};

export type SceneLayerPhase = "teach" | "reinforce" | "question" | "feedback" | "advance";

/** Maps curriculum visualEvents → CSS hooks on the teach overlay layer. */
export const VISUAL_EVENT_CLASSES: Record<string, string> = {
  force_arrows_activate: "lesson-teach-event--force-arrows",
  motion_vectors: "lesson-teach-event--motion-vectors",
  ball_rotation_subtle: "lesson-teach-event--ball-rotate",
  pathway_glow_forward: "lesson-teach-event--pathway-glow",
  motion_trail: "lesson-teach-event--motion-trail",
  interaction_glow: "lesson-teach-event--interaction-glow",
  motion_lines: "lesson-teach-event--motion-lines",
  push_pulse: "lesson-teach-event--push-pulse",
  collision_ripple: "lesson-teach-event--collision-ripple",
};

export function visualEventsFromTag(tag?: string): string[] {
  if (!tag) return [];
  const t = tag.replace(/-/g, "_").toLowerCase();
  if (t.includes("collision")) return ["collision_ripple", "push_pulse"];
  if (t.includes("push") || t.includes("force")) {
    return ["force_arrows_activate", "interaction_glow"];
  }
  if (t.includes("motion")) return ["motion_lines", "motion_trail"];
  return [];
}

export function resolvePersistentScene(lesson: Lesson): PersistentSceneState {
  const theme = resolveVisualTheme(lesson);
  return {
    coreTheme: {
      backgroundScene: theme.backgroundScene,
      accentColors: theme.accentColors,
    },
    anchorId: resolveConceptAnchor(lesson),
  };
}

export function resolveTeachingOverlays(block: TeachingBlock): TeachingOverlayState {
  const visualEvents =
    block.visualEvents?.length
      ? block.visualEvents
      : block.kind === "visual" || block.kind === "explain"
        ? visualEventsFromTag(block.visualTag)
        : [];

  const overlayClasses = visualEvents
    .map((e) => VISUAL_EVENT_CLASSES[e])
    .filter((c): c is string => Boolean(c));

  return { visualEvents, overlayClasses };
}

function dynamicMotifsFromQuestion(question: LessonQuestion, anchorId: string | null): string[] {
  let raw: string[] = [];
  if (question.visualBehavior?.motifs?.length) {
    raw = question.visualBehavior.motifs;
  } else {
    const focus = question.visualBehavior?.focusObject ?? "";
    if (focus.includes("collision") || focus.includes("bowling")) {
      raw = [COLLISION_MOTIF_PROXY, "contact-ripple", "push-force-arrows"];
    } else if (focus.includes("magnet") || focus.includes("metal") || focus.includes("clip")) {
      raw = ["magnet-arcs", "metal-float", "field-lines"];
    } else if (focus.includes("gravity") || focus.includes("earth") || focus.includes("orbit") || focus.includes("apple")) {
      raw = ["gravity-pull", "gravity-field", "field-lines"];
    } else if (focus.includes("push") || focus.includes("door") || focus.includes("friction") || focus.includes("contact")) {
      raw = [COLLISION_MOTIF_PROXY, "contact-ripple", "push-force-arrows"];
    }
  }
  return normalizeDynamicMotifs(raw, anchorId).dynamicMotifs;
}

function questionOverlayClasses(question: LessonQuestion, collisionOverlay: boolean): string[] {
  const classes: string[] = [];
  const behavior = question.visualBehavior;
  if (behavior?.highlightEffect) {
    classes.push(`lesson-visual-scene--fx-${behavior.highlightEffect.replace(/_/g, "-")}`);
  }
  if (behavior?.motionOverlay) {
    classes.push(`lesson-visual-scene--motion-${behavior.motionOverlay.replace(/_/g, "-")}`);
  }
  if (collisionOverlay) classes.push("lesson-visual-scene--motion-collision-shockwave");
  if (behavior?.focusObject) {
    classes.push(`lesson-visual-scene--focus-${behavior.focusObject.replace(/_/g, "-")}`);
  }
  return classes;
}

export function resolveQuestionOverlays(
  _lesson: Lesson,
  question: LessonQuestion | null,
  mode: PhaseMode,
  anchorId: string | null
): QuestionOverlayState {
  if (!question || mode === "TEACH" || mode === "REINFORCE" || mode === "ADVANCE") {
    return { dynamicMotifs: [], overlayClasses: [], collisionOverlay: false, visualEvents: [] };
  }

  const merged = normalizeDynamicMotifs(dynamicMotifsFromQuestion(question, anchorId), anchorId);
  let collisionOverlay = merged.collisionOverlay;
  if (question.visualBehavior?.focusObject?.includes("collision")) {
    collisionOverlay = true;
  }

  const visualEvents =
    mode === "FEEDBACK" && collisionOverlay
      ? ["collision_ripple", "push_pulse"]
      : visualEventsFromTag(question.visualTag);

  return {
    dynamicMotifs: merged.dynamicMotifs,
    collisionOverlay,
    overlayClasses: questionOverlayClasses(question, collisionOverlay),
    visualEvents,
  };
}

export function layerPhaseFromMode(mode: PhaseMode): SceneLayerPhase {
  switch (mode) {
    case "TEACH":
      return "teach";
    case "REINFORCE":
      return "reinforce";
    case "ASK":
      return "question";
    case "FEEDBACK":
      return "feedback";
    default:
      return "advance";
  }
}

export function teachLayerOpacity(phase: SceneLayerPhase): number {
  return phase === "teach" || phase === "reinforce" ? 1 : 0;
}

export function questionLayerOpacity(phase: SceneLayerPhase): number {
  return phase === "question" || phase === "feedback" ? 1 : 0;
}

export function reactionFromMode(mode: PhaseMode, isCorrect: boolean | null): VisualReaction {
  if (mode === "FEEDBACK" && isCorrect !== null) {
    return isCorrect ? "correct" : "incorrect";
  }
  return "idle";
}

export function hasForceArrowEvents(events: string[]): boolean {
  return events.some((e) => e === "force_arrows_activate" || e === "motion_vectors");
}
