import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import getUser from "@/lib/db/getUser";
import getBook from "@/lib/db/getBook";
import { bookWithoutToken } from "@/lib/db/bookWithoutToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const user = await getUser(req, res);

    if (!user) return;

    const { id } = req.body;

    const book = await getBook(res, { _id: id, userId: user._id });

    if (!book) return;

    // return the book
    return response(res, {
      type: "SUCCESS",
      // don't return the `protectionToken` to the client
      data: bookWithoutToken(book),
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

    // handle all other errors
    return response(res, {
      type: "SERVER_ERROR",
      msg: "Something went wrong",
    });
  }
}
