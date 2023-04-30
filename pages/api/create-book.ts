import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import { NotebookType } from "@/types/data/notebook";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextAuthOptions } from "next-auth";
import response from "@/lib/response";
import User from "@/models/user";

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
  const sessionUser = session?.user;

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

  const user = await User.findOne({ email: sessionUser.email });

  if (!user) {
    return response(res, {
      type: "NOTFOUND",
      msg: "User not found",
    });
  }

  const { title, description, locked } = req.body;

  if (!title || !description) {
    return response(
      res,
      {
        type: "INVALID",
        msg: "Title and description are required",
      },
      400
    );
  }

  const notebook: NotebookType = {
    title,
    description,
    locked,
    userId: user._id,
  };

  try {
    const newNotebook = await NoteBook.create(notebook);

    return response(res, {
      type: "SUCCESS",
      msg: "Notebook created",
      data: newNotebook,
    });
  } catch (error) {
    console.error(error);

    return response(
      res,
      {
        type: "SERVER_ERROR",
        msg: "Something went wrong",
      },
      500
    );
  }
}