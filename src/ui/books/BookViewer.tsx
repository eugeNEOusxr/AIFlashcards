import type { Book } from "../../core/books/book";
import { StarRating } from "./StarRating";

type Props = {
  book: Book;
  onClose: () => void;
  onRated: () => void;
};

export function BookViewer({ book, onClose, onRated }: Props) {
  return (
    <section className="cls-book-viewer" aria-label={`Reading: ${book.title}`}>
      <header className="cls-book-viewer__header">
        <button type="button" className="cls-book-viewer__back" onClick={onClose}>
          ← Back to search
        </button>
        <div className="cls-book-viewer__meta">
          <h2>{book.title}</h2>
          <p className="cls-book-card__source">{book.source}</p>
          <div className="cls-book-card__tags">
            {book.tags.map((t) => (
              <span key={t} className="cls-tag">
                {t}
              </span>
            ))}
          </div>
          <StarRating bookId={book.id} value={book.rating} onRated={onRated} />
        </div>
      </header>
      <div className="cls-book-viewer__frame-wrap">
        <iframe
          className="cls-book-viewer__frame"
          src={book.source}
          title={book.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <p className="cls-hint cls-book-viewer__hint">
          Some sites block embedded views. If the page is blank, use{" "}
          <a href={book.source} target="_blank" rel="noopener noreferrer">
            open in browser
          </a>
          .
        </p>
      </div>
    </section>
  );
}
