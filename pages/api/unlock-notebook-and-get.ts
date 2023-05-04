import { UserType } from "./../../types/data/user";
import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextAuthOptions } from "next-auth";
import response from "@/lib/response";
import Note from "@/models/note";
import { v4 as uuidv4 } from "uuid";
import User from "@/models/user";
import bcrypt from "bcrypt";

// Unclock a notebook
// Check if the protectionKey is correct
// Generate a token and save it in the database
// Return the token to the client
// Also return the notes
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

  const { id, protectionKey } = req.body;

  const book = await NoteBook.findOne({ _id: id, userId: sessionUser._id });

  if (!book) {
    return response(
      res,
      {
        type: "NOTFOUND",
        msg: "No notebook found",
      },
      404
    );
  }

  if (!book.locked) {
    return response(res, {
      type: "ALREADY",
      msg: "Notebook is already unlocked",
    });
  }

  // Get the protectionKey from the user
  // And match it with the protectionKey sent by the client
  const user = await User.findOne({ _id: sessionUser._id });

  if (!user) {
    return response(
      res,
      {
        type: "USER_NOTFOUND",
        msg: "No user found",
      },
      404
    );
  }

  const match = await bcrypt.compare(protectionKey, user.protectionKey);

  if (!match) {
    return response(
      res,
      {
        type: "INVALID",
        msg: "Invalid protection key",
      },
      401
    );
  }

  // Generate a token and save it in the database
  const token = uuidv4();

  book.protectionToken = token;
  await book.save();

  //   return response(res, {
  //     type: "SUCCESS",
  //     msg: "Notebook unlocked successfully",
  //     data: token,
  //   });

  // Also return the notes
  const notes = await Note.find({ notebookId: book._id });

  return response(res, {
    type: "SUCCESS",
    msg: "Notebook unlocked successfully",
    data: {
      protectionToken: token,
      notes,
    },
  });
}
