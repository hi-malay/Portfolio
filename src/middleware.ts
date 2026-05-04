import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MARKDOWN = `---
title: Malay Mishra — Portfolio
description: Senior Frontend Engineer transitioning to fullstack. Currently at Adeptmind. React, Next.js, Go, TypeScript.
url: https://malaymishra.com
---

# Malay Mishra

Senior Frontend Engineer transitioning to fullstack. Building things at Adeptmind (Founding Team). Based in Bangalore, India.

## Currently
- **Adeptmind** — Engineering, Founding Team (09/2024 – Present). Gen AI + deep intent mining for retail search and discovery.
  - Built \`dlp-endpoints\` service in Go, dropped client-facing API latency from ~1.8s to sub-second.
  - Shipped Interlink Optimization in Chat-DLP for better data linking and discoverability.
  - AI-driven interlink generation using OpenAI embeddings (CLP/DLP/PDP ratios for search + merchandising).
  - Led frontend revamp with reusable FAQ + 404 templates; sped up client onboarding, improved SEO.
  - Framer Motion integration for smoother UI; better engagement and AI Overviews appearance.
  - Owned DLP SLA, resolved ~40 tickets in 2 months while running engineering support in parallel.
  - Mentored interns end-to-end, transitioned them into full-time engineers.

## Past Roles
- **Plivo (Contacto)** — SDE, Founding Team (06/2022 – 08/2024). Cloud contact-center platform.
  - Converted Electron desktop app to web with 50% speed bump using WebSockets + BroadcastListeners.
  - Migrated CRA → Vite: 2× faster dev, 4× faster builds.
  - Independently led Email + WhatsApp channels, Agent Monitoring, and Barging — pulled in 4 customers.
  - Built UI component library (Storybook + Material UI), wired up LogRocket + test automation, cut bugs ~40%.
- **KredX** — SDE (06/2021 – 06/2022). Fintech vendor onboarding, micro-frontend architecture.
  - Single-SPA integration cut deployment time 60%, enabled parallel team development.
  - Server-driven dynamic forms for vendor onboarding.
  - Central document upload module with maker-checker, used team-wide.
  - GraphQL code generator for type safety; 60% test coverage on Capvel repo.
- **GoodHealth** — SDE, Founding Team (05/2020 – 04/2021). Healthcare platform.
  - Built site from scratch with Ant Design, lazy loading, progressive image loading, Brotli compression.
  - PWA-ready, responsive across all modern devices, 50% reduction in page load.

## Tech
React, Next.js, TypeScript, Go, Python, GraphQL, Tailwind CSS, GSAP, Vite, WebSockets, Storybook, Micro-frontends, Single-SPA, Framer Motion, OpenAI API, Node.js.

## Projects
- [code.malaymishra.com](https://code.malaymishra.com) — 13+ machine-coding challenges (React).
- [thikana.malaymishra.com](https://thikana.malaymishra.com) — AI chat popup demo. Published to npm as [\`thikanaa\`](https://www.npmjs.com/package/thikanaa).

## Contact
- Site: https://malaymishra.com
- LinkedIn: https://www.linkedin.com/in/malay-mishra-34a914143/
- GitHub: https://github.com/hi-malay

## Data sources
- [Experience JSON](https://raw.githubusercontent.com/hi-malay/portfolio-data/refs/heads/main/experience.json)
- [Skills JSON](https://raw.githubusercontent.com/hi-malay/portfolio-data/refs/heads/main/skills.json)
- [Sitemap](https://malaymishra.com/sitemap.xml)
- [llms.txt](https://malaymishra.com/llms.txt)
`;

export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") || "";
  if (!accept.includes("text/markdown")) return;
  if (req.nextUrl.pathname !== "/") return;

  return new NextResponse(MARKDOWN, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(Math.ceil(MARKDOWN.length / 4)),
      "content-signal": "ai-train=yes, search=yes, ai-input=yes",
      "cache-control": "public, max-age=3600",
    },
  });
}

export const config = {
  matcher: "/",
};
