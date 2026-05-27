import type { LearningEvent } from "./LearningEvent";

const STORAGE_KEY = "cls:learning-events:v1";

let events: LearningEvent[] = load();
const listeners = new Set<() => void>();

function load(): LearningEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LearningEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    /* quota */
  }
}

function emit(): void {
  persist();
  listeners.forEach((fn) => fn());
}

export function getAllLearningEvents(): LearningEvent[] {
  return [...events];
}

export function addEvent(event: LearningEvent): void {
  events = [...events, event].slice(-500);
  emit();
}

export function getEventsByNode(nodeId: string): LearningEvent[] {
  return events.filter((e) => e.nodeId === nodeId);
}

export function subscribeLearningEvents(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
