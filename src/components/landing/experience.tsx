"use client";

import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect } from "react";

import { ParticleScene } from "./webgl/scene";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const EASE = "power3.out";
const EASE_LONG = "expo.out";

function revealChars(el: HTMLElement, trigger = true) {
	const split = SplitText.create(el, { autoSplit: true, charsClass: "roll-char", linesClass: "split-line", mask: "lines", type: "lines,chars" });
	const stagger = (i: number, target: Element) => {
		const line = split.lines.findIndex((l) => l.contains(target));
		return 0.035 * Math.max(0, line) + 0.007 * i;
	};
	return gsap.from(split.chars, {
		duration: 1.4,
		ease: EASE_LONG,
		scrollTrigger: trigger ? { start: "top 82%", trigger: el } : undefined,
		stagger,
		yPercent: 118,
	});
}

function revealLines(el: HTMLElement) {
	const split = SplitText.create(el, { autoSplit: true, linesClass: "split-line", mask: "lines", type: "lines" });
	gsap.from(split.lines, { duration: 1.1, ease: EASE_LONG, scrollTrigger: { start: "top 85%", trigger: el }, stagger: 0.075, yPercent: 112 });
}

function letterBounce(el: HTMLElement, signal: AbortSignal) {
	const split = SplitText.create(el, { charsClass: "roll-char", type: "chars" });
	let tween: gsap.core.Tween | null = null;
	el.addEventListener(
		"mouseenter",
		() => {
			if (tween?.isActive()) return;
			tween = gsap.to(split.chars, { duration: 0.25, ease: "power1.out", repeat: 1, stagger: { each: 0.035 }, yoyo: true, yPercent: -18 });
		},
		{ signal }
	);
}

// ScrollSmoother moves the page by transforming #smooth-content inside a fixed,
// overflow-hidden wrapper, so no native `#work` scroll works — not an anchor
// click, not a hash on load. The browser scrolls the hidden wrapper and the
// smoother resets it. Everything below drives the smoother directly instead.
//
// Clearance matches .section's scroll-margin-top. The root font-size is
// viewport-driven (max(12px, 0.8333vw)), so rem is resolved at call time.
const HEADER_CLEARANCE_REM = 9;
const clearancePx = () => HEADER_CLEARANCE_REM * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

// Sections run 150–350svh with their content centred (#work, #focus), bottom-
// aligned (#skills) or spread (#contact), so the top of the section box is dead
// space — aiming at it lands the reader on a blank screen. Every section wraps
// its content in a single leading element; that's the real destination.
const scrollAnchor = (section: HTMLElement) => (section.firstElementChild as HTMLElement | null) ?? section;

// Layout offsets, walked up the offsetParent chain. Deliberately not
// getBoundingClientRect: ScrollSmoother translates #smooth-content, so rects are
// in a moving frame and reading them mid-animation yields a position that
// disagrees with the scroll value. offsetTop ignores transforms.
function docY(el: HTMLElement) {
	let y = 0;
	let node: HTMLElement | null = el;
	while (node) {
		y += node.offsetTop;
		node = node.offsetParent as HTMLElement | null;
	}
	return y;
}

const targetY = (section: HTMLElement) => Math.max(0, docY(scrollAnchor(section)) - clearancePx());

// #smooth-wrapper is fixed + overflow:hidden, and a hash in the URL makes the
// browser scroll *it* to reveal the target — a scroll ScrollSmoother knows
// nothing about, so the content ends up offset from the position the smoother
// and ScrollTrigger both think it's at, and every measurement disagrees with
// what's on screen. GSAP guards the same case internally (ScrollSmoother.js).
function resetWrapperScroll() {
	const wrapper = document.querySelector<HTMLElement>("#smooth-wrapper");
	if (!wrapper) return;
	wrapper.scrollTop = 0;
	wrapper.scrollLeft = 0;
}

// Passing scrollTo a number skips its own offset() lookup, which measures via a
// throwaway ScrollTrigger. Reduced motion has no smoother — fall back to native.
function scrollToSection(section: HTMLElement, smooth: boolean) {
	const y = targetY(section);
	resetWrapperScroll();
	const smoother = ScrollSmoother.get();
	if (smoother) smoother.scrollTo(y, smooth);
	else window.scrollTo({ behavior: smooth ? "smooth" : "auto", top: y });
}

