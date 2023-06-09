import { create } from "zustand";
import { BookWithNotesType } from "@/types/data/booksWithNotes";
import { getProtectionTokens } from "@/lib/session";
import fetcher from "@/lib/fetcher";
import { NoteType } from "@/types/data/note";

interface BooksWithNotesState {
  books: BookWithNotesType[];
  loading: boolean;
  set: (books: BookWithNotesType[]) => void;
  add: (book: BookWithNotesType) => void;
  addNotes: (bookId: string, notes: NoteType[]) => void;
  delete: (book: BookWithNotesType) => void;
  get: () => Promise<void>;
  unlock: (bookId: string) => void;
}

export const useBooksWithNotesStore = create<BooksWithNotesState>((set) => ({
  // The books array
  books: [],
  // Is the books array are fetching?
  // By default, it is true because we are fetching the books whenever the app is loaded (_app.tsx)
  loading: true,
  // Set the books array
  // Its recommended to use other methods to update the books array instead of using this method directly
  set: (books) => set({ books }),
  // Add a book to the books array list
  add: (book) =>
    set((state) => ({
      books: [...state.books, book],
    })),
  // Add notes to a book
  addNotes: (bookId, notes) =>
    set((state) => ({
      books: state.books.map((b) => {
        if (b._id === bookId) {
          return { ...b, notes };
        }
        return b;
      }),
    })),
  // Delete a book from the books array list
  delete: (book) =>
    set((state) => ({
      books: state.books.filter((b) => b._id !== book._id),
    })),
  // Fetch the books array from the server and set the books array
  get: async () => {
    const protectionTokens = getProtectionTokens();

    const res = await fetcher("/api/get-books-with-notes", {
      protectionTokens,
    });
    const data = res.data;

    if (res.type !== "SUCCESS") {
      console.error("Error occured while fetching books with notes!", res.msg);
    }

    set({ books: data, loading: false });
  },
  // Unlock a book (set the `unlocked` property to true)
  unlock: (bookId) =>
    set((state) => ({
      books: state.books.map((b) => {
        if (b._id === bookId) {
          return { ...b, unlocked: true };
        }
        return b;
      }),
    })),
}));
