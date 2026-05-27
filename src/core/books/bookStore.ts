import type { Book, BookRating } from "./book";

const RATINGS_KEY = "cls:book-ratings:v1";

/** Curated external sources (discovery catalog). */
const CATALOG: Book[] = [
  {
    id: "b1",
    title: "Neural Networks — Wikipedia",
    source: "https://en.wikipedia.org/wiki/Neural_network",
    tags: ["ai", "reference"],
  },
  {
    id: "b2",
    title: "MDN: JavaScript Guide",
    source: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    tags: ["programming", "web"],
  },
  {
    id: "b3",
    title: "Khan Academy: Calculus",
    source: "https://www.khanacademy.org/math/calculus-1",
    tags: ["math", "course"],
  },
  {
    id: "b4",
    title: "OpenStax: Psychology",
    source: "https://openstax.org/books/psychology-2e/pages/1-introduction",
    tags: ["psychology", "textbook"],
  },
  {
    id: "b5",
    title: "Stanford Encyclopedia: Consciousness",
    source: "https://plato.stanford.edu/entries/consciousness/",
    tags: ["philosophy", "reference"],
  },
  {
    id: "b6",
    title: "MIT OCW: Linear Algebra",
    source: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
    tags: ["math", "course", "mit"],
  },
];

function loadRatings(): Record<string, BookRating> {
  try {
    const raw = localStorage.getItem(RATINGS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, BookRating>;
  } catch {
    return {};
  }
}

function saveRatings(ratings: Record<string, BookRating>): void {
  try {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  } catch {
    /* quota */
  }
}

export function getBookCatalog(): Book[] {
  const ratings = loadRatings();
  return CATALOG.map((b) => ({
    ...b,
    rating: ratings[b.id],
  }));
}

export function getBookById(id: string): Book | undefined {
  return getBookCatalog().find((b) => b.id === id);
}

export function setBookRating(bookId: string, rating: BookRating): void {
  const ratings = loadRatings();
  ratings[bookId] = rating;
  saveRatings(ratings);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  CATALOG.forEach((b) => b.tags.forEach((t) => tags.add(t)));
  return [...tags].sort();
}

export function searchBooks(query: string, activeTag: string | null): Book[] {
  const q = query.trim().toLowerCase();
  return getBookCatalog().filter((b) => {
    if (activeTag && !b.tags.includes(activeTag)) return false;
    if (!q) return true;
    const hay = `${b.title} ${b.tags.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}
