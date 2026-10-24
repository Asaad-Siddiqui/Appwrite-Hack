"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { ProfileSchema } from "@/lib/validations"
import { usePathname, useRouter } from "next/navigation"
import { updateUser } from "@/lib/actions/user.action"

interface Props {
  clerkId: string;
  user: string;
}

const Profile = ({ clerkId, user }: Props) => {
  const parsedUser = typeof user === 'string' ? (user ? JSON.parse(user) : {}) : (user || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname()

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || '',
      username: parsedUser.username || '',
      portfolioWebsite: parsedUser.portfolioWebsite || '',
      location: parsedUser.location || '',
      bio: parsedUser.bio || '',
    },
  })

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true);

    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
        path: pathname
      })

      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Full Name <span className="text-sky-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your display name" 
                  className="h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] px-3.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Username (@handle) <span className="text-sky-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="username" 
                  className="h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] px-3.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Website
              </FormLabel>
              <FormControl>
                <Input 
                  type="url"
                  placeholder="https://yourportfolio.com" 
                  className="h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] px-3.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Location 
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="San Francisco, CA" 
                  className="h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] px-3.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Bio <span className="text-sky-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell the developer community about yourself..." 
                  className="min-h-[90px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            className="rounded-full bg-sky-500 hover:bg-sky-600 px-6 py-2 text-sm font-bold text-white transition-all shadow-sm hover:shadow disabled:opacity-50" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </span>
            ) : (
              "Save profile"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Profile