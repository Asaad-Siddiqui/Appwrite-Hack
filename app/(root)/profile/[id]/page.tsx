import { getUserInfo } from "@/lib/actions/user.action";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { getJoinedDate } from "@/lib/utils";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswersTab from "@/components/shared/AnswersTab";
import { auth } from "@/lib/actions/auth.action";
import { SignedIn } from "@/context/AuthContext";
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Award,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default async function ProfilePage(props: {
  params: Promise<{ id: string }> | { id: string };
  searchParams: Promise<any> | any;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { userId: clerkId } = await auth();
  const userInfo = await getUserInfo({ userId: params.id });

  if (!userInfo || !userInfo.user) {
    return <div className="p-8 text-center text-neutral-500">User not found.</div>;
  }

  const { user, totalQuestions, totalAnswers, badgeCounts, reputation } = userInfo;
  const isOwner =
    clerkId &&
    (clerkId === user.clerkId ||
      clerkId === user.accountId ||
      clerkId === user._id ||
      clerkId === user.$id);

  const bannerImg =
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
  const avatarUrl =
    user.picture ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username || "dev"}`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/85 dark:bg-black/85 border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 py-2.5 flex items-center gap-6">
        <Link
          href="/"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight font-spaceGrotesk">
            {user.name}
          </h1>
          <span className="text-xs text-neutral-500">
            {totalQuestions} {totalQuestions === 1 ? "question" : "questions"}
          </span>
        </div>
      </header>

      {/* Hero Banner (Twitter / X Profile Cover) */}
      <div className="relative h-44 sm:h-52 w-full bg-neutral-800 overflow-hidden">
        <Image
          src={bannerImg}
          alt="Profile cover banner"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Profile Details Area */}
      <div className="px-4 sm:px-6 pb-4 border-b border-neutral-200/80 dark:border-neutral-800/80 relative">
        {/* Avatar overlapping banner & Action Buttons */}
        <div className="flex justify-between items-end -mt-14 sm:-mt-16 mb-4">
          <div className="relative">
            <Image
              src={avatarUrl}
              alt={user.name || "Avatar"}
              width={128}
              height={128}
              priority
              className="rounded-full h-28 w-28 sm:h-32 sm:w-32 object-cover border-4 border-white dark:border-black bg-neutral-900 shadow-md"
            />
          </div>

          <div className="flex items-center gap-2">
            <SignedIn>
              {isOwner ? (
                <Link
                  href="/profile/edit"
                  className="py-2 px-5 rounded-full border border-neutral-300 dark:border-neutral-700 font-bold text-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  Edit profile
                </Link>
              ) : null}
            </SignedIn>
          </div>
        </div>

        {/* User Identity */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            {user.name}
          </h2>
          <span className="text-sm text-neutral-500">@{user.username || "developer"}</span>
        </div>

        {/* Bio */}
        {user.bio ? (
          <p className="mt-3 text-[15px] text-neutral-800 dark:text-neutral-200 leading-relaxed">
            {user.bio}
          </p>
        ) : (
          <p className="mt-3 text-sm text-neutral-400 italic">
            Developer sharing knowledge and building solutions on DevFlow.
          </p>
        )}

        {/* Meta Info Bar (Location, Portfolio, Joined) */}
        <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-neutral-500">
          {user.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
              <span>{user.location}</span>
            </div>
          )}

          {user.portfolioWebsite && (
            <a
              href={
                user.portfolioWebsite.startsWith("http")
                  ? user.portfolioWebsite
                  : `https://${user.portfolioWebsite}`
              }
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sky-500 hover:underline"
            >
              <LinkIcon className="h-4 w-4 shrink-0" />
              <span className="truncate max-w-[180px]">
                {user.portfolioWebsite.replace(/^https?:\/\//, "")}
              </span>
            </a>
          )}

          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 shrink-0 text-neutral-400" />
            <span>Joined {getJoinedDate(user.joinedAt)}</span>
          </div>
        </div>

        {/* Stats Row (Questions, Answers, Reputation) */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <span className="font-bold text-neutral-900 dark:text-white">
              {totalQuestions}
            </span>
            <span className="text-neutral-500">Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-neutral-900 dark:text-white">
              {totalAnswers}
            </span>
            <span className="text-neutral-500">Answers</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-neutral-900 dark:text-white">
              {reputation}
            </span>
            <span className="text-neutral-500">Reputation</span>
          </div>
        </div>

        {/* Badges Strip */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-900 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Award className="h-3.5 w-3.5" />
            <span>Gold: {badgeCounts?.GOLD || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <Award className="h-3.5 w-3.5" />
            <span>Silver: {badgeCounts?.SILVER || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-700/10 border border-amber-700/20 text-amber-800 dark:text-amber-600 text-xs font-semibold">
            <Award className="h-3.5 w-3.5" />
            <span>Bronze: {badgeCounts?.BRONZE || 0}</span>
          </div>
        </div>
      </div>

      {/* Profile Tabs (Questions & Answers) */}
      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="w-full flex h-12 bg-white dark:bg-black border-b border-neutral-200/80 dark:border-neutral-800/80 rounded-none p-0">
          <TabsTrigger
            value="questions"
            className="flex-1 h-full rounded-none font-semibold text-neutral-500 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-sky-500 bg-transparent data-[state=active]:bg-transparent transition-all"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="answers"
            className="flex-1 h-full rounded-none font-semibold text-neutral-500 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-sky-500 bg-transparent data-[state=active]:bg-transparent transition-all"
          >
            Answers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="m-0">
          <QuestionTab
            searchParams={searchParams}
            userId={user._id}
            clerkId={clerkId}
          />
        </TabsContent>

        <TabsContent value="answers" className="m-0">
          <AnswersTab
            searchParams={searchParams}
            userId={user._id}
            clerkId={clerkId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
