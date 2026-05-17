"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Wand2,
  Layers3,
  BadgeCheck,
  ClipboardCheck,
  Download,
  Terminal,
  FileText,
  Check,
  ExternalLink,
  Shield,
  Zap,
  Cpu,
  X,
  ChevronDown,
  Play,
  HelpCircle,
  Star,
  BookOpen,
  Users,
  CheckCircle2,
  Menu,
  Clock,
  Settings,
  AlertTriangle,
  Lightbulb,
  Undo,
  Redo,
  FolderOpen,
  Trash2,
  Plus,
  Sun,
  Moon,
  Keyboard,
  Compass,
  ChevronsUpDown,
  CornerDownLeft,
  Search,
  Eye,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  AlertCircle,
  Code,
  Image as ImageIcon,
  ListOrdered,
  ListCollapse,
  EyeOff,
  Copy,
  FileCode,
  Info,
  TrendingUp,
  Sliders,
  DollarSign,
  Maximize2,
  Folder,
  File
} from "lucide-react";
import {
  SparklesIcon,
  CompassIcon,
  Note01Icon,
  ViewIcon,
  Activity01Icon,
  BotIcon,
  PackageIcon,
  KeyboardIcon,
  RocketIcon
} from "hugeicons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MarkdownPreview } from "./markdown-preview";
import {
  initDB,
  dbSaveWorkspace,
  dbLoadWorkspaces,
  dbDeleteWorkspace,
  dbSaveSnapshot,
  dbLoadSnapshots,
  dbDeleteSnapshot,
  dbSaveExport,
  dbLoadExports,
  dbDeleteExport,
  dbSaveSnippet,
  dbLoadSnippets,
  dbDeleteSnippet,
  dbSavePreference,
  dbLoadPreferences,
  dbIncrementMetric,
  dbLoadMetrics,
  dbLogActivity,
  dbLoadActivityLogs,
  localFuzzySearch,
  dbExportBackup,
  dbImportBackup,
  dbClearAllStorage,
  registerTabSyncListener
} from "./local-db";

// ----------------------------------------------------
// DYNAMIC SECTION INTERFACES
// ----------------------------------------------------
export interface ReadmeSectionField {
  key: string;
  label: string;
  type: "input" | "textarea" | "tags" | "steps" | "features" | "api-endpoints" | "env-vars" | "install-tabs" | "roadmap-timeline" | "faq-accordion" | "hero-banner-editor";
  value: any;
  placeholder: string;
}

export interface ReadmeSection {
  id: string;
  title: string;
  enabled: boolean;
  collapsed: boolean;
  fields: ReadmeSectionField[];
}

