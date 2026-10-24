"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn({ email, password });
      if (!res.success) {
        setError(res.error || "Failed to sign in. Please check your credentials.");
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-wrapper rounded-xl p-8 shadow-light-300 dark:shadow-none w-full max-w-[480px]">
      <div className="mb-6 text-center">
        <h2 className="h2-bold text-dark100_light900">Welcome Back</h2>
        <p className="paragraph-regular text-dark400_light700 mt-2">
          Sign in to your DevOverflow account
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="paragraph-semibold text-dark400_light800 block mb-1">
            Email Address
          </label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[46px] border"
          />
        </div>

        <div>
          <label className="paragraph-semibold text-dark400_light800 block mb-1">
            Password
          </label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[46px] border"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="primary-gradient min-h-[46px] w-full text-light-900 mt-2"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="paragraph-regular text-dark400_light700">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary-500 hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
