import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getQuestionsByTagId } from "@/lib/actions/tag.actions";
import Link from "next/link";
import { ArrowLeft, Hash } from "lucide-react";

export default async function TagDetailsPage(props: {
  params: Promise<{ id: string }> | { id: string };
  searchParams: Promise<any> | any;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const result = await getQuestionsByTagId({
    tagId: params.id,
    page: searchParams?.page ? +searchParams.page : 1,
    searchQuery: searchParams?.q,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header with Back Button */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/85 dark:bg-black/85 border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 py-3 flex items-center gap-6">
        <Link
          href="/tags"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          aria-label="Back to tags"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight font-spaceGrotesk flex items-center gap-1">
            <Hash className="h-4 w-4 text-sky-500" />
            <span>{result.tagTitle}</span>
          </h1>
          <span className="text-xs text-neutral-500">
            {result.questions?.length || 0} discussions
          </span>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/30">
        <LocalSearchbar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder={`Search discussions tagged #${result.tagTitle}...`}
          otherClasses="w-full"
        />
      </div>

      {/* Questions Stream */}
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
              title={`No questions tagged #${result.tagTitle}`}
              description="Be the first to post a question with this tag and ignite the discussion!"
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
