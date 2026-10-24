"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { downvoteQuestion, upvoteQuestion } from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { ArrowBigUp, ArrowBigDown, Bookmark, Share2 } from "lucide-react";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

export default function Votes({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const parseId = (id: string) => {
    if (!id) return "";
    try {
      return JSON.parse(id);
    } catch {
      return id;
    }
  };

  const handleSave = async () => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You must be logged in to save questions.",
      });
    }

    await toggleSaveQuestion({
      userId: parseId(userId),
      questionId: parseId(itemId),
      path: pathname,
    });

    toast({
      title: !hasSaved ? "Saved to Bookmarks" : "Removed from Bookmarks",
      description: !hasSaved
        ? "Question added to your personal collection."
        : "Question removed from your personal collection.",
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this discussion with other developers.",
      });
    }
  };

  const handleVote = async (action: "upvote" | "downvote") => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You must be logged in to vote.",
      });
    }

    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: parseId(itemId),
          userId: parseId(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: parseId(itemId),
          userId: parseId(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }

      toast({
        title: !hasupVoted ? "Upvoted" : "Upvote removed",
      });
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: parseId(itemId),
          userId: parseId(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: parseId(itemId),
          userId: parseId(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }

      toast({
        title: !hasdownVoted ? "Downvoted" : "Downvote removed",
      });
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: parseId(itemId),
      userId: userId ? parseId(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);

  return (
    <div className="flex items-center gap-2 select-none">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote("upvote")}
        className={`flex items-center gap-1 py-1 px-2.5 rounded-full transition-colors ${
          hasupVoted
            ? "text-sky-500 bg-sky-50 dark:bg-sky-950/40"
            : "text-neutral-500 hover:text-sky-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
        }`}
        title="Upvote"
        aria-label="Upvote"
      >
        <ArrowBigUp
          className={`h-5 w-5 ${hasupVoted ? "fill-sky-500 stroke-sky-500" : ""}`}
        />
        <span className="text-xs font-mono font-semibold">
          {formatAndDivideNumber(upvotes)}
        </span>
      </button>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote("downvote")}
        className={`flex items-center gap-1 py-1 px-2 rounded-full transition-colors ${
          hasdownVoted
            ? "text-rose-500 bg-rose-50 dark:bg-rose-950/40"
            : "text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
        }`}
        title="Downvote"
        aria-label="Downvote"
      >
        <ArrowBigDown
          className={`h-5 w-5 ${hasdownVoted ? "fill-rose-500 stroke-rose-500" : ""}`}
        />
        {downvotes > 0 && (
          <span className="text-xs font-mono">{formatAndDivideNumber(downvotes)}</span>
        )}
      </button>

      {/* Bookmark / Save */}
      {type === "Question" && (
        <button
          onClick={handleSave}
          className={`p-1.5 rounded-full transition-colors ${
            hasSaved
              ? "text-sky-500 bg-sky-50 dark:bg-sky-950/40"
              : "text-neutral-500 hover:text-sky-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          }`}
          title={hasSaved ? "Remove from bookmarks" : "Save to bookmarks"}
          aria-label="Save Question"
        >
          <Bookmark className={`h-4 w-4 ${hasSaved ? "fill-sky-500" : ""}`} />
        </button>
      )}

      {/* Share Button */}
      {type === "Question" && (
        <button
          onClick={handleShare}
          className="p-1.5 rounded-full text-neutral-500 hover:text-sky-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          title="Share Link"
          aria-label="Share Link"
        >
          <Share2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
