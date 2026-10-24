import Image from "next/image";
import Link from "next/link";

interface ProfileLinkProps {
  imgUrl: string;
  href?: string;
  title: string;
}

const ProfileLink = ({ imgUrl, href, title }: ProfileLinkProps) => {
  return (
    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
      <Image src={imgUrl} alt="icon" width={14} height={14} className="opacity-70 dark:invert" />

      {href ? (
        <Link href={href} target="_blank" className="font-medium text-sky-500 hover:underline">
          {title}
        </Link> 
      ) : (
        <span className="font-medium text-neutral-600 dark:text-neutral-400">
          {title}
        </span>
      )}
    </div>
  )
}

export default ProfileLink