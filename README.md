# Smart README Generator

A premium, open-source README generator built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and local-only browser state.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## Overview

Smart README Generator is a polished SaaS-style workspace for creating production-ready `README.md` files in seconds. It includes template presets, live markdown rendering, generated badges, one-click copy, and markdown download without requiring a backend.

Live app: [https://smart-readme-generator-nine.vercel.app](https://smart-readme-generator-nine.vercel.app)

## Features

- README form generator with project name, description, features, installation, usage, tech stack, license, author, and GitHub URL fields
- Real-time markdown preview with GitHub-flavored markdown support
- README templates for Basic, SaaS, Open Source, and Portfolio projects
- Auto-generated badges for common technologies
- One-click markdown copy with browser-safe fallback behavior
- Download generated content as `README.md`
- Animated dashboard UI with sticky preview panel
- Dark mode by default
- Responsive layout for desktop, tablet, and mobile
- Local state only, with no backend or database required

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- react-markdown
- remark-gfm
- Vercel

## Installation

```bash
npm install
```

## Usage

Run the local development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Deployment

This project is optimized for Vercel.

```bash
npx vercel --prod
```

## Project Structure

```text
app/
  generator/
  globals.css
  layout.tsx
  page.tsx
components/
  readme/
  ui/
lib/
  readme/
  utils.ts
public/
```

## Open Source

This project is open-source. You can use it, modify it, redistribute it, include it in commercial products, and sell projects based on it.

The only requirement is attribution: please keep credit to the original developer, **Aditya Nanda**, in your README, documentation, credits page, product footer, or another visible place.

## License

Licensed under the Attribution-Required MIT License.

Copyright (c) 2026 Aditya Nanda.

See [LICENSE](./LICENSE) for details.

## Author

Aditya Nanda
