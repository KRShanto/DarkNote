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

  try {
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

    const { id } = req.body;

    const book = await NoteBook.findOne({ _id: id, userId: sessionUser._id });

    if (!book) {
      return response(res, {
        type: "NOTFOUND",
        msg: "No notebook found",
      });
    }

    // return the book
    return response(res, {
      type: "SUCCESS",
      data: book,
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
