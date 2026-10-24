import { formatAndDivideNumber } from "@/lib/utils"
import { BadgeCounts } from "@/types";
import Image from "next/image";

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-3.5">
      <Image src={imgUrl} alt={title} width={28} height={35} className="shrink-0" />
      <div>
        <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
          {value}
        </p>
        <p className="text-xs text-neutral-500">{title}</p>
      </div>
    </div>
  )
}

interface Props {
  totalQuestions: number
  totalAnswers: number
  badges: BadgeCounts
  reputation: number
}

const Stats = ({ totalQuestions, totalAnswers, badges, reputation }: Props) => {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Developer Stats · {reputation} rep
      </h4>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="flex flex-col justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-3.5">
          <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {formatAndDivideNumber(totalQuestions)}
          </p>
          <p className="text-xs text-neutral-500">Questions</p>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-3.5">
          <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {formatAndDivideNumber(totalAnswers)}
          </p>
          <p className="text-xs text-neutral-500">Answers</p>
        </div>

        <StatsCard 
          imgUrl="/assets/icons/gold-medal.svg"
          value={badges.GOLD}
          title="Gold"
        />

        <StatsCard 
          imgUrl="/assets/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver"
        />
      </div>
    </div>
  )
}

export default Stats