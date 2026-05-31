/** Compressed concept artifact — no long-form reflection text. */

export interface ConceptNode {
  id: string;
  title: string;
  createdAt: number;
  /** Opaque link to compression batch, not raw user text. */
  sourceBatchId: string;
}

const STORAGE_KEY = "cls:memory:concepts:v1";

function load(): ConceptNode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ConceptNode[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(items: ConceptNode[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota */
  }
}

export function getConcepts(): ConceptNode[] {
  return load();
}

export function addConcept(node: ConceptNode): void {
  const items = load();
  items.push(node);
  save(items);
}

export function getConceptById(id: string): ConceptNode | undefined {
  return load().find((c) => c.id === id);
}
