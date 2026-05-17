import type { BadgeDefinition } from "./types";

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { label: "Next.js", token: "next", color: "000000", logo: "nextdotjs" },
  { label: "TypeScript", token: "typescript", color: "3178C6", logo: "typescript" },
  { label: "Docker", token: "docker", color: "2496ED", logo: "docker" },
  { label: "Tailwind CSS", token: "tailwind", color: "06B6D4", logo: "tailwindcss" },
  { label: "React", token: "react", color: "61DAFB", logo: "react" },
  { label: "Node.js", token: "node", color: "5FA04E", logo: "nodedotjs" },
  { label: "Prisma", token: "prisma", color: "2D3748", logo: "prisma" },
  { label: "PostgreSQL", token: "postgres", color: "4169E1", logo: "postgresql" },
  { label: "Vercel", token: "vercel", color: "000000", logo: "vercel" },
];

const encodeBadgePart = (value: string) =>
  encodeURIComponent(value).replace(/-/g, "--");

export function getBadges(techStack: string): string[] {
  const stack = techStack.toLowerCase();

  return BADGE_DEFINITIONS.filter((badge) => stack.includes(badge.token)).map(
    (badge) =>
      `![${badge.label}](https://img.shields.io/badge/${encodeBadgePart(
        badge.label
      )}-${badge.color}?style=for-the-badge&logo=${badge.logo}&logoColor=white)`
  );
}
