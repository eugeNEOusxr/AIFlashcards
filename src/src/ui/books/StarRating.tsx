import type { BookRating } from "../../core/books/book";
import { setBookRating } from "../../core/books/bookStore";

type Props = {
  bookId: string;
  value?: number;
  onRated?: (rating: BookRating) => void;
};

export function StarRating({ bookId, value, onRated }: Props) {
  return (
    <div className="cls-stars" role="group" aria-label="Rate this source">
      {([1, 2, 3, 4, 5] as BookRating[]).map((n) => (
        <button
          key={n}
          type="button"
          className={`cls-star${value && n <= value ? " cls-star--on" : ""}`}
          aria-label={`${n} stars`}
          onClick={(e) => {
            e.stopPropagation();
            setBookRating(bookId, n);
            onRated?.(n);
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
