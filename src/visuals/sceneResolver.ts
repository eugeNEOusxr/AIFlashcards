import type { Lesson } from "../content/curriculumTypes";
import { getSceneDefinition } from "./sceneCatalog";
import type { LessonVisualTheme } from "./types";

const LESSON_THEME: Record<string, LessonVisualTheme> = {
  "lesson-1-force": {
    backgroundScene: "force_motion",
    accentColors: ["cyan", "magenta"],
    motifs: ["bowling-ball", "motion-lines", "force-arrows", "interaction-pulse"],
  },
  "lesson-2-contact-noncontact": {
    backgroundScene: "contact_fields",
    accentColors: ["cyan", "purple"],
    motifs: [
      "bowling-ball",
      "magnet-arcs",
      "gravity-pull",
      "push-force-arrows",
      "contact-ripple",
      "field-lines",
    ],
  },
  "lesson-3-first-law": {
    backgroundScene: "inertia_ice",
    accentColors: ["cyan", "teal"],
    motifs: ["hockey-puck", "motion-trail", "ice-sheen", "inertia-glow"],
  },
  "lesson-4-second-law": {
    backgroundScene: "f_equals_ma",
    accentColors: ["purple", "magenta"],
    motifs: ["formula-glow", "light-cart", "heavy-cart", "acceleration-streaks"],
  },
  "lesson-5-applications": {
    backgroundScene: "force_applications",
    accentColors: ["cyan", "violet"],
    motifs: ["shopping-cart", "brake-force", "ball-arc", "opposite-force"],
  },
};

/** Resolve theme from lesson metadata (explicit theme or keyword fallback). */
export function resolveVisualTheme(lesson: Lesson): LessonVisualTheme {
  if (lesson.visualTheme) return lesson.visualTheme;

  const byId = LESSON_THEME[lesson.id];
  if (byId) return byId;

  const kw = lesson.visualKeywords.join(" ").toLowerCase();
  if (kw.includes("bowling") || kw.includes("push")) return LESSON_THEME["lesson-1-force"];
  if (kw.includes("magnet") || kw.includes("gravity")) return LESSON_THEME["lesson-2-contact-noncontact"];
  if (kw.includes("hockey") || kw.includes("inertia")) return LESSON_THEME["lesson-3-first-law"];
  if (kw.includes("cart") || kw.includes("f=ma")) return LESSON_THEME["lesson-4-second-law"];

  return {
    backgroundScene: "force_motion",
    accentColors: ["cyan", "purple"],
    motifs: ["force-arrows", "motion-lines"],
  };
}

export function resolveSceneForLesson(lesson: Lesson) {
  const theme = resolveVisualTheme(lesson);
  return { theme, scene: getSceneDefinition(theme.backgroundScene) };
}
