import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import React from "react";
import Book from "./Book";

export default function NotebookBar() {
  const { books } = useBooksWithNotesStore();

  return (
    <div className="notebook-bar">
      {books.map((book) => (
        <Book key={book._id} book={book} />
      ))}
    </div>
  );
}
