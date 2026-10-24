"use server";

import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";
import {
  createAdminClient,
  DATABASE_ID,
  TABLES,
  ID,
  Query,
  normalizeDoc,
  normalizeDocs,
} from "../appwrite";

export async function getUserById(params: any) {
  try {
    const { userId } = params;
    if (!userId) return null;

    const { tables } = createAdminClient();

    // Try finding by clerkId / accountId
    let result = await tables.listRows(DATABASE_ID, TABLES.USERS, [
      Query.equal("clerkId", [userId]),
      Query.limit(1),
    ]);

    if (!result.rows || result.rows.length === 0) {
      result = await tables.listRows(DATABASE_ID, TABLES.USERS, [
        Query.equal("accountId", [userId]),
        Query.limit(1),
      ]);
    }

    if (!result.rows || result.rows.length === 0) {
      // Try direct row ID lookup
      try {
        const row = await tables.getRow(DATABASE_ID, TABLES.USERS, userId);
        if (row) return normalizeDoc(row);
      } catch {}
    }

    if (result.rows && result.rows.length > 0) {
      return normalizeDoc(result.rows[0]);
    }

    return null;
  } catch (error) {
    console.error("Error in getUserById:", error);
    return null;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    const { tables } = createAdminClient();
    const newUser = await tables.createRow(DATABASE_ID, TABLES.USERS, ID.unique(), {
      clerkId: userData.clerkId,
      accountId: userData.clerkId,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      picture: userData.picture,
      reputation: 0,
      saved: [],
      joinedAt: new Date().toISOString(),
    });

    return normalizeDoc(newUser);
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    const { clerkId, updateData, path } = params;
    const { tables } = createAdminClient();

    const user = await getUserById({ userId: clerkId });
    if (!user) throw new Error("User not found");

    const updated = await tables.updateRow(DATABASE_ID, TABLES.USERS, user.$id, updateData);

    if (path) revalidatePath(path);
    return normalizeDoc(updated);
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    const { clerkId } = params;
    const { tables } = createAdminClient();

    const user = await getUserById({ userId: clerkId });
    if (!user) throw new Error("User not found");

    // Delete questions authored by user
    const questions = await tables.listRows(DATABASE_ID, TABLES.QUESTIONS, [
      Query.equal("author", [user.$id]),
    ]);

    for (const q of questions.rows) {
      await tables.deleteRow(DATABASE_ID, TABLES.QUESTIONS, q.$id).catch(() => {});
    }

    await tables.deleteRow(DATABASE_ID, TABLES.USERS, user.$id);
    return user;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const { tables } = createAdminClient();

    const queries: string[] = [Query.limit(pageSize), Query.offset(skipAmount)];

    if (filter === "new_users") {
      queries.push(Query.orderDesc("joinedAt"));
    } else if (filter === "old_users") {
      queries.push(Query.orderAsc("joinedAt"));
    } else if (filter === "top_contributors") {
      queries.push(Query.orderDesc("reputation"));
    }

    const result = await tables.listRows(DATABASE_ID, TABLES.USERS, queries);
    let users = normalizeDocs(result.rows);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      users = users.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q)
      );
    }

    const totalUsers = result.total;
    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return { users: [], isNext: false };
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    const { userId, questionId, path } = params;
    const { tables } = createAdminClient();

    const user = await getUserById({ userId });
    if (!user) throw new Error("User not found");

    const saved: string[] = Array.isArray(user.saved) ? [...user.saved] : [];
    const index = saved.indexOf(questionId);

    if (index > -1) {
      saved.splice(index, 1);
    } else {
      saved.push(questionId);
    }

    await tables.updateRow(DATABASE_ID, TABLES.USERS, user.$id, { saved });

    if (path) revalidatePath(path);
  } catch (error) {
    console.error("Error in toggleSaveQuestion:", error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;
    const { tables } = createAdminClient();

    const user = await getUserById({ userId: clerkId });
    if (!user) throw new Error("User not found");

    const savedIds: string[] = Array.isArray(user.saved) ? user.saved : [];
    if (savedIds.length === 0) {
      return { questions: [], isNext: false };
    }

    const questions: any[] = [];
    for (const qId of savedIds) {
      try {
        const q = await tables.getRow(DATABASE_ID, TABLES.QUESTIONS, qId);
        if (q) questions.push(normalizeDoc(q));
      } catch {}
    }

    // Populate tags and author
    const populated = await Promise.all(
      questions.map(async (q) => {
        let authorObj = { _id: q.author, clerkId: q.author, name: "Developer", picture: "" };
        try {
          const a = await getUserById({ userId: q.author });
          if (a) authorObj = a;
        } catch {}

        const tagList: any[] = [];
        if (Array.isArray(q.tags)) {
          for (const tId of q.tags) {
            try {
              const t = await tables.getRow(DATABASE_ID, TABLES.TAGS, tId);
              if (t) tagList.push(normalizeDoc(t));
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

    let filtered = populated;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.content?.toLowerCase().includes(q)
      );
    }

    if (filter === "most_recent") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filter === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filter === "most_voted") {
      filtered.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
    } else if (filter === "most_viewed") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (filter === "most_answered") {
      filtered.sort((a, b) => (b.answers?.length || 0) - (a.answers?.length || 0));
    }

    const skipAmount = (page - 1) * pageSize;
    const paginated = filtered.slice(skipAmount, skipAmount + pageSize);
    const isNext = filtered.length > skipAmount + pageSize;

    return { questions: paginated, isNext };
  } catch (error) {
    console.error("Error in getSavedQuestions:", error);
    return { questions: [], isNext: false };
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    const { userId } = params;
    const { tables } = createAdminClient();

    const user = await getUserById({ userId });
    if (!user) throw new Error("User not found");

    // Total questions
    const qRes = await tables.listRows(DATABASE_ID, TABLES.QUESTIONS, [
      Query.equal("author", [user.$id]),
    ]);
    const totalQuestions = qRes.total;

    // Total answers
    const aRes = await tables.listRows(DATABASE_ID, TABLES.ANSWERS, [
      Query.equal("author", [user.$id]),
    ]);
    const totalAnswers = aRes.total;

    let questionUpvotes = 0;
    let questionViews = 0;
    for (const q of qRes.rows) {
      questionUpvotes += Array.isArray(q.upvotes) ? q.upvotes.length : 0;
      questionViews += q.views || 0;
    }

    let answerUpvotes = 0;
    for (const a of aRes.rows) {
      answerUpvotes += Array.isArray(a.upvotes) ? a.upvotes.length : 0;
    }

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      { type: "QUESTION_UPVOTES" as BadgeCriteriaType, count: questionUpvotes },
      { type: "ANSWER_UPVOTES" as BadgeCriteriaType, count: answerUpvotes },
      { type: "TOTAL_VIEWS" as BadgeCriteriaType, count: questionViews },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation || 0,
    };
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const { tables } = createAdminClient();

    const user = await getUserById({ userId });
    const authorId = user ? user.$id : userId;

    const result = await tables.listRows(DATABASE_ID, TABLES.QUESTIONS, [
      Query.equal("author", [authorId]),
      Query.orderDesc("createdAt"),
      Query.limit(pageSize),
      Query.offset(skipAmount),
    ]);

    const populated = await Promise.all(
      result.rows.map(async (q: any) => {
        const tagList: any[] = [];
        if (Array.isArray(q.tags)) {
          for (const tId of q.tags) {
            try {
              const t = await tables.getRow(DATABASE_ID, TABLES.TAGS, tId);
              if (t) tagList.push(normalizeDoc(t));
            } catch {}
          }
        }
        return {
          ...normalizeDoc(q),
          author: user || { _id: authorId, clerkId: authorId, name: "User", picture: "" },
          tags: tagList,
        };
      })
    );

    const isNextQuestions = result.total > skipAmount + populated.length;
    return { totalQuestions: result.total, questions: populated, isNextQuestions };
  } catch (error) {
    console.error("Error in getUserQuestions:", error);
    return { totalQuestions: 0, questions: [], isNextQuestions: false };
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const { tables } = createAdminClient();

    const user = await getUserById({ userId });
    const authorId = user ? user.$id : userId;

    const result = await tables.listRows(DATABASE_ID, TABLES.ANSWERS, [
      Query.equal("author", [authorId]),
      Query.orderDesc("createdAt"),
      Query.limit(pageSize),
      Query.offset(skipAmount),
    ]);

    const populated = await Promise.all(
      result.rows.map(async (a: any) => {
        let questionObj = { _id: a.question, title: "Question" };
        try {
          const q = await tables.getRow(DATABASE_ID, TABLES.QUESTIONS, a.question);
          if (q) questionObj = normalizeDoc(q);
        } catch {}

        return {
          ...normalizeDoc(a),
          question: questionObj,
          author: user || { _id: authorId, clerkId: authorId, name: "User", picture: "" },
        };
      })
    );

    const isNextAnswer = result.total > skipAmount + populated.length;
    return { totalAnswers: result.total, answers: populated, isNextAnswer };
  } catch (error) {
    console.error("Error in getUserAnswers:", error);
    return { totalAnswers: 0, answers: [], isNextAnswer: false };
  }
}
