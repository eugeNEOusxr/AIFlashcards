import type { Lesson } from "../content/physicsChapter1";

/**
 * Internal prompt synthesis for future hybrid AI image generation (Option 3).
 * Not shown in UI — use resolveVisualTheme() + LessonVisualScene instead.
 */
export function buildVisualPrompt(lesson: Lesson): string {
  const subject = "futuristic physics learning chamber";
  const keywords = lesson.visualKeywords.join(", ");
  const tags = lesson.conceptTags.join(", ");
  return `${subject}, neon cyan and purple lighting, cinematic atmosphere, concept focus: ${lesson.title}, visual motifs: ${keywords}, educational context tags: ${tags}, clean modern composition`;
}

