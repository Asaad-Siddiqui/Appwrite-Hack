"use client"

import { formUrlQuery } from '@/lib/utils';
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    const nextPageNumber = direction === 'prev'
      ? pageNumber - 1
      : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString(),
    })

    router.push(newUrl)
  }

  if(!isNext && pageNumber === 1) return null;

  return (
    <div className="flex w-full items-center justify-center gap-2 py-6">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation('prev')}
        variant="outline"
        className="h-9 gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40"
      >
        <ChevronLeft className="size-3.5" />
        <span>Prev</span>
      </Button>

      <div className="flex h-9 min-w-9 items-center justify-center rounded-full bg-sky-500 px-3 text-xs font-bold text-white shadow-sm">
        {pageNumber}
      </div>

      <Button
        disabled={!isNext}
        onClick={() => handleNavigation('next')}
        variant="outline"
        className="h-9 gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40"
      >
        <span>Next</span>
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  )
}

export default Pagination