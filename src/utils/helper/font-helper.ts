import { Inter_Tight, Outfit } from "next/font/google";

export const interTight = Inter_Tight({
	display: "swap",
	preload: true,
	subsets: ["latin"],
	variable: "--font-inter-tight",
	weight: ["200", "400", "500", "600"],
});

export const outfit = Outfit({
	display: "swap",
	preload: true,
	subsets: ["latin"],
	variable: "--outfit",
	weight: "variable",
});
