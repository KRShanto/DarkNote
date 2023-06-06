import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import getUser from "@/lib/db/getUser";

// Get all notebooks related to the user
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const user = await getUser(req, res);

  if (!user) return;

  const books = await NoteBook.find({ userId: user._id }).sort({
    createdAt: "desc",
  });

  return response(res, {
    type: "SUCCESS",
    data: books,
  });
}
