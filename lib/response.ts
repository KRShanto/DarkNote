import { NextApiResponse } from "next";
import { ReturnedJsonType } from "../types/json";

export default function response(
  res: NextApiResponse,
  response: ReturnedJsonType,
  status?: number
) {
  return res.status(status || 200).json(response);
}
