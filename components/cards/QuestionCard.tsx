import Link from "next/link";
import Image from "next/image";
import React from "react";
import RenderTag from "../shared/RenderTag";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@/context/AuthContext";
import EditDeleteAction from "../shared/EditDeleteAction";
import { MessageSquare, Heart, Eye, Bookmark, Share2 } from "lucide-react";

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
    username?: string;
  };
  upvotes: string[];
  views: number;
  answers: Array<object>;
  createdAt: Date | string;
  clerkId?: string | null;
}

export default function QuestionCard({
  clerkId,
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionProps) {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  const username = author?.username || author?.name?.toLowerCase().replace(/\s+/g, "") || "developer";
  const avatarUrl =
    author?.picture ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${author?.name || "dev"}`;

  return (
    <article className="border-b border-neutral-200/80 dark:border-neutral-800/80 p-4 sm:p-5 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/30 transition-colors">
      <div className="flex items-start gap-3">
        {/* Left: Author Avatar */}
        <Link
          href={`/profile/${author?.clerkId || author?._id}`}
          className="shrink-0 relative group"
        >
          <Image
            src={avatarUrl}
            alt={author?.name || "User"}
            width={42}
            height={42}
            className="rounded-full h-10 w-10 sm:h-11 sm:w-11 object-cover border border-neutral-200 dark:border-neutral-800 group-hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Right: Content Stream */}
        <div className="flex-1 min-w-0">
          {/* Header Line */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0 text-sm">
              <Link
                href={`/profile/${author?.clerkId || author?._id}`}
                className="font-bold text-neutral-900 dark:text-white hover:underline truncate"
              >
                {author?.name || "Anonymous"}
              </Link>
              <span className="text-neutral-500 dark:text-neutral-400 truncate text-xs sm:text-sm">
                @{username}
              </span>
              <span className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                {getTimestamp(createdAt)}
              </span>
            </div>

            <SignedIn>
              {showActionButtons && (
                <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
              )}
            </SignedIn>
          </div>

          {/* Question Title & Link */}
          <Link href={`/question/${_id}`} className="block group mt-1">
            <h2 className="text-[16px] sm:text-[17px] font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-sky-500 transition-colors leading-snug">
              {title}
            </h2>
          </Link>

          {/* Tags row */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {tags.map((tag) => (
                <Link
                  key={tag._id}
                  href={`/tags/${tag._id}`}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Interaction Bar (Twitter / X Micro-actions) */}
          <div className="flex items-center justify-between mt-3 text-neutral-500 dark:text-neutral-400 max-w-[480px] -ml-2 text-xs select-none">
            {/* Answers / Replies */}
            <Link
              href={`/question/${_id}`}
              className="flex items-center gap-1.5 p-2 rounded-full hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors group"
              title="Answers"
            >
              <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-xs">{formatAndDivideNumber(answers?.length || 0)}</span>
            </Link>

            {/* Upvotes / Likes */}
            <Link
              href={`/question/${_id}`}
              className="flex items-center gap-1.5 p-2 rounded-full hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group"
              title="Votes"
            >
              <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-xs">{formatAndDivideNumber(upvotes?.length || 0)}</span>
            </Link>

            {/* Views / Impressions */}
            <div
              className="flex items-center gap-1.5 p-2 rounded-full hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
              title="Views"
            >
              <Eye className="h-4 w-4" />
              <span className="font-mono text-xs">{formatAndDivideNumber(views || 0)}</span>
            </div>

            {/* Bookmark */}
            <Link
              href={`/question/${_id}`}
              className="flex items-center gap-1 p-2 rounded-full hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
              title="Save Question"
            >
              <Bookmark className="h-4 w-4" />
            </Link>

            {/* Share */}
            <Link
              href={`/question/${_id}`}
              className="flex items-center gap-1 p-2 rounded-full hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
