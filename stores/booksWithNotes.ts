import { create } from "zustand";
import { BookWithNotesType } from "@/types/data/booksWithNotes";

interface BooksWithNotesState {
  books: BookWithNotesType[];
  set: (books: BookWithNotesType[]) => void;
  add: (book: BookWithNotesType) => void;
  delete: (book: BookWithNotesType) => void;
}

export const useBooksWithNotesStore = create<BooksWithNotesState>((set) => ({
  books: [],
  set: (books) => set({ books }),
  add: (book) =>
    set((state) => ({
      books: [...state.books, book],
    })),
  delete: (book) =>
    set((state) => ({
      books: state.books.filter((b) => b._id !== book._id),
    })),
}));
