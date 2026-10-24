import { getUserQuestions } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types'
import React from 'react'
import QuestionCard from '../cards/QuestionCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  })

  return (
    <div className="flex flex-col">
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard 
              key={question._id}
              _id={question._id}
              clerkId={clerkId}
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
          <div className="p-8 text-center text-sm text-neutral-500">
            No questions asked yet
          </div>
        )}
      </div>

      <Pagination 
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNextQuestions}
      />
    </div>
  )
}

export default QuestionTab