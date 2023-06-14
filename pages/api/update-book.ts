import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import getUser from "@/lib/db/getUser";
import isLocked from "@/lib/db/isLocked";
import getBook from "@/lib/db/getBook";

// Update a note
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const user = await getUser(req, res);

    if (!user) return;

    const { id, title, locked, protectionToken } = req.body;

    const book = await getBook(res, { _id: id, userId: user._id });

    if (!book || isLocked(res, book, protectionToken)) return;

    // update the book
    book.title = title || book.title;
    book.locked = locked || book.locked;

    await book.save();

    return response(res, {
      type: "SUCCESS",
      msg: "Note created successfully",
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
