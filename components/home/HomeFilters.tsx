"use client"

import { HomePageFilters } from '@/constants/filters'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery } from '@/lib/utils'

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [active, setActive] = useState('');

  const handleTypeClick = (item: string) => {
      if(active === item) {
        setActive("");

        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'filter',
          value: null
        })

        router.push(newUrl, { scroll: false });
      } else {
        setActive(item);

        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'filter',
          value: item.toLowerCase()
        })

          router.push(newUrl, { scroll: false });
        }
      }

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {HomePageFilters.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => handleTypeClick(item.value)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
            active === item.value 
              ? 'bg-sky-500 text-white shadow-sm' 
              : 'border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  )
}

export default HomeFilters