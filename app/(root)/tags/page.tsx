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
  title: "Explore Tags | DevFlow - Trending Technologies",
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
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Trending in Tech · #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg text-neutral-900 dark:text-white group-hover:text-sky-500 transition-colors">
                    <Hash className="h-4 w-4 text-sky-500" />
                    <span>{tag.name}</span>
                  </div>
                  {tag.description && (
                    <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                      {tag.description}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    {count}
                  </span>
                  <p className="text-xs text-neutral-400">
                    {count === 1 ? "question" : "questions"}
                  </p>
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
