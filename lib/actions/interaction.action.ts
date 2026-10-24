"use server";

import { ViewQuestionParams } from "./shared.types";
import {
  createAdminClient,
  DATABASE_ID,
  TABLES,
  ID,
  Query,
} from "../appwrite";
import { getUserById } from "./user.action";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    const { questionId, userId } = params;
    const { tables } = createAdminClient();

    const q = await tables.getRow(DATABASE_ID, TABLES.QUESTIONS, questionId);
    if (!q) return;

    // Increment question views
    await tables.updateRow(DATABASE_ID, TABLES.QUESTIONS, questionId, {
      views: (q.views || 0) + 1,
    });

    if (userId) {
      let resolvedUserId = userId;
      const user = await getUserById({ userId });
      if (user) resolvedUserId = user.$id;

      // Check existing interaction
      const existing = await tables.listRows(DATABASE_ID, TABLES.INTERACTIONS, [
        Query.equal("user", [resolvedUserId]),
        Query.equal("question", [questionId]),
        Query.equal("action", ["view"]),
        Query.limit(1),
      ]);

      if (existing.rows && existing.rows.length > 0) return;

      await tables.createRow(DATABASE_ID, TABLES.INTERACTIONS, ID.unique(), {
        user: resolvedUserId,
        action: "view",
        question: questionId,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error in viewQuestion:", error);
  }
}
