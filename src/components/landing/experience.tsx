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

// Stage progress = index of the stage section under the viewport top + fraction scrolled through it.
function bindProgress(scene: ParticleScene, smoother: ScrollSmoother | null, signal: AbortSignal) {
	let stages: { height: number; top: number }[] = [];
	const scrollTop = () => (smoother ? smoother.scrollTop() : window.scrollY);
	const measure = () => {
		const scroll = scrollTop();
		stages = gsap.utils.toArray<HTMLElement>("[data-stage]").map((el) => {
			const rect = el.getBoundingClientRect();
			return { height: Math.max(1, rect.height), top: rect.top + scroll };
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
			playIntro(reduced, scene, () => smoother?.paused(false));
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
