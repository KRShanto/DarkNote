import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/clientPromise";
import User from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import { DEFAULT_PROTECTION_KEY } from "@/constants/security";
import bcrypt from "bcrypt";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  theme: {
    colorScheme: "dark",
  },
  callbacks: {
    session: async (session) => {
      if (session?.user) {
        session.session.user._id = session.user.id;
      }
      return session.session;
    },

    signIn: async (user, account, profile) => {
      // Check if the user is new or not
      // Check if there is any `protectionKey` in the user object
      // Generate default protection key
      // If there is no `protectionKey` then redirect to `/new` page

      // await dbConnect();

      // const userFromDB = await User.findOne({ email: user.user.email });

      // if (!userFromDB || !userFromDB.protectionKey) {
      //   // hash
      //   const salt = await bcrypt.genSalt(10);
      //   const hashedProtectionKey = await bcrypt.hash(
      //     DEFAULT_PROTECTION_KEY,
      //     salt
      //   );

      //   userFromDB.protectionKey = hashedProtectionKey;
      //   await userFromDB.save();

      //   return "/new";
      // }

      // return true;

      // return `/api/new?email=${user.user.email}`;
      return true;
    },
    // redirect: async (url, baseUrl) => {
    // after successful sign in, redirect to `/api/new` page

    // console.log("URL: ", url);
    // console.log("BASE URL: ", baseUrl);

    // if (url === "/api/auth/signin" || url === "/api/auth/signout") {
    //   return baseUrl;
    // }

    // return "/api/new";
    // },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
