"use client"

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import GlobalFilters from './GlobalFilters'
import { globalSearch } from '@/lib/actions/general.action'
import { FileText, Hash, User as UserIcon, Loader2 } from 'lucide-react'

const GlobalResult = () => {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any[]>([]);

  const global = searchParams.get('global');
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);

      try {
        const res = await globalSearch({ query: global, type })
        setResult(JSON.parse(res));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if(global) {
      fetchResult();
    }
  }, [global, type])

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case 'question':
      case 'answer':
        return `/question/${id}`;
      case 'user':
        return `/profile/${id}`;
      case 'tag':
        return `/tags/${id}`;
      default:
        return '/'
    }
  }

  const renderIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <UserIcon className="size-4 text-sky-500" />
      case 'tag':
        return <Hash className="size-4 text-emerald-500" />
      default:
        return <FileText className="size-4 text-neutral-400" />
    }
  }

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] py-3 shadow-2xl">
      <GlobalFilters /> 
      <div className="my-3 h-[1px] bg-neutral-100 dark:bg-neutral-800" />

      <div className="space-y-1">
        <p className="px-4 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Search Results
        </p>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-sky-500" />
            <p className="mt-2 text-xs text-neutral-500">Searching DevOverflow...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={item.type + item.id + index}
                  className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
                    {renderIcon(item.type)}
                  </div>

                  <div className="flex flex-1 min-w-0 flex-col">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] capitalize text-neutral-500">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-xs text-neutral-500">
                No matching results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GlobalResult