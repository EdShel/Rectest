import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions as IAuthOptions } from "next-auth";
import sha256 from "@/utils/sha256";
import db from "@/utils/db";

const AuthOptions: IAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.username) {
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

        console.log("user", user);

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
};
export default AuthOptions;
