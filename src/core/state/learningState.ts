/**
 * Centralized learning UI state (MVP).
 * Persistence: localStorage only (temporary; IndexedDB later).
 */

import type { InteractionEvent } from "../events/interactionTypes";
import type { MeaningEvent } from "../meaning/meaningEngine";
import type { CognitiveFeedbackSnapshot } from "../visualization/cognitiveFeedbackEngine";
import {
  syncInputOwnerFromSelection,
  type InputOwner,
} from "../ui/inputManager";
import { buildMemorySummary } from "../memory/memorySummary";

const STORAGE_KEY = "cls:learning:mvp:v1";

export type ModeId = "quick" | "focus" | "graph" | "flashcard" | "book";

/** UI summary of compressed memory — no raw reflection prose. */
export interface MemoryArtifactSummary {
  conceptCount: number;
  flashcardCount: number;
  confusionCount: number;
  lastConceptTitle: string | null;
  lastFlashcardFront: string | null;
}

export interface ActiveNode {
  id: string;
  title: string;
}

export interface LearningState {
  activeMode: ModeId;
  selectedItem: string;
  activeNode: ActiveNode | null;
  /** Compressed memory snapshot for UI — not raw reflection text. */
  memorySummary: MemoryArtifactSummary;
  memoryRevision: number;
  /** Interaction layer — not persisted */
  lastEvent: InteractionEvent | null;
  activeModuleId: string | null;
  /** Visualization feedback — not persisted. */
  cognitiveFeedback: CognitiveFeedbackSnapshot;
  /** Single active input surface — not persisted. */
  activeInputOwner: InputOwner;
}

const defaultState = (): LearningState => ({
  activeMode: "focus",
  selectedItem: "",
  activeNode: { id: "stub-1", title: "Welcome (placeholder node)" },
  memorySummary: {
    conceptCount: 0,
    flashcardCount: 0,
    confusionCount: 0,
    lastConceptTitle: null,
    lastFlashcardFront: null,
  },
  memoryRevision: 0,
  lastEvent: null,
  activeModuleId: null,
  activeInputOwner: "none",
  cognitiveFeedback: {
    clarityScore: 0,
    confusionScore: 0,
    attentionStickiness: 0,
    conceptStability: 0,
    message: null,
    glowIntensity: 0,
    updatedAt: Date.now(),
  },
});

function load(): LearningState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<
      Omit<
        LearningState,
        "lastEvent" | "activeModuleId" | "cognitiveFeedback" | "activeInputOwner" | "memorySummary" | "memoryRevision"
      >
    >;
    return {
      ...defaultState(),
      ...parsed,
      activeNode:
        parsed.activeNode && typeof parsed.activeNode.id === "string"
          ? parsed.activeNode
          : defaultState().activeNode,
      lastEvent: null,
      activeModuleId: null,
      activeInputOwner: syncInputOwnerFromSelection(
        typeof parsed.selectedItem === "string" ? parsed.selectedItem : "",
        "none"
      ),
      cognitiveFeedback: defaultState().cognitiveFeedback,
      memorySummary: buildMemorySummary(),
      memoryRevision: 0,
    };
  } catch {
    return defaultState();
  }
}

function persist(s: LearningState): void {
  try {
    const {
      lastEvent: _le,
      activeModuleId: _am,
      cognitiveFeedback: _cf,
      activeInputOwner: _io,
      memorySummary: _ms,
      memoryRevision: _mr,
      ...rest
    } = s;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    /* quota / private mode */
  }
}

let state: LearningState = load();
const listeners = new Set<() => void>();

export function getLearningState(): LearningState {
  return state;
}

export function subscribeLearningState(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function emit(): void {
  persist(state);
  listeners.forEach((fn) => fn());
}

/** Single entry from interaction bus — no AI / graph logic. */
export function applyInteractionEvent(event: InteractionEvent): void {
  const next: LearningState = {
    ...state,
    lastEvent: event,
    activeModuleId: event.source,
  };

  switch (event.type) {
    case "mode_change": {
      const mode = event.payload.mode;
      if (typeof mode === "string" && isModeId(mode)) {
        next.activeMode = mode;
      }
      break;
    }
    case "select": {
      const text = event.payload.text;
      if (typeof text === "string" && text.trim()) {
        next.selectedItem = text.trim();
      }
      break;
    }
    case "action": {
      if (event.payload.action === "clear_selection") {
        next.selectedItem = "";
      }
      break;
    }
    case "reflect":
      break;
    default:
      break;
  }

  next.activeInputOwner = syncInputOwnerFromSelection(
    next.selectedItem,
    next.activeInputOwner
  );

  state = next;
  emit();
}

/** Meaning processed in pipeline; no raw meaning list in UI state. */
export function applyMeaningEvent(_meaning: MeaningEvent): void {
  /* intentionally empty — user UI uses cognitiveFeedback only */
}

export function applyCognitiveFeedback(snapshot: CognitiveFeedbackSnapshot): void {
  state = { ...state, cognitiveFeedback: snapshot };
  emit();
}

export function refreshMemorySummary(summary: MemoryArtifactSummary): void {
  state = {
    ...state,
    memorySummary: summary,
    memoryRevision: state.memoryRevision + 1,
  };
  emit();
}

export function getSelectedText(): string {
  return state.selectedItem;
}

/** Bridge: align stub active node with knowledge graph selection. */
export function setActiveNodeFromGraph(node: { id: string; title: string }): void {
  state = {
    ...state,
    activeNode: { id: node.id, title: node.title },
  };
  emit();
}

/** Snapshot for graph bridge (no graph logic here). */
export function getGraphBridgeContext(): {
  activeConceptId: string;
  activeConceptTitle: string;
  moduleId: string | undefined;
} {
  return {
    activeConceptId: state.activeNode?.id ?? "concept-default",
    activeConceptTitle: state.activeNode?.title ?? "Active concept",
    moduleId: state.activeModuleId ?? undefined,
  };
}

function isModeId(v: string): v is ModeId {
  return ["quick", "focus", "graph", "flashcard", "book"].includes(v);
}
