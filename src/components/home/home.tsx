import Image from "next/image";

import type { TProfile } from "@/data/profile";
import { projects } from "@/data/projects";
import { spaceGrotesk } from "@/utils/helper/font-helper";

import { ContactForm, CopyEmail } from "./contact";
import Crowd from "./crowd";
import Header from "./header";
import HeroMotion from "./hero-motion";
import { ArrowUp, ArrowUpRight, Brand, brandLabel } from "./icons";
import Projects from "./projects";
import "./home.css";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// "06/2024" -> "June 2024"; anything else ("Present") passes through.
const fmt = (d: string) => {
	const [m, y] = d.split("/");
	return y ? `${MONTHS[Number(m) - 1] ?? m} ${y}` : d;
};

const firstBullet = (text: string) =>
	text
		.split("•")
		.map((s) => s.trim())
		.find(Boolean) ?? "";

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, text.lastIndexOf(" ", max)).trimEnd()}…` : text);

const BOLD = /(resilient systems|sub-second Go services|micro-frontends)/;

const Chevron = ({ right }: { right?: boolean }) => {
	const d = right ? "M14 12 46 50 14 88" : "M46 12 14 50 46 88";
	return (
		<svg aria-hidden="true" className="code-mark" viewBox="0 0 60 100">
			<path className="code-depth" d={d} />
			<path d={d} />
		</svg>
	);
};

const Slash = () => (
	<svg aria-hidden="true" className="code-mark code-slash" viewBox="0 0 40 100">
		<path className="code-depth" d="M32 10 8 90" />
		<path d="M32 10 8 90" />
	</svg>
);

export default function Home({ profile }: { profile: TProfile }) {
	const { experience, focus, personal, socialHandles: socials } = profile;
	const name = personal.name;
	const [firstName] = name.split(" ");
	const role = personal.currentRole;
	const [roleTop, ...roleRest] = role.toUpperCase().split(" ");
	const titles = personal.title.split("|").map((s) => s.trim());
	const where = `${personal.location.city.split(",")[0]}, ${personal.location.country}`;
	const email = personal.displayEmail;
	const resume = personal.resume;
	const current = experience.find((e) => /present/i.test(e.toDate));
	const github = socials.find((s) => s.platform === "github")?.vanity;
	const year = new Date().getFullYear();

	const code = [
		`const ${firstName.toLowerCase()} = {`,
		`  name: "${name}",`,
		`  role: "${role}",`,
		`  based: "${where}",`,
		"  experience: [",
		...experience.map((e) => `    { company: "${e.company}", role: "${e.title}", since: "${e.fromDate}" },`),
		"  ],",
		"  stack: {",
		...focus.map((f) => `    "${f.title}": [${f.items
			.slice(0, 4)
			.map((i) => `"${i}"`)
			.join(", ")}],`),
		"  },",
		`  projects: [${projects.map((p) => `"${p.title}"`).join(", ")}],`,
		`  email: "${email}",`,
		"};",
	].join("\n");

	const titleLine = (
		<>
			{titles.slice(0, -1).join(", ")}
			<br />& {titles.at(-1)}.
		</>
	);

	return (
		<div className={`home ${spaceGrotesk.variable}`}>
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<Header email={email} firstName={firstName} resume={resume} socials={socials} />

			<main id="main">
				<section id="about">
					<div className="hero">
						<div aria-hidden="true" className="hero-code hero-fade">
							<pre>{code}</pre>
							<pre>{code}</pre>
							<pre>{code}</pre>
						</div>
						<h1 className="hero-title hero-fade">
							<span className="title-line">
								<Chevron />
								{roleTop}
							</span>
							<span className="title-line title-line-2">
								{roleRest.join(" ")}
								<Slash />
								<Chevron right />
							</span>
						</h1>
						<div aria-hidden="true" className="hero-photo-slot" />
						<div className="hero-meta hero-fade">
							<span className="hero-year">©{year}</span>
							<span className="hero-sub">
								<span className="brace">{"{{"}</span> /GO, REACT &amp; SYSTEM DESIGN <span className="brace">{"}}"}</span>
							</span>
						</div>
					</div>

					<div className="bio wrap" id="biography">
						<div className="bio-left">
							<h2 className="bio-hi">
								Hi, I&apos;m{" "}
								<br />
								{firstName}.
							</h2>
							<p className="bio-role">{titleLine}</p>
							<hr />
							<p className="kicker">Currently at</p>
							<p className="bio-now">
								<strong>{current?.company ?? "Open to work"}</strong>
								<br />
								{role}
								<br />
								<span className="soft">{where}</span>
							</p>
						</div>
						<div className="bio-photo-slot">
							<div className="bio-photo">
								<Image alt={`Portrait of ${name}`} fill preload sizes="(max-width: 860px) 80vw, 400px" src="/malay.jpg" />
							</div>
						</div>
						<div className="bio-right">
							<p className="bio-tagline">{personal.tagline.split(BOLD).map((part, i) => (i % 2 ? <strong key={part}>{part}</strong> : part))}</p>
							<a className="btn-dark" href="#projects">
								Explore projects
								<ArrowUpRight />
							</a>
						</div>
					</div>
				</section>

				<section className="section wrap" id="skills">
					<div className="section-head">
						<h2 className="h-section">Tech Stack</h2>
						<p className="section-caption">
							The tools behind{" "}
							<br />
							my work.
						</p>
					</div>
					<div className="stack-grid">
						{focus.map((group) => (
							<div className="stack-group" key={group.title}>
								<h3>{group.title}</h3>
								<ul className="chips">
									{group.items.map((item, i) => (
										<li className={i % 4 === 0 ? "chip chip-dark" : "chip"} key={item}>
											{item}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>

				<section className="section wrap" id="projects">
					<div className="section-head">
						<h2 className="h-section">
							Featured
							<br />
							Projects
						</h2>
						{github ? (
							<a className="link-box" href={github} rel="noreferrer" target="_blank">
								GitHub
								<span>
									<ArrowUpRight size={16} />
								</span>
							</a>
						) : null}
					</div>
					<p className="section-lede">Side projects and professional work. Open a folder to explore a project or case study.</p>
					<Projects projects={projects} />
				</section>

				<section className="section wrap" id="experience">
					<div className="section-head">
						<h2 className="h-section">Experience.</h2>
						<p className="section-caption">
							Current work.{" "}
							<br />
							And where it started.
						</p>
					</div>
					<div className="timeline" style={{ "--cols": experience.length } as React.CSSProperties}>
						<svg aria-hidden="true" className="timeline-wave" preserveAspectRatio="none" viewBox={`0 0 ${experience.length * 100} 140`}>
							<path
								d={experience
									.map((_, i) => {
										const x = i * 100 + 50;
										const y = i % 2 ? 119 : 19;
										return i === 0 ? `M${x} ${y}` : `C${x - 50} ${(i - 1) % 2 ? 119 : 19} ${x - 50} ${y} ${x} ${y}`;
									})
									.join(" ")}
							/>
						</svg>
						<ol className="stops">
						{experience.map((job, i) => (
							<li className={i % 2 ? "stop stop-down" : "stop"} key={`${job.company}-${job.fromDate}`}>
								<span className={i === 0 ? "node node-now" : "node"} />
								{/* Mobile only: S-curve from this node down to the next one. */}
								{i < experience.length - 1 ? (
									<svg aria-hidden="true" className="stop-wave" preserveAspectRatio="none" viewBox="0 0 38 100">
										<path d="M19 0 C47 50 -1 50 19 100" />
									</svg>
								) : null}
								<div className="stop-body">
									<div className="stop-when">
										{/present/i.test(job.toDate) ? <span className="badge">Current role</span> : null}
										<span>
											{fmt(job.fromDate)} – {fmt(job.toDate)}
										</span>
									</div>
									<h3>{job.title}</h3>
									<p className="stop-company">{job.company}</p>
									{job.location ? <p className="soft stop-loc">{job.location}</p> : null}
									<p className="soft stop-desc">{clip(firstBullet(job.description), 140)}</p>
								</div>
							</li>
						))}
						</ol>
					</div>
				</section>

				<section className="section wrap contact" id="contact">
					<div className="contact-left">
						<h2 className="h-hero">Let&apos;s talk.</h2>
						<p className="section-lede">Whether it&apos;s a full-time role or a side project, my inbox is open.</p>
						<div className="email-row">
							<a className="email-link" href={`mailto:${email}`}>
								{email}
								<ArrowUpRight />
							</a>
							<CopyEmail email={email} />
						</div>
						<ul className="socials">
							{socials.map((s) => (
								<li key={s.platform}>
									<a href={s.vanity} rel="noreferrer" target="_blank">
										<Brand platform={s.platform} />
										{brandLabel(s.platform)}
									</a>
								</li>
							))}
						</ul>
					</div>
					<ContactForm email={email} />
				</section>
			</main>

			<footer className="footer">
				<div className="wrap footer-grid">
					<div className="footer-identity">
						<h2 className="footer-name">{firstName}.</h2>
						<p className="footer-soft">{titleLine}</p>
					</div>
					<nav aria-label="Footer navigation" className="footer-nav">
						<p className="footer-soft">Explore</p>
						<div className="footer-links">
							<a href="#about">About</a>
							<a href="#skills">Skills</a>
							<a href="#projects">Projects</a>
							<a href="#experience">Experience</a>
							<a href="#contact">Contact</a>
							<a href={resume} rel="noreferrer" target="_blank">
								Resume
							</a>
						</div>
					</nav>
					<div className="footer-contact">
						<p className="footer-soft">Get in touch</p>
						<a className="footer-email" href={`mailto:${email}`}>
							{email}
							<ArrowUpRight size={16} />
						</a>
						<p className="footer-copy">
							© {year} {name}
						</p>
					</div>
				</div>
				<div className="footer-finale">
					<div className="wrap footer-bye">
						<p>See you around.</p>
						<a href="#">
							Back to top
							<ArrowUp size={16} />
						</a>
					</div>
					<p className="sr-only">Hand-drawn Bengaluru crowd, many in sarees, kurtas and Nehru jackets, walking past {firstName}, who stands still in the middle in a dark jacket.</p>
					<Crowd name={firstName} />
					<div className="wrap footer-note">
						<small>Bengaluru traffic, now on my website too.</small>
					</div>
				</div>
			</footer>

			<HeroMotion />
		</div>
	);
}
