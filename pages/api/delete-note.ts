import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import Note from "@/models/note";
import getUser from "@/lib/db/getUser";
import isLocked from "@/lib/db/isLocked";
import getNote from "@/lib/db/getNote";
import getBook from "@/lib/db/getBook";

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

    const note = await getNote(res, { _id: id });
    const book = await getBook(res, { _id: note.notebookId, userId: user._id });

    if (!note || !book) return;

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
