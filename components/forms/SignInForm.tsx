"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth.action";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Sparkles } from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn({ email, password });
      if (!res.success) {
        setError(res.error || "Invalid email or password. Please try again.");
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
    <div className="w-full max-w-[420px] rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-8 sm:p-9 backdrop-blur-2xl shadow-2xl shadow-black/60">
      {/* Tabs */}
      <div className="mb-7 flex rounded-full border border-neutral-800 bg-neutral-950/70 p-1">
        <Link 
          href="/sign-in" 
          className="flex-1 rounded-full bg-neutral-800/90 py-2 text-center text-xs font-bold text-white shadow-sm transition"
        >
          Sign In
        </Link>
        <Link 
          href="/sign-up" 
          className="flex-1 rounded-full py-2 text-center text-xs font-bold text-neutral-400 hover:text-white transition"
        >
          Create Account
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white font-spaceGrotesk">
          Welcome back
        </h2>
        <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
          Sign in to access your developer feed, bookmarked threads, and reputation stats.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-300">
          <span className="font-bold">Error:</span>
          <span className="flex-1">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-300">
            Email address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 size-4 text-neutral-500" />
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="engineer@devoverflow.io"
              className="h-11 pl-10 rounded-xl border border-neutral-800 bg-neutral-950/80 text-sm text-neutral-100 placeholder:text-neutral-600 focus-visible:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300">
              Password
            </label>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 size-4 text-neutral-500" />
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="h-11 pl-10 pr-10 rounded-xl border border-neutral-800 bg-neutral-950/80 text-sm text-neutral-100 placeholder:text-neutral-600 focus-visible:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-neutral-500 hover:text-neutral-300 transition"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-sky-500 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch link */}
      <p className="mt-6 text-center text-xs text-neutral-500">
        New to DevOverflow?{" "}
        <Link href="/sign-up" className="font-semibold text-sky-400 hover:text-sky-300 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
