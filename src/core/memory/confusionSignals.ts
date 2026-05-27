/** Optional confusion marker tied to a concept — not raw reflection prose. */

export interface ConfusionSignal {
  id: string;
  conceptId: string;
  /** 0–1 heuristic intensity */
  intensity: number;
  /** Short trigger label only */
  trigger: string;
  createdAt: number;
}

const STORAGE_KEY = "cls:memory:confusion:v1";

function load(): ConfusionSignal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ConfusionSignal[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(items: ConfusionSignal[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota */
  }
}

export function getConfusionSignals(): ConfusionSignal[] {
  return load();
}

export function addConfusionSignal(signal: ConfusionSignal): void {
  const items = load();
  items.push(signal);
  save(items);
}
