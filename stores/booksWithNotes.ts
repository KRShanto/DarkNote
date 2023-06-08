import { create } from "zustand";
import { BookWithNotesType } from "@/types/data/booksWithNotes";
import { getProtectionTokenById } from "@/lib/session";
import { getProtectionTokens } from "@/lib/session";
import fetcher from "@/lib/fetcher";

interface BooksWithNotesState {
  books: BookWithNotesType[];
  loading: boolean;
  set: (books: BookWithNotesType[]) => void;
  add: (book: BookWithNotesType) => void;
  delete: (book: BookWithNotesType) => void;
  get: () => Promise<void>;
}

export const useBooksWithNotesStore = create<BooksWithNotesState>((set) => ({
  books: [],
  loading: true,
  set: (books) => set({ books }),
  add: (book) =>
    set((state) => ({
      books: [...state.books, book],
    })),
  delete: (book) =>
    set((state) => ({
      books: state.books.filter((b) => b._id !== book._id),
    })),
  get: async () => {
    const protectionTokens = getProtectionTokens();

    const res = await fetcher("/api/get-books-with-notes", {
      protectionTokens,
    });
    const data = res.data;

    console.log("books with notes: ", data);

    if (res.type !== "SUCCESS") {
      console.error("Error occured while fetching books with notes!", res.msg);
    }

    set({ books: data, loading: false });
  },
}));
