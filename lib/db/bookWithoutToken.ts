import { INotebook, NotebookType } from "@/types/data/notebook";

export function bookWithoutToken(book: INotebook) {
  // just exclude the `protectionToken`
  return {
    _id: book._id,
    title: book.title,
    userId: book.userId,
    locked: book.locked,
    createdAt: book.createdAt,
    name: "Shanto",
  };
}

export function booksWithoutToken(books: INotebook[]) {
  // just exclude the `protectionToken`
  return books.map((book) => bookWithoutToken(book));
}
