import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import getUser from "@/lib/db/getUser";
import isLocked from "@/lib/db/isLocked";
import getBook from "@/lib/db/getBook";
import getNote from "@/lib/db/getNote";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const user = await getUser(req, res);

    if (!user) return;

    // TODO: don't take `notebookId` from the body, but from the note db
    const { id, notebookId, protectionToken } = req.body;

    const book = await getBook(res, { _id: notebookId, userId: user._id });

    if (!book || isLocked(res, book, protectionToken)) return;

    const note = await getNote(res, { _id: id, notebookId: notebookId });

    if (!note) return;

    return response(res, {
      type: "SUCCESS",
      data: note,
    });
  } catch (error: any) {
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
