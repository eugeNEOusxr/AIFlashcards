import { useMemo, useState } from "react";
import type { Book } from "../../core/books/book";
import { getAllTags, searchBooks } from "../../core/books/bookStore";
import { BookCard } from "./BookCard";

type Props = {
  onOpenBook: (book: Book) => void;
};

export function BookSearch({ onOpenBook }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const tags = useMemo(() => getAllTags(), []);
  const results = useMemo(
    () => searchBooks(query, activeTag),
    [query, activeTag, refresh]
  );

  return (
    <div className="cls-book-search">
      <label className="cls-book-search__label" htmlFor="book-search-input">
        Search external sources
      </label>
      <input
        id="book-search-input"
        type="search"
        className="cls-book-search__input"
        placeholder="Search by title or tag…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />

      <div className="cls-book-search__tags" role="group" aria-label="Filter by tag">
        <button
          type="button"
          className={`cls-tag cls-tag--filter${activeTag === null ? " cls-tag--on" : ""}`}
          onClick={() => setActiveTag(null)}
        >
          All
        </button>
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            className={`cls-tag cls-tag--filter${activeTag === t ? " cls-tag--on" : ""}`}
            onClick={() => setActiveTag(activeTag === t ? null : t)}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="cls-hint">{results.length} linked source{results.length === 1 ? "" : "s"}</p>

      <ul className="cls-book-list">
        {results.map((book) => (
          <li key={book.id}>
            <BookCard
              book={book}
              onOpen={onOpenBook}
              onRated={() => setRefresh((n) => n + 1)}
            />
          </li>
        ))}
      </ul>

      {results.length === 0 ? (
        <p className="cls-hint">No matches — try another tag or search term.</p>
      ) : null}
    </div>
  );
}
