import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import Note from "@/models/note";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import getUser from "@/lib/db/getUser";
import { NotebookType } from "@/types/data/notebook";

interface ProtectionToken {
  protectionTokens: { id: string; token: string }[];
}

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

  const { protectionTokens } = req.body as ProtectionToken;
  if (!protectionTokens) {
    return response(res, {
      type: "SERVER_ERROR",
      msg: "No protection tokens provided",
    });
  }

  const books = await NoteBook.find({ userId: user._id }).sort({
    createdAt: "desc",
  });

  // Get all notes related to the books
  const booksWithNotes = await Promise.all(
    books.map(async (book) => {
      // Get the protection token
      const token = protectionTokens.find(
        (token) => token.id === book._id.toString()
      );

      // Check if the book is locked
      if (book.locked && !book.protectionToken) {
        // don't send the notes
        return { ...book._doc, notes: [] };
      }

      // Match the protection token
      if (book.locked && book.protectionToken !== token?.token) {
        // don't send the notes
        return { ...book._doc, notes: [] };
      }

      // Get the notes
      const notes = await Note.find({ notebookId: book._id }).sort({
        createdAt: "desc",
      });

      return { ...book._doc, unlocked: true, notes };
    })
  );

  response(res, {
    type: "SUCCESS",
    data: booksWithNotes,
  });
}
