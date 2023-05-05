import { UserType } from "./../../types/data/user";
import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextAuthOptions } from "next-auth";
import response from "@/lib/response";
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
      return response(res, {
        type: "UNAUTHORIZED",
        msg: "You need to be signed in to create a notebook",
      });
    }

    // TODO: don't take `notebookId` from the body, but from the note db
    const { id, notebookId, protectionToken } = req.body;

    const book = await NoteBook.findOne({
      _id: notebookId,
      userId: sessionUser._id,
    });

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

    //   // Get all notes related to the notebook
    //   const notes = await Note.find({ notebookId: id }).sort({
    //     createdAt: "desc",
    //   });

    // Get the note
    const note = await Note.findOne({ _id: id, notebookId: notebookId });

    if (!note) {
      return response(res, {
        type: "NOTFOUND",
        msg: "No note found",
      });
    }

    return response(res, {
      type: "SUCCESS",
      data: note,
    });
  } catch (error: any) {
    // return response(
    //   res,
    //   {
    //     type: "SERVER_ERROR",
    //     msg: "Something went wrong: " + error.message,
    //   },
    //   500
    // );

    // handle CastError
    if (error.name === "CastError") {
      return response(res, {
        type: "NOTFOUND",
        msg: "No note found",
      });
    }

    console.error(error);

    return response(res, {
      type: "SERVER_ERROR",
      msg: "Something went wrong: " + error.message,
    });
  }
}
