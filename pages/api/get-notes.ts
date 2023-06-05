import { UserType } from "./../../types/data/user";
import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextAuthOptions } from "next-auth";
import response from "@/lib/response";
import Note from "@/models/note";
import isUser from "@/lib/auth/isUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const user = await isUser(req, res);

    if (!user) return;

    const { id, protectionToken } = req.body;

    const book = await NoteBook.findOne({ _id: id, userId: user._id });

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

    // Get all notes related to the notebook
    const notes = await Note.find({ notebookId: id }).sort({
      createdAt: "desc",
    });

    return response(res, {
      type: "SUCCESS",
      data: notes,
    });
  } catch (error: any) {
    // handle cast errors
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
