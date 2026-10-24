"use client"

import { GlobalSearchFilters } from '@/constants/filters';
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");
  
  const [active, setActive] = useState(typeParams || '')

  const handleTypeClick = (item: string) => {
    if(active === item) {
      setActive("");

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: null
      })

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: item.toLowerCase()
      })

        router.push(newUrl, { scroll: false });
      }
    }

  return (
    <div className="flex items-center gap-3 px-4">
      <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Filter:</p>
      <div className="flex flex-wrap gap-1.5">
        {GlobalSearchFilters.map((item) => (
          <button
            type="button"
            key={item.value}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
              active === item.value 
                ? 'bg-sky-500 text-white'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GlobalFilters