import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

export function attachUserIdToToken(token: JWT, user?: User): JWT {
  if (typeof user?.id === "string" && user.id.length > 0) {
    token.userId = user.id;
  }

  return token;
}

export function attachTokenUserIdToSession(session: Session, token: JWT): Session {
  const userId = getSessionOwnerIdFromToken(token);
  if (session.user && userId) {
    session.user.id = userId;
  }

  return session;
}

export function extractOwnerIdFromSession(session: Session | null): string | null {
  const ownerId = session?.user?.id;
  if (typeof ownerId !== "string" || ownerId.length === 0) {
    return null;
  }

  return ownerId;
}

function getSessionOwnerIdFromToken(token: JWT): string | null {
  if (typeof token.userId === "string" && token.userId.length > 0) {
    return token.userId;
  }

  if (typeof token.sub === "string" && token.sub.length > 0) {
    return token.sub;
  }

  return null;
}
