import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Terminal, Code2, Sparkles, ShieldCheck, Zap, Database } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen w-full bg-neutral-950 text-neutral-100">
      {/* LEFT SHOWCASE PANE (Desktop) */}
      <div className="relative hidden w-1/2 flex-col justify-between border-r border-neutral-800/80 bg-neutral-950 p-12 lg:flex xl:p-16 overflow-hidden">
        {/* Ambient atmospheric glow */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[140px]" />
        
        {/* Subtle dot matrix grid pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

        {/* Top: Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/25 transition group-hover:scale-105">
              <Terminal className="size-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight font-spaceGrotesk text-white">
                Dev<span className="text-sky-500">Overflow</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                Developer Network
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs font-semibold text-neutral-300 backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Appwrite TablesDB</span>
          </div>
        </div>

        {/* Middle: Interactive Code Card & Feature Highlights */}
        <div className="relative z-10 my-auto flex flex-col gap-6 max-w-lg">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 mb-4">
              <Sparkles className="size-3.5" />
              <span>Next-Gen Engineering Discussions</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Where developers talk code, debug fast, and build public reputation.
            </h1>
          </div>

          {/* Code Window */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl overflow-hidden font-mono text-xs">
            {/* Terminal bar */}
            <div className="flex items-center justify-between border-b border-neutral-800/80 px-4 py-2.5 bg-neutral-950/60">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-rose-500/80" />
                <div className="size-2.5 rounded-full bg-amber-500/80" />
                <div className="size-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] text-neutral-500">stream.action.ts</span>
              <Database className="size-3.5 text-neutral-500" />
            </div>

            {/* Code Body */}
            <div className="p-4 leading-relaxed text-neutral-300">
              <p><span className="text-purple-400">import</span> &#123; tables &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&quot;@/lib/appwrite&quot;</span>;</p>
              <p className="mt-2 text-neutral-500">// Fetch real-time developer stream</p>
              <p><span className="text-purple-400">const</span> feed = <span className="text-purple-400">await</span> tables.<span className="text-sky-400">listRows</span>(</p>
              <p className="pl-4"><span className="text-amber-300">&quot;devoverflow&quot;</span>,</p>
              <p className="pl-4"><span className="text-amber-300">&quot;questions&quot;</span>,</p>
              <p className="pl-4">[<span className="text-sky-300">Query</span>.<span className="text-sky-400">orderDesc</span>(<span className="text-amber-300">&quot;reputation&quot;</span>)]</p>
              <p>);</p>
              <p className="mt-2 text-emerald-400 font-semibold">// 200 OK · Singapore sgp.cloud</p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Dev" 
                className="size-8 rounded-full border-2 border-neutral-950 object-cover" 
              />
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Dev" 
                className="size-8 rounded-full border-2 border-neutral-950 object-cover" 
              />
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Dev" 
                className="size-8 rounded-full border-2 border-neutral-950 object-cover" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-200">
                14,000+ active software engineers
              </span>
              <span className="text-[11px] text-neutral-500">
                Building Next.js, React, Node & Appwrite apps
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-900 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-sky-400" />
            <span>End-to-end encrypted session auth</span>
          </div>
          <span>© {new Date().getFullYear()} DevOverflow</span>
        </div>
      </div>

      {/* RIGHT AUTH CARD PANE */}
      <div className="relative flex min-h-screen w-full flex-col justify-center items-center p-6 sm:p-12 lg:w-1/2">
        {/* Subtle ambient light for right side */}
        <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-sky-500/5 blur-[100px]" />
        
        {/* Mobile brand header */}
        <div className="mb-8 flex lg:hidden items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/20">
            <Terminal className="size-4 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight font-spaceGrotesk text-white">
            Dev<span className="text-sky-500">Overflow</span>
          </span>
        </div>

        {children}
      </div>
    </main>
  );
}
