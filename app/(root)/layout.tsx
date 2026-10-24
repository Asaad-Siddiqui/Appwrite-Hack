import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Navbar from "@/components/shared/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 flex justify-center">
      <div className="flex w-full max-w-[1260px] justify-between relative">
        {/* Left Navigation Rail (Desktop) */}
        <LeftSidebar />

        {/* Center Stream (Timeline) */}
        <main className="flex-1 min-h-screen border-r border-l border-neutral-200 dark:border-neutral-800 max-w-[680px] w-full min-w-0 pb-16 sm:pb-8">
          {/* Mobile Top Header */}
          <div className="sm:hidden sticky top-0 z-30">
            <Navbar />
          </div>
          {children}
        </main>

        {/* Right Widget Sidebar (Desktop) */}
        <RightSidebar />
      </div>

      <Toaster />
    </div>
  );
}
