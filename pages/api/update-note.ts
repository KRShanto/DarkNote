import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import response from "@/lib/response";
import Note from "@/models/note";
import getUser from "@/lib/db/getUser";
import isLocked from "@/lib/db/isLocked";
import getBook from "@/lib/db/getBook";
import getNote from "@/lib/db/getNote";
import crypto from "crypto";

// Update a note
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const user = await getUser(req, res);

    if (!user) return;

    const { id, title, content, textContent, protectionToken } = req.body;

    const note = await getNote(res, { _id: id, userId: user._id });

    if (!note) return;

    const book = await getBook(res, { _id: note.notebookId, userId: user._id });

    if (!book || isLocked(res, book, protectionToken)) return;

    // update the note
    // const newNote = await Note.findOneAndUpdate(
    //   { _id: id, userId: user._id },
    //   { title, content, textContent },
    //   { new: true }
    // );

    // update the note
    let noteContent = note.content;
    let noteTextContent = note.textContent;
    let noteIv;

    // If content is provided, encrypt it (textContent is always provided with the content)
    if (content) {
      // Generate a random initialization vector
      const iv = crypto.randomBytes(16);

      // Encrypt the content using AES-256-CBC encryption
      const contentCipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(process.env.PROTECTION_KEY as string),
        iv
      );

      let encryptedContent = contentCipher.update(content, "utf8", "hex");
      encryptedContent += contentCipher.final("hex");

      // Encrypt the text content using AES-256-CBC encryption
      const textContentCipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(process.env.PROTECTION_KEY as string),
        iv
      );

      let encryptedTextContent = textContentCipher.update(
        textContent,
        "utf8",
        "hex"
      );
      encryptedTextContent += textContentCipher.final("hex");

      // Store the encrypted contents
      noteContent = encryptedContent;
      noteTextContent = encryptedTextContent;
      noteIv = iv.toString("hex");
    }

    note.title = title || note.title;
    note.content = noteContent || note.content;
    note.textContent = noteTextContent || note.textContent;
    note.iv = noteIv || note.iv;

    await note.save();

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
