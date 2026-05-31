import type { GraphDebugEntry } from "../graph/cognitiveGraph";
import type { MeaningEvent } from "../meaning/meaningEngine";
import { graphDebugToSystemEvents } from "./eventClassification";

/** Graph engine internals — console only, never UI. */
export function logGraphSystemEvents(entries: GraphDebugEntry[]): void {
  if (entries.length === 0) return;
  for (const ev of graphDebugToSystemEvents(entries)) {
    console.log("[CLS:system]", ev.detail);
  }
}

export function logMeaningSystemEvent(meaning: MeaningEvent): void {
  if (import.meta.env.DEV) {
    console.log("[CLS:system:meaning]", meaning.type, meaning.intensity.toFixed(2));
  }
}
