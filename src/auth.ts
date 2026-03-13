import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import {
  attachTokenUserIdToSession,
  attachUserIdToToken,
} from "@/features/auth/auth-callbacks";
import { getOwnerUserRepository } from "@/features/auth/repositories";
import { verifyOwnerCredentials } from "@/features/auth/service";
import { parseLoginInput } from "@/features/auth/validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = parseLoginInput({
          email: String(credentials?.email ?? ""),
          password: String(credentials?.password ?? ""),
        });

        if (!parsed.success) {
          return null;
        }

        const owner = await verifyOwnerCredentials(
          getOwnerUserRepository(),
          parsed.data,
        );

        if (!owner) {
          return null;
        }

        return {
          id: owner.id,
          email: owner.email,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      return attachUserIdToToken(token, user);
    },
    session({ session, token }) {
      return attachTokenUserIdToSession(session, token);
    },
  },
});
