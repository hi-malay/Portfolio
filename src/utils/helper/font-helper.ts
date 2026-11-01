import { EB_Garamond, Inter_Tight, Noto_Sans_Devanagari, Outfit } from "next/font/google";

// Serif used by the /cv page, matches the PDF resume.
export const ebGaramond = EB_Garamond({
	display: "swap",
	subsets: ["latin"],
	weight: "variable",
});

export const interTight = Inter_Tight({
	display: "swap",
	preload: true,
	subsets: ["latin"],
	variable: "--font-inter-tight",
	weight: ["200", "400", "500", "600"],
});

// Only the नमस्ते hero greeting needs it, so no preload; experience.tsx fetches it before that word shows.
export const devanagari = Noto_Sans_Devanagari({
	display: "swap",
	preload: false,
	variable: "--font-devanagari",
});

export const outfit = Outfit({
	display: "swap",
	preload: true,
	subsets: ["latin"],
	variable: "--outfit",
	weight: "variable",
});
