import type { ReadmeFormData, ReadmeTemplate, TemplateOption } from "./types";
import { getBadges } from "./badges";

export const templateOptions: TemplateOption[] = [
  {
    id: "basic",
    label: "Basic",
    description: "A clean README for apps, libraries, and internal tools.",
  },
  {
    id: "saas",
    label: "SaaS",
    description: "Positioning, setup, and product-focused sections.",
  },
  {
    id: "open-source",
    label: "Open Source",
    description: "Adds contribution, issue, and community structure.",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "Highlights impact, screenshots, and creator context.",
  },
];

export const initialReadmeData: ReadmeFormData = {
  projectName: "ReadmeForge",
  description:
    "A fast, local-first workspace for generating polished README files with templates, badges, and live markdown previews.",
  features:
    "Live markdown preview\nTemplate presets\nAutomatic technology badges\nOne-click copy and README.md download",
  installation: "npm install\nnpm run dev",
  usage:
    "Open the generator workspace, fill in your project details, choose a template, then copy or download the generated README.",
  techStack: "Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion",
  license: "MIT",
  author: "Adityananda",
  githubUrl: "https://github.com/adityananda/smart-readme-generator",
};

const listFromText = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const listSection = (title: string, items: string) => {
  const values = listFromText(items);
  if (!values.length) return "";

  return `## ${title}\n\n${values.map((item) => `- ${item}`).join("\n")}\n`;
};

const codeBlockSection = (title: string, value: string, language = "bash") => {
  const cleaned = value.trim();
  if (!cleaned) return "";

  return `## ${title}\n\n\`\`\`${language}\n${cleaned}\n\`\`\`\n`;
};

const textSection = (title: string, value: string) => {
  const cleaned = value.trim();
  if (!cleaned) return "";

  return `## ${title}\n\n${cleaned}\n`;
};

const projectHeader = (data: ReadmeFormData) => {
  const badges = getBadges(data.techStack);

  return [
    `# ${data.projectName || "Untitled Project"}`,
    data.description.trim(),
    badges.length ? badges.join(" ") : "",
  ]
    .filter(Boolean)
    .join("\n\n");
};

const footer = (data: ReadmeFormData) => {
  const rows = [
    data.githubUrl.trim() ? `- Repository: ${data.githubUrl.trim()}` : "",
    data.license.trim() ? `- License: ${data.license.trim()}` : "",
    data.author.trim() ? `- Author: ${data.author.trim()}` : "",
  ].filter(Boolean);

  return rows.length ? `## Details\n\n${rows.join("\n")}\n` : "";
};

const builders: Record<ReadmeTemplate, (data: ReadmeFormData) => string> = {
  basic: (data) =>
    [
      projectHeader(data),
      listSection("Features", data.features),
      codeBlockSection("Installation", data.installation),
      textSection("Usage", data.usage),
      listSection("Tech Stack", data.techStack.replaceAll(",", "\n")),
      footer(data),
    ].join("\n"),

  saas: (data) =>
    [
      projectHeader(data),
      textSection("Product Overview", data.description),
      listSection("Core Capabilities", data.features),
      codeBlockSection("Local Development", data.installation),
      textSection("Usage Flow", data.usage),
      listSection("Platform Stack", data.techStack.replaceAll(",", "\n")),
      "## Deployment\n\nDeploy on Vercel, Docker, or your preferred hosting provider after configuring environment variables and production build settings.\n",
      footer(data),
    ].join("\n"),

  "open-source": (data) =>
    [
      projectHeader(data),
      listSection("Highlights", data.features),
      codeBlockSection("Getting Started", data.installation),
      textSection("Usage", data.usage),
      listSection("Built With", data.techStack.replaceAll(",", "\n")),
      "## Contributing\n\nContributions are welcome. Open an issue to discuss larger changes, then submit a focused pull request with tests or screenshots when relevant.\n",
      "## Community\n\nUse GitHub issues for bugs, feature requests, and roadmap discussions.\n",
      footer(data),
    ].join("\n"),

  portfolio: (data) =>
    [
      projectHeader(data),
      textSection("Case Study", data.description),
      listSection("What It Does", data.features),
      textSection("How To Use It", data.usage),
      codeBlockSection("Run Locally", data.installation),
      listSection("Technology", data.techStack.replaceAll(",", "\n")),
      "## Screenshots\n\nAdd product screenshots, interaction clips, or deployment images here.\n",
      footer(data),
    ].join("\n"),
};

export function generateReadme(
  data: ReadmeFormData,
  template: ReadmeTemplate
) {
  return builders[template](data).replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
