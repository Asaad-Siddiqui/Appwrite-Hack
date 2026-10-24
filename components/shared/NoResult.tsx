import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { MessageSquare } from 'lucide-react'

interface Props {
  title: string
  description: string
  link: string
  linkTitle: string
}

const NoResult = ({ title, description, link, linkTitle }: Props) => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-400">
        <MessageSquare className="size-7 text-neutral-400 dark:text-neutral-500" />
      </div>

      <h3 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>

      {link && linkTitle && (
        <Link href={link} className="mt-6">
          <Button className="rounded-full bg-sky-500 hover:bg-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:shadow transition-all">
            {linkTitle}
          </Button>
        </Link>
      )}
    </div>
  )
}

export default NoResult