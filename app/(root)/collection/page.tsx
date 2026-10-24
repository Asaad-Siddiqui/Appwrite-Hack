import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@/lib/actions/auth.action";
import { Bookmark, Lock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks | DevOverflow",
};

export default async function CollectionPage(props: {
  searchParams: Promise<any> | any;
}) {
  const searchParams = await props.searchParams;
  const { user, userId } = await auth();

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 sm:p-16 text-center">
        <div className="relative mb-5 flex size-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-500 shadow-xl shadow-sky-500/10">
          <Bookmark className="size-8 stroke-[2.25]" />
          <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400">
            <Lock className="size-3 text-sky-400" />
          </span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-spaceGrotesk">
          Save discussions for later
        </h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
          Build your personal library of debugging solutions, code patterns, and architectural discussions.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm py-2.5 px-6 shadow-md shadow-sky-500/25 transition-all active:scale-[0.98]"
          >
            Sign in to view Bookmarks
          </Link>
          <Link
            href="/"
            className="rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-bold text-sm py-2.5 px-6 transition"
          >
            Explore Feed
          </Link>
        </div>
      </div>
    );
  }

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/85 dark:bg-black/85 border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-spaceGrotesk flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-sky-500" />
            <span>Bookmarks</span>
          </h1>
          <p className="text-xs text-neutral-500">@{user?.username || "you"}</p>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/30 flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 w-full">
          <LocalSearchbar
            route="/collection"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search saved questions..."
            otherClasses="w-full"
          />
        </div>
        <Filter filters={QuestionFilters} otherClasses="min-h-[46px] sm:min-w-[150px]" />
      </div>

      {/* Stream of Bookmarked Questions */}
      <div className="flex flex-col">
        {result.questions && result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <div className="p-12 text-center text-neutral-500">
            <NoResult
              title="Save questions for later"
              description="You haven’t added any questions to your Bookmarks yet. When you see a question you want to reference later, click the bookmark icon!"
              link="/"
              linkTitle="Explore Feed"
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
