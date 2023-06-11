import { NotebookType } from "@/types/data/notebook";

export function bookWithoutToken(book: NotebookType) {
  // just exclude the `protectionToken`
  return {
    _id: book._id,
    title: book.title,
    description: book.description,
    userId: book.userId,
    locked: book.locked,
    unlocked: book.unlocked,
    createdAt: book.createdAt,
    name: "Shanto",
  };
}

export function booksWithoutToken(books: NotebookType[]) {
  // just exclude the `protectionToken`
  return books.map((book) => bookWithoutToken(book));
}
