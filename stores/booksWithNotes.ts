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
  addNote(bookId: string, note: NoteType): void;
  addNotes: (bookId: string, notes: NoteType[]) => void;
  updateNote(
    bookId: string,
    noteId: string,
    note: {
      title?: string;
      content?: string;
      textContent?: string;
    }
  ): void;
  updateBook(
    bookId: string,
    book: {
      title?: string;
      locked?: boolean;
    }
  ): void;
  deleteBook: (bookId: string) => void;
  deleteNote(bookId: string, noteId: string): void;
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

  // Add a note to a book
  addNote: (bookId, note) =>
    set((state) => ({
      books: state.books.map((b) => {
        if (b._id === bookId) {
          return { ...b, notes: [...b.notes, note] };
        }
        return b;
      }),
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

  // Update a note of a book
  // Update only the store. No need to fetch the server
  updateNote: (bookId, noteId, note) => {
    set((state) => ({
      books: state.books.map((b) => {
        if (b._id === bookId) {
          return {
            ...b,
            notes: b.notes.map((n) => {
              if (n._id === noteId) {
                return {
                  ...n,
                  ...note,
                };
              }
              return n;
            }),
          };
        }
        return b;
      }),
    }));
  },

  // Update the book
  // Update only the store. No need to fetch the server
  updateBook: (bookId, book) => {
    console.log("Here the book: ", book);

    set((state) => ({
      books: state.books.map((b) => {
        if (b._id === bookId) {
          if (book.locked !== undefined) {
            return {
              ...b,
              ...book,
              locked: book.locked,
              unlocked: !book.locked,
            };
          }
          return {
            ...b,
            ...book,
          };
        }
        return b;
      }),
    }));
  },
  // Delete a book from the books array list
  deleteBook: (bookId) =>
    set((state) => ({
      books: state.books.filter((b) => b._id !== bookId),
    })),

  // Delete a note from a book
  deleteNote: (bookId, noteId) =>
    set((state) => ({
      books: state.books.map((b) => {
        if (b._id === bookId) {
          return {
            ...b,
            notes: b.notes.filter((n) => n._id !== noteId),
          };
        }
        return b;
      }),
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

    // First set the books
    set({ books: data });

    // Set the loading state to false after some time, because if it changes immediately, then components will throw not found error while the `books` is fully loaded.
    // So changing this state so that components will have loading `true` but books will be ready at this time and then after that changing the state won't be any problem
    setTimeout(() => {
      set({ loading: false });
    }, 50);
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
