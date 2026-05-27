import {
  applyInteractionEvent,
  applyMeaningEvent,
  applyCognitiveFeedback,
  getGraphBridgeContext,
  getSelectedText,
  refreshMemorySummary,
} from "../state/learningState";
import { compressReflection } from "../memory/compressionEngine";
import { buildMemorySummary } from "../memory/memorySummary";
import type { InteractionEvent, InteractionEventType } from "./interactionTypes";
import { deriveMeaning } from "../meaning/meaningEngine";
import { applyMeaningToGraph } from "../graph/meaningGraphBridge";
import { updateCognitiveFeedback } from "../visualization/cognitiveFeedbackEngine";
import { isSystemOnlyInteraction } from "./eventClassification";
import { logGraphSystemEvents, logMeaningSystemEvent } from "./systemEventLog";
import { recordReflectionLearning } from "../learning/learningBridge";

/**
 * Central ingress: Interaction → Meaning → Graph → Feedback (visual translation).
 */
export function dispatchInteractionEvent(
  event: Omit<InteractionEvent, "timestamp"> & { timestamp?: number }
): void {
  const full: InteractionEvent = {
    ...event,
    timestamp: event.timestamp ?? Date.now(),
  };
  applyInteractionEvent(full);

  if (full.type === "reflect") {
    const text =
      (typeof full.payload.text === "string" && full.payload.text.trim()) ||
      getSelectedText().trim() ||
      (typeof full.payload.label === "string" ? full.payload.label : "");
    const action = full.payload.action;
    const hint =
      action === "confusing" || action === "clicked" || action === "save" || action === "explain"
        ? action
        : "other";
    if (text.trim()) {
      compressReflection({ text, hint });
      refreshMemorySummary(buildMemorySummary());
      const intensity =
        action === "confusing" ? 0.85 : action === "clicked" ? 0.8 : action === "save" ? 0.6 : 0.55;
      recordReflectionLearning(text, String(action), intensity);
      if (import.meta.env.DEV) {
        console.log("[CLS:compress]", buildMemorySummary());
      }
    }
  }

  // Hover highlights only — skip meaning/graph/feedback to reduce noise.
  if (isSystemOnlyInteraction(full.payload)) return;

  const meaning = deriveMeaning(full);
  applyMeaningEvent(meaning);
  logMeaningSystemEvent(meaning);

  const ctx = getGraphBridgeContext();
  const { debug } = applyMeaningToGraph(meaning, ctx);
  logGraphSystemEvents(debug);

  const feedback = updateCognitiveFeedback(meaning, ctx.activeConceptId);
  applyCognitiveFeedback(feedback);
}

export function emitSelect(source: string, text: string): void {
  dispatchInteractionEvent({
    type: "select",
    source,
    payload: { text },
  });
}

export function emitAction(
  source: string,
  payload: Record<string, unknown> = {}
): void {
  dispatchInteractionEvent({
    type: "action",
    source,
    payload,
  });
}

export function emitModeChange(source: string, mode: string): void {
  dispatchInteractionEvent({
    type: "mode_change",
    source,
    payload: { mode },
  });
}

export function emitReflect(
  source: string,
  payload: Record<string, unknown> = {}
): void {
  dispatchInteractionEvent({
    type: "reflect",
    source,
    payload,
  });
}

export type { InteractionEvent, InteractionEventType };
