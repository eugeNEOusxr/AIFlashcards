/** Compressed Q/A artifact — primary durable memory from reflections. */

export interface Flashcard {
  id: string;
  conceptId: string;
  front: string;
  back: string;
  createdAt: number;
}

const STORAGE_KEY = "cls:memory:flashcards:v1";

function load(): Flashcard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Flashcard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(items: Flashcard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota */
  }
}

export function getFlashcards(): Flashcard[] {
  return load();
}

export function addFlashcard(card: Flashcard): void {
  const items = load();
  items.push(card);
  save(items);
}
