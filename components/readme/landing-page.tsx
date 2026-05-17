"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Braces,
  ClipboardCheck,
  Download,
  Eye,
  Layers3,
  Moon,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Eye,
    title: "Live preview",
    text: "Render GitHub-flavored markdown as you type, including lists, badges, links, and code blocks.",
  },
  {
    icon: Layers3,
    title: "Template logic",
    text: "Switch between Basic, SaaS, Open Source, and Portfolio structures without losing inputs.",
  },
  {
    icon: BadgeCheck,
    title: "Smart badges",
    text: "Detect common stack entries like Next.js, TypeScript, Docker, and Tailwind CSS.",
  },
  {
    icon: ClipboardCheck,
    title: "Instant export",
    text: "Copy markdown or download a production-ready README.md from the browser.",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050507] text-zinc-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.16),transparent_36%),radial-gradient(circle_at_90%_14%,rgba(168,85,247,0.16),transparent_26%)]" />
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] shadow-lg shadow-cyan-950/20">
            <Wand2 className="size-4 text-cyan-200" />
          </span>
          <span className="text-sm font-semibold tracking-tight">ReadmeForge</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          <a href="#features" className="transition hover:text-white">Features</a>
          <Link href="/generator" className="transition hover:text-white">Workspace</Link>
        </nav>
        <Button asChild className="bg-white text-black hover:bg-cyan-100">
          <Link href="/generator">
            Launch
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-8 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <Badge className="border-white/10 bg-white/[0.06] text-zinc-300">
            <Moon className="mr-1 size-3" />
            Dark mode workspace
          </Badge>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            ReadmeForge
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            A futuristic README generator for shipping clean project documentation
            with templates, smart badges, live preview, copy, and download tools.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 bg-white px-4 text-black hover:bg-cyan-100">
              <Link href="/generator">
                Open generator
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 border-white/10 bg-white/[0.03] px-4">
              <a href="#features">
                Explore features
                <Sparkles className="size-4" />
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.55 }}
          className="relative"
        >
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-yellow-300" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs text-zinc-500">README.md</span>
            </div>
            <div className="grid gap-3 pt-4 md:grid-cols-[0.85fr_1.15fr]">
              <div className="space-y-3 rounded-lg border border-white/10 bg-black/35 p-3">
                {["Project name", "Tech stack", "Template", "License"].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
                  >
                    <span className="text-xs text-zinc-500">{item}</span>
                    <div className="mt-2 h-2 rounded-full bg-zinc-700">
                      <div className="h-2 rounded-full bg-cyan-200" style={{ width: `${56 + index * 9}%` }} />
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-lg border border-white/10 bg-[#07070a] p-4">
                <div className="flex items-center gap-2">
                  <Braces className="size-4 text-cyan-200" />
                  <span className="text-sm font-medium">Generated markdown</span>
                </div>
                <div className="mt-5 space-y-3 font-mono text-xs text-zinc-400">
                  <p className="text-xl font-semibold text-white"># Smart README Generator</p>
                  <p>![Next.js] ![TypeScript] ![Tailwind CSS]</p>
                  <p className="text-zinc-500">## Features</p>
                  <p>- Live preview with GitHub-flavored markdown</p>
                  <p>- Template presets and automatic badges</p>
                  <p className="text-zinc-500">```bash</p>
                  <p>npm run dev</p>
                  <p className="text-zinc-500">```</p>
                </div>
                <div className="mt-6 flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-zinc-300">
                    <Download className="size-3" />
                    Export
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">
                    <ClipboardCheck className="size-3" />
                    Copy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 md:px-6">
        <div className="grid gap-3 md:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 18, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06 }}
              className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:bg-white/[0.06]"
            >
              <feature.icon className="size-5 text-cyan-200 transition group-hover:scale-110" />
              <h2 className="mt-5 text-base font-medium text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
