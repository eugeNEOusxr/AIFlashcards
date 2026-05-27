/** Layered lesson chamber visual theme — maps to asset library + CSS motifs. */

export type AccentColor = "cyan" | "purple" | "magenta" | "violet" | "teal";

export type LessonVisualTheme = {
  backgroundScene: string;
  accentColors: [AccentColor, AccentColor];
  motifs: string[];
};

export type SceneAssetRefs = {
  background?: string;
  midground?: string;
};

export type SceneDefinition = {
  id: string;
  label: string;
  chamberClass: string;
  assets?: SceneAssetRefs;
};
