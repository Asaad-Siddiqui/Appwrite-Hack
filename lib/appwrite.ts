// LendLoop data layer — real Appwrite TablesDB only, no mocks.
// Public config only: endpoint + project ID + database ID are NOT secrets.
// No API key is used anywhere in this app. Reads are public (read("any")).
// Writes use an anonymous Appwrite Auth session in the browser. In this
// Appwrite version an anonymous session counts as role "guests", not
// "users" (verified: a users-only table rejected writes with
// 'Missing "create" permission for role "users"'), so the tables allow
// create/update/delete for both "users" and "guests". This is a
// demo-member picker, not real identity verification — see README.md.
import { Client, Account, Databases, ID, Query } from "appwrite";

export const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  "https://sgp.cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6adc4f0700303717c3c5";
export const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "lendloop";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);
const account = new Account(client);
const databases = new Databases(client);

let anonPromise: Promise<unknown> | null = null;
export async function ensureAnonymous(): Promise<void> {
  if (anonPromise) return anonPromise as Promise<void>;
  anonPromise = (async () => {
    try {
      await account.get();
    } catch {
      try {
        await account.createAnonymousSession();
      } catch (e) {
        // Anonymous sessions may already exist / be unavailable in some
        // environments; reads still work, writes will surface the error.
        console.warn("anonymous session unavailable", e);
      }
    }
  })();
  return anonPromise as Promise<void>;
}

export type Member = {
  $id: string;
  name: string;
  neighbourhood: string;
  phone?: string | null;
};
export type Item = {
  $id: string;
  ownerMemberId: string;
  name: string;
  category: string;
  condition: string;
  description?: string | null;
  status: "available" | "borrowed" | "reserved" | string;
};
export type Loan = {
  $id: string;
  itemId: string;
  borrowerMemberId: string;
  ownerMemberId: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string | null;
  status: "active" | "returned" | "overdue" | string;
};
export type Reservation = {
  $id: string;
  itemId: string;
  memberId: string;
  reservedAt: string;
  status: "active" | "fulfilled" | "cancelled" | string;
};

async function listAll<T>(tableId: string, queries: string[] = []): Promise<T[]> {
  const out: T[] = [];
  let offset = 0;
  const limit = 100;
  for (;;) {
    const res = await databases.listDocuments(DATABASE_ID, tableId, [
      Query.limit(limit),
      Query.offset(offset),
      ...queries,
    ]);
    out.push(...(res.documents as unknown as T[]));
    if (res.documents.length < limit) break;
    offset += limit;
  }
  return out;
}

export const listMembers = () => listAll<Member>("members");
export const listItems = () => listAll<Item>("items");
export const listLoans = () => listAll<Loan>("loans");
export const listReservations = () => listAll<Reservation>("reservations");
export async function getItem(id: string): Promise<Item> {
  return (await databases.getDocument(
    DATABASE_ID,
    "items",
    id,
  )) as unknown as Item;
}
export async function getMember(id: string): Promise<Member> {
  return (await databases.getDocument(
    DATABASE_ID,
    "members",
    id,
  )) as unknown as Member;
}

export function isOverdue(loan: Loan, now = new Date()): boolean {
  return loan.status === "active" && new Date(loan.dueAt).getTime() < now.getTime();
}
export function daysOverdue(loan: Loan, now = new Date()): number {
  if (!isOverdue(loan, now)) return 0;
  return Math.max(
    0,
    Math.floor((now.getTime() - new Date(loan.dueAt).getTime()) / 86400000),
  );
}
export function daysLeft(loan: Loan, now = new Date()): number {
  return Math.ceil((new Date(loan.dueAt).getTime() - now.getTime()) / 86400000);
}
export function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export async function borrowItem(
  item: Item,
  borrowerMemberId: string,
): Promise<Loan> {
  await ensureAnonymous();
  const now = new Date();
  const due = addDays(now, 7);
  const loan = (await databases.createDocument(DATABASE_ID, "loans", ID.unique(), {
    itemId: item.$id,
    borrowerMemberId,
    ownerMemberId: item.ownerMemberId,
    borrowedAt: now.toISOString(),
    dueAt: due.toISOString(),
    returnedAt: null,
    status: "active",
  })) as unknown as Loan;
  await databases.updateDocument(DATABASE_ID, "items", item.$id, {
    status: "borrowed",
  });
  return loan;
}

export async function returnLoan(loan: Loan): Promise<void> {
  await ensureAnonymous();
  const now = new Date();
  await databases.updateDocument(DATABASE_ID, "loans", loan.$id, {
    status: "returned",
    returnedAt: now.toISOString(),
  });
  // If an active reservation exists for this item, it becomes reserved,
  // otherwise the item goes back to available.
  const reservations = await listReservations();
  const activeRes = reservations.find(
    (r) => r.itemId === loan.itemId && r.status === "active",
  );
  await databases.updateDocument(DATABASE_ID, "items", loan.itemId, {
    status: activeRes ? "reserved" : "available",
  });
  if (activeRes) {
    await databases.updateDocument(
      DATABASE_ID,
      "reservations",
      activeRes.$id,
      { status: "fulfilled" },
    );
  }
}

export async function reserveItem(
  item: Item,
  memberId: string,
): Promise<Reservation> {
  await ensureAnonymous();
  const res = (await databases.createDocument(
    DATABASE_ID,
    "reservations",
    ID.unique(),
    {
      itemId: item.$id,
      memberId,
      reservedAt: new Date().toISOString(),
      status: "active",
    },
  )) as unknown as Reservation;
  if (item.status === "available") {
    await databases.updateDocument(DATABASE_ID, "items", item.$id, {
      status: "reserved",
    });
  }
  return res;
}

export function memberName(members: Member[], id: string): string {
  return members.find((m) => m.$id === id)?.name ?? id;
}
export function itemName(items: Item[], id: string): string {
  return items.find((i) => i.$id === id)?.name ?? id;
}
