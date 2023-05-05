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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const session = await getServerSession(
      req,
      res,
      authOptions as NextAuthOptions
    );
    const sessionUser = session?.user as UserType;

    if (!sessionUser) {
      return response(
        res,
        {
          type: "UNAUTHORIZED",
          msg: "You need to be signed in to create a notebook",
        },
        401
      );
    }

    const { id, title, content, textContent, locked, protectionToken } =
      req.body;

    // Get the book
    const book = await NoteBook.findOne({ _id: id, userId: sessionUser._id });

    if (!book) {
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
      userId: sessionUser._id,
      locked: locked || false,
    };

    console.log("The note: ", note);

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
