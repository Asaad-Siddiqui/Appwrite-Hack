import Link from "next/link";
import Image from "next/image";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@/context/AuthContext";
import EditDeleteAction from "../shared/EditDeleteAction";
import { Heart, MessageSquare } from "lucide-react";

interface Props {
  clerkId?: string | null;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
    username?: string;
  };
  upvotes: number;
  createdAt: Date | string;
}

export default function AnswerCard({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: Props) {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  const username =
    author.username ||
    author.name?.toLowerCase().replace(/\s+/g, "") ||
    "developer";
  const avatarUrl =
    author?.picture ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${author?.name || "dev"}`;

  return (
    <article className="border-b border-neutral-200/80 dark:border-neutral-800/80 p-4 sm:p-5 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/30 transition-colors">
      <div className="flex items-start gap-3">
        <Link href={`/profile/${author?.clerkId || author?._id}`} className="shrink-0">
          <Image
            src={avatarUrl}
            alt={author?.name || "User"}
            width={40}
            height={40}
            className="rounded-full h-10 w-10 object-cover border border-neutral-200 dark:border-neutral-800"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap text-sm">
              <Link
                href={`/profile/${author?.clerkId || author?._id}`}
                className="font-bold text-neutral-900 dark:text-white hover:underline truncate"
              >
                {author?.name || "Developer"}
              </Link>
              <span className="text-xs text-neutral-500">@{username}</span>
              <span className="text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 whitespace-nowrap">
                {getTimestamp(createdAt)}
              </span>
            </div>

            <SignedIn>
              {showActionButtons && (
                <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
              )}
            </SignedIn>
          </div>

          <div className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
            <span>Replying to</span>
            <Link
              href={`/question/${question._id}`}
              className="text-sky-500 hover:underline font-medium truncate max-w-[280px]"
            >
              {question.title}
            </Link>
          </div>

          <Link href={`/question/${question._id}/#${_id}`} className="block mt-2">
            <p className="text-[15px] text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-relaxed">
              {question.title}
            </p>
          </Link>

          <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
            <div className="flex items-center gap-1 text-rose-500">
              <Heart className="h-4 w-4 fill-rose-500/20 stroke-rose-500" />
              <span className="font-mono">{formatAndDivideNumber(upvotes)} votes</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
