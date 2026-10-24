"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await signUp({ name, username, email, password });
      if (!res.success) {
        setError(res.error || "Failed to create account. Please try again.");
      } else {
        router.push("/");
        router.refresh();
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
        <h2 className="h2-bold text-dark100_light900">Create an Account</h2>
        <p className="paragraph-regular text-dark400_light700 mt-2">
          Join the DevOverflow community powered by Appwrite
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
            Full Name
          </label>
          <Input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[46px] border"
          />
        </div>

        <div>
          <label className="paragraph-semibold text-dark400_light800 block mb-1">
            Username
          </label>
          <Input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
            placeholder="johndoe"
            className="paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[46px] border"
          />
        </div>

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
            Password (min. 8 characters)
          </label>
          <Input
            type="password"
            required
            minLength={8}
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
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="paragraph-regular text-dark400_light700">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary-500 hover:underline font-semibold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
