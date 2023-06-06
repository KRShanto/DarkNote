import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import Note from "@/models/note";
import getUser from "@/lib/auth/getUser";
import isLocked from "@/lib/auth/isLocked";

// Delete the note
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const user = await getUser(req, res);

    if (!user) return;

    const { id, protectionToken } = req.body;

    // Get the note
    const note = await Note.findOne({ _id: id });

    if (!note) {
      return response(res, {
        type: "NOTFOUND",
        msg: "No note found",
      });
    }

    const book = await NoteBook.findOne({
      _id: note.notebookId,
      userId: user._id,
    });

    if (!book) {
      return response(res, {
        type: "NOTFOUND",
        msg: "No notebook found",
      });
    }

    if (isLocked(res, book, protectionToken)) return;

    // delete the note
    await note.deleteOne();

    // send the response
    return response(res, {
      type: "SUCCESS",
      msg: "Note deleted successfully",
    });
  } catch (error: any) {
    // handle cast error
    if (error.name === "CastError") {
      return response(res, {
        type: "NOTFOUND",
        msg: "No note found",
      });
    }

    console.error(error);

    // handle other errors
    return response(res, {
      type: "SERVER_ERROR",
      msg: "Something went wrong",
    });
  }
}
