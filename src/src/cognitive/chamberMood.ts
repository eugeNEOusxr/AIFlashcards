import type { ChamberMood, UnderstandingSignal } from "./types";

export function signalToMood(signal: UnderstandingSignal | null): ChamberMood {
  switch (signal) {
    case "understand":
      return "positive";
    case "confusing":
      return "confused";
    case "need_visual":
      return "visual";
    case "repeat":
    case "partial":
      return "reframe";
    default:
      return "neutral";
  }
}

export function moodClassName(mood: ChamberMood): string {
  return `chamber-mood--${mood}`;
}
