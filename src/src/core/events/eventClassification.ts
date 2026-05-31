import type { MeaningEvent, MeaningType } from "../meaning/meaningEngine";
import type { GraphDebugEntry } from "../graph/cognitiveGraph";

/** Internal / dev-only — never render in UI. */
export interface SystemEvent {
  kind: "graph" | "interaction";
  timestamp: number;
  detail: string;
  payload?: unknown;
}

/** Human-facing feedback derived from meaning (safe for UI). */
export interface UserEvent {
  kind: "feedback";
  message: string;
  meaningType?: MeaningType;
  timestamp: number;
}

const MEANING_LABELS: Record<MeaningType, string> = {
  confusion: "Confusion signal",
  clarity: "Clarity signal",
  engagement: "Engagement signal",
  exploration: "Exploring",
  reflection: "Reflection",
};

/** Convert meaning → short user-readable label (not raw ids). */
export function meaningToUserLabel(meaning: MeaningEvent): string {
  return MEANING_LABELS[meaning.type] ?? "Cognitive signal";
}

export function graphDebugToSystemEvents(entries: GraphDebugEntry[]): SystemEvent[] {
  return entries.map((e) => ({
    kind: "graph" as const,
    timestamp: e.timestamp,
    detail: `${e.action}: ${e.detail}`,
    payload: e,
  }));
}

export function isSystemOnlyInteraction(payload: Record<string, unknown>): boolean {
  return payload.interaction === "hover";
}
