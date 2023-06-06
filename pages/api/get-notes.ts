import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import Note from "@/models/note";
import getUser from "@/lib/auth/getUser";
import isLocked from "@/lib/auth/isLocked";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const user = await getUser(req, res);

    if (!user) return;

    const { id, protectionToken } = req.body;

    const book = await NoteBook.findOne({ _id: id, userId: user._id });

    if (!book) {
      return response(res, {
        type: "NOTFOUND",
        msg: "No notebook found",
      });
    }

    if (isLocked(res, book, protectionToken)) return;

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
