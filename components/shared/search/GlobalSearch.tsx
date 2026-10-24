"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import GlobalResult from "./GlobalResult";
import { Search, X } from "lucide-react";

export default function GlobalSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get("global");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    setIsOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, router, pathname, searchParams, query]);

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <div className="group relative flex h-11 w-full items-center gap-3 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-transparent focus-within:border-sky-500 focus-within:bg-white dark:focus-within:bg-black transition-all px-4">
        <Search className="h-4 w-4 text-neutral-400 group-focus-within:text-sky-500 transition-colors shrink-0" />

        <Input
          type="text"
          placeholder="Search DevOverflow..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="h-full w-full bg-transparent border-0 p-0 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus-visible:ring-0 shadow-none outline-none"
        />

        {search && (
          <button
            onClick={() => {
              setSearch("");
              setIsOpen(false);
            }}
            className="p-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:opacity-80 transition-opacity"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {isOpen && <GlobalResult />}
    </div>
  );
}
