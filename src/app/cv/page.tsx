import type { Metadata } from "next";

import { DATA_BASE, EMAIL, RESUME, SITE, social } from "@/data/links";
import type { RemoteExperience } from "@/data/profile";
import { ebGaramond } from "@/utils/helper/font-helper";
import "./cv.css";

const PDF = "/Malay-Mishra-Resume.pdf";
const profile = (platform: string) => social.find((s) => s.platform === platform)?.canonical ?? SITE;

// "**text**" in experience.json renders bold.
const bold = (text: string) => text.split("**").map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part));

async function getExperience(): Promise<RemoteExperience[]> {
	const res = await fetch(`${DATA_BASE}/experience.json`, { next: { revalidate: 300 } });
	// Throw rather than render an empty CV: on revalidation, Next keeps serving the last good page.
	if (!res.ok) throw new Error(`experience.json responded ${res.status}`);
	return res.json();
}

const DESCRIPTION =
	"Resume of Malay Mishra, Fullstack Engineer with 4+ years building scalable backend services, APIs and e-commerce platforms with Go, Python, React and Next.js.";

export const metadata: Metadata = {
	alternates: { canonical: RESUME },
	description: DESCRIPTION,
	openGraph: {
		description: DESCRIPTION,
		images: [`${SITE}/og-image.png`],
		title: "Malay Mishra - Resume",
		url: RESUME,
	},
	title: "Malay Mishra - Resume",
};

export default async function CV() {
	const experience = await getExperience();

	return (
		<main className={`cv ${ebGaramond.className}`}>
			<article className="cv-paper">
				<header className="cv-head">
					<h1>Malay Mishra</h1>
					<p>
						Bangalore, KA • <a href={`mailto:${EMAIL}`}>{EMAIL}</a> • <a href="tel:+918107680129">+918107680129</a> •{" "}
						<a href={profile("linkedin")}>Linkedin</a> • <a href={profile("github")}>Github</a> • <a href={SITE}>Portfolio</a>
					</p>
				</header>

				<section>
					<h2>Personal Summary</h2>
					<p>
						Fullstack Engineer with 4+ years of experience building and optimizing scalable backend services, APIs, and e-commerce platforms. Strong
						experience with Go, Python, REST APIs, GraphQL, distributed systems, performance optimization, and modern web architectures.
					</p>
				</section>

				<section>
					<h2>Professional Experience</h2>
					{experience.map((job) => (
						<div className="cv-job" key={job.company}>
							<div className="cv-row">
								<h3>{job.company}</h3>
								<b>{job.location}</b>
							</div>
							<div className="cv-row">
								<b>{job.role}</b>
								<b>{job.period}</b>
							</div>
							{job.description && <p>{job.description}</p>}
							<ul>
								{job.achievements?.map((point) => (
									<li key={point}>{bold(point)}</li>
								))}
							</ul>
						</div>
					))}
				</section>

				<section>
					<h2>Education</h2>
					<div className="cv-row">
						<h3>LOVELY PROFESSIONAL UNIVERSITY</h3>
						<b>Jalandhar, Punjab</b>
					</div>
					<div className="cv-row">
						<b>
							<i>B.tech in Computer Science and Engineering</i>
						</b>
						<b>2017-2021</b>
					</div>
					<ul>
						<li>CGPA: 8/10</li>
					</ul>
				</section>

				<section>
					<h2>Additional Information</h2>
					<ul>
						<li>
							<b>Backend:</b> Go, Gin, Python, FastAPI, Node.js, REST APIs, GraphQL
							<br />
							<b>Frontend:</b> JavaScript, TypeScript, React.js, Next.js, Vue.js, Redux
							<br />
							<b>Architecture:</b> Microservices, Microfrontends, Server-Driven UI, API Design, Distributed Systems
							<br />
							<b>Databases &amp; Storage:</b> PostgreSQL, Redis, Snowflake, Google Cloud Storage
							<br />
							<b>Cloud &amp; Infrastructure:</b> AWS, GCP, CI/CD, Webpack, Vite
							<br />
							<b>Testing &amp; Quality:</b> Unit Testing, Integration Testing, Test Automation, Code Reviews
							<br />
							<b>E-commerce &amp; AI:</b> E-commerce Search, Product Discovery, OpenAI APIs, Embeddings, Agentic AI
							<br />
							<b>Other:</b> Electron.js, Storybook, Material UI, Monorepo, Lerna
						</li>
						<li>
							<b>Languages</b>: English(Full Professional Proficiency), Hindi(Native or Bilingual Proficiency)
						</li>
						<li>
							<b>Achievements</b>: Problem Solver of the year 2023, Plivo, Attended 20 SSB(Service Selection Board) Bhopal, Indian Army, Represented
							State under 17, Badminton
						</li>
					</ul>
				</section>
			</article>

			<a className="cv-download" download href={PDF}>
				<svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18">
					<path d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
				Download Resume
			</a>
		</main>
	);
}
