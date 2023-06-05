import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import Note from "@/models/note";
import isUser from "@/lib/auth/isUser";
import isLocked from "@/lib/auth/isLocked";

// Update a note
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const user = await isUser(req, res);

    if (!user) return;

    const { id, title, content, textContent, locked, protectionToken } =
      req.body;

    // Get the book
    const note = await Note.findOne({ _id: id, userId: user._id });
    const book = await NoteBook.findOne({
      _id: note.notebookId,
      userId: user._id,
    });

    if (!book || !note) {
      return response(res, {
        type: "NOTFOUND",
        msg: "No notebook found",
      });
    }

    if (isLocked(res, book, protectionToken)) return;

    // update the note
    const newNote = await Note.findOneAndUpdate(
      { _id: id, userId: user._id },
      { title, content, textContent, locked: locked || false },
      { new: true }
    );

    return response(res, {
      type: "SUCCESS",
      msg: "Note created successfully",
      data: newNote,
    });
  } catch (error: any) {
    // handle casting error
    if (error.name === "CastError") {
      return response(res, {
        type: "NOTFOUND",
        msg: "No notebook found",
      });
    }

    console.error(error);

    return response(res, {
      type: "SERVER_ERROR",
      msg: "Something went wrong",
    });
  }
}
