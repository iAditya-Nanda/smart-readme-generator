"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  Clipboard,
  Command,
  Download,
  FileText,
  GitBranch,
  Layers3,
  Rocket,
  Search,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  generateReadme,
  initialReadmeData,
  templateOptions,
} from "@/lib/readme/templates";
import type { ReadmeFormData, ReadmeTemplate } from "@/lib/readme/types";
import { MarkdownPreview } from "./markdown-preview";

const fields: Array<{
  key: keyof ReadmeFormData;
  label: string;
  placeholder: string;
  type: "input" | "textarea";
}> = [
  { key: "projectName", label: "Project name", placeholder: "Orbit CRM", type: "input" },
  {
    key: "description",
    label: "Description",
    placeholder: "Describe what the project does and why it matters.",
    type: "textarea",
  },
  {
    key: "features",
    label: "Features",
    placeholder: "Authentication\nBilling dashboard\nTeam workspaces",
    type: "textarea",
  },
  {
    key: "installation",
    label: "Installation steps",
    placeholder: "npm install\nnpm run dev",
    type: "textarea",
  },
  {
    key: "usage",
    label: "Usage",
    placeholder: "Explain the main workflow or CLI command.",
    type: "textarea",
  },
  {
    key: "techStack",
    label: "Tech stack",
    placeholder: "Next.js, TypeScript, Docker, Tailwind CSS",
    type: "input",
  },
  { key: "license", label: "License", placeholder: "MIT", type: "input" },
  { key: "author", label: "Author", placeholder: "Jane Doe", type: "input" },
  {
    key: "githubUrl",
    label: "GitHub URL",
    placeholder: "https://github.com/org/repo",
    type: "input",
  },
];

const navItems = [
  { icon: Rocket, label: "Workspace" },
  { icon: Layers3, label: "Templates" },
  { icon: BadgeCheck, label: "Badges" },
  { icon: FileText, label: "Preview" },
];

const fieldGroups = [
  {
    title: "Identity",
    description: "Name, positioning, ownership, and repository details.",
    keys: ["projectName", "description", "author", "githubUrl"] satisfies Array<
      keyof ReadmeFormData
    >,
  },
  {
    title: "Content",
    description: "The sections your readers scan before installing.",
    keys: ["features", "usage", "techStack"] satisfies Array<keyof ReadmeFormData>,
  },
  {
    title: "Setup",
    description: "Developer onboarding, licensing, and release context.",
    keys: ["installation", "license"] satisfies Array<keyof ReadmeFormData>,
  },
];

const fieldByKey = new Map(fields.map((field) => [field.key, field]));

const copyWithFallback = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
};

