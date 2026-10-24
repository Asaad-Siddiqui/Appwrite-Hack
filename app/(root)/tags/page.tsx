import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.actions";
import Link from "next/link";
import { TrendingUp, Hash } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Tags | DevOverflow - Trending Technologies",
};

export default async function TagsPage(props: {
  searchParams: Promise<any> | any;
}) {
  const searchParams = await props.searchParams;
  const result = await getAllTags({
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/85 dark:bg-black/85 border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-spaceGrotesk flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-500" />
            <span>Explore Trends & Tags</span>
          </h1>
          <p className="text-xs text-neutral-500">
            Discover active technologies, frameworks, and developer discussions
          </p>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/30 flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 w-full">
          <LocalSearchbar
            route="/tags"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search tags by keyword..."
            otherClasses="w-full"
          />
        </div>
        <Filter filters={TagFilters} otherClasses="min-h-[46px] sm:min-w-[150px]" />
      </div>

      {/* Stream of Trending Topics (Twitter / X Trends List) */}
      <div className="flex flex-col divide-y divide-neutral-200/70 dark:divide-neutral-800/70">
        {result.tags && result.tags.length > 0 ? (
          result.tags.map((tag: any, idx: number) => {
            const count = tag.questions?.length || tag.numberOfQuestions || 0;
            return (
              <Link
                href={`/tags/${tag._id}`}
                key={tag._id}
                className="p-4 sm:px-6 sm:py-4 flex items-center justify-between hover:bg-neutral-50/80 dark:hover:bg-neutral-950/40 transition-colors group"
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1 pr-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="font-mono text-[10px] font-bold text-sky-500 bg-sky-500/10 px-1.5 py-0.5 rounded-full">
                      #{idx + 1}
                    </span>
                    <span>Trending in Tech</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg text-neutral-900 dark:text-white group-hover:text-sky-500 transition-colors">
                    <Hash className="size-4 text-sky-500" />
                    <span>{tag.name.toLowerCase()}</span>
                  </div>
                  {tag.description ? (
                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {tag.description}
                    </p>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">
                      Explore discussions, questions and solutions for #{tag.name.toLowerCase()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {count}
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      {count === 1 ? "discussion" : "discussions"}
                    </p>
                  </div>
                  <div className="hidden sm:flex size-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all">
                    →
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-12 text-center text-neutral-500">
            <NoResult
              title="No Tags Found"
              description="It looks like there are no tags matching your search query."
              link="/ask-question"
              linkTitle="Ask a Question"
            />
          </div>
        )}
      </div>

      {/* Bottom Pagination */}
      <div className="p-4 border-t border-neutral-100 dark:border-neutral-900">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
}
