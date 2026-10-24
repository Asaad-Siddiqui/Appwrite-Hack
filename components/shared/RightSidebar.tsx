import Link from "next/link";
import React, { Suspense } from "react";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopPopularTags } from "@/lib/actions/tag.actions";
import GlobalSearch from "./search/GlobalSearch";
import { Flame, Sparkles, TrendingUp, Terminal, Activity } from "lucide-react";

export default async function RightSidebar() {
  const hotQuestions = await getHotQuestions();
  const popularTags = await getTopPopularTags();

  return (
    <aside className="sticky top-0 right-0 h-screen w-[350px] flex flex-col gap-4 overflow-y-auto px-4 py-3 max-xl:hidden custom-scrollbar select-none">
      {/* Search Bar at Top of Right Rail */}
      <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md pb-2 z-10">
        <Suspense fallback={<div className="h-11 rounded-full bg-neutral-100 dark:bg-neutral-900" />}>
          <GlobalSearch />
        </Suspense>
      </div>

      {/* What's Happening / Hot Discussions Card */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="size-4 text-sky-500 stroke-[2.25]" />
          <h3 className="font-bold text-base text-neutral-900 dark:text-white tracking-tight">
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
                <span className="inline-flex items-center gap-1">
                  <span className="font-mono text-[10px] font-bold text-sky-500 bg-sky-500/10 rounded-full px-1.5 py-0.2">#{idx + 1}</span>
                  <span className="text-[11px]">Trending in Dev</span>
                </span>
                <span className="font-mono text-[11px]">
                  {question.views || 0} views
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-sky-500 transition-colors line-clamp-2 leading-snug">
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
      <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="size-4 text-sky-500 stroke-[2.25]" />
          <h3 className="font-bold text-base text-neutral-900 dark:text-white tracking-tight">
            Trending Tech
          </h3>
        </div>

        <div className="flex flex-col gap-1.5">
          {popularTags.slice(0, 5).map((tag: any, idx: number) => (
            <Link
              key={tag._id}
              href={`/tags/${tag._id}`}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                  #{idx + 1} · Trending
                </span>
                <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-sky-500 transition-colors">
                  #{tag.name.toLowerCase()}
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                {tag.numberOfQuestions ?? (tag.questions?.length || 0)} posts
              </span>
            </Link>
          ))}

          {popularTags.length === 0 && (
            <p className="py-2 text-xs text-neutral-500">No tags recorded.</p>
          )}
        </div>
      </div>

      {/* Developer Cloud Architecture Status Card */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Appwrite TablesDB</span>
          </span>
          <span className="text-[11px] text-emerald-500 font-mono font-bold">99.99% OK</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span>Cloud SGP-1</span>
          <span>Next.js 16 (Turbopack)</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-2 pb-6 text-[11px] text-neutral-400 dark:text-neutral-600 flex flex-wrap gap-x-3 gap-y-1">
        <span>Terms</span>
        <span>Privacy</span>
        <span>Cookies</span>
        <span>API Docs</span>
        <span>© {new Date().getFullYear()} DevOverflow</span>
      </div>
    </aside>
  );
}
