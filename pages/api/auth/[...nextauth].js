import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/clientPromise";
import User from "@/models/user";
import dbConnect from "@/lib/dbConnect";

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
      // If there is no `protectionKey` then redirect to `/settings/security` page

      await dbConnect();

      const userFromDB = await User.findOne({ email: user.user.email });

      if (!userFromDB || !userFromDB.protectionKey) {
        return Promise.resolve("/settings/security?new=true");
      }

      return true;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
