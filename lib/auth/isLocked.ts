import { NextApiResponse } from "next";
import { NotebookType } from "@/types/data/notebook";
import response from "@/lib/response";

export default function isLocked(
  res: NextApiResponse,
  book: NotebookType,
  protectionToken: string
) {
  if (book.locked && !book.protectionToken) {
    response(res, {
      type: "LOCKED",
      msg: "No protection token found. You need to unlock the notebook first",
    });

    return true;
  }

  if (book.locked && book.protectionToken !== protectionToken) {
    response(res, {
      type: "LOCKED",
      msg: "Invalid protection token",
    });

    return true;
  }

  return false;
}
