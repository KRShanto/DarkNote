import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import response from "@/lib/response";
import { UserType } from "@/types/data/user";

export default async function isUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(
    req,
    res,
    authOptions as NextAuthOptions
  );
  const sessionUser = session?.user as UserType;

  if (!sessionUser) {
    response(
      res,
      {
        type: "UNAUTHORIZED",
        msg: "You need to be signed in to create a notebook",
      },
      401
    );

    return false;
  }

  return sessionUser;
}
