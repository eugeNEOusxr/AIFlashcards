import { useState } from "react";
import type { Book } from "../../core/books/book";
import { getBookById } from "../../core/books/bookStore";
import { BookSearch } from "./BookSearch";
import { BookViewer } from "./BookViewer";

export function BooksWorkspace() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const openBook = openId ? getBookById(openId) : undefined;

  const handleOpen = (book: Book) => setOpenId(book.id);
  const handleClose = () => setOpenId(null);
  const handleRated = () => setTick((n) => n + 1);

  if (openBook) {
    return (
      <BookViewer
        key={`${openBook.id}-${tick}`}
        book={openBook}
        onClose={handleClose}
        onRated={handleRated}
      />
    );
  }

  return <BookSearch onOpenBook={handleOpen} />;
}
