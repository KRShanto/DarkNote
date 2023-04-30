import { UserType } from "./../../types/data/user";
import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextAuthOptions } from "next-auth";
import response from "@/lib/response";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

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

  const { id, protectionToken } = req.body;

  const book = await NoteBook.findOne({ _id: id, userId: sessionUser._id });

  console.log("ID", id);
  console.log("protectionToken", protectionToken);

  console.log("The book: ", book);

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

  // return the book
  return response(res, {
    type: "SUCCESS",
    data: book,
  });
}
