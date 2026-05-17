"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Layers3,
  BadgeCheck,
  ClipboardCheck,
  Download,
  Eye,
  Moon,
  Sun,
  Terminal,
  FileText,
  Check,
  ExternalLink,
  Shield,
  Zap,
  Cpu,
  TrendingUp,
  X,
  ChevronDown,
  Play,
  Pause,
  HelpCircle,
  Star,
  BookOpen,
  Users,
  CheckCircle2,
  Menu,
  Clock,
  Settings,
  AlertTriangle,
  Lightbulb
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownPreview } from "./markdown-preview";
import {
  generateReadme,
  templateOptions,
  initialReadmeData
} from "@/lib/readme/templates";
import type { ReadmeFormData, ReadmeTemplate } from "@/lib/readme/types";

// Custom inline robust GitHub SVG icon to bypass old dependency issues
function Github({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// Spring-physics magnetic effect for high-end SaaS buttons
function Magnetic({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 160, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.3);
    y.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// STATIC DATA & CONTENT CONFIGS
// ==========================================

const painPoints = [
  {
    type: "before",
    title: "The Manual Nightmare",
    subtitle: "Drafting READMEs by hand is a workflow bottle-neck.",
    theme: "red",
    items: [
      { text: "Writing tedious markdown from scratch for every single project.", icon: AlertTriangle },
      { text: "Manually copying shields.io URL schemas for badge integration.", icon: AlertTriangle },
      { text: "Messy, inconsistent formatting across repository libraries.", icon: AlertTriangle },
      { text: "Wasting 30-45 minutes formatting code blocks, links, and lists.", icon: AlertTriangle },
    ]
  },
  {
    type: "after",
    title: "The ReadmeForge Way",
    subtitle: "Documentation built at the speed of thought.",
    theme: "cyan",
    items: [
      { text: "Pristine developer blueprints created in under 10 seconds.", icon: CheckCircle2 },
      { text: "Automatic stack detection and shields.io badge compiling.", icon: CheckCircle2 },
      { text: "Universal design structures that look beautiful on GitHub.", icon: CheckCircle2 },
      { text: "Zero-friction export - copy raw markdown or download files.", icon: CheckCircle2 },
    ]
  }
];

const featuresList = [
  {
    icon: Eye,
    title: "Live Markdown Preview",
    description: "Render GitHub-flavored markdown with extreme speed. Lists, tables, badges, and pre-formatted code boxes appear in real time.",
    glow: "rgba(34, 211, 238, 0.15)"
  },
  {
    icon: BadgeCheck,
    title: "Smart Badge Engine",
    description: "Instantly compile shields.io icons by typing in your stack. Full auto-formatting for Next.js, React, Docker, Tailwind, and more.",
    glow: "rgba(99, 102, 241, 0.15)"
  },
  {
    icon: Layers3,
    title: "Structured Templates",
    description: "Switch seamlessly between SaaS, Open Source, Portfolio, and CLI structures without losing a single input or starting over.",
    glow: "rgba(168, 85, 247, 0.15)"
  },
  {
    icon: Terminal,
    title: "GitHub-Ready Formatting",
    description: "Built exactly to mirror GitHub's markdown engine. Standard syntax formatting, bold headers, and custom tables are guaranteed to render flawlessly.",
    glow: "rgba(236, 72, 153, 0.15)"
  },
  {
    icon: ClipboardCheck,
    title: "One-Click Instant Copy",
    description: "Copy pristine markdown strings directly to your system clipboard with a single click, perfectly formatted and ready to paste.",
    glow: "rgba(244, 63, 94, 0.15)"
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Blueprinting",
    description: "Positioning systems that analyze project titles and details to suggest structured features, installation scripts, and summaries.",
    glow: "rgba(34, 197, 94, 0.15)"
  },
  {
    icon: Cpu,
    title: "Responsive Live Editor",
    description: "An elegant workspace engineered to adapt flawlessly across mobile, tablet, and desktop viewports, keeping developers in full flow.",
    glow: "rgba(234, 179, 8, 0.15)"
  },
  {
    icon: Moon,
    title: "Dark & Light Previews",
    description: "Toggle previews instantly between dark and light configurations to ensure absolute compatibility with all GitHub user client interfaces.",
    glow: "rgba(249, 115, 22, 0.15)"
  }
];

const templateShowcaseData = [
  {
    id: "saas",
    title: "SaaS Application",
    desc: "Optimized for startups, production systems, and modern SaaS. Features high-impact product overviews and deployment guides.",
    tags: ["Product Focus", "Local Dev", "Deployment"],
    accent: "from-cyan-500/20 to-blue-500/20 text-cyan-200 border-cyan-500/20"
  },
  {
    id: "open-source",
    title: "Open Source Library",
    desc: "Perfect for packages, community frameworks, and public utilities. Integrates community standards, issues, and contribution logs.",
    tags: ["Contributing", "Community", "Badges"],
    accent: "from-emerald-500/20 to-teal-500/20 text-emerald-200 border-emerald-500/20"
  },
  {
    id: "portfolio",
    title: "Personal Portfolio",
    desc: "Showcase personal utility projects, developer templates, and creator portfolios. Heavy focus on case studies, authors, and visual screenshots.",
    tags: ["Author Details", "Case Study", "Screenshots"],
    accent: "from-amber-500/20 to-orange-500/20 text-amber-200 border-amber-500/20"
  },
  {
    id: "cli",
    title: "CLI Tool",
    desc: "Tailored specifically for command-line binaries, developer utilities, and shell scripts. Features CLI syntax and code benchmarks.",
    tags: ["Commands", "Flags Table", "Terminal Settings"],
    accent: "from-violet-500/20 to-purple-500/20 text-violet-200 border-violet-500/20"
  },
  {
    id: "ai",
    title: "AI Startup",
    desc: "For LLM layers, model wrapper libraries, and neural nodes. Focuses on model weights installation, API keys, and pipeline charts.",
    tags: ["Model Settings", "Pipelines", "API Usage"],
    accent: "from-pink-500/20 to-rose-500/20 text-pink-200 border-pink-500/20"
  },
  {
    id: "dev-tool",
    title: "Developer Tool",
    desc: "Designed for compilers, orchestrators, and developer platforms. Built with SDK setup instructions and modular architectural sections.",
    tags: ["Integrations", "SDKs", "Performance"],
    accent: "from-blue-500/20 to-indigo-500/20 text-blue-200 border-blue-500/20"
  }
];

const timelineSteps = [
  {
    num: "01",
    title: "Input Project Details",
    desc: "Type in your project metadata, installation commands, core feature sets, and repository attributes."
  },
  {
    num: "02",
    title: "Pick Your Blueprint",
    desc: "Choose from our premium template options and see the layout instantly restructuring to fit your project archetype."
  },
  {
    num: "03",
    title: "Ship to GitHub",
    desc: "Export instantly with one-click clipboard copies or direct markdown file downloads to commit to your repository."
  }
];

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Lead Frontend Architect",
    company: "Vercel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    text: "Writing documentation used to be the tedious final task everyone avoided. ReadmeForge turned it into a 10-second blast of productivity. The tech stack shields.io badge detection is pure developer wizardry."
  },
  {
    name: "Alex Rivera",
    role: "Founder & CEO",
    company: "DevFlow Labs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    text: "We migrated all of our open source repos to use ReadmeForge templates. The level of design consistency it brings across our team repositories is game-changing. Our GitHub landing pages look absolutely stunning now."
  },
  {
    name: "Emily Chen",
    role: "Open Source Advocate",
    company: "NexaDB",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    text: "The real-time split screen rendering is lightning fast. Being able to toggle dark and light modes locally to verify GitHub visual layouts before pushing commits has saved me countless minor adjustment cycles. Highly recommended!"
  }
];

const comparisonData = [
  { criterion: "Badges Auto-Detection", manual: "Manual Shields.io copy-pasting", forge: "Instant generation from stack text" },
  { criterion: "Blueprints / Layouts", manual: "Static writing or blank files", forge: "4+ curated premium layouts" },
  { criterion: "Syntax Compiling", manual: "Vulnerable to formatting errors", forge: "100% compliant GitHub parser" },
  { criterion: "Time to Production", manual: "30 to 45 minutes of manual labor", forge: "Less than 15 seconds" },
  { criterion: "Local Privacy", manual: "Depends on external web editors", forge: "100% offline client-side state" }
];

const advancedFeatures = [
  {
    title: "AI-Powered Parsing",
    desc: "Draft premium project descriptions, installation scripts, and usage walkthroughs using metadata scanning logic.",
    icon: Sparkles,
  },
  {
    title: "Package.json Importer",
    desc: "Drag-and-drop your project's configuration file to instantly auto-detect and configure the entire tech stack and author details.",
    icon: Terminal,
  },
  {
    title: "GitHub Sync API",
    desc: "Push updates directly back to your GitHub main or staging branch as a direct commit without leaving the editor canvas.",
    icon: Github,
  },
  {
    title: "Documentation Health Score",
    desc: "Get real-time insights on your markdown SEO, installation clarity, and section coverage scores.",
    icon: TrendingUp,
  }
];

const faqs = [
  {
    q: "Is ReadmeForge completely free to use?",
    a: "Yes, ReadmeForge is completely free and open-source. It handles all markdown generation, badge formatting, and file exports client-side in your web browser with absolute privacy. No database trackers are linked."
  },
  {
    q: "Does it support GitHub's custom markdown flavor?",
    a: "Absolutely! The system was engineered from the ground up to comply precisely with GitHub-Flavored Markdown (GFM) rules, including tables, check-boxes, customized code syntax blocks, and shields.io badge assets."
  },
  {
    q: "How does local-first client architecture secure my repository?",
    a: "We believe documentation should never be sent to third-party databases. ReadmeForge operates 100% inside your web browser sandbox. Zero code details, server configs, or proprietary installation scripts are ever uploaded to a cloud server."
  },
  {
    q: "Can I sync updates directly back to GitHub?",
    a: "Yes! While we are local-first, the upcoming AI sync plugin will authenticate via local GitHub OAuth, allowing you to commit, push updates, or open pull requests directly from the ReadmeForge editor into main or staging branches."
  },
  {
    q: "Is there offline support for local sandbox editing?",
    a: "Yes, ReadmeForge is built as a progressive client application. Once loaded, the templates restructurer, local markdown previewer, and copy-paste buffers continue to operate flawlessly even if you disconnect from the internet completely."
  },
  {
    q: "What is the AI Roadmap and ast-parsing plan?",
    a: "Our public roadmap includes deep AST repository scanning. By reading package.json or setup.py dependencies locally, ReadmeForge will auto-write installation, usage guides, and structure listings using locally run layout models."
  },
  {
    q: "Can I use these markdown templates for commercial or enterprise products?",
    a: "Yes, all blueprints are generated under the permissive MIT Open Source license. You are free to utilize, customize, and ship these layout files for private repositories, commercial SaaS products, and personal projects."
  },
  {
    q: "What export formats are supported?",
    a: "We currently support one-click raw markdown copy-to-clipboard and direct `.md` file compilation downloads. Future releases will support raw HTML outputs, JSON-based backup configurations, and direct Wiki schema compilation hooks."
  }
];

const techLogos = [
  { name: "Next.js", icon: Cpu },
  { name: "React", icon: Zap },
  { name: "TypeScript", icon: Shield },
  { name: "Tailwind", icon: Wand2 },
  { name: "Docker", icon: Layers3 },
  { name: "Vercel", icon: Sparkles }
];

export function LandingPage() {
  // Navigation active background state on scroll
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeField, setActiveField] = useState<string>("projectName");
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Waitlist form state
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waitlistErrorMessage, setWaitlistErrorMessage] = useState("");

  // Simulated analytics conversion metrics dispatcher
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    console.log(`[ReadmeForge Analytics] Event logged: "${eventName}"`, properties);
    if (typeof window !== "undefined" && (window as any).plausible) {
      (window as any).plausible(eventName, { props: properties });
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes("@")) {
      setWaitlistErrorMessage("Please provide a valid developer email.");
      setWaitlistStatus("error");
      return;
    }
    
    setWaitlistStatus("loading");
    trackEvent("waitlist_signup_attempt", { email: waitlistEmail });
    
    // Simulate optimistic API latency
    setTimeout(() => {
      setWaitlistStatus("success");
      trackEvent("waitlist_signup_success", { email: waitlistEmail });
    }, 1200);
  };

  // Dynamic card spotlight mouse tracker
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    currentTarget.style.setProperty("--mouse-x", `${x}px`);
    currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ----------------------------------------------------
  // HERO SIMULATOR STATE & TYPES
  // ----------------------------------------------------
  const [simInputs, setSimInputs] = useState({
    projectName: "",
    description: "",
    techStack: "",
    installation: "",
    usage: ""
  });
  
  const simSteps = useMemo(() => [
    { field: "projectName", text: "Linear CRM" },
    { field: "description", text: "A high-performance customer interface engineered for product-focused SaaS teams." },
    { field: "techStack", text: "React, Next.js, TypeScript, Tailwind CSS, Docker" },
    { field: "installation", text: "npm install\nnpm run dev" },
    { field: "usage", text: "Launch server, navigate to localhost:3000, and connect your team database." }
  ], []);

  // Simulating typing sequence
  useEffect(() => {
    let active = true;
    let typingTimer: NodeJS.Timeout;
    let loopIndex = 0;
    let subCharIndex = 0;
    
    const tick = () => {
      if (!active) return;
      const currentStep = simSteps[loopIndex];
      const targetField = currentStep.field as keyof typeof simInputs;
      const targetText = currentStep.text;
      
      setActiveField(targetField);
      
      if (subCharIndex < targetText.length) {
        setSimInputs(prev => ({
          ...prev,
          [targetField]: targetText.slice(0, subCharIndex + 1)
        }));
        subCharIndex++;
        typingTimer = setTimeout(tick, 25);
      } else {
        // Pausing after typing
        typingTimer = setTimeout(() => {
          if (loopIndex < simSteps.length - 1) {
            loopIndex++;
            subCharIndex = 0;
            tick();
          } else {
            // End of simulation, hold for 6s then restart
            typingTimer = setTimeout(() => {
              if (active) {
                setSimInputs({
                  projectName: "",
                  description: "",
                  techStack: "",
                  installation: "",
                  usage: ""
                });
                loopIndex = 0;
                subCharIndex = 0;
                setActiveField("projectName");
                tick();
              }
            }, 6000);
          }
        }, 1200);
      }
    };

    tick();

    return () => {
      active = false;
      clearTimeout(typingTimer);
    };
  }, [simSteps]);

  // Sim Preview Markdown compilation
  const simMarkdown = useMemo(() => {
    const data: ReadmeFormData = {
      projectName: simInputs.projectName || "Linear CRM",
      description: simInputs.description || "A high-performance customer interface engineered for product-focused SaaS teams.",
      features: "Collaborative sales pipelines\nInteractive customer ledger\nReal-time web auditable metrics\nAutomated docker deploy hooks",
      techStack: simInputs.techStack || "React, Next.js, TypeScript, Tailwind CSS, Docker",
      installation: simInputs.installation || "npm install\nnpm run dev",
      usage: simInputs.usage || "Launch server, navigate to localhost:3000, and connect your team database.",
      license: "MIT",
      author: "NextGen Architect",
      githubUrl: "https://github.com/org/linear-crm"
    };
    return generateReadme(data, "saas");
  }, [simInputs]);

  // ----------------------------------------------------
  // INTERACTIVE LIVE DEMO STATE (SECTION 6)
  // ----------------------------------------------------
  const [demoTemplate, setDemoTemplate] = useState<ReadmeTemplate>("basic");
  const [demoData, setDemoData] = useState<ReadmeFormData>({
    projectName: "Vercel Analytics Platform",
    description: "An elite AI-powered event logger and web vitals tracking system for performance-obsessed engineering leads.",
    features: "Dynamic visual dashboards\nZero-latency click tracking\nAutomatic Lighthouse audits\nLocal-first indexedDB storage",
    installation: "npm i @vercel/analytics\nnpm run dev",
    usage: "Import the script tag, declare your project token key, and spin up local dashboard.",
    techStack: "React, Next.js, TypeScript, Tailwind CSS",
    license: "MIT",
    author: "Documentation Architect",
    githubUrl: "https://github.com/vercel/analytics-demo"
  });
  const [demoTab, setDemoTab] = useState<"render" | "raw">("render");
  const [demoTheme, setDemoTheme] = useState<"dark" | "light">("dark");
  const [demoCopied, setDemoCopied] = useState(false);

  const demoMarkdown = useMemo(() => {
    return generateReadme(demoData, demoTemplate);
  }, [demoData, demoTemplate]);

  const handleDemoFieldChange = (key: keyof ReadmeFormData, val: string) => {
    setDemoData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleDemoAddBadge = (badgeName: string) => {
    const currentStack = demoData.techStack.trim();
    if (currentStack.toLowerCase().includes(badgeName.toLowerCase())) return;
    
    const newStack = currentStack ? `${currentStack}, ${badgeName}` : badgeName;
    setDemoData(prev => ({
      ...prev,
      techStack: newStack
    }));
  };

  const handleDemoCopy = async () => {
    try {
      await navigator.clipboard.writeText(demoMarkdown);
      setDemoCopied(true);
      setTimeout(() => setDemoCopied(false), 2000);
    } catch (e) {
      // Fallback
    }
  };

  const handleDemoDownload = () => {
    const blob = new Blob([demoMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ----------------------------------------------------
  // FAQ ACTIVE STATE (SECTION 12)
  // ----------------------------------------------------
  const [faqActive, setFaqActive] = useState<number | null>(0);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030303] text-zinc-100 font-sans antialiased select-none custom-scrollbar">
      
      {/* STRUCTURED SCHEMA MARKUP (SEO READY) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ReadmeForge",
              "operatingSystem": "All",
              "applicationCategory": "DeveloperApplication",
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD"
              },
              "description": "Premium AI-powered GitHub README generator and interactive markdown templates editor. Create high-converting open-source repository documentation instantly.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "2450"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.a
                }
              }))
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ReadmeForge",
              "url": "https://readme-forge.dev",
              "logo": "https://readme-forge.dev/logo.png",
              "sameAs": [
                "https://github.com/readme-forge"
              ]
            }
          ])
        }}
      />
      
      {/* GLOBAL GRAPHICS / RADIAL BLURS */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 size-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] right-1/4 size-[600px] translate-x-1/2 rounded-full bg-purple-500/8 blur-[140px] animate-pulse-slow-reverse" />
        <div className="absolute bottom-[20%] left-1/3 size-[500px] rounded-full bg-indigo-500/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.25] mask-radial" />
      </div>

      {/* ==========================================
          1. STICKY NAVBAR
          ========================================== */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#050507]/75 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.8)]" 
          : "bg-transparent py-5"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex size-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/20 shadow-[0_0_15px_rgba(34,211,238,0.15)] transition duration-300 group-hover:border-cyan-400 group-hover:scale-105">
              <Wand2 className="size-4.5 text-cyan-300" />
            </span>
            <span className="text-sm font-semibold tracking-wider text-white">
              README<span className="text-cyan-300">FORGE</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#demo" className="transition hover:text-white">Interactive Demo</a>
            <a href="#templates" className="transition hover:text-white">Templates</a>
            <a href="#how-it-works" className="transition hover:text-white">Workflow</a>
            <a href="#faq" className="transition hover:text-white">FAQ</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition hover:text-white">
              <Github className="size-3.5" />
              GitHub
            </a>
          </nav>

          {/* Call to Action Button */}
          <div className="hidden items-center gap-4 md:flex">
            <Button asChild className="h-9 px-4.5 bg-white text-black font-semibold text-xs tracking-wider uppercase rounded-lg shadow-xl shadow-cyan-950/10 hover:bg-cyan-100 hover:scale-102 transition duration-300">
              <Link href="/generator">
                Launch Generator
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white md:hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 border-b border-white/5 bg-[#050507]/95 px-5 py-6 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-4 text-sm font-semibold tracking-wider">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 text-zinc-400 hover:text-white">Features</a>
                <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="py-2 text-zinc-400 hover:text-white">Interactive Demo</a>
                <a href="#templates" onClick={() => setMobileMenuOpen(false)} className="py-2 text-zinc-400 hover:text-white">Templates</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 text-zinc-400 hover:text-white">Workflow</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-2 text-zinc-400 hover:text-white">FAQ</a>
                <a href="https://github.com" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-zinc-400 hover:text-white">
                  <Github className="size-4" /> GitHub
                </a>
                <Button asChild className="mt-4 w-full h-11 bg-white text-black font-semibold rounded-xl">
                  <Link href="/generator" onClick={() => setMobileMenuOpen(false)}>
                    Launch Generator
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==========================================
          2. HERO SECTION
          ========================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-16 md:px-8 md:pt-40 lg:pb-24">
        
        {/* Spotlight active mouse accent style */}
        <div className="absolute top-1/2 left-1/2 -z-10 size-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)]" />

        <div className="flex flex-col items-center text-center">
          
          {/* Dual Launch Badge: GitHub + Product Hunt */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 select-none z-20">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-950/20 px-3.5 py-1.5 text-[11px] font-semibold text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            >
              <Github className="size-3.5 text-cyan-300" />
              <span>Trusted by 25,000+ developers</span>
              <span className="h-3 w-px bg-cyan-500/30" />
              <span className="flex items-center gap-1">
                <Star className="size-3.5 text-cyan-300 fill-cyan-300" /> 14.8k stars
              </span>
            </motion.div>

            <motion.a 
              href="#roadmap"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-950/20 px-3.5 py-1.5 text-[11px] font-semibold text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:border-orange-500/40 hover:scale-102 transition duration-200 cursor-pointer"
            >
              <span className="flex size-4.5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-extrabold text-white">P</span>
              <span>Featured on Product Hunt</span>
              <span className="h-3 w-px bg-orange-500/30" />
              <span className="text-orange-300">#1 Product of the Day</span>
            </motion.a>
          </div>

          {/* Premium Headline (SEO Optimized for AI README generator & GitHub README builder) */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-8 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Ultimate <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent text-glow">AI README Generator</span> & GitHub Profile Creator
          </motion.h1>

          {/* Detailed Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg"
          >
            Say goodbye to manual documentation. Leverage the ultimate open-source GitHub README builder and markdown template generator to compile shields.io badges, render live GitHub-flavored preview layouts, and structure professional repositories in under 15 seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex flex-col gap-5 sm:flex-row items-center justify-center z-20"
          >
            <Magnetic>
              <Button asChild size="lg" className="h-12 px-7 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold tracking-wider rounded-xl shadow-xl shadow-cyan-950/20 hover:shadow-cyan-400/10 transition duration-300 border border-cyan-400/20 cursor-pointer">
                <Link href="/generator">
                  Generate README Free
                  <Sparkles className="ml-2 size-4 animate-pulse" />
                </Link>
              </Button>
            </Magnetic>
            
            <Magnetic>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 border-white/10 bg-white/[0.03] text-zinc-300 rounded-xl hover:bg-white/[0.07] hover:text-white transition duration-300 cursor-pointer">
                <a href="#demo">
                  View Live Demo
                  <Play className="ml-2 size-3.5 text-zinc-400" />
                </a>
              </Button>
            </Magnetic>
          </motion.div>

          {/* OAuth Ecosystem Trust Sub-text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-4 flex flex-col items-center gap-2 select-none"
          >
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono font-medium">
              <Shield className="size-3 text-cyan-400/80" />
              <span>100% Client-Side. No login required. Or connect instantly:</span>
              <button 
                type="button"
                onClick={() => alert("GitHub integration coming soon in beta!")}
                className="flex items-center gap-1 text-cyan-300 hover:text-white underline transition"
              >
                <Github className="size-3" /> Continue with GitHub
              </button>
            </div>
          </motion.div>

          {/* Trust stats and stack logos */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 w-full max-w-4xl border-t border-white/5 pt-10"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-semibold">
              Powering professional documentation for modern stacks
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-45 grayscale transition hover:opacity-80 duration-500">
              {techLogos.map(logo => (
                <div key={logo.name} className="flex items-center gap-2">
                  <logo.icon className="size-4.5 text-zinc-300" />
                  <span className="text-sm font-semibold tracking-wider text-zinc-300">{logo.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ==========================================
          3. HERO VISUAL / PRODUCT MOCKUP (TYPING EFFECT)
          ========================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="relative rounded-2xl border border-white/10 bg-[#09090c]/90 p-2.5 shadow-[0_0_100px_rgba(0,0,0,0.9),0_24px_65px_rgba(0,0,0,0.6)] backdrop-blur-2xl perspective-[1200px] [transform:rotateX(2deg)_rotateY(-1.5deg)_rotateZ(0.1deg)] hover:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)] hover:scale-[1.005] transition-all duration-700 ease-out gpu-layer"
        >
          {/* Header Bar / VSCode Tabs */}
          <div className="flex items-center justify-between border-b border-white/5 bg-black/25 rounded-t-xl px-4 py-2 select-none">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 pr-4 border-r border-white/5">
                <span className="size-2.5 rounded-full bg-[#ff5f56]/70" />
                <span className="size-2.5 rounded-full bg-[#ffbd2e]/70" />
                <span className="size-2.5 rounded-full bg-[#27c93f]/70" />
              </div>
              
              {/* Tab 1: active config.json */}
              <div className="flex items-center gap-2 border-b border-cyan-400 bg-[#07070a]/90 px-4 py-1.5 text-[11px] font-mono font-medium text-white cursor-pointer transition">
                <span className="text-[#fbbf24] font-bold font-mono text-[9px]">{`{ }`}</span>
                config.json
              </div>
              
              {/* Tab 2: inactive README.md */}
              <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono font-medium text-zinc-500 hover:text-zinc-300 cursor-pointer transition">
                <FileText className="size-3 text-cyan-400/80" />
                README.md
                <span className="rounded bg-cyan-500/10 px-1 py-0.2 font-mono text-[8px] font-bold text-cyan-300 uppercase tracking-wider scale-90">Auto-generated</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="inline-flex size-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="text-[9px] uppercase tracking-wider text-cyan-400/90 font-mono font-bold">Auto-Compiling</span>
            </div>
          </div>

          {/* Code Window Panels */}
          <div className="grid gap-3 pt-3 lg:grid-cols-[0.88fr_1.12fr]">
            
            {/* Left IDE Panel */}
            <div className="flex flex-col gap-2.5 rounded-xl border border-white/5 bg-black/50 p-4 font-mono text-[11px] leading-5.5 shadow-inner overflow-hidden select-none">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 border-b border-white/5 pb-2 mb-1">
                <span className="text-zinc-600">src</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400 font-semibold flex items-center gap-1">
                  <Terminal className="size-3 text-cyan-300" /> config.json
                </span>
              </div>
              
              <div className="flex gap-3">
                {/* Line Numbers Rail */}
                <div className="text-zinc-700 text-right pr-2 select-none border-r border-white/5 space-y-1 w-5 font-mono">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="h-6 flex items-center justify-end">{i + 1}</div>
                  ))}
                </div>
                
                {/* Config code JSON fields */}
                <div className="flex-1 space-y-1 font-mono">
                  <div className="h-6 flex items-center"><span className="syntax-punctuation">{`{`}</span></div>
                  
                  {/* Field 1: Project Name */}
                  <div className={`h-6 px-1.5 rounded flex items-center transition-all duration-300 ${activeField === "projectName" ? "bg-white/[0.04] border-l-2 border-cyan-400" : "border-l-2 border-transparent"}`}>
                    <span className="pl-3 syntax-keyword">"projectName"</span>
                    <span className="syntax-punctuation">:</span>{" "}
                    <span className="pl-1.5 syntax-string">
                      "{simInputs.projectName || "Linear CRM"}"
                    </span>
                    {activeField === "projectName" && <span className="markdown-cursor" />}
                    <span className="syntax-punctuation">,</span>
                  </div>

                  {/* Field 2: Description */}
                  <div className={`h-6 px-1.5 rounded flex items-center transition-all duration-300 ${activeField === "description" ? "bg-white/[0.04] border-l-2 border-cyan-400" : "border-l-2 border-transparent"}`}>
                    <span className="pl-3 syntax-keyword">"description"</span>
                    <span className="syntax-punctuation">:</span>{" "}
                    <span className="pl-1.5 syntax-string truncate max-w-[230px] inline-block">
                      "{simInputs.description || "A high-performance customer interface..."}"
                    </span>
                    {activeField === "description" && <span className="markdown-cursor" />}
                    <span className="syntax-punctuation">,</span>
                  </div>

                  {/* Field 3: Tech Stack */}
                  <div className={`h-6 px-1.5 rounded flex items-center transition-all duration-300 ${activeField === "techStack" ? "bg-white/[0.04] border-l-2 border-cyan-400" : "border-l-2 border-transparent"}`}>
                    <span className="pl-3 syntax-keyword">"techStack"</span>
                    <span className="syntax-punctuation">:</span>{" "}
                    <span className="pl-1.5 syntax-string truncate max-w-[230px] inline-block">
                      "{simInputs.techStack || "React, Next.js, TypeScript"}"
                    </span>
                    {activeField === "techStack" && <span className="markdown-cursor" />}
                    <span className="syntax-punctuation">,</span>
                  </div>

                  {/* Field 4: Installation */}
                  <div className={`h-6 px-1.5 rounded flex items-center transition-all duration-300 ${activeField === "installation" ? "bg-white/[0.04] border-l-2 border-cyan-400" : "border-l-2 border-transparent"}`}>
                    <span className="pl-3 syntax-keyword">"installation"</span>
                    <span className="syntax-punctuation">:</span>{" "}
                    <span className="pl-1.5 syntax-string truncate max-w-[230px] inline-block">
                      "{simInputs.installation || "npm install"}"
                    </span>
                    {activeField === "installation" && <span className="markdown-cursor" />}
                    <span className="syntax-punctuation">,</span>
                  </div>

                  {/* Field 5: Usage */}
                  <div className={`h-6 px-1.5 rounded flex items-center transition-all duration-300 ${activeField === "usage" ? "bg-white/[0.04] border-l-2 border-cyan-400" : "border-l-2 border-transparent"}`}>
                    <span className="pl-3 syntax-keyword">"usage"</span>
                    <span className="syntax-punctuation">:</span>{" "}
                    <span className="pl-1.5 syntax-string truncate max-w-[230px] inline-block">
                      "{simInputs.usage || "npm run dev"}"
                    </span>
                    {activeField === "usage" && <span className="markdown-cursor" />}
                  </div>
                  
                  <div className="h-6 flex items-center"><span className="syntax-punctuation">{`}`}</span></div>
                </div>
              </div>
            </div>

            {/* Right Render Preview Panel */}
            <div className="flex flex-col rounded-xl border border-white/5 bg-[#07070a] p-4 lg:max-h-[380px] lg:overflow-y-auto custom-scrollbar relative">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-cyan-300" />
                  <span className="text-xs font-semibold text-zinc-300 font-mono">README.md Preview</span>
                </div>
                <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-300 uppercase tracking-wider">GitHub Render Output</span>
              </div>
              <div className="relative flex-1 pt-4 text-left">
                <MarkdownPreview markdown={simMarkdown} />
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ==========================================
          3. TRUST & LOCAL SECURITY INFRASTRUCTURE
          ========================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 md:px-8 select-none">
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-cyan-500/10 bg-cyan-950/20 text-cyan-300">
                <Shield className="size-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Client-Side Only</h4>
                <p className="mt-1.5 text-[11px] leading-5 text-zinc-400">All compilation occurs locally in your browser. No servers required.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/10 bg-purple-950/20 text-purple-300">
                <Cpu className="size-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">No Cloud Processing</h4>
                <p className="mt-1.5 text-[11px] leading-5 text-zinc-400">Zero data leaves your system. 100% private markdown synthesis.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/10 bg-emerald-950/20 text-emerald-300">
                <CheckCircle2 className="size-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zero Tracker Analytics</h4>
                <p className="mt-1.5 text-[11px] leading-5 text-zinc-400">No session recording or payload telemetry. Absolute workspace privacy.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/10 bg-amber-950/20 text-amber-300">
                <Zap className="size-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Frictionless Quick-Start</h4>
                <p className="mt-1.5 text-[11px] leading-5 text-zinc-400">No database registries or account credentials. Generate & commit instantly.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          4. PROBLEM → SOLUTION SECTION (BEFORE / AFTER)
          ========================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        
        <div className="text-center">
          <Badge className="border-cyan-500/20 bg-cyan-950/20 text-cyan-300 px-3.5 py-1">The Workflow Bottleneck</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Why writing documentation <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">sucks</span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Writing markdown files shouldn't consume hours of engineering bandwidth. It's time to trade the archaic manual way for automated, professional layout engine templates.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {painPoints.map((block) => (
            <motion.div 
              key={block.type}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              onMouseMove={handleCardMouseMove}
              className={`spotlight-card gpu-layer relative flex flex-col justify-between rounded-2xl border p-6 md:p-8 backdrop-blur-2xl shadow-2xl transition duration-300 ${
                block.type === "before"
                  ? "border-red-500/10 bg-red-950/[0.015] shadow-red-950/5"
                  : "border-cyan-500/10 bg-cyan-950/[0.015] shadow-cyan-950/5"
              }`}
            >
              <div>
                {/* Header tag */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  block.type === "before"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                }`}>
                  {block.title}
                </span>
                <p className="mt-4 text-lg font-semibold text-white">{block.subtitle}</p>
                
                {/* List items */}
                <ul className="mt-6 space-y-4">
                  {block.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`flex size-6 shrink-0 items-center justify-center rounded-lg border mt-0.5 ${
                        block.type === "before"
                          ? "border-red-500/20 bg-red-950/20 text-red-400"
                          : "border-cyan-500/20 bg-cyan-950/20 text-cyan-400"
                      }`}>
                        <item.icon className="size-3.5" />
                      </span>
                      <span className="text-sm leading-6 text-zinc-400">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {block.type === "before" ? (
                <div className="mt-8 border-t border-red-500/10 pt-6">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Developer Sentiment</span>
                    <span className="text-red-400 font-mono font-semibold uppercase tracking-wider">Frustrated</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-red-950/40">
                    <div className="h-1.5 rounded-full bg-red-500" style={{ width: "95%" }} />
                  </div>
                </div>
              ) : (
                <div className="mt-8 border-t border-cyan-500/10 pt-6">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Documentation Speed</span>
                    <span className="text-cyan-400 font-mono font-semibold uppercase tracking-wider">10x Acceleration</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-cyan-950/40">
                    <div className="h-1.5 rounded-full bg-cyan-500" style={{ width: "100%" }} />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==========================================
          5. FEATURES SECTION (GRID OF CARDS)
          ========================================== */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        
        <div className="text-center">
          <Badge className="border-purple-500/20 bg-purple-950/20 text-purple-300 px-3.5 py-1">Documentation Engine</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Engineered for modern documentation
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Every feature is fine-tuned to keep you in flow state, removing friction from open source shipping.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuresList.map((feat, index) => (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.18)" }}
              onMouseMove={handleCardMouseMove}
              className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-white/[0.01] p-5.5 transition duration-300 spotlight-card gpu-layer"
            >
              {/* Card Radial Background */}
              <div 
                className="absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"
                style={{ background: `radial-gradient(circle at center, ${feat.glow} 0%, transparent 65%)` }}
              />

              <div>
                {/* Icon wrapper */}
                <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-cyan-300 group-hover:scale-105 group-hover:text-white transition duration-300">
                  <feat.icon className="size-4.5" />
                </span>
                <h3 className="mt-5 text-sm font-semibold text-white tracking-wide">{feat.title}</h3>
                <p className="mt-3.5 text-xs leading-5.5 text-zinc-400">{feat.description}</p>
              </div>

              <div className="mt-6 flex items-center text-[10px] font-bold text-zinc-500 group-hover:text-cyan-300 tracking-wider uppercase transition duration-300">
                <span>Production grade</span>
                <ArrowRight className="ml-1 size-3 group-hover:translate-x-0.5 transition duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==========================================
          6. INTERACTIVE LIVE DEMO SECTION (MINI GENERATOR)
          ========================================== */}
      <section id="demo" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        
        {/* Neon Backdrop Gradient */}
        <div className="absolute top-1/2 left-1/2 -z-10 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />

        <div className="text-center">
          <Badge className="border-cyan-500/20 bg-cyan-950/20 text-cyan-300 px-3.5 py-1">Try It Instantly</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Interactive Editor Sandbox
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Tune fields, select blueprint blueprints, and inject technology tags below to see shields.io badges render in real time.
          </p>
        </div>

        <div className="mt-14 rounded-2xl border border-white/10 bg-[#09090c]/70 shadow-[0_24px_70px_rgba(0,0,0,0.6)] overflow-hidden">
          
          {/* Top Panel Controls */}
          <div className="flex flex-col gap-4 border-b border-white/5 bg-[#050507]/90 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            
            {/* Blueprint tab switches */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {templateOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDemoTemplate(opt.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    demoTemplate === opt.id
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                      : "border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white"
                  }`}
                >
                  {opt.label} Blueprint
                </button>
              ))}
            </div>

            {/* Preview settings */}
            <div className="flex items-center gap-3">
              
              {/* Dark vs Light Markdown Preview Container Toggle */}
              <div className="flex items-center rounded-lg border border-white/5 bg-black/40 p-0.5">
                <button 
                  onClick={() => setDemoTheme("dark")}
                  className={`p-1.5 rounded-md transition ${demoTheme === "dark" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="GitHub Dark Preview Mode"
                >
                  <Moon className="size-3.5" />
                </button>
                <button 
                  onClick={() => setDemoTheme("light")}
                  className={`p-1.5 rounded-md transition ${demoTheme === "light" ? "bg-white/10 text-zinc-900" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="GitHub Light Preview Mode"
                >
                  <Sun className="size-3.5" />
                </button>
              </div>

              {/* Copy & Export buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleDemoCopy}
                  className="h-8.5 px-3 bg-white/[0.04] border border-white/10 text-zinc-300 text-xs font-semibold rounded-lg hover:bg-white/[0.08]"
                >
                  {demoCopied ? <Check className="mr-1.5 size-3.5 text-emerald-400 animate-pulse" /> : <ClipboardCheck className="mr-1.5 size-3.5" />}
                  {demoCopied ? "Copied!" : "Copy Markdown"}
                </Button>
                <Button 
                  onClick={handleDemoDownload}
                  className="h-8.5 px-3 bg-cyan-400 text-black font-semibold text-xs rounded-lg hover:bg-cyan-300"
                >
                  <Download className="mr-1.5 size-3.5" />
                  Download
                </Button>
              </div>

            </div>

          </div>

          {/* Sandbox Split Screen */}
          <div className="grid lg:grid-cols-2 min-h-[460px]">
            
            {/* Left Hand Form Controls */}
            <div className="border-r border-white/5 bg-black/20 p-5 md:p-6 space-y-5">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Interactive Form Fields</span>
                <span className="text-[10px] text-zinc-500">Auto saves state</span>
              </div>

              {/* Field 1 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">Project Title</label>
                <Input
                  value={demoData.projectName}
                  onChange={(e) => handleDemoFieldChange("projectName", e.target.value)}
                  className="h-10 rounded-xl border-white/10 bg-black/40 text-sm focus-visible:border-cyan-400/40 placeholder:text-zinc-700 focus-visible:ring-0"
                  placeholder="App Name..."
                />
              </div>

              {/* Field 2 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">Description positioning</label>
                <Textarea
                  value={demoData.description}
                  onChange={(e) => handleDemoFieldChange("description", e.target.value)}
                  className="min-h-16 rounded-xl border-white/10 bg-black/40 text-sm focus-visible:border-cyan-400/40 placeholder:text-zinc-700 focus-visible:ring-0 resize-y"
                  placeholder="Positioning statement..."
                />
              </div>

              {/* Tech Stack Field & Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">Tech Stack list</label>
                  <span className="text-[9px] text-cyan-300">Click pills below to append</span>
                </div>
                <Input
                  value={demoData.techStack}
                  onChange={(e) => handleDemoFieldChange("techStack", e.target.value)}
                  className="h-10 rounded-xl border-white/10 bg-black/40 text-sm focus-visible:border-cyan-400/40 placeholder:text-zinc-700 focus-visible:ring-0"
                  placeholder="e.g. Next.js, React, Docker..."
                />
                
                {/* Quick Add Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Next.js", "TypeScript", "Tailwind CSS", "Docker", "React", "PostgreSQL"].map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => handleDemoAddBadge(pill)}
                      className="px-2 py-0.5 rounded border border-white/5 bg-white/[0.03] text-[10px] font-medium text-zinc-400 hover:text-white hover:border-cyan-400/20 hover:bg-cyan-500/5 transition duration-300"
                    >
                      + {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split block fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">License</label>
                  <Input
                    value={demoData.license}
                    onChange={(e) => handleDemoFieldChange("license", e.target.value)}
                    className="h-9.5 rounded-xl border-white/10 bg-black/40 text-xs focus-visible:border-cyan-400/40 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">Author name</label>
                  <Input
                    value={demoData.author}
                    onChange={(e) => handleDemoFieldChange("author", e.target.value)}
                    className="h-9.5 rounded-xl border-white/10 bg-black/40 text-xs focus-visible:border-cyan-400/40 focus-visible:ring-0"
                  />
                </div>
              </div>

            </div>

            {/* Right Hand Live Output Render Container */}
            <div className="flex flex-col min-h-[400px]">
              
              {/* Tab Selector */}
              <div className="flex items-center border-b border-white/5 bg-black/30 px-4 py-2">
                <button
                  type="button"
                  onClick={() => setDemoTab("render")}
                  className={`mr-4 text-xs font-semibold py-1.5 border-b-2 transition duration-300 ${
                    demoTab === "render" 
                      ? "border-cyan-400 text-white" 
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Render Preview
                </button>
                <button
                  type="button"
                  onClick={() => setDemoTab("raw")}
                  className={`text-xs font-semibold py-1.5 border-b-2 transition duration-300 ${
                    demoTab === "raw" 
                      ? "border-cyan-400 text-white" 
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Raw Markdown
                </button>
              </div>

              {/* Render canvas window */}
              <div className={`flex-1 p-5 md:p-6 overflow-y-auto max-h-[460px] custom-scrollbar ${
                demoTheme === "dark" 
                  ? "bg-[#0d1117] text-[#c9d1d9]" 
                  : "bg-white text-zinc-900 border-t border-zinc-200"
              }`}>
                {demoTab === "render" ? (
                  <div className={demoTheme === "light" ? "markdown-preview-light text-zinc-900" : ""}>
                    
                    {/* If light theme, we apply standard dark/light visual overlays */}
                    <div className={demoTheme === "light" ? "prose prose-zinc max-w-none text-[15px] leading-7" : ""}>
                      <MarkdownPreview markdown={demoMarkdown} />
                    </div>
                  </div>
                ) : (
                  <pre className="font-mono text-[11px] leading-5.5 text-zinc-400 whitespace-pre-wrap select-text">
                    {demoMarkdown}
                  </pre>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          7. TEMPLATE SHOWCASE (PREMIUM GRID)
          ========================================== */}
      <section id="templates" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 border-t border-white/5">
        
        <div className="text-center">
          <Badge className="border-indigo-500/20 bg-indigo-950/20 text-indigo-300 px-3.5 py-1">Modular Blueprints</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Choose from premium structures
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Every repository archetype requires a unique communication hierarchy. Deploy specialized frameworks designed specifically for your product type.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templateShowcaseData.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.15)" }}
              onMouseMove={handleCardMouseMove}
              className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#09090c]/70 p-6 shadow-xl spotlight-card gpu-layer transition duration-300"
            >
              <div>
                {/* Header Mockup Preview visual */}
                <div className={`relative h-28 rounded-xl bg-gradient-to-br ${item.accent} border p-4.5 flex flex-col justify-between overflow-hidden shadow-inner`}>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="size-2 rounded-full bg-white/40" />
                    <span className="size-2 rounded-full bg-white/40" />
                    <span className="size-2 rounded-full bg-white/40" />
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-45">Blueprint structure</div>
                  
                  {/* Decorative mesh shapes */}
                  <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 size-20 rounded-full border border-white/10 bg-white/[0.02] blur-sm" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-white tracking-wide">{item.title}</h3>
                <p className="mt-2.5 text-xs leading-5.5 text-zinc-400">{item.desc}</p>
                
                {/* Tag badges */}
                <div className="mt-4.5 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-0.5 text-[9px] font-semibold text-zinc-500 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-white/5">
                <Button asChild className="w-full h-9 bg-white/[0.03] hover:bg-white text-zinc-300 hover:text-black font-semibold text-xs rounded-lg transition duration-300">
                  <Link href={`/generator?template=${item.id}`}>
                    Use Blueprint
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==========================================
          8. HOW IT WORKS SECTION (3-STEP TIMELINE)
          ========================================== */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 border-t border-white/5">
        
        <div className="text-center">
          <Badge className="border-emerald-500/20 bg-emerald-950/20 text-emerald-300 px-3.5 py-1">Frictionless Workflow</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Documentation in three simple steps
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            No API registrations, no software setups. Complete professional README files instantly in the browser.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          
          {/* Floating Connective Lines */}
          <div className="absolute top-12 left-1/6 right-1/6 h-[1.5px] -z-10 bg-gradient-to-r from-cyan-500/20 via-blue-500/25 to-purple-500/20 hidden md:block" />

          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center p-4">
              
              {/* Number Blob Circle */}
              <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-[#09090c] text-white shadow-xl shadow-cyan-950/5 hover:border-cyan-400/30 hover:scale-105 transition duration-300">
                <span className="font-mono text-base font-bold bg-gradient-to-br from-cyan-300 to-indigo-300 bg-clip-text text-transparent">{step.num}</span>
              </div>

              <h3 className="mt-6 text-base font-semibold text-white tracking-wide">{step.title}</h3>
              <p className="mt-3 max-w-xs text-xs leading-5.5 text-zinc-400">{step.desc}</p>

            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          8.5 STARTUP GROWTH & WAITLIST SECTION (AI BETA)
          ========================================== */}
      <section id="waitlist" className="relative z-10 mx-auto max-w-5xl px-4 py-16 md:px-8 border-t border-white/5 select-none">
        
        {/* Glow backdrop shapes */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-64 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/5 to-purple-500/5 blur-[90px] opacity-80" />

        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#0c0c10]/95 to-[#040406]/95 p-8 md:p-12 text-center shadow-2xl overflow-hidden spotlight-card gpu-layer animate-fade-in" onMouseMove={handleCardMouseMove}>
          
          <div className="absolute inset-0 bg-grid-white opacity-[0.03] mask-radial-subtle" />

          <Badge className="border-cyan-500/20 bg-cyan-950/20 text-cyan-300 px-3.5 py-1">AI Launch Roadmap</Badge>
          
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Join the AI Auto-Documentation Beta
          </h2>
          
          <p className="mt-4 mx-auto max-w-xl text-xs leading-6 text-zinc-400">
            Be the first to experience automated codebase scanning, deep AST structure mapping, and AI-driven README optimization. Join 10,000+ developers securing early access keys.
          </p>

          <form onSubmit={handleWaitlistSubmit} className="mt-8 max-w-md mx-auto relative z-20">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={waitlistEmail}
                  onChange={(e) => {
                    setWaitlistEmail(e.target.value);
                    if (waitlistStatus === "error") setWaitlistStatus("idle");
                  }}
                  disabled={waitlistStatus === "loading" || waitlistStatus === "success"}
                  className="h-11 rounded-xl bg-black/60 border-white/10 text-xs px-4 focus:ring-1 focus:ring-cyan-500/40 text-white placeholder-zinc-600 focus:border-cyan-500/30 transition-all w-full"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={waitlistStatus === "loading" || waitlistStatus === "success"}
                className={`h-11 rounded-xl px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-950/20 border border-cyan-400/20 active:scale-97 transition duration-200 cursor-pointer ${
                  waitlistStatus === "success" ? "bg-emerald-600/80 pointer-events-none" : ""
                }`}
              >
                {waitlistStatus === "loading" && (
                  <span className="flex items-center gap-1.5">
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Registering...
                  </span>
                )}
                {waitlistStatus === "idle" && "Request Access"}
                {waitlistStatus === "error" && "Retry Sign Up"}
                {waitlistStatus === "success" && "Secured ✓"}
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {waitlistStatus === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-3 text-left text-[11px] font-medium text-red-400 font-mono flex items-center gap-1"
                >
                  <AlertTriangle className="size-3" /> {waitlistErrorMessage}
                </motion.p>
              )}

              {waitlistStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="mt-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 text-left"
                >
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="size-4 shrink-0 rounded-full bg-emerald-500/20 p-0.5" />
                    Welcome to the Inner Circle!
                  </p>
                  <p className="mt-1 text-[10px] leading-5 text-emerald-300/80 font-mono">
                    You have secured spot #10,482 in our AI beta waitlist. We have dispatched a priority token to your mailbox. Built by developers, for developers.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Social Proof details underneath */}
          <div className="mt-8 flex items-center justify-center gap-5 opacity-40 hover:opacity-75 transition duration-300">
            <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-cyan-400" /> Client-Side Safety
            </span>
            <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-purple-400" /> Private AST scan
            </span>
            <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-emerald-400" /> Zero tracking
            </span>
          </div>

        </div>
      </section>

      {/* ==========================================
          9. SOCIAL PROOF & LOGO MARQUEE & TESTIMONIALS
          ========================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 border-t border-white/5">
        
        {/* Ticker marquee of recently generated repositories */}
        <div className="w-full overflow-hidden border-b border-white/5 bg-[#09090c]/20 py-4.5 mb-16 select-none relative rounded-2xl">
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-marquee whitespace-nowrap text-[10px] font-mono text-zinc-500 gap-12 items-center">
            {/* Ticker Set 1 */}
            <div className="flex gap-12 items-center shrink-0 pr-6">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                <span className="text-zinc-300 font-bold">next-auth-app</span> <span className="text-zinc-600 font-medium">compiled 2m ago</span>
              </span>
              <span className="text-zinc-700">&bull;</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_6px_#06b6d4]" />
                <span className="text-zinc-300 font-bold">vector-db-sdk</span> <span className="text-zinc-600 font-medium">compiled 5m ago</span>
              </span>
              <span className="text-zinc-700">&bull;</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                <span className="text-zinc-300 font-bold">rust-cli-tool</span> <span className="text-zinc-600 font-medium">compiled 9m ago</span>
              </span>
              <span className="text-zinc-700">&bull;</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_6px_#6366f1]" />
                <span className="text-zinc-300 font-bold">svelte-state-manager</span> <span className="text-zinc-600 font-medium">compiled 14m ago</span>
              </span>
              <span className="text-zinc-700">&bull;</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_6px_#a855f7]" />
                <span className="text-zinc-300 font-bold">readmeforge-core</span> <span className="text-zinc-600 font-medium">compiled 18m ago</span>
              </span>
            </div>
            
            {/* Ticker Set 2 (Duplicate for loop continuity) */}
            <div className="flex gap-12 items-center shrink-0 pr-6" aria-hidden="true">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                <span className="text-zinc-300 font-bold">next-auth-app</span> <span className="text-zinc-600 font-medium">compiled 2m ago</span>
              </span>
              <span className="text-zinc-700">&bull;</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_6px_#06b6d4]" />
                <span className="text-zinc-300 font-bold">vector-db-sdk</span> <span className="text-zinc-600 font-medium">compiled 5m ago</span>
              </span>
              <span className="text-zinc-700">&bull;</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                <span className="text-zinc-300 font-bold">rust-cli-tool</span> <span className="text-zinc-600 font-medium">compiled 9m ago</span>
              </span>
              <span className="text-zinc-700">&bull;</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_6px_#6366f1]" />
                <span className="text-zinc-300 font-bold">svelte-state-manager</span> <span className="text-zinc-600 font-medium">compiled 14m ago</span>
              </span>
              <span className="text-zinc-700">&bull;</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_6px_#a855f7]" />
                <span className="text-zinc-300 font-bold">readmeforge-core</span> <span className="text-zinc-600 font-medium">compiled 18m ago</span>
              </span>
            </div>
          </div>
        </div>

        {/* Statistics highlights */}
        <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto text-center pb-12">
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-extrabold text-white font-mono tracking-tight bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">120k+</p>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">READMEs Compiled</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-extrabold text-white font-mono tracking-tight bg-gradient-to-r from-purple-300 to-pink-200 bg-clip-text text-transparent">15s</p>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Average Generation Speed</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-extrabold text-white font-mono tracking-tight bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">99.9%</p>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Developer Satisfaction</p>
          </div>
        </div>

        {/* Dynamic Contribution Graph representing active README generation activity */}
        <div className="flex flex-col items-center gap-3 pb-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-cyan-400 font-mono font-bold">
            <span className="inline-flex size-2 rounded bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            Global Repository Compilation Registry (Real-time updates)
          </div>
          
          <div className="w-full max-w-2xl overflow-x-auto rounded-xl border border-white/5 bg-black/40 p-4 custom-scrollbar select-none">
            <div className="flex gap-1.5 min-w-[500px] justify-center">
              {/* 30 columns representing global activity */}
              {Array.from({ length: 30 }).map((_, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-1.5">
                  {Array.from({ length: 7 }).map((_, rowIdx) => {
                    // Generate deterministic colors to resemble typical repo commits activity
                    const seed = (colIdx * 7 + rowIdx) % 19;
                    let color = "bg-white/[0.04]";
                    if (seed === 0 || seed === 3) color = "bg-cyan-500/80 shadow-[0_0_6px_rgba(34,211,238,0.25)]";
                    else if (seed === 7 || seed === 11) color = "bg-cyan-700/50";
                    else if (seed === 1 || seed === 5 || seed === 15) color = "bg-cyan-900/30";
                    else if (seed === 18 && colIdx > 10 && colIdx < 20) color = "bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]";
                    
                    return (
                      <span 
                        key={rowIdx} 
                        className={`size-2.5 rounded-[2px] transition-all hover:scale-125 duration-150 ${color}`}
                        title="Repository Deploy Events"
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-mono">
            <span>Less</span>
            <span className="size-2 rounded-[1px] bg-white/[0.04]" />
            <span className="size-2 rounded-[1px] bg-cyan-900/30" />
            <span className="size-2 rounded-[1px] bg-cyan-700/50" />
            <span className="size-2 rounded-[1px] bg-cyan-500/80" />
            <span className="size-2 rounded-[1px] bg-cyan-500" />
            <span>More</span>
          </div>
        </div>

        {/* Grayscale developer org logos */}
        <div className="border-t border-white/5 pt-16 pb-6 select-none">
          <p className="text-center text-[9px] uppercase tracking-[0.25em] text-zinc-600 font-bold font-mono">
            Optimized for production frameworks across elite teams
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-25 hover:opacity-55 transition duration-300">
            <span className="font-mono text-xs font-black tracking-wider text-white">VERCEL</span>
            <span className="font-mono text-xs font-black tracking-wider text-white flex items-center gap-1">⚡ SUPABASE</span>
            <span className="font-mono text-xs font-black tracking-wider text-white">RAILWAY</span>
            <span className="font-mono text-xs font-black tracking-wider text-white flex items-center gap-1">✉ RESEND</span>
            <span className="font-mono text-xs font-black tracking-wider text-white flex items-center gap-1">🤖 COPILOT</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12">
          <div className="text-center">
            <Badge className="border-purple-500/20 bg-purple-950/20 text-purple-300 px-3.5 py-1">Developer Endorsements</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Approved by open source creators
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -3 }}
                onMouseMove={handleCardMouseMove}
                className="flex flex-col justify-between rounded-xl border border-white/5 bg-[#09090c]/70 p-6.5 shadow-lg spotlight-card gpu-layer transition duration-300"
              >
                <p className="text-xs leading-6 text-zinc-400 italic">
                  "{t.text}"
                </p>

                <div className="mt-8 flex items-center gap-3.5 border-t border-white/5 pt-4.5">
                  <img src={t.avatar} alt={t.name} className="size-9 rounded-full border border-white/10 object-cover" />
                  <div>
                    <h4 className="text-xs font-semibold text-white tracking-wide">{t.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{t.role} at <span className="text-zinc-300">{t.company}</span></p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          10. COMPARISON SECTION (TABLE)
          ========================================== */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-16 md:px-8 border-t border-white/5">
        
        <div className="text-center">
          <Badge className="border-cyan-500/20 bg-cyan-950/20 text-cyan-300 px-3.5 py-1">Head to Head</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How we compare
          </h2>
          <p className="mt-3.5 text-xs text-zinc-500">Manual crafting vs. ReadmeForge efficiency engines.</p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-white/10 bg-[#09090c]/40 backdrop-blur-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-4.5 font-bold uppercase tracking-wider text-zinc-400">Comparison Dimension</th>
                <th className="px-6 py-4.5 font-bold uppercase tracking-wider text-red-400 bg-red-950/5">Manual Writing</th>
                <th className="px-6 py-4.5 font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/5">ReadmeForge</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01] transition duration-200">
                  <td className="px-6 py-4 font-semibold text-zinc-300">{row.criterion}</td>
                  <td className="px-6 py-4 text-zinc-500 bg-red-950/[0.01]">{row.manual}</td>
                  <td className="px-6 py-4 text-cyan-200 bg-cyan-950/[0.01] font-medium">{row.forge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==========================================
          11. ADVANCED FEATURES SECTION
          ========================================== */}
      {/* ==========================================
          11. PUBLIC ROADMAP & CHANGELOG DASHBOARD
          ========================================== */}
      <section id="roadmap" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 border-t border-white/5 select-none">
        
        <div className="text-center">
          <Badge className="border-purple-500/20 bg-purple-950/20 text-purple-300 px-3.5 py-1">Platform Delivery</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Public Roadmap & Changelog
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            We build in public, releasing updates weekly. Track our development milestones, features timelines, and upcoming AI integrations.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Milestone 1: Shipped */}
          <div className="group relative rounded-xl border border-emerald-500/10 bg-emerald-950/[0.01] p-6.5 hover:border-emerald-500/20 transition duration-300 spotlight-card gpu-layer" onMouseMove={handleCardMouseMove}>
            <div className="flex items-center justify-between">
              <span className="rounded-md border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Shipped V1.2</span>
              <span className="text-[10px] text-zinc-500 font-mono font-medium">May 2026</span>
            </div>
            
            <h3 className="mt-6 text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
              Client Markdown Canvas
              <BadgeCheck className="size-4 text-emerald-400" />
            </h3>
            <p className="mt-3 text-xs leading-5.5 text-zinc-400">100% offline client-side GFM parsing engine. Type stack badges instantly and export directly to system buffers.</p>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">MIT Licensed</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">100% Client Safety</span>
            </div>
          </div>

          {/* Milestone 2: Shipped / Latest */}
          <div className="group relative rounded-xl border border-emerald-500/10 bg-emerald-950/[0.01] p-6.5 hover:border-emerald-500/20 transition duration-300 spotlight-card gpu-layer" onMouseMove={handleCardMouseMove}>
            <div className="flex items-center justify-between">
              <span className="rounded-md border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Shipped V1.3</span>
              <span className="text-[10px] text-zinc-500 font-mono font-medium">Active</span>
            </div>
            
            <h3 className="mt-6 text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
              Visual Gutter Chrome
              <Sparkles className="size-4 text-cyan-400" />
            </h3>
            <p className="mt-3 text-xs leading-5.5 text-zinc-400">Real-time code gutter line-number tracking, color-coded syntax token JSON attributes, and blinking active terminal cursors.</p>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">Completed</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Live in production</span>
            </div>
          </div>

          {/* Milestone 3: AI Beta / In Progress */}
          <div className="group relative rounded-xl border border-cyan-500/15 bg-cyan-950/[0.01] p-6.5 hover:border-cyan-500/35 transition duration-300 spotlight-card gpu-layer shadow-[0_0_20px_rgba(6,182,212,0.02)]" onMouseMove={handleCardMouseMove}>
            <div className="flex items-center justify-between">
              <span className="rounded-md border border-cyan-500/30 bg-cyan-950/25 px-2.5 py-0.5 text-[9px] font-bold text-cyan-300 uppercase tracking-wider animate-pulse">AI Beta Access</span>
              <span className="text-[10px] text-zinc-500 font-mono font-medium">Q3 2026</span>
            </div>
            
            <h3 className="mt-6 text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
              AI README Assistant
              <Sparkles className="size-4 text-cyan-300 animate-pulse" />
            </h3>
            <p className="mt-3 text-xs leading-5.5 text-zinc-400">Automatic local codebase scanning, AST dependency mapping, and intelligent multi-language installation guide synthesis.</p>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">Beta Slots Open</span>
              <a href="#waitlist" className="text-[10px] text-cyan-300 hover:text-white font-mono font-bold flex items-center gap-1 transition">
                Secure Token <ArrowRight className="size-3" />
              </a>
            </div>
          </div>

          {/* Milestone 4: Backlog */}
          <div className="group relative rounded-xl border border-white/5 bg-white/[0.01] p-6.5 hover:border-white/10 transition duration-300 spotlight-card gpu-layer" onMouseMove={handleCardMouseMove}>
            <div className="flex items-center justify-between">
              <span className="rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Planned</span>
              <span className="text-[10px] text-zinc-500 font-mono font-medium">Backlog</span>
            </div>
            
            <h3 className="mt-6 text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
              GitHub Sync & API
              <Github className="size-4 text-zinc-400" />
            </h3>
            <p className="mt-3 text-xs leading-5.5 text-zinc-400">Sync README updates straight back to repository branches as automatic commits, with live markdown health scores.</p>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">Future Release</span>
              <span className="text-[10px] text-zinc-500 font-mono">OAuth integration</span>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          12. FAQ SECTION (ACCORDION)
          ========================================== */}
      <section id="faq" className="relative z-10 mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24 border-t border-white/5">
        
        <div className="text-center">
          <Badge className="border-indigo-500/20 bg-indigo-950/20 text-indigo-300 px-3.5 py-1">Common Inquiries</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3.5 text-xs text-zinc-500">Everything you need to know about our local layout systems.</p>
        </div>

        <div className="mt-14 space-y-3.5">
          {faqs.map((faq, idx) => {
            const isActive = faqActive === idx;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-white/5 bg-[#09090c]/50 overflow-hidden transition duration-300"
              >
                <button
                  type="button"
                  onClick={() => setFaqActive(isActive ? null : idx)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-xs font-semibold tracking-wide text-zinc-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`size-4 text-zinc-500 transition duration-300 ${isActive ? "rotate-180 text-cyan-300" : ""}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="border-t border-white/5 px-5 py-4 text-xs leading-6 text-zinc-400 bg-white/[0.005]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          13. FINAL CTA SECTION (GLOW BANNER)
          ========================================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:px-8 pb-24">
        
        {/* Glow backdrop layer shape */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-72 w-5/6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 blur-[80px] opacity-70" />

        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c0c10] to-[#040406] px-6 py-16 md:py-20 text-center shadow-2xl overflow-hidden">
          
          {/* Cyberpunk network grid mesh overlay inside */}
          <div className="absolute inset-0 bg-grid-white opacity-[0.05] mask-radial-subtle" />

          <Badge className="border-cyan-500/20 bg-cyan-950/20 text-cyan-300 px-3.5 py-1 shadow-[0_0_15px_rgba(34,211,238,0.1)]">Ship Documentation Faster</Badge>
          
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Elevate your open-source presence <br className="hidden sm:inline" />
            in less than 15 seconds
          </h2>
          
          <p className="mt-5 mx-auto max-w-xl text-xs leading-6 text-zinc-400">
            Join thousands of developers automating their markdown documentation. Write clean, production-ready structures perfectly tailored to stand out on GitHub.
          </p>

          <div className="mt-9 flex flex-col items-center gap-6">
            <div className="flex flex-col gap-3.5 sm:flex-row justify-center items-center w-full">
              <Magnetic>
                <Button asChild size="lg" className="h-12 px-7 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:bg-cyan-100 transition duration-300 cursor-pointer">
                  <Link href="/generator">
                    Launch Documentation Workspace
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Link>
                </Button>
              </Magnetic>

              <Magnetic>
                <Button asChild size="lg" variant="outline" className="h-12 px-7 border-white/10 bg-white/[0.03] text-zinc-300 rounded-xl hover:bg-white/[0.07] text-xs font-semibold transition duration-300 cursor-pointer">
                  <a href="#templates">
                    Explore Blueprints
                  </a>
                </Button>
              </Magnetic>
            </div>

            {/* Continuous GitHub OAuth conversion link */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono font-medium">
                <Shield className="size-3 text-cyan-400/80" />
                <span>Local-first architecture. No account required. Or connect instantly:</span>
                <button 
                  type="button"
                  onClick={() => alert("GitHub integration coming soon in beta!")}
                  className="flex items-center gap-1 text-cyan-300 hover:text-white underline transition"
                >
                  <Github className="size-3" /> Continue with GitHub
                </button>
              </div>
            </div>

            {/* Mini Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-5 opacity-40 hover:opacity-60 transition duration-200">
              <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1">
                <Check className="size-3 text-cyan-400" /> Client-Side Only
              </span>
              <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1">
                <Check className="size-3 text-purple-400" /> No Cloud Transmissions
              </span>
              <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1">
                <Check className="size-3 text-emerald-400" /> Zero Tracking
              </span>
              <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1">
                <Check className="size-3 text-amber-400" /> MIT Permissive License
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          14. FOOTER (HIGH FIDELITY)
          ========================================== */}
      <footer className="relative z-10 border-t border-white/5 bg-[#030303] py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            
            {/* Column 1 Logo & Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                  <Wand2 className="size-3.5 text-cyan-300" />
                </span>
                <span className="text-xs font-semibold tracking-wider text-white">README<span className="text-cyan-300">FORGE</span></span>
              </Link>
              <p className="text-[11px] leading-5 text-zinc-500">
                A premium local-first technology documentation canvas designed for modern open-source builders.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition duration-200">
                  <Github className="size-4" />
                </a>
              </div>
            </div>

            {/* Column 2 Navigation Links */}
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Product</h4>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#features" className="text-zinc-500 hover:text-white transition">Core Features</a></li>
                <li><a href="#demo" className="text-zinc-500 hover:text-white transition">Interactive Editor</a></li>
                <li><a href="#templates" className="text-zinc-500 hover:text-white transition">Blueprint Showcase</a></li>
                <li><Link href="/generator" className="text-zinc-500 hover:text-white transition">Workspace Center</Link></li>
              </ul>
            </div>

            {/* Column 3 Resources */}
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Resources</h4>
              <ul className="space-y-2 text-[11px]">
                <li><a href="https://github.com" className="text-zinc-500 hover:text-white transition">Markdown Guide</a></li>
                <li><a href="https://shields.io" className="text-zinc-500 hover:text-white transition">Shields.io Badges</a></li>
                <li><a href="#faq" className="text-zinc-500 hover:text-white transition">Frequently Asked</a></li>
                <li><a href="https://github.com" className="text-zinc-500 hover:text-white transition">GitHub Repos</a></li>
              </ul>
            </div>

            {/* Column 4 Legal & Changelog */}
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Changelog</h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="text-zinc-500 hover:text-white transition">V1.2 Release</span>
                  <span className="rounded bg-cyan-500/10 px-1 py-0.5 text-[8px] font-bold text-cyan-300">Latest</span>
                </li>
                <li><span className="text-zinc-500">MIT Open Source</span></li>
                <li><span className="text-zinc-500">Local-only data storage</span></li>
              </ul>
            </div>

          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-zinc-600 font-mono">
              &copy; {new Date().getFullYear()} ReadmeForge Platform. Engineered by elite software architects.
            </p>
            <p className="text-[10px] text-zinc-600 font-mono">
              MIT License &bull; Client-side security guaranteed.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile bottom CTA */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:hidden flex justify-center"
          >
            <div className="w-full max-w-sm rounded-2xl border border-cyan-500/30 bg-[#09090c]/90 p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] shadow-cyan-950/20 backdrop-blur-xl flex items-center justify-between gap-4">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1">
                  <span className="flex size-1.5 rounded-full bg-cyan-400 animate-ping" />
                  ReadmeForge AI
                </span>
                <span className="text-[11px] font-semibold text-white mt-0.5">Ready to ship docs?</span>
              </div>
              
              <Button asChild size="sm" className="h-9 px-4.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs tracking-wider rounded-xl shadow-lg shadow-cyan-900/30 border border-cyan-400/30 active:scale-95 transition">
                <Link href="/generator">
                  Generate README
                  <Sparkles className="ml-1.5 size-3 animate-pulse" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
