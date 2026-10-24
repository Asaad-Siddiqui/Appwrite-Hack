"use server";

import { cookies } from "next/headers";
import { ID, Query, createAdminClient, DATABASE_ID, TABLES, normalizeDoc, safeRevalidatePath } from "../appwrite";
import { Client, Account } from "node-appwrite";
import { revalidatePath } from "next/cache";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "6adcb0d2002b03e62588";

export async function getCurrentUser() {
  try {
    let sessionToken: string | undefined;
    try {
      const cookieStore = await cookies();
      sessionToken = cookieStore.get("appwrite-session")?.value;
    } catch {}

    if (!sessionToken) {
      return null;
    }

    const { tables, users } = createAdminClient();

    let accountUser: any = null;

    // 1. Try resolving account user via session client
    try {
      const sessionClient = new Client()
        .setEndpoint(ENDPOINT)
        .setProject(PROJECT_ID)
        .setSession(sessionToken);

      const account = new Account(sessionClient);
      accountUser = await account.get();
    } catch {
      // 2. If token is a base64 encoded JSON { id, secret }
      try {
        const decoded = JSON.parse(Buffer.from(sessionToken, "base64").toString("utf8"));
        if (decoded && decoded.id) {
          accountUser = await users.get(decoded.id);
        }
      } catch {}
    }

    if (!accountUser || !accountUser.$id) {
      return null;
    }

    // Find profile in users table
    const result = await tables.listRows(DATABASE_ID, TABLES.USERS, [
      Query.equal("accountId", [accountUser.$id]),
    ]);

    if (result.rows && result.rows.length > 0) {
      return normalizeDoc(result.rows[0]);
    }

    // Try finding by email
    const emailResult = await tables.listRows(DATABASE_ID, TABLES.USERS, [
      Query.equal("email", [accountUser.email]),
    ]);

    if (emailResult.rows && emailResult.rows.length > 0) {
      return normalizeDoc(emailResult.rows[0]);
    }

    // If profile doesn't exist yet, create one
    const newProfile = await tables.createRow(DATABASE_ID, TABLES.USERS, ID.unique(), {
      accountId: accountUser.$id,
      clerkId: accountUser.$id,
      name: accountUser.name || accountUser.email.split("@")[0],
      username: (accountUser.email.split("@")[0] || "user").toLowerCase(),
      email: accountUser.email,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${accountUser.email}`,
      reputation: 0,
      saved: [],
      joinedAt: new Date().toISOString(),
    });

    return normalizeDoc(newProfile);
  } catch (error) {
    return null;
  }
}

export async function auth() {
  const user = await getCurrentUser();
  return {
    userId: user ? (user.clerkId || user.accountId || user.$id || user._id) : null,
    user: user || null,
  };
}

export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verify credentials with Appwrite API
    const res = await fetch(`${ENDPOINT}/account/sessions/email`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-appwrite-project": PROJECT_ID,
      },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Invalid email or password." };
    }

    const sessBody = await res.json().catch(() => ({}));

    // 2. Extract session secret
    let sessionToken = sessBody.secret;
    const setCookie = res.headers.get("set-cookie") || "";
    if (!sessionToken && setCookie) {
      const match = setCookie.match(new RegExp(`a_session_${PROJECT_ID}=([^;]+)`));
      if (match && match[1]) {
        sessionToken = match[1];
      }
    }

    // Fallback: If not in cookie, create session via admin
    if (!sessionToken) {
      const { users } = createAdminClient();
      const list = await users.list([Query.equal("email", [normalizedEmail])]);
      if (list.users && list.users.length > 0) {
        const s = await users.createSession(list.users[0].$id);
        sessionToken = s.secret;
      }
    }

    if (!sessionToken) {
      return { success: false, error: "Failed to establish user session." };
    }

    try {
      const cookieStore = await cookies();
      const expireDate = sessBody.expire
        ? new Date(sessBody.expire)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      cookieStore.set("appwrite-session", sessionToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expireDate,
      });
    } catch {}

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to sign in" };
  }
}

export async function signUp({
  name,
  username,
  email,
  password,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
}) {
  try {
    const { users, tables } = createAdminClient();
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();
    const userId = ID.unique();

    // 1. Create Appwrite auth user
    await users.create(userId, normalizedEmail, undefined, password, name);

    // 2. Create session with valid session secret
    const session = await users.createSession(userId);

    // 3. Save profile in users table
    await tables.createRow(DATABASE_ID, TABLES.USERS, ID.unique(), {
      accountId: userId,
      clerkId: userId,
      name,
      username: normalizedUsername,
      email: normalizedEmail,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${normalizedUsername}`,
      reputation: 0,
      saved: [],
      joinedAt: new Date().toISOString(),
    });

    // 4. Set session cookie
    try {
      const cookieStore = await cookies();
      const expireDate = session.expire
        ? new Date(session.expire)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      cookieStore.set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expireDate,
      });
    } catch {}

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create account" };
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");

    if (sessionCookie && sessionCookie.value) {
      try {
        const client = new Client()
          .setEndpoint(ENDPOINT)
          .setProject(PROJECT_ID)
          .setSession(sessionCookie.value);

        const account = new Account(client);
        await account.deleteSession("current").catch(() => {});
      } catch {}
    }

    cookieStore.delete("appwrite-session");
    safeRevalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
