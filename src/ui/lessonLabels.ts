export function lessonLabel(title: string): string {
  return title.replace(/^Lesson\s+\d+:\s*/i, "").trim();
}
