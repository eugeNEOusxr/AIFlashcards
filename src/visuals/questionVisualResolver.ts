import type { Lesson, LessonQuestion, PhaseMode } from "../content/curriculumTypes";
import type { LessonVisualTheme } from "./types";
import { COLLISION_MOTIF_PROXY, normalizeDynamicMotifs, resolveConceptAnchor } from "./conceptAnchor";
import { resolveVisualTheme } from "./sceneResolver";

export type ResolvedQuestionVisuals = {
  /** Stable per lesson — background + accents only. */
  coreTheme: Pick<LessonVisualTheme, "backgroundScene" | "accentColors">;
  anchorId: string | null;
  dynamicMotifs: string[];
  overlayClasses: string[];
  collisionOverlay: boolean;
};

const TEACH_DYNAMIC_FROM_SCENE: Record<string, string[]> = {
  collision: ["contact-ripple", "push-force-arrows", "motion-lines"],
  field_split: ["gravity-pull", "magnet-arcs", "field-lines"],
  default: ["force-arrows", "motion-lines", "interaction-pulse"],
};

function teachDynamicMotifs(lesson: Lesson, anchorId: string | null) {
  if (lesson.sceneGraph?.defaultMotifs?.length) {
    return normalizeDynamicMotifs(lesson.sceneGraph.defaultMotifs, anchorId);
  }

  const scene = lesson.visualScene;
  let raw: string[];
  if (!scene) {
    raw = TEACH_DYNAMIC_FROM_SCENE.default;
  } else if (scene.motionType === "collision") {
    raw = [...TEACH_DYNAMIC_FROM_SCENE.collision, COLLISION_MOTIF_PROXY];
  } else if (scene.focusObject?.includes("magnet") || scene.focusObject?.includes("field")) {
    raw = TEACH_DYNAMIC_FROM_SCENE.field_split;
  } else {
    raw = TEACH_DYNAMIC_FROM_SCENE.default;
  }
  return normalizeDynamicMotifs(raw, anchorId);
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

function overlayClassesFromBehavior(
  question: LessonQuestion | null,
  lesson: Lesson,
  mode: PhaseMode,
  collisionOverlay: boolean
): string[] {
  const classes: string[] = [];
  const behavior = question?.visualBehavior;
  const scene = lesson.visualScene;

  const highlight = behavior?.highlightEffect ?? (mode === "TEACH" ? scene?.animationStyle : undefined);
  const motion = behavior?.motionOverlay ?? (mode === "TEACH" ? scene?.effectOverlay : undefined);

  if (highlight) classes.push(`lesson-visual-scene--fx-${highlight.replace(/_/g, "-")}`);
  if (motion) classes.push(`lesson-visual-scene--motion-${motion.replace(/_/g, "-")}`);
  if (collisionOverlay) classes.push("lesson-visual-scene--motion-collision-shockwave");

  const focus = behavior?.focusObject ?? scene?.focusObject;
  if (focus) classes.push(`lesson-visual-scene--focus-${focus.replace(/_/g, "-")}`);

  return classes;
}

/**
 * Resolve visuals with strict layer separation:
 * - coreTheme + anchorId: immutable for lesson session
 * - dynamicMotifs + overlayClasses: may change per question/mode without remounting anchor
 */
export function resolveQuestionVisuals(
  lesson: Lesson,
  question: LessonQuestion | null,
  mode: PhaseMode
): ResolvedQuestionVisuals {
  const baseTheme = resolveVisualTheme(lesson);
  const anchorId = resolveConceptAnchor(lesson);

  const coreTheme = {
    backgroundScene: baseTheme.backgroundScene,
    accentColors: baseTheme.accentColors,
  };

  let dynamicMotifs: string[];
  let collisionOverlay: boolean;

  if (mode === "TEACH" || !question) {
    const fromScene = teachDynamicMotifs(lesson, anchorId);
    const themeExtras = baseTheme.motifs.filter(
      (m) => m !== anchorId && m !== COLLISION_MOTIF_PROXY
    );
    const merged = normalizeDynamicMotifs(
      [...fromScene.dynamicMotifs, ...themeExtras],
      anchorId
    );
    dynamicMotifs = merged.dynamicMotifs;
    collisionOverlay = fromScene.collisionOverlay || merged.collisionOverlay;
  } else {
    const fromQuestion = dynamicMotifsFromQuestion(question, anchorId);
    const merged = normalizeDynamicMotifs(fromQuestion, anchorId);
    dynamicMotifs = merged.dynamicMotifs;
    collisionOverlay = merged.collisionOverlay;
    if (question.visualBehavior?.focusObject?.includes("collision")) {
      collisionOverlay = true;
    }
  }

  return {
    coreTheme,
    anchorId,
    dynamicMotifs,
    collisionOverlay,
    overlayClasses: overlayClassesFromBehavior(question, lesson, mode, collisionOverlay),
  };
}
