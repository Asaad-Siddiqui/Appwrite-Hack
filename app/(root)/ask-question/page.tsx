import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import { ArrowLeft, PenSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask a Question | DevOverflow",
};

export default async function AskQuestionPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/85 dark:bg-black/85 border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 py-3 flex items-center gap-6">
        <Link
          href="/"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight font-spaceGrotesk flex items-center gap-2">
            <PenSquare className="h-4 w-4 text-sky-500" />
            <span>Compose Question</span>
          </h1>
          <p className="text-xs text-neutral-500">
            Ask the community and get solutions to your code challenges
          </p>
        </div>
      </header>

      {/* Form Container */}
      <div className="p-4 sm:p-6">
        <Question
          mongoUserId={JSON.stringify(mongoUser?._id || mongoUser?.$id || userId)}
        />
      </div>
    </div>
  );
}
