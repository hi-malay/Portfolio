// Folders in the home page's "Featured Projects" section.

export interface Project {
	cta: string;
	description: string;
	kicker: string;
	links: { href: string; label: string }[];
	stack: string[];
	title: string;
}

export const projects: Project[] = [
	{
		cta: "Read case study",
		description:
			"Built the dlp-endpoints service from scratch in Go, moving performance-critical APIs off a ~1.8s path to sub-second responses. Also shipped AI-driven interlinking between CLP, DLP and PDP pages using OpenAI embeddings.",
		kicker: "AdeptMind · Case study",
		links: [{ href: "https://www.adeptmind.ai/", label: "AdeptMind" }],
		stack: ["Go", "Next.js", "OpenAI embeddings", "GraphQL"],
		title: "DLP Endpoints",
	},
	{
		cta: "View project",
		description:
			"Drop-in AI chat popup for any React site, published on npm as thikanaa. Streams answers through the Vercel AI SDK with Groq and Gemini, typed end to end with Zod.",
		kicker: "npm package",
		links: [
			{ href: "https://www.npmjs.com/package/thikanaa", label: "npm" },
			{ href: "https://github.com/hi-malay/thikana", label: "GitHub" },
		],
		stack: ["TypeScript", "Vercel AI SDK", "Groq", "Gemini", "Zod", "tsup"],
		title: "Thikanaa",
	},
	{
		cta: "View project",
		description: "13+ machine coding challenges solved the way an interview expects: clean React, accessible components, tests.",
		kicker: "Frontend challenges",
		links: [
			{ href: "https://code.malaymishra.com", label: "Live" },
			{ href: "https://github.com/hi-malay/machine_coding", label: "GitHub" },
		],
		stack: ["React", "Radix UI", "Tailwind", "Jest"],
		title: "Machine Coding",
	},
	{
		cta: "View project",
		description: "Pulls LinkedIn profile data through Apify and commits it to a GitHub repo, so this site's content updates without a redeploy.",
		kicker: "Data pipeline",
		links: [{ href: "https://github.com/hi-malay/scrape_profile_data", label: "GitHub" }],
		stack: ["Next.js", "Apify", "GitHub API", "TanStack Query"],
		title: "Profile Sync",
	},
];
