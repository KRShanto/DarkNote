import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import Note from "@/models/note";
import getUser from "@/lib/db/getUser";
import isLocked from "@/lib/db/isLocked";
import getBook from "@/lib/db/getBook";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const user = await getUser(req, res);

    if (!user) return;

    const { id, title, content, textContent, locked, protectionToken } =
      req.body;

    // // Get the book
    // const book = await NoteBook.findOne({ _id: id, userId: user._id });

    // if (!book) {
    //   return response(res, {
    //     type: "NOTFOUND",
    //     msg: "No notebook found",
    //   });
    // }

    const book = await getBook(res, { _id: id, userId: user._id });

    if (!book) return;

    if (isLocked(res, book, protectionToken)) return;

    // Check if required fields are not empty
    if (!title || !content || !textContent) {
      return response(res, {
        type: "INVALID",
        msg: "Please fill in all required fields",
      });
    }

    // Create the note
    const note = {
      title,
      content,
      textContent,
      notebookId: book._id,
      userId: user._id,
      locked: locked || false,
    };

    const newNote = await Note.create(note);

    return response(res, {
      type: "SUCCESS",
      msg: "Note created successfully",
      data: newNote,
    });
  } catch (error: any) {
    // catch the casting error
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
