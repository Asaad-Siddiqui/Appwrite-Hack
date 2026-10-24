"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const parseId = (id: string) => {
    try { return JSON.parse(id); } catch { return id; }
  };

  const handleEdit = () => {
    router.push(`/question/edit/${parseId(itemId)}`)
  };

  const handleDelete = async () => {
    if(type === 'Question') {
      // Delete question
      await deleteQuestion({ 
        questionId: parseId(itemId), 
        path: pathname 
      })
    } else if(type === 'Answer') {
      // Delete answer
      await deleteAnswer({ 
        answerId: parseId(itemId), 
        path: pathname 
      })
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {type === 'Question' && (
        <button
          type="button"
          onClick={handleEdit}
          aria-label="Edit"
          className="rounded-full p-1.5 text-neutral-400 transition hover:bg-sky-500/10 hover:text-sky-500"
        >
          <Pencil className="size-4" />
        </button>
      )}

      <button
        type="button"
        onClick={handleDelete}
        aria-label="Delete"
        className="rounded-full p-1.5 text-neutral-400 transition hover:bg-rose-500/10 hover:text-rose-500"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

export default EditDeleteAction