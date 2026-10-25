import { Client, TablesDB, Users, Account, Storage, ID, Query } from "node-appwrite";
import { cookies } from "next/headers";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "6adcb0d2002b03e62588";
const API_KEY = process.env.APPWRITE_API_KEY || "";
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "6adcb48000343a1edbc5";

export const TABLES = {
  USERS: "users",
  QUESTIONS: "questions",
  ANSWERS: "answers",
  TAGS: "tags",
  INTERACTIONS: "interactions",
} as const;

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  return {
    get tables() {
      return new TablesDB(client);
    },
    get users() {
      return new Users(client);
    },
    get account() {
      return new Account(client);
    },
    get storage() {
      return new Storage(client);
    },
    client,
  };
}

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session");

  if (session && session.value) {
    client.setSession(session.value);
  }

  return {
    get account() {
      return new Account(client);
    },
    get tables() {
      return new TablesDB(client);
    },
    client,
  };
}

export function normalizeDoc<T extends Record<string, any>>(doc: T): T & { _id: string; clerkId?: string } {
  if (!doc) return doc;
  const normalized = {
    ...doc,
    _id: doc.$id || doc._id,
    clerkId: doc.clerkId || doc.accountId || doc.$id,
  };
  return normalized;
}

export function normalizeDocs<T extends Record<string, any>>(docs: T[]): Array<T & { _id: string; clerkId?: string }> {
  if (!docs || !Array.isArray(docs)) return [];
  return docs.map(normalizeDoc);
}

export function safeRevalidatePath(path: string) {
  try {
    const { revalidatePath } = require("next/cache");
    if (path) revalidatePath(path);
  } catch {}
}

export { ID, Query };
