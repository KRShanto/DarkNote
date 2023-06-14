import { NextApiRequest, NextApiResponse } from "next";
import NoteBook from "@/models/notebook";
import dbConnect from "@/lib/dbConnect";
import { NotebookType } from "@/types/data/notebook";
import response from "@/lib/response";
import getUser from "@/lib/db/getUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const user = await getUser(req, res);

  if (!user) return;

  const { title, locked } = req.body;

  if (!title) {
    return response(
      res,
      {
        type: "INVALID",
        msg: "Title and description are required",
      },
      400
    );
  }

  const notebook = {
    title,
    locked: locked || false,
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
