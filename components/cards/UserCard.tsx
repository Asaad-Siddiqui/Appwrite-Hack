import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  user: {
    _id: string;
    clerkId?: string;
    accountId?: string;
    picture?: string;
    name: string;
    username: string;
    bio?: string;
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
    <article className="border-b border-neutral-200/80 dark:border-neutral-800/80 p-4 sm:p-5 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Avatar + Details */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Link href={`/profile/${profileId}`} className="shrink-0">
            <Image
              src={avatarUrl}
              alt={user.name || "User"}
              width={48}
              height={48}
              className="rounded-full h-11 w-11 sm:h-12 sm:w-12 object-cover border border-neutral-200 dark:border-neutral-800"
            />
          </Link>

          <div className="flex flex-col min-w-0">
            <Link
              href={`/profile/${profileId}`}
              className="font-bold text-base text-neutral-900 dark:text-white hover:underline truncate"
            >
              {user.name}
            </Link>
            <span className="text-xs sm:text-sm text-neutral-500 truncate">
              @{username}
            </span>

            {user.bio ? (
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                {user.bio}
              </p>
            ) : null}

            {/* Tag Pills */}
            {interactedTags && interactedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {interactedTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag._id}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: View Profile Action Button */}
        <Link
          href={`/profile/${profileId}`}
          className="shrink-0 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold py-2 px-4 hover:opacity-90 transition-opacity"
        >
          View Profile
        </Link>
      </div>
    </article>
  );
}
