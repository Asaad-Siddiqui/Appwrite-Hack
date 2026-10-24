import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import ParseHTML from "@/components/shared/ParseHTML";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { getTimestamp } from "@/lib/utils";
import { auth } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowLeft, MessageSquare, Eye, Zap } from "lucide-react";

export default async function QuestionDetails(props: {
  params: Promise<{ id: string }> | { id: string };
  searchParams: Promise<any> | any;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { userId: clerkId } = await auth();

  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  const result = await getQuestionById({ questionId: params.id });
  if (!result) {
    return (
      <div className="p-8 text-center text-neutral-500">
        Question not found.
      </div>
    );
  }

  const mongoUserId = mongoUser ? mongoUser._id || mongoUser.$id : null;
  const username =
    result.author?.username ||
    result.author?.name?.toLowerCase().replace(/\s+/g, "") ||
    "developer";
  const avatarUrl =
    result.author?.picture ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${result.author?.name || "dev"}`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Sticky Header with Back Button */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/85 dark:bg-black/85 border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 py-3 flex items-center gap-6">
        <Link
          href="/"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          aria-label="Back to feed"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight font-spaceGrotesk">
            Discussion
          </h1>
          <span className="text-xs text-neutral-500">
            {result.answers?.length || 0} {result.answers?.length === 1 ? "reply" : "replies"}
          </span>
        </div>
      </header>

      {/* Main Question Post in Thread */}
      <article className="p-4 sm:p-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/profile/${result.author.clerkId || result.author._id}`}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <Image
                src={avatarUrl}
                className="rounded-full size-12 object-cover border border-neutral-200 dark:border-neutral-800 group-hover:opacity-90 transition-opacity"
                width={48}
                height={48}
                alt={result.author.name || "Author"}
              />
              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-neutral-900 dark:text-white group-hover:underline flex items-center gap-1.5">
                <span>{result.author.name}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                  <Zap className="size-2.5 text-amber-500 fill-amber-500" />
                  <span>{result.author.reputation || 150} rep</span>
                </span>
              </span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                @{username}
              </span>
            </div>
          </Link>
        </div>

        {/* Question Title */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white mt-4 mb-3 tracking-tight leading-snug">
          {result.title}
        </h2>

        {/* Question Content Body */}
        <div className="markdown text-neutral-800 dark:text-neutral-200 text-base leading-relaxed my-4">
          <ParseHTML data={result.content} />
        </div>

        {/* Tag chips */}
        {result.tags && result.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 my-4">
            {result.tags.map((tag: any) => (
              <Link
                key={tag._id}
                href={`/tags/${tag._id}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Timestamp & Meta Information */}
        <div className="flex items-center gap-2 py-3 border-y border-neutral-100 dark:border-neutral-900 text-sm text-neutral-500">
          <span>{getTimestamp(result.createdAt)}</span>
          <span>·</span>
          <span className="flex items-center gap-1 font-mono">
            <Eye className="h-3.5 w-3.5 text-neutral-400" />
            {result.views || 0} Views
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5 text-neutral-400" />
            {result.answers?.length || 0} Answers
          </span>
        </div>

        {/* Interactive Votes and Bookmarks Bar */}
        <div className="py-2 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900">
          <Votes
            type="Question"
            itemId={JSON.stringify(result._id)}
            userId={mongoUserId ? JSON.stringify(mongoUserId) : ""}
            upvotes={result.upvotes.length}
            hasupVoted={mongoUserId ? result.upvotes.includes(mongoUserId) : false}
            downvotes={result.downvotes.length}
            hasdownVoted={mongoUserId ? result.downvotes.includes(mongoUserId) : false}
            hasSaved={mongoUser ? (mongoUser.saved || []).includes(result._id) : false}
          />
        </div>
      </article>

      {/* Reply / Answer Composer */}
      <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 p-4 sm:p-6 bg-neutral-50/40 dark:bg-neutral-950/20">
        <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-wider">
          Post your answer
        </h3>
        <Answer
          question={result.content}
          questionId={JSON.stringify(result._id)}
          authorId={mongoUserId ? JSON.stringify(mongoUserId) : ""}
        />
      </div>

      {/* Answers / Replies Thread */}
      <div className="p-4 sm:p-6">
        <AllAnswers
          questionId={result._id}
          userId={mongoUserId || ""}
          totalAnswers={result.answers?.length || 0}
          page={searchParams?.page}
          filter={searchParams?.filter}
        />
      </div>
    </div>
  );
}
