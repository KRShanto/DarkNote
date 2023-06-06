import Note from "@/models/note";
import response from "@/lib/response";
import { NextApiResponse } from "next";

// Get the book
export default async function getNote(res: NextApiResponse, query: any) {
  // Get the note
  const note = await Note.findOne(query);

  if (!note) {
    response(res, {
      type: "NOTFOUND",
      msg: "No note found",
    });

    return null;
  }

  return note;
}
