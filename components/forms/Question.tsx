"use client"
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { QuestionsSchema } from "@/lib/validations";
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { createQuestion, editQuestion } from '@/lib/actions/question.action';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeProvider';

interface Props {
  type?: string;
  mongoUserId: string;
  questionDetails?: string;
}

const Question = ({ type, mongoUserId, questionDetails }: Props) => {
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const parsedQuestionDetails =  questionDetails && JSON.parse(questionDetails || '');

  const groupedTags = parsedQuestionDetails?.tags.map((tag: any) => tag.name)

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || '',
      explanation: parsedQuestionDetails?.content || '',
      tags: groupedTags || []
    },
  })
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true);
    
    try {
      if(type === 'Edit') {
        await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        })

        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        let authorId = mongoUserId;
        try {
          authorId = JSON.parse(mongoUserId);
        } catch {}

        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: authorId,
          path: pathname,
        });

        router.push('/');
      }

    } catch (error) {
      
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if(tagValue !== '') {
        if(tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 15 characters.'
          })
        }

        if(!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue]);
          tagInput.value = ''
          form.clearErrors('tags');
        }
      } else {
        form.trigger();
      }
    }
  }

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);

    form.setValue('tags', newTags);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-7">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1.5">
              <FormLabel className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Question Title <span className="text-sky-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="What's your programming question? Be specific..."
                  className="h-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] px-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500"
                  {...field} 
                />
              </FormControl>
              <FormDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Imagine you&apos;re asking a question to a fellow engineer in a thread.
              </FormDescription>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1.5">
              <FormLabel className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Detailed Context & Code <span className="text-sky-500">*</span>
              </FormLabel>
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
                    initialValue={parsedQuestionDetails?.content || ''}
                    init={{
                      height: 350,
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
              <FormDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Provide code snippets, minimal reproducible examples, and what you&apos;ve already tried. (Min 20 chars)
              </FormDescription>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1.5">
              <FormLabel className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Tags <span className="text-sky-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2.5">
                  <Input 
                    disabled={type === 'Edit'}
                    className="h-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] px-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500 disabled:opacity-50"
                    placeholder="Add up to 3 tags (press Enter after each tag, e.g. nextjs, react, appwrite)..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {field.value.map((tag: any) => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400"
                        >
                          #{tag.toLowerCase()}
                          {type !== 'Edit' && (
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag, field)}
                              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                            >
                              <Image 
                                src="/assets/icons/close.svg"
                                alt="Close icon"
                                width={10}
                                height={10}
                                className="invert-0 dark:invert"
                              />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Add up to 3 tags to describe technologies. Press enter after typing.
              </FormDescription>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            className="rounded-full bg-sky-500 hover:bg-sky-600 px-6 py-2.5 font-bold text-white transition-all shadow-sm hover:shadow disabled:opacity-50" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {type === 'Edit' ? 'Saving...' : 'Posting...'}
              </span>
            ) : (
              <>{type === 'Edit' ? 'Save Changes' : 'Post Question'}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Question