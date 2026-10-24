import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CheckCircle2, Terminal, Zap } from "lucide-react";

interface Props {
  user: {
    _id: string;
    clerkId?: string;
    accountId?: string;
    picture?: string;
    name: string;
    username: string;
    bio?: string;
    reputation?: number;
  };
}

export default async function UserCard({ user }: Props) {
  const profileId = user.clerkId || user.accountId || user._id;
  const username = user.username || "developer";
  const avatarUrl =
    user.picture ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username || "dev"}`;

  const interactedTags = await getTopInteractedTags({ userId: user._id }).catch(() => []);

  return (
    <article className="border-b border-neutral-200/80 dark:border-neutral-800/80 p-4 sm:p-5 transition hover:bg-neutral-50/50 dark:hover:bg-neutral-950/30">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Avatar + Details */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <Link href={`/profile/${profileId}`} className="relative shrink-0 group">
            <Image
              src={avatarUrl}
              alt={user.name || "User"}
              width={48}
              height={48}
              className="size-11 sm:size-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-800 group-hover:opacity-90 transition-opacity"
            />
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-black" />
          </Link>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/profile/${profileId}`}
                className="font-bold text-base text-neutral-900 dark:text-white hover:underline truncate inline-flex items-center gap-1"
              >
                <span>{user.name}</span>
                <CheckCircle2 className="size-3.5 fill-sky-500 text-white dark:text-black shrink-0" />
              </Link>
              <span className="text-xs text-neutral-500 truncate">
                @{username}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                <Zap className="size-2.5 text-amber-500 fill-amber-500" />
                <span>{user.reputation || 120} rep</span>
              </span>
            </div>

            {user.bio ? (
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {user.bio}
              </p>
            ) : (
              <p className="mt-1 text-xs text-neutral-400 italic">
                Software engineer building on DevOverflow
              </p>
            )}

            {/* Tag Pills */}
            {interactedTags && interactedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Stack:</span>
                {interactedTags.slice(0, 4).map((tag: any) => (
                  <span
                    key={tag._id}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400"
                  >
                    #{tag.name.toLowerCase()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: View Profile Action Button */}
        <Link
          href={`/profile/${profileId}`}
          className="shrink-0 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-sky-500 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white text-neutral-900 dark:text-neutral-100 text-xs font-bold py-1.5 px-4 transition-all shadow-sm"
        >
          View Profile
        </Link>
      </div>
    </article>
  );
}
