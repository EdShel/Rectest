import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/utils/db";
import sha256 from "@/utils/sha256";

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const passwordHash = sha256(credentials.password);
        const user = await db.user.findFirst({
          where: {
            email: credentials.username,
          },
          include: {
            password: true,
          },
        });

        if (!user) {
          return null;
        }

        if (user.password!.password_hash !== passwordHash) {
          return null;
        }

        return user;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
