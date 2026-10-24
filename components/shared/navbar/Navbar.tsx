import { SignedIn, UserButton } from "@/context/AuthContext";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import { Terminal } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between backdrop-blur-md bg-white/90 dark:bg-black/90 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 z-40 select-none">
      <div className="flex items-center gap-2">
        <MobileNav />
      </div>

      <Link href="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
          <Terminal className="h-4 w-4 stroke-[2.5]" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white font-spaceGrotesk">
          Dev<span className="text-sky-500">Overflow</span>
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Theme />
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