const hashTarget = () => document.getElementById(decodeURIComponent(window.location.hash.slice(1)));

// Editing the hash in the address bar on an already-open page needs the same
// treatment as a nav click. Nav clicks use replaceState, which doesn't fire this.
function bindHashChange(signal: AbortSignal) {
	window.addEventListener(
		"hashchange",
		() => {
			const next = hashTarget();
			if (next) scrollToSection(next, true);
		},
		{ signal }
	);
}

// A hash on first load can't be honoured natively, and it can't be pre-set
// before the smoother is created either: create() makes #smooth-wrapper fixed
// and rewrites body height, and that reflow clamps any scroll set beforehand.
// It also can't go in the same tick as paused(false) — unpausing writes
// mainST.progress and kills the scrub, and a scroll landing in that tick renders
// somewhere other than the value it reports, leaving ScrollTrigger evaluating a
// position that isn't on screen. One settle tick after resume, it's exact.
const RESUME_SETTLE = 0.2;

function jumpToHash() {
	const section = hashTarget();
	if (section) gsap.delayedCall(RESUME_SETTLE, () => scrollToSection(section, true));
}

// Delegated on <header> so the desktop nav and the mobile menu (which mounts and
// unmounts with the burger) are both covered by one listener.
function bindNavScroll(signal: AbortSignal) {
	const header = document.querySelector("header");
	if (!header) return;
	header.addEventListener(
		"click",
		(event) => {
			const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
			const id = anchor?.getAttribute("href")?.slice(1);
			const target = id ? document.getElementById(id) : null;
			if (!target) return;
			event.preventDefault();
			scrollToSection(target, true);
			history.replaceState(null, "", `#${id}`);
		},
		{ signal }
	);
}

// Stage progress = index of the stage section under the viewport top + fraction scrolled through it.
function bindProgress(scene: ParticleScene, smoother: ScrollSmoother | null, signal: AbortSignal) {
	let stages: { height: number; top: number }[] = [];
	const content = document.querySelector<HTMLElement>("#smooth-content");
	const scrollTop = () => (smoother ? smoother.scrollTop() : window.scrollY);
	// Measure against #smooth-content's own box rather than `rect.top + scrollTop()`:
	// that identity only holds once the smoother's transform has caught up, and nav
	// jumps are exactly a lagging-transform state. Both rects shift together under
	// the transform, so the difference is stable mid-animation.
	const measure = () => {
		const origin = content ? content.getBoundingClientRect().top : -scrollTop();
		stages = gsap.utils.toArray<HTMLElement>("[data-stage]").map((el) => {
			const rect = el.getBoundingClientRect();
			return { height: Math.max(1, rect.height), top: rect.top - origin };
		});
	};
	const tick = () => {
		const scroll = scrollTop();
		let idx = 0;
		for (let i = 1; i < stages.length; i += 1) {
			if ((stages[i]?.top ?? Number.POSITIVE_INFINITY) <= scroll + 1) idx = i;
		}
		const stage = stages[idx];
		scene.sectionProgress = stage ? idx + Math.abs((scroll - stage.top) / stage.height) : 0;
	};
	measure();
	window.addEventListener("resize", measure, { passive: true, signal });
	window.setTimeout(measure, 5000);
	gsap.ticker.add(tick);
	signal.addEventListener("abort", () => gsap.ticker.remove(tick));
}

