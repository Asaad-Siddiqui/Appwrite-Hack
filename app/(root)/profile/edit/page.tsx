import Profile from '@/components/forms/Profile';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@/lib/actions/auth.action';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';

const Page = async (props: { params: Promise<any> | any }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const mongoUser = await getUserById({ userId });

  return (
    <div className="flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 px-4 py-3 backdrop-blur-md">
        <Link 
          href={`/profile/${mongoUser?._id || userId}`}
          className="rounded-full p-2 text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Edit profile
          </h1>
          <p className="text-xs text-neutral-500">@{mongoUser?.username || 'user'}</p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <Profile 
          clerkId={userId}
          user={JSON.stringify(mongoUser)}
        />
      </div>
    </div>
  );
};

export default Page;
