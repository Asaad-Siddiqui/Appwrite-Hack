import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types'
import AnswerCard from '../cards/AnswerCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  })

  return (
    <div className="flex flex-col">
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {result.answers.length > 0 ? (
          result.answers.map((item: any) => (
            <AnswerCard 
              key={item._id}
              clerkId={clerkId}
              _id={item._id}
              question={item.question}
              author={item.author}
              upvotes={item.upvotes?.length || 0}
              createdAt={item.createdAt}
            />  
          ))
        ) : (
          <div className="p-8 text-center text-sm text-neutral-500">
            No answers posted yet
          </div>
        )}
      </div>

      <Pagination 
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNextAnswer}
      />
    </div>
  )
}

export default AnswersTab