import type { Metadata } from "next";

import { EMAIL, RESUME, SITE, social } from "@/data/links";
import { ebGaramond } from "@/utils/helper/font-helper";
import "./cv.css";

const PDF = "/Malay-Mishra-Resume.pdf";
const profile = (platform: string) => social.find((s) => s.platform === platform)?.canonical ?? SITE;

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

export default function CV() {
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

					<div className="cv-job">
						<div className="cv-row">
							<h3>ADEPTMIND</h3>
							<b>Bangalore, KA</b>
						</div>
						<div className="cv-row">
							<b>Engineering</b>
							<b>06/2024 - Present</b>
						</div>
						<p>
							Adeptmind leverages Gen AI and deep intent mining to transform retail search and discovery—bridging the gap between physical products and
							digital shoppers through AI-driven optimization.
						</p>
						<ul>
							<li>
								<b>Developed the dlp-endpoints service from scratch using Go</b>, transitioning performance-critical APIs that previously had ~1.8s
								latency, reducing response times dramatically and improving client satisfaction.
							</li>
							<li>
								Worked on improving <b>Core Web Vitals</b> and UI performance for major clients such as <b>Foot Locker, Gap, Lululemon, and Decathlon</b>{" "}
								and more implementing SEO optimizations that improved page speed by approximately <b>60%</b> and contributed to client growth. Also
								worked on <b>indexing and crawling optimizations</b> to improve search engine discoverability and page performance.
							</li>
							<li>
								<b>Enhanced DLP Platform</b> with backend improvements including <i>Interlink Optimization</i> in Chat-DLP, enabling richer interlink
								structures for better data linking and discoverability.
								<ul>
									<li>
										Implemented an AI-driven interlink system using <b>OpenAI embeddings</b> to dynamically generate multi-ratio interlinks between{" "}
										<i>CLP</i>, <i>DLP</i>, and <i>PDP</i> pages, optimizing search performance and page relationships.
									</li>
								</ul>
							</li>
							<li>
								<b>Led frontend revamp</b> by introducing reusable templates for <i>FAQ</i> and <i>404</i> pages, accelerating new client onboarding and
								enhancing SEO rankings.
								<ul>
									<li>
										Integrated <b>Framer Motion animations</b> for smooth transitions, improving user engagement and visibility in <b>AI Overviews</b>.
									</li>
								</ul>
							</li>
							<li>
								<b>Owned and delivered DLP SLA targets</b>, resolving <b>~40 tickets in 2 months</b> while simultaneously being on{" "}
								<b>Engineering Support</b> for over 2 months, ensuring stability and prompt issue resolution.
							</li>
							<li>
								<b>Mentored and onboarded juniors</b>, providing detailed <b>KT sessions</b>, daily guidance, and regular feedback, successfully
								transitioning them to full-time engineers.
							</li>
						</ul>
					</div>

					<div className="cv-job">
						<div className="cv-row">
							<h3>PLIVO</h3>
							<b>Bangalore, KA</b>
						</div>
						<div className="cv-row">
							<b>SDE | Founding Team</b>
							<b>06/2022 - 05/2024</b>
						</div>
						<p>
							Contacto (a subsidiary of Myntra) is a product solution that enables businesses to set up their contact center with a few button clicks and
							drag and drop functionality.
						</p>
						<ul>
							<li>
								Developed and maintained scalable <b>backend services and APIs</b> using <b>Java and Intershop Commerce Suite</b>, supporting
								e-commerce and customer-facing application workflows.
							</li>
							<li>
								Developed and maintained backend modules within the <b>Intershop Commerce Suite (ISM)</b>, working with Intershop architecture and
								e-commerce components.
							</li>
							<li>
								Designed and integrated <b>REST APIs</b> between Intershop backend services and frontend applications to support seamless application
								workflows.
							</li>
							<li>
								Worked on <b>e-commerce catalog, product, category, and search-related functionality</b> within Intershop-based applications.
							</li>
							<li>Customized and enhanced Intershop backend functionality based on business and product requirements.</li>
							<li>
								Participated in <b>performance tuning, debugging, unit testing, code reviews, and production issue resolution</b> for Intershop-based
								services.
							</li>
							<li>
								Collaborated with frontend engineers, business stakeholders, QA, and technical teams to design and deliver e-commerce functionality.
							</li>
							<li>
								Converted an Electron.js desktop application into a <b>browser-based application</b>, implementing WebSockets and browser communication
								APIs for real-time functionality.
							</li>
							<li>
								Improved customer workflow efficiency by approximately <b>50%</b> by eliminating platform switching and reducing multiple-login
								requirements.
							</li>
							<li>
								Independently designed and delivered major product capabilities including{" "}
								<b>Email and WhatsApp communication channels, Agent Monitoring, and Agent Barging</b>.
							</li>
							<li>
								Worked across frontend and backend integrations to establish reliable communication between customer-facing applications and backend
								services.
							</li>
							<li>
								Migrated <b>Create React App to Vite</b>, reducing development iteration time by approximately <b>2x</b> through faster HMR and
								improving build performance.
							</li>
						</ul>
					</div>

					<div className="cv-job">
						<div className="cv-row">
							<h3>KREDX</h3>
							<b>Bangalore, KA</b>
						</div>
						<div className="cv-row">
							<b>SDE</b>
							<b>06/2021 - 06/2022</b>
						</div>
						<ul>
							<li>
								<b>Integrated single SPA package for Micro FrontEnd</b> architecture of entire repos, Which help in reducing deployment time and
								independent task on single feature by <b>multiple developers by 60%</b>
							</li>
							<li>
								Designed and implemented Server-driven forms for vendor onboarding where it dynamically adapts to backend response and Developed a
								central doc upload module that allowed all teams to reuse upload and maker-checker functionality.
							</li>
							<li>Implemented a GraphQL code generator for auto-generating types, leading to a reduction in writing buggy code.</li>
							<li>
								<b>Achieved 60% test coverage</b> for the entire Capvel repository.
							</li>
						</ul>
					</div>

					<div className="cv-job">
						<div className="cv-row">
							<h3>GOODHEALTH</h3>
							<b>Bangalore, KA</b>
						</div>
						<div className="cv-row">
							<b>SDE | Founding Team</b>
							<b>05/2020 - 04/2021</b>
						</div>
						<ul>
							<li>
								Created the entire website from scratch using design libraries such as Ant Design. Optimized user experience (UX) by implementing lazy
								loading, Brotli for asset compression, and progressive image loading. Additionally, incorporated parallax effects for an attractive and
								animated UI.
							</li>
							<li>
								During development made sure the website is accessible in all the devices and meets PWA requirements if required in future.
							</li>
						</ul>
					</div>
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
