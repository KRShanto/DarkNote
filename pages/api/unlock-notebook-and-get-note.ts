import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import Note from "@/models/note";
import { v4 as uuidv4 } from "uuid";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { DEFAULT_PROTECTION_KEY } from "@/constants/security";
import getUser from "@/lib/db/getUser";
import getBook from "@/lib/db/getBook";
import getNote from "@/lib/db/getNote";

// Unclock a note
// Check if the protectionKey is correct
// Check if the note is locked
// Check if the notebook is locked
// Generate a token and save it in the database
// Return the token to the client
// Also return the note
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const sessionUser = await getUser(req, res);

    if (!sessionUser) return;

    const { id, protectionKey } = req.body;

    const note = await getNote(res, { _id: id, userId: sessionUser._id });
    const book = await getBook(res, { _id: note.notebookId });

    if (!note || !book) return;

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

    // const match = await bcrypt.compare(protectionKey, user.protectionKey);

    // Check if the user.protectionKey is null
    // If it is null, then the user has not set a protection key
    // So, we will compare with the default protection key
    let match = false;
    if (user.protectionKey) {
      match = await bcrypt.compare(protectionKey, user.protectionKey);
    } else {
      // Compare with the default protection key
      // don't use bcrypt here because the default protection key is not hashed
      match = protectionKey === DEFAULT_PROTECTION_KEY;

      // set the protection key to the default protection key
      // use bcrypt to hash the default protection key
      user.protectionKey = await bcrypt.hash(DEFAULT_PROTECTION_KEY, 10);
      await user.save();
    }

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

    return response(res, {
      type: "SUCCESS",
      msg: "Notebook unlocked successfully",
      data: {
        protectionToken: token,
        note,
      },
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
