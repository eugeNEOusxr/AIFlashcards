import type { Book } from "../../core/books/book";
import { StarRating } from "./StarRating";

type Props = {
  book: Book;
  onOpen: (book: Book) => void;
  onRated: () => void;
};

export function BookCard({ book, onOpen, onRated }: Props) {
  return (
    <article
      className="cls-book-card"
      onClick={() => onOpen(book)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen(book);
      }}
      role="button"
      tabIndex={0}
    >
      <div className="cls-book-card__main">
        <h3 className="cls-book-card__title">{book.title}</h3>
        <p className="cls-book-card__source">{book.source}</p>
        <div className="cls-book-card__tags">
          {book.tags.map((t) => (
            <span key={t} className="cls-tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      <StarRating bookId={book.id} value={book.rating} onRated={onRated} />
    </article>
  );
}
