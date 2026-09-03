// Profile content for the landing page.
//
// The static block below is authored here; `experience` / `topSkills` / `impact`
// / `focus` are derived at request time from the JSON in
// github.com/hi-malay/portfolio-data via `buildProfile`, so content can be
// updated without a redeploy. Every derived field has a safe empty fallback —
// a failed fetch degrades to the static block rather than throwing.

export interface RemoteExperience {
	achievements?: string[];
	company?: string;
	description?: string;
	image?: string;
	link?: string;
	location?: string;
	period?: string;
	role?: string;
	technologies?: string[];
}

export interface RemoteSkillGroup {
	category?: string;
	items?: string[];
}

export interface ExperienceItem {
	company: string;
	description: string;
	fromDate: string;
	link: string;
	location: string;
	title: string;
	toDate: string;
}

/** Renders in the `#impact` section (kicker = context, statement = the win). */
export interface ImpactItem {
	context: string;
	detail: string;
	metric: string;
}

/** Renders in the `#focus` section (statement = category, kicker = the stack). */
export interface FocusItem {
	items: string[];
	title: string;
}

const personal = {
	about:
		"Fullstack Engineer with 5+ years building high-performance systems. Delivered sub-second APIs, led major frontend revamps, and shipped AI-driven features. Passionate about performance, clean architecture, and mentoring engineers.",
	currentRole: "Fullstack Engineer",
	displayEmail: "hi.malay879@gmail.com",
	emails: ["hi.malay879@gmail.com"],
	github: { handle: "hi-malay", public_repos: 42 },
	location: { city: "Bengaluru, Karnataka", country: "India", country_code: "IN", full: "Bengaluru, Karnataka, India" },
	name: "Malay Mishra",
	resume: "https://docs.google.com/document/d/1ooxRpsMKrawyWxY7ogWucUhPtU0PYjSdhW1NNqqBJys/edit?tab=t.0",
	tagline: "Building resilient systems that stay fast under load — from sub-second Go services to micro-frontends that ship without drama.",
	title: "Engineer | Architect | Creator",
	website: "malaymishra.com",
};

const socialHandles = [
	{ handle: "mmalay", platform: "linkedin", url: "https://linkedin.com/in" },
	{ handle: "hi-malay", platform: "github", url: "https://github.com" },
];

const links = [{ key: "cv", url: personal.resume }];

/** Achievements worth surfacing in `#impact` — those carrying a hard number. */
const METRIC_RE = /\d+\s*%|\d+\s*x\b|\bsub-second\b|~?\d+\s*(?:tickets|customers|ms|s)\b|\d+\s*\+/i;

/** Connectives that would leave the headline dangling if it ended on them. */
const TRAILING_RE = /[\s,;:–—-]+(?:and|with|using|for|to|from|by|in|on|of|the|a|an|while|that|which)$/i;

const clean = (text: string) => text.replace(/`/g, "").trim();

const trimDangling = (text: string) => {
	let out = text;
	for (let i = 0; i < 3 && TRAILING_RE.test(out); i += 1) out = out.replace(TRAILING_RE, "");
	return out;
};

/** Pulls the quantified clause out of an achievement to use as the headline. */
function metricOf(text: string): string {
	const clause = clean(text)
		.split(/[;,]|\s+[–—]\s+/)
		.map((part) => part.trim())
		.find((part) => METRIC_RE.test(part));
	if (!clause) return "";
	let out = trimDangling(clause);
	if (out.length > 96) {
		const cut = out.lastIndexOf(" ", 96);
		out = trimDangling(out.slice(0, cut === -1 ? 96 : cut));
	}
	return out.charAt(0).toUpperCase() + out.slice(1);
}

function splitPeriod(period: string): [string, string] {
	const [from = "", to = ""] = period.split(/\s+[-–]\s+/);
	return [from.trim(), to.trim()];
}

function toExperience(entries: RemoteExperience[]): ExperienceItem[] {
	return entries.map((entry) => {
		const [fromDate, toDate] = splitPeriod(entry.period ?? "");
		const bullets = (entry.achievements ?? []).map(clean).filter(Boolean);
		return {
			company: entry.company ?? "",
			// landing.tsx's firstBullet() splits on "•", so lead every bullet with one.
			description: bullets.length ? `• ${bullets.join("\n• ")}` : clean(entry.description ?? ""),
			fromDate,
			link: entry.link ?? "",
			location: entry.location ?? "",
			title: entry.role ?? "",
			toDate,
		};
	});
}

function toImpact(entries: RemoteExperience[], limit = 5): ImpactItem[] {
	const out: ImpactItem[] = [];
	for (const entry of entries) {
		const hit = (entry.achievements ?? []).map(clean).find((a) => METRIC_RE.test(a));
		if (!hit) continue;
		// Keep only the clauses the headline does not already say, so the card
		// reads as "the win" + "the context" rather than repeating itself.
		const rest = hit
			.split(/[;,]|\s+[–—]\s+/)
			.map((part) => part.trim())
			.filter((part) => part && !METRIC_RE.test(part))
			.join(", ");
		out.push({
			context: [entry.company, entry.period].filter(Boolean).join(" · "),
			detail: rest,
			metric: metricOf(hit) || hit,
		});
		if (out.length >= limit) break;
	}
	return out;
}

function toFocus(groups: RemoteSkillGroup[]): FocusItem[] {
	return groups
		.filter((group) => group.category && (group.items ?? []).length)
		.map((group) => ({ items: group.items ?? [], title: group.category ?? "" }));
}

function toTopSkills(groups: RemoteSkillGroup[], limit = 16): string[] {
	// Round-robin across categories so the two rendered rows stay varied.
	const lanes = groups.map((group) => [...(group.items ?? [])]);
	const out: string[] = [];
	for (let depth = 0; out.length < limit && lanes.some((lane) => lane.length); depth += 1) {
		for (const lane of lanes) {
			const next = lane.shift();
			if (next && !out.includes(next)) out.push(next);
			if (out.length >= limit) break;
		}
	}
	return out;
}

export function buildProfile(experience: RemoteExperience[] = [], skills: RemoteSkillGroup[] = []) {
	return {
		experience: toExperience(experience),
		focus: toFocus(skills),
		impact: toImpact(experience),
		links,
		personal,
		socialHandles,
		topSkills: toTopSkills(skills),
	};
}

export const profile = buildProfile();

export type TProfile = ReturnType<typeof buildProfile>;
