"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, SignedOut, SignedIn } from "@/context/AuthContext";
import {
  Home,
  Users,
  Bookmark,
  Tag,
  User as UserIcon,
  Menu,
  Terminal,
  LogOut,
  PenSquare,
} from "lucide-react";
import Image from "next/image";

export default function MobileNav() {
  const pathname = usePathname();
  const { user, userId, signOut } = useAuth();

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
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[280px] bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 p-0 flex flex-col justify-between"
      >
        <div className="p-4 flex flex-col gap-4">
          {/* Header Brand */}
          <Link href="/" className="flex items-center gap-2.5 px-2 py-1">
            <div className="h-9 w-9 rounded-full bg-sky-500 flex items-center justify-center text-white">
              <Terminal className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-extrabold text-neutral-900 dark:text-white font-spaceGrotesk">
              Dev<span className="text-sky-500">Flow</span>
            </span>
          </Link>

          {/* User info if logged in */}
          <SignedIn>
            {user && (
              <div className="flex items-center gap-3 px-2 py-2 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
                <Image
                  src={
                    user.picture ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username || "dev"}`
                  }
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 object-cover"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-neutral-500 truncate">
                    @{user.username || "dev"}
                  </span>
                </div>
              </div>
            )}
          </SignedIn>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.route === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.route);

              return (
                <SheetClose asChild key={item.label}>
                  <Link
                    href={item.route}
                    className={`flex items-center gap-4 rounded-full px-4 py-3 text-base transition-colors ${
                      isActive
                        ? "font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? "text-sky-500 stroke-[2.5]" : "stroke-[1.75]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          {/* Ask Question Mobile Action */}
          <SheetClose asChild>
            <Link
              href="/ask-question"
              className="mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-sky-500 text-white font-bold text-sm shadow-sm"
            >
              <PenSquare className="h-4 w-4" />
              <span>Ask a Question</span>
            </Link>
          </SheetClose>
        </div>

        {/* Footer with Login / Logout */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-900">
          <SignedIn>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-red-200 dark:border-red-950 text-red-500 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </SignedIn>

          <SignedOut>
            <div className="flex flex-col gap-2">
              <SheetClose asChild>
                <Link
                  href="/sign-in"
                  className="w-full text-center py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 font-bold text-sm text-neutral-900 dark:text-white"
                >
                  Log in
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/sign-up"
                  className="w-full text-center py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-sm"
                >
                  Sign up
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
}
