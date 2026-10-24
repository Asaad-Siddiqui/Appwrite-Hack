"use server";

import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import {
  createAdminClient,
  DATABASE_ID,
  TABLES,
  ID,
  Query,
  normalizeDoc,
  normalizeDocs,
  safeRevalidatePath,
} from "../appwrite";
import { getUserById } from "./user.action";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const { tables } = createAdminClient();

    const queries: string[] = [Query.limit(pageSize), Query.offset(skipAmount)];

    if (filter === "newest") {
      queries.push(Query.orderDesc("createdAt"));
    } else if (filter === "frequent") {
      queries.push(Query.orderDesc("views"));
    }

    const result = await tables.listRows(DATABASE_ID, TABLES.QUESTIONS, queries);
    let questions = normalizeDocs(result.rows);

    if (filter === "unanswered") {
      questions = questions.filter((q) => !q.answers || q.answers.length === 0);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      questions = questions.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.content?.toLowerCase().includes(q)
      );
    }

    // Populate author and tags
    const populated = await Promise.all(
      questions.map(async (q) => {
        let authorObj = { _id: q.author, clerkId: q.author, name: "Anonymous", picture: "" };
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
          upvotes: Array.isArray(q.upvotes) ? q.upvotes : [],
          downvotes: Array.isArray(q.downvotes) ? q.downvotes : [],
          answers: Array.isArray(q.answers) ? q.answers : [],
        };
      })
    );

    const isNext = result.total > skipAmount + questions.length;
    return { questions: populated, isNext };
  } catch (error) {
    console.error("Error in getQuestions:", error);
    return { questions: [], isNext: false };
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    const { title, content, tags, author, path } = params;
    const { tables } = createAdminClient();

    // Resolve author row ID
    let authorId = author;
    const user = await getUserById({ userId: author });
    if (user) {
      authorId = user.$id;
    }

    const questionId = ID.unique();
    const tagIds: string[] = [];

    // Create or find tags
    for (const tagName of tags) {
      const cleanName = tagName.trim();
      if (!cleanName) continue;

      const existing = await tables.listRows(DATABASE_ID, TABLES.TAGS, [
        Query.equal("name", [cleanName]),
        Query.limit(1),
      ]);

      if (existing.rows && existing.rows.length > 0) {
        const tag = existing.rows[0];
        tagIds.push(tag.$id);
        const qList = Array.isArray(tag.questions) ? [...tag.questions, questionId] : [questionId];
        await tables.updateRow(DATABASE_ID, TABLES.TAGS, tag.$id, { questions: qList }).catch(() => {});
      } else {
        const newTag = await tables.createRow(DATABASE_ID, TABLES.TAGS, ID.unique(), {
          name: cleanName,
          description: `Questions related to ${cleanName}`,
          questions: [questionId],
          followers: [],
          createdOn: new Date().toISOString(),
        });
        tagIds.push(newTag.$id);
      }
    }

    const question = await tables.createRow(DATABASE_ID, TABLES.QUESTIONS, questionId, {
      title,
      content,
      tags: tagIds,
      author: authorId,
      views: 0,
      upvotes: [],
      downvotes: [],
      answers: [],
      createdAt: new Date().toISOString(),
    });

    // Record interaction
    await tables.createRow(DATABASE_ID, TABLES.INTERACTIONS, ID.unique(), {
      user: authorId,
      action: "ask_question",
      question: questionId,
      tags: tagIds,
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    // Increment user reputation
    if (user) {
      await tables.updateRow(DATABASE_ID, TABLES.USERS, user.$id, {
        reputation: (user.reputation || 0) + 5,
      }).catch(() => {});
    }

    safeRevalidatePath(path);
    return normalizeDoc(question);
  } catch (error) {
    console.error("Error in createQuestion:", error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    const { questionId } = params;
    const { tables } = createAdminClient();

    const q = await tables.getRow(DATABASE_ID, TABLES.QUESTIONS, questionId);
    if (!q) return null;

    let authorObj = { _id: q.author, clerkId: q.author, name: "Author", picture: "" };
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
      ...normalizeDoc(q),
      author: authorObj,
      tags: tagList,
      upvotes: Array.isArray(q.upvotes) ? q.upvotes : [],
      downvotes: Array.isArray(q.downvotes) ? q.downvotes : [],
      answers: Array.isArray(q.answers) ? q.answers : [],
    };
  } catch (error) {
    console.error("Error in getQuestionById:", error);
    return null;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    const { tables } = createAdminClient();

    const q = await tables.getRow(DATABASE_ID, TABLES.QUESTIONS, questionId);
    if (!q) throw new Error("Question not found");

    let upvotes: string[] = Array.isArray(q.upvotes) ? [...q.upvotes] : [];
    let downvotes: string[] = Array.isArray(q.downvotes) ? [...q.downvotes] : [];

    if (hasupVoted) {
      upvotes = upvotes.filter((id) => id !== userId);
    } else if (hasdownVoted) {
      downvotes = downvotes.filter((id) => id !== userId);
      if (!upvotes.includes(userId)) upvotes.push(userId);
    } else {
      if (!upvotes.includes(userId)) upvotes.push(userId);
    }

    await tables.updateRow(DATABASE_ID, TABLES.QUESTIONS, questionId, {
      upvotes,
      downvotes,
    });

    // Update reputation
    const author = await getUserById({ userId: q.author });
    if (author) {
      const repDiff = hasupVoted ? -10 : 10;
      await tables.updateRow(DATABASE_ID, TABLES.USERS, author.$id, {
        reputation: Math.max(0, (author.reputation || 0) + repDiff),
      }).catch(() => {});
    }

    safeRevalidatePath(path);
  } catch (error) {
    console.error("Error in upvoteQuestion:", error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    const { tables } = createAdminClient();

    const q = await tables.getRow(DATABASE_ID, TABLES.QUESTIONS, questionId);
    if (!q) throw new Error("Question not found");

    let upvotes: string[] = Array.isArray(q.upvotes) ? [...q.upvotes] : [];
    let downvotes: string[] = Array.isArray(q.downvotes) ? [...q.downvotes] : [];

    if (hasdownVoted) {
      downvotes = downvotes.filter((id) => id !== userId);
    } else if (hasupVoted) {
      upvotes = upvotes.filter((id) => id !== userId);
      if (!downvotes.includes(userId)) downvotes.push(userId);
    } else {
      if (!downvotes.includes(userId)) downvotes.push(userId);
    }

    await tables.updateRow(DATABASE_ID, TABLES.QUESTIONS, questionId, {
      upvotes,
      downvotes,
    });

    // Update reputation
    const author = await getUserById({ userId: q.author });
    if (author) {
      const repDiff = hasdownVoted ? 10 : -10;
      await tables.updateRow(DATABASE_ID, TABLES.USERS, author.$id, {
        reputation: Math.max(0, (author.reputation || 0) + repDiff),
      }).catch(() => {});
    }

    safeRevalidatePath(path);
  } catch (error) {
    console.error("Error in downvoteQuestion:", error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    const { questionId, path } = params;
    const { tables } = createAdminClient();

    await tables.deleteRow(DATABASE_ID, TABLES.QUESTIONS, questionId);

    // Delete associated answers
    const answers = await tables.listRows(DATABASE_ID, TABLES.ANSWERS, [
      Query.equal("question", [questionId]),
    ]);

    for (const a of answers.rows) {
      await tables.deleteRow(DATABASE_ID, TABLES.ANSWERS, a.$id).catch(() => {});
    }

    safeRevalidatePath(path);
  } catch (error) {
    console.error("Error in deleteQuestion:", error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    const { questionId, title, content, path } = params;
    const { tables } = createAdminClient();

    await tables.updateRow(DATABASE_ID, TABLES.QUESTIONS, questionId, {
      title,
      content,
    });

    safeRevalidatePath(path);
  } catch (error) {
    console.error("Error in editQuestion:", error);
  }
}

export async function getHotQuestions() {
  try {
    const { tables } = createAdminClient();
    const result = await tables.listRows(DATABASE_ID, TABLES.QUESTIONS, [
      Query.orderDesc("views"),
      Query.limit(5),
    ]);

    return normalizeDocs(result.rows);
  } catch (error) {
    console.error("Error in getHotQuestions:", error);
    return [];
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    const { userId, page = 1, pageSize = 20, searchQuery } = params;
    const user = await getUserById({ userId });

    const { tables } = createAdminClient();
    const result = await tables.listRows(DATABASE_ID, TABLES.QUESTIONS, [
      Query.orderDesc("createdAt"),
      Query.limit(pageSize),
      Query.offset((page - 1) * pageSize),
    ]);

    let questions = normalizeDocs(result.rows);

    if (user) {
      questions = questions.filter((q) => q.author !== user.$id);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      questions = questions.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.content?.toLowerCase().includes(q)
      );
    }

    const populated = await Promise.all(
      questions.map(async (q) => {
        let authorObj = { _id: q.author, clerkId: q.author, name: "Author", picture: "" };
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

    return { questions: populated, isNext: result.total > (page - 1) * pageSize + populated.length };
  } catch (error) {
    console.error("Error in getRecommendedQuestions:", error);
    return { questions: [], isNext: false };
  }
}
