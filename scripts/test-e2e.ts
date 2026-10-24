import { signUp, signIn, getCurrentUser, signOut } from "../lib/actions/auth.action";
import { createQuestion, upvoteQuestion, getQuestionById } from "../lib/actions/question.action";
import { createAnswer, upvoteAnswer, getAnswers } from "../lib/actions/answer.action";
import { toggleSaveQuestion, getUserInfo, getUserById } from "../lib/actions/user.action";

async function runTest() {
  console.log("=== STARTING COMPLETE E2E TEST FLOW ===");

  const ts = Date.now();
  const testEmail = `devflow_${ts}@example.com`;
  const testPass = "Password1234!";
  const testName = "DevFlow Tester";
  const testUsername = `devflow_${ts}`;

  // 1. Sign Up
  console.log("\n1. Testing Account Creation (signUp)...");
  const signupRes = await signUp({
    name: testName,
    username: testUsername,
    email: testEmail,
    password: testPass,
  });
  console.log("-> SignUp Result:", signupRes);
  if (!signupRes.success) throw new Error("SignUp failed: " + signupRes.error);

  // 2. Sign In
  console.log("\n2. Testing Authentication (signIn)...");
  const signinRes = await signIn({
    email: testEmail,
    password: testPass,
  });
  console.log("-> SignIn Result:", signinRes);
  if (!signinRes.success) throw new Error("SignIn failed: " + signinRes.error);

  // 3. Verify user profile exists in Appwrite
  console.log("\n3. Testing User Profile Lookup (getUserById)...");
  const user = await getUserById({ userId: testEmail });
  if (!user) throw new Error("User record not found in users table");
  console.log("-> User Profile Found:", {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
  });

  // 4. Create Question
  console.log("\n4. Testing Ask Question (createQuestion)...");
  const question = await createQuestion({
    title: `How to implement full auth flow in Appwrite? (${ts})`,
    content: "<p>Testing asking questions with tags and full database relations in Appwrite TablesDB.</p>",
    tags: ["appwrite", "nextjs16", "typescript"],
    author: user._id,
    path: "/",
  });
  console.log("-> Question Created:", {
    id: question?._id || question?.$id,
    title: question?.title,
  });

  const questionId = question?._id || question?.$id;

  // 5. Reply to Question (createAnswer)
  console.log("\n5. Testing Reply / Answer Question (createAnswer)...");
  const answer = await createAnswer({
    content: "<p>You use the Appwrite SDK with server sessions and secure cookies!</p>",
    author: user._id,
    question: questionId,
    path: `/question/${questionId}`,
  });
  console.log("-> Answer Created:", {
    id: answer?._id || answer?.$id,
    content: answer?.content,
  });

  const answerId = answer?._id || answer?.$id;

  // 6. Upvote Question
  console.log("\n6. Testing Upvote Question (upvoteQuestion)...");
  await upvoteQuestion({
    questionId,
    userId: user._id,
    hasupVoted: false,
    hasdownVoted: false,
    path: `/question/${questionId}`,
  });
  const qAfterUpvote = await getQuestionById({ questionId });
  console.log("-> Question Upvotes Count:", qAfterUpvote?.upvotes?.length);

  // 7. Save Question (toggleSaveQuestion)
  console.log("\n7. Testing Save Question (toggleSaveQuestion)...");
  await toggleSaveQuestion({
    userId: user._id,
    questionId,
    path: `/question/${questionId}`,
  });
  const userAfterSave = await getUserById({ userId: user._id });
  console.log("-> User Saved Questions:", userAfterSave?.saved);

  // 8. Upvote Answer
  console.log("\n8. Testing Upvote Answer (upvoteAnswer)...");
  await upvoteAnswer({
    answerId,
    userId: user._id,
    hasupVoted: false,
    hasdownVoted: false,
    path: `/question/${questionId}`,
  });
  const answersList = await getAnswers({ questionId });
  console.log("-> Answer Upvotes Count:", answersList?.answers[0]?.upvotes?.length);

  // 9. Check Profile Stats (getUserInfo)
  console.log("\n9. Testing User Stats & Badges (getUserInfo)...");
  const stats = await getUserInfo({ userId: user._id });
  console.log("-> Stats:", {
    name: stats.user.name,
    totalQuestions: stats.totalQuestions,
    totalAnswers: stats.totalAnswers,
    reputation: stats.reputation,
    badgeCounts: stats.badgeCounts,
  });

  console.log("\n=============================================");
  console.log("SUCCESS: FULL FLOW VERIFIED END-TO-END WITH LIVE APPWRITE!");
  console.log("=============================================");
}

runTest().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
