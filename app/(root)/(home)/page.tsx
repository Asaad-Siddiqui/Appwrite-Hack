import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import { getQuestions, getRecommendedQuestions } from "@/lib/actions/question.action";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { auth } from "@/lib/actions/auth.action";
import { Sparkles, Code, PenSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Home | DevOverflow - Developer Community",
};

export default async function Home(props: { searchParams: Promise<any> | any }) {
  const resolvedSearchParams = await props.searchParams;
  const { user, userId } = await auth();

  const currentFilter = resolvedSearchParams?.filter || "for_you";

  let result;
  if (currentFilter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: resolvedSearchParams?.q,
        page: resolvedSearchParams?.page ? +resolvedSearchParams.page : 1,
      });
    } else {
      result = { questions: [], isNext: false };
    }
  } else {
    result = await getQuestions({
      searchQuery: resolvedSearchParams?.q,
      filter: currentFilter === "for_you" ? undefined : currentFilter,
      page: resolvedSearchParams?.page ? +resolvedSearchParams.page : 1,
    });
  }

  const tabs = [
    { label: "For you", filter: "for_you" },
    { label: "Latest", filter: "newest" },
    { label: "Unanswered", filter: "unanswered" },
    { label: "Frequent", filter: "frequent" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Sticky Header with X-style Navigation Tabs */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/85 dark:bg-black/85 border-b border-neutral-200/80 dark:border-neutral-800/80 select-none">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-spaceGrotesk flex items-center gap-2">
            <span>Home</span>
          </h1>
          <Link
            href="/ask-question"
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span>Ask</span>
          </Link>
        </div>

        {/* Timeline Tabs */}
        <div className="flex border-t border-neutral-100 dark:border-neutral-900">
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.filter;
            const href = tab.filter === "for_you" ? "/" : `/?filter=${tab.filter}`;

            return (
              <Link
                key={tab.filter}
                href={href}
                className="flex-1 flex justify-center items-center py-3 hover:bg-neutral-50 dark:hover:bg-neutral-950/60 transition-colors relative"
              >
                <span
                  className={`text-sm ${
                    isActive
                      ? "font-bold text-neutral-900 dark:text-white"
                      : "font-medium text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 h-1 w-12 sm:w-16 bg-sky-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Quick Developer Composer Banner */}
      <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 p-4 sm:p-5 bg-white dark:bg-black">
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <Image
              src={
                user?.picture ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || "dev"}`
              }
              alt="User"
              width={42}
              height={42}
              className="size-10 sm:size-11 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
            />
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-black" />
          </div>

          <div className="flex-1 flex flex-col gap-3">
            <Link
              href="/ask-question"
              className="w-full text-sm sm:text-base text-neutral-500 dark:text-neutral-400 cursor-text py-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              What code problem or architecture are you debugging today?
            </Link>

            {/* Quick composer action toolbar */}
            <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900 pt-3 text-xs">
              <div className="flex items-center gap-3 text-sky-500">
                <Link
                  href="/ask-question"
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-sky-500/10 transition font-medium"
                >
                  <Code className="size-3.5" />
                  <span className="text-[11px]">Snippet</span>
                </Link>
                <Link
                  href="/ask-question"
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-sky-500/10 transition font-medium"
                >
                  <span className="font-bold">#</span>
                  <span className="text-[11px]">Tags</span>
                </Link>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                  Markdown enabled
                </span>
              </div>

              <Link
                href="/ask-question"
                className="rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs py-1.5 px-4 shadow-sm shadow-sky-500/20 transition-all active:scale-[0.98]"
              >
                Post Question
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Timeline of Questions */}
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
          <div className="p-8">
            <NoResult
              title="No questions in this feed yet"
              description="Be the first to start the discussion! Ask your question and get answers from developers worldwide."
              link="/ask-question"
              linkTitle="Ask a Question"
            />
          </div>
        )}
      </div>

      {/* Bottom Pagination */}
      <div className="p-4 border-t border-neutral-100 dark:border-neutral-900">
        <Pagination
          pageNumber={resolvedSearchParams?.page ? +resolvedSearchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
}
