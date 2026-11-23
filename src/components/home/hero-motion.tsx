"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

// The photo lives in the bio slot. On load it's pulled back to the hero slot, and
// scrolling flies it home with a 3D tilt. Reduced motion: CSS just shows it in place.
export default function HeroMotion() {
	useEffect(() => {
		const timeline = document.querySelector<HTMLElement>(".timeline");
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			if (timeline) timeline.dataset.drawn = "true";
			return;
		}
		gsap.registerPlugin(ScrollTrigger);

		// Experience road draws itself in the first time it scrolls into view.
		const road = timeline
			? ScrollTrigger.create({ once: true, onEnter: () => (timeline.dataset.drawn = "true"), start: "top 75%", trigger: timeline })
			: null;

		const photo = document.querySelector<HTMLElement>(".bio-photo");
		const from = document.querySelector<HTMLElement>(".hero-photo-slot");
		const slot = photo?.parentElement;
		if (!photo || !from || !slot) return () => road?.kill();

		// Measure the untransformed slot, not the photo, so the delta is stable mid-tween.
		const delta = () => {
			const a = from.getBoundingClientRect();
			const b = slot.getBoundingClientRect();
			return { s: a.width / b.width, x: a.left + a.width / 2 - (b.left + b.width / 2), y: a.top + a.height / 2 - (b.top + b.height / 2) };
		};

		const ctx = gsap.context(() => {
			gsap.set(photo, { autoAlpha: 1, transformPerspective: 1000 });
			// Hand over from the static hero copy (same spot, same size) to the animated photo.
			gsap.set(from, { autoAlpha: 0 });
			gsap
				.timeline({ scrollTrigger: { end: "center center", endTrigger: slot, invalidateOnRefresh: true, scrub: 0.6, start: "top top", trigger: ".hero" } })
				.fromTo(photo, { scale: () => delta().s, x: () => delta().x, y: () => delta().y }, { duration: 1, ease: "none", scale: 1, x: 0, y: 0 }, 0)
				.to(photo, { duration: 0.5, ease: "sine.inOut", rotateX: 6, rotateY: -22 }, 0)
				.to(photo, { duration: 0.5, ease: "sine.inOut", rotateX: 0, rotateY: 0 }, 0.5);

			gsap.to(".hero-fade", {
				autoAlpha: 0,
				ease: "none",
				scrollTrigger: { end: "55% top", scrub: true, start: "top top", trigger: ".hero" },
				yPercent: -25,
			});
		});
		return () => {
			ctx.revert();
			road?.kill();
		};
	}, []);

	return null;
}
