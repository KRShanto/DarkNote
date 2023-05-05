import { UserType } from "./../../types/data/user";
import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextAuthOptions } from "next-auth";
import response from "@/lib/response";

// Get all notebooks related to the user
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
    return response(res, {
      type: "UNAUTHORIZED",
      msg: "You need to be signed in to get notebooks",
    });
  }

  const books = await NoteBook.find({ userId: sessionUser._id }).sort({
    createdAt: "desc",
  });

  return response(res, {
    type: "SUCCESS",
    data: books,
  });
}
