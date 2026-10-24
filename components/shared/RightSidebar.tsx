import Link from "next/link";
import React, { Suspense } from "react";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopPopularTags } from "@/lib/actions/tag.actions";
import GlobalSearch from "./search/GlobalSearch";
import { Flame, Sparkles, TrendingUp } from "lucide-react";

export default async function RightSidebar() {
  const hotQuestions = await getHotQuestions();
  const popularTags = await getTopPopularTags();

  return (
    <aside className="sticky top-0 right-0 h-screen w-[350px] flex-col gap-4 overflow-y-auto px-4 py-3 max-xl:hidden custom-scrollbar select-none">
      {/* Search Bar at Top of Right Rail */}
      <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md pb-2 z-10">
        <Suspense fallback={<div className="h-11 rounded-full bg-neutral-100 dark:bg-neutral-900" />}>
          <GlobalSearch />
        </Suspense>
      </div>

      {/* What's Happening / Hot Discussions Card */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-950/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-5 w-5 text-sky-500 stroke-[2.25]" />
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white tracking-tight">
            Hot Discussions
          </h3>
        </div>

        <div className="flex flex-col divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
          {hotQuestions.slice(0, 5).map((question: any, idx: number) => (
            <Link
              href={`/question/${question._id}`}
              key={question._id}
              className="py-3 group first:pt-1 last:pb-1 flex flex-col gap-1 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>Trending · #{idx + 1}</span>
                <span className="flex items-center gap-1 font-mono">
                  {question.views || 0} views
                </span>
              </div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-sky-500 transition-colors line-clamp-2 leading-snug">
                {question.title}
              </p>
            </Link>
          ))}

          {hotQuestions.length === 0 && (
            <p className="py-4 text-xs text-neutral-500">No active discussions yet.</p>
          )}
        </div>
      </div>

      {/* Trending Topics / Popular Tags Card */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-950/40 p-4 mt-1">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-sky-500 stroke-[2.25]" />
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white tracking-tight">
            Trending Tech
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          {popularTags.slice(0, 5).map((tag: any) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.numberOfQuestions ?? (tag.questions?.length || 0)}
              showCount
            />
          ))}

          {popularTags.length === 0 && (
            <p className="py-2 text-xs text-neutral-500">No tags recorded.</p>
          )}
        </div>
      </div>

      {/* Appwrite & Hackathon Badge */}
      <div className="px-2 py-3 text-xs text-neutral-400 dark:text-neutral-500 flex flex-col gap-1.5 leading-relaxed">
        <div className="flex items-center gap-1.5 font-medium text-neutral-600 dark:text-neutral-400">
          <Sparkles className="h-3.5 w-3.5 text-sky-500" />
          <span>Powered by Appwrite TablesDB</span>
        </div>
        <p className="text-[11px] text-neutral-400">
          Next.js 16 · DevOverflow Community · 2026
        </p>
      </div>
    </aside>
  );
}
