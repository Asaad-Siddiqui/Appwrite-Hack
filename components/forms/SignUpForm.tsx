"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth.action";
import { Input } from "@/components/ui/input";
import { Terminal, Lock, Mail, User, AtSign, Loader2 } from "lucide-react";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-8 sm:p-10 shadow-xl shadow-neutral-500/5">
      {/* Brand Icon Header */}
      <div className="flex flex-col items-center text-center mb-7">
        <div className="h-12 w-12 rounded-full bg-sky-500 flex items-center justify-center text-white mb-4 shadow-md shadow-sky-500/25">
          <Terminal className="h-6 w-6 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-spaceGrotesk tracking-tight">
          Join DevFlow today
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
          Powered by Appwrite TablesDB & Next.js 16
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="h-12 pl-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <div className="relative flex items-center">
            <AtSign className="absolute left-3.5 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
              placeholder="arivera"
              className="h-12 pl-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-neutral-400" />
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="h-12 pl-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
            Password (min. 8 characters)
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-neutral-400" />
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 pl-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-sky-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold shadow-md shadow-sky-500/25 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <div className="mt-7 text-center pt-5 border-t border-neutral-100 dark:border-neutral-900">
        <p className="text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-bold text-sky-500 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
