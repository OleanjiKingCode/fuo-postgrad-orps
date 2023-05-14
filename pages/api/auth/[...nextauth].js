import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import Student from "@/models/userSchema";
import db from "@/utils/db";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await Student.findOne({
          email: credentials.email,
        });
        await db.disConnect();
        if (user && credentials.password == user.password) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            matricno: user.matricno,
          };
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
});
