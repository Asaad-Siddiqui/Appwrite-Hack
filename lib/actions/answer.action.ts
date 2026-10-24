"use server";

import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
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

export async function createAnswer(params: CreateAnswerParams) {
  try {
    const { content, author, question, path } = params;
    const { tables } = createAdminClient();

    let authorId = author;
    const user = await getUserById({ userId: author });
    if (user) authorId = user.$id;

    const answerId = ID.unique();
    const newAnswer = await tables.createRow(DATABASE_ID, TABLES.ANSWERS, answerId, {
      content,
      author: authorId,
      question,
      upvotes: [],
      downvotes: [],
      createdAt: new Date().toISOString(),
    });

    // Add answer to question's answers array
    try {
      const q = await tables.getRow(DATABASE_ID, TABLES.QUESTIONS, question);
      if (q) {
        const answersList = Array.isArray(q.answers) ? [...q.answers, answerId] : [answerId];
        await tables.updateRow(DATABASE_ID, TABLES.QUESTIONS, question, {
          answers: answersList,
        });
      }
    } catch {}

    // Record interaction
    await tables.createRow(DATABASE_ID, TABLES.INTERACTIONS, ID.unique(), {
      user: authorId,
      action: "answer",
      question,
      answer: answerId,
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    // Increment author reputation
    if (user) {
      await tables.updateRow(DATABASE_ID, TABLES.USERS, user.$id, {
        reputation: (user.reputation || 0) + 10,
      }).catch(() => {});
    }

    safeRevalidatePath(path);
    return normalizeDoc(newAnswer);
  } catch (error) {
    console.error("Error in createAnswer:", error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    const { questionId, sortBy, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const { tables } = createAdminClient();

    const queries: string[] = [
      Query.equal("question", [questionId]),
      Query.limit(pageSize),
      Query.offset(skipAmount),
    ];

    if (sortBy === "recent") {
      queries.push(Query.orderDesc("createdAt"));
    } else if (sortBy === "old") {
      queries.push(Query.orderAsc("createdAt"));
    }

    const result = await tables.listRows(DATABASE_ID, TABLES.ANSWERS, queries);
    let answers = normalizeDocs(result.rows);

    if (sortBy === "highestUpvotes") {
      answers.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
    } else if (sortBy === "lowestUpvotes") {
      answers.sort((a, b) => (a.upvotes?.length || 0) - (b.upvotes?.length || 0));
    }

    // Populate author
    const populated = await Promise.all(
      answers.map(async (ans) => {
        let authorObj = { _id: ans.author, clerkId: ans.author, name: "Author", picture: "" };
        try {
          const a = await getUserById({ userId: ans.author });
          if (a) authorObj = a;
        } catch {}

        return {
          ...ans,
          author: authorObj,
          upvotes: Array.isArray(ans.upvotes) ? ans.upvotes : [],
          downvotes: Array.isArray(ans.downvotes) ? ans.downvotes : [],
        };
      })
    );

    const isNextAnswer = result.total > skipAmount + answers.length;
    return { answers: populated, isNextAnswer };
  } catch (error) {
    console.error("Error in getAnswers:", error);
    return { answers: [], isNextAnswer: false };
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    const { tables } = createAdminClient();

    const ans = await tables.getRow(DATABASE_ID, TABLES.ANSWERS, answerId);
    if (!ans) throw new Error("Answer not found");

    let upvotes: string[] = Array.isArray(ans.upvotes) ? [...ans.upvotes] : [];
    let downvotes: string[] = Array.isArray(ans.downvotes) ? [...ans.downvotes] : [];

    if (hasupVoted) {
      upvotes = upvotes.filter((id) => id !== userId);
    } else if (hasdownVoted) {
      downvotes = downvotes.filter((id) => id !== userId);
      if (!upvotes.includes(userId)) upvotes.push(userId);
    } else {
      if (!upvotes.includes(userId)) upvotes.push(userId);
    }

    await tables.updateRow(DATABASE_ID, TABLES.ANSWERS, answerId, {
      upvotes,
      downvotes,
    });

    safeRevalidatePath(path);
  } catch (error) {
    console.error("Error in upvoteAnswer:", error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    const { tables } = createAdminClient();

    const ans = await tables.getRow(DATABASE_ID, TABLES.ANSWERS, answerId);
    if (!ans) throw new Error("Answer not found");

    let upvotes: string[] = Array.isArray(ans.upvotes) ? [...ans.upvotes] : [];
    let downvotes: string[] = Array.isArray(ans.downvotes) ? [...ans.downvotes] : [];

    if (hasdownVoted) {
      downvotes = downvotes.filter((id) => id !== userId);
    } else if (hasupVoted) {
      upvotes = upvotes.filter((id) => id !== userId);
      if (!downvotes.includes(userId)) downvotes.push(userId);
    } else {
      if (!downvotes.includes(userId)) downvotes.push(userId);
    }

    await tables.updateRow(DATABASE_ID, TABLES.ANSWERS, answerId, {
      upvotes,
      downvotes,
    });

    safeRevalidatePath(path);
  } catch (error) {
    console.error("Error in downvoteAnswer:", error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    const { answerId, path } = params;
    const { tables } = createAdminClient();

    const ans = await tables.getRow(DATABASE_ID, TABLES.ANSWERS, answerId);
    if (ans) {
      try {
        const q = await tables.getRow(DATABASE_ID, TABLES.QUESTIONS, ans.question);
        if (q && Array.isArray(q.answers)) {
          const updatedAnswers = q.answers.filter((id: string) => id !== answerId);
          await tables.updateRow(DATABASE_ID, TABLES.QUESTIONS, ans.question, {
            answers: updatedAnswers,
          });
        }
      } catch {}

      await tables.deleteRow(DATABASE_ID, TABLES.ANSWERS, answerId);
    }

    safeRevalidatePath(path);
  } catch (error) {
    console.error("Error in deleteAnswer:", error);
  }
}
