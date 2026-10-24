"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@/context/AuthContext";
import EditDeleteAction from "../shared/EditDeleteAction";
import { MessageSquare, ArrowBigUp, Eye, Bookmark, Share2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
    reputation?: number;
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
  const { toast } = useToast();
  const showActionButtons = clerkId && clerkId === author?.clerkId;
  const username = author?.username || author?.name?.toLowerCase().replace(/\s+/g, "") || "developer";
  const avatarUrl =
    author?.picture ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${author?.name || "dev"}`;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/question/${_id}`);
      toast({
        title: "Thread link copied! 📋",
        description: "You can now share this discussion with your team.",
      });
    }
  };

  return (
    <article className="group border-b border-neutral-200/80 dark:border-neutral-800/80 p-4 sm:p-5 transition hover:bg-neutral-50/70 dark:hover:bg-neutral-950/40">
      <div className="flex items-start gap-3">
        {/* Left: Author Avatar with Online Dot */}
        <Link
          href={`/profile/${author?.clerkId || author?._id}`}
          className="relative shrink-0 group/avatar"
        >
          <Image
            src={avatarUrl}
            alt={author?.name || "User"}
            width={44}
            height={44}
            className="size-10 sm:size-11 rounded-full object-cover border border-neutral-200 dark:border-neutral-800 transition group-hover/avatar:opacity-90"
          />
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-black" />
        </Link>

        {/* Right: Content Stream */}
        <div className="flex-1 min-w-0">
          {/* Header Line */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0 text-sm">
              <Link
                href={`/profile/${author?.clerkId || author?._id}`}
                className="font-bold text-neutral-900 dark:text-white hover:underline truncate inline-flex items-center gap-1"
              >
                <span>{author?.name || "Anonymous"}</span>
                <CheckCircle2 className="size-3.5 fill-sky-500 text-white dark:text-black shrink-0" />
              </Link>
              <span className="text-neutral-500 dark:text-neutral-400 truncate text-xs sm:text-sm">
                @{username}
              </span>

              {/* Developer Reputation Chip */}
              <span className="inline-flex items-center gap-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                ⚡ {formatAndDivideNumber(author?.reputation || 120)}
              </span>

              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                {getTimestamp(createdAt)}
              </span>
            </div>

            <SignedIn>
              {showActionButtons && (
                <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
              )}
            </SignedIn>
          </div>

          {/* Question Title */}
          <Link href={`/question/${_id}`} className="block group/title mt-1.5">
            <h2 className="text-[15px] sm:text-[17px] font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover/title:text-sky-500 transition-colors leading-snug">
              {title}
            </h2>
          </Link>

          {/* Tags row with subtle tech badges */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {tags.map((tag) => (
                <Link
                  key={tag._id}
                  href={`/tags/${tag._id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400 hover:bg-sky-500/15 transition"
                >
                  <span className="text-sky-400">#</span>
                  <span>{tag.name.toLowerCase()}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Micro-Interaction Bar */}
          <div className="flex items-center justify-between mt-3 text-neutral-500 dark:text-neutral-400 max-w-[480px] -ml-2 text-xs select-none">
            {/* Replies */}
            <Link
              href={`/question/${_id}`}
              className="flex items-center gap-1.5 p-2 rounded-full hover:text-sky-500 hover:bg-sky-500/10 transition group/btn"
              title="Discussion Replies"
            >
              <MessageSquare className="size-4 group-hover/btn:scale-110 transition-transform" />
              <span className="font-mono text-xs">{formatAndDivideNumber(answers?.length || 0)}</span>
            </Link>

            {/* Upvotes */}
            <Link
              href={`/question/${_id}`}
              className="flex items-center gap-1.5 p-2 rounded-full hover:text-emerald-500 hover:bg-emerald-500/10 transition group/btn"
              title="Upvotes"
            >
              <ArrowBigUp className="size-4 group-hover/btn:scale-110 transition-transform" />
              <span className="font-mono text-xs">{formatAndDivideNumber(upvotes?.length || 0)}</span>
            </Link>

            {/* Views */}
            <div
              className="flex items-center gap-1.5 p-2 rounded-full hover:text-sky-500 hover:bg-sky-500/10 transition"
              title="Views"
            >
              <Eye className="size-4" />
              <span className="font-mono text-xs">{formatAndDivideNumber(views || 0)}</span>
            </div>

            {/* Bookmark */}
            <Link
              href={`/question/${_id}`}
              className="flex items-center gap-1 p-2 rounded-full hover:text-amber-500 hover:bg-amber-500/10 transition"
              title="Save Thread"
            >
              <Bookmark className="size-4" />
            </Link>

            {/* Share with Copy Feedback */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 p-2 rounded-full hover:text-sky-500 hover:bg-sky-500/10 transition"
              title="Copy Thread Link"
            >
              <Share2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
