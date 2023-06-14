import NoteBook from "@/models/notebook";
import response from "@/lib/response";
import { NextApiResponse } from "next";
import { INotebook } from "@/types/data/notebook";

// Get the book
export default async function getBook(
  res: NextApiResponse,
  query: any
): Promise<INotebook | null> {
  const book = await NoteBook.findOne(query);

  if (!book) {
    response(res, {
      type: "NOTFOUND",
      msg: "No notebook found",
    });

    return null;
  }

  return book;
}
