import { db } from "@/lib/db/client";
import { users, sessions } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./password";
import {
  createSessionToken,
  setSessionCookie,
  deleteSessionCookie,
} from "./session";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  isSuperAdmin: boolean;
}

export async function register(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthUser> {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);

  const [user] = await db
    .insert(users)
    .values({
      email: input.email,
      passwordHash,
      name: input.name || null,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      avatar: users.avatar,
      isSuperAdmin: users.isSuperAdmin,
    });

  await createSession(user.id);

  return user;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user || !user.passwordHash) {
    throw new Error("Invalid email or password");
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  await createSession(user.id);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    isSuperAdmin: user.isSuperAdmin,
  };
}

export async function logout() {
  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const token = cookieStore.get("plinth.session")?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  await deleteSessionCookie();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { getCurrentSession } = await import("./session");
  const session = await getCurrentSession();
  if (!session) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    isSuperAdmin: user.isSuperAdmin,
  };
}

async function createSession(userId: string) {
  const token = await createSessionToken(userId, crypto.randomUUID());
  const payload = await import("./session").then((m) =>
    m.verifySessionToken(token)
  );

  if (payload?.exp) {
    await db.insert(sessions).values({
      userId,
      token,
      expiresAt: new Date(payload.exp * 1000),
    });
  }

  await setSessionCookie(token);
}
