import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import Note from "@/models/note";
import getUser from "@/lib/db/getUser";
import isLocked from "@/lib/db/isLocked";
import getBook from "@/lib/db/getBook";

// Delete the book
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const user = await getUser(req, res);

    if (!user) return;

    const { id, protectionToken } = req.body;

    const book = await getBook(res, { _id: id, userId: user._id });

    if (!book) return;

    if (isLocked(res, book, protectionToken)) return;

    // Delete the book
    await NoteBook.deleteOne({ _id: id });

    // Delete all the notes
    await Note.deleteMany({ notebookId: id });

    console.log("Notebook deleted successfully");

    return response(res, {
      type: "SUCCESS",
      msg: "Notebook deleted successfully",
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
