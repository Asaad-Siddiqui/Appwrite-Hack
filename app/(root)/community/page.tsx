import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import type { Metadata } from "next";
import UserCard from "@/components/cards/UserCard";
import { Users as UsersIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Community | DevFlow - Connect with Developers",
};

export default async function CommunityPage(props: {
  searchParams: Promise<any> | any;
}) {
  const searchParams = await props.searchParams;
  const result = await getAllUsers({
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
            <UsersIcon className="h-5 w-5 text-sky-500" />
            <span>Community</span>
          </h1>
          <p className="text-xs text-neutral-500">
            Discover and connect with top engineers & creators
          </p>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/30 flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 w-full">
          <LocalSearchbar
            route="/community"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search developers by name or username..."
            otherClasses="w-full"
          />
        </div>
        <Filter filters={UserFilters} otherClasses="min-h-[46px] sm:min-w-[150px]" />
      </div>

      {/* Developers Timeline */}
      <div className="flex flex-col">
        {result.users && result.users.length > 0 ? (
          result.users.map((user: any) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="p-12 text-center text-neutral-500">
            <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
              No developers found
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Try adjusting your search criteria or create an account to get listed.
            </p>
            <Link
              href="/sign-up"
              className="inline-block mt-4 rounded-full bg-sky-500 text-white font-bold text-xs py-2 px-5 hover:bg-sky-600 transition-colors"
            >
              Join the Community
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-neutral-100 dark:border-neutral-900">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
}