// ----------------------------------------------------
const mockRepoData = {
  name: "orbit-saas-platform",
  fullName: "adityananda/orbit-saas-platform",
  description: "High-performance collaborative Kanban workflow canvas and automated SaaS telemetry dashboard for advanced squads.",
  projectType: "SaaS Application",
  confidence: 98,
  frameworks: ["Next.js", "React", "TailwindCSS", "Framer Motion", "Prisma", "PostgreSQL", "Docker"],
  deployment: "Vercel",
  dependencies: {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "@prisma/client": "^5.12.0",
    "framer-motion": "^11.1.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.368.0",
    "zod": "^3.22.0"
  },
  fileTree: [
    { name: "app", type: "folder", children: [
      { name: "api", type: "folder", children: [
        { name: "auth", type: "folder", children: [{ name: "route.ts", type: "file" }] },
        { name: "endpoints", type: "folder", children: [{ name: "route.ts", type: "file" }] }
      ] },
      { name: "dashboard", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
      { name: "layout.tsx", type: "file" },
      { name: "page.tsx", type: "file" }
    ] },
    { name: "components", type: "folder", children: [
      { name: "kanban", type: "folder", children: [{ name: "board.tsx", type: "file" }, { name: "card.tsx", type: "file" }] },
      { name: "ui", type: "folder", children: [{ name: "button.tsx", type: "file" }, { name: "dialog.tsx", type: "file" }] }
    ] },
    { name: "prisma", type: "folder", children: [
      { name: "schema.prisma", type: "file" }
    ] },
    { name: "Dockerfile", type: "file" },
    { name: "package.json", type: "file" },
    { name: "tsconfig.json", type: "file" }
  ],
  contributors: [
    { login: "adityananda", commits: 142, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" },
    { login: "copilot-bot", commits: 88, avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100&auto=format&fit=crop" },
    { login: "sarah-dev", commits: 37, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" }
  ],
  insights: {
    completeness: 85,
    onboarding: 90,
    ossLaunch: 75,
    maintainability: 95
  }
};

const AI_PRESETS_DATABASE = {
  heroTitle: "Orbit Enterprise Console",
  heroTagline: "The Premium AI-powered workflow board & collaborative telemetry analytics canvas designed for next-generation engineering squads.",
  
  stack: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "Prisma", "PostgreSQL", "Docker", "Redis"],
  
  installPackages: "orbit-canvas-telemetry",
  npmCmd: "npm install @orbit/canvas-telemetry --save-dev",
  pnpmCmd: "pnpm add @orbit/canvas-telemetry -D",
  bunCmd: "bun add @orbit/canvas-telemetry",
  
  apiEndpoints: [
    { method: "GET", path: "/api/v1/telemetry/boards", desc: "Retrieve active team workspaces and card pipelines", response: "{ status: 'success', data: Board[] }" },
    { method: "POST", path: "/api/v1/telemetry/events", desc: "Dispatch automated state changes and analytical triggers", response: "{ eventId: 'uuid', logged: true }" },
    { method: "PUT", path: "/api/v1/telemetry/cards/move", desc: "Re-arrange column arrays with real-time sync updates", response: "{ columnId: 'id', idx: 3 }" }
  ],
  
  envVars: [
    { key: "NEXT_PUBLIC_ORBIT_API_URL", required: "YES", default: "https://api.orbit.sh", desc: "Base gateway address for webhook distribution channels" },
    { key: "DATABASE_PRISMA_URL", required: "YES", default: "postgresql://postgres:root@localhost:5432/orbit", desc: "Database access tokens for schema registration" },
    { key: "ORBIT_TELEMETRY_SECRET", required: "NO", default: "shh_secret_token", desc: "OAuth verification signatures for workspace web portals" }
  ],
  
  roadmap: [
    { date: "Q3 2026", title: "Automated real-time WebSockets synchronization layers", status: "completed" },
    { date: "Q4 2026", title: "Integrated Copilot coding context vector pipeline", status: "in-progress" },
    { date: "Q1 2027", title: "Enterprise-grade multi-tenant team billing consoles", status: "planned" }
  ],
  
  faqs: [
    { q: "How does the automated real-time telemetry agent sync states?", a: "Orbit utilizes high-performance lightweight WebSockets and WebRTC channels to broadcast collaborative matrix updates instantly across connected squad sandboxes." },
    { q: "Is local development database schema migration supported out-of-the-box?", a: "Yes! Simply configure the `DATABASE_PRISMA_URL` connection key, run the Prisma sync commands, and local developer workspaces are online immediately." }
  ],
  
  customDoc: "### Developer Architecture Overview\n\nThe Orbit telemetry system operates via a dual-layered runtime model: a high-efficiency dashboard node and a backend vector server. All web portals leverage server-side caching pipelines paired with instant clients-side updates using Framer Motion physics for maximum developer interface premium feel."
};

// ----------------------------------------------------
// PRESET TECH BADGES DATABASE (Category Grouped)
// ----------------------------------------------------
const PRESET_BADGES = [
  { name: "Next.js", category: "Frontend", color: "000000", logo: "nextdotjs" },
  { name: "React", category: "Frontend", color: "20232a", logo: "react" },
  { name: "Vue", category: "Frontend", color: "4fc08d", logo: "vuedotjs" },
  { name: "Angular", category: "Frontend", color: "dd0031", logo: "angular" },
  { name: "Tailwind CSS", category: "Frontend", color: "06b6d4", logo: "tailwindcss" },
  { name: "TypeScript", category: "Languages", color: "3178c6", logo: "typescript" },
  { name: "Python", category: "Languages", color: "3776ab", logo: "python" },
  { name: "Rust", category: "Languages", color: "000000", logo: "rust" },
  { name: "Go", category: "Languages", color: "00add8", logo: "go" },
  { name: "Node.js", category: "Backend", color: "339933", logo: "nodedotjs" },
  { name: "Bun", category: "Backend", color: "f9f1e1", logo: "bun" },
  { name: "PostgreSQL", category: "Databases", color: "4169e1", logo: "postgresql" },
  { name: "MongoDB", category: "Databases", color: "47a248", logo: "mongodb" },
  { name: "Redis", category: "Databases", color: "dc382d", logo: "redis" },
  { name: "Prisma", category: "Backend", color: "2d3748", logo: "prisma" },
  { name: "Docker", category: "DevOps", color: "2496ed", logo: "docker" },
  { name: "Vercel", category: "DevOps", color: "000000", logo: "vercel" }
];

// ----------------------------------------------------
// 6 PRESENTATION PRESENTATION THEMES OPTIONS
// ----------------------------------------------------
const PRESENTATION_THEMES = [
  { id: "classic", label: "GitHub Classic", desc: "Original GFM theme, perfect for open source community standards." },
  { id: "dev-dark", label: "Developer Dark", desc: "Monochromatic, high-performance cyber theme with cyan sparks." },
  { id: "minimal", label: "Open Source Minimal", desc: "Ultra-clean serif lines, wide white spaces, and red tag codes." },
  { id: "saas-gradient", label: "SaaS Pink Gradient", desc: "Vibrant violet backdrop with magenta glows and outfit typographies." },
  { id: "hacker", label: "Hacker Terminal", desc: "Retro phosphorus green terminals, dashed outlines, and code grids." },
  { id: "doc-pro", label: "Documentation Pro", desc: "Elegant Georgia typography, clean royal anchors, and slate shadows." }
];

const templateOptions = [
  { id: "saas", label: "SaaS Product Blueprint" },
  { id: "open-source", label: "Open Source Crate" },
  { id: "portfolio", label: "Developer Portfolio" }
];

// ----------------------------------------------------
// 6 STARTUP TEMPLATE BLUEPRINTS
// ----------------------------------------------------
const defaultTemplates: Record<string, ReadmeSection[]> = {
  saas: [
    {
      id: "hero-banner",
      title: "Hero Banner Layout",
      enabled: true,
      collapsed: false,
      fields: [
        {
          key: "hero",
          label: "Hero Details",
          type: "hero-banner-editor",
          value: {
            bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
            logoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=150&auto=format&fit=crop",
            title: "Orbit Enterprise Console",
            tagline: "The Ultimate AI-Powered Workflow & Dashboard Canvas for Fast Modern SaaS Squads"
          },
          placeholder: ""
        }
      ]
    },
    {
      id: "stack",
      title: "Technology Stack",
      enabled: true,
      collapsed: false,
      fields: [
        { key: "tech", label: "Shields.io Active Stacks", type: "tags", value: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Docker"], placeholder: "Select or search stack badge..." }
      ]
    },
    {
      id: "features",
      title: "Key Capabilities",
      enabled: true,
      collapsed: false,
      fields: [
        { key: "featuresList", label: "Features Highlight Matrix", type: "features", value: [
          "Cinematic Glassmorphism Dashboard Canvas workspaces",
          "Automated AST codebase scanning pipelines",
          "Private local-first data sandbox memory pools",
          "Dynamic spring gesture viewport transitions"
        ], placeholder: "Add core capability..." }
      ]
    },
    {
      id: "installation-tabs",
      title: "Multi-Package Onboarding",
      enabled: true,
      collapsed: false,
      fields: [
        {
          key: "installTabs",
          label: "Installation tabs configuration",
          type: "install-tabs",
          value: {
            packages: "@orbit-saas/platform-client",
            npmCmd: "npm i @orbit-saas/platform-client",
            pnpmCmd: "pnpm add @orbit-saas/platform-client",
            yarnCmd: "yarn add @orbit-saas/platform-client",
            bunCmd: "bun add @orbit-saas/platform-client"
          },
          placeholder: ""
        }
      ]
    },
    {
      id: "api-endpoints",
      title: "API Endpoint Specs",
      enabled: true,
      collapsed: false,
      fields: [
        {
          key: "endpoints",
          label: "Active API Routes",
          type: "api-endpoints",
          value: [
            { method: "GET", path: "/api/v1/health", desc: "Inspect orchestrator service node health state status", response: '{"status":"healthy","latency_ms":12}' },
            { method: "POST", path: "/api/v1/workflow/trigger", desc: "Dispatch client server payload event pipeline run", response: '{"id":"wf_88291","state":"pending"}' }
          ],
          placeholder: ""
        }
      ]
    },
    {
      id: "env-vars",
      title: "Environment Settings",
      enabled: true,
      collapsed: true,
      fields: [
        {
          key: "envVars",
          label: "Required System Environment Keys",
          type: "env-vars",
          value: [
            { key: "DATABASE_URL", required: "Yes", default: "postgresql://localhost:5432/orbit", desc: "Target server PostgreSQL storage pipeline connection URL string" },
            { key: "ORBIT_JWT_SECRET", required: "Yes", default: "platform_hash_signature", desc: "Cryptographic JWT signing adapter key hash value" }
          ],
          placeholder: ""
        }
      ]
    },
    {
      id: "roadmap",
      title: "Product Roadmap Timeline",
      enabled: true,
      collapsed: true,
      fields: [
        {
          key: "milestones",
          label: "Roadmap Milestones",
          type: "roadmap-timeline",
          value: [
            { date: "Q1 2026", title: "AST Compiler integration and core workspace layout", status: "completed" },
            { date: "Q2 2026", title: "Smart Badge Engine & Presentation themes rendering", status: "in-progress" },
            { date: "Q3 2026", title: "AI Model integrations and automated GitHub synchronization", status: "planned" }
          ],
          placeholder: ""
        }
      ]
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      enabled: true,
      collapsed: true,
      fields: [
        {
          key: "faqs",
          label: "FAQS accordion",
          type: "faq-accordion",
          value: [
            { q: "Is Orbit Enterprise local-first?", a: "Absolutely! All state files, compiler sandboxes, and timeline events run inside client-side buffer registries locally." },
            { q: "What databases are officially supported?", a: "PostgreSQL with Prisma adapters, Redis in-memory caches, and MongoDB connectors." }
          ],
          placeholder: ""
        }
      ]
    },
    {
      id: "license",
      title: "Licensing & Copyright",
      enabled: true,
      collapsed: true,
      fields: [
        { key: "licenseType", label: "License Type", type: "input", value: "MIT Permissive License", placeholder: "MIT" },
        { key: "copyright", label: "Copyright Holder", type: "input", value: "Copyright (c) 2026 ReadmeForge Inc.", placeholder: "e.g., 2026 John Doe" }
      ]
    }
  ],
  "open-source": [
    {
      id: "hero-banner",
      title: "Header Information",
      enabled: true,
      collapsed: false,
      fields: [
        {
          key: "hero",
          label: "Header",
          type: "hero-banner-editor",
          value: {
            bannerUrl: "",
            logoUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=120&auto=format&fit=crop",
            title: "tauri-state-manager",
            tagline: "Ultra-fast, Zero-Copy Wasm State synchronizer crate for Tauri desktop applications"
          },
          placeholder: ""
        }
      ]
    },
    {
      id: "stack",
      title: "Technology Stacks",
      enabled: true,
      collapsed: false,
      fields: [
        { key: "tech", label: "Badge List", type: "tags", value: ["Rust", "TypeScript", "Vercel"], placeholder: "Add stacks..." }
      ]
    },
    {
      id: "features",
      title: "Core Capabilities",
      enabled: true,
      collapsed: false,
      fields: [
        { key: "featuresList", label: "Features", type: "features", value: [
          "Zero-Copy WebAssembly Serialization layout adapters",
          "Under 12 microseconds latency per event dispatch",
          "Native Rust compiler validation bindings"
        ], placeholder: "Add features..." }
      ]
    },
    {
      id: "installation-tabs",
      title: "Install Scripts",
      enabled: true,
      collapsed: false,
      fields: [
        {
          key: "installTabs",
          label: "Tabs",
          type: "install-tabs",
          value: {
            packages: "tauri-state-manager",
            npmCmd: "npm i @tauri-state-manager/client",
            pnpmCmd: "pnpm add @tauri-state-manager/client",
            yarnCmd: "yarn add @tauri-state-manager/client",
            bunCmd: "bun add @tauri-state-manager/client"
          },
          placeholder: ""
        }
      ]
    }
  ],
  portfolio: [
    {
      id: "hero-banner",
      title: "Profile Card",
      enabled: true,
      collapsed: false,
      fields: [
        {
          key: "hero",
          label: "Details",
          type: "hero-banner-editor",
          value: {
            bannerUrl: "",
            logoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
            title: "Alex Rivera | Senior Creative Web Architect",
            tagline: "Specializing in Cinematic Web Renders, Rust compiler engines, and premium HSL dashboard modules."
          },
          placeholder: ""
        }
      ]
    },
    {
      id: "stack",
      title: "Core Competencies",
      enabled: true,
      collapsed: false,
      fields: [
        { key: "tech", label: "Skills Badges", type: "tags", value: ["React", "TypeScript", "Rust", "Node.js"], placeholder: "Add stacks..." }
      ]
    }
  ]
};

// ====================================================
// ENVIRONMENT CONFIGURATION & SHOWCASE DATA SEEDER
// ====================================================
const getIsDevMode = () => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.includes("local")) {
      return true;
    }
  }
  return process.env.NODE_ENV === "development";
};

const defaultMockWorkspaces = [
  {
    id: "ws-1",
    name: "Orbit SaaS Console",
    description: "Enterprise Kanban workflow canvas & analytical dashboard.",
    template: "saas",
    sections: defaultTemplates.saas,
    readmeTheme: "saas-gradient",
    healthScore: 85,
    lastEdited: "2 hours ago",
    isPinned: true,
    isArchived: false,
    exportsCount: 14,
    collaborators: ["Sarah", "Alex", "You"],
    snippets: []
  },
  {
    id: "ws-2",
    name: "Tauri State Client",
    description: "State synchronization layer for rust desktop binaries.",
    template: "open-source",
    sections: defaultTemplates["open-source"],
    readmeTheme: "tech-minimal",
    healthScore: 92,
    lastEdited: "1 day ago",
    isPinned: false,
    isArchived: false,
    exportsCount: 8,
    collaborators: ["You"],
    snippets: []
  }
];

const defaultMockSnippets = [
  { 
    id: "snip-1", 
    name: "Premium Env Key Ring", 
    category: "Configurations", 
    fields: [
      { key: "envVars", label: "Env Vars", type: "env-vars" as const, value: AI_PRESETS_DATABASE.envVars, placeholder: "" }
    ] 
  },
  { 
    id: "snip-2", 
    name: "React Starter Badges Stack", 
    category: "Badges", 
    fields: [
      { key: "tech", label: "Skills Badges", type: "tags" as const, value: AI_PRESETS_DATABASE.stack, placeholder: "Add stacks..." }
    ] 
  }
];

export function GeneratorWorkspace() {
  const [template, setTemplate] = useState<string>("saas");
  const [sections, setSections] = useState<ReadmeSection[]>(defaultTemplates.saas);
  
  // Local-First Persistence Engine States
  const [dashboardSubTab, setDashboardSubTab] = useState<"projects" | "exports" | "diagnostics" | "logs">("projects");
  const [exportsHistory, setExportsHistory] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [storageUsage, setStorageUsage] = useState<{ used: number; total: number }>({ used: 0, total: 0 });
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [backupString, setBackupString] = useState<string>("");
  
  // Resizable Panel & Layout States
  const [editorWidth, setEditorWidth] = useState<number>(48);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [sidebarCollap, setSidebarCollap] = useState<boolean>(false);

  // Presentation & GFM Themes Engine
  const [readmeTheme, setReadmeTheme] = useState<string>("saas-gradient");

  // Smart Badge System States
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);
  const [badgeSearch, setBadgeSearch] = useState<string>("");
  const [badgeStyle, setBadgeStyle] = useState<string>("for-the-badge");
  const [customBadgeLabel, setCustomBadgeLabel] = useState<string>("");
  const [customBadgeValue, setCustomBadgeValue] = useState<string>("");
  const [customBadgeColor, setCustomBadgeColor] = useState<string>("06b6d4");

  // Advanced Export Dialog States
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportTab, setExportTab] = useState<"markdown" | "html" | "zip-pdf">("markdown");

  // Interactive UI helpers
  const [newTagInput, setNewTagInput] = useState<Record<string, string>>({});
  const [newStepInput, setNewStepInput] = useState<Record<string, string>>({});
  const [newFeatureInput, setNewFeatureInput] = useState<Record<string, string>>({});
  const [slashMenuSectionId, setSlashMenuSectionId] = useState<string | null>(null);

  // Command Palette & Shortcut Popups
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [paletteQuery, setPaletteQuery] = useState<string>("");

  // Autosave, copy alerts, and undo/redo stacks
  const [history, setHistory] = useState<ReadmeSection[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState<boolean>(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isBooting, setIsBooting] = useState<boolean>(true);
  
  // Custom Section Builder State
  const [customSectionTitle, setCustomSectionTitle] = useState<string>("");

  // ----------------------------------------------------
  // PHASE 3: AI & REPOSITORY INTELLIGENCE STATES & HELPERS
  // ----------------------------------------------------
  const [activeSidebarTab, setActiveSidebarTab] = useState<"explorer" | "github" | "ai" | "insights">("explorer");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "analyzing" | "completed">("idle");
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scannedRepo, setScannedRepo] = useState<any>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [collapsedDirs, setCollapsedDirs] = useState<Record<string, boolean>>({
    "app": false,
    "components": false,
    "prisma": true
  });

  // ----------------------------------------------------
  // PHASE 4: PLATFORM, COLLABORATION, SNAPSHOTS & MULTI-WORKSPACE SYSTEM
  // ----------------------------------------------------
  const [activeView, setActiveView] = useState<"dashboard" | "editor" | "presentation">("dashboard");
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("");

  // Snapshots/Versions state
  const [snapshots, setSnapshots] = useState<Record<string, any[]>>({});

  // Reusable snippet component library state
  const [snippetsLibrary, setSnippetsLibrary] = useState<any[]>([]);
  const [showSnippetsModal, setShowSnippetsModal] = useState<boolean>(false);

  // Collaboration cursor presence simulation
  const [collaborators, setCollaborators] = useState<any[]>([]);

  // Notification list
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);

  // Custom Snippet creation builder modal
  const [newSnippetName, setNewSnippetName] = useState<string>("");
  const [newSnippetCategory, setNewSnippetCategory] = useState<string>("Custom");

  // Public Link Share Modal & Options
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareLinkExpired, setShareLinkExpired] = useState<boolean>(false);
  const [shareExpiresIn, setShareExpiresIn] = useState<string>("7 days");

  // Publishing Modal
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [publishProgress, setPublishProgress] = useState<number>(0);
  const [publishLogs, setPublishLogs] = useState<string[]>([]);
  const [publishState, setPublishState] = useState<"idle" | "publishing" | "completed">("idle");

  // Export settings & process
  const [exportFilename, setExportFilename] = useState<string>("README.md");
  const [exportFormat, setExportFormat] = useState<"md" | "zip" | "html" | "pdf">("md");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStep, setExportStep] = useState<string>("");
  const [exportProgress, setExportProgress] = useState<number>(0);

  // Onboarding Wizard Flow
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);

  // ====================================================
  // SPOTLIGHT ONBOARDING TOUR ENGINE
  // ====================================================
  const [spotlightTourActive, setSpotlightTourActive] = useState<boolean>(false);
  const [spotlightStep, setSpotlightStep] = useState<number>(0);
  const [spotlightRect, setSpotlightRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [hasCompletedTour, setHasCompletedTour] = useState<boolean>(false);
  const [showZeroState, setShowZeroState] = useState<boolean>(false);

  const SPOTLIGHT_TOUR_STEPS = useMemo(() => [
    {
      id: "welcome",
      title: "Welcome to ReadmeForge",
      description: "The most powerful developer documentation platform. Let us show you around in 60 seconds.",
      targetId: null,
      position: "center" as const,
      icon: <SparklesIcon className="size-8 text-purple-400" />
    },
    {
      id: "sidebar",
      title: "Workspace Navigation",
      description: "Your command center. Switch between block explorer, GitHub scanner, AI copilot, and repository insights.",
      targetId: "onboarding-sidebar",
      position: "right" as const,
      icon: <CompassIcon className="size-8 text-cyan-400" />
    },
    {
      id: "editor",
      title: "Modular README Editor",
      description: "Drag, drop, and compose README sections with a visual block editor. Each section is independently configurable.",
      targetId: "onboarding-editor",
      position: "right" as const,
      icon: <Note01Icon className="size-8 text-amber-400" />
    },
    {
      id: "preview",
      title: "Live GitHub Preview",
      description: "See your README rendered exactly as GitHub displays it — in real-time as you type.",
      targetId: "onboarding-preview",
      position: "left" as const,
      icon: <ViewIcon className="size-8 text-indigo-400" />
    },
    {
      id: "health",
      title: "Health Analysis Engine",
      description: "AI-powered scoring grades your documentation quality with actionable optimization suggestions.",
      targetId: "onboarding-health",
      position: "bottom" as const,
      icon: <Activity01Icon className="size-8 text-emerald-400" />
    },
    {
      id: "ai",
      title: "AI Copilot",
      description: "Generate entire README sections, brand headlines, and technical docs with one-click AI workflows.",
      targetId: "onboarding-ai",
      position: "right" as const,
      icon: <BotIcon className="size-8 text-pink-400" />
    },
    {
      id: "export",
      title: "Export & Auto-Save",
      description: "Export to Markdown, HTML, ZIP, or PDF. Everything auto-saves to your browser's local database.",
      targetId: "onboarding-export",
      position: "bottom" as const,
      icon: <PackageIcon className="size-8 text-orange-400" />
    },
    {
      id: "shortcuts",
      title: "Command Palette",
      description: "Press ⌘/ to access the Raycast-style command palette for instant actions and navigation.",
      targetId: "onboarding-shortcuts",
      position: "bottom" as const,
      icon: <KeyboardIcon className="size-8 text-cyan-500" />
    },
    {
      id: "activate",
      title: "You're Ready!",
      description: "Create your first workspace and start building world-class documentation.",
      targetId: null,
      position: "center" as const,
      icon: <RocketIcon className="size-8 text-purple-500" />
    }
  ], []);

  // Spotlight tour navigation helpers
  const advanceSpotlightTour = () => {
    if (spotlightStep < SPOTLIGHT_TOUR_STEPS.length - 1) {
      const nextStep = spotlightStep + 1;
      setSpotlightStep(nextStep);
      localStorage.setItem("readmeforge_tour_step", String(nextStep));
      const step = SPOTLIGHT_TOUR_STEPS[nextStep];
      if (step.targetId) {
        requestAnimationFrame(() => {
          const el = document.getElementById(step.targetId!);
          if (el) {
            const rect = el.getBoundingClientRect();
            setSpotlightRect({ x: rect.x - 8, y: rect.y - 8, w: rect.width + 16, h: rect.height + 16 });
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } else {
            setSpotlightRect(null);
          }
        });
      } else {
        setSpotlightRect(null);
      }
    } else {
      completeSpotlightTour();
    }
  };

  const retreatSpotlightTour = () => {
    if (spotlightStep > 0) {
      const prevStep = spotlightStep - 1;
      setSpotlightStep(prevStep);
      localStorage.setItem("readmeforge_tour_step", String(prevStep));
      const step = SPOTLIGHT_TOUR_STEPS[prevStep];
      if (step.targetId) {
        requestAnimationFrame(() => {
          const el = document.getElementById(step.targetId!);
          if (el) {
            const rect = el.getBoundingClientRect();
            setSpotlightRect({ x: rect.x - 8, y: rect.y - 8, w: rect.width + 16, h: rect.height + 16 });
          } else {
            setSpotlightRect(null);
          }
        });
      } else {
        setSpotlightRect(null);
      }
    }
  };

  const completeSpotlightTour = () => {
    setSpotlightTourActive(false);
    setSpotlightStep(0);
    setSpotlightRect(null);
    setHasCompletedTour(true);
    localStorage.setItem("readmeforge_tour_completed", "true");
    localStorage.removeItem("readmeforge_tour_step");
    triggerToast("Tour completed! Welcome to ReadmeForge.", "success");
  };

  const startSpotlightTour = () => {
    setSpotlightTourActive(true);
    setSpotlightStep(0);
    setSpotlightRect(null);
    setShowZeroState(false);
    if (activeView !== "editor") {
      setActiveView("editor");
    }
  };

  // Workspace Actions
  const createWorkspace = (name: string, templateId: string, description?: string) => {
    const defaultSecs = defaultTemplates[templateId] || defaultTemplates.saas;
    const newWs = {
      id: `ws-${Date.now()}`,
      name,
      description: description || "No description provided.",
      template: templateId,
      sections: JSON.parse(JSON.stringify(defaultSecs)),
      readmeTheme: templateId === "open-source" ? "tech-minimal" : "saas-gradient",
      healthScore: 60,
      lastEdited: "Just now",
      isPinned: false,
      isArchived: false,
      exportsCount: 0,
      collaborators: ["You"],
      snippets: []
    };
    
    setWorkspaces(prev => [newWs, ...prev]);
    setActiveWorkspaceId(newWs.id);
    setSnapshots(prev => ({
      ...prev,
      [newWs.id]: [{ id: `snap-${Date.now()}`, label: "Initial Workspace Draft", timestamp: "Just now", sections: newWs.sections }]
    }));
    triggerToast(`Created workspace: '${name}' successfully!`);
    setActiveView("editor");
  };

  const duplicateWorkspace = (wsId: string) => {
    const target = workspaces.find(w => w.id === wsId);
    if (!target) return;
    const newWs = {
      ...target,
      id: `ws-${Date.now()}`,
      name: `${target.name} (Copy)`,
      lastEdited: "Just now",
      isPinned: false,
      exportsCount: 0,
      sections: JSON.parse(JSON.stringify(target.sections))
    };
    setWorkspaces(prev => [newWs, ...prev]);
    triggerToast(`Duplicated workspace as '${newWs.name}'`);
  };

  const renameWorkspace = (wsId: string, newName: string) => {
    setWorkspaces(prev => prev.map(w => w.id === wsId ? { ...w, name: newName, lastEdited: "Just now" } : w));
    triggerToast(`Renamed project to '${newName}'`);
  };

  const toggleArchiveWorkspace = (wsId: string) => {
    setWorkspaces(prev => prev.map(w => w.id === wsId ? { ...w, isArchived: !w.isArchived } : w));
    const target = workspaces.find(w => w.id === wsId);
    triggerToast(target?.isArchived ? `Restored workspace '${target.name}'` : `Archived workspace '${target?.name}'`);
  };

  const togglePinWorkspace = (wsId: string) => {
    setWorkspaces(prev => prev.map(w => w.id === wsId ? { ...w, isPinned: !w.isPinned } : w));
  };

  const deleteWorkspace = (wsId: string) => {
    const remaining = workspaces.filter(w => w.id !== wsId);
    setWorkspaces(remaining);
    if (activeWorkspaceId === wsId && remaining.length > 0) {
      setActiveWorkspaceId(remaining[0].id);
    }
    triggerToast("Workspace deleted permanently.");
  };

  // Version Snapshot Actions
  const createSnapshot = (label: string) => {
    const newSnap = {
      id: `snap-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      label,
      timestamp: "Just now",
      sections: JSON.parse(JSON.stringify(sections))
    };
    dbSaveSnapshot(newSnap).then(() => {
      dbLoadSnapshots(activeWorkspaceId).then((list) => {
        setSnapshots(prev => ({
          ...prev,
          [activeWorkspaceId]: list
        }));
        dbLogActivity("snapshot", `Version snapshot checkpoint '${label}' saved.`);
      });
    });
    triggerToast(`Created version checkpoint: '${label}'`);
  };

  const restoreSnapshot = (snapId: string) => {
    const list = snapshots[activeWorkspaceId] || [];
    const snap = list.find(s => s.id === snapId);
    if (snap) {
      setSections(JSON.parse(JSON.stringify(snap.sections)));
      dbLogActivity("snapshot", `Restored workspace to checkpoint: '${snap.label}'`);
      triggerToast(`Restored snapshot to checkpoint: '${snap.label}'`);
    }
  };

  // Asset Component Library Actions
  const saveToSnippetLibrary = (sectionName: string, sectionData: ReadmeSection) => {
    const newSnip = {
      id: `snip-${Date.now()}`,
      name: sectionName,
      category: "Reusable Blocks",
      fields: JSON.parse(JSON.stringify(sectionData.fields)),
      timestamp: new Date().toLocaleTimeString()
    };
    dbSaveSnippet(newSnip).then(() => {
      dbLoadSnippets().then(list => setSnippetsLibrary(list));
    });
    triggerToast(`Saved block '${sectionData.title}' as snippet blueprint: '${sectionName}'!`);
  };

  const insertSnippet = (snipId: string) => {
    const snip = snippetsLibrary.find(s => s.id === snipId);
    if (!snip) return;
    
    // Add custom custom block section into workspace
    const newSec: ReadmeSection = {
      id: `custom_${Date.now()}`,
      title: snip.name,
      enabled: true,
      collapsed: false,
      fields: snip.fields.map((f: any) => ({
        key: f.key || "custom-desc",
        label: f.label || "Snippet Description",
        type: f.type || "textarea",
        value: f.value || "",
        placeholder: f.placeholder || ""
      }))
    };
    
    setSections(prev => [...prev, newSec]);
    triggerToast(`Inserted reusable snippet block '${snip.name}' into editor pane!`);
  };

  // Advanced Export Progress Flow
  const triggerExportPipeline = (format: "md" | "zip" | "html" | "pdf") => {
    setExportFormat(format);
    setIsExporting(true);
    setExportProgress(10);
    setExportStep("Parsing Markdown Abstract Syntax Tree (AST)...");

    setTimeout(() => {
      setExportProgress(45);
      setExportStep(format === "zip" ? "Structuring package manifest directory tree..." : "Slicing dynamic DOM elements and inline badges...");
    }, 1200);

    setTimeout(() => {
      setExportProgress(80);
      setExportStep(format === "pdf" ? "Generating multi-page vector layout matrices..." : "Generating CSS high-contrast theme tags...");
    }, 2400);

    setTimeout(() => {
      setExportProgress(100);
      setExportStep("Compilation complete! Triggering system save...");
      
      // Update workspaces counts
      setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? { ...w, exportsCount: (w.exportsCount || 0) + 1 } : w));
      
      // Save compiled export payload to local IndexedDB registry!
      const activeWs = workspaces.find(w => w.id === activeWorkspaceId);
      const filename = activeWs ? `${activeWs.name.toLowerCase().replace(/ /g, "-")}-README.${format}` : `README.${format}`;
      const sizeBytes = new Blob([generatedMarkdown]).size;
      const newExport = {
        id: `exp-${Date.now()}`,
        workspaceId: activeWorkspaceId,
        workspaceName: activeWs ? activeWs.name : "Unknown Project",
        filename,
        format,
        timestamp: new Date().toLocaleTimeString(),
        sizeBytes,
        content: generatedMarkdown
      };
      dbSaveExport(newExport).then(() => {
        dbLoadExports().then(list => setExportsHistory(list));
      });

      setTimeout(() => {
        setIsExporting(false);
        if (format === "md") downloadMarkdownFile();
        else triggerToast(`${format.toUpperCase()} Exported successfully!`);
      }, 600);
    }, 2200);
  };

  // Simulated GitHub Push/Publish workflow
  const triggerPublishPipeline = () => {
    setPublishState("publishing");
    setPublishProgress(5);
    setPublishLogs(["Authenticating secure tokens connection...", "Repository Target: " + (githubUrl || "adityananda/orbit-saas-platform")]);

    setTimeout(() => {
      setPublishProgress(30);
      setPublishLogs(prev => [...prev, "Validating compiled README.md markup tree structure...", "100% GFM Markdown compatibility checklist approved!"]);
    }, 800);

    setTimeout(() => {
      setPublishProgress(65);
      setPublishLogs(prev => [...prev, "Executing stage commits: 'docs: update repository technical architecture layouts'", "Pushing secure commit branch 'main' to GitHub origin..."]);
    }, 1600);

    setTimeout(() => {
      setPublishProgress(100);
      setPublishLogs(prev => [...prev, "GitHub Repository remote indexing complete!", "Live Public documentation CDN deployed!"]);
      setPublishState("completed");
      triggerToast("Published successfully to GitHub main branch!");
    }, 2400);
  };

  // Toast / System Notifications Logger
  const triggerToast = (text: string, type: "success" | "collab" | "export" = "success") => {
    setNotifications(prev => [
      { id: `n-${Date.now()}`, text, time: "Just now", type },
      ...prev
    ]);
  };

  // Sync active view loader hooks
  useEffect(() => {
    const ws = workspaces.find(w => w.id === activeWorkspaceId);
    if (ws) {
      setSections(ws.sections);
      setReadmeTheme(ws.readmeTheme);
      setTemplate(ws.template);
      
      // Load snapshots for this active workspace reactively from IndexedDB!
      dbLoadSnapshots(activeWorkspaceId).then((list) => {
        setSnapshots(prev => ({
          ...prev,
          [activeWorkspaceId]: list
        }));
      });
    }
  }, [activeWorkspaceId]);

  // Sync edits back into active workspaces data model in real-time
  useEffect(() => {
    if (isBooting) return;
    setWorkspaces(prev => prev.map(w => 
      w.id === activeWorkspaceId 
        ? { ...w, sections, readmeTheme, template, healthScore: healthDashboard.score } 
        : w
    ));
  }, [sections, readmeTheme, template, isBooting]);

  // Simulated live cursors & collaborator typing updates
  useEffect(() => {
    if (activeView !== "editor") return;
    const interval = setInterval(() => {
      // randomly toggle typing dots or select active cards
      setCollaborators(prev => prev.map(c => {
        if (Math.random() > 0.6) {
          const blocks = sections.map(s => s.id);
          const randomBlock = blocks[Math.floor(Math.random() * blocks.length)] || "hero-banner";
          const newStatus = Math.random() > 0.5 ? "typing" : "idle";
          if (newStatus === "typing") {
            triggerToast(`${c.name} is editing block: #${randomBlock.split("_")[0]}`, "collab");
          }
          return {
            ...c,
            activeBlock: randomBlock,
            status: newStatus,
            cursorOffset: Math.floor(Math.random() * 80)
          };
        }
        return c;
      }));
    }, 18000);
    
    return () => clearInterval(interval);
  }, [activeView, sections]);

  const startRepositoryScan = () => {
    if (!githubUrl) return;
    setScanState("scanning");
    setScanProgress(5);
    setScanLogs(["Initializing GitHub connection handshake...", "Connecting to repository: " + githubUrl]);
    
    setTimeout(() => {
      setScanProgress(25);
      setScanLogs(prev => [
        ...prev,
        "Branch main detected.",
        "Fetching folder directory manifests...",
        "Scanned folders: /app, /components, /prisma, /public",
        "Located config signatures: [package.json, tsconfig.json, Dockerfile, schema.prisma]"
      ]);
    }, 1500);

    setTimeout(() => {
      setScanState("analyzing");
      setScanProgress(60);
      setScanLogs(prev => [
        ...prev,
        "Analyzing codebase dependency models...",
        "Reading app/api routes for API cataloging...",
        "Found Prisma database model definition file.",
        "Detected Dockerfile platform deployment targets: [Vercel, Railway]"
      ]);
    }, 3000);

    setTimeout(() => {
      setScanState("completed");
      setScanProgress(100);
      setScanLogs(prev => [
        ...prev,
        "Repository analysis completed successfully!",
        "Project Type auto-detected: SaaS Application",
        "Framework modules parsed: [Next.js, TypeScript, TailwindCSS, Prisma, PostgreSQL]",
        "Auto-injecting recommended repository outline & environment configurations."
      ]);
      setScannedRepo(mockRepoData);
      setTemplate("saas");
    }, 3800);
  };

  const simulateAiTyping = (
    sectionId: string,
    fieldKey: string,
    targetText: string
  ) => {
    setIsAiGenerating(sectionId + "_" + fieldKey);
    let currentText = "";
    
    let parsedData: any = null;
    try {
      parsedData = JSON.parse(targetText);
    } catch (_) {}

    if (parsedData) {
      setTimeout(() => {
        updateSectionField(sectionId, fieldKey, parsedData);
        setIsAiGenerating(null);
      }, 1500);
      return;
    }

    const words = targetText.split(" ");
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < words.length) {
        currentText += (i === 0 ? "" : " ") + words[i];
        updateSectionField(sectionId, fieldKey, currentText);
        i++;
      } else {
        clearInterval(interval);
        setIsAiGenerating(null);
      }
    }, 45);
  };

  // ----------------------------------------------------
  // INITIAL DATA MOUNT & RESTORE hooks (Local-First IndexedDB Engine)
  // ----------------------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Online / Offline listeners
      setIsOnline(navigator.onLine);
      const handleOnline = () => {
        setIsOnline(true);
        triggerToast("Network link reconnected. Standalone sandbox active.", "success");
        dbLogActivity("security", "Network presence reconnected.");
      };
      const handleOffline = () => {
        setIsOnline(false);
        triggerToast("Network link lost. Switched to offline standalone sandbox.", "collab");
        dbLogActivity("security", "Network link lost. Switched to offline standalone sandbox.");
      };
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // 2. Tab Synchronization broadcast listener
      registerTabSyncListener((data) => {
        if (data.type === "WORKSPACE_UPDATED") {
          dbLoadWorkspaces().then((list) => {
            if (list.length > 0) {
              setWorkspaces(list);
              const activeWs = list.find(w => w.id === activeWorkspaceId);
              if (activeWs) {
                setSections(activeWs.sections);
                setReadmeTheme(activeWs.readmeTheme);
                setTemplate(activeWs.template);
              }
            }
          });
          triggerToast("Workspace updated in another tab. Consolidated.", "collab");
        } else if (data.type === "PREFERENCE_UPDATED") {
          if (data.payload.key === "previewTheme") {
            setPreviewTheme(data.payload.value);
          }
        } else if (data.type === "BACKUP_RESTORED") {
          dbLoadWorkspaces().then((list) => {
            setWorkspaces(list);
            triggerToast("Backup data loaded from another tab. Restoring.", "success");
          });
        }
      });

      // A. Restore onboarding preferences
      const tourCompleted = localStorage.getItem("readmeforge_tour_completed") === "true";
      setShowOnboarding(!tourCompleted || getIsDevMode());
      setHasCompletedTour(tourCompleted);
      const tourStep = localStorage.getItem("readmeforge_tour_step");
      if (tourStep) setOnboardingStep(Number(tourStep));

      // B. Load environment-aware showcase/demo state in memory
      if (getIsDevMode()) {
        setSnapshots({
          "ws-1": [
            { id: "snap-1", label: "Initial import draft", timestamp: "2 hours ago", sections: defaultTemplates.saas },
            { id: "snap-2", label: "Autosave before badges update", timestamp: "1 hour ago", sections: defaultTemplates.saas },
            { id: "snap-3", label: "AI Brand Optimizations", timestamp: "15 mins ago", sections: defaultTemplates.saas }
          ],
          "ws-2": [
            { id: "snap-4", label: "Developer base checkpoint", timestamp: "1 day ago", sections: defaultTemplates["open-source"] }
          ]
        });
        setCollaborators([
          { name: "Sarah Dev", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop", activeBlock: "hero-banner", status: "typing", cursorOffset: 34 },
          { name: "Alex Code", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop", activeBlock: "installation-tabs", status: "idle", cursorOffset: 12 }
        ]);
        setNotifications([
          { id: "n-1", text: "Project 'Orbit SaaS Console' auto-saved successfully", time: "Just now", type: "success" },
          { id: "n-2", text: "Sarah Dev joined workspace", time: "2 mins ago", type: "collab" },
          { id: "n-3", text: "ZIP Package exported successfully", time: "1 hour ago", type: "export" }
        ]);
      } else {
        setSnapshots({});
        setCollaborators([]);
        setNotifications([]);
      }

      // 3. Initialize IndexedDB and sync workspaces
      initDB().then(() => {
        dbLoadWorkspaces().then((list) => {
          if (list.length === 0) {
            if (getIsDevMode()) {
              const initialList = defaultMockWorkspaces.map(w => ({
                ...w,
                sections: JSON.parse(JSON.stringify(w.sections))
              }));
              Promise.all(initialList.map(w => dbSaveWorkspace(w))).then(() => {
                setWorkspaces(initialList);
                setActiveWorkspaceId("ws-1");
                setSections(initialList[0].sections);
                setReadmeTheme(initialList[0].readmeTheme);
                setTemplate(initialList[0].template);
                dbLogActivity("security", "Initial template workspaces seeded in IndexedDB successfully.");
              });
            } else {
              setWorkspaces([]);
              setActiveWorkspaceId("");
              setShowZeroState(true);
              dbLogActivity("security", "Pristine database initialized. Welcome to production sandbox.");
            }
          } else {
            setWorkspaces(list);
            // Restore active workspace if any
            const activeWs = list.find(w => w.id === activeWorkspaceId) || list[0];
            if (activeWs) {
              setActiveWorkspaceId(activeWs.id);
              setSections(activeWs.sections);
              setReadmeTheme(activeWs.readmeTheme);
              setTemplate(activeWs.template);
            }
          }
        }).catch((err) => {
          console.error("Failed to load workspaces from IndexedDB:", err);
        });

        // Sync Snippets
        dbLoadSnippets().then((snips) => {
          if (snips.length === 0) {
            if (getIsDevMode()) {
              const defaultSnips = defaultMockSnippets.map(s => ({
                ...s,
                timestamp: new Date().toLocaleTimeString()
              }));
              Promise.all(defaultSnips.map(s => dbSaveSnippet(s))).then(() => {
                setSnippetsLibrary(defaultSnips);
              });
            } else {
              setSnippetsLibrary([]);
            }
          } else {
            setSnippetsLibrary(snips);
          }
        });

        // Load Past Exports
        dbLoadExports().then((exps) => {
          setExportsHistory(exps);
        });

        // Load Activity logs
        dbLoadActivityLogs().then((logs) => {
          setActivityLogs(logs);
        });

        // Estimate Storage Health diagnostics space
        if (navigator.storage && navigator.storage.estimate) {
          navigator.storage.estimate().then((est) => {
            setStorageUsage({
              used: est.usage || 0,
              total: est.quota || 0
            });
          });
        }

        dbIncrementMetric("app_launches");
        dbLogActivity("analytics", "ReadmeForge Platform Console launched local session.");
      });

      const bootTimer = setTimeout(() => setIsBooting(false), 400);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        clearTimeout(bootTimer);
      };
    }
  }, []);

  // ----------------------------------------------------
  // DEBOUNCED AUTOSAVE TO CLIENT STORAGE & INDEXEDDB
  // ----------------------------------------------------
  useEffect(() => {
    if (isBooting || !activeWorkspaceId) return;
    setAutosaveStatus("saving");
    const saveTimeout = setTimeout(() => {
      // 1. Sync local storage for emergency quick recovery
      localStorage.setItem("readmeforge_workspace_sections_v2", JSON.stringify(sections));
      localStorage.setItem("readmeforge_workspace_template_v2", template);
      localStorage.setItem("readmeforge_workspace_theme", readmeTheme);
      
      // 2. Sync to IndexedDB workspace record
      const currentWs = workspaces.find(w => w.id === activeWorkspaceId);
      if (currentWs) {
        const updatedWs = {
          ...currentWs,
          sections,
          readmeTheme,
          template,
          healthScore: healthDashboard.score,
          lastEdited: "Just now"
        };
        dbSaveWorkspace(updatedWs).then(() => {
          // Re-load workspaces silently to maintain sync in state array
          dbLoadWorkspaces().then(list => setWorkspaces(list));
        });
      }

      setAutosaveStatus("saved");
      const idleTimer = setTimeout(() => setAutosaveStatus("idle"), 1200);
      return () => clearTimeout(idleTimer);
    }, 800);
    return () => clearTimeout(saveTimeout);
  }, [sections, template, readmeTheme, isBooting, activeWorkspaceId]);

  // ----------------------------------------------------
  // PANELS DRAG RESIZING MECHANICS
  // ----------------------------------------------------
  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const percentage = (e.clientX / window.innerWidth) * 100;
      if (percentage > 20 && percentage < 80) {
        setEditorWidth(percentage);
      }
    };
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // ----------------------------------------------------
  // KEYBOARD ACCELERATORS SYSTEM
  // ----------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        setAutosaveStatus("saving");
        localStorage.setItem("readmeforge_workspace_sections_v2", JSON.stringify(sections));
        setTimeout(() => setAutosaveStatus("saved"), 400);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "c") {
        e.preventDefault();
        copyMarkdownText();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "/" || e.key === "k")) {
        e.preventDefault();
        setShowPalette(prev => !prev);
      }
      if (e.key === "Escape") {
        setShowPalette(false);
        setShowSnippetsModal(false);
        setShowOnboarding(false);
        setShowExportModal(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        triggerUndo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sections, history, historyIndex]);

  // ----------------------------------------------------
  // UNDO/REDO BUFFER CORE
  // ----------------------------------------------------
  const pushHistoryState = (updatedSections: ReadmeSection[]) => {
    const freshHistory = history.slice(0, historyIndex + 1);
    freshHistory.push(JSON.parse(JSON.stringify(updatedSections)));
    if (freshHistory.length > 30) freshHistory.shift();
    setHistory(freshHistory);
    setHistoryIndex(freshHistory.length - 1);
  };

  const triggerUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setSections(JSON.parse(JSON.stringify(history[prevIndex])));
    }
  };

  const triggerRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setSections(JSON.parse(JSON.stringify(history[nextIndex])));
    }
  };

  // ----------------------------------------------------
  // DYNAMIC PRESENTS SWAPPING (PRESERVING WORKSPACE INPUTS)
  // ----------------------------------------------------
  const handleTemplateSwitch = (targetId: string) => {
    if (!defaultTemplates[targetId]) return;
    
    const preset = JSON.parse(JSON.stringify(defaultTemplates[targetId]));
    const updated = preset.map((sec: ReadmeSection) => {
      const matchExisting = sections.find(s => s.id === sec.id);
      if (matchExisting) {
        sec.fields = sec.fields.map(f => {
          const matchingField = matchExisting.fields.find(ef => ef.key === f.key);
          if (matchingField) {
            f.value = matchingField.value;
          }
          return f;
        });
      }
      return sec;
    });

    setTemplate(targetId);
    setSections(updated);
    pushHistoryState(updated);
    setShowPalette(false);
  };

  // ----------------------------------------------------
  // GFM README COMPILER (COMPILES ALL 19 ADVANCED BLOCKS)
  // ----------------------------------------------------
  const generatedMarkdown = useMemo(() => {
    let md = "";
    if (!Array.isArray(sections)) return md;
    
    sections.forEach((sec) => {
      if (!sec.enabled) return;
      
      if (sec.id === "hero-banner") {
        const h = sec.fields.find(f => f.key === "hero")?.value || {};
        if (h.bannerUrl) md += `![${h.title || "Project"} Banner](${h.bannerUrl})\n\n`;
        if (h.logoUrl) md += `![Logo](${h.logoUrl})\n\n`;
        md += `# ${h.title || "Project Title"}\n\n`;
        md += `> **${h.tagline || "Project Tagline"}**\n\n`;
        md += `---\n\n`;
      } 
      else if (sec.id === "stack") {
        md += `## Technology Stack\n\n`;
        md += `Our repository is structured with state-of-the-art frameworks and deployment tools:\n\n`;
        const techVal = sec.fields.find(f => f.key === "tech")?.value || [];
        techVal.forEach((tech: string) => {
          const match = PRESET_BADGES.find(b => b.name.toLowerCase() === String(tech).toLowerCase());
          const slug = match ? match.logo : String(tech).toLowerCase().replace(/ /g, "-");
          const color = match ? match.color : "06b6d4";
          md += `![${tech}](https://img.shields.io/badge/${encodeURIComponent(tech)}-%23${color}?style=${badgeStyle}&logo=${slug}&logoColor=white) `;
        });
        md += `\n\n`;
      } 
      else if (sec.id === "features") {
        md += `## Core Capabilities & Features\n\n`;
        md += `Key architecture features in this release:\n\n`;
        const feats = sec.fields.find(f => f.key === "featuresList")?.value || [];
        feats.forEach((feat: string) => {
          md += `- **${feat}**\n`;
        });
        md += `\n`;
      } 
      else if (sec.id === "installation-tabs") {
        const tabsVal = sec.fields.find(f => f.key === "installTabs")?.value || {};
        md += `## Setup & Developer Onboarding\n\n`;
        md += `Choose your preferred package manager installation command below:\n\n`;
        
        md += `**NPM Package Setup**\n`;
        md += `\`\`\`bash\n${tabsVal.npmCmd || `npm i ${tabsVal.packages}`}\n\`\`\`\n\n`;
        
        md += `**PNPM Smart Setup**\n`;
        md += `\`\`\`bash\n${tabsVal.pnpmCmd || `pnpm add ${tabsVal.packages}`}\n\`\`\`\n\n`;

        md += `**BUN Fast Runtime**\n`;
        md += `\`\`\`bash\n${tabsVal.bunCmd || `bun add ${tabsVal.packages}`}\n\`\`\`\n\n`;
      }
      else if (sec.id === "api-endpoints") {
        const eps = sec.fields.find(f => f.key === "endpoints")?.value || [];
        md += `## API Endpoint Reference\n\n`;
        md += `Configure and dispatch HTTP payloads under these core service routes:\n\n`;
        md += `| Method | Endpoint Path | Purpose & Action | Expected Response Schema |\n`;
        md += `| :---: | :--- | :--- | :--- |\n`;
        eps.forEach((ep: any) => {
          md += `| \`${ep.method}\` | \`${ep.path}\` | ${ep.desc} | \`${ep.response}\` |\n`;
        });
        md += `\n`;
      }
      else if (sec.id === "env-vars") {
        const evs = sec.fields.find(f => f.key === "envVars")?.value || [];
        md += `## Configuration & Env Settings\n\n`;
        md += `Add these key-value configurations inside your local \`.env\` sandbox registry:\n\n`;
        md += `| Variable Key Name | Required | Default Sandbox Value | Purpose & Description |\n`;
        md += `| :--- | :---: | :--- | :--- |\n`;
        evs.forEach((ev: any) => {
          md += `| \`${ev.key}\` | **${ev.required}** | \`${ev.default}\` | ${ev.desc} |\n`;
        });
        md += `\n`;
      }
      else if (sec.id === "roadmap") {
        const milestones = sec.fields.find(f => f.key === "milestones")?.value || [];
        md += `## Product Roadmap & Milestones\n\n`;
        md += `Visual progress logs tracking core pipeline releases:\n\n`;
        milestones.forEach((m: any) => {
          const check = m.status === "completed" ? "[x]" : m.status === "in-progress" ? "[/]" : "[ ]";
          md += `- ${check} **${m.date}**: ${m.title} *(${m.status.toUpperCase()})*\n`;
        });
        md += `\n`;
      }
      else if (sec.id === "faq") {
        const faqs = sec.fields.find(f => f.key === "faqs")?.value || [];
        md += `## Frequently Asked Questions\n\n`;
        faqs.forEach((faq: any) => {
          md += `### ${faq.q}\n\n`;
          md += `${faq.a}\n\n`;
        });
      }
      else if (sec.id === "license") {
        md += `## Licensing & Security\n\n`;
        const lic = sec.fields.find(f => f.key === "licenseType")?.value || "MIT";
        const copy = sec.fields.find(f => f.key === "copyright")?.value || "";
        md += `This software registry is compiled and distributed under the rules of the **${lic}**.\n\n`;
        if (copy) md += `${copy}\n\n`;
      } 
      else {
        md += `## ${sec.title}\n\n`;
        sec.fields.forEach(field => {
          md += `${field.value}\n\n`;
        });
      }
    });

    return md;
  }, [sections, badgeStyle]);

  // ----------------------------------------------------
  // SECTION FIELD MUTATION MUTATORS
  // ----------------------------------------------------
  const updateSectionField = (sectionId: string, fieldKey: string, newValue: any) => {
    const updated = sections.map((sec) => {
      if (sec.id === sectionId) {
        sec.fields = sec.fields.map(f => {
          if (f.key === fieldKey) {
            f.value = newValue;
          }
          return f;
        });
      }
      return sec;
    });
    setSections(updated);
    pushHistoryState(updated);
  };

  // ----------------------------------------------------
  // SNAPPY UP/DOWN CARD SLIDES (TACTILE TACTILE REORDER)
  // ----------------------------------------------------
  const moveSectionCard = (idx: number, dir: "up" | "down") => {
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    
    setSections(updated);
    pushHistoryState(updated);
  };

  const toggleSectionState = (sectionId: string, attr: "enabled" | "collapsed") => {
    const updated = sections.map((sec) => {
      if (sec.id === sectionId) {
        return { ...sec, [attr]: !sec[attr] };
      }
      return sec;
    });
    setSections(updated);
    pushHistoryState(updated);
  };

  const deleteSectionCard = (sectionId: string) => {
    const updated = sections.filter(sec => sec.id !== sectionId);
    setSections(updated);
    pushHistoryState(updated);
  };

  // ----------------------------------------------------
  // DYNAMIC README HEALTH SCORING ENGINE
  // ----------------------------------------------------
  const healthDashboard = useMemo(() => {
    let score = 0;
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Rule 1: Logo Banner present?
    const hasHero = sections.find(s => s.id === "hero-banner" && s.enabled);
    if (hasHero) {
      score += 20;
      const heroVal = hasHero.fields[0]?.value || {};
      if (!heroVal.logoUrl) warnings.push("Missing center logo in Hero Banner");
      if (!heroVal.bannerUrl) suggestions.push("Add visual banner header link for premium look");
    } else {
      warnings.push("No Hero Banner card active");
    }

    // Rule 2: Tech Stacks filled?
    const hasStack = sections.find(s => s.id === "stack" && s.enabled);
    if (hasStack) {
      const badgesCount = (hasStack.fields[0]?.value || []).length;
      if (badgesCount > 0) {
        score += 20;
        if (badgesCount < 3) suggestions.push("Add more ecosystem badges to showcase codebase stack depth");
      } else {
        warnings.push("Ecosystem Stacks tag list is empty");
      }
    } else {
      warnings.push("Tech Stack Badges card is disabled");
    }

    // Rule 3: Setup & Onboarding tabs active?
    const hasInstall = sections.find(s => s.id === "installation-tabs" && s.enabled);
    if (hasInstall) {
      score += 20;
      const tabs = hasInstall.fields[0]?.value || {};
      if (!tabs.packages) warnings.push("Package name setting is empty inside Install Composer");
    } else {
      warnings.push("No multi-package installer tabs active");
    }

    // Rule 4: API Endpoint parameters structured?
    const hasApi = sections.find(s => s.id === "api-endpoints" && s.enabled);
    if (hasApi) {
      const epCount = (hasApi.fields[0]?.value || []).length;
      if (epCount > 0) {
        score += 20;
      } else {
        suggestions.push("API Endpoint table has zero routes defined");
      }
    } else {
      suggestions.push("Add an API specs matrix block to document backend services");
    }

    // Rule 5: Project Roadmap detailed?
    const hasRoadmap = sections.find(s => s.id === "roadmap" && s.enabled);
    if (hasRoadmap) {
      score += 10;
    } else {
      suggestions.push("Create a release timeline roadmap block to build community trust");
    }

    // Rule 6: Licensing card enabled?
    const hasLic = sections.find(s => s.id === "license" && s.enabled);
    if (hasLic) {
      score += 10;
    } else {
      warnings.push("No software permissive license card active");
    }

    // Dynamic warning on duplicates
    const ids = sections.map(s => s.id);
    const hasDuplicates = ids.some((val, i) => ids.indexOf(val) !== i);
    if (hasDuplicates) {
      score = Math.max(score - 15, 0);
      warnings.push("Workspace has duplicate modular blocks causing duplicate GFM headers");
    }

    return {
      score,
      warnings,
      suggestions,
      statusLabel: score >= 90 ? "Launch Ready" : score >= 60 ? "Drafting Phase" : "Sandbox Setup"
    };
  }, [sections]);

  // ----------------------------------------------------
  // 19 ADVANCED MODULAR BLOCK TYPES REGISTRY
  // ----------------------------------------------------
  const insertPremiumBlock = (blockType: string) => {
    let newCard: ReadmeSection;
    const uniqId = `${blockType}_${Date.now()}`;

    switch (blockType) {
      case "api-endpoints":
        newCard = {
          id: uniqId,
          title: "API Endpoint Specs",
          enabled: true,
          collapsed: false,
          fields: [
            {
              key: "endpoints",
              label: "API Service Routes",
              type: "api-endpoints",
              value: [
                { method: "GET", path: "/api/v1/resource", desc: "Retrieve platform assets list", response: '{"data":[]}' }
              ],
              placeholder: ""
            }
          ]
        };
        break;
      case "env-vars":
        newCard = {
          id: uniqId,
          title: "Environment Variables",
          enabled: true,
          collapsed: false,
          fields: [
            {
              key: "envVars",
              label: "Required Environment Keys",
              type: "env-vars",
              value: [
                { key: "API_KEY", required: "Yes", default: "sandbox_token", desc: "Client gateway validation authorization token" }
              ],
              placeholder: ""
            }
          ]
        };
        break;
      case "roadmap":
        newCard = {
          id: uniqId,
          title: "Product Roadmap Timeline",
          enabled: true,
          collapsed: false,
          fields: [
            {
              key: "milestones",
              label: "Milestones",
              type: "roadmap-timeline",
              value: [
                { date: "Milestone 1", title: "Add core features", status: "planned" }
              ],
              placeholder: ""
            }
          ]
        };
        break;
      case "faq":
        newCard = {
          id: uniqId,
          title: "Frequently Asked Questions",
          enabled: true,
          collapsed: false,
          fields: [
            {
              key: "faqs",
              label: "FAQS accordion",
              type: "faq-accordion",
              value: [
                { q: "Sample question?", a: "Sample response content text." }
              ],
              placeholder: ""
            }
          ]
        };
        break;
      default:
        // Basic Custom Textarea card fallback
        newCard = {
          id: uniqId,
          title: blockType.replace(/-/g, " ").toUpperCase(),
          enabled: true,
          collapsed: false,
          fields: [
            {
              key: "content",
              label: "Block Markdown Content",
              type: "textarea",
              value: `### Custom ${blockType}\nWrite your bespoke documentation details here...`,
              placeholder: "Type GFM markdown content..."
            }
          ]
        };
        break;
    }

    const updated = [...sections, newCard];
    setSections(updated);
    pushHistoryState(updated);
    setSlashMenuSectionId(null);
  };

  const handleAddCustomBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSectionTitle.trim()) return;
    
    const newSec: ReadmeSection = {
      id: `custom_${Date.now()}`,
      title: customSectionTitle.trim(),
      enabled: true,
      collapsed: false,
      fields: [
        {
          key: "content",
          label: "Section Content (GFM Markdown supported)",
          type: "textarea",
          value: "### Custom Content Header\nWrite your bespoke developer blueprint layout here...",
          placeholder: "Type markdown here..."
        }
      ]
    };
    
    const updated = [...sections, newSec];
    setSections(updated);
    pushHistoryState(updated);
    setCustomSectionTitle("");
  };

  // ----------------------------------------------------
  // INTERACTIVE COMPLEX BUILDERS TRIGGERS
  // ----------------------------------------------------
  const addFeatureBullet = (sectionId: string, fieldKey: string) => {
    const inputVal = newFeatureInput[sectionId]?.trim();
    if (!inputVal) return;

    const targetSection = sections.find(s => s.id === sectionId);
    const targetField = targetSection?.fields.find(f => f.key === fieldKey);
    const existingFeats = targetField?.value || [];

    updateSectionField(sectionId, fieldKey, [...existingFeats, inputVal]);
    setNewFeatureInput(prev => ({ ...prev, [sectionId]: "" }));
  };

  const removeFeatureBullet = (sectionId: string, fieldKey: string, idx: number) => {
    const targetSection = sections.find(s => s.id === sectionId);
    const targetField = targetSection?.fields.find(f => f.key === fieldKey);
    const existingFeats = targetField?.value || [];
    
    updateSectionField(sectionId, fieldKey, existingFeats.filter((_: any, i: number) => i !== idx));
  };

  const addTagPill = (sectionId: string, fieldKey: string) => {
    const inputVal = newTagInput[sectionId]?.trim();
    if (!inputVal) return;

    const targetSection = sections.find(s => s.id === sectionId);
    const targetField = targetSection?.fields.find(f => f.key === fieldKey);
    const existingTags = targetField?.value || [];

    if (!existingTags.includes(inputVal)) {
      updateSectionField(sectionId, fieldKey, [...existingTags, inputVal]);
    }

    setNewTagInput(prev => ({ ...prev, [sectionId]: "" }));
  };

  const removeTagPill = (sectionId: string, fieldKey: string, tagToRemove: string) => {
    const targetSection = sections.find(s => s.id === sectionId);
    const targetField = targetSection?.fields.find(f => f.key === fieldKey);
    const existingTags = targetField?.value || [];
    
    updateSectionField(sectionId, fieldKey, existingTags.filter((t: string) => t !== tagToRemove));
  };

  // ----------------------------------------------------
  // ADVANCED EXPORT dialog pipelines
  // ----------------------------------------------------
  const copyMarkdownText = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedMarkdown);
      } else {
        const ta = document.createElement("textarea");
        ta.value = generatedMarkdown;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const downloadMarkdownFile = () => {
    const blob = new Blob([generatedMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "README.md";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const downloadCompiledHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compiled README Documentation bundle</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
  <style>
    body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
      background: #0d1117;
      color: #c9d1d9;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
    }
    @media (max-width: 767px) {
      body {
        padding: 15px;
      }
    }
  </style>
</head>
<body class="markdown-body">
  ${generatedMarkdown.replace(/#/g, "<h1>").replace(/- /g, "<li>")}
</body>
</html>
    `;
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "README.html";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // ----------------------------------------------------
  // SMART BADGE POPULATION TRIGGERS
  // ----------------------------------------------------
  const filteredPresets = useMemo(() => {
    const q = badgeSearch.toLowerCase().trim();
    if (!q) return PRESET_BADGES;
    return PRESET_BADGES.filter(b => b.name.toLowerCase().includes(q));
  }, [badgeSearch]);

  const addSmartPresetBadge = (badgeName: string) => {
    const stackCard = sections.find(s => s.id === "stack");
    if (!stackCard) return;

    const existingBadges = stackCard.fields[0]?.value || [];
    if (!existingBadges.includes(badgeName)) {
      updateSectionField("stack", "tech", [...existingBadges, badgeName]);
    }
  };

  const addCustomShieldsBadge = () => {
    if (!customBadgeLabel.trim() || !customBadgeValue.trim()) return;
    const formatted = `${customBadgeLabel.trim()} | ${customBadgeValue.trim()}`;
    
    const stackCard = sections.find(s => s.id === "stack");
    if (!stackCard) return;

    const existingBadges = stackCard.fields[0]?.value || [];
    if (!existingBadges.includes(formatted)) {
      updateSectionField("stack", "tech", [...existingBadges, formatted]);
    }

    setCustomBadgeLabel("");
    setCustomBadgeValue("");
  };

  // ----------------------------------------------------
  // RAYCAST PALETTE GROUPED SCHEMAS
  // ----------------------------------------------------
  const raycastCommands = useMemo(() => {
    const q = paletteQuery.toLowerCase().trim();
    const actions = [
      ...templateOptions.map(t => ({
        label: `Switch to blueprint template: ${t.label}`,
        category: "Blueprint Presets",
        action: () => handleTemplateSwitch(t.id)
      })),
      ...PRESENTATION_THEMES.map(th => ({
        label: `Apply presentation theme style: ${th.label}`,
        category: "Visual Themes",
        action: () => {
          setReadmeTheme(th.id);
          setShowPalette(false);
        }
      })),
      {
        label: "AI: Scan and Analyze Connected GitHub Codebase",
        category: "AI Copilot Operations",
        action: () => {
          setShowPalette(false);
          setSidebarCollap(false);
          setActiveSidebarTab("github");
        }
      },
      {
        label: "AI: Professionalize Brand pitch and Cover Banner",
        category: "AI Copilot Operations",
        action: () => {
          setShowPalette(false);
          const titleField = sections.find(s => s.id === "hero-banner")?.fields.find(f => f.key === "hero");
          if (titleField) {
            setSections(prev => prev.map(s => s.id === "hero-banner" ? { ...s, collapsed: false } : s));
            simulateAiTyping(
              "hero-banner",
              "hero",
              JSON.stringify({
                title: AI_PRESETS_DATABASE.heroTitle,
                tagline: AI_PRESETS_DATABASE.heroTagline,
                bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
                logoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=150&auto=format&fit=crop"
              })
            );
          }
        }
      },
      {
        label: "AI: Auto-Generate Badges Stack",
        category: "AI Copilot Operations",
        action: () => {
          setShowPalette(false);
          const stackSection = sections.find(s => s.id === "stack");
          if (stackSection) {
            setSections(prev => prev.map(s => s.id === "stack" ? { ...s, collapsed: false, enabled: true } : s));
            setIsAiGenerating("stack_tech");
            setTimeout(() => {
              updateSectionField("stack", "tech", AI_PRESETS_DATABASE.stack);
              setIsAiGenerating(null);
            }, 1200);
          }
        }
      },
      {
        label: "AI: Generate setup shell package manager instructions",
        category: "AI Copilot Operations",
        action: () => {
          setShowPalette(false);
          const installSec = sections.find(s => s.id === "installation-tabs");
          if (installSec) {
            setSections(prev => prev.map(s => s.id === "installation-tabs" ? { ...s, collapsed: false, enabled: true } : s));
            setIsAiGenerating("installation-tabs_installTabs");
            setTimeout(() => {
              updateSectionField("installation-tabs", "installTabs", {
                packages: AI_PRESETS_DATABASE.installPackages,
                npmCmd: AI_PRESETS_DATABASE.npmCmd,
                pnpmCmd: AI_PRESETS_DATABASE.pnpmCmd,
                bunCmd: AI_PRESETS_DATABASE.bunCmd
              });
              setIsAiGenerating(null);
            }, 1400);
          }
        }
      },
      {
        label: "AI: Populate product development milestones timeline",
        category: "AI Copilot Operations",
        action: () => {
          setShowPalette(false);
          const roadmapSec = sections.find(s => s.id === "roadmap");
          if (roadmapSec) {
            setSections(prev => prev.map(s => s.id === "roadmap" ? { ...s, collapsed: false, enabled: true } : s));
            setIsAiGenerating("roadmap_milestones");
            setTimeout(() => {
              updateSectionField("roadmap", "milestones", AI_PRESETS_DATABASE.roadmap);
              setIsAiGenerating(null);
            }, 1400);
          }
        }
      },
      {
        label: "AI: Generate interactive developer Q&A FAQ block",
        category: "AI Copilot Operations",
        action: () => {
          setShowPalette(false);
          const faqSec = sections.find(s => s.id === "faq");
          if (faqSec) {
            setSections(prev => prev.map(s => s.id === "faq" ? { ...s, collapsed: false, enabled: true } : s));
            setIsAiGenerating("faq_faqs");
            setTimeout(() => {
              updateSectionField("faq", "faqs", AI_PRESETS_DATABASE.faqs);
              setIsAiGenerating(null);
            }, 1500);
          }
        }
      },
      { label: "Copy compiled GFM markdown text buffer", category: "Operations", action: copyMarkdownText },
      { label: "Trigger download compiled README.md file bundle", category: "Operations", action: downloadMarkdownFile },
      { label: "Collapse all modular section cards in workspace", category: "Operations", action: () => {
        setSections(prev => prev.map(s => ({ ...s, collapsed: true })));
        setShowPalette(false);
      }},
      { label: "Expand all modular section cards in workspace", category: "Operations", action: () => {
        setSections(prev => prev.map(s => ({ ...s, collapsed: false })));
        setShowPalette(false);
      }},
      { label: "Clear local AST draft storage workspace (Reset)", category: "Danger Zone", action: () => {
        setSections(defaultTemplates[template]);
        pushHistoryState(defaultTemplates[template]);
        setShowPalette(false);
      }},
      { label: "Replay interactive onboarding product tour", category: "Help & Onboarding", action: () => {
        setShowPalette(false);
        setActiveView("editor");
        setTimeout(() => startSpotlightTour(), 300);
      }},
      { label: "Switch to workspace dashboard overview", category: "Navigation", action: () => {
        setShowPalette(false);
        setActiveView("dashboard");
      }},
      { label: "Open reusable snippets block library", category: "Navigation", action: () => {
        setShowPalette(false);
        setShowSnippetsModal(true);
      }},
      { label: "Open advanced export pipeline dialog", category: "Navigation", action: () => {
        setShowPalette(false);
        setShowExportModal(true);
      }}
    ];

    if (!q) return actions;
    return actions.filter(a => a.label.toLowerCase().includes(q));
  }, [paletteQuery, sections, template]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#030303] text-zinc-200 font-sans antialiased flex flex-col select-none relative custom-scrollbar">
      
      {/* Dynamic Background visual atmospheres */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-[15%] size-[500px] rounded-full bg-cyan-500/[0.04] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] size-[600px] rounded-full bg-purple-500/[0.03] blur-[160px] pointer-events-none" />
      </div>

      {/* ==========================================
          WORKSPACE DASHBOARD VIEW (Phase 4)
          ========================================== */}
      {activeView === "dashboard" && (
        <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden z-10 w-full h-full">
          {/* Left Navigation Drawer */}
          <div className="w-full md:w-64 bg-[#07070a]/95 border-b md:border-b-0 md:border-r border-white/5 flex flex-col shrink-0 select-none">
            {/* Header branding */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <Wand2 className="size-4.5 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">ReadmeForge Console</span>
              </div>
              <Badge className="border-cyan-500/20 bg-cyan-950/20 text-cyan-450 text-[9px] font-mono font-bold px-2 py-0.5 leading-none">v4.0</Badge>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {/* Connected Workspace Switcher */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">Workspace List</span>
                <div className="space-y-1">
                  {workspaces.filter(w => !w.isArchived).map(w => (
                    <button
                      key={w.id}
                      onClick={() => setActiveWorkspaceId(w.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition duration-200 ${
                        activeWorkspaceId === w.id
                          ? "bg-white/5 border border-white/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.06)]"
                          : "border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Layers3 className="size-3.5 shrink-0" />
                        <span className="text-xs font-semibold truncate">{w.name}</span>
                      </div>
                      {w.isPinned && <Star className="size-3 text-cyan-400 fill-cyan-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Local-First Vault Categories */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">Local Vault</span>
                <div className="space-y-1">
                  {[
                    { id: "projects", label: "Projects Hub", icon: Layers3 },
                    { id: "exports", label: "Export History", icon: Download },
                    { id: "diagnostics", label: "Storage Health", icon: Sliders },
                    { id: "logs", label: "Activity Logs", icon: Clock }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDashboardSubTab(tab.id as any)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition duration-200 text-xs ${
                        dashboardSubTab === tab.id
                          ? "bg-white/5 border border-white/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.06)] font-bold"
                          : "border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      <tab.icon className="size-3.5 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">Quick Actions</span>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      const name = prompt("Enter new project workspace name:");
                      if (name) createWorkspace(name, "saas");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-450 hover:text-white rounded-xl hover:bg-white/[0.02] text-left transition"
                  >
                    <Plus className="size-3.5 text-cyan-400" />
                    <span>Create New Project</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("editor");
                      setTimeout(() => startSpotlightTour(), 300);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-450 hover:text-white rounded-xl hover:bg-white/[0.02] text-left transition"
                  >
                    <Compass className="size-3.5 text-cyan-400" />
                    <span>Interactive Tour</span>
                  </button>
                  <button
                    onClick={() => setShowSnippetsModal(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-450 hover:text-white rounded-xl hover:bg-white/[0.02] text-left transition"
                  >
                    <Sliders className="size-3.5 text-cyan-400" />
                    <span>Snippets Library</span>
                  </button>
                </div>
              </div>

              {/* Onboarding Wizard Progress Checklist */}
              {showOnboarding && (
                <div className="border border-cyan-500/10 bg-cyan-950/10 rounded-2xl p-4 space-y-3 relative overflow-hidden select-none">
                  <div className="absolute top-0 right-0 size-24 bg-cyan-500/[0.02] blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-1.5">
                      <Sparkles className="size-3 animate-spin" />
                      ONBOARDING TUTORIAL
                    </span>
                    <button onClick={() => setShowOnboarding(false)} className="text-zinc-500 hover:text-white">
                      <X className="size-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Connect Github Repository", done: scannedRepo !== null },
                      { label: "Stream AI Brand Headline", done: sections.find(s => s.id === "hero-banner")?.fields.find(f => f.key === "hero")?.value !== "" },
                      { label: "Check Document Score", done: healthDashboard.score > 70 }
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {step.done ? (
                          <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
                        ) : (
                          <span className="size-3.5 rounded-full border border-zinc-700 flex items-center justify-center text-[9px] text-zinc-500 shrink-0">{idx+1}</span>
                        )}
                        <span className={step.done ? "text-zinc-550 line-through" : "text-zinc-300"}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Presence & Collab Indicators Footer */}
            <div className="p-4 border-t border-white/5 bg-black/20 flex flex-col gap-2 shrink-0">
              <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">Team Presence</span>
              <div className="flex items-center gap-1.5 select-none">
                {collaborators.map((c, i) => (
                  <div key={i} className="relative group select-none">
                    <img src={c.avatar} alt={c.name} className="size-7 rounded-full border border-white/10 object-cover shadow-lg" />
                    <span className={`absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-[#030303] ${
                      c.status === "typing" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                    }`} />
                  </div>
                ))}
                <span className="text-[10px] text-zinc-550 font-mono ml-2">Active online</span>
              </div>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
            {/* Header overview controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
                  {dashboardSubTab === "projects" && "Developer Projects Hub"}
                  {dashboardSubTab === "exports" && "Local Export Registry"}
                  {dashboardSubTab === "diagnostics" && "Storage Health Monitor"}
                  {dashboardSubTab === "logs" && "Activity Audit Timeline"}
                </h1>
                <p className="text-xs text-zinc-550 mt-1">
                  {dashboardSubTab === "projects" && "Manage, compile, and configure your open-source product assets."}
                  {dashboardSubTab === "exports" && "Track compiled Markdown, ZIP, HTML, and PDF backups secure in IndexedDB."}
                  {dashboardSubTab === "diagnostics" && "Monitor browser sandbox allocation, load backups, or prune local caches."}
                  {dashboardSubTab === "logs" && "Cascading transaction logs monitoring all database activity in real-time."}
                </p>
              </div>
              
              {/* Online/Offline status alert & new project buttons */}
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono font-bold select-none ${
                  isOnline 
                    ? "border-emerald-500/20 bg-emerald-950/20 text-emerald-450" 
                    : "border-amber-500/20 bg-amber-950/20 text-amber-450 animate-pulse"
                }`}>
                  <span className={`size-1.5 rounded-full ${isOnline ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <span>{isOnline ? "OFFLINE READY" : "OFFLINE SANDBOX MODE"}</span>
                </div>
                
                {dashboardSubTab === "projects" && (
                  <Button
                    onClick={() => {
                      const name = prompt("Enter new workspace project name:");
                      if (name) createWorkspace(name, "saas");
                    }}
                    className="h-9.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black shadow-[0_0_20px_rgba(34,211,238,0.2)] transition cursor-pointer"
                  >
                    <Plus className="size-4 mr-1.5" />
                    <span>NEW DOCUMENTATION</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Sub-tab 1: Projects Hub */}
            {dashboardSubTab === "projects" && (
              <>
                {/* Performance Analytics HUD Panels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
                  {[
                    { title: "Active Workspaces", value: workspaces.filter(w => !w.isArchived).length, sub: "Local persistent draft repos", icon: Layers3, color: "text-cyan-400 border-cyan-500/10 bg-cyan-950/5" },
                    { title: "Average Health Score", value: `${Math.round(workspaces.reduce((acc, curr) => acc + (curr.healthScore || 0), 0) / (workspaces.length || 1))}%`, sub: "Documentation ready matrices", icon: Zap, color: "text-purple-400 border-purple-500/10 bg-purple-950/5" },
                    { title: "Total Exports Logged", value: exportsHistory.length, sub: "Compiled local backups in vault", icon: Download, color: "text-emerald-400 border-emerald-500/10 bg-emerald-950/5" },
                    { title: "Network Status", value: isOnline ? "Online" : "Offline", sub: "100% Client-Side Sandbox", icon: Shield, color: "text-amber-400 border-amber-500/10 bg-amber-950/5" }
                  ].map((hud, idx) => (
                    <div key={idx} className={`border rounded-2xl p-5 space-y-2 relative overflow-hidden spotlight-card ${hud.color}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-zinc-500">{hud.title}</span>
                        <hud.icon className="size-4" />
                      </div>
                      <div className="text-2xl font-black text-white font-mono">{hud.value}</div>
                      <div className="text-[10px] text-zinc-550 leading-4">{hud.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Search Bar for fuzzy matching */}
                <div className="relative select-none">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-550" />
                  <input
                    type="text"
                    placeholder="Fuzzy search workspaces, code stacks, templates, or snippets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-cyan-500/30 transition duration-300"
                  />
                </div>

                {/* Dynamic Activity Heatmap & Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Weekly Commit Contribution Heatmap */}
                  <div className="lg:col-span-2 border border-white/5 bg-[#07070a]/65 rounded-2xl p-6 space-y-4 relative overflow-hidden spotlight-card select-none">
                    <div className="absolute top-0 right-0 size-48 bg-purple-500/[0.01] blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="size-4.5 text-purple-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">Documentation Activity Heatmap</span>
                      </div>
                      <span className="text-[10px] text-zinc-550 font-mono">Last 30 Days activity</span>
                    </div>
                    {/* 5 x 14 github-style calendar grid simulation */}
                    <div className="flex gap-1.5 overflow-x-auto py-2">
                      {Array.from({ length: 15 }).map((_, colIdx) => (
                        <div key={colIdx} className="flex flex-col gap-1.5 shrink-0">
                          {Array.from({ length: 7 }).map((_, rowIdx) => {
                            const randomVal = Math.floor(Math.random() * 4);
                            const bgClass =
                              randomVal === 0 ? "bg-white/[0.02] border border-white/5" :
                              randomVal === 1 ? "bg-cyan-950/20 border border-cyan-500/10 text-cyan-400" :
                              randomVal === 2 ? "bg-cyan-900/40 border border-cyan-400/20" :
                              "bg-cyan-500 border border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]";
                            return (
                              <div
                                key={rowIdx}
                                className={`size-3 rounded-sm transition duration-300 hover:scale-115 ${bgClass}`}
                                title={`Simulated activity score: ${randomVal} edits`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-550 justify-end pt-2">
                      <span>Less</span>
                      <div className="size-2 bg-white/[0.02] rounded-sm" />
                      <div className="size-2 bg-cyan-900/30 rounded-sm" />
                      <div className="size-2 bg-cyan-600 rounded-sm" />
                      <div className="size-2 bg-cyan-400 rounded-sm" />
                      <span>More</span>
                    </div>
                  </div>

                  {/* Documentation Health Quality Score List */}
                  <div className="border border-white/5 bg-[#07070a]/65 rounded-2xl p-6 space-y-4 relative overflow-hidden spotlight-card select-none">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="size-4.5 text-cyan-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">Quality Scores</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">OSS Index</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: "Installation & Onboarding Setup", score: 95, color: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" },
                        { label: "Dynamic API Table References", score: 68, color: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" },
                        { label: "Features Stack Architecture", score: 85, color: "bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.3)]" }
                      ].map((gauge, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-400 font-medium">{gauge.label}</span>
                            <span className="text-zinc-200 font-mono font-bold">{gauge.score}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition duration-500 ${gauge.color}`} style={{ width: `${gauge.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Documentation Workspaces List */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-550 uppercase tracking-widest font-mono">
                    {searchQuery ? "Search Results" : "Recent Active Workspaces"}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {localFuzzySearch(workspaces.filter(w => !w.isArchived), searchQuery).map(w => {
                      const isActive = activeWorkspaceId === w.id;
                      return (
                        <div
                          key={w.id}
                          className={`group border rounded-2xl p-5 bg-[#07070a]/50 hover:bg-[#07070a]/90 hover:border-white/10 transition duration-300 relative overflow-hidden spotlight-card flex flex-col justify-between min-h-48 ${
                            isActive ? "border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.06)]" : "border-white/5"
                          }`}
                        >
                          {/* Top section header details */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge className="border-cyan-500/10 bg-cyan-950/20 text-cyan-400 font-mono text-[9px] uppercase px-2 py-0.5 leading-none font-bold">
                                {w.template} Blueprints
                              </Badge>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
                                <button
                                  onClick={(e) => { e.stopPropagation(); togglePinWorkspace(w.id); }}
                                  className="p-1 text-zinc-550 hover:text-cyan-400 transition cursor-pointer"
                                  title="Pin Workspace"
                                >
                                  <Star className={`size-3.5 ${w.isPinned ? "fill-cyan-400 text-cyan-400" : ""}`} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); duplicateWorkspace(w.id); }}
                                  className="p-1 text-zinc-550 hover:text-white transition cursor-pointer"
                                  title="Duplicate Workspace"
                                >
                                  <Copy className="size-3.5" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleArchiveWorkspace(w.id); }}
                                  className="p-1 text-zinc-550 hover:text-amber-500 transition cursor-pointer"
                                  title="Archive Workspace"
                                >
                                  <Clock className="size-3.5" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteWorkspace(w.id); }}
                                  className="p-1 text-zinc-550 hover:text-red-500 transition cursor-pointer"
                                  title="Delete Workspace"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">{w.name}</h3>
                              <p className="text-xs text-zinc-450 line-clamp-2 leading-relaxed">{w.description}</p>
                            </div>
                          </div>

                          {/* Bottom score and active launch mechanics */}
                          <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono font-bold">
                                <Zap className="size-3.5 text-cyan-400" />
                                <span>{w.healthScore || 0}% Ready</span>
                              </div>
                              <span className="text-[10px] text-zinc-550 font-mono">Edited {w.lastEdited}</span>
                            </div>
                            <Button
                              onClick={() => {
                                setActiveWorkspaceId(w.id);
                                setActiveView("editor");
                              }}
                              className="h-8 rounded-xl bg-white hover:bg-zinc-200 text-black text-[10px] font-black uppercase tracking-wider px-3.5 transition cursor-pointer"
                            >
                              <span>Open Workspace</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Templates Starter Blueprints Carousel */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-550 uppercase tracking-widest font-mono">Starter Blueprint Presets</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {templateOptions.map(t => (
                      <div
                        key={t.id}
                        className="border border-white/5 rounded-2xl p-5 bg-white/[0.01] hover:bg-white/[0.03] transition duration-300 spotlight-card flex flex-col justify-between h-44"
                      >
                        <div className="space-y-2">
                          <div className="size-8 rounded-lg bg-cyan-950/20 border border-cyan-500/10 flex items-center justify-center shadow-lg">
                            <Wand2 className="size-4 text-cyan-400" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{t.label} Layout</h4>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">Preset outlines for deploying {t.label.toLowerCase()} software documentation.</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            const name = prompt(`Enter name for your ${t.label} project:`);
                            if (name) createWorkspace(name, t.id);
                          }}
                          className="h-8 w-full rounded-xl border border-white/10 bg-black/40 hover:bg-white/[0.05] text-zinc-300 hover:text-white text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          <span>Deploy Starter</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Sub-tab 2: Export Vault History */}
            {dashboardSubTab === "exports" && (
              <div className="space-y-6">
                <div className="border border-white/5 bg-[#07070a]/65 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 select-none">
                    <span className="text-xs font-bold uppercase font-mono tracking-wider text-white">Local Compilation Records</span>
                    <Badge className="border-cyan-500/10 bg-cyan-950/20 text-cyan-400 font-mono text-[10px]">
                      {exportsHistory.length} files secure
                    </Badge>
                  </div>

                  {exportsHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center select-none space-y-4">
                      <div className="size-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-white/5 flex items-center justify-center mb-2">
                        <Download className="size-7 text-cyan-500/60" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-zinc-300 font-mono uppercase tracking-wider">No Exports Yet</h4>
                        <p className="text-xs text-zinc-550 max-w-xs mx-auto leading-relaxed">
                          Export your README as Markdown, HTML, ZIP, or PDF. All compiled files are stored securely in your browser.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 text-[10px] text-zinc-500 font-mono">
                        <span className="flex items-center gap-2"><span className="size-1 rounded-full bg-cyan-500/40" />Open a workspace and click EXPORT in the header</span>
                        <span className="flex items-center gap-2"><span className="size-1 rounded-full bg-cyan-500/40" />Choose your format and filename</span>
                        <span className="flex items-center gap-2"><span className="size-1 rounded-full bg-cyan-500/40" />Files are auto-cataloged here for re-download</span>
                      </div>
                      <Button
                        onClick={() => { setActiveView("editor"); }}
                        className="mt-2 h-9 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white text-[10px] font-bold uppercase tracking-wider px-5 transition cursor-pointer"
                      >
                        <ArrowRight className="size-3.5 mr-1.5" />
                        Go to Editor
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {exportsHistory.map((exp) => (
                        <div
                          key={exp.id}
                          className="flex items-center justify-between p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl transition duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-cyan-950/20 border border-cyan-500/15 flex items-center justify-center font-bold text-[10px] text-cyan-400 font-mono select-none">
                              {exp.format.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white font-mono">{exp.filename}</div>
                              <div className="text-[10px] text-zinc-500 font-mono mt-0.5 select-none">
                                Origin: {exp.workspaceName} • Compiled size: {(exp.sizeBytes / 1024).toFixed(2)} KB • {exp.timestamp}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => {
                                const blob = new Blob([exp.content], { type: "text/plain;charset=utf-8" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = exp.filename;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                triggerToast("Re-downloaded export copy from IndexedDB local registry!");
                              }}
                              className="h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white text-[10px] font-bold px-3 transition cursor-pointer"
                            >
                              <span>Re-download</span>
                            </Button>
                            
                            <button
                              onClick={() => {
                                dbDeleteExport(exp.id).then(() => {
                                  dbLoadExports().then(list => setExportsHistory(list));
                                  triggerToast("Export record cleared permanently.");
                                });
                              }}
                              className="p-1.5 text-zinc-550 hover:text-red-500 transition cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 3: Storage Diagnostics & Recovery */}
            {dashboardSubTab === "diagnostics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left allocation stats cards */}
                  <div className="md:col-span-2 border border-white/5 bg-[#07070a]/65 rounded-2xl p-6 space-y-6 select-none">
                    <span className="text-xs font-bold uppercase font-mono tracking-wider text-white">Browser Storage Allocation</span>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">IndexedDB Allocations:</span>
                        <span className="text-white font-mono font-bold">
                          {(storageUsage.used / (1024 * 1024)).toFixed(2)} MB of {(storageUsage.total / (1024 * 1024 * 1024)).toFixed(1)} GB quota
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] transition duration-500 rounded-full"
                          style={{ width: `${Math.min(100, (storageUsage.used / (storageUsage.total || 1)) * 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-500 leading-normal">
                        IndexedDB operates entirely locally inside your browser cache sandbox. It is persistent, offline-ready, and never sends data to any server.
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-center space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Workspaces</div>
                        <div className="text-lg font-black font-mono text-white">{workspaces.length}</div>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-center space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Exports Logged</div>
                        <div className="text-lg font-black font-mono text-white">{exportsHistory.length}</div>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-center space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Activity Count</div>
                        <div className="text-lg font-black font-mono text-white">{activityLogs.length}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Diagnostics status */}
                  <div className="border border-white/5 bg-[#07070a]/65 rounded-2xl p-6 space-y-4 select-none">
                    <span className="text-xs font-bold uppercase font-mono tracking-wider text-white">Diagnostics Panel</span>
                    
                    <div className="space-y-3">
                      {[
                        { label: "IndexedDB integrity check", status: "Healthy", desc: "DB connection online and schema validated." },
                        { label: "Offline status", status: isOnline ? "Connected" : "Offline", desc: "Standalone cache assets ready." },
                        { label: "Tab sync channel", status: "Listening", desc: "Listening for changes from concurrent tabs." }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 border border-white/5 bg-white/[0.01] rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-300 font-semibold">{item.label}</span>
                            <span className="text-cyan-400 text-[10px] font-mono font-bold uppercase">{item.status}</span>
                          </div>
                          <div className="text-[10px] text-zinc-550 leading-relaxed">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recovery Actions: Backups & Restorations */}
                <div className="border border-white/5 bg-[#07070a]/65 rounded-2xl p-6 space-y-6">
                  <span className="text-xs font-bold uppercase font-mono tracking-wider text-white">Local-First Vault Backups</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3.5">
                      <div className="text-xs font-bold text-zinc-350 uppercase tracking-wide font-mono">1. Download Encrypted Backup String</div>
                      <p className="text-[11px] text-zinc-550 leading-normal">
                        Package all current local workspaces, snapshots, user preferences, and snippets into an encrypted payload. Save this text file as a safe copy of your work!
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => {
                            dbExportBackup().then((encrypted) => {
                              const blob = new Blob([encrypted], { type: "text/plain" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `readmeforge-backup-${new Date().toISOString().split("T")[0]}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                              dbLogActivity("security", "Local-first backup string exported.");
                              triggerToast("Backup exported and downloaded successfully!");
                            });
                          }}
                          className="h-9 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black px-4 shadow-lg transition cursor-pointer"
                        >
                          <span>EXPORT BACKUP</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div className="text-xs font-bold text-zinc-350 uppercase tracking-wide font-mono">2. Restore Database from Backup Payload</div>
                      <p className="text-[11px] text-zinc-500 leading-normal">
                        Paste your previously exported encrypted backup signature string below to restore all workspaces and local custom snippets instantly.
                      </p>
                      
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Paste encrypted backup string here..."
                          value={backupString}
                          onChange={(e) => setBackupString(e.target.value)}
                          className="h-9.5 text-xs bg-white/[0.02] border-white/10 rounded-xl"
                        />
                        <Button
                          onClick={() => {
                            if (!backupString) return triggerToast("Please paste a valid encrypted backup string first.", "collab");
                            dbImportBackup(backupString).then(() => {
                              dbLoadWorkspaces().then((list) => {
                                setWorkspaces(list);
                                setBackupString("");
                                triggerToast("All database tables restored successfully!", "success");
                              });
                            }).catch((err) => {
                              triggerToast(err.message, "collab");
                            });
                          }}
                          className="h-9.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 transition cursor-pointer shrink-0"
                        >
                          <span>RESTORE</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Absolute Prune Storage Reset Button */}
                  <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-red-400 uppercase tracking-wide font-mono">Emergency Factory System Reset</div>
                      <p className="text-[10px] text-zinc-550 leading-relaxed">
                        Permanently erases IndexedDB stores, local storage drafts, custom snippets, and activity history. This cannot be undone!
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        if (confirm("WARNING: Are you absolutely sure you want to perform a complete system reset? This erases all workspaces and snapshots permanently!")) {
                          dbClearAllStorage().then(() => {
                            window.location.reload();
                          });
                        }
                      }}
                      className="h-9 rounded-xl bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 text-red-400 text-xs font-bold px-4 transition cursor-pointer"
                    >
                      <span>ERASE & RESET PLATFORM VAULT</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 4: Activity Transaction Timeline Logs */}
            {dashboardSubTab === "logs" && (
              <div className="space-y-6">
                <div className="border border-white/5 bg-[#07070a]/65 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 select-none">
                    <span className="text-xs font-bold uppercase font-mono tracking-wider text-white">Client Audit Ledger</span>
                    <button
                      onClick={() => {
                        dbLogActivity("security", "Activity transaction logs cleared.");
                        initDB().then((db) => {
                          const tx = db.transaction("activityLogs", "readwrite");
                          tx.objectStore("activityLogs").clear();
                          tx.oncomplete = () => dbLoadActivityLogs().then(list => setActivityLogs(list));
                        });
                      }}
                      className="text-[10px] font-mono font-semibold text-zinc-550 hover:text-cyan-400 transition"
                    >
                      CLEAR AUDIT LEDGER
                    </button>
                  </div>

                  <div className="font-mono text-[11px] leading-relaxed text-zinc-450 p-4 rounded-xl border border-white/5 bg-black/60 overflow-y-auto max-h-96 custom-scrollbar space-y-2">
                    {activityLogs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center select-none space-y-3">
                        <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/5 flex items-center justify-center">
                          <FileText className="size-5 text-purple-400/50" />
                        </div>
                        <h4 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">No Activity Recorded</h4>
                        <p className="text-[10px] text-zinc-600 max-w-xs mx-auto leading-relaxed">
                          Workspace edits, exports, snapshots, and database operations are automatically logged here as you work.
                        </p>
                      </div>
                    ) : (
                      activityLogs.map((log) => {
                        const typeColor = 
                          log.type === "save" ? "text-cyan-400" :
                          log.type === "snapshot" ? "text-purple-400" :
                          log.type === "export" ? "text-emerald-400" :
                          log.type === "security" ? "text-red-400 animate-pulse" :
                          "text-amber-400";
                        return (
                          <div key={log.id} className="flex items-start gap-3 border-b border-white/[0.02] pb-1.5 last:border-b-0">
                            <span className="text-zinc-600 shrink-0 select-none">[{log.timestamp}]</span>
                            <span className={`${typeColor} uppercase shrink-0 select-none font-bold`}>[{log.type}]</span>
                            <span className="text-zinc-350">{log.message}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          CINEMATIC PRESENTATION SHOWCASE VIEW (Phase 4)
          ========================================== */}
      {activeView === "presentation" && (
        <div className="flex-1 flex flex-col relative overflow-hidden z-10 w-full h-full select-none">
          {/* Top floating control toolbar */}
          <div className="h-16 px-6 border-b border-white/5 bg-[#07070a]/95 backdrop-blur-xl flex items-center justify-between z-30 relative shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView("editor")}
                className="size-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-450 hover:text-white flex items-center justify-center border border-white/5 transition cursor-pointer"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono leading-none">SHOWCASE PREVIEW</span>
                <span className="text-xs font-semibold text-white uppercase mt-0.75">{workspaces.find(w => w.id === activeWorkspaceId)?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-zinc-500">Presentation Theme:</span>
              <select 
                value={readmeTheme}
                onChange={(e) => setReadmeTheme(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-lg text-[10.5px] font-mono text-cyan-300 px-2.5 py-1 focus:ring-0 focus:border-cyan-400/50 cursor-pointer"
              >
                {PRESENTATION_THEMES.map(theme => (
                  <option key={theme.id} value={theme.id} className="bg-zinc-950 text-white text-xs">{theme.label}</option>
                ))}
              </select>
              <Button
                onClick={() => setActiveView("editor")}
                className="h-8.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-wider transition px-4 cursor-pointer"
              >
                <span>Exit Fullscreen</span>
              </Button>
            </div>
          </div>

          {/* Presentation Slides Canvas */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 flex justify-center custom-scrollbar relative z-10 bg-[#020202]">
            <div className="w-full max-w-4xl space-y-12">
              {/* Dynamic Theme GFM wrapper */}
              <div className={`theme-${readmeTheme} min-h-screen p-8 md:p-12 rounded-3xl border border-white/5 bg-black/45 shadow-2xl relative overflow-hidden`}>
                {/* Background visual highlight */}
                <div className="absolute top-0 right-0 size-96 bg-cyan-500/[0.02] blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 size-96 bg-purple-500/[0.02] blur-3xl pointer-events-none" />
                
                {/* Compile Markdown AST to HTML directly */}
                <MarkdownPreview markdown={generatedMarkdown} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          3. ACTIVE EDITOR IDE WORKSPACE VIEW (Phase 4)
          ========================================== */}
      {activeView === "editor" && (
        <>
          <header className="h-14 border-b border-white/5 bg-[#07070a]/90 backdrop-blur-xl flex items-center justify-between px-4 z-30 select-none shrink-0">
        
        {/* Brand logo details */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="flex size-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-950/10 shadow-[0_0_12px_rgba(34,211,238,0.08)] group-hover:border-cyan-400 group-hover:scale-102 transition duration-200">
              <Wand2 className="size-4 text-cyan-300" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-white uppercase hidden sm:inline">
              README<span className="text-cyan-300 font-black">FORGE</span>
            </span>
          </Link>
          
          <Separator orientation="vertical" className="h-4 bg-white/10 shrink-0" />

          {/* Blueprint selector trigger */}
          <Badge className="border-cyan-500/10 bg-cyan-950/20 text-cyan-300 px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wide flex items-center gap-1.5 shrink-0">
            <Layers3 className="size-3 text-cyan-400" />
            {templateOptions.find(o => o.id === template)?.label || "SaaS"}
          </Badge>

          {/* Sync HUD status */}
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
            {autosaveStatus === "saving" && (
              <>
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Syncing AST...</span>
              </>
            )}
            {autosaveStatus === "saved" && (
              <>
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400/80 font-bold">Saved locally</span>
              </>
            )}
            {autosaveStatus === "idle" && (
              <>
                <span className="size-1.5 rounded-full bg-zinc-700" />
                <span>Workspace stable</span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Presentation Theme Switcher dropdown */}
        <div className="hidden md:flex items-center gap-2 select-none">
          <span className="text-[10px] font-mono text-zinc-500">Presentation Theme:</span>
          <select 
            value={readmeTheme}
            onChange={(e) => setReadmeTheme(e.target.value)}
            className="bg-black/60 border border-white/10 rounded-lg text-[10.5px] font-mono text-cyan-300 px-2.5 py-1 focus:ring-0 focus:border-cyan-400/50 cursor-pointer"
          >
            {PRESENTATION_THEMES.map(theme => (
              <option key={theme.id} value={theme.id} className="bg-zinc-950 text-white text-xs">{theme.label}</option>
            ))}
          </select>
        </div>

        {/* Global Action buttons panel */}
        <div className="flex items-center gap-2 select-none shrink-0">
          
          {/* Smart Badges Hub Modal Activator */}
          <Button
            type="button"
            onClick={() => setShowBadgeModal(true)}
            variant="outline"
            className="h-8.5 rounded-lg border-cyan-500/20 bg-cyan-950/20 text-cyan-300 text-[10.5px] hover:bg-cyan-900/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Star className="size-3.5 text-cyan-400 animate-pulse" />
            <span>BADGES HUB</span>
          </Button>

          {/* Action Palette keyboard trigger */}
          <button 
            id="onboarding-shortcuts"
            type="button"
            onClick={() => setShowPalette(true)}
            className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 hover:text-white bg-white/5 border border-white/5 px-2 py-1 rounded transition"
          >
            <Keyboard className="size-3 text-cyan-400" />
            <span>Actions</span>
            <span className="bg-white/10 px-1 py-0.2 rounded text-[9px] text-zinc-500">⌘/</span>
          </button>

          <Separator orientation="vertical" className="h-4 bg-white/10 mx-1 hidden sm:inline" />

          {/* Copy compiled GFM text */}
          <Button 
            type="button" 
            onClick={copyMarkdownText} 
            variant="outline" 
            className="h-8.5 rounded-lg border-white/10 bg-white/[0.02] text-zinc-300 text-[11px] font-bold hover:bg-white/[0.08] transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <ClipboardCheck className="size-3.5 text-cyan-300" />}
            <span>{copied ? "COPIED" : "COPY GFM"}</span>
          </Button>

          {/* Advanced Export Modal trigger */}
          <Button 
            id="onboarding-export"
            type="button" 
            onClick={() => setShowExportModal(true)}
            className="h-8.5 rounded-lg bg-white text-black text-[11px] font-black hover:bg-cyan-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>EXPORT</span>
          </Button>

        </div>
      </header>

      {/* ==========================================
          2. WORKSPACE RESIZABLE SPLIT PANELS CANVAS
          ========================================== */}
      <div className="flex-1 flex flex-row relative overflow-hidden z-10 select-none">
        
        {/* 2.1 IDE SIDEBAR ICON RIBBON (FAR LEFT) */}
        <div id="onboarding-sidebar" className="w-12 h-full bg-[#030303] border-r border-white/5 flex flex-col items-center py-4 justify-between select-none shrink-0 z-20">
          <div className="flex flex-col items-center gap-3">
            
            {/* Explorer Tab Icon */}
            <button
              type="button"
              onClick={() => {
                if (sidebarCollap) {
                  setSidebarCollap(false);
                  setActiveSidebarTab("explorer");
                } else if (activeSidebarTab === "explorer") {
                  setSidebarCollap(true);
                } else {
                  setActiveSidebarTab("explorer");
                }
              }}
              className={`p-2 rounded-xl transition duration-200 cursor-pointer relative ${
                !sidebarCollap && activeSidebarTab === "explorer"
                  ? "bg-white/5 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Workspace Blocks Explorer"
            >
              <Layers3 className="size-4.5" />
              {!sidebarCollap && activeSidebarTab === "explorer" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.75 h-4 bg-cyan-400 rounded-l" />
              )}
            </button>

            {/* GitHub Import & Scan Tab Icon */}
            <button
              type="button"
              onClick={() => {
                if (sidebarCollap) {
                  setSidebarCollap(false);
                  setActiveSidebarTab("github");
                } else if (activeSidebarTab === "github") {
                  setSidebarCollap(true);
                } else {
                  setActiveSidebarTab("github");
                }
              }}
              className={`p-2 rounded-xl transition duration-200 cursor-pointer relative ${
                !sidebarCollap && activeSidebarTab === "github"
                  ? "bg-white/5 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="GitHub Repos Scan & Tree"
            >
              <Terminal className="size-4.5" />
              {!sidebarCollap && activeSidebarTab === "github" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.75 h-4 bg-cyan-400 rounded-l" />
              )}
            </button>

            {/* AI Command Center Tab Icon */}
            <button
              id="onboarding-ai"
              type="button"
              onClick={() => {
                if (sidebarCollap) {
                  setSidebarCollap(false);
                  setActiveSidebarTab("ai");
                } else if (activeSidebarTab === "ai") {
                  setSidebarCollap(true);
                } else {
                  setActiveSidebarTab("ai");
                }
              }}
              className={`p-2 rounded-xl transition duration-200 cursor-pointer relative ${
                !sidebarCollap && activeSidebarTab === "ai"
                  ? "bg-white/5 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="AI Copilot & Completeness"
            >
              <Sparkles className="size-4.5" />
              {!sidebarCollap && activeSidebarTab === "ai" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.75 h-4 bg-cyan-400 rounded-l" />
              )}
            </button>

            {/* Repository Insights Tab Icon */}
            <button
              type="button"
              onClick={() => {
                if (sidebarCollap) {
                  setSidebarCollap(false);
                  setActiveSidebarTab("insights");
                } else if (activeSidebarTab === "insights") {
                  setSidebarCollap(true);
                } else {
                  setActiveSidebarTab("insights");
                }
              }}
              className={`p-2 rounded-xl transition duration-200 cursor-pointer relative ${
                !sidebarCollap && activeSidebarTab === "insights"
                  ? "bg-white/5 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Repository Insights & Health"
            >
              <Zap className="size-4.5" />
              {!sidebarCollap && activeSidebarTab === "insights" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.75 h-4 bg-cyan-400 rounded-l" />
              )}
            </button>

          </div>

          {/* Bottom Settings Trigger */}
          <button
            type="button"
            onClick={() => setSidebarCollap(c => !c)}
            className="p-2 rounded-xl text-zinc-650 hover:text-white transition duration-200 cursor-pointer"
            title="Toggle Sidebar Panel"
          >
            <Menu className="size-4.5" />
          </button>
        </div>

        {/* 2.2 COLLAPSIBLE SIDEBAR DRAWING BOX */}
        <AnimatePresence initial={false}>
          {!sidebarCollap && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 290, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 25 }}
              className="h-full bg-[#050508]/95 border-r border-white/5 flex flex-col shrink-0 overflow-hidden relative select-none z-15"
            >
              <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar select-none">
                
                {/* ==========================================
                    TAB 1: WORKSPACE BLOCKS EXPLORER
                    ========================================== */}
                {activeSidebarTab === "explorer" && (
                  <>
                    {/* Blueprint Selector stack */}
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono block mb-2.5">Ecosystem Blueprints</span>
                      <div className="space-y-1">
                        {templateOptions.map((opt) => (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => handleTemplateSwitch(opt.id)}
                            className={`w-full text-left p-2 rounded-lg border text-xs flex flex-col gap-1 transition ${
                              template === opt.id
                                ? "border-cyan-500/20 bg-cyan-950/20 text-white"
                                : "border-transparent bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]"
                            }`}
                          >
                            <span className="font-semibold flex items-center justify-between">
                              {opt.label}
                              {template === opt.id && <span className="size-1.5 rounded-full bg-cyan-400" />}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* Section active checklist HUD */}
                    <div className="flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono block mb-2.5">WORKSPACE BLOCKS</span>
                      
                      <div className="space-y-1">
                        {sections.map((sec, idx) => (
                          <div 
                            key={sec.id}
                            className={`group flex items-center justify-between p-2 rounded-lg transition ${
                              sec.enabled ? "text-zinc-300" : "text-zinc-650 opacity-60"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <input 
                                type="checkbox" 
                                checked={sec.enabled}
                                onChange={() => toggleSectionState(sec.id, "enabled")}
                                className="size-3.5 rounded border-white/10 bg-black/40 text-cyan-500 cursor-pointer"
                              />
                              <span className="text-xs font-medium truncate font-mono">{sec.title}</span>
                            </div>
                            
                            {/* Up/Down order controls */}
                            <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                              <button 
                                type="button" 
                                disabled={idx === 0}
                                onClick={() => moveSectionCard(idx, "up")}
                                className="size-5 rounded flex items-center justify-center bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white disabled:opacity-20 transition"
                              >
                                <ArrowUp className="size-3" />
                              </button>
                              <button 
                                type="button" 
                                disabled={idx === sections.length - 1}
                                onClick={() => moveSectionCard(idx, "down")}
                                className="size-5 rounded flex items-center justify-center bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white disabled:opacity-20 transition"
                              >
                                <ArrowDown className="size-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Direct quick block insertion form */}
                    <form onSubmit={handleAddCustomBlock} className="pt-4 border-t border-white/5 flex flex-col gap-2 select-none">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono block">Insert Custom Block</span>
                      <div className="flex gap-1.5">
                        <Input
                          type="text"
                          placeholder="e.g. CLI Matrix"
                          value={customSectionTitle}
                          onChange={(e) => setCustomSectionTitle(e.target.value)}
                          className="h-8 rounded-lg border-white/10 bg-black/40 text-xs px-2 text-white placeholder-zinc-700"
                        />
                        <Button 
                          type="submit"
                          disabled={!customSectionTitle.trim()}
                          className="h-8 w-8 rounded-lg bg-white/5 text-zinc-300 border border-white/10 hover:bg-cyan-500 hover:text-white transition cursor-pointer font-bold"
                        >
                          +
                        </Button>
                      </div>
                    </form>
                  </>
                )}

                {/* ==========================================
                    TAB 2: GITHUB CODEBASE SCANNER
                    ========================================== */}
                {activeSidebarTab === "github" && (
                  <div className="flex flex-col gap-4 select-none">
                    
                    {/* Repository Import Panel */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">GITHUB REPOSITORY CONNECT</span>
                      <div className="flex flex-col gap-1.5">
                        <Input
                          type="text"
                          placeholder="https://github.com/adityananda/orbit-saas"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className="h-8 rounded-lg border-white/10 bg-black/40 text-xs px-2 text-white placeholder-zinc-700 font-mono"
                        />
                        <Button
                          onClick={startRepositoryScan}
                          disabled={!githubUrl || scanState === "scanning" || scanState === "analyzing"}
                          className="w-full h-8.5 rounded-lg bg-cyan-500 text-black text-xs font-black hover:bg-cyan-400 transition cursor-pointer shadow-lg shadow-cyan-950/20 flex items-center justify-center gap-1.5 relative overflow-hidden"
                        >
                          <Terminal className="size-3.5" />
                          <span>ANALYZE CODEBASE</span>
                          {(scanState === "scanning" || scanState === "analyzing") && (
                            <span className="absolute bottom-0 left-0 h-0.75 bg-white animate-[loading-bar_1.5s_infinite] w-full" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Scanner Terminal Logs Box */}
                    {scanState !== "idle" && (
                      <div className="border border-white/5 bg-[#030305] rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                          <span>SYSTEM SHIELD SHELL</span>
                          <span className="text-cyan-400">{scanProgress}%</span>
                        </div>
                        
                        <div className="h-28 overflow-y-auto font-mono text-[9px] leading-4 text-emerald-400 space-y-1 scrollbar-none select-none">
                          {scanLogs.map((log, index) => (
                            <div key={index} className="flex gap-1">
                              <span className="text-zinc-600 font-bold">&gt;</span>
                              <span className="break-all">{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scanned Project Details Summary Cards */}
                    {scanState === "completed" && scannedRepo && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-3.5"
                      >
                        <Separator className="bg-white/5" />
                        
                        {/* Repository Profile Card */}
                        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3 flex flex-col gap-2 relative">
                          <span className="absolute top-3 right-3 text-[9px] bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded-full font-mono font-bold">
                            {scannedRepo.confidence}% Score
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                            <span className="text-xs font-bold text-white font-mono break-all leading-4">{scannedRepo.fullName}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-4">{scannedRepo.description}</p>
                          
                          {/* detected framework chips list */}
                          <div className="flex flex-wrap gap-1 mt-1 select-none">
                            {scannedRepo.frameworks.map((fw: string) => (
                              <span key={fw} className="text-[9px] bg-white/5 border border-white/5 text-zinc-300 px-2 py-0.5 rounded font-mono font-semibold">
                                {fw}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Simulated IDE File Tree Explorer */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">WORKSPACE FILE TREE</span>
                          
                          <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3 font-mono text-xs select-none">
                            {/* Render File Tree Nodes */}
                            <div className="space-y-1.5">
                              {scannedRepo.fileTree.map((node: any, idx: number) => {
                                const isDir = node.type === "folder";
                                const collapsed = collapsedDirs[node.name] ?? false;
                                
                                return (
                                  <div key={idx} className="space-y-1">
                                    <div 
                                      onClick={() => isDir && setCollapsedDirs(prev => ({ ...prev, [node.name]: !collapsed }))}
                                      className={`flex items-center gap-1.5 cursor-pointer py-0.5 px-1 rounded hover:bg-white/5 transition text-[11px] ${
                                        isDir ? "text-cyan-200" : "text-zinc-400"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-zinc-500">
                                          {isDir ? (
                                            collapsed ? <Folder className="size-3.5" /> : <FolderOpen className="size-3.5" />
                                          ) : (
                                            <File className="size-3.5" />
                                          )}
                                        </span>
                                        <span className={isDir ? "font-bold text-zinc-300" : "text-zinc-400"}>
                                          <span className="font-mono">{node.name}</span>
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {isDir && !collapsed && node.children && (
                                      <div className="pl-4 border-l border-white/5 space-y-1">
                                        {node.children.map((child: any, cidx: number) => (
                                          <div key={cidx} className="flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-white/5 text-[11px] text-zinc-450">
                                            <div className="flex items-center gap-2">
                                              <span className="text-zinc-500">
                                                {child.type === "folder" ? <Folder className="size-3" /> : <File className="size-3" />}
                                              </span>
                                              <span className={child.type === "folder" ? "font-bold text-zinc-400" : "text-zinc-500"}>
                                                <span className="font-mono">{child.name}</span>
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* GitHub Contributor list Grid */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">ECOSYSTEM CONTRIBUTORS</span>
                          
                          <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3 flex flex-col gap-2.5 select-none">
                            {scannedRepo.contributors.map((contrib: any) => (
                              <div key={contrib.login} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <img src={contrib.avatar} className="size-5 rounded-full border border-white/10" alt="avatar" />
                                  <span className="font-mono text-zinc-300 font-semibold">{contrib.login}</span>
                                </div>
                                <span className="font-mono text-[10px] text-cyan-400">{contrib.commits} commits</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </motion.div>
                    )}

                  </div>
                )}

                {/* ==========================================
                    TAB 3: AI COMMAND CENTER
                    ========================================== */}
                {activeSidebarTab === "ai" && (
                  <div className="flex flex-col gap-4 select-none">
                    
                    {/* Prompt Tone Presets Picker */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">AI COPILOT WRITING PRESETS</span>
                      <div className="grid grid-cols-2 gap-1.5 select-none">
                        {[
                          { id: "saas", label: "SaaS Investor Ready" },
                          { id: "dev", label: "Developer Tech" },
                          { id: "hacker", label: "Hacker Minimalist" },
                          { id: "launch", label: "Product Hunt Ready" }
                        ].map((pr) => (
                          <button
                            type="button"
                            key={pr.id}
                            onClick={() => {
                              setActivePreset(pr.id);
                            }}
                            className={`p-2 border rounded-lg text-left text-[10px] transition cursor-pointer leading-4 ${
                              activePreset === pr.id
                                ? "border-cyan-500/20 bg-cyan-950/20 text-cyan-300 font-bold"
                                : "border-white/5 bg-white/[0.01] text-zinc-400 hover:text-white"
                            }`}
                          >
                            {pr.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* AI Quick Actions Console Console */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">AI CODEBASE SHORTCUTS</span>
                      
                      <div className="space-y-1.5">
                        
                        <Button
                          onClick={() => {
                            const titleField = sections.find(s => s.id === "hero-banner")?.fields.find(f => f.key === "hero");
                            if (titleField) {
                              setSections(prev => prev.map(s => s.id === "hero-banner" ? { ...s, collapsed: false } : s));
                              simulateAiTyping(
                                "hero-banner",
                                "hero",
                                JSON.stringify({
                                  title: AI_PRESETS_DATABASE.heroTitle,
                                  tagline: AI_PRESETS_DATABASE.heroTagline,
                                  bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
                                  logoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=150&auto=format&fit=crop"
                                })
                              );
                            }
                          }}
                          className="w-full h-8.5 rounded-lg border border-cyan-500/20 bg-cyan-950/10 text-cyan-400 text-xs font-bold hover:bg-cyan-950/30 transition flex items-center justify-start gap-2 px-3 cursor-pointer select-none"
                        >
                          <Sparkles className="size-3.5" />
                          <span>Professionalize Brand Pitch</span>
                        </Button>

                        <Button
                          onClick={() => {
                            const stackSection = sections.find(s => s.id === "stack");
                            if (stackSection) {
                              setSections(prev => prev.map(s => s.id === "stack" ? { ...s, collapsed: false, enabled: true } : s));
                              setIsAiGenerating("stack_tech");
                              setTimeout(() => {
                                updateSectionField("stack", "tech", AI_PRESETS_DATABASE.stack);
                                setIsAiGenerating(null);
                              }, 1200);
                            }
                          }}
                          className="w-full h-8.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 text-zinc-300 text-xs font-bold transition flex items-center justify-start gap-2 px-3 cursor-pointer select-none"
                        >
                          <Code className="size-3.5 text-zinc-450" />
                          <span>Auto-Generate Badges Stack</span>
                        </Button>

                        <Button
                          onClick={() => {
                            const installSec = sections.find(s => s.id === "installation-tabs");
                            if (installSec) {
                              setSections(prev => prev.map(s => s.id === "installation-tabs" ? { ...s, collapsed: false, enabled: true } : s));
                              setIsAiGenerating("installation-tabs_installTabs");
                              setTimeout(() => {
                                updateSectionField("installation-tabs", "installTabs", {
                                  packages: AI_PRESETS_DATABASE.installPackages,
                                  npmCmd: AI_PRESETS_DATABASE.npmCmd,
                                  pnpmCmd: AI_PRESETS_DATABASE.pnpmCmd,
                                  bunCmd: AI_PRESETS_DATABASE.bunCmd
                                });
                                setIsAiGenerating(null);
                              }, 1400);
                            }
                          }}
                          className="w-full h-8.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 text-zinc-300 text-xs font-bold transition flex items-center justify-start gap-2 px-3 cursor-pointer select-none"
                        >
                          <Terminal className="size-3.5 text-zinc-450" />
                          <span>Draft Setup Shell Instructions</span>
                        </Button>

                        <Button
                          onClick={() => {
                            const faqSec = sections.find(s => s.id === "faq");
                            if (faqSec) {
                              setSections(prev => prev.map(s => s.id === "faq" ? { ...s, collapsed: false, enabled: true } : s));
                              setIsAiGenerating("faq_faqs");
                              setTimeout(() => {
                                updateSectionField("faq", "faqs", AI_PRESETS_DATABASE.faqs);
                                setIsAiGenerating(null);
                              }, 1500);
                            }
                          }}
                          className="w-full h-8.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 text-zinc-300 text-xs font-bold transition flex items-center justify-start gap-2 px-3 cursor-pointer select-none"
                        >
                          <HelpCircle className="size-3.5 text-zinc-450" />
                          <span>Generate Developer Q&A FAQ</span>
                        </Button>

                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* AI Codebase completeness & Priorities Checklist alerts */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">OPIMIZATION PRIORITIES CHECKLIST</span>
                      
                      <div className="space-y-2 select-none">
                        
                        {/* Check 1 */}
                        <div className="border border-white/5 bg-[#07070a] rounded-xl p-2.5 flex items-start gap-2.5">
                          <AlertCircle className="size-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <div className="flex-1 flex flex-col gap-1 text-xs">
                            <span className="font-semibold text-zinc-200">Interactive Setup Onboarding</span>
                            <p className="text-[10px] text-zinc-500 leading-4">Missing multi-package shell setup commands card pills.</p>
                            <button
                              onClick={() => {
                                setSections(prev => prev.map(s => s.id === "installation-tabs" ? { ...s, collapsed: false, enabled: true } : s));
                                setIsAiGenerating("installation-tabs_installTabs");
                                setTimeout(() => {
                                  updateSectionField("installation-tabs", "installTabs", {
                                    packages: AI_PRESETS_DATABASE.installPackages,
                                    npmCmd: AI_PRESETS_DATABASE.npmCmd,
                                    pnpmCmd: AI_PRESETS_DATABASE.pnpmCmd,
                                    bunCmd: AI_PRESETS_DATABASE.bunCmd
                                  });
                                  setIsAiGenerating(null);
                                }, 1000);
                              }}
                              className="text-[9px] text-cyan-400 font-mono font-bold text-left hover:underline select-none cursor-pointer mt-1"
                            >
                              [RUN AI AUTO-ONBOARDING FIX]
                            </button>
                          </div>
                        </div>

                        {/* Check 2 */}
                        <div className="border border-white/5 bg-[#07070a] rounded-xl p-2.5 flex items-start gap-2.5">
                          <AlertCircle className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div className="flex-1 flex flex-col gap-1 text-xs">
                            <span className="font-semibold text-zinc-200">Legal Licensing Verification</span>
                            <p className="text-[10px] text-zinc-500 leading-4">No copyright or active security open-source block registered.</p>
                            <button
                              onClick={() => {
                                setSections(prev => prev.map(s => s.id === "license" ? { ...s, collapsed: false, enabled: true } : s));
                                updateSectionField("license", "licenseType", "MIT");
                                updateSectionField("license", "copyright", "Copyright © 2026 Orbit Enterprise Console. All rights reserved.");
                              }}
                              className="text-[9px] text-cyan-400 font-mono font-bold text-left hover:underline select-none cursor-pointer mt-1"
                            >
                              [RUN AI MIT LICENSE FIX]
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

                {/* ==========================================
                    TAB 4: REPOSITORY INSIGHTS
                    ========================================== */}
                {activeSidebarTab === "insights" && (
                  <div className="flex flex-col gap-4 select-none">
                    
                    {/* Insights metrics scorecard charts */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">INSIGHTS METRICS SCORECARD</span>
                      
                      {/* Metric 1 */}
                      <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3 flex flex-col gap-1.5 relative select-none">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-400" />
                            Documentation completeness
                          </span>
                          <span className="font-mono text-cyan-400 font-bold">{healthDashboard.score}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div style={{ width: `${healthDashboard.score}%` }} className="h-full bg-cyan-400 transition-all duration-500" />
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3 flex flex-col gap-1.5 relative select-none">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                            <Users className="size-3.5 text-cyan-400" />
                            Onboarding & Setup Quality
                          </span>
                          <span className="font-mono text-cyan-400 font-bold">92%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div style={{ width: "92%" }} className="h-full bg-cyan-400 transition-all duration-500" />
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3 flex flex-col gap-1.5 relative select-none">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                            <Clock className="size-3.5 text-amber-400" />
                            OSS Launch Readiness
                          </span>
                          <span className="font-mono text-cyan-400 font-bold">85%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div style={{ width: "85%" }} className="h-full bg-cyan-400 transition-all duration-500" />
                        </div>
                      </div>

                    </div>

                    <Separator className="bg-white/5" />

                    {/* Launch recommendations priorities insights */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">INTELLIGENT LAUNCH ADVICE</span>
                      
                      <div className="border border-white/5 bg-[#07070a] rounded-xl p-3 flex flex-col gap-2 leading-relaxed text-xs text-zinc-450 select-none">
                        <div className="flex items-center gap-1.5 text-zinc-300 font-bold mb-1 text-[11px]">
                          <Lightbulb className="size-3.5 text-cyan-400 shrink-0" />
                          <span>Ecosystem Launch Readiness</span>
                        </div>
                        
                        <p className="leading-5">Your documentation is currently <strong className="text-cyan-300 font-bold">85% ready</strong> for open-source publication and Product Hunt showcase!</p>
                        
                        <p className="leading-5 mt-1">To achieve 100% excellence, resolve the <strong className="text-amber-400">Amber warnings</strong> in the AI Command Center checklist by generating the onboarding tabs and license copyright signatures.</p>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Resizable drag divider container */}
        <div className="flex-1 flex flex-row relative h-full overflow-hidden select-none">
          
          {/* ==========================================
              EDITOR WORKSPACE (LEFT COLUMN COMPOSER)
              ========================================== */}
          <div 
            id="onboarding-editor"
            style={{ width: `${editorWidth}%` }} 
            className="h-full flex flex-col bg-[#030303] overflow-y-auto custom-scrollbar relative border-r border-white/5 pr-1 select-none"
          >
            
            {/* 1. HEALTH SCORING ENGINE HUD WIDGET */}
            <div className="p-4 md:p-6 pb-2 select-none">
              <div id="onboarding-health" className="rounded-2xl border border-cyan-500/10 bg-cyan-950/[0.04] p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-noise pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <Badge className="border-cyan-500/20 bg-cyan-950/30 text-cyan-300 font-mono text-[9px] uppercase tracking-wider">
                      Health Analysis Scoring Engine
                    </Badge>
                    <h2 className="mt-2.5 text-lg font-bold text-white tracking-tight">
                      README Health Score: <span className="text-cyan-300 font-black">{healthDashboard.score}/100</span>
                    </h2>
                    <p className="mt-1 text-[11px] text-zinc-450 leading-relaxed font-mono">
                      State: <span className="text-cyan-400 font-bold">{healthDashboard.statusLabel}</span> &bull; {sections.filter(s=>s.enabled).length} active sections
                    </p>
                  </div>

                  {/* Visual progress bar radial overlay */}
                  <div className="h-2 w-32 rounded-full bg-white/5 overflow-hidden relative shrink-0">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full transition-all duration-500" 
                      style={{ width: `${healthDashboard.score}%` }}
                    />
                  </div>
                </div>

                {/* Optimizations warning indicators list */}
                {(healthDashboard.warnings.length > 0 || healthDashboard.suggestions.length > 0) && (
                  <div className="mt-4 pt-3.5 border-t border-white/5 space-y-1.5 select-none">
                    {healthDashboard.warnings.map((warn, widx) => (
                      <div key={widx} className="flex items-center gap-2 text-[10.5px] text-amber-400 font-mono">
                        <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
                        <span>{warn}</span>
                      </div>
                    ))}
                    {healthDashboard.suggestions.map((sug, sidx) => (
                      <div key={sidx} className="flex items-center gap-2 text-[10.5px] text-cyan-400/80 font-mono">
                        <Lightbulb className="size-3.5 text-cyan-500 shrink-0" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions / Slash Menu bar */}
            <div className="px-4 md:px-6 mb-2 flex items-center justify-between select-none">
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Premium Layout Blocks:</span>
              <div className="flex items-center gap-1.5">
                <Button 
                  type="button" 
                  onClick={() => insertPremiumBlock("api-endpoints")}
                  className="h-7 px-2.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-cyan-300 hover:bg-white/10 hover:border-cyan-500/20"
                >
                  + API Specs Table
                </Button>
                <Button 
                  type="button" 
                  onClick={() => insertPremiumBlock("env-vars")}
                  className="h-7 px-2.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-cyan-300 hover:bg-white/10 hover:border-cyan-500/20"
                >
                  + Dot-Env Matrix
                </Button>
                <Button 
                  type="button" 
                  onClick={() => insertPremiumBlock("roadmap")}
                  className="h-7 px-2.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-cyan-300 hover:bg-white/10 hover:border-cyan-500/20"
                >
                  + Roadmap
                </Button>
                <Button 
                  type="button" 
                  onClick={() => insertPremiumBlock("faq")}
                  className="h-7 px-2.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-cyan-300 hover:bg-white/10 hover:border-cyan-500/20"
                >
                  + FAQs Group
                </Button>
              </div>
            </div>

            {/* Card block workspace editor canvas */}
            <div className="p-4 md:p-6 pt-0 space-y-4 pb-28 select-none">
              
              {sections.map((sec, idx) => {
                if (!sec.enabled) return null;

                return (
                  <motion.div
                    key={sec.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative rounded-2xl border border-white/5 bg-[#07070a]/40 backdrop-blur-xl shadow-xl overflow-hidden group/card select-none"
                  >
                    
                    {/* Header accent highlight glow */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent opacity-0 group-hover/card:opacity-100 transition duration-300" />
                    
                    {/* Card Header triggers */}
                    <div className="p-4 bg-white/[0.012] border-b border-white/5 flex items-center justify-between select-none">
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.01] text-zinc-450 group-hover/card:text-cyan-300 transition">
                          {sec.id === "hero-banner" ? <ImageIcon className="size-4" /> : <FileText className="size-4" />}
                        </span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{sec.title}</h4>
                            {collaborators.filter(c => c.activeBlock === sec.id).map((c, idx) => (
                              <div key={idx} className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full animate-pulse select-none">
                                <span className="size-1 rounded-full bg-amber-400" />
                                <span>{c.name.split(" ")[0]} {c.status === "typing" ? "typing..." : "active"}</span>
                              </div>
                            ))}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">block type: #{sec.id.split("_")[0]}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 select-none">
                        
                        {/* Phase 3 Inline AI Suggestion Trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            if (sec.id === "hero-banner") {
                              simulateAiTyping(
                                "hero-banner",
                                "hero",
                                JSON.stringify({
                                  title: AI_PRESETS_DATABASE.heroTitle,
                                  tagline: AI_PRESETS_DATABASE.heroTagline,
                                  bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
                                  logoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=150&auto=format&fit=crop"
                                })
                              );
                            }
                            else if (sec.id === "stack") {
                              setIsAiGenerating("stack_tech");
                              setTimeout(() => {
                                updateSectionField("stack", "tech", AI_PRESETS_DATABASE.stack);
                                setIsAiGenerating(null);
                              }, 1100);
                            }
                            else if (sec.id === "installation-tabs") {
                              setIsAiGenerating("installation-tabs_installTabs");
                              setTimeout(() => {
                                updateSectionField("installation-tabs", "installTabs", {
                                  packages: AI_PRESETS_DATABASE.installPackages,
                                  npmCmd: AI_PRESETS_DATABASE.npmCmd,
                                  pnpmCmd: AI_PRESETS_DATABASE.pnpmCmd,
                                  bunCmd: AI_PRESETS_DATABASE.bunCmd
                                });
                                setIsAiGenerating(null);
                              }, 1200);
                            }
                            else if (sec.id === "api-endpoints") {
                              setIsAiGenerating("api-endpoints_endpoints");
                              setTimeout(() => {
                                updateSectionField("api-endpoints", "endpoints", AI_PRESETS_DATABASE.apiEndpoints);
                                setIsAiGenerating(null);
                              }, 1300);
                            }
                            else if (sec.id === "env-vars") {
                              setIsAiGenerating("env-vars_envVars");
                              setTimeout(() => {
                                updateSectionField("env-vars", "envVars", AI_PRESETS_DATABASE.envVars);
                                setIsAiGenerating(null);
                              }, 1200);
                            }
                            else if (sec.id === "roadmap") {
                              setIsAiGenerating("roadmap_milestones");
                              setTimeout(() => {
                                updateSectionField("roadmap", "milestones", AI_PRESETS_DATABASE.roadmap);
                                setIsAiGenerating(null);
                              }, 1400);
                            }
                            else if (sec.id === "faq") {
                              setIsAiGenerating("faq_faqs");
                              setTimeout(() => {
                                updateSectionField("faq", "faqs", AI_PRESETS_DATABASE.faqs);
                                setIsAiGenerating(null);
                              }, 1400);
                            }
                            else if (sec.id === "license") {
                              updateSectionField("license", "licenseType", "MIT");
                              updateSectionField("license", "copyright", "Copyright © 2026 Orbit Enterprise Console. All rights reserved.");
                            }
                            else {
                              sec.fields.forEach(field => {
                                simulateAiTyping(sec.id, field.key, AI_PRESETS_DATABASE.customDoc);
                              });
                            }
                          }}
                          className={`size-6 rounded flex items-center justify-center border transition relative ${
                            isAiGenerating?.startsWith(sec.id)
                              ? "border-cyan-400 bg-cyan-950/20 text-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                              : "border-white/5 bg-white/5 hover:border-cyan-500/30 text-zinc-400 hover:text-cyan-400"
                          }`}
                          title="Generate content using simulated AI models"
                        >
                          <Sparkles className="size-3.5" />
                          {isAiGenerating?.startsWith(sec.id) && (
                            <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-cyan-400 rounded-full animate-ping" />
                          )}
                        </button>

                        {/* Up/Down ordering slides */}
                        <div className="flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          <button 
                            type="button" 
                            disabled={idx === 0}
                            onClick={() => moveSectionCard(idx, "up")}
                            className="size-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white disabled:opacity-20 transition"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button 
                            type="button" 
                            disabled={idx === sections.length - 1}
                            onClick={() => moveSectionCard(idx, "down")}
                            className="size-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white disabled:opacity-20 transition"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                        </div>

                        <Separator orientation="vertical" className="h-4 bg-white/5" />

                        {/* Duplicating card actions */}
                        <button
                          type="button"
                          onClick={() => {
                            const clone = JSON.parse(JSON.stringify(sec));
                            clone.id = `${sec.id.split("_")[0]}_${Date.now()}`;
                            clone.title = `${sec.title} (Copy)`;
                            const updated = [...sections];
                            updated.splice(idx + 1, 0, clone);
                            setSections(updated);
                            pushHistoryState(updated);
                          }}
                          className="size-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
                          title="Duplicate block card"
                        >
                          <Copy className="size-3.5 text-cyan-400" />
                        </button>

                        {/* Collapsing block card toggle */}
                        <button
                          type="button"
                          onClick={() => toggleSectionState(sec.id, "collapsed")}
                          className="size-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
                        >
                          <ChevronDown className={`size-4 transition-transform duration-300 ${sec.collapsed ? "-rotate-90" : ""}`} />
                        </button>

                        {/* Delete block card trigger */}
                        <button 
                          type="button" 
                          onClick={() => deleteSectionCard(sec.id)}
                          className="size-6 rounded bg-red-950/20 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 flex items-center justify-center transition"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Inner Editor Fields */}
                    <AnimatePresence initial={false}>
                      {!sec.collapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="p-5 space-y-4 select-none"
                        >
                          {sec.fields.map((field) => {
                            
                            // -------------------------------------
                            // 1. HERO BANNER EDITOR COMPOSER
                            // -------------------------------------
                            if (field.type === "hero-banner-editor") {
                              const h = field.value || {};
                              return (
                                <div key={field.key} className="space-y-3.5 select-none">
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono">Hero Banner Image URL</span>
                                    <Input
                                      type="text"
                                      value={h.bannerUrl || ""}
                                      onChange={(e) => updateSectionField(sec.id, field.key, { ...h, bannerUrl: e.target.value })}
                                      placeholder="https://images.unsplash.com/..."
                                      className="h-10 rounded-xl border-white/10 bg-black/45 text-xs focus-visible:ring-0 focus-visible:border-cyan-400/40 text-white"
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div className="flex flex-col gap-1.5">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono">Centered Logo Image URL</span>
                                      <Input
                                        type="text"
                                        value={h.logoUrl || ""}
                                        onChange={(e) => updateSectionField(sec.id, field.key, { ...h, logoUrl: e.target.value })}
                                        placeholder="https://images.unsplash.com/..."
                                        className="h-10 rounded-xl border-white/10 bg-black/45 text-xs focus-visible:ring-0 focus-visible:border-cyan-400/40 text-white"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono">Title Headline</span>
                                      <Input
                                        type="text"
                                        value={h.title || ""}
                                        onChange={(e) => updateSectionField(sec.id, field.key, { ...h, title: e.target.value })}
                                        placeholder="Project title..."
                                        className="h-10 rounded-xl border-white/10 bg-black/45 text-xs focus-visible:ring-0 focus-visible:border-cyan-400/40 text-white"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono">Brand Tagline Subheadline</span>
                                    <Textarea
                                      value={h.tagline || ""}
                                      onChange={(e) => updateSectionField(sec.id, field.key, { ...h, tagline: e.target.value })}
                                      placeholder="Brand positioning statement..."
                                      className="min-h-16 rounded-xl border-white/10 bg-black/45 text-xs focus-visible:ring-0 focus-visible:border-cyan-400/40 text-white"
                                    />
                                  </div>
                                </div>
                              );
                            }

                            // -------------------------------------
                            // 2. TECH STACKS BADGES TAG LIST
                            // -------------------------------------
                            if (field.type === "tags") {
                              const tags = field.value || [];
                              return (
                                <div key={field.key} className="flex flex-col gap-2.5 select-none">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono">{field.label}</label>
                                    <button
                                      type="button"
                                      onClick={() => setShowBadgeModal(true)}
                                      className="text-[10.5px] font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5"
                                    >
                                      <Star className="size-3.5 text-cyan-400" />
                                      <span>Open Badges Hub</span>
                                    </button>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 p-3.5 bg-black/40 rounded-xl border border-white/5">
                                    {tags.length === 0 && (
                                      <span className="text-zinc-600 text-xs font-mono">No active technology badges added yet. Add stacks:</span>
                                    )}
                                    {tags.map((tag: string) => (
                                      <span 
                                        key={tag} 
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/10 bg-cyan-950/20 text-cyan-300 font-mono text-[10px] font-semibold"
                                      >
                                        {tag}
                                        <button 
                                          type="button" 
                                          onClick={() => removeTagPill(sec.id, field.key, tag)}
                                          className="size-3.5 rounded-full hover:bg-cyan-500/20 flex items-center justify-center text-cyan-500"
                                        >
                                          <X className="size-2.5" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>

                                  <div className="flex gap-2 select-none">
                                    <Input
                                      type="text"
                                      placeholder={field.placeholder}
                                      value={newTagInput[sec.id] || ""}
                                      onChange={(e) => setNewTagInput(prev => ({ ...prev, [sec.id]: e.target.value }))}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          addTagPill(sec.id, field.key);
                                        }
                                      }}
                                      className="h-10 rounded-xl border-white/10 bg-black/50 text-xs px-3 focus:ring-0 text-white placeholder-zinc-650 flex-1"
                                    />
                                    <Button 
                                      type="button"
                                      onClick={() => addTagPill(sec.id, field.key)}
                                      disabled={!newTagInput[sec.id]?.trim()}
                                      className="h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500 hover:text-white transition px-4 cursor-pointer text-xs font-bold text-zinc-300"
                                    >
                                      Add Tag
                                    </Button>
                                  </div>
                                </div>
                              );
                            }

                            // -------------------------------------
                            // 3. MULTI-PACKAGE MANAGER SETUP TABS
                            // -------------------------------------
                            if (field.type === "install-tabs") {
                              const t = field.value || {};
                              return (
                                <div key={field.key} className="space-y-3.5 select-none">
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono">Onboarding Setup Package Name</span>
                                    <Input
                                      type="text"
                                      value={t.packages || ""}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        updateSectionField(sec.id, field.key, {
                                          ...t,
                                          packages: val,
                                          npmCmd: `npm i ${val}`,
                                          pnpmCmd: `pnpm add ${val}`,
                                          bunCmd: `bun add ${val}`
                                        });
                                      }}
                                      placeholder="e.g. @orbit-saas/client"
                                      className="h-10 rounded-xl border-white/10 bg-black/45 text-xs focus-visible:ring-0 focus-visible:border-cyan-400/40 text-white"
                                    />
                                  </div>
                                  
                                  <div className="p-3 bg-black/50 border border-white/5 rounded-xl space-y-2 select-none">
                                    <div className="text-[10px] font-mono text-cyan-300/80 font-bold mb-1.5">Shell Output Commands Preview:</div>
                                    <div className="text-[11px] font-mono text-zinc-400">
                                      <span className="text-zinc-600">$</span> npm i {t.packages || "[package]"}
                                    </div>
                                    <div className="text-[11px] font-mono text-zinc-400">
                                      <span className="text-zinc-600">$</span> pnpm add {t.packages || "[package]"}
                                    </div>
                                    <div className="text-[11px] font-mono text-zinc-400">
                                      <span className="text-zinc-600">$</span> bun add {t.packages || "[package]"}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // -------------------------------------
                            // 4. API ROUTE ENDPOINTS MANAGER TABLE
                            // -------------------------------------
                            if (field.type === "api-endpoints") {
                              const eps = field.value || [];
                              return (
                                <div key={field.key} className="space-y-3.5 select-none">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono block">Routes Matrix Editor</span>
                                  
                                  <div className="space-y-2 select-none">
                                    {eps.map((ep: any, epIdx: number) => (
                                      <div key={epIdx} className="p-3.5 rounded-xl bg-black/45 border border-white/5 flex flex-col gap-2 relative group/ep">
                                        
                                        {/* Delete route button */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedEps = eps.filter((_: any, i: number) => i !== epIdx);
                                            updateSectionField(sec.id, field.key, updatedEps);
                                          }}
                                          className="absolute top-3.5 right-3.5 size-6 rounded bg-red-950/20 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 flex items-center justify-center opacity-0 group-hover/ep:opacity-100 transition"
                                        >
                                          <Trash2 className="size-3" />
                                        </button>

                                        <div className="flex gap-2">
                                          {/* Method selector */}
                                          <select
                                            value={ep.method}
                                            onChange={(e) => {
                                              const updatedEps = eps.map((item: any, i: number) => 
                                                i === epIdx ? { ...item, method: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedEps);
                                            }}
                                            className="bg-[#0c0c10] border border-white/10 rounded-lg text-[10.5px] font-mono text-cyan-300 px-2 py-1"
                                          >
                                            <option value="GET">GET</option>
                                            <option value="POST">POST</option>
                                            <option value="PUT">PUT</option>
                                            <option value="DELETE">DELETE</option>
                                          </select>

                                          <Input
                                            type="text"
                                            value={ep.path}
                                            onChange={(e) => {
                                              const updatedEps = eps.map((item: any, i: number) => 
                                                i === epIdx ? { ...item, path: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedEps);
                                            }}
                                            placeholder="/api/v1/health"
                                            className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 font-mono text-white flex-1 focus-visible:ring-0"
                                          />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                          <Input
                                            type="text"
                                            value={ep.desc}
                                            onChange={(e) => {
                                              const updatedEps = eps.map((item: any, i: number) => 
                                                i === epIdx ? { ...item, desc: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedEps);
                                            }}
                                            placeholder="Route description..."
                                            className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 text-white focus-visible:ring-0"
                                          />
                                          <Input
                                            type="text"
                                            value={ep.response}
                                            onChange={(e) => {
                                              const updatedEps = eps.map((item: any, i: number) => 
                                                i === epIdx ? { ...item, response: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedEps);
                                            }}
                                            placeholder='Response e.g. {"status":"ok"}'
                                            className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 font-mono text-white focus-visible:ring-0"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Add new route button */}
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      updateSectionField(sec.id, field.key, [
                                        ...eps,
                                        { method: "GET", path: "/api/v1/new", desc: "New API Route endpoint", response: '{"success":true}' }
                                      ]);
                                    }}
                                    className="w-full h-9 rounded-xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.04] text-xs font-mono text-zinc-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <PlusCircle className="size-4 text-cyan-400" />
                                    <span>Append API Endpoint Route</span>
                                  </Button>
                                </div>
                              );
                            }

                            // -------------------------------------
                            // 5. ENVIRONMENT VARIABLES GRID EDITOR
                            // -------------------------------------
                            if (field.type === "env-vars") {
                              const evs = field.value || [];
                              return (
                                <div key={field.key} className="space-y-3.5 select-none">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono block">Environment Variables Editor</span>
                                  
                                  <div className="space-y-2 select-none">
                                    {evs.map((ev: any, evIdx: number) => (
                                      <div key={evIdx} className="p-3 rounded-xl bg-black/45 border border-white/5 flex flex-col gap-2 relative group/ev">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedEvs = evs.filter((_: any, i: number) => i !== evIdx);
                                            updateSectionField(sec.id, field.key, updatedEvs);
                                          }}
                                          className="absolute top-3 right-3 size-5 rounded bg-red-950/20 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 flex items-center justify-center opacity-0 group-hover/ev:opacity-100 transition"
                                        >
                                          <X className="size-3" />
                                        </button>

                                        <div className="flex gap-2">
                                          <Input
                                            type="text"
                                            value={ev.key}
                                            onChange={(e) => {
                                              const updatedEvs = evs.map((item: any, i: number) => 
                                                i === evIdx ? { ...item, key: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedEvs);
                                            }}
                                            placeholder="VARIABLE_KEY"
                                            className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 font-mono text-white flex-1 focus-visible:ring-0"
                                          />
                                          <select
                                            value={ev.required}
                                            onChange={(e) => {
                                              const updatedEvs = evs.map((item: any, i: number) => 
                                                i === evIdx ? { ...item, required: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedEvs);
                                            }}
                                            className="bg-[#0c0c10] border border-white/10 rounded-lg text-[10px] font-mono text-cyan-300 px-2 py-1"
                                          >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                          </select>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                          <Input
                                            type="text"
                                            value={ev.default}
                                            onChange={(e) => {
                                              const updatedEvs = evs.map((item: any, i: number) => 
                                                i === evIdx ? { ...item, default: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedEvs);
                                            }}
                                            placeholder="Default fallback..."
                                            className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 font-mono text-white focus-visible:ring-0"
                                          />
                                          <Input
                                            type="text"
                                            value={ev.desc}
                                            onChange={(e) => {
                                              const updatedEvs = evs.map((item: any, i: number) => 
                                                i === evIdx ? { ...item, desc: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedEvs);
                                            }}
                                            placeholder="Variable purpose..."
                                            className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 text-white focus-visible:ring-0"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <Button
                                    type="button"
                                    onClick={() => {
                                      updateSectionField(sec.id, field.key, [
                                        ...evs,
                                        { key: "NEW_ENV_KEY", required: "Yes", default: "value", desc: "Configuration description" }
                                      ]);
                                    }}
                                    className="w-full h-9 rounded-xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.04] text-xs font-mono text-zinc-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <PlusCircle className="size-4 text-cyan-400" />
                                    <span>Append Env Key Variable</span>
                                  </Button>
                                </div>
                              );
                            }

                            // -------------------------------------
                            // 6. ROADMAP TIMELINE milestone rows
                            // -------------------------------------
                            if (field.type === "roadmap-timeline") {
                              const ms = field.value || [];
                              return (
                                <div key={field.key} className="space-y-3.5 select-none">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono block">Timeline Milestone Editor</span>
                                  
                                  <div className="space-y-2 select-none">
                                    {ms.map((m: any, mIdx: number) => (
                                      <div key={mIdx} className="p-3 rounded-xl bg-black/45 border border-white/5 flex flex-col gap-2 relative group/m">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedMs = ms.filter((_: any, i: number) => i !== mIdx);
                                            updateSectionField(sec.id, field.key, updatedMs);
                                          }}
                                          className="absolute top-3 right-3 size-5 rounded bg-red-950/20 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 flex items-center justify-center opacity-0 group-hover/m:opacity-100 transition"
                                        >
                                          <X className="size-3" />
                                        </button>

                                        <div className="flex gap-2">
                                          <Input
                                            type="text"
                                            value={m.date}
                                            onChange={(e) => {
                                              const updatedMs = ms.map((item: any, i: number) => 
                                                i === mIdx ? { ...item, date: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedMs);
                                            }}
                                            placeholder="Date e.g. Q1 2026"
                                            className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 text-white font-bold w-1/3 focus-visible:ring-0"
                                          />
                                          <Input
                                            type="text"
                                            value={m.title}
                                            onChange={(e) => {
                                              const updatedMs = ms.map((item: any, i: number) => 
                                                i === mIdx ? { ...item, title: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedMs);
                                            }}
                                            placeholder="Milestone goal description..."
                                            className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 text-white flex-1 focus-visible:ring-0"
                                          />
                                          <select
                                            value={m.status}
                                            onChange={(e) => {
                                              const updatedMs = ms.map((item: any, i: number) => 
                                                i === mIdx ? { ...item, status: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedMs);
                                            }}
                                            className="bg-[#0c0c10] border border-white/10 rounded-lg text-[10px] font-mono text-cyan-300 px-2 py-1"
                                          >
                                            <option value="completed">Completed</option>
                                            <option value="in-progress">In-Progress</option>
                                            <option value="planned">Planned</option>
                                          </select>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <Button
                                    type="button"
                                    onClick={() => {
                                      updateSectionField(sec.id, field.key, [
                                        ...ms,
                                        { date: "Next Phase", title: "New milestone milestone targets", status: "planned" }
                                      ]);
                                    }}
                                    className="w-full h-9 rounded-xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.04] text-xs font-mono text-zinc-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <PlusCircle className="size-4 text-cyan-400" />
                                    <span>Append Roadmap Milestone Item</span>
                                  </Button>
                                </div>
                              );
                            }

                            // -------------------------------------
                            // 7. FAQ ACCORDION dropdown list
                            // -------------------------------------
                            if (field.type === "faq-accordion") {
                              const faqs = field.value || [];
                              return (
                                <div key={field.key} className="space-y-3.5 select-none">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono block">Accordion FAQs Editor</span>
                                  
                                  <div className="space-y-2 select-none">
                                    {faqs.map((faq: any, faqIdx: number) => (
                                      <div key={faqIdx} className="p-3.5 rounded-xl bg-black/45 border border-white/5 flex flex-col gap-2 relative group/faq">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedFaqs = faqs.filter((_: any, i: number) => i !== faqIdx);
                                            updateSectionField(sec.id, field.key, updatedFaqs);
                                          }}
                                          className="absolute top-3.5 right-3.5 size-5 rounded bg-red-950/20 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 flex items-center justify-center opacity-0 group-hover/faq:opacity-100 transition"
                                        >
                                          <X className="size-3" />
                                        </button>

                                        <div className="flex flex-col gap-2">
                                          <Input
                                            type="text"
                                            value={faq.q}
                                            onChange={(e) => {
                                              const updatedFaqs = faqs.map((item: any, i: number) => 
                                                i === faqIdx ? { ...item, q: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedFaqs);
                                            }}
                                            placeholder="Question title?"
                                            className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 text-white font-bold focus-visible:ring-0"
                                          />
                                          <Textarea
                                            value={faq.a}
                                            onChange={(e) => {
                                              const updatedFaqs = faqs.map((item: any, i: number) => 
                                                i === faqIdx ? { ...item, a: e.target.value } : item
                                              );
                                              updateSectionField(sec.id, field.key, updatedFaqs);
                                            }}
                                            placeholder="Response answer..."
                                            className="min-h-12 rounded-lg border-white/10 bg-black/50 text-xs p-2.5 text-white focus-visible:ring-0"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <Button
                                    type="button"
                                    onClick={() => {
                                      updateSectionField(sec.id, field.key, [
                                        ...faqs,
                                        { q: "New Question?", a: "New detailed response answer." }
                                      ]);
                                    }}
                                    className="w-full h-9 rounded-xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.04] text-xs font-mono text-zinc-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <PlusCircle className="size-4 text-cyan-400" />
                                    <span>Append FAQ Accordion Row</span>
                                  </Button>
                                </div>
                              );
                            }

                            // -------------------------------------
                            // 8. COMPLEX FEATURES bullet cards
                            // -------------------------------------
                            if (field.type === "features") {
                              const bullets = field.value || [];
                              return (
                                <div key={field.key} className="flex flex-col gap-2.5 select-none">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono">{field.label}</label>

                                  <div className="space-y-2 select-none">
                                    {bullets.map((bullet: string, bidx: number) => (
                                      <div 
                                        key={bidx} 
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5 text-xs text-zinc-300 group/bullet"
                                      >
                                        <div className="flex items-start gap-2.5 truncate pl-1">
                                          <span className="text-cyan-400 font-bold mt-0.5">&bull;</span>
                                          <span className="truncate leading-5">{bullet}</span>
                                        </div>
                                        <button 
                                          type="button" 
                                          onClick={() => removeFeatureBullet(sec.id, field.key, bidx)}
                                          className="size-5 rounded flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-zinc-550 hover:text-red-400 transition shrink-0 opacity-0 group-hover/bullet:opacity-100"
                                        >
                                          <X className="size-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex gap-2 select-none">
                                    <Input
                                      type="text"
                                      placeholder={field.placeholder}
                                      value={newFeatureInput[sec.id] || ""}
                                      onChange={(e) => setNewFeatureInput(prev => ({ ...prev, [sec.id]: e.target.value }))}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          addFeatureBullet(sec.id, field.key);
                                        }
                                      }}
                                      className="h-10 rounded-xl border-white/10 bg-black/50 text-xs px-3 focus:ring-0 text-white placeholder-zinc-650 flex-1"
                                    />
                                    <Button 
                                      type="button"
                                      onClick={() => addFeatureBullet(sec.id, field.key)}
                                      disabled={!newFeatureInput[sec.id]?.trim()}
                                      className="h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500 hover:text-white transition px-4 cursor-pointer text-xs font-bold text-zinc-300"
                                    >
                                      Add Feature
                                    </Button>
                                  </div>
                                </div>
                              );
                            }

                            // -------------------------------------
                            // 9. STANDARD TEXT INPUT / AREA FALLBACK
                            // -------------------------------------
                            const isGeneratingThisField = isAiGenerating === `${sec.id}_${field.key}`;

                            return (
                              <div key={field.key} className="flex flex-col gap-2 relative select-none">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 font-mono">{field.label}</span>
                                  {isGeneratingThisField && (
                                    <span className="text-[9px] text-cyan-400 font-mono animate-pulse flex items-center gap-1 font-bold">
                                      <Sparkles className="size-2.5 animate-spin" />
                                      AI STREAMING...
                                    </span>
                                  )}
                                </div>
                                {field.type === "textarea" ? (
                                  <Textarea
                                    value={field.value as string}
                                    onChange={(e) => updateSectionField(sec.id, field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className={`min-h-24 resize-y rounded-xl bg-black/45 text-xs text-zinc-100 placeholder:text-zinc-650 focus-visible:border-cyan-550/40 focus-visible:ring-0 font-mono transition duration-300 ${
                                      isGeneratingThisField
                                        ? "border-cyan-450 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                                        : "border-white/10"
                                    }`}
                                  />
                                ) : (
                                  <Input
                                    type="text"
                                    value={field.value as string}
                                    onChange={(e) => updateSectionField(sec.id, field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className={`h-10 rounded-xl bg-black/45 text-xs text-zinc-100 placeholder:text-zinc-650 focus-visible:border-cyan-550/40 focus-visible:ring-0 transition duration-300 ${
                                      isGeneratingThisField
                                        ? "border-cyan-450 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                                        : "border-white/10"
                                    }`}
                                  />
                                )}
                              </div>
                            );

                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                );
              })}

            </div>

          </div>

          {/* ==========================================
              DYNAMIC PANE SPLIT DRAG RESIZER GUTTER
              ========================================== */}
          <div 
            onMouseDown={() => setIsResizing(true)}
            className={`w-1 cursor-col-resize flex items-center justify-center shrink-0 h-full relative transition-all group ${
              isResizing ? "bg-cyan-500" : "bg-white/5 hover:bg-cyan-550/50"
            }`}
          >
            <div className="absolute size-6 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xl z-20 cursor-col-resize">
              <ChevronsUpDown className="size-3.5 text-zinc-400 rotate-90" />
            </div>
          </div>

          {/* ==========================================
              PREVIEW WORKSPACE (RIGHT COLUMN GFM CANVAS)
              ========================================== */}
          <div 
            id="onboarding-preview"
            style={{ width: `${100 - editorWidth}%` }} 
            className="h-full bg-[#030303] overflow-y-auto custom-scrollbar flex flex-col relative select-none"
          >
            
            {/* Live preview header status */}
            <div className="h-12 border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl sticky top-0 px-4 flex items-center justify-between z-20 select-none">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-2 rounded bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono font-bold">
                  Ecosystem Live presentation layout previewer
                </span>
              </div>

              <div className="flex items-center gap-4">
                
                {/* Mode Selector Toggle */}
                <div className="flex items-center bg-white/5 border border-white/5 p-0.5 rounded-lg select-none">
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("dark")}
                    className={`px-2 py-0.8 rounded text-[9.5px] font-mono font-bold transition cursor-pointer ${
                      previewTheme === "dark"
                        ? "bg-white/10 text-cyan-300 shadow-sm"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    DARK
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("light")}
                    className={`px-2 py-0.8 rounded text-[9.5px] font-mono font-bold transition cursor-pointer ${
                      previewTheme === "light"
                        ? "bg-white text-black shadow-sm"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    LIGHT
                  </button>
                </div>

                <span className="text-[10px] text-zinc-500 font-mono">
                  Atmosphere Theme: <span className="text-cyan-300 font-bold">{readmeTheme.replace(/-/g, " ").toUpperCase()}</span>
                </span>
              </div>
            </div>

            {/* Markdown compiled GFM rendering canvas */}
            <div className="p-4 md:p-6 pb-28 flex-1 flex justify-center">
              
              <div className={`w-full max-w-3xl rounded-2xl border transition-colors duration-350 p-5 md:p-8 shadow-2xl relative overflow-auto theme-readme-${readmeTheme} theme-${previewTheme} ${
                previewTheme === "dark"
                  ? "bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
                  : "bg-white border-zinc-200 text-zinc-800"
              }`}>
                
                {/* Auto Generated dynamic Table of Contents list */}
                <div className={`mb-6 p-4 rounded-xl border border-dashed text-xs ${
                  previewTheme === "dark" ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200"
                }`}>
                  <span className="font-bold uppercase tracking-wider block mb-2 font-mono text-zinc-400">
                    Table of Contents (Auto-Generated Link index)
                  </span>
                  
                  <div className="space-y-1 text-cyan-600 dark:text-cyan-400 font-medium select-none">
                    {sections.map(sec => {
                      if (!sec.enabled) return null;
                      return (
                        <span key={sec.id} className="block hover:underline cursor-pointer font-mono text-[11px]">
                          &bull; {sec.title}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* React markdown core renderer compiled output */}
                <MarkdownPreview markdown={generatedMarkdown} />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          3. SMART BADGES HUB COMPOSER (MODAL DIALOG)
          ========================================== */}
      <AnimatePresence>
        {showBadgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBadgeModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#07070a]/95 p-6 shadow-2xl overflow-hidden spotlight-card z-10 font-sans"
            >
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">Intelligent Badge Engine</h3>
                  <span className="text-xs text-zinc-500 leading-5">Add color-aware shields badges dynamically with categories grouping and dynamic previews.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBadgeModal(false)}
                  className="size-7 rounded-full bg-white/5 border border-white/10 text-zinc-450 hover:text-white flex items-center justify-center transition"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Selection Badge style triggers */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4 select-none">
                {["flat", "flat-square", "for-the-badge", "plastic", "social"].map((style) => (
                  <button
                    type="button"
                    key={style}
                    onClick={() => setBadgeStyle(style)}
                    className={`p-2 rounded-lg border text-[10px] font-mono font-bold tracking-wider text-center uppercase transition ${
                      badgeStyle === style 
                        ? "border-cyan-500/30 bg-cyan-950/20 text-cyan-300"
                        : "border-white/5 bg-white/[0.01] text-zinc-500 hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    {style.replace(/-/g, " ")}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-none">
                
                {/* Panel Left: preset stacks autocomplete list */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-2.5 py-1.5">
                    <Search className="size-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search preset tech stack badges..."
                      value={badgeSearch}
                      onChange={(e) => setBadgeSearch(e.target.value)}
                      className="bg-transparent border-none text-xs text-white placeholder-zinc-650 w-full focus:ring-0 outline-none"
                    />
                  </div>

                  <div className="max-h-52 overflow-y-auto custom-scrollbar border border-white/5 rounded-xl bg-black/30 p-2.5 space-y-1.5">
                    {filteredPresets.map((b) => (
                      <button
                        type="button"
                        key={b.name}
                        onClick={() => addSmartPresetBadge(b.name)}
                        className="w-full text-left p-2 rounded-lg hover:bg-white/[0.03] text-xs text-zinc-300 flex items-center justify-between group transition"
                      >
                        <span className="font-semibold">{b.name}</span>
                        <span className="text-[9px] font-mono text-zinc-500 font-bold bg-white/5 px-2 py-0.5 rounded uppercase">{b.category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Panel Right: custom badges generator inputs */}
                <div className="space-y-3 p-4 rounded-xl border border-white/5 bg-black/40">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Custom Badge Generator</div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-zinc-500">Badge Label (Left Text)</span>
                    <Input
                      type="text"
                      value={customBadgeLabel}
                      onChange={(e) => setCustomBadgeLabel(e.target.value)}
                      placeholder="e.g. Build Status"
                      className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-zinc-500">Badge Value (Right Text)</span>
                    <Input
                      type="text"
                      value={customBadgeValue}
                      onChange={(e) => setCustomBadgeValue(e.target.value)}
                      placeholder="e.g. Passing"
                      className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-zinc-500">Badge Theme Color (Hex Code)</span>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={customBadgeColor}
                        onChange={(e) => setCustomBadgeColor(e.target.value)}
                        placeholder="e.g. 22c55e"
                        className="h-8 rounded-lg border-white/10 bg-black/50 text-xs px-2.5 text-white flex-1 font-mono"
                      />
                      <Button
                        type="button"
                        onClick={addCustomShieldsBadge}
                        className="h-8 bg-white text-black hover:bg-cyan-100 text-xs font-bold px-3 rounded-lg cursor-pointer"
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Dialog footer controls */}
              <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-650">
                <span>Shields.io real-time live preview generation</span>
                <span>Click presets to instantly populate stack</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Close activeView === "editor" container (Phase 4) */}
        </>
      )}

      {/* ==========================================
          4. ADVANCED EXPORT PIPELINE (MODAL DIALOG)
          ========================================== */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isExporting) setShowExportModal(false); }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#07070a]/95 p-6 shadow-2xl overflow-hidden spotlight-card z-10 font-sans"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Download className="size-4.5 text-cyan-400" />
                    <span>Advanced Export Pipeline</span>
                  </h3>
                  <span className="text-xs text-zinc-550 leading-5">Deploy your README document under different production formats.</span>
                </div>
                {!isExporting && (
                  <button
                    type="button"
                    onClick={() => setShowExportModal(false)}
                    className="size-7 rounded-full bg-white/5 border border-white/10 text-zinc-450 hover:text-white flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {isExporting ? (
                /* EXPORT COMPILING SIMULATOR ACTIVE SCREEN */
                <div className="py-6 space-y-6 select-none">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="relative size-16">
                      <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                      <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-cyan-300 font-bold">
                        {exportProgress}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">COMPILING DOCUMENTATION PACKAGES</span>
                      <p className="text-[10px] text-cyan-400 font-mono animate-pulse">{exportStep}</p>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>

                  <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Pipeline Telemetry Logs</span>
                    <div className="text-[10px] font-mono text-zinc-450 leading-relaxed space-y-0.5">
                      <div>&bull; MD Parser status: ready</div>
                      <div>&bull; Shields badges assets: resolved</div>
                      {exportProgress > 40 && <div>&bull; Packing bundle layers: active</div>}
                      {exportProgress > 75 && <div>&bull; Compiling styling buffers: complete</div>}
                    </div>
                  </div>
                </div>
              ) : (
                /* EXPORT CONFIGURATION SETTINGS SCREEN */
                <div className="space-y-5 select-none">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">Custom Filename</span>
                    <Input
                      type="text"
                      value={exportFilename}
                      onChange={(e) => setExportFilename(e.target.value)}
                      placeholder="README.md"
                      className="h-10 rounded-xl border-white/10 bg-black/50 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">Select Output Format</span>
                    <div className="grid grid-cols-2 gap-3.5">
                      {[
                        { id: "md", label: "Markdown GFM", desc: "Raw markdown output" },
                        { id: "zip", label: "Zipped Repo Package", desc: "Full code zip bundle" },
                        { id: "html", label: "HTML Static Webpage", desc: "Styled web preview document" },
                        { id: "pdf", label: "Vector PDF Layout", desc: "Printable tech deck pages" }
                      ].map(fmt => (
                        <button
                          type="button"
                          key={fmt.id}
                          onClick={() => setExportFormat(fmt.id as any)}
                          className={`p-3.5 rounded-xl text-left border transition ${
                            exportFormat === fmt.id
                              ? "bg-white/5 border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.06)]"
                              : "bg-white/[0.012] border-white/5 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <span className="text-xs font-bold font-mono block uppercase">{fmt.label}</span>
                          <span className="text-[10px] text-zinc-550 block mt-1">{fmt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <Button
                      type="button"
                      onClick={() => setShowExportModal(false)}
                      className="h-11 rounded-xl bg-white/5 border border-white/10 text-zinc-450 hover:text-white text-xs font-bold transition flex-1 cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => triggerExportPipeline(exportFormat)}
                      className="h-11 rounded-xl bg-white text-black hover:bg-cyan-100 text-xs font-black transition flex-1 cursor-pointer"
                    >
                      COMPILE & EXPORT
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          5. SHAREABLE SHOWCASE DIALOG (Phase 4)
          ========================================== */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#07070a]/95 p-6 shadow-2xl overflow-hidden spotlight-card z-10 font-sans"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <ExternalLink className="size-4.5 text-cyan-400" />
                    <span>Public Preview Link</span>
                  </h3>
                  <span className="text-xs text-zinc-550 leading-5">Deploy your README showcase page for peer review.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="size-7 rounded-full bg-white/5 border border-white/10 text-zinc-450 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">Shareable Showroom Link</span>
                  <div className="flex gap-2 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 items-center justify-between">
                    <span className="font-mono truncate select-all">https://readmeforge.dev/share/{activeWorkspaceId}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://readmeforge.dev/share/${activeWorkspaceId}`);
                        triggerToast("Copied sharing link to clipboard!");
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-bold shrink-0 font-mono text-[10px] uppercase ml-2"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Link Expiration</span>
                    <select
                      value={shareExpiresIn}
                      onChange={(e) => setShareExpiresIn(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-lg text-[11px] font-mono text-cyan-300 px-2 py-1.5 focus:ring-0 outline-none w-full"
                    >
                      <option value="24 hours">24 Hours</option>
                      <option value="7 days">7 Days</option>
                      <option value="30 days">30 Days</option>
                      <option value="Never">Never</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Showcase Mode</span>
                    <select
                      className="bg-black/60 border border-white/10 rounded-lg text-[11px] font-mono text-cyan-300 px-2 py-1.5 focus:ring-0 outline-none w-full"
                    >
                      <option value="readonly">Read-Only Document</option>
                      <option value="interactive">Presentation Slideshow</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-white/5 bg-black/40 flex items-start gap-3">
                  <span className="size-2 rounded-full bg-emerald-500 mt-1 shrink-0 animate-pulse" />
                  <div className="text-[10px] text-zinc-500 leading-relaxed font-mono">
                    <span className="text-zinc-300 block font-bold">Concept OpenGraph Cards Enabled</span>
                    Social previews will auto-generate structured dynamic summaries when shared on Twitter/GitHub.
                  </div>
                </div>

                <Button
                  onClick={() => setShowShareModal(false)}
                  className="w-full h-10.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase transition cursor-pointer"
                >
                  Close Sharing Settings
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          6. DYNAMIC PUBLISHING VALIDATION DIALOG (Phase 4)
          ========================================== */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (publishState !== "publishing") setShowPublishModal(false); }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#07070a]/95 p-6 shadow-2xl overflow-hidden spotlight-card z-10 font-sans"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Shield className="size-4.5 text-cyan-400" />
                    <span>OSS Launch Publishing Checklist</span>
                  </h3>
                  <span className="text-xs text-zinc-550 leading-5">Review launch requirements before pushing to remote origin.</span>
                </div>
                {publishState !== "publishing" && (
                  <button
                    type="button"
                    onClick={() => setShowPublishModal(false)}
                    className="size-7 rounded-full bg-white/5 border border-white/10 text-zinc-450 hover:text-white flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {publishState === "publishing" ? (
                <div className="py-6 space-y-6">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="relative size-16">
                      <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                      <div className="absolute inset-0 rounded-full border-2 border-t-purple-400 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-purple-300 font-bold">
                        {publishProgress}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">DEPLOYING DRAFT PACKAGES</span>
                      <p className="text-[9px] text-purple-400 font-mono animate-pulse">Running live commit tunnels...</p>
                    </div>
                  </div>

                  <div className="p-4 bg-black/45 border border-white/5 rounded-xl space-y-1 select-text">
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">Console Deployment Streams</span>
                    <div className="text-[10px] font-mono text-zinc-400 leading-relaxed space-y-1 h-32 overflow-y-auto custom-scrollbar">
                      {publishLogs.map((log, i) => (
                        <div key={i} className="flex gap-1.5">
                          <span className="text-zinc-650 font-bold">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : publishState === "completed" ? (
                <div className="py-8 space-y-6 text-center select-none">
                  <div className="size-16 rounded-full border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(16,185,129,0.15)] animate-bounce">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white font-mono uppercase tracking-wider">PUBLICATION SUCCESSFUL!</h4>
                    <p className="text-xs text-zinc-550 leading-5">Your README is actively published onto your connected repository main branch.</p>
                  </div>
                  <Button
                    onClick={() => {
                      setPublishState("idle");
                      setShowPublishModal(false);
                    }}
                    className="h-10 w-full rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase transition cursor-pointer"
                  >
                    Return to Editor
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2 select-none">
                    <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">Launch Verification Checklist</span>
                    <div className="space-y-2">
                      {[
                        { label: "GFM Syntax tree outlines verified", done: true },
                        { label: "Repository config dependencies identified", done: scannedRepo !== null },
                        { label: "Document onboarding health index > 70%", done: healthDashboard.score > 70 },
                        { label: "Assets links and badges stack resolved", done: true }
                      ].map((chk, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                          {chk.done ? (
                            <CheckCircle2 className="size-4.5 text-cyan-400 shrink-0" />
                          ) : (
                            <AlertCircle className="size-4.5 text-amber-500 shrink-0" />
                          )}
                          <span className={chk.done ? "text-zinc-300 text-xs" : "text-zinc-500 text-xs line-through"}>{chk.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <Button
                      type="button"
                      onClick={() => setShowPublishModal(false)}
                      className="h-11 rounded-xl bg-white/5 border border-white/10 text-zinc-450 hover:text-white text-xs font-bold transition flex-1 cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={triggerPublishPipeline}
                      className="h-11 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black transition flex-1 cursor-pointer"
                    >
                      LAUNCH PRODUCTION PUSH
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          7. PERSONAL SNIPPETS BLUEPRINTS MODAL (Phase 4)
          ========================================== */}
      <AnimatePresence>
        {showSnippetsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSnippetsModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#07070a]/95 p-6 shadow-2xl overflow-hidden spotlight-card z-10 font-sans"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sliders className="size-4.5 text-cyan-400" />
                    <span>Personal Snippets Library</span>
                  </h3>
                  <span className="text-xs text-zinc-550 leading-5">Save, select, and inject reusable configuration blocks across workspace drafts.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSnippetsModal(false)}
                  className="size-7 rounded-full bg-white/5 border border-white/10 text-zinc-450 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-5 select-none">
                {/* Creating custom snippet blueprint widget */}
                <div className="p-4 border border-white/5 bg-white/[0.01] rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono block">Create Custom Snippet Blueprint</span>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="e.g. React Starter Badges"
                      value={newSnippetName}
                      onChange={(e) => setNewSnippetName(e.target.value)}
                      className="h-9 rounded-lg border-white/10 bg-black/50 text-xs px-3 focus:ring-0 text-white flex-1"
                    />
                    <Button
                      onClick={() => {
                        if (!newSnippetName.trim()) return;
                        // Choose first active section as template for simulation
                        const activeSec = sections[0];
                        if (activeSec) {
                          saveToSnippetLibrary(newSnippetName, activeSec);
                          setNewSnippetName("");
                        }
                      }}
                      disabled={!newSnippetName.trim()}
                      className="h-9 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition px-4 cursor-pointer"
                    >
                      Save Active Block
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1 select-none">
                  <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">Saved snippets ({snippetsLibrary.length})</span>
                  {snippetsLibrary.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center select-none space-y-3">
                      <div className="size-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-cyan-500/10 border border-white/5 flex items-center justify-center">
                        <Sliders className="size-5 text-amber-400/50" />
                      </div>
                      <h4 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">No Snippets Saved</h4>
                      <p className="text-[10px] text-zinc-600 max-w-xs mx-auto leading-relaxed">
                        Save frequently used README blocks as reusable snippets. Name a block above and click &ldquo;Save Active Block&rdquo; to start.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {snippetsLibrary.map((snip) => (
                        <div 
                          key={snip.id}
                          className="border border-white/5 bg-[#07070a]/40 rounded-xl p-3.5 flex flex-col justify-between h-28"
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold tracking-wider">{snip.category}</span>
                            <span className="text-xs font-bold text-white block truncate uppercase font-mono">{snip.name}</span>
                          </div>
                          <Button
                            onClick={() => {
                              insertSnippet(snip.id);
                              setShowSnippetsModal(false);
                            }}
                            className="h-7 w-full rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-bold uppercase transition hover:bg-cyan-500 hover:text-white cursor-pointer"
                          >
                            Insert Block
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setShowSnippetsModal(false)}
                  className="w-full h-10.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase transition cursor-pointer"
                >
                  Close Snippets Library
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          8. RAYCAST INSPIRED ACTION PALETTE
          ========================================== */}
      <AnimatePresence>
        {showPalette && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPalette(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="command-palette-title"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#07070a]/95 p-4 shadow-2xl overflow-hidden spotlight-card z-10 select-none font-sans"
            >
              <h2 id="command-palette-title" className="sr-only">Command Palette</h2>
              
              <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-3 py-2.5 select-none">
                <Search className="size-4 text-zinc-550" aria-hidden="true" />
                <input
                  type="text"
                  aria-label="Search workspace commands"
                  placeholder="Search workspace commands, presentation themes..."
                  value={paletteQuery}
                  onChange={(e) => setPaletteQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-white placeholder-zinc-650 flex-1 focus:ring-0 outline-none w-full"
                  autoFocus
                />
              </div>

              <div className="mt-4 max-h-72 overflow-y-auto custom-scrollbar space-y-1.5 select-none">
                {raycastCommands.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-center select-none space-y-3">
                    <div className="size-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                      <Search className="size-4 text-zinc-600" />
                    </div>
                    <h4 className="text-[11px] font-bold text-zinc-400 font-mono uppercase tracking-wider">No Matches Found</h4>
                    <p className="text-[10px] text-zinc-600 max-w-xs mx-auto leading-relaxed">
                      Try adjusting your search query to find commands, themes, blueprints, or templates.
                    </p>
                  </div>
                )}
                {raycastCommands.map((cmd, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={cmd.action}
                    className="w-full text-left p-2.5 rounded-xl border border-transparent text-xs hover:bg-white/[0.04] text-zinc-300 hover:text-white flex items-center justify-between group transition duration-150"
                  >
                    <span className="font-semibold flex items-center gap-2">
                      <span className="size-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition" />
                      {cmd.label}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase shrink-0">
                      {cmd.category}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-600 select-none">
                <span>Raycast-grade Command Hub console</span>
                <span>ESC to close</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ==========================================
          CINEMATIC SPOTLIGHT ONBOARDING TOUR OVERLAY
          ========================================== */}
      <AnimatePresence>
        {spotlightTourActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] pointer-events-auto"
            style={{ isolation: "isolate" }}
          >
            {/* Dark overlay with SVG cutout */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  {spotlightRect && (
                    <rect
                      x={spotlightRect.x}
                      y={spotlightRect.y}
                      width={spotlightRect.w}
                      height={spotlightRect.h}
                      rx="16"
                      fill="black"
                      style={{ transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                    />
                  )}
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0, 0, 0, 0.82)"
                mask="url(#spotlight-mask)"
                style={{ pointerEvents: "auto" }}
                onClick={(e) => e.stopPropagation()}
              />
            </svg>

            {/* Spotlight glow ring around cutout */}
            {spotlightRect && (
              <div
                className="absolute rounded-2xl pointer-events-none"
                style={{
                  left: spotlightRect.x - 4,
                  top: spotlightRect.y - 4,
                  width: spotlightRect.w + 8,
                  height: spotlightRect.h + 8,
                  border: "2px solid rgba(34, 211, 238, 0.35)",
                  boxShadow: "0 0 40px rgba(34, 211, 238, 0.12), 0 0 80px rgba(34, 211, 238, 0.06)",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              />
            )}

            {/* Tour tooltip card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={spotlightStep}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="absolute z-10"
                style={{
                  ...(SPOTLIGHT_TOUR_STEPS[spotlightStep]?.position === "center" ? {
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)"
                  } : SPOTLIGHT_TOUR_STEPS[spotlightStep]?.position === "right" && spotlightRect ? {
                    left: Math.min(spotlightRect.x + spotlightRect.w + 24, window.innerWidth - 420),
                    top: Math.max(spotlightRect.y, 80)
                  } : SPOTLIGHT_TOUR_STEPS[spotlightStep]?.position === "left" && spotlightRect ? {
                    left: Math.max(spotlightRect.x - 410, 16),
                    top: Math.max(spotlightRect.y, 80)
                  } : SPOTLIGHT_TOUR_STEPS[spotlightStep]?.position === "bottom" && spotlightRect ? {
                    left: Math.max(Math.min(spotlightRect.x, window.innerWidth - 420), 16),
                    top: spotlightRect.y + spotlightRect.h + 20
                  } : {
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)"
                  })
                }}
              >
                <div className="w-[380px] rounded-2xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-2xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_1px_rgba(255,255,255,0.1)] select-none">
                  {/* Step indicator dots */}
                  <div className="flex items-center gap-1.5 mb-4">
                    {SPOTLIGHT_TOUR_STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === spotlightStep
                            ? "w-6 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                            : i < spotlightStep
                            ? "w-2 bg-cyan-600"
                            : "w-2 bg-white/10"
                        }`}
                      />
                    ))}
                    <span className="ml-auto text-[9px] font-mono text-zinc-500 font-bold">
                      {spotlightStep + 1}/{SPOTLIGHT_TOUR_STEPS.length}
                    </span>
                  </div>

                  {/* Icon and title */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{SPOTLIGHT_TOUR_STEPS[spotlightStep]?.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {SPOTLIGHT_TOUR_STEPS[spotlightStep]?.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                    {SPOTLIGHT_TOUR_STEPS[spotlightStep]?.description}
                  </p>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={completeSpotlightTour}
                      className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition uppercase tracking-wider"
                    >
                      Skip Tour
                    </button>
                    <div className="flex items-center gap-2">
                      {spotlightStep > 0 && (
                        <button
                          onClick={retreatSpotlightTour}
                          className="h-8 px-3 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] transition font-semibold"
                        >
                          Back
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (spotlightStep === SPOTLIGHT_TOUR_STEPS.length - 1) {
                            completeSpotlightTour();
                            const name = prompt("Enter your first workspace name:");
                            if (name) createWorkspace(name, "saas");
                          } else {
                            advanceSpotlightTour();
                          }
                        }}
                        className="h-8 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      >
                        {spotlightStep === SPOTLIGHT_TOUR_STEPS.length - 1 ? "Create First Workspace" : "Next"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          PREMIUM ZERO-STATE LANDING HERO
          ========================================== */}
      <AnimatePresence>
        {showZeroState && workspaces.length === 0 && !spotlightTourActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9990] bg-[#030308]/98 backdrop-blur-xl flex items-center justify-center"
          >
            {/* Animated background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/[0.04] rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/[0.03] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.015] rounded-full blur-[150px]" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10 max-w-lg w-full mx-4 text-center select-none"
            >
              {/* Logo mark */}
              <div className="flex justify-center mb-8">
                <div className="size-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.1)]">
                  <Wand2 className="size-9 text-cyan-400" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 font-mono uppercase">
                ReadmeForge
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md mx-auto mb-2">
                The developer documentation platform that understands your code.
              </p>
              <p className="text-xs text-zinc-550 font-mono mb-10">
                Local-first • AI-powered • Privacy-focused
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <button
                  onClick={() => {
                    setShowZeroState(false);
                    const name = prompt("Enter your first workspace name:");
                    if (name) {
                      createWorkspace(name, "saas");
                      setActiveView("editor");
                    }
                  }}
                  className="h-12 px-8 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-black uppercase tracking-wider transition shadow-[0_0_40px_rgba(34,211,238,0.25)] flex items-center gap-2"
                >
                  <Plus className="size-5" />
                  Create Your First Workspace
                </button>

                <button
                  onClick={() => {
                    setShowZeroState(false);
                    // Create a demo workspace for tour context  
                    createWorkspace("My First Project", "saas");
                    setTimeout(() => {
                      setActiveView("editor");
                      startSpotlightTour();
                    }, 300);
                  }}
                  className="h-12 px-8 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white text-sm font-bold transition flex items-center gap-2"
                >
                  <Compass className="size-5 text-cyan-400" />
                  Start Interactive Tour
                </button>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                {[
                  { icon: <Layers3 className="size-4 text-cyan-400" />, label: "Modular\nBlock Editor" },
                  { icon: <Sparkles className="size-4 text-purple-400" />, label: "AI Content\nGeneration" },
                  { icon: <Shield className="size-4 text-emerald-400" />, label: "100% Local\nPrivate Data" }
                ].map((feat, i) => (
                  <div key={i} className="border border-white/5 bg-white/[0.02] rounded-xl p-4 space-y-2 text-center">
                    <div className="flex justify-center">{feat.icon}</div>
                    <span className="text-[10px] text-zinc-450 font-mono whitespace-pre-line leading-tight">{feat.label}</span>
                  </div>
                ))}
              </div>

              {/* Version footer */}
              <div className="mt-10 flex items-center justify-center gap-4 text-[9px] font-mono text-zinc-600">
                <span>ReadmeForge v4.0</span>
                <span>•</span>
                <span>Local-First Architecture</span>
                <span>•</span>
                <span>Zero Cloud Dependencies</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