function playIntro(reduced: boolean, scene: ParticleScene, onDone: () => void) {
	const loader = document.querySelector<HTMLElement>("#loader");
	const heroBits = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");
	const headline = document.querySelector<HTMLElement>("[data-hero-headline]");

	if (reduced) {
		loader?.remove();
		scene.enter(true);
		onDone();
		return;
	}

	const tl = gsap.timeline({ delay: 0.1 });
	if (loader) {
		const word = loader.querySelector<HTMLElement>(".loader-word");
		const count = loader.querySelector<HTMLElement>(".loader-count");
		const spinner = loader.querySelector<HTMLElement>(".loader-spinner");
		const meta = loader.querySelector<HTMLElement>(".loader-meta");
		const progress = { value: 0 };
		if (spinner) tl.from(spinner, { duration: 0.6, ease: "back.out(1.4)", scale: 0 });
		if (word) {
			const split = SplitText.create(word, { linesClass: "split-line", mask: "lines", type: "lines" });
			tl.from(split.lines, { duration: 1.2, ease: EASE_LONG, rotate: 2, stagger: 0.1, yPercent: 110 }, 0.15);
		}
		if (count) {
			tl.to(
				progress,
				{
					duration: 1.6,
					ease: "power2.inOut",
					onUpdate: () => {
						count.textContent = String(Math.round(progress.value)).padStart(3, "0");
					},
					value: 100,
				},
				0
			);
		}
		tl.to([word, meta], { duration: 0.7, ease: "expo.in", rotate: 2, stagger: 0.08, yPercent: -110 })
			.to(spinner, { duration: 0.4, ease: "power2.in", scale: 0 }, "<")
			.call(() => scene.enter(), undefined, "<")
			.to(loader, { duration: 0.7, ease: EASE_LONG, onComplete: () => loader.remove(), opacity: 0 });
	} else {
		tl.call(() => scene.enter());
	}
	if (headline) tl.add(revealChars(headline, false), loader ? "-=0.4" : 0);
	tl.from(heroBits, { duration: 1, ease: EASE, opacity: 0, stagger: 0.09, y: 28 }, "-=1.1").call(onDone);
}

function bindNavState() {
	const links = gsap.utils.toArray<HTMLElement>("header [data-section]");
	if (!links.length) return;
	const byId = new Map(links.map((l) => [l.dataset.section, l]));
	const clear = () => {
		for (const l of links) l.removeAttribute("aria-current");
	};
	for (const id of byId.keys()) {
		if (!id) continue;
		const activate = () => {
			clear();
			byId.get(id)?.setAttribute("aria-current", "true");
		};
		ScrollTrigger.create({ end: "bottom top", onEnter: activate, onEnterBack: activate, start: "top center", trigger: `#${id}` });
	}
}

function bindScrollEffects(signal: AbortSignal) {
	bindNavState();
	for (const el of gsap.utils.toArray<HTMLElement>("h2[data-reveal], h3[data-reveal]")) revealChars(el);
	for (const el of gsap.utils.toArray<HTMLElement>("p[data-reveal]")) revealLines(el);
	for (const el of gsap.utils.toArray<HTMLElement>("[data-fade]")) {
		gsap.from(el, { duration: 1.15, ease: EASE, opacity: 0, scrollTrigger: { start: "top 85%", trigger: el }, y: 34 });
	}
	for (const el of gsap.utils.toArray<HTMLElement>("[data-roll]")) letterBounce(el, signal);
}

export default function Experience() {
	useEffect(() => {
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const scene = new ParticleScene();
		const aborter = new AbortController();
		let smoother: ScrollSmoother | null = null;
		let cancelled = false;

		const ctx = gsap.context(() => {
			if (!reduced) {
				smoother = ScrollSmoother.create({ content: "#smooth-content", effects: false, smooth: 0.75, wrapper: "#smooth-wrapper" });
				smoother.paused(true);
			}
			playIntro(reduced, scene, () => {
				smoother?.paused(false);
				jumpToHash();
			});
			// Both outside the `reduced` guard — hash navigation needs offsetting
			// against the fixed header either way.
			bindNavScroll(aborter.signal);
			bindHashChange(aborter.signal);
			if (!reduced) bindScrollEffects(aborter.signal);
		});

		const canvas = document.querySelector<HTMLCanvasElement>("#gl");
		if (canvas) {
			document.fonts.ready
				.then(() => (cancelled ? undefined : scene.init(canvas)))
				.then(() => {
					if (!cancelled) ctx.add(() => bindProgress(scene, smoother, aborter.signal));
				})
				.catch(() => canvas.remove());
		}

		return () => {
			cancelled = true;
			aborter.abort();
			ctx.revert();
			smoother?.kill();
			scene.dispose();
		};
	}, []);

	return null;
}
