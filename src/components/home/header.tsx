"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import type { SocialLink } from "@/data/links";

import { Brand, brandLabel, Close, Moon, Sun } from "./icons";

interface HeaderProps {
	email: string;
	firstName: string;
	resume: string;
	socials: SocialLink[];
}

const PRIMARY = [
	{ href: "#projects", label: "Projects" },
	{ href: "#about", label: "About" },
	{ href: "#contact", label: "Contact" },
];
const SECONDARY = [
	{ href: "#skills", label: "Skills" },
	{ href: "#experience", label: "Experience" },
];

function toggleTheme() {
	const root = document.documentElement;
	const next = root.dataset.theme === "dark" ? "light" : "dark";
	root.dataset.theme = next;
	try {
		localStorage.setItem("theme", next);
	} catch {}
}

// Each letter is its own span so the close animation can drop them one by one.
function Pieces({ text }: { text: string }) {
	return (
		<span className="nav-text">
			<span className="sr-only">{text}</span>
			<span aria-hidden="true">
				{Array.from(text).map((ch, i) => (
					<span className="nav-piece" key={i}>
						{ch === " " ? " " : ch}
					</span>
				))}
			</span>
		</span>
	);
}

export default function Header({ email, firstName, resume, socials }: HeaderProps) {
	const dialog = useRef<HTMLDialogElement>(null);
	const trigger = useRef<HTMLButtonElement>(null);
	const motion = useRef<"closed" | "open" | "closing">("closed");
	const timeline = useRef<gsap.core.Timeline | null>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => () => void timeline.current?.kill(), []);

	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open]);

	// Opening is instant; the show is in the close.
	function openMenu() {
		const d = dialog.current;
		if (!d || motion.current !== "closed") return;
		timeline.current?.kill();
		gsap.set([d, ...d.querySelectorAll(".nav-piece")], { clearProps: "transform,opacity,visibility,willChange" });
		gsap.set(d, { "--nav-backdrop-opacity": 1 });
		motion.current = "open";
		d.dataset.motion = "open";
		d.showModal();
		setOpen(true);
		d.querySelector(".nav-panel")?.scrollTo(0, 0);
	}

	// Letters fall out of the panel, then the panel folds back into the menu button.
	function closeMenu(then?: () => void) {
		const d = dialog.current;
		if (!d?.open || motion.current === "closing") return;
		timeline.current?.kill();
		motion.current = "closing";
		d.dataset.motion = "closing";
		const done = () => {
			d.close();
			then?.();
		};
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) return done();

		const pieces = Array.from(d.querySelectorAll<HTMLElement>(".nav-piece"));
		const box = d.getBoundingClientRect();
		const fall = pieces.map((p) => box.bottom - p.getBoundingClientRect().top + 80);
		const btn = trigger.current?.getBoundingClientRect();
		timeline.current = gsap
			.timeline({ onComplete: done })
			.set(pieces, { willChange: "transform,opacity" }, 0.22)
			.to(
				pieces,
				{
					duration: 0.7,
					ease: "power2.in",
					rotation: (i) => ((i * 37) % 97) - 48,
					stagger: { amount: 0.18, from: "random" },
					x: (i) => `+=${((i * 29) % 83) - 41}`,
					y: (i) => `+=${fall[i]}`,
				},
				0.22,
			)
			.to(pieces, { autoAlpha: 0, duration: 0.16, ease: "power1.in", stagger: { amount: 0.18 } }, 0.76)
			.to(
				d,
				{
					"--nav-backdrop-opacity": 0,
					autoAlpha: 0,
					duration: 0.46,
					ease: "power3.inOut",
					scaleX: btn ? btn.width / box.width : 0.06,
					scaleY: btn ? btn.height / box.height : 0.04,
					transformOrigin: "top right",
					x: btn ? btn.right - box.right : 0,
					y: btn ? btn.top - box.top : -16,
				},
				"+=0.12",
			);
	}

	return (
		<>
			<header className="site-header">
				<div className="header-pill">
					<a aria-label={`${firstName}, home`} className="wordmark" href="#about">
						<span className="wordmark-text">{firstName}</span>
					</a>
					<div className="header-actions">
						{/* Both icons render; CSS shows the one for the current theme, so SSR never mismatches. */}
						<button aria-label="Toggle dark mode" className="icon-btn" onClick={toggleTheme} type="button">
							<span className="icon-moon">
								<Moon />
							</span>
							<span className="icon-sun">
								<Sun />
							</span>
						</button>
						<button
							aria-controls="navigation-panel"
							aria-expanded={open}
							aria-haspopup="dialog"
							aria-label="Navigation menu"
							className="menu-btn"
							onClick={openMenu}
							ref={trigger}
							type="button"
						>
							<span />
							<span />
							<span />
						</button>
					</div>
				</div>
			</header>

			<dialog
				aria-label="Navigation menu"
				className="nav-dialog"
				id="navigation-panel"
				onCancel={(e) => {
					e.preventDefault();
					closeMenu();
				}}
				onClick={(e) => {
					const r = e.currentTarget.getBoundingClientRect();
					const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
					if (e.target === e.currentTarget && outside) return closeMenu();
					// In-page links wait for the close animation, then navigate.
					const link = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
					if (!link || link.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
					e.preventDefault();
					closeMenu(() => window.location.assign(link.href));
				}}
				onClose={() => {
					timeline.current?.kill();
					motion.current = "closed";
					delete dialog.current?.dataset.motion;
					setOpen(false);
					trigger.current?.focus({ preventScroll: true });
				}}
				ref={dialog}
			>
				<div className="nav-panel">
					<div className="nav-panel-top">
						<button aria-label="Close navigation menu" className="nav-panel-close" onClick={() => closeMenu()} type="button">
							<Pieces text="close" />
							<span className="nav-close-circle nav-piece">
								<Close size={23} />
							</span>
						</button>
					</div>
					<nav aria-label="Site navigation" className="nav-panel-links">
						<div className="nav-primary">
							{PRIMARY.map((l) => (
								<a href={l.href} key={l.href}>
									<Pieces text={l.label} />
								</a>
							))}
						</div>
						<div className="nav-secondary">
							{SECONDARY.map((l) => (
								<a href={l.href} key={l.href}>
									<Pieces text={l.label} />
								</a>
							))}
							<a href={resume} rel="noreferrer" target="_blank">
								<Pieces text="Resume" />
							</a>
						</div>
					</nav>
					<div className="nav-panel-footer">
						<a className="nav-panel-email" href={`mailto:${email}`}>
							<Pieces text={email} />
						</a>
						<div className="nav-panel-socials">
							{socials.map((s) => (
								<a aria-label={brandLabel(s.platform)} className="nav-piece" href={s.vanity} key={s.platform} rel="noreferrer" target="_blank">
									<Brand platform={s.platform} size={20} />
								</a>
							))}
						</div>
					</div>
				</div>
			</dialog>
		</>
	);
}
