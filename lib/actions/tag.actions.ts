"use server";

import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import {
  createAdminClient,
  DATABASE_ID,
  TABLES,
  Query,
  normalizeDoc,
  normalizeDocs,
} from "../appwrite";
import { getUserById } from "./user.action";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    const { userId } = params;
    const { tables } = createAdminClient();

    const user = await getUserById({ userId });
    if (!user) return [];

    const interactions = await tables.listRows(DATABASE_ID, TABLES.INTERACTIONS, [
      Query.equal("user", [user.$id]),
      Query.limit(50),
    ]);

    const tagCounts: Record<string, number> = {};
    for (const inter of interactions.rows) {
      if (Array.isArray(inter.tags)) {
        for (const tId of inter.tags) {
          tagCounts[tId] = (tagCounts[tId] || 0) + 1;
        }
      }
    }

    const sortedTagIds = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 3);
    const tags: any[] = [];
    for (const tId of sortedTagIds) {
      try {
        const t = await tables.getRow(DATABASE_ID, TABLES.TAGS, tId);
        if (t) tags.push(normalizeDoc(t));
      } catch {}
    }

    if (tags.length === 0) {
      const fallback = await tables.listRows(DATABASE_ID, TABLES.TAGS, [Query.limit(3)]);
      return normalizeDocs(fallback.rows);
    }

    return tags;
  } catch (error) {
    console.error("Error in getTopInteractedTags:", error);
    return [];
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const { tables } = createAdminClient();

    const queries: string[] = [Query.limit(pageSize), Query.offset(skipAmount)];

    if (filter === "recent") {
      queries.push(Query.orderDesc("createdOn"));
    } else if (filter === "name") {
      queries.push(Query.orderAsc("name"));
    } else if (filter === "old") {
      queries.push(Query.orderAsc("createdOn"));
    }

    const result = await tables.listRows(DATABASE_ID, TABLES.TAGS, queries);
    let tags = normalizeDocs(result.rows);

    if (filter === "popular") {
      tags.sort((a, b) => (b.questions?.length || 0) - (a.questions?.length || 0));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tags = tags.filter((t) => t.name?.toLowerCase().includes(q));
    }

    const isNext = result.total > skipAmount + tags.length;
    return { tags, isNext };
  } catch (error) {
    console.error("Error in getAllTags:", error);
    return { tags: [], isNext: false };
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;
    const { tables } = createAdminClient();

    const tag = await tables.getRow(DATABASE_ID, TABLES.TAGS, tagId);
    if (!tag) throw new Error("Tag not found");

    const qIds: string[] = Array.isArray(tag.questions) ? tag.questions : [];
    const questions: any[] = [];

    for (const qId of qIds) {
      try {
        const q = await tables.getRow(DATABASE_ID, TABLES.QUESTIONS, qId);
        if (q) questions.push(normalizeDoc(q));
      } catch {}
    }

    let filtered = questions;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.content?.toLowerCase().includes(q)
      );
    }

    const populated = await Promise.all(
      filtered.map(async (q) => {
        let authorObj = { _id: q.author, clerkId: q.author, name: "Author", picture: "" };
        try {
          const a = await getUserById({ userId: q.author });
          if (a) authorObj = a;
        } catch {}

        const tagList: any[] = [];
        if (Array.isArray(q.tags)) {
          for (const t of q.tags) {
            try {
              const tagRow = await tables.getRow(DATABASE_ID, TABLES.TAGS, t);
              if (tagRow) tagList.push(normalizeDoc(tagRow));
            } catch {}
          }
        }

        return {
          ...q,
          author: authorObj,
          tags: tagList,
        };
      })
    );

    const paginated = populated.slice(skipAmount, skipAmount + pageSize);
    const isNext = populated.length > skipAmount + pageSize;

    return { tagTitle: tag.name, questions: paginated, isNext };
  } catch (error) {
    console.error("Error in getQuestionsByTagId:", error);
    return { tagTitle: "", questions: [], isNext: false };
  }
}

export async function getPopularTags() {
  try {
    const { tables } = createAdminClient();
    const result = await tables.listRows(DATABASE_ID, TABLES.TAGS, [Query.limit(5)]);
    const tags = normalizeDocs(result.rows);
    tags.sort((a, b) => (b.questions?.length || 0) - (a.questions?.length || 0));
    return tags;
  } catch (error) {
    console.error("Error in getPopularTags:", error);
    return [];
  }
}

export const getTopPopularTags = getPopularTags;

