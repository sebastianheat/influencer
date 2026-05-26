import type { NextAuthConfig, DefaultSession } from "next-auth";

export type AppRole = "BRAND" | "CREATOR" | "ADMIN";

declare module "next-auth" {
  interface User {
    role?: AppRole;
  }
  interface Session {
    user: { id: string; role: AppRole } & DefaultSession["user"];
  }
}

const PROTECTED = ["/brand", "/creator", "/admin"];

export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.uid = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as AppRole;
      }
      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isProtected = PROTECTED.some(
        (p) => path === p || path.startsWith(p + "/"),
      );
      if (!isProtected) return true;
      if (!auth?.user) return false; // → redirect to /login
      const role = auth.user.role;
      if (path.startsWith("/admin") && role !== "ADMIN") return false;
      if (path.startsWith("/brand") && role === "CREATOR") return false;
      if (path.startsWith("/creator") && role === "BRAND") return false;
      return true;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
