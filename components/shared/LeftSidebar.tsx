"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth, SignedIn, SignedOut } from "@/context/AuthContext";
import {
  Home,
  Users,
  Bookmark,
  Tag,
  User as UserIcon,
  PlusCircle,
  LogOut,
  Terminal,
} from "lucide-react";

export default function LeftSidebar() {
  const { user, userId, signOut } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { label: "Home", route: "/", icon: Home },
    { label: "Explore Tags", route: "/tags", icon: Tag },
    { label: "Community", route: "/community", icon: Users },
    { label: "Bookmarks", route: "/collection", icon: Bookmark },
    {
      label: "Profile",
      route: userId ? `/profile/${user?.clerkId || user?.accountId || userId}` : "/sign-in",
      icon: UserIcon,
    },
  ];

  return (
    <aside className="sticky top-0 left-0 h-screen flex flex-col justify-between border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-3 py-4 sm:px-4 lg:w-[275px] max-sm:hidden z-30 select-none">
      {/* Top Section */}
      <div className="flex flex-col gap-2">
        {/* Brand / Logo (X style minimalist mark) */}
        <Link
          href="/"
          className="flex items-center gap-3 w-fit p-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors mb-1"
          aria-label="DevOverflow Home"
        >
          <div className="h-10 w-10 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
            <Terminal className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white max-lg:hidden font-spaceGrotesk">
            Dev<span className="text-sky-500">Flow</span>
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1 mt-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.route === "/"
                ? pathname === "/"
                : pathname.startsWith(item.route);

            return (
              <Link
                key={item.label}
                href={item.route}
                className={`group flex items-center gap-4 rounded-full px-4 py-3 text-lg transition-colors w-full ${
                  isActive
                    ? "font-bold text-neutral-900 dark:text-white bg-neutral-100/80 dark:bg-neutral-900"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900/60"
                }`}
              >
                <Icon
                  className={`h-6 w-6 transition-transform group-hover:scale-105 ${
                    isActive ? "text-sky-500 stroke-[2.5]" : "stroke-[1.75]"
                  }`}
                />
                <span className="max-lg:hidden leading-none tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Ask Question / Compose Action Button */}
        <div className="mt-4">
          <Link
            href="/ask-question"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-base shadow-sm shadow-sky-500/25 transition-all transform active:scale-[0.98]"
          >
            <PlusCircle className="h-5 w-5 max-lg:inline lg:hidden stroke-[2.5]" />
            <span className="max-lg:hidden tracking-tight">Ask Question</span>
          </Link>
        </div>
      </div>

      {/* Bottom Section: User Profile Chip or Sign-In */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900">
        <SignedIn>
          {user && (
            <div className="flex items-center justify-between p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full">
              <Link
                href={`/profile/${user.clerkId || user.accountId || user._id}`}
                className="flex items-center gap-3 overflow-hidden flex-1"
              >
                <Image
                  src={
                    user.picture ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username || "dev"}`
                  }
                  alt={user.name || "Avatar"}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 object-cover border border-neutral-200 dark:border-neutral-800"
                />
                <div className="flex flex-col overflow-hidden max-lg:hidden text-left">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    @{user.username || "user"}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => signOut()}
                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors max-lg:hidden"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </SignedIn>

        <SignedOut>
          <div className="flex flex-col gap-2 max-lg:items-center">
            <Link
              href="/sign-in"
              className="w-full py-2.5 px-4 text-center rounded-full border border-neutral-300 dark:border-neutral-700 text-sm font-bold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <span className="max-lg:hidden">Log in</span>
              <span className="lg:hidden text-xs">In</span>
            </Link>
            <Link
              href="/sign-up"
              className="w-full py-2.5 px-4 text-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <span className="max-lg:hidden">Sign up</span>
              <span className="lg:hidden text-xs">Up</span>
            </Link>
          </div>
        </SignedOut>
      </div>
    </aside>
  );
}
