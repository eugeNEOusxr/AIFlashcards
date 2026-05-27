import type { InteractionEvent } from "../events/interactionTypes";

export type MeaningType =
  | "confusion"
  | "clarity"
  | "engagement"
  | "exploration"
  | "reflection";

export interface MeaningEvent {
  type: MeaningType;
  /** Derived from InteractionEvent.id-equivalent (no id exists in MVP). */
  sourceEventId: string;
  intensity: number; // 0..1 (heuristic placeholder)
  context: Record<string, unknown>;
  timestamp: number;
}

let lastActionClickModule: string | null = null;
let lastSelectModule: string | null = null;

function mkSourceEventId(ev: InteractionEvent): string {
  return `${ev.type}:${ev.source}:${ev.timestamp}`;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Meaning derivation — deterministic heuristics only (no AI).
 * This is structured signaling that other layers can build on.
 */
export function deriveMeaning(event: InteractionEvent): MeaningEvent {
  const sourceEventId = mkSourceEventId(event);

  // Confusing / clarity / reflection come from explicit reflect actions.
  if (event.type === "reflect") {
    const action = typeof event.payload.action === "string" ? event.payload.action : "";
    const label =
      typeof event.payload.label === "string" ? event.payload.label : (action || "reflection");

    if (action === "confusing") {
      return {
        type: "confusion",
        sourceEventId,
        intensity: 0.9,
        context: { action, label, source: event.source },
        timestamp: event.timestamp,
      };
    }

    if (action === "clicked") {
      return {
        type: "clarity",
        sourceEventId,
        intensity: 0.85,
        context: { action, label, source: event.source },
        timestamp: event.timestamp,
      };
    }

    if (action === "save") {
      return {
        type: "reflection",
        sourceEventId,
        intensity: 0.6,
        context: { action, label, source: event.source },
        timestamp: event.timestamp,
      };
    }

    // Any other reflect action is still a reflection signal.
    return {
      type: "reflection",
      sourceEventId,
      intensity: 0.55,
      context: { action: action || "other", label, source: event.source },
      timestamp: event.timestamp,
    };
  }

  if (event.type === "mode_change") {
    return {
      type: "exploration",
      sourceEventId,
      intensity: 0.65,
      context: { mode: event.payload.mode, source: event.source },
      timestamp: event.timestamp,
    };
  }

  if (event.type === "select") {
    // Baseline selection signal.
    const text = typeof event.payload.text === "string" ? event.payload.text : "";
    const isRepeat = lastSelectModule === event.source;
    lastSelectModule = event.source;

    return {
      type: isRepeat ? "engagement" : "exploration",
      sourceEventId,
      intensity: clamp01(isRepeat ? 0.5 : 0.4),
      context: { source: event.source, selectedChars: text.length },
      timestamp: event.timestamp,
    };
  }

  if (event.type === "action") {
    const interaction = typeof event.payload.interaction === "string" ? event.payload.interaction : "";
    const isClick = interaction === "click" || interaction === "tap";
    if (isClick) {
      const isRepeat = lastActionClickModule === event.source;
      lastActionClickModule = event.source;
      return {
        type: isRepeat ? "engagement" : "exploration",
        sourceEventId,
        intensity: clamp01(isRepeat ? 0.55 : 0.35),
        context: { source: event.source, interaction },
        timestamp: event.timestamp,
      };
    }
  }

  // Deterministic fallback.
  return {
    type: "exploration",
    sourceEventId,
    intensity: 0.3,
    context: { type: event.type, source: event.source },
    timestamp: event.timestamp,
  };
}

