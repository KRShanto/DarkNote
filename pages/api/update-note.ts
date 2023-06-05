import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import { NotebookType } from "@/types/data/notebook";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextAuthOptions } from "next-auth";
import response from "@/lib/response";
import User from "@/models/user";
import { UserType } from "@/types/data/user";
import Note from "@/models/note";
import isUser from "@/lib/auth/isUser";

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
    //   const book = await NoteBook.findOne({ _id: id, userId: sessionUser._id });
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

    if (book.locked && !book.protectionToken) {
      return response(res, {
        type: "LOCKED",
        msg: "No protection token found. You need to unlock the notebook first",
      });
    }

    if (book.locked && book.protectionToken !== protectionToken) {
      return response(res, {
        type: "LOCKED",
        msg: "Invalid protection token",
      });
    }

    // Create the note
    //   const updateNote = {
    //     title,
    //     content,
    //     notebookId: book._id,
    //     userId: sessionUser._id,
    //     locked: locked || false,
    //   };

    // const newNote = await Note.create(note);
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