function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen bg-[#050507] p-4 text-zinc-50 md:p-6">
      <div className="mx-auto grid max-w-[1500px] gap-5 lg:grid-cols-[280px_1fr_1fr]">
        {[0, 1, 2].map((column) => (
          <div
            key={column}
            className="h-[calc(100vh-3rem)] rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/40"
          >
            <div className="h-10 w-32 animate-pulse rounded-lg bg-white/10" />
            <div className="mt-8 space-y-3">
              {[0, 1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded-xl bg-white/[0.055]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GeneratorWorkspace() {
  const selectId = useId();
  const [data, setData] = useState<ReadmeFormData>(initialReadmeData);
  const [template, setTemplate] = useState<ReadmeTemplate>("basic");
  const [copied, setCopied] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  const markdown = useMemo(() => generateReadme(data, template), [data, template]);
  const filledFields = Object.values(data).filter((value) => value.trim()).length;
  const completion = Math.round((filledFields / fields.length) * 100);
  const activeTemplate = templateOptions.find((option) => option.id === template);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  const updateField = (key: keyof ReadmeFormData, value: string) => {
    setData((current) => ({ ...current, [key]: value }));
  };

  const copyMarkdown = async () => {
    try {
      await copyWithFallback(markdown);
    } catch {
      // Some embedded browsers block all clipboard APIs; keep UI feedback responsive.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "README.md";
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  if (isBooting) {
    return <WorkspaceSkeleton />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050507] text-zinc-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(129,140,248,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_34%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30" />
      <div className="relative mx-auto flex w-full max-w-[1540px] flex-col lg:flex-row">
        <motion.aside
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-0 z-20 border-b border-white/10 bg-black/55 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6"
        >
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.035))] shadow-lg shadow-cyan-950/30">
                <Wand2 className="size-4 text-cyan-200" />
              </span>
              <span>
                <span className="block text-sm font-semibold tracking-tight">ReadmeForge</span>
                <span className="text-xs text-zinc-500">Command center</span>
              </span>
            </Link>
            <Badge className="border-emerald-300/20 bg-emerald-300/10 text-emerald-100 shadow-lg shadow-emerald-950/20">
              Live
            </Badge>
          </div>

          <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-2 shadow-2xl shadow-black/30 lg:block">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-zinc-500">
              <Search className="size-4 text-zinc-500" />
              Jump to section
              <span aria-hidden="true" className="ml-auto flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-zinc-500">
                <Command className="size-3" /> K
              </span>
            </div>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto lg:mt-6 lg:flex-col lg:overflow-visible">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.label === "Preview" ? "#preview" : "#generator"}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * index, duration: 0.35 }}
                whileHover={{ x: 3 }}
                className="group flex min-w-max items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/[0.075] hover:text-white"
              >
                <span className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] transition group-hover:border-cyan-200/30 group-hover:bg-cyan-300/10">
                  <item.icon className="size-3.5 transition group-hover:text-cyan-200" />
                </span>
                {item.label}
              </motion.a>
            ))}
          </nav>

          <div className="mt-6 hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(34,211,238,0.1),rgba(255,255,255,0.035))] p-4 shadow-2xl shadow-black/30 lg:block">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>README health</span>
              <span className="text-cyan-100">{completion}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-300"
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-zinc-500">
              {filledFields} of {fields.length} inputs are ready for export.
            </p>
          </div>
        </motion.aside>

        <section id="generator" className="grid flex-1 gap-5 px-4 py-5 md:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(440px,1fr)] lg:gap-7 lg:py-7">
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 lg:space-y-6"
          >
            <div className="rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl md:p-7">
              <Badge className="border-white/10 bg-white/[0.07] text-zinc-300 shadow-lg shadow-black/20">
                <Sparkles className="mr-1 size-3" />
                Local state only
              </Badge>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl xl:text-6xl">
                Build a production README without leaving flow.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
                Choose a template, describe the project, and export clean markdown
                with badges and structure already handled.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["Template", activeTemplate?.label ?? "Basic"],
                  ["Filled", `${filledFields}/${fields.length}`],
                  ["Export", "README.md"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 shadow-inner shadow-white/[0.02]"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-100">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl md:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-white">Template system</h2>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    Tune the generated structure for the project type.
                  </p>
                </div>
                <Select
                  value={template}
                  onValueChange={(value) => setTemplate(value as ReadmeTemplate)}
                >
                  <SelectTrigger id={selectId} aria-label="README template" className="h-11 w-full rounded-xl border-white/10 bg-black/45 shadow-inner shadow-white/[0.02] md:w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {templateOptions.map((option) => (
                  <motion.button
                    type="button"
                    key={option.id}
                    onClick={() => setTemplate(option.id)}
                    aria-pressed={template === option.id}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`group rounded-2xl border p-4 text-left shadow-xl transition ${
                      template === option.id
                        ? "border-cyan-200/40 bg-cyan-300/10 shadow-cyan-950/20"
                        : "border-white/10 bg-black/25 shadow-black/20 hover:border-white/20 hover:bg-white/[0.055]"
                    }`}
                  >
                    <span className="flex items-center justify-between text-sm font-medium text-white">
                      {option.label}
                      <span className={`size-2 rounded-full transition ${template === option.id ? "bg-cyan-200" : "bg-zinc-700 group-hover:bg-zinc-500"}`} />
                    </span>
                    <span className="mt-2 block text-xs leading-5 text-zinc-500">
                      {option.description}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-white">Project details</h2>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    Each line in list fields becomes a markdown bullet.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-zinc-400">
                  <GitBranch className="size-4 text-cyan-200" />
                  Structured inputs
                </div>
              </div>
              <Separator className="my-4 bg-white/10" />
              <div className="grid gap-5">
                {fieldGroups.map((group) => (
                  <div key={group.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-zinc-100">{group.title}</h3>
                        <p className="mt-1 text-xs leading-5 text-zinc-500">{group.description}</p>
                      </div>
                      <Zap className="mt-0.5 size-4 text-zinc-600" />
                    </div>
                    <div className="grid gap-4">
                      {group.keys.map((key) => {
                        const field = fieldByKey.get(key);
                        if (!field) return null;

                        return (
                          <label key={field.key} className="group grid gap-2">
                            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 transition group-focus-within:text-cyan-200">
                              {field.label}
                            </span>
                            {field.type === "textarea" ? (
                              <Textarea
                                value={data[field.key]}
                                onChange={(event) => updateField(field.key, event.target.value)}
                                placeholder={field.placeholder}
                                className="min-h-28 resize-y rounded-2xl border-white/10 bg-black/35 text-zinc-100 shadow-inner shadow-white/[0.02] placeholder:text-zinc-600 focus-visible:border-cyan-200/50 focus-visible:ring-cyan-200/20"
                              />
                            ) : (
                              <Input
                                value={data[field.key]}
                                onChange={(event) => updateField(field.key, event.target.value)}
                                placeholder={field.placeholder}
                                className="h-11 rounded-2xl border-white/10 bg-black/35 text-zinc-100 shadow-inner shadow-white/[0.02] placeholder:text-zinc-600 focus-visible:border-cyan-200/50 focus-visible:ring-cyan-200/20"
                              />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            id="preview"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#09090c]/90 shadow-[0_24px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
              <div className="border-b border-white/10 bg-white/[0.025] p-3">
                <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/35 p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-white">README.md Preview</h2>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Real-time markdown rendering with GitHub-flavored syntax.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <Button type="button" variant="outline" onClick={copyMarkdown} className="h-10 rounded-xl border-white/10 bg-white/[0.045] shadow-lg shadow-black/20 hover:bg-white/[0.08]">
                    {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button type="button" onClick={downloadMarkdown} className="h-10 rounded-xl bg-white text-black shadow-lg shadow-cyan-950/20 hover:bg-cyan-100">
                    <Download className="size-4" />
                    Download
                  </Button>
                </div>
                </div>
              </div>
              <div className="relative flex min-h-[36rem] flex-1 overflow-auto bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.06),transparent_36%)] p-3 md:p-5">
                <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0c0c10]/80 p-5 shadow-2xl shadow-black/35 md:p-7">
                <MarkdownPreview markdown={markdown} />
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
