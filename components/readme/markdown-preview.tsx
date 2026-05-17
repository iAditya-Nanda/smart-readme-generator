"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileCode2, Sparkles } from "lucide-react";

interface MarkdownPreviewProps {
  markdown: string;
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  if (!markdown.trim()) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))] p-8 text-center shadow-inner shadow-white/[0.02]">
        <div className="flex size-14 items-center justify-center rounded-xl border border-white/10 bg-black/40 shadow-2xl shadow-cyan-950/30">
          <FileCode2 className="size-6 text-cyan-200" />
        </div>
        <div className="max-w-sm">
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-100">
            <Sparkles className="size-3.5 text-cyan-200" />
            No preview yet
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Add project details to render your README in real time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="markdown-preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}
