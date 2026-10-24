"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  filters: {
    name: string,
    value: string,
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramFilter = searchParams.get('filter');

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'filter',
      value
    })

    router.push(newUrl, { scroll: false })
  }

  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger className={`${otherClasses} h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-4 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:ring-1 focus:ring-sky-500 shadow-none`}>
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black shadow-xl p-1 text-xs text-neutral-800 dark:text-neutral-200 z-50">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value} className="cursor-pointer rounded-xl py-2 px-3 focus:bg-neutral-100 dark:focus:bg-neutral-900">
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default Filter