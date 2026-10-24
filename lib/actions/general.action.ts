"use server";

import { SearchParams } from "./shared.types";
import {
  createAdminClient,
  DATABASE_ID,
  TABLES,
  Query,
  normalizeDocs,
} from "../appwrite";

export async function globalSearch(params: SearchParams) {
  try {
    const { query, type } = params;
    if (!query) return JSON.stringify([]);

    const q = query.toLowerCase();
    const typeLower = type?.toLowerCase();
    const { tables } = createAdminClient();
    const results: any[] = [];

    if (!typeLower || typeLower === "question") {
      const qRes = await tables.listRows(DATABASE_ID, TABLES.QUESTIONS, [Query.limit(8)]);
      const filteredQ = qRes.rows.filter(
        (item: any) =>
          item.title?.toLowerCase().includes(q) || item.content?.toLowerCase().includes(q)
      );
      results.push(
        ...filteredQ.map((item: any) => ({
          title: item.title,
          type: "question",
          id: item.$id,
        }))
      );
    }

    if (!typeLower || typeLower === "user") {
      const uRes = await tables.listRows(DATABASE_ID, TABLES.USERS, [Query.limit(8)]);
      const filteredU = uRes.rows.filter(
        (item: any) =>
          item.name?.toLowerCase().includes(q) || item.username?.toLowerCase().includes(q)
      );
      results.push(
        ...filteredU.map((item: any) => ({
          title: item.name,
          type: "user",
          id: item.clerkId || item.accountId || item.$id,
        }))
      );
    }

    if (!typeLower || typeLower === "answer") {
      const aRes = await tables.listRows(DATABASE_ID, TABLES.ANSWERS, [Query.limit(8)]);
      const filteredA = aRes.rows.filter((item: any) =>
        item.content?.toLowerCase().includes(q)
      );
      results.push(
        ...filteredA.map((item: any) => ({
          title: `Answers containing ${query}`,
          type: "answer",
          id: item.question,
        }))
      );
    }

    if (!typeLower || typeLower === "tag") {
      const tRes = await tables.listRows(DATABASE_ID, TABLES.TAGS, [Query.limit(8)]);
      const filteredT = tRes.rows.filter((item: any) =>
        item.name?.toLowerCase().includes(q)
      );
      results.push(
        ...filteredT.map((item: any) => ({
          title: item.name,
          type: "tag",
          id: item.$id,
        }))
      );
    }

    return JSON.stringify(results.slice(0, 8));
  } catch (error) {
    console.error("Error in globalSearch:", error);
    return JSON.stringify([]);
  }
}
