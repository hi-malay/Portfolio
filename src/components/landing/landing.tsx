import type { TProfile } from "@/data/profile";
import { interTight } from "@/utils/helper/font-helper";

import Experience from "./experience";
import Nav from "./nav";
import "./landing.css";

interface LandingProps {
	profile?: TProfile;
}

const NAV_LINKS = [
	{ href: "#work", label: "Work", section: "work" },
	{ href: "#skills", label: "Skills", section: "skills" },
	{ href: "#focus", label: "Focus", section: "focus" },
	{ href: "#contact", label: "Contact", section: "contact" },
];

const TRAILING_SLASH = /\/$/;

const firstBullet = (text?: string) =>
	(text ?? "")
		.split("•")
		.map((s) => s.trim())
		.find(Boolean) ?? "";

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, text.lastIndexOf(" ", max)).trimEnd()}…` : text);

function derive(profile?: TProfile) {
	const personal = profile?.personal;
	const extra = (personal ?? {}) as { meeting?: string; npx?: string; resume?: string };
	const links = new Map((profile?.links ?? []).map((l) => [l.key, l.url]));
	const name = personal?.name ?? "Malay Mishra";
	const [firstName = "Malay", ...rest] = name.split(" ");
	const lastName = rest.join(" ");
	const role = personal?.currentRole ?? "Fullstack Engineer";
	const titles = (personal?.title ?? "Engineer | Architect | Creator").split("|").map((s) => s.trim());
	const about = personal?.about ?? personal?.tagline ?? "";
	const email = personal?.displayEmail ?? personal?.emails?.[0] ?? "hi.malay879@gmail.com";
	const meeting = extra.meeting ?? links.get("meet") ?? `mailto:${email}`;
	const resume = extra.resume ?? links.get("cv") ?? "#";
	const location = personal?.location?.city ?? personal?.location?.full ?? "";
	const experience = profile?.experience ?? [];
	const topSkills = profile?.topSkills ?? [];
	const impact = profile?.impact ?? [];
	const focus = profile?.focus ?? [];
	const socials = profile?.socialHandles ?? [];
	const github = personal?.github;
	return {
		about,
		email,
		experience,
		extra,
		firstName,
		focus,
		github,
		impact,
		lastName,
		location,
		meeting,
		name,
		personal,
		resume,
		role,
		socials,
		titles,
		topSkills,
	};
}

export default function Landing({ profile }: LandingProps) {
	const {
		about,
		email,
		experience,
		extra,
		firstName,
		focus,
		github,
		impact,
		lastName,
		location,
		meeting,
		name,
		personal,
		resume,
		role,
		socials,
		titles,
		topSkills,
	} = derive(profile);

	return (
		<div className={`landing ${interTight.variable}`}>
			<div aria-hidden="true" className="loader" id="loader">
				<div className="loader-spinner">
					<i />
					<i />
					<i />
					<i />
				</div>
				<div className="loader-word">
					Hi, I&apos;m {firstName}.
					<br />
					{role}.
				</div>
				<div className="loader-meta">
					<span>Loading</span>
					<span className="loader-count">000</span>
				</div>
			</div>

			<canvas className="gl-canvas" id="gl" />
			<div aria-hidden="true" className="header-veil" />
			<Nav cta={{ href: resume, label: "Resume" }} links={NAV_LINKS} name={name} />

			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main className="shell">
						<section className="section items-start pt-48" data-stage id="hero">
							<div className="w-full">
								<h1 className="t-hero max-w-[9em]" data-hero-headline>
									{firstName}
									<br />
									{lastName}.
								</h1>
								<div className="mt-6 max-w-140">
									<p className="t-kicker" data-hero-fade>
										{role}
										{location ? ` · ${location}` : ""}
									</p>
									<p className="t-body mt-4" data-hero-fade>
										{about}
									</p>
									<div className="mt-6 flex flex-wrap items-center gap-5" data-hero-fade>
										<a className="pill" href={meeting} rel="noreferrer" target="_blank">
											<span>Let&apos;s talk</span>
										</a>
										{extra.npx ? <code className="t-mute text-[max(12px,0.95rem)]">{extra.npx}</code> : null}
									</div>
								</div>
							</div>
						</section>

						<section className="section section--h15 justify-end" data-stage id="about">
							<div className="max-w-140">
								<h2 className="t-section" data-reveal>
									{titles.map((t) => (
										<span className="block" key={t}>
											{t}.
										</span>
									))}
								</h2>
								<p className="t-body mt-7" data-reveal>
									{personal?.tagline ?? about}
								</p>
							</div>
						</section>

						<section className="section section--h35" data-stage id="work">
							<div className="mx-auto flex w-full max-w-[88rem] flex-col justify-center gap-40 py-24 text-center">
								{experience.map((job) => (
									<div className="beat mx-auto flex flex-col gap-5" key={`${job.company}-${job.fromDate}`}>
										<p className="t-kicker" data-fade>
											{job.fromDate} — {job.toDate}
										</p>
										<p className="t-statement" data-reveal>
											{job.title} at {job.company}.
										</p>
										{firstBullet(job.description) ? (
											<p className="t-body t-mute" data-reveal>
												{clip(firstBullet(job.description), 150)}
											</p>
										) : null}
									</div>
								))}
							</div>
						</section>

						<section className="section section--h15 justify-end" data-stage id="skills">
							<div className="max-w-140">
								<h2 className="t-section" data-reveal>
									Fluent in the
									<br />
									whole stack.
								</h2>
								<p className="t-body mt-7" data-reveal>
									{topSkills.slice(0, 8).join(" · ")}
								</p>
								<p className="t-body t-mute mt-5" data-reveal>
									{topSkills.slice(8).join(" · ")}
								</p>
							</div>
						</section>

						<section className="section section--h15 justify-start" data-stage id="impact">
							<div className="max-w-140">
								<h2 className="t-section" data-reveal>
									What it
									<br />
									moved.
								</h2>
								<div className="mt-7 flex flex-col">
									{impact.map((item) => (
										<div className="card" data-fade key={item.context}>
											<p className="t-kicker">{item.context}</p>
											<p className="t-statement mt-2">{item.metric}</p>
											{item.detail ? <p className="t-body t-mute mt-1">{clip(item.detail, 150)}</p> : null}
										</div>
									))}
								</div>
							</div>
						</section>

						<section className="section section--h15 flex-col justify-center" data-stage id="focus">
							<div className="mb-12 w-full">
								<h2 className="t-big" data-reveal>
									Focus.
								</h2>
							</div>
							<div className="grid w-full gap-x-12 md:grid-cols-2">
								{focus.map((area) => (
									<div className="card" data-fade key={area.title}>
										<p className="t-kicker">{area.title}</p>
										<p className="t-statement mt-2">{area.items.join(" · ")}</p>
									</div>
								))}
							</div>
						</section>

						<section className="section flex-col justify-between pb-0" data-stage id="contact">
							<div className="flex w-full flex-1 flex-col items-center justify-center text-center">
								<h2 className="t-cta mx-auto max-w-[26em]" data-reveal>
									Have something worth building?
									<br />
									Let&apos;s talk.
								</h2>
								<div className="mt-10 flex flex-wrap items-center justify-center gap-6" data-fade>
									<a className="pill" href={meeting} rel="noreferrer" target="_blank">
										<span>Book a call</span>
									</a>
									<a className="link-amber text-[max(12px,1rem)]" href={`mailto:${email}`}>
										{email}
									</a>
								</div>
							</div>
							<footer className="glass hairline-t -mx-6 flex w-screen flex-col items-center gap-6 px-8 py-8 md:flex-row md:justify-between md:px-12">
								<p className="text-(--ink-dim) text-[max(11px,0.8rem)]">
									© {new Date().getFullYear()} {name}. {github ? `${github.public_repos} public repos.` : ""}
								</p>
								<nav className="flex flex-wrap items-center justify-center gap-6">
									{socials.map((s) => (
										<a
											className="nav-link"
											data-roll
											href={`${s.url.replace(TRAILING_SLASH, "")}/${s.handle}`}
											key={s.platform}
											rel="noreferrer"
											target="_blank"
										>
											{s.platform}
										</a>
									))}
								</nav>
							</footer>
						</section>
					</main>
				</div>
			</div>
			<Experience />
		</div>
	);
}
