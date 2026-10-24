import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

export default async function AllAnswers({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) {
  const result = await getAnswers({
    questionId,
    page: page ? +page : 1,
    sortBy: filter,
  });

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <h3 className="font-bold text-lg text-neutral-900 dark:text-white font-spaceGrotesk">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <Filter filters={AnswerFilters} />
      </div>

      <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
        {result.answers && result.answers.length > 0 ? (
          result.answers.map((answer: any) => {
            const author = answer.author || {};
            const username =
              author.username ||
              author.name?.toLowerCase().replace(/\s+/g, "") ||
              "developer";
            const avatarUrl =
              author.picture ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${author.name || "dev"}`;

            return (
              <article key={answer._id} className="py-5 flex gap-3">
                {/* Author Avatar */}
                <Link
                  href={`/profile/${author.clerkId || author._id}`}
                  className="shrink-0"
                >
                  <Image
                    src={avatarUrl}
                    width={40}
                    height={40}
                    alt={author.name || "User"}
                    className="rounded-full h-10 w-10 object-cover border border-neutral-200 dark:border-neutral-800"
                  />
                </Link>

                {/* Reply Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap text-sm">
                      <Link
                        href={`/profile/${author.clerkId || author._id}`}
                        className="font-bold text-neutral-900 dark:text-white hover:underline truncate"
                      >
                        {author.name || "Anonymous"}
                      </Link>
                      <span className="text-xs text-neutral-500 truncate">
                        @{username}
                      </span>
                      <span className="text-neutral-400 dark:text-neutral-600">·</span>
                      <span className="text-xs text-neutral-500 whitespace-nowrap">
                        {getTimestamp(answer.createdAt)}
                      </span>
                    </div>

                    <div className="shrink-0">
                      <Votes
                        type="Answer"
                        itemId={JSON.stringify(answer._id)}
                        userId={userId ? JSON.stringify(userId) : ""}
                        upvotes={answer.upvotes?.length || 0}
                        hasupVoted={userId ? (answer.upvotes || []).includes(userId) : false}
                        downvotes={answer.downvotes?.length || 0}
                        hasdownVoted={userId ? (answer.downvotes || []).includes(userId) : false}
                      />
                    </div>
                  </div>

                  <div className="markdown mt-2.5 text-sm sm:text-base text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    <ParseHTML data={answer.content} />
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="py-8 text-center text-sm text-neutral-500">
            No answers posted yet. Be the first to reply!
          </div>
        )}
      </div>

      <div className="mt-6">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNextAnswer} />
      </div>
    </div>
  );
}
