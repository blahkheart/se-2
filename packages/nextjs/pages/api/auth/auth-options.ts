import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import dbConnect from "~~/lib/dbConnect";
import User from "~~/lib/models/user";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
          const NEXT_URL = process.env.NEXTAUTH_URL;
          if (!NEXT_URL) throw new Error("Add NEXTAUTH_URL to .env");
          const nextAuthUrl = new URL(NEXT_URL);
          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });
          console.log("NEXT_AUTH", result);
          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      await dbConnect();
      session.address = token.sub;
      const user = await User.findOne({ address: session.address });
      session.user.name = token.sub;
      session.user.image = "https://www.fillmurray.com/128/128";
      session.user.id = user._id.toString();
      return session;
    },
  },
};

export default authOptions;
