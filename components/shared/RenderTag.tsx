import Link from "next/link";
import React from "react";

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

export default function RenderTag({ _id, name, totalQuestions, showCount }: Props) {
  const cleanName = name.startsWith("#") ? name : `#${name}`;

  return (
    <Link
      href={`/tags/${_id}`}
      className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors group"
    >
      <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-sky-500 transition-colors">
        {cleanName}
      </span>

      {showCount !== undefined && showCount && (
        <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
          {totalQuestions} {totalQuestions === 1 ? "post" : "posts"}
        </span>
      )}
    </Link>
  );
}
