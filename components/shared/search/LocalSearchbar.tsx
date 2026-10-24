"use client"

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import { Search } from 'lucide-react'

interface CustomInputProps {
  route: string
  iconPosition: string
  imgSrc: string
  placeholder: string
  otherClasses?: string
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');

  const [search, setSearch] = useState(query || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if(search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'q',
          value: search
        })

        router.push(newUrl, { scroll: false });
      } else {
        console.log(route, pathname)
        if(pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['q']
          })

          router.push(newUrl, { scroll: false });
        }

      }
    }, 300);
    
    return () => clearTimeout(delayDebounceFn)
  }, [search, route, pathname, router, searchParams, query])

  return (
    <div className={`relative flex h-10 grow items-center gap-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3.5 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 ${otherClasses}`}>
      <Search className="size-4 shrink-0 text-neutral-400 dark:text-neutral-500" />

      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-full border-none bg-transparent p-0 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-0 shadow-none outline-none"
      />
    </div>
  )
}

export default LocalSearchbar