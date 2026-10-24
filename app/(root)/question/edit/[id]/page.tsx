import Question from '@/components/forms/Question'
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@/lib/actions/auth.action'

const Page = async (props: { params: Promise<{ id: string }> | { id: string } }) => {
  const params = await props.params;
  const { userId } = await auth();

  if(!userId) return null;

  const mongoUser = await getUserById({ userId })
  const result = await getQuestionById({ questionId: params.id})

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question 
          type="Edit"
          mongoUserId={mongoUser._id}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  )
}

export default Page
