"use server";

import { cookies } from "next/headers";
import { ID, Query, createAdminClient, DATABASE_ID, TABLES, normalizeDoc } from "../appwrite";
import { Client, Account } from "node-appwrite";
import { revalidatePath } from "next/cache";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "6adcb0d2002b03e62588";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const { tables } = createAdminClient();

    const sessionClient = new Client()
      .setEndpoint(ENDPOINT)
      .setProject(PROJECT_ID)
      .setSession(sessionCookie.value);

    const account = new Account(sessionClient);
    const accountUser = await account.get();

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
      username: accountUser.email.split("@")[0],
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
    userId: user ? (user.clerkId || user.accountId || user.$id) : null,
    user: user || null,
  };
}

export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    const client = new Client()
      .setEndpoint(ENDPOINT)
      .setProject(PROJECT_ID);

    const account = new Account(client);
    const session = await account.createEmailPasswordSession(email, password);

    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expire),
    });

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
    const client = new Client()
      .setEndpoint(ENDPOINT)
      .setProject(PROJECT_ID);

    const account = new Account(client);
    const userId = ID.unique();
    await account.create(userId, email, password, name);

    // Create session
    const session = await account.createEmailPasswordSession(email, password);

    // Save profile in users table
    const { tables } = createAdminClient();
    await tables.createRow(DATABASE_ID, TABLES.USERS, ID.unique(), {
      accountId: userId,
      clerkId: userId,
      name,
      username,
      email,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      reputation: 0,
      saved: [],
      joinedAt: new Date().toISOString(),
    });

    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expire),
    });

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
      const client = new Client()
        .setEndpoint(ENDPOINT)
        .setProject(PROJECT_ID)
        .setSession(sessionCookie.value);

      const account = new Account(client);
      await account.deleteSession("current").catch(() => {});
    }

    cookieStore.delete("appwrite-session");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
