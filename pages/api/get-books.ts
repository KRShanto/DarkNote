import { UserType } from "./../../types/data/user";
import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextAuthOptions } from "next-auth";
import response from "@/lib/response";
import isUser from "@/lib/auth/isUser";

// Get all notebooks related to the user
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const user = await isUser(req, res);

  if (!user) return;

  const books = await NoteBook.find({ userId: user._id }).sort({
    createdAt: "desc",
  });

  return response(res, {
    type: "SUCCESS",
    data: books,
  });
}
