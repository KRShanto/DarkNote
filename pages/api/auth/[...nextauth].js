import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/clientPromise";

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
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
