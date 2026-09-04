"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

export interface NavLink {
	href: string;
	label: string;
	section: string;
}

interface NavProps {
	cta: { href: string; label: string };
	links: NavLink[];
	name: string;
}

export default function Nav({ cta, links, name }: NavProps) {
	const [open, setOpen] = useState(false);
	const toggle = useCallback(() => setOpen((v) => !v), []);
	const close = useCallback(() => setOpen(false), []);

	return (
		<header className="fixed inset-x-0 top-0 z-1000">
			<div className="flex items-center justify-between px-6 py-4 md:px-[3.2rem] md:py-[2.6rem]">
				<Link aria-label={`${name} home`} className="flex items-center gap-2 font-medium text-[1.9rem] tracking-tight" data-hero-fade href="/">
					{/* The tab icon doubles as the header mark. Square source with real
					    alpha, so the round badge needs no clipping. The Link carries the
					    aria-label, hence the empty alt. */}
					<Image alt="" className="aspect-square h-[2.8rem] w-[2.8rem]" height={88} priority src="/thumbnail_cropped.png" width={88} />
					<span className="hidden sm:inline">
						{name.split(" ")[0]}
						<span className="text-(--accent)">.</span>
					</span>
				</Link>

				<nav className="hidden items-center gap-10 md:flex" data-hero-fade>
					{links.map((link) => (
						<a className="nav-link" data-roll data-section={link.section} href={link.href} key={link.label}>
							{link.label}
						</a>
					))}
					<a className="pill" href={cta.href} rel="noreferrer" target="_blank">
						<span>{cta.label}</span>
					</a>
				</nav>

				<button aria-expanded={open} aria-label="Menu" className="round-btn nav-burger" onClick={toggle} type="button">
					<svg aria-hidden="true" fill="none" height="18" viewBox="0 0 20 18" width="20">
						{open ? (
							<path d="M3 3l14 12M17 3L3 15" stroke="currentColor" strokeWidth="2" />
						) : (
							<path d="M1 3h18M1 9h18M1 15h18" stroke="currentColor" strokeWidth="2" />
						)}
					</svg>
				</button>
			</div>

			{open ? (
				<nav className="glass hairline-t flex flex-col gap-7 px-6 pt-8 pb-10 md:hidden">
					{links.map((link) => (
						<a className="t-section" href={link.href} key={link.label} onClick={close}>
							{link.label}
						</a>
					))}
					<div className="mt-2">
						<a className="pill" href={cta.href} rel="noreferrer" target="_blank">
							<span>{cta.label}</span>
						</a>
					</div>
				</nav>
			) : null}
		</header>
	);
}
