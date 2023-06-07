import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import Note from "@/models/note";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import getUser from "@/lib/db/getUser";

// Get all notebooks related to the user
// TODO: Streamline this process - first sent all notebooks, then get all notes related to the notebooks and send them
// TODO: Add lock restriction
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const user = await getUser(req, res);

  if (!user) return;

  const books = await NoteBook.find({ userId: user._id }).sort({
    createdAt: "desc",
  });

  // Get all notes related to the books
  const booksWithNotes = await Promise.all(
    books.map(async (book) => {
      const notes = await Note.find({ notebookId: book._id }).sort({
        createdAt: "desc",
      });
      return { ...book._doc, notes };
    })
  );

  response(res, {
    type: "SUCCESS",
    data: booksWithNotes,
  });
}
