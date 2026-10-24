"use client"

import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { AnswerSchema } from '@/lib/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { useRef, useState } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { Button } from '../ui/button'
import { Sparkles } from 'lucide-react'
import { createAnswer } from '@/lib/actions/answer.action'
import { usePathname } from 'next/navigation'

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ question, questionId, authorId }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingAI, setSetIsSubmittingAI] = useState(false);
  const { mode } = useTheme();
  const editorRef = useRef(null)
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: ''
    }
  })

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);

    try {
      let parsedAuthorId = authorId;
      try { parsedAuthorId = JSON.parse(authorId); } catch {}
      let parsedQuestionId = questionId;
      try { parsedQuestionId = JSON.parse(questionId); } catch {}

      await createAnswer({
        content: values.answer,
        author: parsedAuthorId,
        question: parsedQuestionId,
        path: pathname,
      });

      form.reset();

      if(editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent('');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateAIAnswer = async () => {
    if(!authorId) return;

    setSetIsSubmittingAI(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, { 
        method: 'POST',
        body: JSON.stringify({ question })
      })

      const aiAnswer = await response.json();

      // Convert plain text to HTML format

      const formattedAnswer = aiAnswer.reply.replace(/\n/g, '<br />');

      if(editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }

      // Toast...
    } catch (error) {
      console.log(error);
    } finally {
      setSetIsSubmittingAI(false);
    }
  }

  return (
    <div className="pt-2">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
          Post your answer
        </h4>

        <Button 
          type="button"
          variant="outline"
          className="h-9 gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 px-3.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/80 shadow-none"
          onClick={generateAIAnswer}
          disabled={isSubmittingAI}
        >
          {isSubmittingAI ? (
            <span className="flex items-center gap-1.5">
              <span className="size-3.5 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
              Generating...
            </span>
          ) : (
            <>
              <Sparkles className="size-3.5 text-sky-500" />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          className="mt-4 flex w-full flex-col gap-4"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormControl>
                  <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500">
                    <Editor
                      apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                      onInit={(evt, editor) => {
                        // @ts-ignore
                        editorRef.current = editor
                      }}
                      onBlur={field.onBlur}
                      onEditorChange={(content) => field.onChange(content)}
                      init={{
                        height: 280,
                        menubar: false,
                        plugins: [
                          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                          'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                          'insertdatetime', 'media', 'table'
                        ],
                        toolbar: 
                        'undo redo | ' +
                        'codesample | bold italic forecolor | alignleft aligncenter |' +
                        'alignright alignjustify | bullist numlist',
                        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 15px; }',
                        skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                        content_css: mode === 'dark' ? 'dark' : 'light', 
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              className="rounded-full bg-sky-500 hover:bg-sky-600 px-6 py-2 text-sm font-bold text-white transition-all shadow-sm hover:shadow disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Replying...
                </span>
              ) : (
                'Reply'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default Answer